"use client";

import type { FormEvent } from "react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  RiCloseLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiSearchLine,
  RiSparklingLine,
} from "@remixicon/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/components/i18n/LanguageProvider";
import type {
  BuffettCompanyLookupResult,
  BuffettScoreResult,
  BuffettSearchSuggestion,
} from "@/lib/buffett-api";
import { cn } from "@/lib/utils";

type CompanyDataFieldId =
  | "revenue"
  | "netIncome"
  | "debt"
  | "shareholdersEquity"
  | "freeCashFlow"
  | "ebitda"
  | "peRatio"
  | "netMargin"
  | "marketPrice";

type BuffettFormState = {
  name: string;
  sector: string;
  country: string;
  revenue: string;
  netIncome: string;
  debt: string;
  shareholdersEquity: string;
  freeCashFlow: string;
  ebitda: string;
  peRatio: string;
  netMargin: string;
  environmentalScore: string;
  socialScore: string;
  governanceScore: string;
};

type ScoredCompanyEntry = {
  id: string;
  symbol: string | null;
  result: BuffettScoreResult;
  company: BuffettCompanyLookupResult | null;
  formState: BuffettFormState;
  missingDataFields: CompanyDataFieldId[];
  updatedAt: number;
};

const INITIAL_FORM_STATE: BuffettFormState = {
  name: "",
  sector: "technology",
  country: "",
  revenue: "",
  netIncome: "",
  debt: "0",
  shareholdersEquity: "",
  freeCashFlow: "",
  ebitda: "",
  peRatio: "15",
  netMargin: "",
  environmentalScore: "60",
  socialScore: "60",
  governanceScore: "60",
};

const RAW_COMPANY_REVIEW_FIELDS: Array<{
  id: CompanyDataFieldId;
  getValue: (company: BuffettCompanyLookupResult) => number | null;
}> = [
  { id: "revenue", getValue: (company) => company.revenue },
  { id: "netIncome", getValue: (company) => company.netIncome },
  { id: "debt", getValue: (company) => company.debt },
  { id: "shareholdersEquity", getValue: (company) => company.shareholdersEquity },
  { id: "freeCashFlow", getValue: (company) => company.freeCashFlow },
  { id: "ebitda", getValue: (company) => company.ebitda },
  { id: "peRatio", getValue: (company) => company.peRatio },
  { id: "netMargin", getValue: (company) => company.netMargin },
  { id: "marketPrice", getValue: (company) => company.marketPrice },
];

type FormFieldProps = {
  id: keyof BuffettFormState;
  label: string;
  value: string;
  onValueChange: (id: keyof BuffettFormState, value: string) => void;
  error?: string;
  type?: "text" | "number";
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
};

function formatNumericInput(value: number | null | undefined, fallback = "") {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return fallback;
  }

  const roundedValue = Number(value.toFixed(2));
  return Number.isInteger(roundedValue)
    ? String(roundedValue)
    : String(roundedValue);
}

function parseOptionalNumericInput(value: string) {
  const trimmedValue = value.trim().replace(",", ".");

  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function buildSearchLabel(company: BuffettCompanyLookupResult) {
  return `${company.name} (${company.symbol})`;
}

function buildScoredEntryId(
  state: BuffettFormState,
  company: BuffettCompanyLookupResult | null
) {
  if (company?.symbol) {
    return company.symbol.toUpperCase();
  }

  const normalizedName = state.name.trim().toLowerCase().replace(/\s+/g, "-");
  return `manual:${normalizedName || "untitled"}`;
}

function mergeCompanyWithFormState(
  company: BuffettCompanyLookupResult | null,
  state: BuffettFormState
): BuffettCompanyLookupResult | null {
  if (!company) {
    return null;
  }

  return {
    ...company,
    name: state.name.trim() || company.name,
    sector: state.sector.trim() || company.sector,
    country: state.country.trim() || company.country,
    revenue: parseOptionalNumericInput(state.revenue),
    netIncome: parseOptionalNumericInput(state.netIncome),
    debt: parseOptionalNumericInput(state.debt),
    shareholdersEquity: parseOptionalNumericInput(state.shareholdersEquity),
    freeCashFlow: parseOptionalNumericInput(state.freeCashFlow),
    ebitda: parseOptionalNumericInput(state.ebitda),
    peRatio: parseOptionalNumericInput(state.peRatio),
    netMargin: parseOptionalNumericInput(state.netMargin),
    environmentalScore: parseOptionalNumericInput(state.environmentalScore),
    socialScore: parseOptionalNumericInput(state.socialScore),
    governanceScore: parseOptionalNumericInput(state.governanceScore),
  };
}

function formatHeadquarters(company: BuffettCompanyLookupResult | null) {
  if (!company) {
    return "";
  }

  return [company.city, company.state, company.country].filter(Boolean).join(", ");
}

function getMissingCompanyDataFields(
  company: BuffettCompanyLookupResult | null
): CompanyDataFieldId[] {
  if (!company) {
    return [];
  }

  return RAW_COMPANY_REVIEW_FIELDS.filter(
    (field) => field.getValue(company) === null
  ).map((field) => field.id);
}

function FormField({
  id,
  label,
  value,
  onValueChange,
  error,
  type = "text",
  placeholder,
  min,
  max,
  step,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-[0.2em]"
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-11 rounded-2xl px-4 text-sm",
          error && "border-destructive"
        )}
        onChange={(event) => onValueChange(id, event.target.value)}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export default function BuffettScorePanel() {
  const { copy, language } = useI18n();
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [result, setResult] = useState<BuffettScoreResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<BuffettSearchSuggestion[]>([]);
  const [selectedCompany, setSelectedCompany] =
    useState<BuffettCompanyLookupResult | null>(null);
  const [scoredEntries, setScoredEntries] = useState<ScoredCompanyEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchErrorMessage, setSearchErrorMessage] = useState<string | null>(
    null
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const scoreToolCopy = copy.momoia.scoreTool;
  const sectorOptions =
    copy.momoia.steps.items.find((item) => item.id === "sector")?.options ?? [];
  const locale = language === "fr" ? "fr-FR" : "en-US";
  const numberFormatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }, [locale]);

  const integerFormatter = useMemo(() => {
    return new Intl.NumberFormat(locale);
  }, [locale]);

  const rankedEntries = useMemo(() => {
    return [...scoredEntries].sort((leftEntry, rightEntry) => {
      if (rightEntry.result.score !== leftEntry.result.score) {
        return rightEntry.result.score - leftEntry.result.score;
      }

      return rightEntry.updatedAt - leftEntry.updatedAt;
    });
  }, [scoredEntries]);

  const componentEntries = useMemo(() => {
    if (!result) {
      return [];
    }

    return Object.entries(result.componentScores).sort(
      ([, leftScore], [, rightScore]) => rightScore - leftScore
    );
  }, [result]);

  const tierLabel = result
    ? scoreToolCopy.tiers[result.tier as keyof typeof scoreToolCopy.tiers] ??
      result.tier
    : null;

  const headquartersLabel = useMemo(
    () => formatHeadquarters(selectedCompany),
    [selectedCompany]
  );

  useEffect(() => {
    const normalizedQuery = deferredSearchQuery.trim();
    const selectedQueryLabel = selectedCompany
      ? buildSearchLabel(selectedCompany)
      : null;

    if (normalizedQuery.length < 2) {
      setSuggestions([]);
      setSearchErrorMessage(null);
      setIsSearching(false);
      return;
    }

    if (selectedQueryLabel && normalizedQuery === selectedQueryLabel) {
      setSuggestions([]);
      setSearchErrorMessage(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchErrorMessage(null);

      try {
        const response = await fetch(
          `/api/buffett/search?q=${encodeURIComponent(normalizedQuery)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );
        const payload = (await response.json().catch(() => null)) as
          | { error?: string; companies?: BuffettSearchSuggestion[] }
          | null;

        if (!response.ok) {
          setSuggestions([]);
          setSearchErrorMessage(
            payload?.error ?? scoreToolCopy.searchUnavailableMessage
          );
          return;
        }

        setSuggestions(Array.isArray(payload?.companies) ? payload.companies : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSuggestions([]);
        setSearchErrorMessage(scoreToolCopy.searchUnavailableMessage);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [
    deferredSearchQuery,
    scoreToolCopy.searchUnavailableMessage,
    selectedCompany,
  ]);

  function updateField(id: keyof BuffettFormState, value: string) {
    setFormState((currentState) => ({
      ...currentState,
      [id]: value,
    }));

    setFieldErrors((currentErrors) => {
      if (!currentErrors[id]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[id];
      return nextErrors;
    });
  }

  function buildScorePayload(state: BuffettFormState) {
    return {
      ...state,
      country: state.country.trim() || null,
      netMargin: state.netMargin.trim() || null,
      shareholdersEquity: state.shareholdersEquity.trim() || null,
    };
  }

  function resolveSelectedCompanyForState(state: BuffettFormState) {
    if (!selectedCompany) {
      return null;
    }

    if (
      state.name.trim() &&
      state.name.trim().toLowerCase() !==
        selectedCompany.name.trim().toLowerCase()
    ) {
      return null;
    }

    return mergeCompanyWithFormState(selectedCompany, state);
  }

  function getMissingFieldLabels(fieldIds: CompanyDataFieldId[]) {
    return fieldIds.map((fieldId) => {
      if (fieldId === "marketPrice") {
        return scoreToolCopy.marketPriceLabel;
      }

      return (
        scoreToolCopy.fields[
          fieldId as keyof typeof scoreToolCopy.fields
        ] ?? fieldId
      );
    });
  }

  function formatMarketPrice(company: BuffettCompanyLookupResult | null) {
    if (!company || company.marketPrice === null) {
      return null;
    }

    if (company.currency) {
      try {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: company.currency,
          maximumFractionDigits: 2,
        }).format(company.marketPrice);
      } catch {
        return numberFormatter.format(company.marketPrice);
      }
    }

    return numberFormatter.format(company.marketPrice);
  }

  function upsertScoredEntry(
    scoredResult: BuffettScoreResult,
    state: BuffettFormState,
    company: BuffettCompanyLookupResult | null,
    missingDataFields: CompanyDataFieldId[]
  ) {
    const entryId = buildScoredEntryId(state, company);
    const nextEntry: ScoredCompanyEntry = {
      id: entryId,
      symbol: company?.symbol ?? null,
      result: scoredResult,
      company,
      formState: { ...state },
      missingDataFields,
      updatedAt: Date.now(),
    };

    setScoredEntries((currentEntries) => {
      const existingIndex = currentEntries.findIndex(
        (entry) => entry.id === entryId
      );

      if (existingIndex === -1) {
        return [nextEntry, ...currentEntries];
      }

      return currentEntries.map((entry) =>
        entry.id === entryId ? nextEntry : entry
      );
    });
    setActiveEntryId(entryId);
  }

  function handleScoredEntrySelect(entry: ScoredCompanyEntry) {
    setActiveEntryId(entry.id);
    setSelectedCompany(entry.company);
    setResult(entry.result);
    setFormState(entry.formState);
    setSearchQuery(
      entry.company ? buildSearchLabel(entry.company) : entry.formState.name
    );
    setSuggestions([]);
    setFieldErrors({});
    setErrorMessage(null);
    setSearchErrorMessage(null);
    setShowAdvancedFields(entry.missingDataFields.length > 0);
  }

  function handleRemoveScoredEntry(entryId: string) {
    const nextEntries = scoredEntries.filter((entry) => entry.id !== entryId);
    setScoredEntries(nextEntries);

    if (activeEntryId !== entryId) {
      return;
    }

    const nextActiveEntry =
      [...nextEntries].sort((leftEntry, rightEntry) => {
        if (rightEntry.result.score !== leftEntry.result.score) {
          return rightEntry.result.score - leftEntry.result.score;
        }

        return rightEntry.updatedAt - leftEntry.updatedAt;
      })[0] ?? null;

    if (!nextActiveEntry) {
      setActiveEntryId(null);
      setResult(null);
      setSelectedCompany(null);
      setShowAdvancedFields(false);
      return;
    }

    handleScoredEntrySelect(nextActiveEntry);
  }

  async function requestScore(
    state: BuffettFormState,
    companyOverride: BuffettCompanyLookupResult | null = resolveSelectedCompanyForState(
      state
    )
  ) {
    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/buffett/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildScorePayload(state)),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; fieldErrors?: Record<string, string> }
        | BuffettScoreResult
        | null;

      if (!response.ok) {
        setErrorMessage(
          typeof payload === "object" && payload && "error" in payload
            ? payload.error ?? scoreToolCopy.unavailableMessage
            : scoreToolCopy.unavailableMessage
        );
        setFieldErrors(
          typeof payload === "object" &&
            payload &&
            "fieldErrors" in payload &&
            payload.fieldErrors
            ? payload.fieldErrors
            : {}
        );
        setShowAdvancedFields(true);
        return;
      }

      const scoredResult = payload as BuffettScoreResult;
      const companyForEntry = mergeCompanyWithFormState(companyOverride, state);
      const missingDataFields = getMissingCompanyDataFields(companyOverride);

      setResult(scoredResult);
      setSelectedCompany(companyForEntry);
      upsertScoredEntry(
        scoredResult,
        state,
        companyForEntry,
        missingDataFields
      );
    } catch {
      setErrorMessage(scoreToolCopy.unavailableMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await requestScore(formState);
  }

  async function handleSuggestionSelect(suggestion: BuffettSearchSuggestion) {
    setIsLoadingCompany(true);
    setSearchErrorMessage(null);

    try {
      const response = await fetch(
        `/api/buffett/company?symbol=${encodeURIComponent(suggestion.symbol)}`,
        {
          cache: "no-store",
        }
      );
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | BuffettCompanyLookupResult
        | null;

      if (!response.ok) {
        setSearchErrorMessage(
          typeof payload === "object" && payload && "error" in payload
            ? payload.error ?? scoreToolCopy.lookupUnavailableMessage
            : scoreToolCopy.lookupUnavailableMessage
        );
        return;
      }

      const company = payload as BuffettCompanyLookupResult;
      const nextFormState: BuffettFormState = {
        name: company.name,
        sector: company.sector,
        country: company.country ?? "",
        revenue: formatNumericInput(company.revenue),
        netIncome: formatNumericInput(company.netIncome),
        debt: formatNumericInput(company.debt, "0"),
        shareholdersEquity: formatNumericInput(company.shareholdersEquity),
        freeCashFlow: formatNumericInput(company.freeCashFlow),
        ebitda: formatNumericInput(company.ebitda),
        peRatio: formatNumericInput(company.peRatio, "15"),
        netMargin: formatNumericInput(company.netMargin),
        environmentalScore: formatNumericInput(company.environmentalScore, "60"),
        socialScore: formatNumericInput(company.socialScore, "60"),
        governanceScore: formatNumericInput(company.governanceScore, "60"),
      };

      setSelectedCompany(company);
      setFormState(nextFormState);
      setSearchQuery(buildSearchLabel(company));
      setSuggestions([]);
      setShowAdvancedFields(getMissingCompanyDataFields(company).length > 0);
      await requestScore(nextFormState, company);
    } catch {
      setSearchErrorMessage(scoreToolCopy.lookupUnavailableMessage);
    } finally {
      setIsLoadingCompany(false);
    }
  }

  function handleReset() {
    setFormState(INITIAL_FORM_STATE);
    setResult(null);
    setErrorMessage(null);
    setSearchErrorMessage(null);
    setFieldErrors({});
    setSearchQuery("");
    setSuggestions([]);
    setSelectedCompany(null);
    setActiveEntryId(null);
    setShowAdvancedFields(false);
  }

  return (
    <Card className="app-panel rounded-[2rem] border-0 py-0">
      <CardContent className="grid gap-6 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.15fr_0.85fr]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-[1.75rem] border border-border/60 bg-background/50 px-5 py-5">
            <div className="space-y-2">
              <Label
                htmlFor="company-search"
                className="text-xs font-medium uppercase tracking-[0.2em]"
              >
                {scoreToolCopy.searchLabel}
              </Label>
              <div className="relative">
                <RiSearchLine className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="company-search"
                  value={searchQuery}
                  placeholder={scoreToolCopy.searchPlaceholder}
                  className="h-12 rounded-2xl pr-12 pl-10 text-sm"
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                {searchQuery || selectedCompany ? (
                  <button
                    type="button"
                    aria-label={scoreToolCopy.resetButton}
                    className="absolute top-1/2 right-4 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={handleReset}
                  >
                    <RiCloseLine className="size-4" />
                  </button>
                ) : null}
              </div>
            </div>

            {selectedCompany ? (
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full px-2.5">
                  {selectedCompany.symbol}
                </Badge>
                {selectedCompany.exchange ? (
                  <Badge variant="secondary" className="rounded-full px-2.5">
                    {selectedCompany.exchange}
                  </Badge>
                ) : null}
                {formatMarketPrice(selectedCompany) ? (
                  <Badge className="rounded-full px-2.5">
                    {scoreToolCopy.marketPriceLabel}:{" "}
                    {formatMarketPrice(selectedCompany)}
                  </Badge>
                ) : null}
              </div>
            ) : null}

            {searchErrorMessage ? (
              <Alert className="rounded-2xl">
                <AlertTitle>{scoreToolCopy.searchErrorTitle}</AlertTitle>
                <AlertDescription>{searchErrorMessage}</AlertDescription>
              </Alert>
            ) : null}

            {isSearching ? (
              <p className="text-sm text-muted-foreground">
                {scoreToolCopy.searchLoading}
              </p>
            ) : null}

            {!isSearching && suggestions.length > 0 ? (
              <div className="grid gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={`${suggestion.symbol}-${suggestion.exchange ?? "unknown"}`}
                    type="button"
                    variant="outline"
                    className="app-choice h-auto justify-between rounded-2xl px-4 py-4 text-left whitespace-normal"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {suggestion.name}
                        </span>
                        <Badge variant="secondary" className="rounded-full px-2.5">
                          {suggestion.symbol}
                        </Badge>
                      </div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {[suggestion.exchange, suggestion.sector, suggestion.industry]
                          .filter(Boolean)
                          .join(" / ")}
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-full px-2.5">
                      {scoreToolCopy.prefillButton}
                    </Badge>
                  </Button>
                ))}
              </div>
            ) : null}

            {!isSearching &&
            deferredSearchQuery.trim().length >= 2 &&
            suggestions.length === 0 &&
            !searchErrorMessage ? (
              <p className="text-sm text-muted-foreground">
                {scoreToolCopy.searchEmpty}
              </p>
            ) : null}
          </div>

          {errorMessage ? (
            <Alert className="rounded-2xl">
              <AlertTitle>{scoreToolCopy.errorTitle}</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-4 rounded-[1.75rem] border border-border/60 bg-background/50 px-5 py-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="name"
                label={scoreToolCopy.fields.name}
                value={formState.name}
                placeholder={scoreToolCopy.placeholders.name}
                error={fieldErrors.name}
                onValueChange={updateField}
              />
              <FormField
                id="country"
                label={scoreToolCopy.fields.country}
                value={formState.country}
                placeholder={scoreToolCopy.placeholders.country}
                error={fieldErrors.country}
                onValueChange={updateField}
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">
                {scoreToolCopy.fields.sector}
              </p>
              <div className="flex flex-wrap gap-2">
                {sectorOptions.map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    variant={formState.sector === option.id ? "default" : "outline"}
                    className="rounded-full px-4"
                    onClick={() => updateField("sector", option.id)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              {fieldErrors.sector ? (
                <p className="text-xs text-destructive">{fieldErrors.sector}</p>
              ) : null}
            </div>

            <Button
              type="button"
              variant="outline"
              className="rounded-full px-4"
              onClick={() => setShowAdvancedFields((currentState) => !currentState)}
            >
              {showAdvancedFields
                ? scoreToolCopy.hideAdvancedSettings
                : scoreToolCopy.advancedSettings}
            </Button>
          </div>

          {showAdvancedFields ? (
            <div className="space-y-5 rounded-[1.75rem] border border-border/60 bg-background/50 px-5 py-5">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    id="revenue"
                    label={scoreToolCopy.fields.revenue}
                    value={formState.revenue}
                    error={fieldErrors.revenue}
                    type="number"
                    step="0.01"
                    min="0"
                    onValueChange={updateField}
                  />
                  <FormField
                    id="netIncome"
                    label={scoreToolCopy.fields.netIncome}
                    value={formState.netIncome}
                    error={fieldErrors.netIncome}
                    type="number"
                    step="0.01"
                    onValueChange={updateField}
                  />
                  <FormField
                    id="debt"
                    label={scoreToolCopy.fields.debt}
                    value={formState.debt}
                    error={fieldErrors.debt}
                    type="number"
                    step="0.01"
                    min="0"
                    onValueChange={updateField}
                  />
                  <FormField
                    id="shareholdersEquity"
                    label={scoreToolCopy.fields.shareholdersEquity}
                    value={formState.shareholdersEquity}
                    error={fieldErrors.shareholdersEquity}
                    type="number"
                    step="0.01"
                    onValueChange={updateField}
                  />
                  <FormField
                    id="freeCashFlow"
                    label={scoreToolCopy.fields.freeCashFlow}
                    value={formState.freeCashFlow}
                    error={fieldErrors.freeCashFlow}
                    type="number"
                    step="0.01"
                    onValueChange={updateField}
                  />
                  <FormField
                    id="ebitda"
                    label={scoreToolCopy.fields.ebitda}
                    value={formState.ebitda}
                    error={fieldErrors.ebitda}
                    type="number"
                    step="0.01"
                    onValueChange={updateField}
                  />
                  <FormField
                    id="peRatio"
                    label={scoreToolCopy.fields.peRatio}
                    value={formState.peRatio}
                    error={fieldErrors.peRatio}
                    type="number"
                    step="0.01"
                    min="0.01"
                    onValueChange={updateField}
                  />
                  <FormField
                    id="netMargin"
                    label={scoreToolCopy.fields.netMargin}
                    value={formState.netMargin}
                    error={fieldErrors.netMargin}
                    type="number"
                    step="0.01"
                    min="-100"
                    max="100"
                    onValueChange={updateField}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {scoreToolCopy.netMarginHint}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    id="environmentalScore"
                    label={scoreToolCopy.fields.environmentalScore}
                    value={formState.environmentalScore}
                    error={fieldErrors.environmentalScore}
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    onValueChange={updateField}
                  />
                  <FormField
                    id="socialScore"
                    label={scoreToolCopy.fields.socialScore}
                    value={formState.socialScore}
                    error={fieldErrors.socialScore}
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    onValueChange={updateField}
                  />
                  <FormField
                    id="governanceScore"
                    label={scoreToolCopy.fields.governanceScore}
                    value={formState.governanceScore}
                    error={fieldErrors.governanceScore}
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    onValueChange={updateField}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              className="rounded-full px-5"
              disabled={isSubmitting || isLoadingCompany}
            >
              {isSubmitting
                ? scoreToolCopy.submittingButton
                : scoreToolCopy.submitButton}
            </Button>
            {isLoadingCompany ? (
              <p className="self-center text-xs text-muted-foreground">
                {scoreToolCopy.lookupLoading}
              </p>
            ) : null}
          </div>
        </form>

        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-border/60 bg-background/60 px-5 py-5">
            <p className="app-kicker">{scoreToolCopy.scoringListTitle}</p>
            {rankedEntries.length > 0 ? (
              <div className="mt-4 grid gap-2">
                {rankedEntries.map((entry, index) => {
                  const entryTierLabel =
                    scoreToolCopy.tiers[
                      entry.result.tier as keyof typeof scoreToolCopy.tiers
                    ] ?? entry.result.tier;
                  const missingLabels = getMissingFieldLabels(
                    entry.missingDataFields
                  );
                  const entryMarketPrice = formatMarketPrice(entry.company);

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      aria-pressed={activeEntryId === entry.id}
                      className={cn(
                        "rounded-2xl border px-4 py-4 text-left transition-colors",
                        activeEntryId === entry.id
                          ? "border-primary/50 bg-primary/10"
                          : "border-border/60 bg-background/70 hover:bg-accent/50"
                      )}
                      onClick={() => handleScoredEntrySelect(entry)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="rounded-full px-2.5">
                              #{index + 1}
                            </Badge>
                            {entry.symbol ? (
                              <Badge
                                variant="secondary"
                                className="rounded-full px-2.5"
                              >
                                {entry.symbol}
                              </Badge>
                            ) : null}
                            {entryMarketPrice ? (
                              <Badge variant="outline" className="rounded-full px-2.5">
                                {entryMarketPrice}
                              </Badge>
                            ) : null}
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            {entry.result.name}
                          </p>
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {entry.company?.industry ??
                              entry.company?.sector ??
                              entry.result.sector}
                          </p>
                          {missingLabels.length > 0 ? (
                            <p className="text-xs text-muted-foreground">
                              {scoreToolCopy.missingValuesLabel}:{" "}
                              {missingLabels.join(", ")}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="space-y-2 text-right">
                            <p className="text-2xl font-semibold text-foreground">
                              {numberFormatter.format(entry.result.score)}
                            </p>
                            <Badge className="rounded-full px-2.5">
                              {entryTierLabel}
                            </Badge>
                          </div>
                          <button
                            type="button"
                            aria-label={scoreToolCopy.removeCompany}
                            className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleRemoveScoredEntry(entry.id);
                            }}
                          >
                            <RiDeleteBinLine className="size-4" />
                          </button>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {scoreToolCopy.scoringListEmpty}
              </p>
            )}
          </div>

          {selectedCompany && result ? (
            <div className="rounded-[1.75rem] border border-border/60 bg-background/60 px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-3">
                  <p className="app-kicker">{scoreToolCopy.companyDetailsTitle}</p>
                  <div>
                    <p className="text-xl font-semibold text-foreground">
                      {selectedCompany.name}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge className="rounded-full px-2.5">
                        {selectedCompany.symbol}
                      </Badge>
                      {selectedCompany.exchange ? (
                        <Badge variant="secondary" className="rounded-full px-2.5">
                          {selectedCompany.exchange}
                        </Badge>
                      ) : null}
                      {selectedCompany.industry ? (
                        <Badge variant="outline" className="rounded-full px-2.5">
                          {selectedCompany.industry}
                        </Badge>
                      ) : null}
                      {formatMarketPrice(selectedCompany) ? (
                        <Badge variant="outline" className="rounded-full px-2.5">
                          {scoreToolCopy.marketPriceLabel}:{" "}
                          {formatMarketPrice(selectedCompany)}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>
                {selectedCompany.website ? (
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary"
                  >
                    {scoreToolCopy.openWebsite}
                    <RiExternalLinkLine className="size-4" />
                  </a>
                ) : null}
              </div>

              {selectedCompany.summary ? (
                <div className="mt-5 space-y-3">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {scoreToolCopy.descriptionTitle}
                  </p>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {selectedCompany.summary}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {scoreToolCopy.leadershipTitle}
                  </p>
                  {selectedCompany.ceoName ? (
                    <div className="mt-3 space-y-1">
                      <p className="text-base font-semibold text-foreground">
                        {selectedCompany.ceoName}
                      </p>
                      {selectedCompany.ceoTitle ? (
                        <p className="text-sm text-muted-foreground">
                          {selectedCompany.ceoTitle}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {scoreToolCopy.leadershipEmpty}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4">
                  <div className="grid gap-3 text-sm">
                    {selectedCompany.industry ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          {scoreToolCopy.industryLabel}
                        </span>
                        <span className="text-right font-medium text-foreground">
                          {selectedCompany.industry}
                        </span>
                      </div>
                    ) : null}
                    {headquartersLabel ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          {scoreToolCopy.headquartersLabel}
                        </span>
                        <span className="text-right font-medium text-foreground">
                          {headquartersLabel}
                        </span>
                      </div>
                    ) : null}
                    {selectedCompany.fullTimeEmployees !== null ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          {scoreToolCopy.employeesLabel}
                        </span>
                        <span className="text-right font-medium text-foreground">
                          {integerFormatter.format(
                            selectedCompany.fullTimeEmployees
                          )}
                        </span>
                      </div>
                    ) : null}
                    {formatMarketPrice(selectedCompany) ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          {scoreToolCopy.marketPriceLabel}
                        </span>
                        <span className="text-right font-medium text-foreground">
                          {formatMarketPrice(selectedCompany)}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {result ? (
            <div className="app-metric rounded-[1.75rem] px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <p className="app-kicker">{scoreToolCopy.resultTitle}</p>
                {selectedCompany ? (
                  <Badge variant="outline" className="rounded-full px-2.5">
                    {selectedCompany.symbol}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-4 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{result.name}</p>
                    <p className="mt-2 text-5xl font-semibold tracking-tight text-foreground">
                      {numberFormatter.format(result.score)}
                    </p>
                  </div>
                  <Badge className="rounded-full px-3 py-1.5">{tierLabel}</Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {scoreToolCopy.scoreLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {numberFormatter.format(result.score)}/100
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {scoreToolCopy.heuristicLabel}
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {numberFormatter.format(result.heuristicScore)}/100
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    {scoreToolCopy.componentScoresTitle}
                  </p>
                  {componentEntries.map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">
                          {scoreToolCopy.components[
                            key as keyof typeof scoreToolCopy.components
                          ] ?? key}
                        </span>
                        <span className="font-medium text-foreground">
                          {numberFormatter.format(value)}
                        </span>
                      </div>
                      <Progress value={value} className="h-2 rounded-full" />
                    </div>
                  ))}
                </div>

                {result.rationale.length > 0 ? (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">
                        {scoreToolCopy.rationaleTitle}
                      </p>
                      <div className="space-y-2">
                        {result.rationale.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background/60 px-3 py-3 text-sm text-muted-foreground"
                          >
                            <RiSparklingLine className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
