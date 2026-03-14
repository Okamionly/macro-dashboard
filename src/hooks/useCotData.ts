import { useState, useEffect, useCallback } from "react";
import { fetchCotData } from "../lib/cot";
import type { CotParsed } from "../lib/types";

export function useCotData(assetKey: string) {
  const [data, setData] = useState<CotParsed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCotData(assetKey);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement COT");
    } finally {
      setLoading(false);
    }
  }, [assetKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
