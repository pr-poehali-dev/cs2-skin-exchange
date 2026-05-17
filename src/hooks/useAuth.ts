import { useState, useEffect, useCallback } from "react";
import func2url from "../../backend/func2url.json";

export interface SteamUser {
  id: number;
  steam_id: string;
  username: string;
  avatar: string;
  avatar_full: string;
  profile_url: string;
  balance: number;
  role: string;
  created_at: string;
}

const SESSION_KEY = "sv_session";

export function useAuth() {
  const [user, setUser] = useState<SteamUser | null>(null);
  const [loading, setLoading] = useState(true);

  const getSessionId = () => localStorage.getItem(SESSION_KEY);

  const fetchMe = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(func2url["steam-me"], {
        headers: { "X-Session-Id": sessionId },
      });
      if (!res.ok) {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Проверяем session из URL (после редиректа со Steam)
    const params = new URLSearchParams(window.location.search);
    const sessionFromUrl = params.get("session");
    if (sessionFromUrl) {
      localStorage.setItem(SESSION_KEY, sessionFromUrl);
      // Чистим URL
      window.history.replaceState({}, "", window.location.pathname);
      fetchMe(sessionFromUrl);
      return;
    }

    const existing = getSessionId();
    if (existing) {
      fetchMe(existing);
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const loginWithSteam = () => {
    window.location.href = func2url["steam-auth"];
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return { user, loading, loginWithSteam, logout, getSessionId };
}
