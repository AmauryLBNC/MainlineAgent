"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";

const quizFree = {
  title: "Quizz financier - Découverte",
  description:
    "5 questions express pour tester tes réflexes d'investisseur sans créer de compte. Résultats immédiats, sans inscription.",
  cta: "Lancer le quizz gratuit",
  href: "/quiz/free",
  sampleQuestion: {
    text: "Si un ETF coûte 0,20% de frais annuels et rapporte 6% brut, quel rendement net approximatif restes-tu ?",
    answers: ["6%", "5,8%", "5%"],
  },
};

const quizAccount = {
  title: "Quizz financier - Profil personnalisé",
  description:
    "Accède à des scénarios plus poussés (risque, fiscalité, levier). Création de compte gratuite pour sauvegarder tes stats.",
  cta: "Créer mon compte gratuit",
  href: "/signup",
  sampleQuestion: {
    text: "Ton portefeuille perd 15%. Que fais-tu ?",
    answers: [
      "Je vends pour éviter pire",
      "Je rééquilibre selon mon plan",
      "J'emprunte pour moyenner à la baisse",
    ],
  },
};

const companyOfDay = {
  name: "BlueNova Energy",
  tagline: "Stockage d'énergie modulaire pour réseaux urbains",
  risks:
    "Dépendance aux subventions vertes, pression sur le coût du lithium, concurrence asiatique agressive.",
  opportunities:
    "Demande croissante pour stabiliser les micro-réseaux, contrats pilotes avec 3 villes US.",
  ceo: "Patron : Alex Morgan (ex-Tesla Grid)",
  model:
    "Vente + maintenance de conteneurs batterie ; marge visée 25% après déploiement série.",
};

const warrenQuote =
  "Le risque vient de ne pas savoir ce que l’on fait. — Warren Buffett";

type Direction = "down" | "up";

export default function Home() {
  const [active, setActive] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>("down");
  const [animStage, setAnimStage] = useState<"idle" | "pre" | "run">("idle");
  const [locked, setLocked] = useState(false);
  const wheelAccum = useRef(0);
  const sections = [<HeroAndQuiz key="hero" />, <Enterprise key="entreprise" />];

  const startTransition = useCallback((dir: Direction, target: number) => {
    if (locked) return;
    setLocked(true);
    setDirection(dir);
    setIncoming(target);
    setAnimStage("pre");
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    requestAnimationFrame(() => {
      setAnimStage("run");
      setTimeout(() => {
        setActive(target);
        setIncoming(null);
        setAnimStage("idle");
        setLocked(false);
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }, 950);
    });
  }, [locked]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (locked) {
        e.preventDefault();
        return;
      }

      wheelAccum.current += e.deltaY;
      const threshold = 140;

      if (wheelAccum.current > threshold && active < sections.length - 1) {
        startTransition("down", active + 1);
        wheelAccum.current = 0;
      } else if (wheelAccum.current < -threshold && active > 0) {
        startTransition("up", active - 1);
        wheelAccum.current = 0;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [active, locked, sections.length, startTransition]);

  const getTransform = (index: number) => {
    if (animStage === "idle") {
      return index === active ? "translateY(0%)" : "translateY(100%)";
    }

    // during pre-stage set initial positions
    if (animStage === "pre") {
      if (index === active) return "translateY(0%)";
      if (index === incoming) return direction === "down" ? "translateY(100%)" : "translateY(-100%)";
      return "translateY(100%)";
    }

    // run stage
    if (index === active) return direction === "down" ? "translateY(-100%)" : "translateY(100%)";
    if (index === incoming) return "translateY(0%)";
    return "translateY(100%)";
  };

  const transition = animStage === "run" ? "transform 0.9s cubic-bezier(0.22, 0.7, 0.26, 1)" : "none";

  return (
    <main className="relative h-screen overflow-hidden text-foreground">
      {sections.map((section, idx) => (
        <div
          key={idx}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: getTransform(idx),
            transition,
          }}
        >
          {section}
        </div>
      ))}
    </main>
  );
}

function HeroAndQuiz() {
  return (
    <section className="min-h-screen w-full bg-hero-one px-6 py-14 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="space-y-6">
          <Reveal className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary animate-float">
            <span>Citation du jour</span>
            <span className="h-2 w-2 rounded-full bg-primary animate-ping-slow" />
          </Reveal>

          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-enterprise bg-enterprise-card p-7 shadow-xl backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-enterprise-strong">
              <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-lg font-medium leading-relaxed text-enterprise-strong animate-typing select-none">
                {warrenQuote}
              </p>

              <p className="relative mt-32 text-sm text-muted-foreground animate-text-reveal">
                Le texte se dessine lettre par lettre pour marquer l’idée clé du jour et encourager la réflexion avant d’agir.
              </p>
            </div>
          </Reveal>
        </div>


        <Reveal>
          <div className="group relative overflow-hidden rounded-3xl border border-enterprise bg-enterprise-card p-7 shadow-xl backdrop-blur transition duration-250 hover:-translate-y-1.5 hover:shadow-2xl hover:border-enterprise-strong hover:bg-enterprise-overlay">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-enterprise-overlay" />
            <div className="relative space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70">
                Note mentale
              </p>
              <h2 className="text-xl text-enterprise-strong font-bold">Rester rationnel</h2>
              <p className="text-enterprise-soft">
                “Quand d’autres sont avides, sois craintif. Quand d’autres sont
                craintifs, sois avide.”
              </p>
              <div className="flex gap-3 pt-2">
                <Button asChild variant="secondary" size="lg">
                  <Link href="#quiz">Faire un quizz</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#entreprise">Voir l’entreprise du jour</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-12 max-w-6xl space-y-8" id="quiz">
        

        <div className="grid gap-8 lg:grid-cols-2">
          {[quizFree, quizAccount].map((quiz, idx) => (
            <Reveal key={quiz.title}>
              <article className="group relative overflow-hidden rounded-3xl border border-enterprise bg-enterprise-card p-7 shadow-xl backdrop-blur transition duration-250 hover:-translate-y-1.5 hover:shadow-2xl hover:border-enterprise-strong hover:bg-enterprise-overlay">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-enterprise-overlay" />
                <div className="relative flex flex-col gap-5 h-full">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-enterprise-soft">
                      <span className="size-2 rounded-full bg-enterprise-cta animate-pulse" />
                      {idx === 0 ? "Sans compte" : "Avec compte gratuit"}
                    </div>
                    <Button asChild variant={idx === 0 ? "secondary" : "signin"} size="sm">
                      <Link href={quiz.href}>{quiz.cta}</Link>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-semibold text-enterprise-strong">{quiz.title}</h4>
                    <p className="text-enterprise-soft">{quiz.description}</p>
                  </div>
                  <div className="rounded-xl border border-dashed border-enterprise bg-enterprise-card p-4 space-y-3">
                    <p className="text-sm font-semibold text-enterprise-strong">Exemple de question</p>
                    <p className="text-enterprise-soft">{quiz.sampleQuestion.text}</p>
                    <div className="flex flex-wrap gap-2">
                      {quiz.sampleQuestion.answers.map((answer) => (
                        <span
                          key={answer}
                          className="rounded-full bg-background/70 px-3 py-1 text-xs font-semibold border border-enterprise"
                        >
                          {answer}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto pt-2">
                    <Button asChild size="lg" className="w-full bg-enterprise-cta text-enterprise-cta hover:opacity-90">
                      <Link href={quiz.href}>
                        {idx === 0 ? "Commencer en 30s" : "Créer mon compte et jouer"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Enterprise() {
  return (
    <section
      id="entreprise"
      className="min-h-screen w-full bg-hero-two text-primary-foreground px-6 py-14 md:py-16"
    >
      <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <Reveal className="space-y-4">
          <p className="text-sm font-semibold text-enterprise-soft">Entreprise du jour</p>
          <h3 className="text-3xl md:text-4xl font-bold text-enterprise-strong">{companyOfDay.name}</h3>
          <p className="text-enterprise-soft text-lg">{companyOfDay.tagline}</p>
          <div className="rounded-2xl border border-enterprise-strong bg-enterprise-card/90 p-4 space-y-3 transition duration-250 hover:-translate-y-1.5 hover:shadow-2xl hover:border-enterprise-strong hover:bg-enterprise-overlay">
            <p className="text-sm font-semibold text-enterprise-strong">Deux parcours gratuits</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-enterprise bg-enterprise-card p-3 transition duration-250 hover:-translate-y-1.5 hover:shadow-2xl hover:border-enterprise-strong hover:bg-enterprise-overlay">
                <p className="text-xs uppercase tracking-[0.18em] text-enterprise-soft">Parcours 1</p>
                <p className="font-semibold text-enterprise-strong">Quizz express sans compte</p>
                <p className="text-xs text-enterprise-soft">5 questions, résultats immédiats.</p>
              </div>
              <div className="rounded-xl border border-enterprise bg-enterprise-card p-3 transition duration-250 hover:-translate-y-1.5 hover:shadow-2xl hover:border-enterprise-strong hover:bg-enterprise-overlay">
                <p className="text-xs uppercase tracking-[0.18em] text-enterprise-soft">Parcours 2</p>
                <p className="font-semibold text-enterprise-strong">Profil personnalisé gratuit</p>
                <p className="text-xs text-enterprise-soft">Sauvegarde des stats et scénarios avancés.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-enterprise bg-enterprise-card p-5 transition duration-250 hover:-translate-y-1.5 hover:shadow-2xl hover:border-enterprise-strong hover:bg-enterprise-overlay">
            <p className="font-semibold mb-2">Enjeux & risques</p>
            <ul className="space-y-1 text-sm text-enterprise-soft">
              <li>• {companyOfDay.risks}</li>
              <li>• {companyOfDay.opportunities}</li>
              <li>• {companyOfDay.model}</li>
              <li>• {companyOfDay.ceo}</li>
              <li>
                • Risque marché : dilution si levée série C <span className="text-xs">(bullshit placeholder)</span>
              </li>
              <li>• Barrière : brevets sur la gestion thermique des modules</li>
              <li>• Dépendance : réseau fournisseurs cobalt / lithium</li>
              <li>• Roadmap : 12 mois pour passer en production série</li>
              <li>• KPI cible : coût/kWh stocké &lt; 75$</li>
              <li>• Sortie potentielle : rachat par utility US</li>
            </ul>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-enterprise-card border-enterprise-strong text-enterprise-strong transition duration-200 hover:border-enterprise-strong hover:bg-enterprise-card/90"
            >
              <Link href="/companies/blue-nova">Voir la fiche détaillée</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="bg-enterprise-cta text-enterprise-cta transition duration-200 hover:opacity-90 hover:shadow-lg">
              <Link href="/companies">Explorer d’autres entreprises</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal className="relative overflow-hidden rounded-3xl border border-enterprise bg-enterprise-card shadow-2xl backdrop-blur max-w-2xl w-full justify-self-end transition duration-250 hover:-translate-y-1.5 hover:shadow-2xl hover:border-enterprise-strong hover:bg-enterprise-overlay">
          <div className="absolute inset-0 bg-enterprise-overlay animate-pan-slow" />
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80"
              alt="BlueNova Energy"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 480px, 100vw"
            />
          </div>
          <div className="relative p-5 flex items-center justify-between gap-3 text-sm text-enterprise-soft">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-enterprise-cta animate-pulse" />
              Score momentum : 7.8/10
            </span>
            <span className="text-xs opacity-80">Données fictives (placeholder)</span>
          </div>
        </Reveal>
      </div>
      <Reveal>
        <div className="mt-12 rounded-3xl border border-enterprise bg-enterprise-card p-6 shadow-xl backdrop-blur space-y-4 transition duration-250 hover:-translate-y-1.5 hover:shadow-2xl hover:border-enterprise-strong hover:bg-enterprise-overlay">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-enterprise-soft">Mini "Quizz financier"</p>
              <h3 className="text-2xl md:text-3xl font-bold text-enterprise-strong">Deux parcours, toujours gratuits</h3>
              <p className="text-enterprise-soft">
                Commence sans compte ou crÃ©e ton profil pour dÃ©bloquer des cas pratiques.
              </p>
            </div>
            <Button asChild size="lg" className="bg-enterprise-cta text-enterprise-cta transition duration-200 hover:opacity-90 hover:shadow-lg">
              <Link href="/quiz">AccÃ©der aux quizz</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-enterprise-strong">
            <span className="px-3 py-1 rounded-full bg-enterprise-card border border-enterprise">Gratuit</span>
            <span className="px-3 py-1 rounded-full bg-enterprise-card border border-enterprise">5 questions express</span>
            <span className="px-3 py-1 rounded-full bg-enterprise-card border border-enterprise">RÃ©sultats immÃ©diats</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
