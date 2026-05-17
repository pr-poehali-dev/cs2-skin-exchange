import { useState } from "react";
import Icon from "@/components/ui/icon";

const rarityColors: Record<string, string> = {
  consumer: "#B0C3D9", industrial: "#5E98D9", milspec: "#4B69FF",
  restricted: "#8847FF", classified: "#D32CE6", covert: "#EB4B4B", gold: "#FFD700",
};

const INVENTORY = [
  { id: 1, name: "AK-47 | Redline", wear: "FT", price: 3200, rarity: "classified", selected: false, tradable: true, float: 0.24 },
  { id: 2, name: "M4A4 | Neo-Noir", wear: "MW", price: 8900, rarity: "classified", selected: false, tradable: true, float: 0.12 },
  { id: 3, name: "AWP | Asiimov", wear: "FT", price: 11200, rarity: "covert", selected: false, tradable: false, float: 0.18 },
  { id: 4, name: "Glock | Fade", wear: "FN", price: 28500, rarity: "classified", selected: false, tradable: true, float: 0.01 },
  { id: 5, name: "Desert Eagle | Printstream", wear: "FN", price: 14800, rarity: "covert", selected: false, tradable: true, float: 0.03 },
  { id: 6, name: "P250 | Asiimov", wear: "FT", price: 980, rarity: "milspec", selected: false, tradable: true, float: 0.31 },
  { id: 7, name: "MP9 | Hydra", wear: "FN", price: 2400, rarity: "classified", selected: false, tradable: true, float: 0.05 },
  { id: 8, name: "AUG | Chameleon", wear: "MW", price: 520, rarity: "restricted", selected: false, tradable: false, float: 0.14 },
];

export default function Inventory() {
  const [items, setItems] = useState(INVENTORY);
  const [filter, setFilter] = useState("all");

  const toggleSelect = (id: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const selectedItems = items.filter(i => i.selected);
  const totalSelected = selectedItems.reduce((sum, i) => sum + i.price, 0);
  const totalInventory = items.reduce((sum, i) => sum + i.price, 0);

  const filtered = items.filter(i => {
    if (filter === "tradable") return i.tradable;
    if (filter === "locked") return !i.tradable;
    return true;
  });

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-rajdhani text-5xl font-bold text-white mb-2">Мой инвентарь</h1>
          <p className="text-muted-foreground">
            Синхронизировано со Steam · <span className="text-neon-cyan">{items.length} предметов</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-muted-foreground text-sm">Общая стоимость</div>
            <div className="font-rajdhani text-2xl font-bold text-white">{totalInventory.toLocaleString()} ₽</div>
          </div>
          <button className="neon-btn px-5 py-2.5 font-rajdhani font-semibold tracking-wider uppercase rounded-sm inline-flex items-center gap-2">
            <Icon name="RefreshCw" size={16} />
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
            <span className="neon-text-cyan font-rajdhani font-bold text-lg">{totalSelected.toLocaleString()} ₽</span>
          </div>
          <div className="flex gap-3">
            <button className="neon-btn-purple px-5 py-2 font-rajdhani font-semibold tracking-wider uppercase rounded-sm text-sm">
              Выставить на продажу
            </button>
            <button className="px-5 py-2 font-rajdhani font-semibold tracking-wider uppercase rounded-sm text-sm border border-border text-muted-foreground hover:border-neon-cyan/30 transition-all">
              Снять выбор
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            onClick={() => toggleSelect(item.id)}
            className={`card-dark border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 animate-fade-up ${item.selected ? "neon-border-purple scale-105" : "hover:border-neon-cyan/30"}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="relative bg-gradient-to-br from-white/5 to-transparent h-32 flex items-center justify-center" style={{ borderBottom: `2px solid ${rarityColors[item.rarity]}33` }}>
              <span className="text-4xl">{item.rarity === "gold" ? "🗡️" : item.rarity === "covert" ? "🔫" : "⚔️"}</span>
              {item.selected && (
                <div className="absolute inset-0 flex items-center justify-center bg-neon-purple/20">
                  <Icon name="Check" size={32} className="text-neon-purple" />
                </div>
              )}
              {!item.tradable && (
                <div className="absolute bottom-1 left-1 bg-red-900/80 rounded px-1.5 py-0.5 text-xs text-red-400 flex items-center gap-1">
                  <Icon name="Lock" size={10} />
                  <span>Заблок.</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="text-xs mb-0.5 truncate font-semibold" style={{ color: rarityColors[item.rarity] }}>{item.name}</div>
              <div className="text-muted-foreground text-xs mb-1">{item.wear} · {item.float.toFixed(2)}</div>
              <div className="text-white font-rajdhani font-bold text-sm">{item.price.toLocaleString()} ₽</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
