import { CFTC_API_BASE, COT_CONTRACTS } from "./constants";
import type { CotRecord, CotParsed } from "./types";

export async function fetchCotData(assetKey: string, weeks = 52): Promise<CotParsed[]> {
  const contract = COT_CONTRACTS[assetKey];
  if (!contract) throw new Error(`Unknown asset: ${assetKey}`);

  const url = `${CFTC_API_BASE}?$where=cftc_contract_market_code='${contract.code}'&$order=report_date_as_yyyy_mm_dd DESC&$limit=${weeks}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`CFTC API error: ${res.status}`);

  const data: CotRecord[] = await res.json();

  return data
    .map((r) => {
      const nonCommLong = parseInt(r.noncomm_positions_long_all) || 0;
      const nonCommShort = parseInt(r.noncomm_positions_short_all) || 0;
      const commLong = parseInt(r.comm_positions_long_all) || 0;
      const commShort = parseInt(r.comm_positions_short_all) || 0;
      const retailLong = parseInt(r.nonrept_positions_long_all) || 0;
      const retailShort = parseInt(r.nonrept_positions_short_all) || 0;

      return {
        date: r.report_date_as_yyyy_mm_dd,
        nonCommLong,
        nonCommShort,
        nonCommNet: nonCommLong - nonCommShort,
        commLong,
        commShort,
        commNet: commLong - commShort,
        retailLong,
        retailShort,
        retailNet: retailLong - retailShort,
        openInterest: parseInt(r.open_interest_all) || 0,
      };
    })
    .reverse(); // chronological order
}
