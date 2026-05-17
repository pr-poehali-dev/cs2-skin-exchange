import os
import json
import secrets
import urllib.parse
import urllib.request
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p23616630_cs2_skin_exchange")
STEAM_API_KEY = os.environ.get("STEAM_API_KEY", "")
STEAM_OPENID_URL = "https://steamcommunity.com/openid/login"
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://poehali.dev")


def get_db():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    conn.autocommit = True
    return conn


def handler(event: dict, context) -> dict:
    """Steam OpenID авторизация: redirect и callback"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    path = event.get("requestContext", {}).get("path", "") or event.get("path", "")
    params = event.get("queryStringParameters") or {}

    # /steam-auth/ → редирект на Steam
    if not params.get("openid.mode"):
        return _redirect_to_steam(event, cors)

    # /steam-auth/?openid.mode=id_res → обратный вызов от Steam
    if params.get("openid.mode") == "id_res":
        return _handle_callback(params, cors)

    return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Invalid request"})}


def _get_return_url(event: dict) -> str:
    headers = event.get("headers") or {}
    host = headers.get("host") or headers.get("Host") or ""
    func_url = os.environ.get("FUNCTION_URL", "")
    if func_url:
        return func_url
    return f"https://{host}/steam-auth/"


def _redirect_to_steam(event: dict, cors: dict) -> dict:
    return_to = _get_return_url(event)
    params = {
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": return_to,
        "openid.realm": return_to.rsplit("/", 2)[0] + "/",
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    }
    redirect_url = STEAM_OPENID_URL + "?" + urllib.parse.urlencode(params)
    return {
        "statusCode": 302,
        "headers": {**cors, "Location": redirect_url},
        "body": "",
    }


def _verify_openid(params: dict) -> str | None:
    verify_params = dict(params)
    verify_params["openid.mode"] = "check_authentication"
    data = urllib.parse.urlencode(verify_params).encode()
    req = urllib.request.Request(STEAM_OPENID_URL, data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with urllib.request.urlopen(req, timeout=10) as resp:
        body = resp.read().decode()
    if "is_valid:true" not in body:
        return None
    claimed = params.get("openid.claimed_id", "")
    steam_id = claimed.split("/")[-1]
    if not steam_id.isdigit():
        return None
    return steam_id


def _get_steam_profile(steam_id: str) -> dict:
    url = (
        f"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
        f"?key={STEAM_API_KEY}&steamids={steam_id}"
    )
    with urllib.request.urlopen(url, timeout=10) as resp:
        data = json.loads(resp.read().decode())
    players = data.get("response", {}).get("players", [])
    if not players:
        return {}
    p = players[0]
    return {
        "steam_id": steam_id,
        "username": p.get("personaname", "Unknown"),
        "avatar": p.get("avatarmedium", ""),
        "avatar_full": p.get("avatarfull", ""),
        "profile_url": p.get("profileurl", ""),
    }


def _upsert_user(profile: dict) -> int:
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        f"""
        INSERT INTO {SCHEMA}.users (steam_id, username, avatar, avatar_full, profile_url)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (steam_id) DO UPDATE SET
            username = EXCLUDED.username,
            avatar = EXCLUDED.avatar,
            avatar_full = EXCLUDED.avatar_full,
            profile_url = EXCLUDED.profile_url,
            updated_at = NOW()
        RETURNING id
        """,
        (
            profile["steam_id"],
            profile["username"],
            profile["avatar"],
            profile["avatar_full"],
            profile["profile_url"],
        ),
    )
    user_id = cur.fetchone()[0]
    conn.close()
    return user_id


def _create_session(user_id: int) -> str:
    session_id = secrets.token_hex(32)
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.sessions (id, user_id) VALUES (%s, %s)",
        (session_id, user_id),
    )
    conn.close()
    return session_id


def _handle_callback(params: dict, cors: dict) -> dict:
    steam_id = _verify_openid(params)
    if not steam_id:
        return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "OpenID verification failed"})}

    profile = _get_steam_profile(steam_id)
    if not profile:
        return {"statusCode": 502, "headers": cors, "body": json.dumps({"error": "Steam profile not found"})}

    user_id = _upsert_user(profile)
    session_id = _create_session(user_id)

    # Редиректим на фронтенд с сессией
    frontend = os.environ.get("FRONTEND_URL", "https://poehali.dev")
    redirect_url = f"{frontend}?session={session_id}"

    return {
        "statusCode": 302,
        "headers": {
            **cors,
            "Location": redirect_url,
            "X-Set-Cookie": f"session_id={session_id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000",
        },
        "body": "",
    }
