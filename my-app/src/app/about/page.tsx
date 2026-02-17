"use client";

import PageShell from "@/components/Base/PageShell";

export default function About() {
  return (
    <PageShell align="center" density={24}>
      <div className="premium-panel w-full p-8 sm:p-12">
        <div className="space-y-6">
          <div>
            <p className="eyebrow">A propos</p>
            <h1 className="mt-3 font-display text-3xl text-slate-900 sm:text-4xl">
              Une pedagogie financiere responsable et durable.
            </h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4 text-sm text-slate-600">
              <p>
                Notre mission est d'offrir un environnement clair pour comprendre
                l'investissement, batir des convictions solides et avancer avec
                methode.
              </p>
              <p>
                Nous combinons rigueur analytique, transparence et discipline du
                long terme pour accompagner les investisseurs particuliers comme
                institutionnels.
              </p>
              <p>
                L'objectif pedagogique est simple : aider chacun a structurer sa
                reflexion, comparer les scenarios et prendre des decisions
                maitrisees.
              </p>
            </div>

            <div className="premium-panel-soft p-6">
              <p className="eyebrow">Vision long terme</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Approche financiere responsable et documentee.</li>
                <li>Transmission d'une culture de la patience et de la qualite.</li>
                <li>Decisions alignees avec la creation de valeur durable.</li>
                <li>Priorite donnee a la comprehension plutot que la speculation.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

