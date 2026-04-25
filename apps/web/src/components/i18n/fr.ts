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
    menu: "Menu",
    navigation: "Navigation",
    language: "Langue",
    account: "Compte",
    guestLabel: "Espace personnel",
    accountFallback: "Mon compte",
  },

  home: {
    promoMomo: {
      eyebrow: "MomoIA",
      title: "Construisez une watchlist claire et exploitable.",
      description:
        "Recherchez, comparez et priorisez vos entreprises en quelques etapes.",
      cta: "Essayer MomoIA",
    },
    buffett: {
      eyebrow: "Warren Buffett",
      quote: "\"Le prix est ce que vous payez. La valeur est ce que vous obtenez.\"",
      quoteBy: "- Warren Buffett",
      paragraphs: [
        "Warren Buffett reste une reference pour une lecture simple et exigeante des entreprises.",
        "Sa methode privilegie la qualite, la discipline et le long terme.",
      ],
      essentialsEyebrow: "Reperes essentiels",
      essentialsTitle: "Les principes a retenir",
      essentials: [
        "Ne en 1930 a Omaha, Nebraska.",
        "President de Berkshire Hathaway depuis 1965.",
        "Acheter de bonnes entreprises a un prix raisonnable.",
        "Priorite au cash, au management et a la regularite.",
      ],
      footer:
        "Une approche sobre, lisible et patiente.",
    },
    company: {
      profileEyebrow: "Fiche entreprise",
      name: "Lumenis Patrimoine SA",
      demoDataLabel: "Donnees illustratives",
      profileLines: [
        "Gestion d'actifs premium en Europe.",
        "Base clients institutionnelle et privee.",
        "Croissance disciplinee sur le long terme.",
      ],
      ceoEyebrow: "CEO",
      ceoName: "Claire Duval",
      ceoDescription:
        "Direction en place depuis 2018 avec un cap clair sur la rentabilite.",
      ceoBullets: [
        "15 ans d'experience en allocation.",
        "Execution rigoureuse.",
        "Marges en progression.",
      ],
      toolsEyebrow: "Outils financiers",
      metrics: [
        { label: "Chiffre d'affaires", value: "8,2 Md EUR" },
        { label: "Resultat net", value: "1,15 Md EUR" },
        { label: "Endettement", value: "2,4 Md EUR" },
        { label: "PER", value: "14,2x" },
      ],
      perEyebrow: "Comprendre le PER",
      perDescription:
        "Le PER compare le prix de l'action au benefice par action.",
      perBullets: [
        "Un PER eleve traduit souvent des attentes fortes.",
        "Un PER modere peut signaler une valorisation plus sobre.",
        "Le secteur reste le meilleur point de comparaison.",
      ],
    },
    quiz: {
      eyebrow: "Quiz financier",
      title: "Testez vos fondamentaux",
      description: "Cinq questions pour verifier l'essentiel.",
      correctLabel: "Correct",
      reviewLabel: "A revoir",
      resultLabel: "Resultat",
      completedMessage: "Votre score final sur 5 est disponible.",
      pendingMessage: "Choisissez une reponse puis validez.",
      continueCta: "Continuer sur MomoIA",
      validateCta: "Valider",
      nextQuestionCta: "Question suivante",
      finishCta: "Terminer",
      retryCta: "Recommencer",
      finalScoreTitle: "Score final",
      questionLabel: "Question",
      progressLabel: "Avancement",
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
        "Structurez une analyse et obtenez un retour clair.",
      description:
        "Un espace pour formaliser une these, verifier vos points forts et progresser.",
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
      viewCompanyPage: "Voir la fiche entreprise",
      editCriteria: "Modifier les criteres",
      loadingCompanies: "Chargement des entreprises en cours...",
      emptyResults:
        "Aucune entreprise n'est disponible pour le moment dans la base.",
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
    scoreTool: {
      eyebrow: "Scoring Buffett",
      title: "Recherchez une entreprise et obtenez une lecture rapide.",
      pageDescription:
        "Recherchez une entreprise, verifiez les chiffres utiles et comparez vos notes.",
      description:
        "Les donnees publiques sont recuperees automatiquement pour aller a l'essentiel.",
      backendBadge: "Python + Random Forest",
      yahooBadge: "Yahoo Finance",
      autocompleteBadge: "Autocompletion",
      backendHint:
        "Le moteur Python doit etre lance via `npm run buffett:api` pour obtenir une note.",
      searchUnavailableMessage:
        "La recherche Yahoo Finance ne repond pas pour le moment.",
      lookupUnavailableMessage:
        "Impossible de recuperer les fondamentaux Yahoo Finance pour cette entreprise.",
      unavailableMessage:
        "Le service de notation est indisponible pour le moment.",
      errorTitle: "Scoring indisponible",
      searchErrorTitle: "Recherche indisponible",
      searchTitle: "Recherche Yahoo Finance",
      searchDescription:
        "Tapez un ticker ou un nom d'entreprise pour obtenir une autocompletion et pre-remplir automatiquement le formulaire.",
      searchLabel: "Rechercher une entreprise",
      searchPlaceholder: "Ex. Apple, AAPL, LVMH, MSFT",
      searchHint:
        "Selectionnez un resultat pour charger les donnees financieres publiques et lancer automatiquement une premiere note.",
      searchLoading: "Recherche en cours sur Yahoo Finance...",
      searchEmpty:
        "Aucun resultat exploitable n'a ete trouve. Essayez un ticker plus precis.",
      prefillButton: "Pre-remplir",
      advancedSettings: "Parametres supplementaires",
      hideAdvancedSettings: "Masquer les parametres supplementaires",
      removeCompany: "Retirer l'entreprise",
      missingValuesLabel: "Valeurs manquantes",
      marketPriceLabel: "Dernier prix",
      selectedCompanyTitle: "Entreprise selectionnee",
      openWebsite: "Ouvrir le site",
      formTitle: "Donnees entreprise",
      formDescription:
        "Vous pouvez ajuster les donnees recuperees automatiquement avant de relancer le scoring. Les scores ESG restent modifiables manuellement.",
      resetButton: "Reinitialiser",
      financialSectionTitle: "Fondamentaux financiers",
      financialSectionDescription:
        "Les fonds propres sont maintenant pris en compte dans le moteur Buffett via le rendement des capitaux propres et le ratio dette / fonds propres.",
      esgSectionTitle: "Scores de qualite",
      esgSectionDescription:
        "Ces trois scores servent a estimer la durabilite et la gouvernance du modele economique.",
      netMarginHint:
        "Vous pouvez laisser la marge nette vide. Le backend l'estimera alors a partir du resultat net et du chiffre d'affaires.",
      submitButton: "Noter l'entreprise",
      submittingButton: "Analyse en cours...",
      lookupLoading: "Chargement des donnees Yahoo Finance...",
      scoringListTitle: "Liste de scoring",
      scoringListEmpty:
        "Ajoutez des entreprises pour comparer les scores.",
      companyDetailsTitle: "Fiche entreprise",
      companyDetailsEmptyTitle: "Selectionnez une entreprise",
      companyDetailsEmptyDescription:
        "Cliquez sur une entreprise de la liste pour afficher sa description Yahoo Finance et sa direction.",
      descriptionTitle: "Description",
      leadershipTitle: "Direction",
      leadershipEmpty:
        "Yahoo Finance n'a pas remonte d'information de direction pour cette entreprise.",
      industryLabel: "Industrie",
      employeesLabel: "Employes",
      headquartersLabel: "Siege",
      resultTitle: "Note IA",
      emptyStateTitle: "Pret pour l'analyse",
      emptyStateDescription:
        "Commencez par rechercher une entreprise ou saisissez manuellement ses chiffres. Le score apparaitra ici avec le detail des piliers.",
      scoreLabel: "Note Buffett",
      heuristicLabel: "Score heuristique",
      componentScoresTitle: "Piliers du score",
      rationaleTitle: "Lecture de l'IA",
      fields: {
        name: "Nom de l'entreprise",
        sector: "Secteur",
        country: "Pays",
        revenue: "Chiffre d'affaires",
        netIncome: "Resultat net",
        debt: "Dette",
        shareholdersEquity: "Fonds propres",
        freeCashFlow: "Free cash-flow",
        ebitda: "EBITDA",
        peRatio: "PER",
        netMargin: "Marge nette",
        environmentalScore: "Score environnement",
        socialScore: "Score social",
        governanceScore: "Score gouvernance",
      },
      placeholders: {
        name: "Ex. NovaSpark",
        country: "Ex. France",
      },
      tiers: {
        excellent: "Excellent",
        solide: "Solide",
        correct: "Correct",
        prudence: "Prudence",
      },
      components: {
        profitability: "Rentabilite",
        cash_generation: "Generation de cash",
        balance_sheet: "Bilan",
        valuation: "Valorisation",
        durability: "Durabilite",
      },
    },
    companyPage: {
      eyebrow: "Fiche entreprise",
      backToMomoia: "Retour a MomoIA",
      sector: "Secteur",
      ticker: "Ticker",
      country: "Pays",
      website: "Visiter le site de l'entreprise",
      likes: "Likes",
      addToLikes: "Ajouter a mes likes",
      removeFromLikes: "Retirer de mes likes",
      loginToLike: "Se connecter pour liker",
      presentationEyebrow: "Presentation",
      presentationTitle: "Activite et positionnement",
      investmentCase: "Pourquoi cette entreprise ressort",
      leadershipEyebrow: "Direction",
      financialsEyebrow: "Chiffres cles",
      financialsTitle: "Vue financiere recente",
      strengthsEyebrow: "Points forts",
      strengthsTitle: "Ce qui joue en sa faveur",
      weaknessesEyebrow: "Points faibles",
      weaknessesTitle: "Points de vigilance",
      metrics: {
        asOf: "Donnees au",
        revenue: "Chiffre d'affaires",
        netIncome: "Resultat net",
        debt: "Dette",
        freeCashFlow: "Free cash-flow",
        ebitda: "EBITDA",
        peRatio: "PER",
        netMargin: "Marge nette",
      },
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

  authPages: {
    login: {
      eyebrow: "Acces OAuth",
      title: "Connectez-vous avec Google ou GitHub.",
      description:
        "Connectez-vous pour acceder a votre espace. Apres connexion, vous arrivez sur",
      authFailed: "Echec de l'authentification :",
      oauthCallbackHelp:
        "Google ou GitHub a bien renvoye vers l'application, mais le traitement du callback a echoue. Verifiez NEXTAUTH_URL, l'URL de callback du provider, le client secret OAuth et les logs du serveur.",
      accessModelEyebrow: "Modele d'acces",
      defaultRole:
        "Un espace personnel est cree des la premiere connexion.",
      autoCreateAccount:
        "Google et GitHub sont disponibles selon votre preference.",
      adminPermission:
        "Les acces avances sont geres separement.",
      bootstrapAdmin:
        "Les droits administrateur restent reserves.",
      backHome: "Retour a l'accueil",
      signInWith: "Se connecter avec",
      oauthLabel: "OAuth",
    },
    dashboard: {
      eyebrow: "Dashboard",
      welcomeBack: "Heureux de vous revoir",
      description:
        "Bienvenue sur votre dashboard. Retrouvez ici vos informations personnelles et vos acces utiles.",
      profile: "Profil",
      settings: "Parametres",
      admin: "Admin",
      profileDescription: "Mettez a jour vos informations personnelles.",
      settingsDescription: "Ajustez votre experience en quelques clics.",
      adminDescription: "Accedez aux outils d'administration.",
    },
    profile: {
      eyebrow: "Profil",
      title: "Votre profil",
      description:
        "Gardez vos informations a jour dans un espace simple et lisible.",
      identity: "Identite",
      name: "Nom",
      firstName: "Prenom",
      lastName: "Nom",
      email: "Email",
      residenceCountry: "Pays de residence",
      countryPlaceholder: "Selectionnez un pays",
      saveProfile: "Enregistrer",
      saved: "Enregistre",
      accountSummary: "Resume",
      connectedProviders: "Fournisseurs connectes",
      notProvided: "Non renseigne",
      noProviderMetadata: "Aucune metadonnee de fournisseur trouvee",
    },
    settings: {
      eyebrow: "Parametres",
      title: "Vos parametres",
      description: "Activez uniquement ce qui vous est utile.",
      localSaveBadge: "Sauvegarde locale",
      marketAlertsTitle: "Alertes de marche",
      marketAlertsDescription: "Recevoir les alertes importantes.",
      weeklyDigestTitle: "Resume hebdomadaire",
      weeklyDigestDescription: "Un point rapide chaque semaine.",
      compactDashboardTitle: "Dashboard compact",
      compactDashboardDescription: "Afficher une interface plus concise.",
      contextualTipsTitle: "Aides contextuelles",
      contextualTipsDescription: "Afficher des rappels discrets dans l'interface.",
    },
    admin: {
      eyebrow: "Admin",
      title: "Annuaire utilisateurs et attribution des roles",
      descriptionBefore: "Cette page est protegee par la permission",
      descriptionAfter:
        "La meme permission est verifiee par le middleware et l'endpoint /api/admin/users.",
      user: "Utilisateur",
      unnamedUser: "Utilisateur sans nom",
      email: "Email",
      noEmail: "Aucun email",
      roles: "Roles",
      permissions: "Permissions",
      created: "Cree le",
    },
    accessDenied: {
      title: "Acces refuse",
      description:
        "Votre compte est authentifie, mais il ne dispose pas de la permission requise pour acceder a cette zone.",
      backToDashboard: "Retour au dashboard",
      returnHome: "Retour a l'accueil",
    },
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
