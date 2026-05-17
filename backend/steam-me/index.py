import os
import json
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p23616630_cs2_skin_exchange")


def get_db():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    conn.autocommit = True
    return conn


def handler(event: dict, context) -> dict:
    """Получить текущего пользователя по session_id"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    headers = event.get("headers") or {}
    session_id = headers.get("X-Session-Id") or headers.get("x-session-id")

    # также пробуем из query string (при редиректе со Steam)
    params = event.get("queryStringParameters") or {}
    if not session_id:
        session_id = params.get("session")

    if not session_id:
        return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "No session"})}

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        f"""
        SELECT u.id, u.steam_id, u.username, u.avatar, u.avatar_full,
               u.profile_url, u.balance, u.role, u.created_at
        FROM {SCHEMA}.sessions s
        JOIN {SCHEMA}.users u ON u.id = s.user_id
        WHERE s.id = %s AND s.expires_at > NOW()
        """,
        (session_id,),
    )
    row = cur.fetchone()
    conn.close()

    if not row:
        return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "Invalid or expired session"})}

    user = {
        "id": row[0],
        "steam_id": row[1],
        "username": row[2],
        "avatar": row[3],
        "avatar_full": row[4],
        "profile_url": row[5],
        "balance": float(row[6]),
        "role": row[7],
        "created_at": str(row[8]),
    }

    return {"statusCode": 200, "headers": cors, "body": json.dumps({"user": user})}
