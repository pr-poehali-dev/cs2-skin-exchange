import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import Inventory from "@/pages/Inventory";
import Trades from "@/pages/Trades";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Support from "@/pages/Support";

type Page = "home" | "catalog" | "inventory" | "trades" | "profile" | "admin" | "support";

const NAV = [
  { key: "home", label: "Главная", icon: "Home" },
  { key: "catalog", label: "Каталог", icon: "Layers" },
  { key: "inventory", label: "Инвентарь", icon: "Package" },
  { key: "trades", label: "История", icon: "ArrowLeftRight" },
  { key: "profile", label: "Профиль", icon: "User" },
  { key: "support", label: "Поддержка", icon: "HelpCircle" },
  { key: "admin", label: "Админ", icon: "ShieldAlert" },
] as const;

function SkinVaultApp() {
  const [page, setPage] = useState<Page>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, loginWithSteam, logout, getSessionId } = useAuth();

  const navigate = (p: string) => {
    setPage(p as Page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => navigate("home")} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-neon-cyan/15 border border-neon-cyan/40 flex items-center justify-center group-hover:neon-glow-cyan transition-all">
                <span className="text-neon-cyan font-rajdhani font-bold text-sm">SV</span>
              </div>
              <span className="font-rajdhani text-xl font-bold text-white tracking-wider">
                SKIN<span className="neon-text-cyan">VAULT</span>
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV.map(item => (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-rajdhani font-semibold tracking-wide transition-all ${
                    page === item.key
                      ? item.key === "admin"
                        ? "text-neon-red border border-neon-red/30 bg-neon-red/10"
                        : "neon-text-cyan border border-neon-cyan/30 bg-neon-cyan/10"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <Icon name={item.icon} fallback="Star" size={15} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right — auth */}
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="w-24 h-8 rounded bg-muted animate-pulse" />
              ) : user ? (
                <>
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded border border-neon-cyan/20 bg-neon-cyan/5">
                    <Icon name="Wallet" size={14} className="text-neon-cyan" />
                    <span className="font-rajdhani font-bold text-neon-cyan text-sm">
                      {user.balance.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("profile")}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-9 h-9 rounded-full border-2 border-neon-purple/50"
                    />
                    <span className="hidden lg:block text-sm font-semibold text-white max-w-[120px] truncate">
                      {user.username}
                    </span>
                  </button>
                  <button
                    onClick={logout}
                    className="hidden md:flex items-center p-2 text-muted-foreground hover:text-red-400 transition-colors"
                    title="Выйти"
                  >
                    <Icon name="LogOut" size={16} />
                  </button>
                </>
              ) : (
                <button
                  onClick={loginWithSteam}
                  className="neon-btn px-4 py-2 font-rajdhani font-bold text-sm tracking-wider uppercase rounded-sm hidden md:flex items-center gap-2"
                >
                  <Icon name="LogIn" size={15} />
                  Steam
                </button>
              )}
              <button
                className="md:hidden p-2 text-muted-foreground hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-slide-in">
            <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
              {NAV.map(item => (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-rajdhani font-semibold tracking-wide transition-all text-left ${
                    page === item.key
                      ? item.key === "admin"
                        ? "text-neon-red bg-neon-red/10 border border-neon-red/20"
                        : "neon-text-cyan bg-neon-cyan/10 border border-neon-cyan/20"
                      : "text-muted-foreground hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon name={item.icon} fallback="Star" size={18} />
                  {item.label}
                </button>
              ))}
              {!user && (
                <button
                  onClick={loginWithSteam}
                  className="neon-btn mt-2 py-3 font-rajdhani font-bold tracking-wider uppercase rounded-sm flex items-center justify-center gap-2"
                >
                  <Icon name="LogIn" size={18} />
                  Войти через Steam
                </button>
              )}
              {user && (
                <button
                  onClick={logout}
                  className="mt-2 py-3 border border-border rounded text-muted-foreground font-rajdhani font-semibold flex items-center justify-center gap-2 hover:text-red-400 hover:border-red-400/30 transition-all"
                >
                  <Icon name="LogOut" size={16} />
                  Выйти
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* PAGE */}
      <main key={page} className="animate-fade-up">
        {page === "home" && <Home onNavigate={navigate} user={user} onLogin={loginWithSteam} />}
        {page === "catalog" && <Catalog />}
        {page === "inventory" && <Inventory user={user} onLogin={loginWithSteam} getSessionId={getSessionId} />}
        {page === "trades" && <Trades user={user} onLogin={loginWithSteam} />}
        {page === "profile" && <Profile user={user} onLogin={loginWithSteam} onLogout={logout} />}
        {page === "admin" && <Admin user={user} />}
        {page === "support" && <Support />}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/50 mt-16 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-rajdhani font-bold text-white">SKIN<span className="neon-text-cyan">VAULT</span></span>
            <span className="text-muted-foreground text-sm">© 2026</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <span>Условия использования</span>
            <span>·</span>
            <span>Конфиденциальность</span>
            <span>·</span>
            <button onClick={() => navigate("support")} className="hover:text-neon-cyan transition-colors">Поддержка</button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-muted-foreground text-sm">Все системы работают</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <SkinVaultApp />
    </TooltipProvider>
  );
}
