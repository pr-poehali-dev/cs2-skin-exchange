CREATE TABLE IF NOT EXISTS t_p23616630_cs2_skin_exchange.users (
    id SERIAL PRIMARY KEY,
    steam_id VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(128) NOT NULL,
    avatar VARCHAR(512),
    avatar_full VARCHAR(512),
    profile_url VARCHAR(512),
    balance NUMERIC(12,2) DEFAULT 0,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p23616630_cs2_skin_exchange.sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id INTEGER REFERENCES t_p23616630_cs2_skin_exchange.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON t_p23616630_cs2_skin_exchange.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON t_p23616630_cs2_skin_exchange.sessions(expires_at);
