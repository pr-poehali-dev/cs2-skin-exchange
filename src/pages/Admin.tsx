import { useState } from "react";
import Icon from "@/components/ui/icon";

const BOTS = [
  { id: 1, name: "TradeBot #1", status: "online", trades: 142, balance: 85000, items: 234 },
  { id: 2, name: "TradeBot #2", status: "online", trades: 98, balance: 62000, items: 187 },
  { id: 3, name: "TradeBot #3", status: "offline", trades: 0, balance: 45000, items: 156 },
  { id: 4, name: "TradeBot #4", status: "busy", trades: 3, balance: 120000, items: 412 },
];

const USERS = [
  { id: 1, name: "PhantomX_pro", steam: "STEAM_0:1:88241999", deals: 247, volume: 412000, status: "active", joined: "2023" },
  { id: 2, name: "ShadowBlade", steam: "STEAM_0:0:55441823", deals: 189, volume: 280000, status: "active", joined: "2023" },
  { id: 3, name: "NightRunner99", steam: "STEAM_0:1:11209944", deals: 62, volume: 95000, status: "banned", joined: "2024" },
  { id: 4, name: "DataKiller_x", steam: "STEAM_0:0:77712233", deals: 445, volume: 780000, status: "active", joined: "2022" },
  { id: 5, name: "ZeroPoint_77", steam: "STEAM_0:1:44882901", deals: 12, volume: 18000, status: "suspended", joined: "2025" },
];

const OVERVIEW = [
  { label: "Оборот сегодня", value: "₽ 284 100", sub: "+12% к вчера", icon: "TrendingUp", color: "#00FFD1" },
  { label: "Оборот за месяц", value: "₽ 42.8 М", sub: "Апрель: ₽ 38.2М", icon: "BarChart3", color: "#BF00FF" },
  { label: "Активных пользователей", value: "3 412", sub: "Онлайн сейчас", icon: "Users", color: "#00FFD1" },
  { label: "Сделок сегодня", value: "1 847", sub: "Успешных: 1 821", icon: "ArrowLeftRight", color: "#FFD700" },
  { label: "Комиссия сегодня", value: "₽ 14 205", sub: "Ставка: 5%", icon: "Percent", color: "#00FFD1" },
  { label: "Активных ботов", value: "3 / 4", sub: "1 оффлайн", icon: "Bot", color: "#FF6B00" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  online: { label: "Онлайн", color: "#00FFD1", bg: "rgba(0,255,209,0.1)" },
  offline: { label: "Оффлайн", color: "#666", bg: "rgba(100,100,100,0.1)" },
  busy: { label: "Занят", color: "#FFD700", bg: "rgba(255,215,0,0.1)" },
  active: { label: "Активен", color: "#00FFD1", bg: "rgba(0,255,209,0.1)" },
  banned: { label: "Забанен", color: "#FF2052", bg: "rgba(255,32,82,0.1)" },
  suspended: { label: "Заморожен", color: "#FFD700", bg: "rgba(255,215,0,0.1)" },
};

export default function Admin() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-lg bg-neon-red/10 border border-neon-red/30">
          <Icon name="ShieldAlert" size={28} className="text-neon-red" />
        </div>
        <div>
          <h1 className="font-rajdhani text-5xl font-bold text-white">Панель администратора</h1>
          <p className="text-muted-foreground">Управление платформой · Доступ ограничен</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
        {[
          { key: "overview", label: "Обзор", icon: "LayoutDashboard" },
          { key: "bots", label: "Боты", icon: "Bot" },
          { key: "users", label: "Пользователи", icon: "Users" },
          { key: "catalog", label: "Каталог", icon: "Layers" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-5 py-2.5 rounded text-sm font-rajdhani font-semibold tracking-wide transition-all border ${tab === t.key ? "neon-btn" : "border-border text-muted-foreground hover:border-neon-cyan/30"}`}>
            <Icon name={t.icon} fallback="Star" size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {OVERVIEW.map((stat, i) => (
              <div key={stat.label} className="card-dark border rounded-lg p-5 animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded" style={{ background: stat.color + "15" }}>
                    <Icon name={stat.icon} fallback="Star" size={20} style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="font-rajdhani text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-xs mb-0.5">{stat.label}</div>
                <div className="text-xs" style={{ color: stat.color }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart placeholder */}
          <div className="card-dark border rounded-xl p-6">
            <h2 className="font-rajdhani text-2xl font-bold text-white mb-4">Оборот за 30 дней (₽)</h2>
            <div className="flex items-end gap-2 h-40">
              {[38, 42, 31, 55, 48, 62, 58, 71, 65, 80, 74, 88, 82, 90, 85, 94, 88, 100, 95, 108, 102, 115, 110, 122, 118, 130, 125, 140, 135, 145].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm transition-all hover:opacity-80" style={{ height: `${(v / 145) * 100}%`, background: `linear-gradient(to top, rgba(0,255,209,0.8), rgba(0,255,209,0.2))`, minWidth: 4 }} />
              ))}
            </div>
            <div className="flex justify-between text-muted-foreground text-xs mt-2">
              <span>18 апр</span><span>1 мая</span><span>17 мая</span>
            </div>
          </div>
        </div>
      )}

      {tab === "bots" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-rajdhani text-2xl font-bold text-white">Управление ботами</h2>
            <button className="neon-btn px-5 py-2 font-rajdhani font-semibold tracking-wider uppercase rounded-sm text-sm inline-flex items-center gap-2">
              <Icon name="Plus" size={16} />
              Добавить бота
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOTS.map((bot, i) => {
              const sc = statusConfig[bot.status];
              return (
                <div key={bot.id} className="card-dark border rounded-xl p-6 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                        <Icon name="Bot" size={24} className="text-neon-cyan" />
                      </div>
                      <div>
                        <div className="font-rajdhani font-bold text-white text-lg">{bot.name}</div>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded border border-border hover:border-neon-cyan/30 transition-all text-muted-foreground hover:text-neon-cyan">
                        <Icon name="Settings" size={16} />
                      </button>
                      <button className="p-2 rounded border border-border hover:border-neon-red/30 transition-all text-muted-foreground hover:text-red-400">
                        <Icon name="Power" size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-muted-foreground text-xs mb-0.5">Сделок сегодня</div>
                      <div className="font-rajdhani font-bold text-white">{bot.trades}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-0.5">Баланс</div>
                      <div className="font-rajdhani font-bold neon-text-cyan text-sm">{bot.balance.toLocaleString()} ₽</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-0.5">Предметов</div>
                      <div className="font-rajdhani font-bold text-white">{bot.items}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "users" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-rajdhani text-2xl font-bold text-white">Пользователи</h2>
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className="bg-secondary border border-border rounded pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50" placeholder="Поиск пользователя..." />
            </div>
          </div>
          <div className="card-dark border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase">Пользователь</th>
                  <th className="text-left p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase hidden md:table-cell">Steam ID</th>
                  <th className="text-right p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase">Сделок</th>
                  <th className="text-right p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase hidden lg:table-cell">Оборот</th>
                  <th className="text-right p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase">Статус</th>
                  <th className="text-right p-4 text-muted-foreground text-xs font-rajdhani tracking-widest uppercase">Действия</th>
                </tr>
              </thead>
              <tbody>
                {USERS.map((user, i) => {
                  const sc = statusConfig[user.status];
                  return (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center text-sm">🎮</div>
                          <div>
                            <div className="font-semibold text-white text-sm">{user.name}</div>
                            <div className="text-muted-foreground text-xs">с {user.joined}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-muted-foreground text-xs font-mono">{user.steam}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-rajdhani font-bold text-white">{user.deals}</span>
                      </td>
                      <td className="p-4 text-right hidden lg:table-cell">
                        <span className="font-rajdhani text-sm neon-text-cyan">{user.volume.toLocaleString()} ₽</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded border border-border hover:border-neon-cyan/30 transition-all text-muted-foreground hover:text-neon-cyan">
                            <Icon name="Eye" size={14} />
                          </button>
                          <button className="p-1.5 rounded border border-border hover:border-red-500/30 transition-all text-muted-foreground hover:text-red-400">
                            <Icon name="Ban" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "catalog" && (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="Layers" size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-rajdhani text-xl text-white mb-2">Управление каталогом</p>
          <p>Добавление, редактирование и удаление скинов из каталога</p>
          <button className="mt-6 neon-btn px-6 py-3 font-rajdhani font-semibold tracking-wider uppercase rounded-sm inline-flex items-center gap-2">
            <Icon name="Plus" size={18} />
            Добавить скин
          </button>
        </div>
      )}
    </div>
  );
}
