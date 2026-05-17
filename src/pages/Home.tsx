import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const TICKER_TRADES = [
  { user: "Phantom_X", item: "AK-47 | Asiimov", price: "14 200 ₽", type: "buy" },
  { user: "ShadowBlade", item: "AWP | Dragon Lore", price: "380 000 ₽", type: "sell" },
  { user: "N1ghtfall", item: "M4A4 | Howl", price: "220 000 ₽", type: "buy" },
  { user: "ZeroTrace", item: "Karambit | Doppler", price: "65 000 ₽", type: "sell" },
  { user: "CryptoKill", item: "Glock | Fade", price: "28 500 ₽", type: "buy" },
  { user: "VoidRunner", item: "Desert Eagle | Blaze", price: "19 900 ₽", type: "sell" },
  { user: "DataStrike", item: "AWP | Medusa", price: "145 000 ₽", type: "buy" },
];

const HOT_SKINS = [
  { id: 1, name: "AK-47 | Asiimov", wear: "FT", price: 14200, change: +12.4, rarity: "covert", category: "Rifle" },
  { id: 2, name: "AWP | Medusa", wear: "MW", price: 145000, change: -3.2, rarity: "covert", category: "Sniper" },
  { id: 3, name: "Karambit | Doppler", wear: "FN", price: 65000, change: +8.7, rarity: "gold", category: "Knife" },
  { id: 4, name: "M4A4 | Neo-Noir", wear: "MW", price: 8900, change: +2.1, rarity: "classified", category: "Rifle" },
  { id: 5, name: "Glock | Fade", wear: "FN", price: 28500, change: +5.3, rarity: "classified", category: "Pistol" },
  { id: 6, name: "Desert Eagle | Blaze", wear: "FN", price: 19900, change: -1.8, rarity: "classified", category: "Pistol" },
];

const STATS = [
  { label: "Скинов в каталоге", value: "48 291", icon: "Layers" },
  { label: "Сделок сегодня", value: "1 847", icon: "ArrowLeftRight" },
  { label: "Онлайн трейдеров", value: "3 412", icon: "Users" },
  { label: "Оборот за месяц", value: "₽ 42.8М", icon: "TrendingUp" },
];

const rarityColors: Record<string, string> = {
  consumer: "#B0C3D9", industrial: "#5E98D9", milspec: "#4B69FF",
  restricted: "#8847FF", classified: "#D32CE6", covert: "#EB4B4B", gold: "#FFD700",
};

export default function Home({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-cyan/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-purple/5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6 animate-fade-up">
              <div className="h-px w-12 bg-neon-cyan" />
              <span className="text-neon-cyan text-sm font-rajdhani tracking-widest uppercase font-semibold">
                CS2 Trade Platform
              </span>
            </div>
            
            <h1 className="font-rajdhani text-7xl md:text-9xl font-bold leading-none mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <span className="text-white">SKIN</span>
              <br />
              <span className="neon-text-cyan">VAULT</span>
            </h1>
            
            <p className="text-muted-foreground text-xl md:text-2xl font-exo max-w-2xl mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Торгуй скинами быстро и безопасно. <br />
              <span className="text-white/70">Лучшие цены, мгновенный обмен, честная статистика.</span>
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <button onClick={() => onNavigate("catalog")} className="neon-btn px-8 py-4 font-rajdhani font-bold text-xl tracking-wider uppercase rounded-sm">
                Открыть каталог
              </button>
              <button onClick={() => onNavigate("inventory")} className="neon-btn-purple px-8 py-4 font-rajdhani font-bold text-xl tracking-wider uppercase rounded-sm">
                Мой инвентарь
              </button>
            </div>
          </div>
        </div>

        {/* Floating skin card */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block animate-float">
          <div className="card-dark rounded-lg p-6 w-64 neon-border-cyan border">
            <div className="bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 rounded h-40 mb-4 flex items-center justify-center">
              <span className="text-6xl">🔫</span>
            </div>
            <div className="rarity-gold text-xs font-rajdhani tracking-widest uppercase mb-1">★ COVERT KNIFE</div>
            <div className="text-white font-rajdhani font-bold text-lg">Karambit | Doppler</div>
            <div className="text-muted-foreground text-sm mb-3">Factory New · Phase 4</div>
            <div className="flex items-center justify-between">
              <span className="neon-text-cyan font-rajdhani font-bold text-2xl">65 000 ₽</span>
              <span className="text-green-400 text-sm">+8.7%</span>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE TICKER */}
      <div className="border-y border-neon-cyan/20 bg-background/80 py-3 overflow-hidden relative">
        <div className="flex gap-12 animate-ticker whitespace-nowrap">
          {[...TICKER_TRADES, ...TICKER_TRADES].map((trade, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-exo shrink-0">
              <span className={trade.type === "buy" ? "text-green-400" : "text-red-400"}>
                {trade.type === "buy" ? "▲" : "▼"}
              </span>
              <span className="text-muted-foreground">{trade.user}</span>
              <span className="text-white">{trade.item}</span>
              <span className="neon-text-cyan font-semibold">{trade.price}</span>
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="card-dark rounded-lg p-6 border animate-fade-up group" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded bg-neon-cyan/10 group-hover:bg-neon-cyan/20 transition-colors">
                  <Icon name={stat.icon} fallback="Star" size={20} className="text-neon-cyan" />
                </div>
              </div>
              <div className="text-3xl font-rajdhani font-bold text-white mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOT SKINS */}
      <section className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse-neon" />
              <span className="text-neon-red text-sm font-rajdhani tracking-widest uppercase font-semibold">Live</span>
            </div>
            <h2 className="font-rajdhani text-4xl font-bold text-white">Горячие скины</h2>
          </div>
          <button onClick={() => onNavigate("catalog")} className="neon-btn px-5 py-2 font-rajdhani font-semibold text-sm tracking-wider uppercase rounded-sm">
            Весь каталог →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {HOT_SKINS.map((skin, i) => (
            <div
              key={skin.id}
              className="card-dark border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="relative bg-gradient-to-br from-white/5 to-transparent h-32 flex items-center justify-center">
                <span className="text-4xl">{skin.category === "Knife" ? "🗡️" : skin.category === "Sniper" ? "🎯" : "🔫"}</span>
                <div className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded font-rajdhani" style={{ background: rarityColors[skin.rarity] + "22", color: rarityColors[skin.rarity], border: `1px solid ${rarityColors[skin.rarity]}44` }}>
                  {skin.wear}
                </div>
              </div>
              <div className="p-3">
                <div className="text-xs mb-1 truncate" style={{ color: rarityColors[skin.rarity] }}>{skin.name}</div>
                <div className="text-white font-rajdhani font-bold text-lg leading-none">{skin.price.toLocaleString()} ₽</div>
                <div className={`text-xs mt-1 ${skin.change > 0 ? "text-green-400" : "text-red-400"}`}>
                  {skin.change > 0 ? "+" : ""}{skin.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-16">
        <div className="card-dark border neon-border-cyan rounded-xl p-10 text-center relative overflow-hidden scanline">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-purple/5" />
          <div className="relative">
            <h2 className="font-rajdhani text-5xl font-bold text-white mb-4">Начни торговать прямо сейчас</h2>
            <p className="text-muted-foreground text-lg mb-8">Войди через Steam и получи доступ к своему инвентарю мгновенно</p>
            <button className="neon-btn px-10 py-5 font-rajdhani font-bold text-2xl tracking-wider uppercase rounded-sm inline-flex items-center gap-3">
              <Icon name="LogIn" size={24} />
              Войти через Steam
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}