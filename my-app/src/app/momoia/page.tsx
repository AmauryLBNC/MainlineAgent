"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/Base/PageShell";
import { cn } from "@/lib/utils";

type Stage = "intro" | "steps" | "results";

type StepOption = {
  id: string;
  label: string;
};

type StepConfig = {
  id: string;
  title: string;
  description: string;
  options: StepOption[];
  multi: boolean;
};

type SaveMessageKey = "needLogin" | "success";

type CompanyResult = {
  id: number;
  slug: string;
  name: string;
  ticker: string | null;
  sector: string;
  country: string | null;
  website: string | null;
  thesis: {
    fr: string;
    en: string;
  };
  latestMetrics: {
    peRatio: number | null;
    netMargin: number | null;
  } | null;
};

export default function MomoIA() {
  const router = useRouter();
  const { status } = useSession();
  const { copy, language } = useI18n();

  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [primaryCriteria, setPrimaryCriteria] = useState<string[]>([]);
  const [secondaryCriteria, setSecondaryCriteria] = useState<string[]>([]);
  const [saveMessageKey, setSaveMessageKey] = useState<SaveMessageKey | null>(
    null
  );
  const [companies, setCompanies] = useState<CompanyResult[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCompanies() {
      try {
        const response = await fetch("/api/companies");
        const payload = (await response.json()) as {
          companies?: CompanyResult[];
        };

        if (!isMounted) {
          return;
        }

        setCompanies(Array.isArray(payload.companies) ? payload.companies : []);
      } catch {
        if (!isMounted) {
          return;
        }

        setCompanies([]);
      } finally {
        if (isMounted) {
          setIsLoadingCompanies(false);
        }
      }
    }

    loadCompanies();

    return () => {
      isMounted = false;
    };
  }, []);

  const stepConfig = useMemo<StepConfig[]>(() => {
    return copy.momoia.steps.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      options: item.options,
      multi: item.multi,
    }));
  }, [copy]);

  const stepInfo = stepConfig[step];

  const optionLabelById = useMemo<Record<string, string>>(() => {
    return stepConfig.reduce<Record<string, string>>((acc, currentStep) => {
      currentStep.options.forEach((option) => {
        acc[option.id] = option.label;
      });
      return acc;
    }, {});
  }, [stepConfig]);

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

  const visibleCompanies = useMemo(() => {
    if (!selectedSector) {
      return companies;
    }

    const filtered = companies.filter((company) => company.sector === selectedSector);
    return filtered.length > 0 ? filtered : companies;
  }, [companies, selectedSector]);

  const toggleMulti = (
    value: string,
    list: string[],
    setter: (next: string[]) => void
  ) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
      return;
    }

    setter([...list, value]);
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

    if (step < stepConfig.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    setStage("results");
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
      return;
    }

    setStage("intro");
  };

  const handleSave = () => {
    if (status !== "authenticated") {
      setSaveMessageKey("needLogin");
      window.setTimeout(() => {
        router.push("/login?callbackUrl=/momoia");
      }, 800);
      return;
    }

    setSaveMessageKey("success");
  };

  const selectedSectorLabel = selectedSector
    ? (optionLabelById[selectedSector] ?? selectedSector)
    : "-";

  const selectedPrimaryLabels = primaryCriteria.length
    ? primaryCriteria
        .map((criterionId) => optionLabelById[criterionId] ?? criterionId)
        .join(", ")
    : "-";

  return (
    <PageShell align="center" density={28}>
      <div className="w-full space-y-8">
        {stage === "intro" ? (
          <div className="premium-panel w-full px-8 py-12 text-center sm:px-12 sm:py-14">
            <p className="eyebrow">{copy.momoia.intro.eyebrow}</p>
            <h1 className="mt-4 font-display text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {copy.momoia.intro.title}
            </h1>
            <p className="mt-5 text-base text-slate-600 sm:text-lg">
              {copy.momoia.intro.description}
            </p>
            <div className="mt-8 flex items-center justify-center">
              <Button
                type="button"
                variant="outline"
                className="cta-soft rounded-full px-8 py-3 text-xs sm:text-sm"
                onClick={() => {
                  setStage("steps");
                  setStep(0);
                  setSaveMessageKey(null);
                }}
              >
                {copy.momoia.intro.startButton}
              </Button>
            </div>
          </div>
        ) : null}

        {stage === "steps" && stepInfo ? (
          <div className="premium-panel w-full px-8 py-10 sm:px-12 sm:py-12">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{copy.momoia.steps.eyebrow}</p>
                <h2 className="mt-3 font-display text-2xl text-slate-900 sm:text-3xl">
                  {stepInfo.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {stepInfo.description}
                </p>
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                {copy.momoia.steps.stepLabel} {step + 1}/{stepConfig.length}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stepInfo.options.map((option) => {
                const isSelected = selectedOptions.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={cn("selection-card", isSelected && "is-selected")}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <span>{option.label}</span>
                    {isSelected ? (
                      <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                        {copy.momoia.steps.selectedBadge}
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
                {copy.common.back}
              </Button>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "cta-soft shadow-none hover:shadow-none",
                  !canContinue && "pointer-events-none opacity-50"
                )}
                onClick={handleNext}
              >
                {copy.common.next}
              </Button>
            </div>
          </div>
        ) : null}

        {stage === "results" ? (
          <div className="premium-panel w-full px-8 py-10 sm:px-12 sm:py-12">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{copy.momoia.results.eyebrow}</p>
                <h2 className="mt-3 font-display text-2xl text-slate-900 sm:text-3xl">
                  {copy.momoia.results.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {copy.momoia.results.sectorLabel}: {selectedSectorLabel} -{" "}
                  {copy.momoia.results.primaryCriteriaLabel}: {selectedPrimaryLabels}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="cta-soft shadow-none hover:shadow-none"
                onClick={handleSave}
              >
                {copy.momoia.results.saveButton}
              </Button>
            </div>

            {saveMessageKey ? (
              <p className="mt-3 text-xs text-slate-500">
                {copy.momoia.results.saveMessages[saveMessageKey]}
              </p>
            ) : null}

            <div className="mt-6 grid gap-3">
              {isLoadingCompanies ? (
                <div className="rounded-3xl border border-[rgba(120,105,85,0.18)] bg-white/65 px-6 py-5 text-sm text-slate-500">
                  {copy.momoia.results.loadingCompanies}
                </div>
              ) : null}

              {!isLoadingCompanies && visibleCompanies.length === 0 ? (
                <div className="rounded-3xl border border-[rgba(120,105,85,0.18)] bg-white/65 px-6 py-5 text-sm text-slate-500">
                  {copy.momoia.results.emptyResults}
                </div>
              ) : null}

              {!isLoadingCompanies
                ? visibleCompanies.map((company) => {
                    const companySectorLabel =
                      optionLabelById[company.sector] ?? company.sector;
                    const thesis =
                      language === "fr"
                        ? company.thesis.fr
                        : company.thesis.en;

                    return (
                      <button
                        key={company.slug}
                        type="button"
                        className="selection-card"
                        onClick={() =>
                          router.push(`/momoia/entreprises/${company.slug}`)
                        }
                      >
                        <div className="text-left">
                          <p className="text-sm font-semibold text-slate-900">
                            {company.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {companySectorLabel} - {thesis}
                          </p>
                          {company.latestMetrics ? (
                            <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-slate-400">
                              {company.latestMetrics.peRatio !== null
                                ? `P/E ${company.latestMetrics.peRatio.toFixed(1)}x`
                                : ""}
                              {company.latestMetrics.peRatio !== null &&
                              company.latestMetrics.netMargin !== null
                                ? " - "
                                : ""}
                              {company.latestMetrics.netMargin !== null
                                ? `Margin ${company.latestMetrics.netMargin.toFixed(1)}%`
                                : ""}
                            </p>
                          ) : null}
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                          {copy.momoia.results.viewCompanyPage}
                        </span>
                      </button>
                    );
                  })
                : null}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                className="cta-soft shadow-none hover:shadow-none"
                onClick={() => {
                  setStage("steps");
                  setStep(0);
                  setSaveMessageKey(null);
                }}
              >
                {copy.momoia.results.editCriteria}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
