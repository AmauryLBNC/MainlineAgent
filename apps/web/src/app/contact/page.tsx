"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/Base/PageShell";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { copy } = useI18n();

  return (
    <PageShell align="center" density={22}>
      <div className="premium-panel w-full p-8 sm:p-12">
        <div className="space-y-6">
          <div>
            <p className="eyebrow">{copy.contact.eyebrow}</p>
            <h1 className="mt-3 font-display text-3xl text-slate-900 sm:text-4xl">
              {copy.contact.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {copy.contact.description}
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="w-full rounded-2xl border border-[rgba(120,105,85,0.2)] bg-white/70 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgba(120,105,85,0.25)]"
                placeholder={copy.contact.placeholders.fullName}
                required
              />
              <input
                type="email"
                className="w-full rounded-2xl border border-[rgba(120,105,85,0.2)] bg-white/70 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgba(120,105,85,0.25)]"
                placeholder={copy.contact.placeholders.email}
                required
              />
            </div>
            <input
              className="w-full rounded-2xl border border-[rgba(120,105,85,0.2)] bg-white/70 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgba(120,105,85,0.25)]"
              placeholder={copy.contact.placeholders.subject}
              required
            />
            <textarea
              className="w-full rounded-2xl border border-[rgba(120,105,85,0.2)] bg-white/70 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgba(120,105,85,0.25)]"
              placeholder={copy.contact.placeholders.message}
              rows={5}
              required
            />
            <div className="flex flex-wrap items-center gap-4">
              <Button
                type="submit"
                variant="outline"
                className="cta-soft shadow-none hover:shadow-none"
              >
                {copy.contact.submitButton}
              </Button>
              <span className="text-sm text-slate-500">{copy.contact.email}</span>
            </div>
            {sent ? (
              <p className="text-xs text-slate-500">{copy.contact.successMessage}</p>
            ) : null}
          </form>
        </div>
      </div>
    </PageShell>
  );
}
