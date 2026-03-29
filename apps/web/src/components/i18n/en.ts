import fr from "./fr";

type WidenLiterals<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? WidenLiterals<U>[]
        : T extends object
          ? { [K in keyof T]: WidenLiterals<T[K]> }
          : T;

type TranslationShape = WidenLiterals<typeof fr>;

const en: TranslationShape = {
  common: {
    save: "Save",
    back: "Back",
    next: "Continue",
    previous: "Previous",
  },

  header: {
    logoAriaLabel: "Home",
    nav: {
      home: "Home",
      momoia: "MomoIA",
      agentgame: "AgentGame",
      miniQuiz: "Mini quiz",
      about: "About",
      contact: "Contact us",
    },
    login: "Login",
    dashboard: "Dashboard",
    admin: "Admin",
    logout: "Logout",
    getStarted: "Get Started",
  },

  home: {
    promoMomo: {
      eyebrow: "MomoIA",
      title: "Try MomoIA to build your own investment watchlist.",
      description:
        "A clear framework to filter opportunities, prioritize correctly, and build a steady investment method.",
      cta: "Try MomoIA",
    },
    buffett: {
      eyebrow: "Warren Buffett",
      quote: "\"Price is what you pay. Value is what you get.\"",
      quoteBy: "- Warren Buffett",
      paragraphs: [
        "Born in 1930, he transformed Berkshire Hathaway into a reference conglomerate and embodies long-term discipline.",
        "His approach favors durable companies, management quality, and consistent cash flow generation.",
      ],
      essentialsEyebrow: "Core references",
      essentialsTitle: "A patient investment mindset",
      essentials: [
        "Born in 1930 in Omaha, Nebraska.",
        "Chairman of Berkshire Hathaway since 1965.",
        "Philosophy: buy quality companies at a fair price.",
        "Notable wins: GEICO, Coca-Cola, Apple.",
        "Long-term horizon and cycle discipline.",
      ],
      footer:
        "\"Time is the friend of the wonderful company\" captures his method: patience, rigor, and compounding.",
    },
    company: {
      profileEyebrow: "Company profile",
      name: "Lumenis Patrimoine SA",
      demoDataLabel: "Illustrative data",
      profileLines: [
        "Specialist in premium European asset management.",
        "Multi-asset portfolios focused on long-term growth.",
        "International presence with an institutional client base.",
      ],
      ceoEyebrow: "CEO",
      ceoName: "Claire Duval",
      ceoDescription:
        "Former chief investment officer at a European leader, she has led Lumenis Patrimoine since 2018.",
      ceoBullets: [
        "15 years of strategic allocation experience.",
        "Modernized proprietary research workflows.",
        "Structural margin expansion since taking the role.",
      ],
      toolsEyebrow: "Financial tools",
      metrics: [
        { label: "Revenue", value: "EUR 8.2B" },
        { label: "Net income", value: "EUR 1.15B" },
        { label: "Debt", value: "EUR 2.4B" },
        { label: "Cash", value: "EUR 1.9B" },
        { label: "P/E", value: "14.2x" },
        { label: "Net margin", value: "14.1%" },
      ],
      perEyebrow: "Understanding P/E",
      perDescription:
        "The Price Earnings Ratio compares a stock price with earnings per share. It shows how much the market pays for one unit of earnings.",
      perBullets: [
        "High P/E: growth expectations or demanding valuation.",
        "Moderate P/E: more cautious valuation or stable growth.",
        "Compare with the sector average to interpret the signal.",
      ],
    },
    quiz: {
      eyebrow: "Finance quiz",
      title: "Test your fundamentals",
      description: "Five questions to validate your investor reflexes.",
      pausedStatus: "Auto-rotation paused",
      runningStatus: "Automatic rotation",
      correctLabel: "Correct",
      reviewLabel: "Review",
      resultLabel: "Result",
      completedMessage: "Quiz completed. Take time to review your choices.",
      pendingMessage: "Select one answer per question.",
      longQuizCta: "Take a longer quiz",
      exitCta: "Exit quiz",
      questions: [
        {
          prompt:
            "Which metric measures a company's profitability relative to shareholder equity?",
          options: ["Gross margin", "ROE (Return on Equity)", "P/E", "EBITDA"],
          correct: 1,
          note: "ROE compares net income with shareholder equity.",
        },
        {
          prompt: "What does a high P/E ratio generally mean?",
          options: [
            "The market expects strong growth or prices earnings at a premium",
            "The company has no debt",
            "Dividends are guaranteed",
            "Revenue is declining",
          ],
          correct: 0,
          note:
            "A high P/E usually reflects growth expectations or a rich valuation.",
        },
        {
          prompt:
            "What is the main effect of portfolio diversification?",
          options: [
            "Increase leverage",
            "Reduce idiosyncratic risk",
            "Guarantee returns",
            "Eliminate all volatility",
          ],
          correct: 1,
          note:
            "Diversification limits the impact of a risk tied to one single asset.",
        },
        {
          prompt: "What is a bond?",
          options: [
            "An equity stake",
            "A debt instrument with coupon payments",
            "A currency derivative",
            "A preferred stock",
          ],
          correct: 1,
          note:
            "A bond represents debt issued by a company or a sovereign.",
        },
        {
          prompt: "What is the main purpose of a balance sheet?",
          options: [
            "Forecast future sales",
            "Provide a snapshot of assets at a specific date",
            "Calculate operating margin",
            "Measure customer satisfaction",
          ],
          correct: 1,
          note:
            "A balance sheet presents assets, liabilities, and equity at a point in time.",
        },
      ],
    },
    agentgame: {
      eyebrow: "AgentGame",
      title:
        "Analyze a company and get intelligent feedback on your understanding.",
      description:
        "AgentGame helps you structure your analysis, challenge your assumptions, and receive an AI debrief on fundamentals.",
      cta: "Start an analysis",
      receiveEyebrow: "What you get",
      receiveBullets: [
        "A guided analysis framework focused on reliable sources.",
        "A summary of strengths and blind spots.",
        "A comprehension score with learning directions.",
        "A reusable method for every company studied.",
      ],
    },
  },

  momoia: {
    intro: {
      eyebrow: "MomoIA",
      title: "Build your investment watchlist with AI.",
      description:
        "MomoIA helps you build a personalized watchlist based on your target sector, financial criteria, and long-term vision.",
      startButton: "Start the experience",
    },
    steps: {
      eyebrow: "MomoIA journey",
      stepLabel: "Step",
      selectedBadge: "Selected",
      items: [
        {
          id: "sector",
          title: "Choose a sector",
          description: "Select a sector to orient MomoIA's research.",
          multi: false,
          options: [
            { id: "technology", label: "Technology" },
            { id: "health", label: "Healthcare" },
            { id: "industry", label: "Industry" },
            { id: "consumer", label: "Consumer" },
            { id: "energy", label: "Energy" },
            { id: "finance", label: "Finance" },
            { id: "infrastructure", label: "Infrastructure" },
            { id: "real_estate", label: "Real Estate" },
            { id: "services", label: "Services" },
          ],
        },
        {
          id: "primary",
          title: "Choose primary criteria",
          description:
            "Multiple selection allowed. These criteria drive the main direction.",
          multi: true,
          options: [
            { id: "profitability", label: "Profitability" },
            { id: "family_owned", label: "Family-owned business" },
            {
              id: "geographic_diversification",
              label: "Geographic diversification",
            },
            { id: "steady_growth", label: "Steady growth" },
            { id: "low_debt", label: "Low debt" },
            { id: "durable_moat", label: "Durable competitive moat" },
            { id: "management_quality", label: "Management quality" },
          ],
        },
        {
          id: "secondary",
          title: "Choose secondary criteria",
          description: "Refine your filter with complementary indicators.",
          multi: true,
          options: [
            { id: "fair_pe", label: "Reasonable P/E" },
            { id: "strong_cash", label: "Strong cash position" },
            { id: "high_margin", label: "High margin" },
            { id: "stable_track_record", label: "Stable track record" },
            { id: "innovation", label: "Innovation" },
            { id: "sector_leadership", label: "Sector leadership" },
            { id: "regular_dividend", label: "Regular dividend" },
          ],
        },
      ],
    },
    results: {
      eyebrow: "AI result (simulation)",
      title: "Suggested watchlist",
      sectorLabel: "Sector",
      primaryCriteriaLabel: "Primary criteria",
      saveButton: "Save results",
      viewAnalysis: "View analysis",
      viewCompanyPage: "Open company page",
      editCriteria: "Edit criteria",
      loadingCompanies: "Loading companies...",
      emptyResults: "No companies are currently available in the database.",
      saveMessages: {
        needLogin: "You must be logged in to save your results.",
        success: "Results saved successfully.",
      },
      companies: [
        {
          id: "company_a",
          name: "Company A",
          sectorId: "technology",
          thesis: "European software platform with strong recurring revenue.",
        },
        {
          id: "company_b",
          name: "Company B",
          sectorId: "health",
          thesis: "Defensive positioning with a patented portfolio.",
        },
        {
          id: "company_c",
          name: "Company C",
          sectorId: "industry",
          thesis: "Regional leader with long-term contract visibility.",
        },
        {
          id: "company_d",
          name: "Company D",
          sectorId: "finance",
          thesis: "Premium wealth-oriented asset management strategy.",
        },
      ],
    },
    companyPage: {
      eyebrow: "Company page",
      backToMomoia: "Back to MomoIA",
      sector: "Sector",
      ticker: "Ticker",
      country: "Country",
      website: "Visit company website",
      likes: "Likes",
      addToLikes: "Add to my likes",
      removeFromLikes: "Remove from my likes",
      loginToLike: "Sign in to like",
      presentationEyebrow: "Overview",
      presentationTitle: "Business and positioning",
      investmentCase: "Why this company stands out",
      leadershipEyebrow: "Leadership",
      financialsEyebrow: "Key figures",
      financialsTitle: "Recent financial snapshot",
      strengthsEyebrow: "Strengths",
      strengthsTitle: "What works in its favor",
      weaknessesEyebrow: "Weaknesses",
      weaknessesTitle: "Points to monitor",
      metrics: {
        asOf: "Data as of",
        revenue: "Revenue",
        netIncome: "Net income",
        debt: "Debt",
        freeCashFlow: "Free cash flow",
        ebitda: "EBITDA",
        peRatio: "P/E",
        netMargin: "Net margin",
      },
    },
  },

  about: {
    eyebrow: "About",
    title: "Responsible and sustainable financial education.",
    paragraphs: [
      "Our mission is to provide a clear environment to understand investing, build strong convictions, and move forward with method.",
      "We combine analytical rigor, transparency, and long-term discipline to support both retail and institutional investors.",
      "The educational goal is simple: help everyone structure thinking, compare scenarios, and make controlled decisions.",
    ],
    visionEyebrow: "Long-term vision",
    visionBullets: [
      "Responsible and documented financial approach.",
      "Transmission of patience and quality mindset.",
      "Decisions aligned with durable value creation.",
      "Priority to understanding over speculation.",
    ],
  },

  contact: {
    eyebrow: "Contact",
    title: "Let's discuss your investment goals.",
    description:
      "Our team replies quickly with a sober and institutional approach.",
    placeholders: {
      fullName: "Full name",
      email: "Email",
      subject: "Subject",
      message: "Your message",
    },
    submitButton: "Send",
    email: "contact@momoia.com",
    successMessage: "Thank you, your message has been sent.",
  },

  authPages: {
    login: {
      eyebrow: "OAuth access",
      title: "Sign in with Google or GitHub.",
      description:
        "This workspace uses OAuth-only authentication. No password is stored locally. After sign-in, you are redirected to",
      authFailed: "Authentication failed:",
      oauthCallbackHelp:
        "Google or GitHub returned to the application, but processing the callback failed. Check NEXTAUTH_URL, the provider callback URL, the OAuth client secret, and the server logs.",
      accessModelEyebrow: "Access model",
      defaultRole: "New users receive the USER role by default.",
      autoCreateAccount:
        "On your first OAuth sign-in, the application account is automatically created in the database.",
      adminPermission:
        "Admin access depends on the ACCESS_ADMIN permission, not a simple role check.",
      bootstrapAdmin:
        "The first registered user, or any email listed in ADMIN_EMAILS, becomes an administrator.",
      backHome: "Back to home",
      signInWith: "Sign in with",
      oauthLabel: "OAuth",
    },
    dashboard: {
      eyebrow: "Dashboard",
      welcomeBack: "Welcome back",
      description:
        "Your session relies on JWT, while roles and permissions are loaded from PostgreSQL through Prisma during sign-in.",
      email: "Email",
      noEmail: "No email available",
      roles: "Roles",
      permissions: "Permissions",
      sessionPayload: "Session payload",
      quickLinks: "Quick links",
      profile: "Profile",
      settings: "Settings",
      admin: "Admin",
    },
    profile: {
      eyebrow: "Profile",
      title: "Account summary",
      description:
        "OAuth identity comes from NextAuth accounts, while effective access comes from role-permission assignments.",
      identity: "Identity",
      effectiveAuthorization: "Effective authorization",
      name: "Name",
      email: "Email",
      connectedProviders: "Connected providers",
      notProvided: "Not provided",
      noProviderMetadata: "No provider metadata found",
      roles: "Roles",
      permissions: "Permissions",
    },
    settings: {
      eyebrow: "Settings",
      title: "Preferences space",
      descriptionBefore:
        "This page is protected and ready for user preferences, criteria, or notifications. Your account currently has",
      descriptionAfter: "permissions.",
      nextActions: "Next logical actions",
      savePreferences: "Save preferences",
      manageCriteria: "Manage criteria presets",
    },
    admin: {
      eyebrow: "Admin",
      title: "User directory and role assignments",
      descriptionBefore: "This page is protected by the permission",
      descriptionAfter:
        "The same permission is enforced by the middleware and the /api/admin/users endpoint.",
      user: "User",
      unnamedUser: "Unnamed user",
      email: "Email",
      noEmail: "No email",
      roles: "Roles",
      permissions: "Permissions",
      created: "Created",
    },
    accessDenied: {
      title: "Access denied",
      description:
        "Your account is authenticated, but it does not have the required permission to access this area.",
      backToDashboard: "Back to dashboard",
      returnHome: "Return home",
    },
  },

  agentgamePage: {
    eyebrow: "AgentGame",
    title: "Analyze a company and receive detailed AI feedback.",
    description:
      "AgentGame guides you to structure financial analysis, write your investment thesis, and compare your reading to professional standards.",
    cta: "Start analysis",
    yourAnalysis: {
      eyebrow: "Your analysis",
      title: "Value hypothesis",
      description:
        "Write your understanding of the business, economic model, and growth drivers for a target company.",
      bullets: [
        "Competitive positioning and durable moat.",
        "Management quality and capital allocation.",
        "Growth scenarios and key risks.",
      ],
    },
    aiFeedback: {
      eyebrow: "AI feedback",
      title: "Summary and improvement areas",
      description:
        "AI provides structured feedback and highlights blind spots, with sources to explore.",
      bullets: [
        "Strategic coherence score.",
        "Financial validation checklist.",
        "Sector reading recommendations.",
      ],
    },
  },
};

export default en;
