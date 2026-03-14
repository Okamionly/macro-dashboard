import { Link } from "react-router";
import { BarChart3, TrendingUp, Calendar, FileText, ExternalLink, ArrowRight } from "lucide-react";
import { MARKETPHASE_URL } from "../lib/constants";

const features = [
  { path: "/cot", icon: BarChart3, title: "COT Report", desc: "Positioning des Commercials, Non-Commercials et Retail sur les futures", color: "from-cyan-500 to-blue-600" },
  { path: "/macro", icon: TrendingUp, title: "Indicateurs Macro", desc: "GDP, CPI, NFP, Fed Funds, Trésor, DXY en temps réel via FRED", color: "from-emerald-500 to-teal-600" },
  { path: "/calendar", icon: Calendar, title: "Calendrier Économique", desc: "Événements à venir avec niveau d'impact et consensus", color: "from-amber-500 to-orange-600" },
  { path: "/analysis", icon: FileText, title: "Mes Analyses", desc: "Notes d'analyse personnelles avec bias et tags", color: "from-purple-500 to-indigo-600" },
];

export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">MacroScope</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Dashboard macro et COT connecté à MarketPhase. Données en temps réel, analyses personnelles et calendrier économique.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link to="/cot" className="btn-primary px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2">
            Explorer les COT <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={MARKETPHASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl border border-gray-600 hover:border-cyan-500 transition flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ExternalLink className="w-4 h-4" />
            Journal de Trading
          </a>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <Link key={f.path} to={f.path} className="metric-card rounded-2xl p-6 block group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
