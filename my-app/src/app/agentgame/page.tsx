"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/Base/PageShell";

export default function AgentGame() {
  return (
    <PageShell density={26}>
      <div className="premium-panel w-full p-8 sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <p className="eyebrow">AgentGame</p>
            <h1 className="font-display text-3xl text-slate-900 sm:text-4xl">
              Analysez une entreprise et recevez un retour IA detaille.
            </h1>
            <p className="text-base text-slate-600">
              AgentGame vous guide pour structurer votre analyse financiere,
              rediger votre these d'investissement et comparer votre lecture aux
              standards professionnels.
            </p>
            <Button
              asChild
              variant="outline"
              className="cta-soft shadow-none hover:shadow-none"
            >
              <Link href="/signup">Start the analysis</Link>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="premium-panel-soft p-6">
              <p className="eyebrow">Votre analyse</p>
              <h2 className="mt-3 font-display text-xl text-slate-900">
                Hypothese de valeur
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Redigez votre comprehension de l'activite, du modele economique
                et des moteurs de croissance pour une entreprise cible.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Positionnement concurrentiel et avantage durable.</li>
                <li>Qualite du management et allocation du capital.</li>
                <li>Scenarios de croissance et risques majeurs.</li>
              </ul>
            </div>

            <div className="premium-panel-soft p-6">
              <p className="eyebrow">Retour IA</p>
              <h2 className="mt-3 font-display text-xl text-slate-900">
                Synthese et axes d'amelioration
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                L'IA fournit un retour structure et met en evidence les angles
                morts, avec des sources a approfondir.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Score de coherence strategique.</li>
                <li>Checklist de validation financiere.</li>
                <li>Recommandations de lecture sectorielle.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

