import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { SteamUser } from "@/hooks/useAuth";
import { useInventory } from "@/hooks/useInventory";

const rarityColors: Record<string, string> = {
  consumer: "#B0C3D9", industrial: "#5E98D9", milspec: "#4B69FF",
  restricted: "#8847FF", classified: "#D32CE6", covert: "#EB4B4B", gold: "#FFD700",
};

interface Props {
  user: SteamUser | null;
  onLogin: () => void;
  getSessionId: () => string | null;
}

export default function Inventory({ user, onLogin, getSessionId }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");
  const { items, loading, error, loaded, fetchInventory } = useInventory(getSessionId);

  useEffect(() => {
    if (user && !loaded) {
      fetchInventory();
    }
  }, [user, loaded, fetchInventory]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const selectedItems = items.filter(i => selected.has(i.asset_id));

  const filtered = items.filter(i => {
    if (filter === "tradable") return i.tradable;
    if (filter === "locked") return !i.tradable;
    return true;
  });

  // Не авторизован
  if (!user) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6">🎮</div>
        <h1 className="font-rajdhani text-5xl font-bold text-white mb-4">Мой инвентарь</h1>
        <p className="text-muted-foreground text-lg mb-8">Войди через Steam, чтобы увидеть свои скины</p>
        <button onClick={onLogin} className="neon-btn px-10 py-4 font-rajdhani font-bold text-xl tracking-wider uppercase rounded-sm inline-flex items-center gap-3">
          <Icon name="LogIn" size={22} />
          Войти через Steam
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-rajdhani text-5xl font-bold text-white mb-2">Мой инвентарь</h1>
          <p className="text-muted-foreground">
            {loaded
              ? <><span className="text-neon-cyan">{items.length} предметов</span> · Steam CS2</>
              : "Загружаем инвентарь из Steam..."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <img src={user.avatar} alt="" className="w-7 h-7 rounded-full border border-neon-cyan/40" />
              <span className="text-sm text-white/70">{user.username}</span>
            </div>
          )}
          <button
            onClick={fetchInventory}
            disabled={loading}
            className="neon-btn px-5 py-2.5 font-rajdhani font-semibold tracking-wider uppercase rounded-sm inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Icon name="RefreshCw" size={16} className={loading ? "animate-spin" : ""} />
            Обновить
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {[
          { key: "all", label: "Все предметы" },
          { key: "tradable", label: "Доступны к обмену" },
          { key: "locked", label: "На блокировке" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded text-sm font-rajdhani font-semibold tracking-wide transition-all border ${filter === f.key ? "neon-btn" : "border-border text-muted-foreground hover:border-neon-cyan/30"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Selection bar */}
      {selectedItems.length > 0 && (
        <div className="card-dark border neon-border-purple rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-4 animate-slide-in">
          <div className="flex items-center gap-3">
            <Icon name="CheckSquare" size={20} className="text-neon-purple" />
            <span className="font-rajdhani font-semibold text-white">Выбрано: {selectedItems.length} предметов</span>
          </div>
          <div className="flex gap-3">
            <button className="neon-btn-purple px-5 py-2 font-rajdhani font-semibold tracking-wider uppercase rounded-sm text-sm">
              Выставить на продажу
            </button>
            <button onClick={() => setSelected(new Set())} className="px-5 py-2 font-rajdhani font-semibold tracking-wider uppercase rounded-sm text-sm border border-border text-muted-foreground hover:border-neon-cyan/30 transition-all">
              Снять выбор
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card-dark border rounded-lg overflow-hidden animate-pulse">
              <div className="h-32 bg-white/5" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-16">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-red-400 opacity-60" />
          <p className="text-red-400 font-rajdhani text-xl mb-2">Ошибка загрузки</p>
          <p className="text-muted-foreground text-sm mb-6">{error}</p>
          <p className="text-muted-foreground text-xs mb-6">Убедись, что инвентарь CS2 открыт в настройках Steam</p>
          <button onClick={fetchInventory} className="neon-btn px-6 py-2.5 font-rajdhani font-semibold tracking-wider uppercase rounded-sm">
            Попробовать снова
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && loaded && filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="Package" size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-rajdhani text-xl">Инвентарь пуст</p>
          <p className="text-sm mt-2">Убедись, что инвентарь CS2 открыт в настройках профиля Steam</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((item, i) => {
            const isSelected = selected.has(item.asset_id);
            const color = rarityColors[item.rarity] || "#B0C3D9";
            return (
              <div
                key={item.asset_id}
                onClick={() => toggleSelect(item.asset_id)}
                className={`card-dark border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 animate-fade-up ${isSelected ? "neon-border-purple scale-105" : "hover:border-neon-cyan/30"}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="relative bg-gradient-to-br from-white/5 to-transparent h-32 flex items-center justify-center" style={{ borderBottom: `2px solid ${color}33` }}>
                  {item.icon_url ? (
                    <img src={item.icon_url} alt={item.name} className="h-24 w-full object-contain px-2" />
                  ) : (
                    <span className="text-4xl">🔫</span>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neon-purple/20">
                      <Icon name="Check" size={32} className="text-neon-purple" />
                    </div>
                  )}
                  {item.wear && (
                    <div className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded font-rajdhani font-semibold" style={{ background: color + "22", color, border: `1px solid ${color}44` }}>
                      {item.wear}
                    </div>
                  )}
                  {!item.tradable && (
                    <div className="absolute bottom-1 left-1 bg-red-900/80 rounded px-1.5 py-0.5 text-xs text-red-400 flex items-center gap-1">
                      <Icon name="Lock" size={10} />
                      <span>Блок.</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-xs mb-0.5 truncate font-semibold" style={{ color }}>{item.name}</div>
                  {item.float !== null && (
                    <div className="text-muted-foreground text-xs">Float: {item.float.toFixed(4)}</div>
                  )}
                  {item.category && (
                    <div className="text-muted-foreground text-xs">{item.category}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}