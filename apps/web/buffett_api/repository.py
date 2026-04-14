from __future__ import annotations

from dataclasses import dataclass
import json
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

import psycopg
from psycopg.rows import dict_row

from .domain import CompanySnapshot


LATEST_COMPANY_METRICS_QUERY = """
SELECT
  c.id,
  c.slug,
  c.name,
  c.sector,
  c.country,
  fm.revenue::float8 AS revenue,
  fm."netIncome"::float8 AS net_income,
  fm.debt::float8 AS debt,
  fm."shareholdersEquity"::float8 AS shareholders_equity,
  fm."freeCashFlow"::float8 AS free_cash_flow,
  fm.ebitda::float8 AS ebitda,
  fm."peRatio"::float8 AS pe_ratio,
  fm."netMargin"::float8 AS net_margin,
  ef.environmental,
  ef.social,
  ef.governance
FROM "Company" c
JOIN LATERAL (
  SELECT *
  FROM "FinancialMetrics" fm
  WHERE fm."companyId" = c.id
  ORDER BY fm."asOf" DESC
  LIMIT 1
) fm ON TRUE
LEFT JOIN "ExtraFinancialMetrics" ef ON ef."companyId" = c.id
ORDER BY c.name ASC
"""


class DatabaseUnavailableError(RuntimeError):
    """Raised when PostgreSQL cannot be queried."""


def normalize_database_url(database_url: str) -> str:
    parsed_url = urlparse(database_url)
    query_params = parse_qsl(parsed_url.query, keep_blank_values=True)
    schema_name: str | None = None
    filtered_params: list[tuple[str, str]] = []

    for key, value in query_params:
        if key == "schema":
            schema_name = value
            continue

        filtered_params.append((key, value))

    if schema_name and not any(key == "options" for key, _ in filtered_params):
        filtered_params.append(("options", f"-c search_path={schema_name}"))

    return urlunparse(parsed_url._replace(query=urlencode(filtered_params)))


def _coerce_float(value: Any, fallback: float = 0.0) -> float:
    if value is None:
        return fallback

    return float(value)


def _coerce_json_score(payload: Any, fallback: float = 60.0) -> float:
    if payload is None:
        return fallback

    if isinstance(payload, str):
        try:
            payload = json.loads(payload)
        except json.JSONDecodeError:
            return fallback

    if isinstance(payload, dict):
        score = payload.get("score")
        if score is None:
            return fallback

        return float(score)

    return fallback


@dataclass(slots=True)
class PostgresCompanyRepository:
    database_url: str

    def __post_init__(self) -> None:
        self.database_url = normalize_database_url(self.database_url)

    def list_company_snapshots(self) -> list[CompanySnapshot]:
        try:
            with psycopg.connect(self.database_url, row_factory=dict_row) as connection:
                with connection.cursor() as cursor:
                    cursor.execute(LATEST_COMPANY_METRICS_QUERY)
                    rows = cursor.fetchall()
        except psycopg.Error as exc:
            raise DatabaseUnavailableError(
                f"Impossible de lire les donnees financieres PostgreSQL: {exc}"
            ) from exc

        return [self._to_snapshot(row) for row in rows]

    def _to_snapshot(self, row: dict[str, Any]) -> CompanySnapshot:
        return CompanySnapshot(
            company_id=int(row["id"]),
            slug=row.get("slug"),
            name=row["name"],
            sector=row.get("sector") or "unknown",
            country=row.get("country"),
            revenue=_coerce_float(row.get("revenue")),
            net_income=_coerce_float(row.get("net_income")),
            debt=_coerce_float(row.get("debt")),
            shareholders_equity=_coerce_float(row.get("shareholders_equity")),
            free_cash_flow=_coerce_float(row.get("free_cash_flow")),
            ebitda=_coerce_float(row.get("ebitda")),
            pe_ratio=_coerce_float(row.get("pe_ratio"), fallback=15.0),
            net_margin=(
                float(row["net_margin"]) if row.get("net_margin") is not None else None
            ),
            environmental_score=_coerce_json_score(row.get("environmental")),
            social_score=_coerce_json_score(row.get("social")),
            governance_score=_coerce_json_score(row.get("governance")),
        )


@dataclass(slots=True)
class StaticCompanyRepository:
    companies: list[CompanySnapshot]

    def list_company_snapshots(self) -> list[CompanySnapshot]:
        return list(self.companies)
