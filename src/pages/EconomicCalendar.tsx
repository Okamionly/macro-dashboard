import { useState } from "react";
import { useEconomicCalendar } from "../hooks/useEconomicCalendar";
import { Filter } from "lucide-react";

const COUNTRIES = ["US", "EU", "UK", "JP", "CA", "AU"];
const COUNTRY_FLAGS: Record<string, string> = { US: "🇺🇸", EU: "🇪🇺", UK: "🇬🇧", JP: "🇯🇵", CA: "🇨🇦", AU: "🇦🇺" };

export function EconomicCalendar() {
  const { events, loading, error } = useEconomicCalendar();
  const [countryFilter, setCountryFilter] = useState("all");
  const [impactFilter, setImpactFilter] = useState("all");

  const filtered = events.filter((e) => {
    const matchCountry = countryFilter === "all" || e.country === countryFilter;
    const matchImpact = impactFilter === "all" || e.impact === impactFilter;
    return matchCountry && matchImpact;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendrier Économique</h1>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Tous pays</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{COUNTRY_FLAGS[c] || ""} {c}</option>
            ))}
          </select>
          <select
            value={impactFilter}
            onChange={(e) => setImpactFilter(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Tout impact</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">⚪ Low</option>
          </select>
        </div>
      </div>

      {error && <div className="glass rounded-xl p-4 text-rose-400 text-sm">{error}</div>}

      <div className="glass rounded-2xl p-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-700/50 rounded w-20" />
                <div className="h-4 bg-gray-700/50 rounded w-8" />
                <div className="h-4 bg-gray-700/50 rounded flex-1" />
                <div className="h-4 bg-gray-700/50 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Heure</th>
                  <th className="pb-3 font-medium">Pays</th>
                  <th className="pb-3 font-medium">Impact</th>
                  <th className="pb-3 font-medium">Événement</th>
                  <th className="pb-3 font-medium">Précédent</th>
                  <th className="pb-3 font-medium">Prévision</th>
                  <th className="pb-3 font-medium">Actuel</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="py-8 text-center text-gray-500">Aucun événement trouvé</td></tr>
                ) : (
                  filtered.map((e, i) => (
                    <tr key={i} className={`border-b border-gray-800 ${e.impact === "high" ? "bg-rose-500/5" : ""}`}>
                      <td className="py-3 mono text-gray-400">{e.date}</td>
                      <td className="py-3 mono">{e.time || "-"}</td>
                      <td className="py-3">
                        <span className="text-lg" title={e.country}>{COUNTRY_FLAGS[e.country] || e.country}</span>
                      </td>
                      <td className="py-3">
                        <span className={`impact-${e.impact}`}>
                          {e.impact === "high" ? "●●●" : e.impact === "medium" ? "●●○" : "●○○"}
                        </span>
                      </td>
                      <td className="py-3 font-medium">{e.event}</td>
                      <td className="py-3 mono text-gray-400">{e.previous || "-"}</td>
                      <td className="py-3 mono text-blue-400">{e.forecast || "-"}</td>
                      <td className="py-3 mono font-bold">{e.actual || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
