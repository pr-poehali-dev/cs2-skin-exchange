import { useState } from "react";
import Icon from "@/components/ui/icon";

const rarityColors: Record<string, string> = {
  consumer: "#B0C3D9", industrial: "#5E98D9", milspec: "#4B69FF",
  restricted: "#8847FF", classified: "#D32CE6", covert: "#EB4B4B", gold: "#FFD700",
};
const rarityLabels: Record<string, string> = {
  consumer: "Ширпотреб", industrial: "Промышленное", milspec: "Армейское",
  restricted: "Запрещённое", classified: "Засекреченное", covert: "Тайное", gold: "★ Редкое спец.",
};

const SKINS = [
  { id: 1, name: "AK-47 | Asiimov", wear: "FT", price: 14200, rarity: "covert", category: "Rifle", float: 0.18 },
  { id: 2, name: "AWP | Medusa", wear: "MW", price: 145000, rarity: "covert", category: "Sniper", float: 0.09 },
  { id: 3, name: "Karambit | Doppler", wear: "FN", price: 65000, rarity: "gold", category: "Knife", float: 0.02 },
  { id: 4, name: "M4A4 | Neo-Noir", wear: "MW", price: 8900, rarity: "classified", category: "Rifle", float: 0.12 },
  { id: 5, name: "Glock | Fade", wear: "FN", price: 28500, rarity: "classified", category: "Pistol", float: 0.01 },
  { id: 6, name: "Desert Eagle | Blaze", wear: "FN", price: 19900, rarity: "classified", category: "Pistol", float: 0.03 },
  { id: 7, name: "M4A1-S | Printstream", wear: "MW", price: 22000, rarity: "covert", category: "Rifle", float: 0.08 },
  { id: 8, name: "AWP | Asiimov", wear: "BS", price: 9800, rarity: "covert", category: "Sniper", float: 0.52 },
  { id: 9, name: "Bayonet | Tiger Tooth", wear: "FN", price: 38000, rarity: "gold", category: "Knife", float: 0.01 },
  { id: 10, name: "USP-S | Kill Confirmed", wear: "MW", price: 12400, rarity: "covert", category: "Pistol", float: 0.11 },
  { id: 11, name: "AK-47 | Vulcan", wear: "FN", price: 31000, rarity: "classified", category: "Rifle", float: 0.04 },
  { id: 12, name: "P250 | See Ya Later", wear: "FT", price: 4200, rarity: "restricted", category: "Pistol", float: 0.22 },
];

const CATEGORIES = ["Все", "Rifle", "Pistol", "Sniper", "Knife", "SMG", "Gloves"];
const RARITIES = ["Все", "covert", "classified", "restricted", "milspec"];
const WEARS = ["Все", "FN", "MW", "FT", "WW", "BS"];

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [rarity, setRarity] = useState("Все");
  const [wear, setWear] = useState("Все");
  const [sortBy, setSortBy] = useState("price_desc");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const filtered = SKINS
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => category === "Все" || s.category === category)
    .filter(s => rarity === "Все" || s.rarity === rarity)
    .filter(s => wear === "Все" || s.wear === wear)
    .filter(s => !priceMin || s.price >= Number(priceMin))
    .filter(s => !priceMax || s.price <= Number(priceMax))
    .sort((a, b) => {
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "float_asc") return a.float - b.float;
      return 0;
    });

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-rajdhani text-5xl font-bold text-white mb-2">Каталог скинов</h1>
        <p className="text-muted-foreground">Найдено: <span className="text-neon-cyan font-semibold">{filtered.length}</span> скинов</p>
      </div>

      {/* Filters */}
      <div className="card-dark border rounded-lg p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full bg-secondary border border-border rounded pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50"
              placeholder="Поиск по названию..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Price */}
          <div className="flex gap-2">
            <input className="w-full bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50" placeholder="Цена от ₽" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
            <input className="w-full bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50" placeholder="до ₽" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
          </div>
          {/* Sort */}
          <select className="bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-neon-cyan/50" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="price_desc">Цена: высокая → низкая</option>
            <option value="price_asc">Цена: низкая → высокая</option>
            <option value="float_asc">Float: лучший</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded text-xs font-rajdhani font-semibold tracking-wider uppercase transition-all ${category === cat ? "neon-btn" : "bg-secondary text-muted-foreground border border-border hover:border-neon-cyan/30"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Rarity + Wear */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            {RARITIES.map(r => (
              <button key={r} onClick={() => setRarity(r)} className="px-3 py-1.5 rounded text-xs font-rajdhani font-semibold transition-all border" style={rarity === r ? { borderColor: r === "Все" ? "#00FFD1" : rarityColors[r], color: r === "Все" ? "#00FFD1" : rarityColors[r], background: r === "Все" ? "rgba(0,255,209,0.1)" : rarityColors[r] + "22" } : { borderColor: "rgba(255,255,255,0.08)", color: "#666" }}>
                {r === "Все" ? "Все редкости" : rarityLabels[r]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {WEARS.map(w => (
              <button key={w} onClick={() => setWear(w)} className={`px-3 py-1.5 rounded text-xs font-rajdhani font-semibold transition-all border ${wear === w ? "neon-btn" : "border-border text-muted-foreground hover:border-neon-cyan/30"}`}>
                {w === "Все" ? "Все износы" : w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-rajdhani text-xl">Скины не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((skin, i) => (
            <div key={skin.id} className="card-dark border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-up group" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="relative bg-gradient-to-br from-white/5 to-transparent h-36 flex items-center justify-center" style={{ borderBottom: `2px solid ${rarityColors[skin.rarity]}33` }}>
                <span className="text-5xl group-hover:scale-110 transition-transform">
                  {skin.category === "Knife" ? "🗡️" : skin.category === "Sniper" ? "🎯" : skin.category === "Pistol" ? "🔫" : "⚔️"}
                </span>
                <div className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded font-rajdhani font-semibold" style={{ background: rarityColors[skin.rarity] + "22", color: rarityColors[skin.rarity], border: `1px solid ${rarityColors[skin.rarity]}44` }}>
                  {skin.wear}
                </div>
              </div>
              <div className="p-3">
                <div className="text-xs mb-1 truncate font-semibold" style={{ color: rarityColors[skin.rarity] }}>{skin.name}</div>
                <div className="text-muted-foreground text-xs mb-2">Float: {skin.float.toFixed(2)}</div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-rajdhani font-bold text-base">{skin.price.toLocaleString()} ₽</span>
                </div>
                <button className="mt-2 w-full neon-btn py-1.5 text-xs font-rajdhani font-semibold tracking-wider uppercase rounded-sm">
                  Купить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
