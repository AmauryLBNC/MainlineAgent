const fr = {
  common: {
    save: "Sauvegarder",
    back: "Retour",
    next: "Continuer",
    previous: "Precedent",
  },

  header: {
    logoAriaLabel: "Accueil",
    nav: {
      home: "Accueil",
      momoia: "MomoIA",
      agentgame: "AgentGame",
      miniQuiz: "Mini quiz",
      about: "A propos",
      contact: "Contactez-nous",
    },
    login: "Connexion",
    dashboard: "Dashboard",
    admin: "Admin",
    logout: "Deconnexion",
    getStarted: "Commencer",
  },

  home: {
    promoMomo: {
      eyebrow: "MomoIA",
      title: "Essayez MomoIA pour vous constituer votre liste d'investissement.",
      description:
        "Un cadre clair pour filtrer les opportunites, ordonner les priorites et construire une methode d'investissement sereine.",
      cta: "Essayer MomoIA",
    },
    buffett: {
      eyebrow: "Warren Buffett",
      quote: "\"Le prix est ce que vous payez. La valeur est ce que vous obtenez.\"",
      quoteBy: "- Warren Buffett",
      paragraphs: [
        "Investisseur ne en 1930, il a transforme Berkshire Hathaway en un conglomerat de reference et incarne la discipline du temps long.",
        "Son approche valorise les entreprises solides, la qualite des dirigeants et la capacite a generer des flux de tresorerie durables.",
      ],
      essentialsEyebrow: "Reperes essentiels",
      essentialsTitle: "Une vision patiente de l'investissement",
      essentials: [
        "Ne en 1930 a Omaha, Nebraska.",
        "President de Berkshire Hathaway depuis 1965.",
        "Philosophie : acheter des entreprises de qualite a prix raisonnable.",
        "Succes notables : GEICO, Coca-Cola, Apple.",
        "Horizon long terme et discipline sur les cycles.",
      ],
      footer:
        "\"Le temps est l'ami des bonnes entreprises\" resume l'esprit de sa methode : patience, rigueur et capitalisation composee.",
    },
    company: {
      profileEyebrow: "Fiche entreprise",
      name: "Lumenis Patrimoine SA",
      demoDataLabel: "Donnees illustratives",
      profileLines: [
        "Specialiste de la gestion d'actifs europeens haut de gamme.",
        "Portefeuilles multi-actifs orientes croissance de long terme.",
        "Presence internationale avec une base clientele institutionnelle.",
      ],
      ceoEyebrow: "CEO",
      ceoName: "Claire Duval",
      ceoDescription:
        "Ancienne directrice des investissements chez un leader europeen, elle pilote Lumenis Patrimoine depuis 2018.",
      ceoBullets: [
        "15 ans d'experience en allocation strategique.",
        "Modernisation de la recherche proprietaire.",
        "Hausse structurelle des marges depuis sa prise de fonction.",
      ],
      toolsEyebrow: "Outils financiers",
      metrics: [
        { label: "Chiffre d'affaires", value: "8,2 Md EUR" },
        { label: "Resultat net", value: "1,15 Md EUR" },
        { label: "Endettement", value: "2,4 Md EUR" },
        { label: "Tresorerie", value: "1,9 Md EUR" },
        { label: "PER", value: "14,2x" },
        { label: "Marge nette", value: "14,1%" },
      ],
      perEyebrow: "Comprendre le PER",
      perDescription:
        "Le Price Earnings Ratio compare le prix d'une action au benefice net par action. Il indique combien le marche paie pour 1 euro de resultat.",
      perBullets: [
        "PER eleve : attentes de croissance ou valorisation exigeante.",
        "PER modere : valorisation plus prudente ou croissance stable.",
        "Comparer le PER a celui du secteur pour interpreter le signal.",
      ],
    },
    quiz: {
      eyebrow: "Quiz financier",
      title: "Testez vos fondamentaux",
      description: "Cinq questions pour verifier vos reflexes d'investisseur.",
      pausedStatus: "Auto-rotation en pause",
      runningStatus: "Rotation automatique",
      correctLabel: "Correct",
      reviewLabel: "A revoir",
      resultLabel: "Resultat",
      completedMessage: "Quiz termine. Prenez le temps de relire vos choix.",
      pendingMessage: "Selectionnez une reponse par question.",
      longQuizCta: "Faire un quiz plus long",
      exitCta: "Quitter le quiz",
      questions: [
        {
          prompt:
            "Quel indicateur mesure la rentabilite d'une entreprise par rapport a ses capitaux propres ?",
          options: ["Marge brute", "ROE (Return on Equity)", "PER", "EBITDA"],
          correct: 1,
          note: "Le ROE compare le resultat net aux capitaux propres.",
        },
        {
          prompt: "Que signifie generalement un PER eleve ?",
          options: [
            "Le marche anticipe une croissance forte ou valorise cher les benefices",
            "L'entreprise n'a pas de dette",
            "Les dividendes sont assures",
            "Le chiffre d'affaires est en baisse",
          ],
          correct: 0,
          note:
            "Un PER eleve reflete souvent des attentes de croissance ou une valorisation exigeante.",
        },
        {
          prompt:
            "Quel est l'effet principal de la diversification d'un portefeuille ?",
          options: [
            "Augmenter le levier",
            "Reduire le risque specifique",
            "Garantir le rendement",
            "Eviter toute volatilite",
          ],
          correct: 1,
          note:
            "La diversification limite l'impact d'un risque propre a un seul actif.",
        },
        {
          prompt: "Qu'est-ce qu'une obligation ?",
          options: [
            "Une part de capital",
            "Un titre de dette avec un coupon",
            "Un derive de change",
            "Une action privilegiee",
          ],
          correct: 1,
          note:
            "Une obligation represente une dette emise par une entreprise ou un Etat.",
        },
        {
          prompt: "Quel est l'objectif principal d'un bilan ?",
          options: [
            "Prevoir les ventes futures",
            "Donner une photographie du patrimoine a une date donnee",
            "Calculer la marge operationnelle",
            "Evaluer la satisfaction client",
          ],
          correct: 1,
          note:
            "Le bilan presente les actifs, les passifs et les capitaux propres a un instant T.",
        },
      ],
    },
    agentgame: {
      eyebrow: "AgentGame",
      title:
        "Analysez une entreprise et recevez un retour intelligent sur votre comprehension.",
      description:
        "AgentGame consiste a structurer votre analyse, confronter vos hypotheses et recevoir un debrief IA sur votre lecture des fondamentaux.",
      cta: "Commencer une analyse",
      receiveEyebrow: "Ce que vous recevez",
      receiveBullets: [
        "Un cadre d'analyse guide, centre sur les sources fiables.",
        "Une synthese de vos points forts et zones d'ombre.",
        "Un score de comprehension et des pistes d'approfondissement.",
        "Une methode reutilisable pour chaque entreprise etudiee.",
      ],
    },
  },

  momoia: {
    intro: {
      eyebrow: "MomoIA",
      title: "Construisez votre liste d'investissement avec l'IA.",
      description:
        "MomoIA vous aide a constituer une liste de suivi personnalisee selon votre secteur cible, vos criteres financiers et votre vision long terme.",
      startButton: "Demarrer l'experience",
    },
    steps: {
      eyebrow: "Parcours MomoIA",
      stepLabel: "Etape",
      selectedBadge: "Selectionne",
      items: [
        {
          id: "sector",
          title: "Choisir un secteur",
          description:
            "Selectionnez un secteur pour orienter la recherche de MomoIA.",
          multi: false,
          options: [
            { id: "technology", label: "Technologie" },
            { id: "health", label: "Sante" },
            { id: "industry", label: "Industrie" },
            { id: "consumer", label: "Consommation" },
            { id: "energy", label: "Energie" },
            { id: "finance", label: "Finance" },
            { id: "infrastructure", label: "Infrastructures" },
            { id: "real_estate", label: "Immobilier" },
            { id: "services", label: "Services" },
          ],
        },
        {
          id: "primary",
          title: "Choisir des criteres principaux",
          description:
            "Selection multiple possible. Ces criteres donnent la direction majeure.",
          multi: true,
          options: [
            { id: "profitability", label: "Rentabilite" },
            { id: "family_owned", label: "Entreprise familiale" },
            {
              id: "geographic_diversification",
              label: "Diversification geographique",
            },
            { id: "steady_growth", label: "Croissance reguliere" },
            { id: "low_debt", label: "Faible endettement" },
            {
              id: "durable_moat",
              label: "Avantage concurrentiel durable",
            },
            { id: "management_quality", label: "Qualite du management" },
          ],
        },
        {
          id: "secondary",
          title: "Choisir des criteres secondaires",
          description:
            "Affinez votre filtre avec des indicateurs complementaires.",
          multi: true,
          options: [
            { id: "fair_pe", label: "PER raisonnable" },
            { id: "strong_cash", label: "Forte tresorerie" },
            { id: "high_margin", label: "Marge elevee" },
            { id: "stable_track_record", label: "Historique stable" },
            { id: "innovation", label: "Innovation" },
            { id: "sector_leadership", label: "Leadership sectoriel" },
            { id: "regular_dividend", label: "Dividende regulier" },
          ],
        },
      ],
    },
    results: {
      eyebrow: "Resultat IA (simulation)",
      title: "Liste de suivi suggeree",
      sectorLabel: "Secteur",
      primaryCriteriaLabel: "Criteres principaux",
      saveButton: "Sauvegarder les resultats",
      viewAnalysis: "Voir l'analyse",
      editCriteria: "Modifier les criteres",
      saveMessages: {
        needLogin: "Vous devez etre connecte pour sauvegarder vos resultats.",
        success: "Resultats sauvegardes avec succes.",
      },
      companies: [
        {
          id: "company_a",
          name: "Entreprise A",
          sectorId: "technology",
          thesis: "Plateforme logicielle europeenne a forte recurrence.",
        },
        {
          id: "company_b",
          name: "Entreprise B",
          sectorId: "health",
          thesis: "Positionnement defensif avec portefeuille brevete.",
        },
        {
          id: "company_c",
          name: "Entreprise C",
          sectorId: "industry",
          thesis: "Leader regional avec visibilite long terme sur les contrats.",
        },
        {
          id: "company_d",
          name: "Entreprise D",
          sectorId: "finance",
          thesis: "Gestion d'actifs premium orientee patrimoine.",
        },
      ],
    },
    analysis: {
      eyebrow: "Analyse IA",
      sectorLabel: "Secteur",
      summarySuffix: "Vue synthetique en 3 pages.",
      backToList: "Retour a la liste",
      pageLabel: "Page",
      pages: [
        {
          id: "overview",
          label: "Presentation globale",
          title: "Activite et positionnement",
          body: [
            "{company} opere sur le secteur {sector} avec une approche orientee qualite et visibilite long terme.",
            "Son positionnement premium lui permet de preserver ses marges tout en renforcant la relation client.",
          ],
          bullets: [
            "Activite centree sur des revenus recurrents.",
            "Positionnement clair sur un segment haut de gamme.",
            "Capacite a maintenir une croissance reguliere.",
          ],
        },
        {
          id: "financials",
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
          id: "summary",
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
      ],
    },
  },

  about: {
    eyebrow: "A propos",
    title: "Une pedagogie financiere responsable et durable.",
    paragraphs: [
      "Notre mission est d'offrir un environnement clair pour comprendre l'investissement, batir des convictions solides et avancer avec methode.",
      "Nous combinons rigueur analytique, transparence et discipline du long terme pour accompagner les investisseurs particuliers comme institutionnels.",
      "L'objectif pedagogique est simple : aider chacun a structurer sa reflexion, comparer les scenarios et prendre des decisions maitrisees.",
    ],
    visionEyebrow: "Vision long terme",
    visionBullets: [
      "Approche financiere responsable et documentee.",
      "Transmission d'une culture de la patience et de la qualite.",
      "Decisions alignees avec la creation de valeur durable.",
      "Priorite donnee a la comprehension plutot que la speculation.",
    ],
  },

  contact: {
    eyebrow: "Contact",
    title: "Parlons de vos objectifs d'investissement.",
    description:
      "Notre equipe vous repond rapidement avec une approche sobre et institutionnelle.",
    placeholders: {
      fullName: "Nom complet",
      email: "Email",
      subject: "Objet",
      message: "Votre message",
    },
    submitButton: "Envoyer",
    email: "contact@momoia.com",
    successMessage: "Merci, votre message a bien ete envoye.",
  },

  agentgamePage: {
    eyebrow: "AgentGame",
    title: "Analysez une entreprise et recevez un retour IA detaille.",
    description:
      "AgentGame vous guide pour structurer votre analyse financiere, rediger votre these d'investissement et comparer votre lecture aux standards professionnels.",
    cta: "Commencer l'analyse",
    yourAnalysis: {
      eyebrow: "Votre analyse",
      title: "Hypothese de valeur",
      description:
        "Redigez votre comprehension de l'activite, du modele economique et des moteurs de croissance pour une entreprise cible.",
      bullets: [
        "Positionnement concurrentiel et avantage durable.",
        "Qualite du management et allocation du capital.",
        "Scenarios de croissance et risques majeurs.",
      ],
    },
    aiFeedback: {
      eyebrow: "Retour IA",
      title: "Synthese et axes d'amelioration",
      description:
        "L'IA fournit un retour structure et met en evidence les angles morts, avec des sources a approfondir.",
      bullets: [
        "Score de coherence strategique.",
        "Checklist de validation financiere.",
        "Recommandations de lecture sectorielle.",
      ],
    },
  },
};

export default fr;
