import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SteamUser } from "@/hooks/useAuth";

const TRADES = [
  { id: "TRD-8821", date: "17 мая 2026, 14:32", type: "sell", items: ["AK-47 | Asiimov FT"], amount: 14200, status: "completed", partner: "ShadowBlade_CS" },
  { id: "TRD-8820", date: "17 мая 2026, 11:14", type: "buy", items: ["Glock | Fade FN"], amount: 28500, status: "completed", partner: "PhantomX_trade" },
  { id: "TRD-8819", date: "16 мая 2026, 22:05", type: "exchange", items: ["M4A4 Neo-Noir MW", "P250 Asiimov FT"], amount: 9800, status: "completed", partner: "NightRunner99" },
  { id: "TRD-8818", date: "16 мая 2026, 18:47", type: "sell", items: ["AWP | Asiimov BS"], amount: 9800, status: "cancelled", partner: "ZeroPoint_77" },
  { id: "TRD-8817", date: "15 мая 2026, 09:20", type: "buy", items: ["Desert Eagle | Printstream FN"], amount: 14800, status: "completed", partner: "DataKiller_x" },
  { id: "TRD-8816", date: "14 мая 2026, 16:33", type: "exchange", items: ["MP9 | Hydra FN", "AUG | Chameleon MW"], amount: 2400, status: "pending", partner: "Ghostframe_1" },
  { id: "TRD-8815", date: "13 мая 2026, 20:11", type: "sell", items: ["Karambit | Doppler FN"], amount: 65000, status: "completed", partner: "VoidStrike" },
];

const STATS = [
  { label: "Всего сделок", value: "247", icon: "ArrowLeftRight" },
  { label: "Куплено", value: "₽ 284 000", icon: "ShoppingCart" },
  { label: "Продано", value: "₽ 412 000", icon: "TrendingUp" },
  { label: "Прибыль", value: "+ ₽ 128 000", icon: "DollarSign", positive: true },
];

const statusConfig = {
  completed: { label: "Выполнен", color: "#00FFD1", bg: "rgba(0,255,209,0.1)" },
  pending: { label: "В ожидании", color: "#FFD700", bg: "rgba(255,215,0,0.1)" },
  cancelled: { label: "Отменён", color: "#FF2052", bg: "rgba(255,32,82,0.1)" },
};

const typeConfig = {
  buy: { label: "Покупка", color: "#00FFD1", icon: "ArrowDownLeft" },
  sell: { label: "Продажа", color: "#BF00FF", icon: "ArrowUpRight" },
  exchange: { label: "Обмен", color: "#FF6B00", icon: "ArrowLeftRight" },
};

export default function Trades({ user, onLogin }: { user: SteamUser | null; onLogin: () => void }) {
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6">📋</div>
        <h1 className="font-rajdhani text-5xl font-bold text-white mb-4">История трейдов</h1>
        <p className="text-muted-foreground text-lg mb-8">Войди через Steam, чтобы увидеть свою историю сделок</p>
        <button onClick={onLogin} className="neon-btn px-10 py-4 font-rajdhani font-bold text-xl tracking-wider uppercase rounded-sm inline-flex items-center gap-3">
          <Icon name="LogIn" size={22} />
          Войти через Steam
        </button>
      </div>
    );
  }

  const filtered = TRADES.filter(t => {
    if (filter === "buy") return t.type === "buy";
    if (filter === "sell") return t.type === "sell";
    if (filter === "exchange") return t.type === "exchange";
    if (filter === "pending") return t.status === "pending";
    return true;
  });

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-rajdhani text-5xl font-bold text-white mb-2">История трейдов</h1>
        <p className="text-muted-foreground">Все операции по вашему аккаунту</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="card-dark border rounded-lg p-5 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded bg-neon-cyan/10">
                <Icon name={stat.icon} fallback="Star" size={18} className="text-neon-cyan" />
              </div>
              <span className="text-muted-foreground text-sm">{stat.label}</span>
            </div>
            <div className={`font-rajdhani text-2xl font-bold ${stat.positive ? "text-green-400" : "text-white"}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-dark border rounded-lg p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "Все" },
            { key: "buy", label: "Покупки" },
            { key: "sell", label: "Продажи" },
            { key: "exchange", label: "Обмены" },
            { key: "pending", label: "В ожидании" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded text-sm font-rajdhani font-semibold tracking-wide transition-all border ${filter === f.key ? "neon-btn" : "border-border text-muted-foreground hover:border-neon-cyan/30"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <select className="bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-neon-cyan/50" value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option value="all">Всё время</option>
            <option value="week">За неделю</option>
            <option value="month">За месяц</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-dark border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase">ID / Дата</th>
              <th className="text-left p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase">Тип</th>
              <th className="text-left p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase hidden md:table-cell">Предметы</th>
              <th className="text-left p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase hidden lg:table-cell">Партнёр</th>
              <th className="text-right p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase">Сумма</th>
              <th className="text-right p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((trade, i) => {
              const tc = typeConfig[trade.type as keyof typeof typeConfig];
              const sc = statusConfig[trade.status as keyof typeof statusConfig];
              return (
                <tr key={trade.id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <td className="p-4">
                    <div className="text-neon-cyan font-rajdhani font-semibold text-sm">{trade.id}</div>
                    <div className="text-muted-foreground text-xs">{trade.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Icon name={tc.icon} fallback="Star" size={16} style={{ color: tc.color }} />
                      <span className="font-rajdhani font-semibold text-sm" style={{ color: tc.color }}>{tc.label}</span>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="text-sm text-white/80">{trade.items.join(", ")}</div>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="text-sm text-muted-foreground">{trade.partner}</div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-rajdhani font-bold text-white">{trade.amount.toLocaleString()} ₽</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="px-2.5 py-1 rounded text-xs font-rajdhani font-semibold" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}33` }}>
                      {sc.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}