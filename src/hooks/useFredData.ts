import { useState, useEffect } from "react";
import { fetchMultipleFredSeries } from "../lib/fred";
import type { FredSeries } from "../lib/types";

const DEFAULT_KEYS = ["DXY", "FED_RATE", "CPI", "NFP", "UNEMPLOYMENT", "TREASURY_10Y", "TREASURY_2Y", "GDP", "PCE"];

export function useFredData(keys: string[] = DEFAULT_KEYS) {
  const [series, setSeries] = useState<FredSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMultipleFredSeries(keys)
      .then((data) => {
        if (!cancelled) setSeries(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Erreur FRED");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [keys.join(",")]);

  return { series, loading, error };
}
