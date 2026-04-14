from __future__ import annotations

import argparse
import json
from pathlib import Path

from .domain import CompanySnapshot
from .service import BuffettScoringService


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Buffett ML CLI: entrainement et scoring d'entreprises."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("train", help="Entraine le modele a partir de PostgreSQL.")
    subparsers.add_parser(
        "ranked", help="Retourne le classement des entreprises de la base."
    )

    score_parser = subparsers.add_parser(
        "score",
        help="Score une entreprise a partir d'un fichier JSON.",
    )
    score_parser.add_argument(
        "--payload-file",
        required=True,
        type=Path,
        help="Chemin vers un payload JSON compatible avec l'endpoint /score.",
    )

    return parser


def _load_snapshot_from_file(payload_file: Path) -> CompanySnapshot:
    payload = json.loads(payload_file.read_text(encoding="utf-8"))
    return CompanySnapshot(
        company_id=None,
        slug=payload.get("slug"),
        name=payload["name"],
        sector=payload["sector"],
        country=payload.get("country"),
        revenue=payload["revenue"],
        net_income=payload["net_income"],
        debt=payload.get("debt", 0.0),
        shareholders_equity=payload.get("shareholders_equity"),
        free_cash_flow=payload["free_cash_flow"],
        ebitda=payload["ebitda"],
        pe_ratio=payload.get("pe_ratio", 15.0),
        net_margin=payload.get("net_margin"),
        environmental_score=payload.get("environmental_score", 60.0),
        social_score=payload.get("social_score", 60.0),
        governance_score=payload.get("governance_score", 60.0),
    )


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    service = BuffettScoringService()

    try:
        if args.command == "train":
            print(json.dumps(service.train_from_repository(), indent=2))
            return 0

        if args.command == "ranked":
            print(json.dumps(service.list_ranked_companies(), indent=2))
            return 0

        if args.command == "score":
            snapshot = _load_snapshot_from_file(args.payload_file)
            print(json.dumps(service.score_manual_company(snapshot), indent=2))
            return 0
    except Exception as exc:
        parser.exit(status=1, message=f"Buffett ML error: {exc}\n")

    parser.error("Commande non supportee.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
