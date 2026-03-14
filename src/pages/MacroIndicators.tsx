import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useFredData } from "../hooks/useFredData";
import { TrendingUp, TrendingDown, Minus, X } from "lucide-react";
import type { FredSeries } from "../lib/types";

Chart.register(...registerables);

function DetailChart({ series, onClose }: { series: FredSeries; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: series.observations.map((o) => o.date),
        datasets: [{
          label: series.label,
          data: series.observations.map((o) => o.value),
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14,165,233,0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#94a3b8" } },
          x: { grid: { display: false }, ticks: { color: "#94a3b8", maxTicksLimit: 10 } },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [series]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{series.label}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <p className="text-sm text-gray-400 mb-4">{series.unit} — {series.frequency}</p>
        <div style={{ height: "400px" }}><canvas ref={canvasRef} /></div>
      </div>
    </div>
  );
}

export function MacroIndicators() {
  const { series, loading, error } = useFredData();
  const [selected, setSelected] = useState<FredSeries | null>(null);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Indicateurs Macro</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-700/50 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Indicateurs Macro</h1>
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-rose-400 mb-2">{error}</p>
          <p className="text-gray-400 text-sm">Vérifiez votre clé FRED API dans les variables d'environnement (VITE_FRED_API_KEY)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Indicateurs Macro — Données FRED</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {series.map((s) => {
          const changePositive = s.change !== null && s.change > 0;
          const changeNegative = s.change !== null && s.change < 0;
          return (
            <div
              key={s.key}
              onClick={() => setSelected(s)}
              className="metric-card rounded-2xl p-6 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-gray-400">{s.label}</p>
                <span className="text-xs text-gray-500">{s.frequency}</span>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold mono">
                  {s.latestValue !== null ? s.latestValue.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "N/A"}
                </p>
                <span className="text-xs text-gray-500 mb-1">{s.unit}</span>
              </div>
              {s.change !== null && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${changePositive ? "text-emerald-400" : changeNegative ? "text-rose-400" : "text-gray-400"}`}>
                  {changePositive ? <TrendingUp className="w-3 h-3" /> : changeNegative ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  <span className="mono">{s.change > 0 ? "+" : ""}{s.change.toFixed(2)}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Dernière donnée : {s.latestDate}</p>
            </div>
          );
        })}
      </div>

      {selected && <DetailChart series={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
