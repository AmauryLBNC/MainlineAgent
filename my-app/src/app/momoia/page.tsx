"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/Base/PageShell";
import { cn } from "@/lib/utils";

type Stage = "intro" | "steps" | "results" | "analysis";

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

export default function MomoIA() {
  const router = useRouter();
  const { copy } = useI18n();

  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [primaryCriteria, setPrimaryCriteria] = useState<string[]>([]);
  const [secondaryCriteria, setSecondaryCriteria] = useState<string[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [saveMessageKey, setSaveMessageKey] = useState<SaveMessageKey | null>(
    null
  );
  const [isLoggedIn] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("mainagent:logged-in") === "true";
  });

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

  const selectedCompany = useMemo(() => {
    if (!selectedCompanyId) return null;
    return (
      copy.momoia.results.companies.find((company) => company.id === selectedCompanyId) ??
      null
    );
  }, [copy, selectedCompanyId]);

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
    if (!isLoggedIn) {
      setSaveMessageKey("needLogin");
      window.setTimeout(() => {
        router.push("/login");
      }, 800);
      return;
    }
    setSaveMessageKey("success");
  };

  const handleCompanyClick = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setAnalysisStep(0);
    setStage("analysis");
  };

  const selectedSectorLabel = selectedSector
    ? (optionLabelById[selectedSector] ?? selectedSector)
    : "-";

  const selectedPrimaryLabels = primaryCriteria.length
    ? primaryCriteria
        .map((criterionId) => optionLabelById[criterionId] ?? criterionId)
        .join(", ")
    : "-";

  const analysisPages = useMemo(() => {
    if (!selectedCompany) return [];

    const companySectorLabel =
      optionLabelById[selectedCompany.sectorId] ?? selectedCompany.sectorId;

    return copy.momoia.analysis.pages.map((page) => ({
      ...page,
      body: page.body.map((paragraph) =>
        paragraph
          .replace("{company}", selectedCompany.name)
          .replace("{sector}", companySectorLabel)
      ),
    }));
  }, [copy, optionLabelById, selectedCompany]);

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
              {copy.momoia.results.companies.map((company) => {
                const companySectorLabel =
                  optionLabelById[company.sectorId] ?? company.sectorId;

                return (
                  <button
                    key={company.id}
                    type="button"
                    className="selection-card"
                    onClick={() => handleCompanyClick(company.id)}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {company.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {companySectorLabel} - {company.thesis}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      {copy.momoia.results.viewAnalysis}
                    </span>
                  </button>
                );
              })}
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

        {stage === "analysis" && selectedCompany ? (
          <div className="premium-panel w-full px-8 py-10 sm:px-12 sm:py-12">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{copy.momoia.analysis.eyebrow}</p>
                <h2 className="mt-3 font-display text-2xl text-slate-900 sm:text-3xl">
                  {selectedCompany.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {copy.momoia.analysis.sectorLabel}{" "}
                  {optionLabelById[selectedCompany.sectorId] ??
                    selectedCompany.sectorId}{" "}
                  - {copy.momoia.analysis.summarySuffix}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="cta-soft shadow-none hover:shadow-none"
                onClick={() => setStage("results")}
              >
                {copy.momoia.analysis.backToList}
              </Button>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-[rgba(120,105,85,0.18)] bg-white/65">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,0.7,0.26,1)]"
                style={{ transform: `translateX(-${analysisStep * 100}%)` }}
              >
                {analysisPages.map((page) => (
                  <div key={page.id} className="min-w-full px-6 py-6 sm:px-8">
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
                {copy.momoia.analysis.pageLabel} {analysisStep + 1}/{analysisPages.length}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "cta-soft shadow-none hover:shadow-none",
                    analysisStep === 0 && "pointer-events-none opacity-50"
                  )}
                  onClick={() =>
                    setAnalysisStep((prev) => Math.max(0, prev - 1))
                  }
                >
                  {copy.common.previous}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "cta-soft shadow-none hover:shadow-none",
                    analysisStep >= analysisPages.length - 1 &&
                      "pointer-events-none opacity-50"
                  )}
                  onClick={() =>
                    setAnalysisStep((prev) =>
                      Math.min(analysisPages.length - 1, prev + 1)
                    )
                  }
                >
                  {copy.common.next}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
