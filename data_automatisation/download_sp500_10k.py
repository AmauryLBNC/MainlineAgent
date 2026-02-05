# download_sp500_10k.py
import os
import re
import time
import json
import argparse
from pathlib import Path
from typing import Optional, Tuple, Dict, Any, List

import requests
import pandas as pd

WIKI_SP500 = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
SEC_SUBMISSIONS = "https://data.sec.gov/submissions/CIK{cik10}.json"
SEC_ARCHIVES = "https://www.sec.gov/Archives/edgar/data/{cik_int}/{acc_no_nodash}/{primary_doc}"

def cik_to_10(cik: int) -> str:
    return str(cik).zfill(10)

def normalize_accession(acc_no: str) -> str:
    # e.g. "0000320193-25-000010" -> "000032019325000010"
    return acc_no.replace("-", "")

def safe_filename(name: str) -> str:
    return re.sub(r"[^a-zA-Z0-9._-]+", "_", name)

def ensure_headers(user_agent: str) -> Dict[str, str]:
    # SEC expects an identifiable UA (often "AppName (email)")
    return {
        "User-Agent": user_agent,
        "Accept-Encoding": "gzip, deflate, br",
        "Accept": "application/json,text/html,*/*",
        "Connection": "keep-alive",
    }

def fetch_sp500_table(user_agent: str) -> pd.DataFrame:
    headers = {
        "User-Agent": user_agent,
        "Accept-Language": "en-US,en;q=0.9",
    }

    r = requests.get(WIKI_SP500, headers=headers, timeout=30)
    r.raise_for_status()

    tables = pd.read_html(r.text)
    df = tables[0]

    df.columns = [c.strip() for c in df.columns]
    df["Symbol"] = df["Symbol"].astype(str).str.strip()
    df["CIK"] = df["CIK"].astype(str).str.strip()

    return df[["Symbol", "CIK"]]


def get_latest_10k(submissions: Dict[str, Any], year: Optional[int] = None) -> Optional[Tuple[str, str, str]]:
    """
    Returns (filingDate, accessionNumber, primaryDocument) for the latest 10-K
    If year is provided, returns the latest 10-K filed in that calendar year.
    """
    recent = submissions.get("filings", {}).get("recent", {})
    forms = recent.get("form", [])
    dates = recent.get("filingDate", [])
    accs  = recent.get("accessionNumber", [])
    prims = recent.get("primaryDocument", [])

    if not (len(forms) == len(dates) == len(accs) == len(prims)):
        # If SEC changes structure, fail loudly
        raise RuntimeError("Unexpected SEC submissions JSON structure (recent arrays lengths differ).")

    candidates: List[Tuple[str, str, str]] = []
    for form, fdate, acc, prim in zip(forms, dates, accs, prims):
        if form == "10-K":
            if year is None or (str(fdate).startswith(str(year))):
                candidates.append((fdate, acc, prim))

    if not candidates:
        return None

    # Latest by filingDate
    candidates.sort(key=lambda x: x[0], reverse=True)
    return candidates[0]

def download_file(session: requests.Session, url: str, out_path: Path, sleep_s: float = 0.2) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    r = session.get(url, timeout=60)
    time.sleep(sleep_s)  # be polite; SEC fair access ~10 req/s max
    r.raise_for_status()
    out_path.write_bytes(r.content)

def main():
    ap = argparse.ArgumentParser(description="Download latest 10-K filings for S&P 500 companies from SEC EDGAR.")
    ap.add_argument("--user-agent", required=True, help='Example: "MainlineAgent/1.0 (your_email@example.com)"')
    ap.add_argument("--out", default="data/sec_10k", help="Output root directory")
    ap.add_argument("--limit", type=int, default=25, help="Limit number of companies (use 500 for all)")
    ap.add_argument("--year", type=int, default=None, help="Optional: only download 10-K filed in this year (e.g., 2025)")
    ap.add_argument("--sleep", type=float, default=0.2, help="Sleep seconds between requests (default 0.2)")
    args = ap.parse_args()

    out_root = Path(args.out)
    out_root.mkdir(parents=True, exist_ok=True)

    df = fetch_sp500_table(args.user_agent).head(args.limit)


    session = requests.Session()
    session.headers.update(ensure_headers(args.user_agent))

    successes = 0
    skipped = 0
    failed = 0

    for _, row in df.iterrows():
        ticker = row["Symbol"]
        cik_str = str(row["CIK"]).lstrip("0")
        if not cik_str.isdigit():
            print(f"[SKIP] {ticker}: invalid CIK '{row['CIK']}'")
            skipped += 1
            continue

        cik_int = int(cik_str)
        cik10 = cik_to_10(cik_int)

        try:
            sub_url = SEC_SUBMISSIONS.format(cik10=cik10)
            r = session.get(sub_url, timeout=60)
            time.sleep(args.sleep)
            r.raise_for_status()
            submissions = r.json()

            latest = get_latest_10k(submissions, year=args.year)
            if latest is None:
                print(f"[SKIP] {ticker}: no 10-K found (year={args.year})")
                skipped += 1
                continue

            filing_date, acc_no, primary_doc = latest
            acc_nodash = normalize_accession(acc_no)
            filing_year = int(str(filing_date)[:4])

            # Build SEC Archives URL to primary document
            filing_url = SEC_ARCHIVES.format(
                cik_int=cik_int,
                acc_no_nodash=acc_nodash,
                primary_doc=primary_doc
            )

            # Save
            company_dir = out_root / safe_filename(ticker) / str(filing_year)
            meta_path = company_dir / "meta.json"
            doc_path  = company_dir / safe_filename(primary_doc)

            if doc_path.exists():
                print(f"[OK] {ticker}: already downloaded {doc_path.name}")
                successes += 1
                continue

            print(f"[GET] {ticker} 10-K {filing_date} -> {filing_url}")
            download_file(session, filing_url, doc_path, sleep_s=args.sleep)

            meta = {
                "ticker": ticker,
                "cik": cik10,
                "filingDate": filing_date,
                "accessionNumber": acc_no,
                "primaryDocument": primary_doc,
                "downloadUrl": filing_url,
                "savedAs": str(doc_path),
            }
            meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")

            successes += 1

        except Exception as e:
            print(f"[FAIL] {ticker}: {e}")
            failed += 1

    print("\nDone.")
    print(f"Success: {successes} | Skipped: {skipped} | Failed: {failed}")
    print(f"Output: {out_root.resolve()}")

if __name__ == "__main__":
    main()
