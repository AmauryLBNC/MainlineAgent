"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/Base/PageShell";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <PageShell align="center" density={22}>
      <div className="premium-panel w-full p-8 sm:p-12">
        <div className="space-y-6">
          <div>
            <p className="eyebrow">Contact</p>
            <h1 className="mt-3 font-display text-3xl text-slate-900 sm:text-4xl">
              Parlons de vos objectifs d'investissement.
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Notre equipe vous repond rapidement avec une approche sobre et
              institutionnelle.
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
                placeholder="Nom complet"
                required
              />
              <input
                type="email"
                className="w-full rounded-2xl border border-[rgba(120,105,85,0.2)] bg-white/70 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgba(120,105,85,0.25)]"
                placeholder="Email"
                required
              />
            </div>
            <input
              className="w-full rounded-2xl border border-[rgba(120,105,85,0.2)] bg-white/70 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgba(120,105,85,0.25)]"
              placeholder="Objet"
              required
            />
            <textarea
              className="w-full rounded-2xl border border-[rgba(120,105,85,0.2)] bg-white/70 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgba(120,105,85,0.25)]"
              placeholder="Votre message"
              rows={5}
              required
            />
            <div className="flex flex-wrap items-center gap-4">
              <Button
                type="submit"
                variant="outline"
                className="cta-soft shadow-none hover:shadow-none"
              >
                Envoyer
              </Button>
              <span className="text-sm text-slate-500">
                contact@momoia.com
              </span>
            </div>
            {sent ? (
              <p className="text-xs text-slate-500">
                Merci, votre message a bien ete envoye.
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </PageShell>
  );
}
