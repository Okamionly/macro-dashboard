// COT Contract codes (CFTC)
export const COT_CONTRACTS: Record<string, { name: string; code: string }> = {
  EUR: { name: "EURO FX", code: "099741" },
  GBP: { name: "BRITISH POUND", code: "096742" },
  JPY: { name: "JAPANESE YEN", code: "097741" },
  AUD: { name: "AUSTRALIAN DOLLAR", code: "232741" },
  CAD: { name: "CANADIAN DOLLAR", code: "090741" },
  CHF: { name: "SWISS FRANC", code: "092741" },
  GOLD: { name: "GOLD", code: "088691" },
  OIL: { name: "CRUDE OIL", code: "067651" },
  SP500: { name: "E-MINI S&P 500", code: "13874A" },
};

// FRED Series IDs
export const FRED_SERIES: Record<string, { id: string; label: string; unit: string; frequency: string }> = {
  GDP: { id: "GDP", label: "PIB (GDP)", unit: "Mrd $", frequency: "Trimestriel" },
  CPI: { id: "CPIAUCSL", label: "CPI (Inflation)", unit: "Index", frequency: "Mensuel" },
  CORE_CPI: { id: "CPILFESL", label: "Core CPI", unit: "Index", frequency: "Mensuel" },
  NFP: { id: "PAYEMS", label: "NFP (Emplois)", unit: "Milliers", frequency: "Mensuel" },
  UNEMPLOYMENT: { id: "UNRATE", label: "Taux Chômage", unit: "%", frequency: "Mensuel" },
  FED_RATE: { id: "FEDFUNDS", label: "Fed Funds Rate", unit: "%", frequency: "Mensuel" },
  TREASURY_10Y: { id: "DGS10", label: "Trésor 10 ans", unit: "%", frequency: "Quotidien" },
  TREASURY_2Y: { id: "DGS2", label: "Trésor 2 ans", unit: "%", frequency: "Quotidien" },
  DXY: { id: "DTWEXBGS", label: "Dollar Index (DXY)", unit: "Index", frequency: "Quotidien" },
  PCE: { id: "PCEPI", label: "PCE Inflation", unit: "Index", frequency: "Mensuel" },
};

// CFTC SODA API
export const CFTC_API_BASE = "https://publicreporting.cftc.gov/resource/6dca-aqww.json";

// FRED API
export const FRED_API_BASE = "https://api.stlouisfed.org/fred/series/observations";

// MarketPhase link
export const MARKETPHASE_URL = "https://marketphase.vercel.app";
