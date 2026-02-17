export const languages = ["fr", "en"] as const;

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = "fr";

export const copy = {
  fr: {
    nav: {
      home: "Accueil",
      company: "Entreprise",
      insights: "Analyses",
      vault: "Pilotage",
    },
    header: {
      login: "Connexion",
      start: "Commencer",
    },
    hero: {
      badge: "Briefing premium",
      title: "Finance premium. Decisions nettes. Style futuriste.",
      subtitle:
        "Une interface minimaliste pour piloter ta performance avec precision, sans bruit inutile.",
      primaryCta: "Demarrer gratuitement",
      secondaryCta: "Voir l'entreprise du jour",
      metrics: [
        { value: "5 min", label: "par jour" },
        { value: "100%", label: "gratuit" },
        { value: "2", label: "parcours" },
        { value: "Score", label: "instantane" },
      ],
      quote: "Le risque vient de ne pas savoir ce que l'on fait.",
      quoteBy: "Warren Buffett",
    },
    quiz: {
      eyebrow: "Quizz financier",
      title: "Deux parcours pour entrainer tes reflexes",
      duration: "Session 5 questions",
      modes: [
        {
          title: "Mode express sans compte",
          description:
            "Lance un quizz en 30 secondes pour tester tes reflexes d'investisseur.",
          cta: "Lancer",
          href: "/quiz/free",
        },
        {
          title: "Profil personnalise gratuit",
          description:
            "Sauvegarde tes stats et accede a des scenarios avances.",
          cta: "Creer mon profil",
          href: "/signup",
        },
      ],
      sample: {
        label: "Extrait de question",
        question:
          "Si un ETF facture 0,20% de frais annuels et rapporte 6% brut, quel rendement net approximatif restes-tu ?",
        answers: ["6%", "5,8%", "5%"],
      },
    },
    company: {
      eyebrow: "Entreprise du jour",
      name: "BlueNova Energy",
      tagline: "Stockage d'energie modulaire pour reseaux urbains",
      summary:
        "Objectif : stabiliser les micro-reseaux via des conteneurs batteries intelligents.",
      metricsTitle: "Signal quotidien",
      metrics: [
        { label: "Momentum", value: "7,8 / 10" },
        { label: "Risque", value: "6,2 / 10" },
        { label: "Potentiel", value: "8,4 / 10" },
      ],
      signalsTitle: "Signaux cles",
      signals: [
        "Contrats pilotes avec 3 villes americaines.",
        "Baisse de 12% du cout des cellules en 6 mois.",
        "Demande croissante des operateurs de micro-reseaux.",
      ],
      risksTitle: "Risques & opportunites",
      risks: [
        "Dependance aux subventions vertes.",
        "Pression sur le cout du lithium.",
        "Barrieres technologiques sur la gestion thermique.",
        "Sortie potentielle : rachat par un utility US.",
      ],
      primaryCta: "Voir la fiche detaillee",
      secondaryCta: "Explorer le catalogue",
      imageCaption: "Site pilote, Arizona",
      dataNote: "Donnees fictives",
      snapshotLabel: "Synthese express",
      snapshot: [
        { label: "Modele", value: "Vente + maintenance" },
        { label: "Marge cible", value: "25% apres deploiement" },
        { label: "Roadmap", value: "Production serie sous 12 mois" },
      ],
    },
    insights: {
      eyebrow: "Atelier analytique",
      title: "Signaux clairs, decisions rapides.",
      subtitle:
        "Des modeles internes pour filtrer l'essentiel et garder le cap.",
      pillarsTitle: "Piliers",
      pillars: [
        "Macro synthese et tendances utiles.",
        "Stress tests instantanes sur scenarios extremes.",
        "Historique des decisions avec justification claire.",
      ],
      metricsTitle: "Indice de maitrise",
      metrics: [
        { label: "Signal", value: "8,6 / 10" },
        { label: "Conviction", value: "7,9 / 10" },
        { label: "Volatilite", value: "4,2%" },
      ],
      highlightsTitle: "Brief du jour",
      highlights: [
        "Inflation sous controle sur 3 mois glissants.",
        "Rotation sectorielle vers value defensif.",
        "Sentiment risk-on modere, flux stables.",
      ],
      ctaPrimary: "Ouvrir le laboratoire",
      ctaSecondary: "Exporter le rapport",
    },
    vault: {
      eyebrow: "Pilotage du capital",
      title: "Risque controle, croissance elegante.",
      subtitle:
        "Definis tes garde-fous avant d'accelerer, et gagne en serenite.",
      guardrailsTitle: "Garde-fous",
      guardrails: [
        "Drawdown max cible : -8%",
        "Exposition par secteur plafonnee a 22%",
        "Cout de couverture optimise chaque semaine",
      ],
      allocationTitle: "Allocation cible",
      allocations: [
        { label: "Actions qualite", value: "55%" },
        { label: "Obligations court terme", value: "25%" },
        { label: "Cash strategique", value: "20%" },
      ],
      ctaPrimary: "Demander une demo",
      ctaSecondary: "Voir la roadmap",
    },
  },
  en: {
    nav: {
      home: "Home",
      company: "Company",
      insights: "Insights",
      vault: "Control",
    },
    header: {
      login: "Log in",
      start: "Get started",
    },
    hero: {
      badge: "Premium briefing",
      title: "Premium finance. Clear decisions. Futuristic poise.",
      subtitle:
        "A minimalist interface to run performance with precision and calm focus.",
      primaryCta: "Start for free",
      secondaryCta: "See today's company",
      metrics: [
        { value: "5 min", label: "a day" },
        { value: "100%", label: "free" },
        { value: "2", label: "tracks" },
        { value: "Score", label: "instant" },
      ],
      quote: "Risk comes from not knowing what you're doing.",
      quoteBy: "Warren Buffett",
    },
    quiz: {
      eyebrow: "Finance quiz",
      title: "Two tracks to sharpen your instincts",
      duration: "5-question session",
      modes: [
        {
          title: "Express mode, no account",
          description:
            "Launch a quiz in 30 seconds and test your investor reflexes.",
          cta: "Launch",
          href: "/quiz/free",
        },
        {
          title: "Free personalized profile",
          description:
            "Save your stats and unlock advanced decision scenarios.",
          cta: "Create profile",
          href: "/signup",
        },
      ],
      sample: {
        label: "Sample question",
        question:
          "If an ETF charges 0.20% annually and returns 6% gross, what's the approximate net return?",
        answers: ["6%", "5.8%", "5%"],
      },
    },
    company: {
      eyebrow: "Company of the day",
      name: "BlueNova Energy",
      tagline: "Modular energy storage for urban grids",
      summary:
        "Goal: stabilize micro-grids with intelligent battery containers.",
      metricsTitle: "Daily signal",
      metrics: [
        { label: "Momentum", value: "7.8 / 10" },
        { label: "Risk", value: "6.2 / 10" },
        { label: "Upside", value: "8.4 / 10" },
      ],
      signalsTitle: "Key signals",
      signals: [
        "Pilot contracts with three US cities.",
        "Cell cost down 12% in six months.",
        "Rising demand from micro-grid operators.",
      ],
      risksTitle: "Risks & opportunities",
      risks: [
        "Dependence on green subsidies.",
        "Pressure on lithium pricing.",
        "Thermal management moat is decisive.",
        "Potential exit via US utility acquisition.",
      ],
      primaryCta: "View full profile",
      secondaryCta: "Explore the catalog",
      imageCaption: "Pilot site, Arizona",
      dataNote: "Fictional data",
      snapshotLabel: "Quick snapshot",
      snapshot: [
        { label: "Model", value: "Sales + maintenance" },
        { label: "Target margin", value: "25% post scale" },
        { label: "Roadmap", value: "Serial production in 12 months" },
      ],
    },
    insights: {
      eyebrow: "Analytics studio",
      title: "Clear signals, fast decisions.",
      subtitle:
        "Internal models that filter noise and keep the thesis sharp.",
      pillarsTitle: "Pillars",
      pillars: [
        "Macro synthesis with actionable trend lines.",
        "Instant stress tests on extreme scenarios.",
        "Decision history with clear rationale.",
      ],
      metricsTitle: "Mastery index",
      metrics: [
        { label: "Signal", value: "8.6 / 10" },
        { label: "Conviction", value: "7.9 / 10" },
        { label: "Volatility", value: "4.2%" },
      ],
      highlightsTitle: "Daily brief",
      highlights: [
        "Inflation remains contained over 3 months.",
        "Sector rotation toward defensive value.",
        "Moderate risk-on sentiment, stable flows.",
      ],
      ctaPrimary: "Open the lab",
      ctaSecondary: "Export the report",
    },
    vault: {
      eyebrow: "Capital control",
      title: "Risk contained, growth composed.",
      subtitle:
        "Define guardrails before accelerating and stay in control.",
      guardrailsTitle: "Guardrails",
      guardrails: [
        "Max drawdown target: -8%",
        "Sector exposure capped at 22%",
        "Weekly optimized hedging costs",
      ],
      allocationTitle: "Target allocation",
      allocations: [
        { label: "Quality equities", value: "55%" },
        { label: "Short-term bonds", value: "25%" },
        { label: "Strategic cash", value: "20%" },
      ],
      ctaPrimary: "Request a demo",
      ctaSecondary: "View the roadmap",
    },
  },
} as const;

