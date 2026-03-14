import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useCotData } from "../hooks/useCotData";
import { COT_CONTRACTS } from "../lib/constants";
import { RefreshCw } from "lucide-react";

Chart.register(...registerables);

export function CotDashboard() {
  const [asset, setAsset] = useState("EUR");
  const { data, loading, error, reload } = useCotData(asset);
  const netChartRef = useRef<HTMLCanvasElement>(null);
  const netChartInstance = useRef<Chart | null>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const barChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!netChartRef.current || data.length === 0) return;
    if (netChartInstance.current) netChartInstance.current.destroy();

    netChartInstance.current = new Chart(netChartRef.current, {
      type: "line",
      data: {
        labels: data.map((d) => d.date.slice(5)),
        datasets: [
          { label: "Non-Commercials (Net)", data: data.map((d) => d.nonCommNet), borderColor: "#0ea5e9", backgroundColor: "rgba(14,165,233,0.1)", fill: false, tension: 0.3 },
          { label: "Commercials (Net)", data: data.map((d) => d.commNet), borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.1)", fill: false, tension: 0.3 },
          { label: "Retail (Net)", data: data.map((d) => d.retailNet), borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.1)", fill: false, tension: 0.3 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#94a3b8" } } },
        scales: {
          y: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#94a3b8" } },
          x: { grid: { display: false }, ticks: { color: "#94a3b8", maxTicksLimit: 12 } },
        },
      },
    });

    return () => { netChartInstance.current?.destroy(); };
  }, [data]);

  useEffect(() => {
    if (!barChartRef.current || data.length === 0) return;
    if (barChartInstance.current) barChartInstance.current.destroy();

    const last = data[data.length - 1];
    if (!last) return;

    barChartInstance.current = new Chart(barChartRef.current, {
      type: "bar",
      data: {
        labels: ["Non-Comm", "Commercials", "Retail"],
        datasets: [
          { label: "Long", data: [last.nonCommLong, last.commLong, last.retailLong], backgroundColor: "#10b981", borderRadius: 4 },
          { label: "Short", data: [last.nonCommShort, last.commShort, last.retailShort], backgroundColor: "#ef4444", borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#94a3b8" } } },
        scales: {
          y: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#94a3b8" } },
          x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
        },
      },
    });

    return () => { barChartInstance.current?.destroy(); };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">COT Report — Commitment of Traders</h1>
        <div className="flex items-center gap-3">
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm"
          >
            {Object.entries(COT_CONTRACTS).map(([key, c]) => (
              <option key={key} value={key}>{key} — {c.name}</option>
            ))}
          </select>
          <button onClick={reload} className="p-2 rounded-lg hover:bg-white/5 transition" title="Rafraîchir">
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && <div className="glass rounded-xl p-4 text-rose-400 text-sm">{error}</div>}

      {loading ? (
        <div className="glass rounded-2xl p-6 animate-pulse">
          <div className="h-[300px] bg-gray-700/30 rounded" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {data.length > 0 && (() => {
              const last = data[data.length - 1];
              return [
                { label: "Non-Commercials Net", value: last.nonCommNet, color: "text-cyan-400" },
                { label: "Commercials Net", value: last.commNet, color: "text-emerald-400" },
                { label: "Open Interest", value: last.openInterest, color: "text-amber-400" },
              ].map((m) => (
                <div key={m.label} className="glass rounded-xl p-4">
                  <p className="text-xs text-gray-400">{m.label}</p>
                  <p className={`text-2xl font-bold mono ${m.color}`}>{m.value.toLocaleString()}</p>
                </div>
              ));
            })()}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Net Positioning (52 semaines)</h3>
              <div className="chart-container"><canvas ref={netChartRef} /></div>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Long vs Short (dernière semaine)</h3>
              <div className="chart-container"><canvas ref={barChartRef} /></div>
            </div>
          </div>

          {/* Data table */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Données brutes (dernières 10 semaines)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">NC Long</th>
                    <th className="pb-3">NC Short</th>
                    <th className="pb-3">NC Net</th>
                    <th className="pb-3">Comm Net</th>
                    <th className="pb-3">Retail Net</th>
                    <th className="pb-3">OI</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(-10).reverse().map((r) => (
                    <tr key={r.date} className="border-b border-gray-800">
                      <td className="py-2 mono text-gray-400">{r.date}</td>
                      <td className="py-2 mono">{r.nonCommLong.toLocaleString()}</td>
                      <td className="py-2 mono">{r.nonCommShort.toLocaleString()}</td>
                      <td className={`py-2 mono font-bold ${r.nonCommNet >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{r.nonCommNet.toLocaleString()}</td>
                      <td className={`py-2 mono ${r.commNet >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{r.commNet.toLocaleString()}</td>
                      <td className={`py-2 mono ${r.retailNet >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{r.retailNet.toLocaleString()}</td>
                      <td className="py-2 mono text-gray-400">{r.openInterest.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
