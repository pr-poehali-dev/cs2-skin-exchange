import Icon from "@/components/ui/icon";

const ACHIEVEMENTS = [
  { icon: "🏆", label: "Топ трейдер", desc: "100+ сделок" },
  { icon: "💎", label: "Диамантовый", desc: "Оборот 1М+", glow: true },
  { icon: "⚡", label: "Молниеносный", desc: "Быстрые трейды" },
  { icon: "🎯", label: "Снайпер", desc: "Лучшие цены" },
];

const ACTIVITY = [
  { action: "Продажа", item: "AK-47 | Asiimov FT", amount: "+14 200 ₽", date: "Сегодня", color: "#BF00FF" },
  { action: "Покупка", item: "Glock | Fade FN", amount: "-28 500 ₽", date: "Сегодня", color: "#00FFD1" },
  { action: "Пополнение", item: "Баланс", amount: "+50 000 ₽", date: "Вчера", color: "#00FFD1" },
  { action: "Продажа", item: "Karambit | Doppler FN", amount: "+65 000 ₽", date: "15 мая", color: "#BF00FF" },
  { action: "Вывод", item: "Баланс", amount: "-30 000 ₽", date: "14 мая", color: "#FF2052" },
];

export default function Profile() {
  return (
    <div className="container mx-auto px-6 py-10">
      {/* Profile Header */}
      <div className="card-dark border rounded-xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-purple/5" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 border-2 border-neon-cyan flex items-center justify-center text-5xl neon-glow-cyan">
              🎮
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-background" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-rajdhani text-4xl font-bold text-white">PhantomX_pro</h1>
              <span className="bg-neon-gold/20 border border-neon-gold/40 text-neon-gold text-xs font-rajdhani font-bold px-2.5 py-1 rounded">
                💎 DIAMOND
              </span>
            </div>
            <div className="text-muted-foreground mb-4">Steam ID: STEAM_0:1:88241999 · Участник с 2023</div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { label: "Сделок", value: "247" },
                { label: "Продано", value: "412К ₽" },
                { label: "Куплено", value: "284К ₽" },
                { label: "Рейтинг", value: "4.98 ★" },
                { label: "В списке", value: "1 832" },
                { label: "Обменов", value: "38" },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="font-rajdhani text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-muted-foreground text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Balance */}
          <div className="card-dark border neon-border-cyan rounded-lg p-5 min-w-[200px]">
            <div className="text-muted-foreground text-sm mb-1">Баланс</div>
            <div className="neon-text-cyan font-rajdhani text-4xl font-bold mb-4">128 500 ₽</div>
            <div className="flex flex-col gap-2">
              <button className="neon-btn py-2 text-sm font-rajdhani font-semibold tracking-wider uppercase rounded-sm w-full">
                Пополнить
              </button>
              <button className="neon-btn-purple py-2 text-sm font-rajdhani font-semibold tracking-wider uppercase rounded-sm w-full">
                Вывести
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity */}
        <div className="lg:col-span-2 card-dark border rounded-xl p-6">
          <h2 className="font-rajdhani text-2xl font-bold text-white mb-5">Последняя активность</h2>
          <div className="space-y-3">
            {ACTIVITY.map((act, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: act.color + "20", border: `1px solid ${act.color}40` }}>
                  <Icon name={act.action === "Покупка" ? "ShoppingCart" : act.action === "Продажа" ? "Tag" : act.action === "Пополнение" ? "Plus" : "Minus"} fallback="Star" size={16} style={{ color: act.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{act.action}</span>
                    <span className="text-muted-foreground text-sm truncate">{act.item}</span>
                  </div>
                  <div className="text-muted-foreground text-xs">{act.date}</div>
                </div>
                <div className="font-rajdhani font-bold text-base shrink-0" style={{ color: act.color }}>
                  {act.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements + Settings */}
        <div className="space-y-6">
          <div className="card-dark border rounded-xl p-6">
            <h2 className="font-rajdhani text-2xl font-bold text-white mb-5">Достижения</h2>
            <div className="grid grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((ach, i) => (
                <div key={i} className={`rounded-lg p-3 text-center border transition-all ${ach.glow ? "border-neon-gold/40 bg-neon-gold/5 neon-glow-cyan" : "border-border bg-white/[0.02]"}`}>
                  <div className="text-3xl mb-2">{ach.icon}</div>
                  <div className="font-rajdhani font-bold text-white text-sm">{ach.label}</div>
                  <div className="text-muted-foreground text-xs">{ach.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark border rounded-xl p-6">
            <h2 className="font-rajdhani text-2xl font-bold text-white mb-4">Настройки</h2>
            <div className="space-y-3">
              {[
                { label: "Уведомления о трейдах", enabled: true },
                { label: "Двухфакторная защита", enabled: true },
                { label: "Trade URL публичный", enabled: false },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-white/80">{setting.label}</span>
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${setting.enabled ? "bg-neon-cyan" : "bg-muted"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all ${setting.enabled ? "right-0.5" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
