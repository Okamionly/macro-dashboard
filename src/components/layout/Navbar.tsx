import { Link, useLocation } from "react-router";
import { BarChart3, TrendingUp, Calendar, FileText, Home, Sun, Moon, ExternalLink } from "lucide-react";
import { MARKETPHASE_URL } from "../../lib/constants";

const tabs = [
  { path: "/", label: "Accueil", icon: Home },
  { path: "/cot", label: "COT", icon: BarChart3 },
  { path: "/macro", label: "Macro", icon: TrendingUp },
  { path: "/calendar", label: "Calendrier", icon: Calendar },
  { path: "/analysis", label: "Analyses", icon: FileText },
];

export function Navbar() {
  const location = useLocation();
  const isDark = document.documentElement.classList.contains("dark");

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("macro-theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("macro-theme", "dark");
    }
    // Force re-render
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <header className="glass sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            MacroScope
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active ? "tab-active text-cyan-400" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={MARKETPHASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-cyan-400 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden md:inline">Journal</span>
          </a>
          <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
