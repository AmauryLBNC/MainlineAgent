import time
from pathlib import Path

from ollama import chat
from bs4 import BeautifulSoup

# ======================
# CONFIGURATION
# ======================

MODEL = "ministral-3:8b"

# Chemins (robustes, indépendants du cwd)
REPO_ROOT = Path(__file__).resolve().parent.parent
HTML_FILE = REPO_ROOT / "data" / "sec_10k" / "A" / "2025" / "a-2025.htm"
OUTPUT_FILE = Path(__file__).resolve().parent / "resume_final.txt"

CHUNK_SIZE_WORDS = 1000     # Taille d’un chunk (safe pour le contexte)
CHUNK_SUMMARY_WORDS = 150  # Taille résumé par chunk
FINAL_SUMMARY_WORDS = 150  # Taille finale
MINIMIZATION_PASSES = 5    # Nombre de vagues globales

SLEEP_BETWEEN_CALLS = 0.5  # secondes


# ======================
# HTML → TEXTE
# ======================

def extract_text_from_html(file_path: Path) -> str:
    if not file_path.exists():
        raise FileNotFoundError(f"Fichier introuvable : {file_path}")

    with file_path.open("r", encoding="utf-8", errors="ignore") as f:
        soup = BeautifulSoup(f, "html.parser")

    # Supprimer bruit
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    text = soup.get_text(separator=" ")
    return " ".join(text.split())


# ======================
# CHUNKING
# ======================

def chunk_text(text: str, chunk_size: int) -> list[str]:
    words = text.split()
    return [
        " ".join(words[i:i + chunk_size])
        for i in range(0, len(words), chunk_size)
    ]


# ======================
# APPEL OLLAMA
# ======================

def ollama_summarize(text: str, target_words: int) -> str:
    prompt = f"""
Résume le texte suivant en {target_words} mots maximum.
Conserve les informations importantes, les faits, les chiffres clés
et évite les généralités vagues.

Texte :
{text}
"""

    try:
        result = chat(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
        )
    except Exception as exc:
        raise RuntimeError(
            "Erreur Ollama : vérifie que `ollama serve` tourne "
            f"et que le modèle `{MODEL}` est installé."
        ) from exc

    return result["message"]["content"].strip()


# ======================
# RÉSUMÉ PAR CHUNKS (MAP)
# ======================

def summarize_all_chunks(text: str) -> str:
    chunks = chunk_text(text, CHUNK_SIZE_WORDS)
    print(f"{len(chunks)} chunks détectés")

    summaries = []

    for i, chunk in enumerate(chunks, 1):
        print(f"Résumé du chunk {i}/{len(chunks)}")
        summary = ollama_summarize(chunk, CHUNK_SUMMARY_WORDS)
        summaries.append(summary)
        time.sleep(SLEEP_BETWEEN_CALLS)

    return "\n".join(summaries)


# ======================
# MINIMISATION GLOBALE (REDUCE)
# ======================

def multi_pass_minimization(text: str, passes: int) -> str:
    for i in range(passes):
        print(f"--- Minimisation globale {i + 1}/{passes} ---")
        text = ollama_summarize(text, FINAL_SUMMARY_WORDS)
        time.sleep(1)

    return text


# ======================
# MAIN
# ======================

def main():
    print("Extraction du HTML…")
    raw_text = extract_text_from_html(HTML_FILE)
    print(f"Texte initial : {len(raw_text.split())} mots")

    print("\nRésumé par chunks (lecture complète du document)…")
    chunk_level_summary = summarize_all_chunks(raw_text)

    print("\nMinimisation globale…")
    final_summary = multi_pass_minimization(
        chunk_level_summary,
        MINIMIZATION_PASSES
    )

    OUTPUT_FILE.write_text(final_summary, encoding="utf-8")
    print(f"\nRésumé final sauvegardé dans : {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
