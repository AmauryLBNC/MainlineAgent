from pathlib import Path

ROOT = Path("data/sec_10k")

def rename_html_file(company: str, year_dir: Path):
    html_files = list(year_dir.glob("*.htm")) + list(year_dir.glob("*.html"))

    if not html_files:
        return

    html_file = html_files[0]  # normalement un seul
    new_name = f"{company.lower()}-{year_dir.name}.htm"
    new_path = year_dir / new_name

    if html_file.name != new_name:
        print(f"Renommage : {html_file.name} → {new_name}")
        html_file.rename(new_path)

def main():
    for company_dir in ROOT.iterdir():
        if not company_dir.is_dir():
            continue

        company = company_dir.name  # ex: AAPL

        for year_dir in company_dir.iterdir():
            if year_dir.is_dir():
                rename_html_file(company, year_dir)

if __name__ == "__main__":
    main()
