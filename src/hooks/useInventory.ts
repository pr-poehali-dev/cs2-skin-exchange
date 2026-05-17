import { useState, useCallback } from "react";
import func2url from "../../backend/func2url.json";

export interface InventoryItem {
  asset_id: string;
  name: string;
  icon_url: string;
  wear: string;
  rarity: string;
  category: string;
  float: number | null;
  tradable: boolean;
  marketable: boolean;
}

export function useInventory(getSessionId: () => string | null) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const fetchInventory = useCallback(async () => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(func2url["steam-inventory"], {
        headers: { "X-Session-Id": sessionId },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка загрузки инвентаря");
        return;
      }
      setItems(data.items || []);
      setLoaded(true);
    } catch {
      setError("Не удалось загрузить инвентарь");
    } finally {
      setLoading(false);
    }
  }, [getSessionId]);

  return { items, loading, error, loaded, fetchInventory };
}
