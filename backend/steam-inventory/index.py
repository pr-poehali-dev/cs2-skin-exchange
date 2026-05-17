import os
import json
import urllib.request
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p23616630_cs2_skin_exchange")
STEAM_API_KEY = os.environ.get("STEAM_API_KEY", "")

# CS2 App ID
CS2_APP_ID = 730
CS2_CONTEXT_ID = 2

RARITY_MAP = {
    "Rarity_Common": "consumer",
    "Rarity_Uncommon": "industrial",
    "Rarity_Rare": "milspec",
    "Rarity_Mythical": "restricted",
    "Rarity_Legendary": "classified",
    "Rarity_Ancient": "covert",
    "Rarity_Immortal": "gold",
}

WEAR_MAP = {
    "Factory New": "FN",
    "Minimal Wear": "MW",
    "Field-Tested": "FT",
    "Well-Worn": "WW",
    "Battle-Scarred": "BS",
}


def get_db():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    conn.autocommit = True
    return conn


def get_session_user(session_id: str):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        f"""
        SELECT u.id, u.steam_id FROM {SCHEMA}.sessions s
        JOIN {SCHEMA}.users u ON u.id = s.user_id
        WHERE s.id = %s AND s.expires_at > NOW()
        """,
        (session_id,),
    )
    row = cur.fetchone()
    conn.close()
    return row


def handler(event: dict, context) -> dict:
    """Получить инвентарь CS2 пользователя из Steam"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    headers = event.get("headers") or {}
    session_id = headers.get("X-Session-Id") or headers.get("x-session-id")

    if not session_id:
        return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "No session"})}

    row = get_session_user(session_id)
    if not row:
        return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "Invalid session"})}

    user_id, steam_id = row

    url = (
        f"https://steamcommunity.com/inventory/{steam_id}/{CS2_APP_ID}/{CS2_CONTEXT_ID}"
        f"?l=russian&count=100"
    )

    req = urllib.request.Request(url)
    req.add_header("User-Agent", "Mozilla/5.0")

    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode())

    if not data.get("success"):
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"items": [], "total": 0})}

    assets = {a["assetid"]: a for a in data.get("assets", [])}
    descriptions = {(d["classid"], d["instanceid"]): d for d in data.get("descriptions", [])}

    items = []
    for asset_id, asset in assets.items():
        desc = descriptions.get((asset["classid"], asset["instanceid"]))
        if not desc:
            continue
        if not desc.get("marketable"):
            continue

        name = desc.get("market_name") or desc.get("name", "Unknown")
        icon = desc.get("icon_url", "")
        icon_url = f"https://community.cloudflare.steamstatic.com/economy/image/{icon}" if icon else ""

        # Извлекаем wear и float из tags/descriptions
        wear = ""
        rarity = "consumer"
        category = ""
        float_val = None

        for tag in desc.get("tags", []):
            cat = tag.get("category", "")
            if cat == "Exterior":
                wear_full = tag.get("localized_tag_name") or tag.get("internal_name", "")
                wear = WEAR_MAP.get(wear_full, wear_full[:2].upper())
            elif cat == "Rarity":
                rarity_key = tag.get("internal_name", "")
                rarity = RARITY_MAP.get(rarity_key, "consumer")
            elif cat == "Type":
                category = tag.get("localized_tag_name") or tag.get("internal_name", "")

        # Float из descriptions
        for d in desc.get("descriptions", []):
            val = d.get("value", "")
            if "Float Value" in val or "float" in val.lower():
                parts = val.split(":")
                if len(parts) > 1:
                    try:
                        float_val = float(parts[-1].strip().split()[0])
                    except Exception:
                        pass

        items.append({
            "asset_id": asset_id,
            "name": name,
            "icon_url": icon_url,
            "wear": wear,
            "rarity": rarity,
            "category": category,
            "float": float_val,
            "tradable": bool(desc.get("tradable")),
            "marketable": bool(desc.get("marketable")),
        })

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"items": items, "total": len(items), "steam_id": steam_id}),
    }
