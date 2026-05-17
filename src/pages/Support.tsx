import { useState } from "react";
import Icon from "@/components/ui/icon";

const TICKETS = [
  { id: "TKT-0041", subject: "Не пришёл скин после обмена", status: "open", priority: "high", date: "17 мая 2026" },
  { id: "TKT-0038", subject: "Проблема с пополнением баланса", status: "in_progress", priority: "medium", date: "15 мая 2026" },
  { id: "TKT-0031", subject: "Вопрос по комиссии сделки", status: "closed", priority: "low", date: "10 мая 2026" },
];

const FAQ = [
  { q: "Как долго ждать скин после обмена?", a: "Обычно обмен происходит мгновенно. В редких случаях — до 15 минут из-за нагрузки на Steam." },
  { q: "Какая комиссия платформы?", a: "Комиссия составляет 5% от суммы сделки. При обмене 1:1 комиссия не взимается." },
  { q: "Как пополнить баланс?", a: "Баланс пополняется через ЮKassa, СБП или банковскую карту. Минимальная сумма — 100 ₽." },
  { q: "Можно ли отменить сделку?", a: "Отмена возможна до подтверждения трейда в Steam. После подтверждения — отмена недоступна." },
  { q: "Что делать если аккаунт заблокировали?", a: "Напишите в поддержку через форму ниже с указанием вашего Steam ID и причины обращения." },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "Открыт", color: "#00FFD1", bg: "rgba(0,255,209,0.1)" },
  in_progress: { label: "В работе", color: "#FFD700", bg: "rgba(255,215,0,0.1)" },
  closed: { label: "Закрыт", color: "#666", bg: "rgba(100,100,100,0.1)" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: "Высокий", color: "#FF2052" },
  medium: { label: "Средний", color: "#FFD700" },
  low: { label: "Низкий", color: "#666" },
};

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ subject: "", category: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-rajdhani text-5xl font-bold text-white mb-2">Поддержка</h1>
        <p className="text-muted-foreground">Среднее время ответа: <span className="text-neon-cyan">~2 часа</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form + Tickets */}
        <div className="lg:col-span-2 space-y-8">
          {/* New ticket */}
          <div className="card-dark border rounded-xl p-6">
            <h2 className="font-rajdhani text-2xl font-bold text-white mb-5 flex items-center gap-3">
              <Icon name="MessageSquarePlus" size={22} className="text-neon-cyan" />
              Создать тикет
            </h2>
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <div className="font-rajdhani text-2xl font-bold text-white mb-2">Тикет отправлен!</div>
                <div className="text-muted-foreground">Мы ответим в течение 2 часов</div>
                <button onClick={() => setSubmitted(false)} className="mt-6 neon-btn px-5 py-2 font-rajdhani font-semibold tracking-wider uppercase rounded-sm text-sm">
                  Создать ещё один
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-muted-foreground text-xs font-rajdhani tracking-wider uppercase mb-2 block">Категория</label>
                    <select className="w-full bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-neon-cyan/50" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      <option value="">Выберите категорию...</option>
                      <option>Проблема с обменом</option>
                      <option>Пополнение / вывод</option>
                      <option>Технические проблемы</option>
                      <option>Вопрос по аккаунту</option>
                      <option>Другое</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-rajdhani tracking-wider uppercase mb-2 block">Тема</label>
                    <input className="w-full bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50" placeholder="Кратко опишите проблему" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground text-xs font-rajdhani tracking-wider uppercase mb-2 block">Описание</label>
                  <textarea className="w-full bg-secondary border border-border rounded px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50 resize-none" rows={5} placeholder="Подробно опишите вашу проблему или вопрос..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                </div>
                <button onClick={() => form.subject && form.message && setSubmitted(true)} className="neon-btn px-6 py-3 font-rajdhani font-bold tracking-wider uppercase rounded-sm inline-flex items-center gap-2">
                  <Icon name="Send" size={16} />
                  Отправить тикет
                </button>
              </div>
            )}
          </div>

          {/* My tickets */}
          <div className="card-dark border rounded-xl p-6">
            <h2 className="font-rajdhani text-2xl font-bold text-white mb-5 flex items-center gap-3">
              <Icon name="Inbox" size={22} className="text-neon-purple" />
              Мои тикеты
            </h2>
            <div className="space-y-3">
              {TICKETS.map((ticket, i) => {
                const sc = statusConfig[ticket.status];
                const pc = priorityConfig[ticket.priority];
                return (
                  <div key={ticket.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer border border-transparent hover:border-neon-cyan/20 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-neon-cyan text-xs font-rajdhani font-semibold">{ticket.id}</span>
                        <span className="text-xs" style={{ color: pc.color }}>● {pc.label}</span>
                      </div>
                      <div className="text-white font-medium text-sm">{ticket.subject}</div>
                      <div className="text-muted-foreground text-xs">{ticket.date}</div>
                    </div>
                    <div className="ml-auto shrink-0">
                      <span className="px-2.5 py-1 rounded text-xs font-rajdhani font-semibold" style={{ background: sc.bg, color: sc.color }}>
                        {sc.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: FAQ + Contacts */}
        <div className="space-y-6">
          <div className="card-dark border rounded-xl p-6">
            <h2 className="font-rajdhani text-2xl font-bold text-white mb-5 flex items-center gap-3">
              <Icon name="HelpCircle" size={22} className="text-neon-gold" />
              FAQ
            </h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden">
                  <button className="w-full flex items-center justify-between p-3.5 text-left hover:bg-white/[0.02] transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-white text-sm font-medium pr-4">{item.q}</span>
                    <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground shrink-0" />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-muted-foreground text-sm border-t border-border pt-3 animate-fade-up">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark border rounded-xl p-6">
            <h2 className="font-rajdhani text-2xl font-bold text-white mb-4">Контакты</h2>
            <div className="space-y-3">
              {[
                { icon: "MessageSquare", label: "Telegram", value: "@skinvault_support" },
                { icon: "Mail", label: "Email", value: "support@skinvault.ru" },
                { icon: "Clock", label: "Часы работы", value: "Пн–Вс 9:00–22:00" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-2 rounded bg-neon-cyan/10">
                    <Icon name={c.icon} fallback="Star" size={16} className="text-neon-cyan" />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">{c.label}</div>
                    <div className="text-white text-sm">{c.value}</div>
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
