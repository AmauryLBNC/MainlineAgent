from bs4 import BeautifulSoup
from pathlib import Path
import re

ROOT = Path("data/sec_10k")

# =========================================================
# OUTILS
# =========================================================

def normalize_line(line: str) -> str:
    line = line.strip()
    line = re.sub(r"\s+", " ", line)
    return line


def is_noise(line: str) -> bool:
    blacklist = [
        "table of contents",
        "index to consolidated",
        "page ",
        "item 1",
        "item 1a",
        "item 7",
        "item 8",
        "signatures",
        "report of independent registered public accounting firm",
    ]

    l = line.lower()
    return any(b in l for b in blacklist) or len(l) < 5


# =========================================================
# HTML → TXT PROPRE
# =========================================================

def html_to_clean_text(html_file: Path) -> str:
    with open(html_file, "r", encoding="utf-8", errors="ignore") as f:
        soup = BeautifulSoup(f, "lxml")

    # supprimer bruit structurel
    for tag in soup(["script", "style", "noscript", "header", "footer", "nav"]):
        tag.decompose()

    # supprimer tables (chiffres traités ailleurs)
    for table in soup.find_all("table"):
        table.decompose()

    raw_text = soup.get_text(separator="\n")

    seen = set()
    clean_lines = []

    for line in raw_text.splitlines():
        line = normalize_line(line)

        if is_noise(line):
            continue

        # supprimer doublons exacts
        if line.lower() in seen:
            continue

        seen.add(line.lower())
        clean_lines.append(line)

    return "\n".join(clean_lines)


# =========================================================
# PIPELINE
# =========================================================

def process_year_folder(year_dir: Path, ticker: str):
    html_files = list(year_dir.glob("*.htm")) + list(year_dir.glob("*.html"))
    if not html_files:
        return

    html_file = html_files[0]
    print(f"[HTML] {html_file}")

    text = html_to_clean_text(html_file)

    out = year_dir / f"{ticker.lower()}-{year_dir.name}_raw.txt"
    out.write_text(text, encoding="utf-8")

    print(f"  ✔ TXT généré → {out.name}")


def main():
    for company_dir in ROOT.iterdir():
        if not company_dir.is_dir():
            continue

        ticker = company_dir.name

        for year_dir in company_dir.iterdir():
            if year_dir.is_dir():
                process_year_folder(year_dir, ticker)


if __name__ == "__main__":
    main()
