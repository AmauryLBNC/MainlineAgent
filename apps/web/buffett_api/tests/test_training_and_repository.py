from __future__ import annotations

from pathlib import Path

from buffett_api.repository import normalize_database_url
from buffett_api.training import load_company_labels


def test_normalize_database_url_converts_prisma_schema_to_search_path() -> None:
    database_url = (
        "postgresql://postgres:postgres@localhost:5432/mainline_agent?schema=public"
    )

    normalized_url = normalize_database_url(database_url)

    assert "schema=public" not in normalized_url
    assert "options=-c+search_path%3Dpublic" in normalized_url


def test_load_company_labels_reads_manual_buffett_scores() -> None:
    labels = load_company_labels(
        Path("buffett_api/data/company_labels.json")
    )

    assert len(labels) == 4
    assert labels["orion-patrimoine"].buffett_score == 88
    assert "compounder Buffett" in labels["orion-patrimoine"].analyst_notes[2]
