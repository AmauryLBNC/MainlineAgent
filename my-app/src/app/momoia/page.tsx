"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/Base/PageShell";
import { cn } from "@/lib/utils";

type Stage = "intro" | "steps" | "results" | "analysis";

type Company = {
  name: string;
  sector: string;
  thesis: string;
};

const SECTORS = [
  "Technologie",
  "Sante",
  "Industrie",
  "Consommation",
  "Energie",
  "Finance",
  "Infrastructures",
  "Immobilier",
  "Services",
];

const PRIMARY_CRITERIA = [
  "Rentabilite",
  "Entreprise familiale",
  "Diversification geographique",
  "Croissance reguliere",
  "Faible endettement",
  "Avantage concurrentiel durable",
  "Qualite du management",
];

const SECONDARY_CRITERIA = [
  "PER raisonnable",
  "Forte tresorerie",
  "Marge elevee",
  "Historique stable",
  "Innovation",
  "Leadership sectoriel",
  "Dividende regulier",
];

const COMPANIES: Company[] = [
  {
    name: "Entreprise A",
    sector: "Technologie",
    thesis: "Plateforme logicielle europeenne a forte recurrence.",
  },
  {
    name: "Entreprise B",
    sector: "Sante",
    thesis: "Positionnement defensif avec portefeuille brevete.",
  },
  {
    name: "Entreprise C",
    sector: "Industrie",
    thesis: "Leader regional avec visibilite long terme sur les contrats.",
  },
  {
    name: "Entreprise D",
    sector: "Finance",
    thesis: "Gestion d'actifs premium orientee patrimoine.",
  },
];

export default function MomoIA() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [primaryCriteria, setPrimaryCriteria] = useState<string[]>([]);
  const [secondaryCriteria, setSecondaryCriteria] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsLoggedIn(localStorage.getItem("mainagent:logged-in") === "true");
  }, []);

  useEffect(() => {
    if (stage === "analysis" && !selectedCompany) {
      setStage("results");
    }
  }, [selectedCompany, stage]);

  const stepConfig = useMemo(
    () => [
      {
        title: "Choisir un secteur",
        description:
          "Selectionnez un secteur pour orienter la recherche de MomoIA.",
        options: SECTORS,
        multi: false,
      },
      {
        title: "Choisir des criteres principaux",
        description:
          "Selection multiple possible. Ces criteres donnent la direction majeure.",
        options: PRIMARY_CRITERIA,
        multi: true,
      },
      {
        title: "Choisir des criteres secondaires",
        description:
          "Affinez votre filtre avec des indicateurs complementaires.",
        options: SECONDARY_CRITERIA,
        multi: true,
      },
    ],
    []
  );

  const stepInfo = stepConfig[step];

  const selectedOptions = useMemo(() => {
    if (step === 0) return selectedSector ? [selectedSector] : [];
    if (step === 1) return primaryCriteria;
    return secondaryCriteria;
  }, [primaryCriteria, secondaryCriteria, selectedSector, step]);

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(selectedSector);
    if (step === 1) return primaryCriteria.length > 0;
    return secondaryCriteria.length > 0;
  }, [primaryCriteria.length, secondaryCriteria.length, selectedSector, step]);

  const toggleMulti = (
    value: string,
    list: string[],
    setter: (next: string[]) => void
  ) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleOptionSelect = (value: string) => {
    if (step === 0) {
      setSelectedSector(value);
      return;
    }
    if (step === 1) {
      toggleMulti(value, primaryCriteria, setPrimaryCriteria);
      return;
    }
    toggleMulti(value, secondaryCriteria, setSecondaryCriteria);
  };

  const handleNext = () => {
    if (!canContinue) return;
    if (step < 2) {
      setStep((prev) => prev + 1);
    } else {
      setStage("results");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else {
      setStage("intro");
    }
  };

  const handleSave = () => {
    if (!isLoggedIn) {
      setSaveMessage("Vous devez etre connecte pour sauvegarder vos resultats.");
      window.setTimeout(() => {
        router.push("/login");
      }, 800);
      return;
    }
    setSaveMessage("Resultats sauvegardes avec succes.");
  };

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setAnalysisStep(0);
    setStage("analysis");
  };

  const analysisPages = useMemo(() => {
    if (!selectedCompany) return [];
    return [
      {
        label: "Presentation globale",
        title: "Activite et positionnement",
        body: [
          `${selectedCompany.name} opere sur le secteur ${selectedCompany.sector} avec une approche orientee qualite et visibilite long terme.`,
          "Son positionnement premium lui permet de preserver ses marges tout en renforcant la relation client.",
        ],
        bullets: [
          "Activite centree sur des revenus recurrents.",
          "Positionnement clair sur un segment haut de gamme.",
          "Capacite a maintenir une croissance reguliere.",
        ],
      },
      {
        label: "Analyse financiere",
        title: "Forces et risques",
        body: [
          "La structure financiere est equilibree avec une discipline d'investissement continue.",
          "Les flux de tresorerie permettent de financer l'innovation sans surendettement.",
        ],
        bullets: [
          "Forces : marges stables, generation de cash solide.",
          "Risques : exposition cyclique moderee, pression concurrentielle ponctuelle.",
          "Sensibilite limitee aux variations de taux grace a une dette maitrisee.",
        ],
      },
      {
        label: "Synthese IA",
        title: "Positionnement strategique",
        body: [
          "L'analyse IA confirme une trajectoire coherente avec une vision de long terme.",
          "Le profil correspond a une strategie patrimoniale prudente et selective.",
        ],
        bullets: [
          "Conclusion : entreprise solide, alignee avec les criteres selectionnes.",
          "Recommandation : approfondir la gouvernance et la dynamique sectorielle.",
        ],
      },
    ];
  }, [selectedCompany]);

  return (
    <PageShell align="center" density={28}>
      <div className="w-full space-y-8">
        {stage === "intro" ? (
          <div className="premium-panel w-full px-8 py-12 text-center sm:px-12 sm:py-14">
            <p className="eyebrow">MomoIA</p>
            <h1 className="mt-4 font-display text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Construisez votre liste d'investissement avec l'IA.
            </h1>
            <p className="mt-5 text-base text-slate-600 sm:text-lg">
              MomoIA vous aide a constituer une liste de suivi personnalisee selon
              votre secteur cible, vos criteres financiers et votre vision long
              terme.
            </p>
            <div className="mt-8 flex items-center justify-center">
              <Button
                type="button"
                variant="outline"
                className="cta-soft rounded-full px-8 py-3 text-xs sm:text-sm"
                onClick={() => {
                  setStage("steps");
                  setStep(0);
                }}
              >
                Start the experience
              </Button>
            </div>
          </div>
        ) : null}

        {stage === "steps" ? (
          <div className="premium-panel w-full px-8 py-10 sm:px-12 sm:py-12">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Parcours MomoIA</p>
                <h2 className="mt-3 font-display text-2xl text-slate-900 sm:text-3xl">
                  {stepInfo.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {stepInfo.description}
                </p>
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Etape {step + 1}/3
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stepInfo.options.map((option) => {
                const isSelected = selectedOptions.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    className={cn(
                      "selection-card",
                      isSelected && "is-selected"
                    )}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <span>{option}</span>
                    {isSelected ? (
                      <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        Selectionne
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                className="cta-soft shadow-none hover:shadow-none"
                onClick={handleBack}
              >
                Retour
              </Button>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "cta-soft shadow-none hover:shadow-none",
                  !canContinue && "opacity-50 pointer-events-none"
                )}
                onClick={handleNext}
              >
                Continuer
              </Button>
            </div>
          </div>
        ) : null}

        {stage === "results" ? (
          <div className="premium-panel w-full px-8 py-10 sm:px-12 sm:py-12">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Resultat IA (simulation)</p>
                <h2 className="mt-3 font-display text-2xl text-slate-900 sm:text-3xl">
                  Liste de suivi suggeree
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Secteur : {selectedSector ?? "-"}  -  Criteres principaux :
                  {primaryCriteria.length
                    ? ` ${primaryCriteria.join(", ")}`
                    : " -"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="cta-soft shadow-none hover:shadow-none"
                onClick={handleSave}
              >
                Save Results
              </Button>
            </div>
            {saveMessage ? (
              <p className="mt-3 text-xs text-slate-500">{saveMessage}</p>
            ) : null}

            <div className="mt-6 grid gap-3">
              {COMPANIES.map((company) => (
                <button
                  key={company.name}
                  type="button"
                  className="selection-card"
                  onClick={() => handleCompanyClick(company)}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {company.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {company.sector}  -  {company.thesis}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Voir l'analyse
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                className="cta-soft shadow-none hover:shadow-none"
                onClick={() => {
                  setStage("steps");
                  setStep(0);
                }}
              >
                Modifier les criteres
              </Button>
            </div>
          </div>
        ) : null}

        {stage === "analysis" && selectedCompany ? (
          <div className="premium-panel w-full px-8 py-10 sm:px-12 sm:py-12">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Analyse IA</p>
                <h2 className="mt-3 font-display text-2xl text-slate-900 sm:text-3xl">
                  {selectedCompany.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Secteur {selectedCompany.sector}  -  Vue synthetique en 3 pages.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="cta-soft shadow-none hover:shadow-none"
                onClick={() => setStage("results")}
              >
                Retour a la liste
              </Button>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-[rgba(120,105,85,0.18)] bg-white/65">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,0.7,0.26,1)]"
                style={{ transform: `translateX(-${analysisStep * 100}%)` }}
              >
                {analysisPages.map((page) => (
                  <div key={page.label} className="min-w-full px-6 py-6 sm:px-8">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                      {page.label}
                    </p>
                    <h3 className="mt-3 font-display text-2xl text-slate-900">
                      {page.title}
                    </h3>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      {page.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      {page.bullets.map((bullet) => (
                        <li key={bullet}>- {bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Page {analysisStep + 1}/3
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "cta-soft shadow-none hover:shadow-none",
                    analysisStep === 0 && "opacity-50 pointer-events-none"
                  )}
                  onClick={() =>
                    setAnalysisStep((prev) => Math.max(0, prev - 1))
                  }
                >
                  Precedent
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "cta-soft shadow-none hover:shadow-none",
                    analysisStep === 2 && "opacity-50 pointer-events-none"
                  )}
                  onClick={() =>
                    setAnalysisStep((prev) => Math.min(2, prev + 1))
                  }
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}

