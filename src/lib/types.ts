export interface CotRecord {
  report_date_as_yyyy_mm_dd: string;
  market_and_exchange_names: string;
  noncomm_positions_long_all: string;
  noncomm_positions_short_all: string;
  comm_positions_long_all: string;
  comm_positions_short_all: string;
  nonrept_positions_long_all: string;
  nonrept_positions_short_all: string;
  open_interest_all: string;
}

export interface CotParsed {
  date: string;
  nonCommLong: number;
  nonCommShort: number;
  nonCommNet: number;
  commLong: number;
  commShort: number;
  commNet: number;
  retailLong: number;
  retailShort: number;
  retailNet: number;
  openInterest: number;
}

export interface FredObservation {
  date: string;
  value: string;
}

export interface FredSeries {
  key: string;
  label: string;
  unit: string;
  frequency: string;
  latestValue: number | null;
  latestDate: string;
  previousValue: number | null;
  change: number | null;
  observations: { date: string; value: number }[];
}

export interface EconomicEvent {
  date: string;
  time: string;
  country: string;
  event: string;
  impact: "high" | "medium" | "low";
  actual: string;
  forecast: string;
  previous: string;
}

export interface AnalysisNote {
  id: string;
  title: string;
  content: string;
  asset: string | null;
  bias: "bullish" | "bearish" | "neutral" | null;
  tags: string[];
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}
