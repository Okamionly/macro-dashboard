import type { EconomicEvent } from "./types";
import { format, addDays } from "date-fns";

// Using Finnhub or fallback mock data
const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_API_KEY || "";

export async function fetchEconomicCalendar(): Promise<EconomicEvent[]> {
  if (!FINNHUB_KEY) {
    return getMockCalendarData();
  }

  try {
    const from = format(new Date(), "yyyy-MM-dd");
    const to = format(addDays(new Date(), 7), "yyyy-MM-dd");
    const url = `https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=${FINNHUB_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Finnhub error");

    const data = await res.json();
    const events = data.economicCalendar || [];

    return events.map((e: Record<string, string | number>) => ({
      date: String(e.time || e.date || "").split("T")[0],
      time: String(e.time || "").split("T")[1]?.slice(0, 5) || "",
      country: String(e.country || ""),
      event: String(e.event || ""),
      impact: e.impact === 3 ? "high" : e.impact === 2 ? "medium" : "low",
      actual: String(e.actual ?? ""),
      forecast: String(e.estimate ?? e.forecast ?? ""),
      previous: String(e.prev ?? e.previous ?? ""),
    }));
  } catch {
    return getMockCalendarData();
  }
}

function getMockCalendarData(): EconomicEvent[] {
  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  return [
    { date: today, time: "14:30", country: "US", event: "Initial Jobless Claims", impact: "medium", actual: "", forecast: "220K", previous: "215K" },
    { date: today, time: "16:00", country: "US", event: "Existing Home Sales", impact: "medium", actual: "", forecast: "4.15M", previous: "4.08M" },
    { date: tomorrow, time: "10:00", country: "EU", event: "Consumer Confidence", impact: "medium", actual: "", forecast: "-14.5", previous: "-14.7" },
    { date: tomorrow, time: "14:30", country: "US", event: "Non-Farm Payrolls", impact: "high", actual: "", forecast: "185K", previous: "175K" },
    { date: tomorrow, time: "14:30", country: "US", event: "Unemployment Rate", impact: "high", actual: "", forecast: "4.1%", previous: "4.2%" },
    { date: tomorrow, time: "16:00", country: "US", event: "ISM Manufacturing PMI", impact: "high", actual: "", forecast: "48.5", previous: "47.8" },
  ];
}
