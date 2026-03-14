import { FRED_API_BASE, FRED_SERIES } from "./constants";
import type { FredObservation, FredSeries } from "./types";
import { format, subYears } from "date-fns";

const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY || "";

export async function fetchFredSeries(seriesKey: string, years = 3): Promise<FredSeries> {
  const series = FRED_SERIES[seriesKey];
  if (!series) throw new Error(`Unknown FRED series: ${seriesKey}`);

  const endDate = format(new Date(), "yyyy-MM-dd");
  const startDate = format(subYears(new Date(), years), "yyyy-MM-dd");

  const url = `${FRED_API_BASE}?series_id=${series.id}&api_key=${FRED_API_KEY}&file_type=json&observation_start=${startDate}&observation_end=${endDate}&sort_order=asc`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED API error: ${res.status}`);

  const json = await res.json();
  const observations: FredObservation[] = json.observations || [];

  const parsed = observations
    .filter((o) => o.value !== ".")
    .map((o) => ({ date: o.date, value: parseFloat(o.value) }));

  const latest = parsed[parsed.length - 1] || null;
  const previous = parsed[parsed.length - 2] || null;

  return {
    key: seriesKey,
    label: series.label,
    unit: series.unit,
    frequency: series.frequency,
    latestValue: latest?.value ?? null,
    latestDate: latest?.date ?? "",
    previousValue: previous?.value ?? null,
    change: latest && previous ? latest.value - previous.value : null,
    observations: parsed,
  };
}

export async function fetchMultipleFredSeries(keys: string[]): Promise<FredSeries[]> {
  const results = await Promise.allSettled(keys.map((k) => fetchFredSeries(k)));
  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<FredSeries>).value);
}
