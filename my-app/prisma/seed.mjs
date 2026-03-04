import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const basePermissions = [
  {
    name: "VIEW_DASHBOARD",
    description: "Access the authenticated dashboard.",
  },
  {
    name: "VIEW_PROFILE",
    description: "Access the authenticated profile page.",
  },
  {
    name: "MANAGE_SETTINGS",
    description: "Manage personal settings.",
  },
  {
    name: "CREATE_ANALYSIS_MESSAGE",
    description: "Create AI pedagogy analysis messages.",
  },
  {
    name: "READ_ANALYSIS_MESSAGE",
    description: "Read AI pedagogy analysis messages.",
  },
  {
    name: "ACCESS_ADMIN",
    description: "Access the admin area.",
  },
  {
    name: "MANAGE_USERS",
    description: "Read and manage user roles.",
  },
];

const roleMatrix = {
  USER: [
    "VIEW_DASHBOARD",
    "VIEW_PROFILE",
    "MANAGE_SETTINGS",
    "CREATE_ANALYSIS_MESSAGE",
    "READ_ANALYSIS_MESSAGE",
  ],
  ADMIN: [
    "VIEW_DASHBOARD",
    "VIEW_PROFILE",
    "MANAGE_SETTINGS",
    "CREATE_ANALYSIS_MESSAGE",
    "READ_ANALYSIS_MESSAGE",
    "ACCESS_ADMIN",
    "MANAGE_USERS",
  ],
};

const companyCatalog = [
  {
    slug: "novaspark",
    name: "NovaSpark",
    ticker: "NVS",
    sector: "technology",
    country: "France",
    website: "https://novaspark.example.com",
    description:
      "NovaSpark develops analytics infrastructure for European industrial and financial clients with a high-recurring SaaS model.",
    financials: {
      asOf: new Date("2025-12-31T00:00:00.000Z"),
      revenue: "845000000",
      netIncome: "126000000",
      debt: "92000000",
      freeCashFlow: "149000000",
      ebitda: "201000000",
      peRatio: "18.4",
      netMargin: "14.9",
    },
    extraFinancial: {
      environmental: { score: 74 },
      social: { score: 81 },
      governance: { score: 79 },
      metadata: {
        thesis: {
          fr: "Plateforme analytique europeenne avec revenus recurrents et discipline capitalistique.",
          en: "European analytics platform with recurring revenue and disciplined capital allocation.",
        },
        overview: {
          fr: [
            "NovaSpark fournit des outils de donnees critiques aux directions financieres et aux equipes operations.",
            "La societe combine une base clients fidele, des contrats pluriannuels et une montee en gamme logicielle.",
          ],
          en: [
            "NovaSpark delivers mission-critical data tooling to finance leaders and operations teams.",
            "The company combines a loyal customer base, multi-year contracts, and steady software upmarket expansion.",
          ],
        },
        investmentCase: {
          fr: [
            "Base clients bien diversifiee et peu concentree.",
            "Bonne conversion du resultat en cash.",
            "Capacite a vendre des modules additionnels sur les comptes existants.",
          ],
          en: [
            "Well-diversified customer base with limited concentration risk.",
            "Strong earnings-to-cash conversion.",
            "Ability to expand revenue through add-on modules within existing accounts.",
          ],
        },
        strengths: {
          fr: [
            "Revenus recurrents eleves et churn faible.",
            "Marges en progression grace a un mix produit plus logiciel.",
            "Equipe dirigeante experimentee dans les ventes enterprise.",
          ],
          en: [
            "High recurring revenue and low churn.",
            "Margins improving through a more software-heavy mix.",
            "Leadership team experienced in enterprise sales.",
          ],
        },
        weaknesses: {
          fr: [
            "Valorisation deja exigeante sur certains multiples.",
            "Dependance partielle a la conjoncture des budgets IT.",
            "Execution commerciale a maintenir sur les grands comptes.",
          ],
          en: [
            "Valuation already demanding on some multiples.",
            "Partial exposure to corporate IT budget cycles.",
            "Need to sustain execution quality on large enterprise accounts.",
          ],
        },
        leadership: {
          name: "Claire Duval",
          role: {
            fr: "Directrice generale",
            en: "Chief Executive Officer",
          },
          biography: {
            fr: [
              "Claire Duval dirige NovaSpark depuis 2019 apres un parcours dans l'edition logicielle et le SaaS B2B.",
              "Elle a accelere la transition vers un modele plus recurrent tout en gardant une discipline forte sur les couts.",
            ],
            en: [
              "Claire Duval has led NovaSpark since 2019 after a career in software publishing and B2B SaaS.",
              "She accelerated the shift toward a more recurring model while maintaining strong cost discipline.",
            ],
          },
          highlights: {
            fr: [
              "Ancienne dirigeante regionale chez un acteur logiciel paneuropeen.",
              "A pilote deux acquisitions integrees sans dilution majeure des marges.",
              "Allocation du capital prudente et orientee cash.",
            ],
            en: [
              "Former regional executive at a pan-European software company.",
              "Led two acquisitions integrated without major margin dilution.",
              "Prudent, cash-focused capital allocation.",
            ],
          },
        },
      },
    },
  },
  {
    slug: "helios-biotech",
    name: "Helios Biotech",
    ticker: "HLB",
    sector: "health",
    country: "Belgium",
    website: "https://helios-biotech.example.com",
    description:
      "Helios Biotech builds specialty diagnostics platforms and consumables for oncology and chronic disease monitoring.",
    financials: {
      asOf: new Date("2025-12-31T00:00:00.000Z"),
      revenue: "1210000000",
      netIncome: "189000000",
      debt: "168000000",
      freeCashFlow: "214000000",
      ebitda: "276000000",
      peRatio: "16.7",
      netMargin: "15.6",
    },
    extraFinancial: {
      environmental: { score: 69 },
      social: { score: 84 },
      governance: { score: 82 },
      metadata: {
        thesis: {
          fr: "Acteur defensif de la sante avec portefeuille proprietaire et bonne visibilite sur la demande.",
          en: "Defensive healthcare player with proprietary portfolio and good demand visibility.",
        },
        overview: {
          fr: [
            "Helios Biotech vend des plateformes diagnostiques, des reactifs et des logiciels associes aux laboratoires hospitaliers.",
            "La croissance repose sur une combinaison de volumes recurrents et d'innovations ciblees.",
          ],
          en: [
            "Helios Biotech sells diagnostic platforms, reagents, and connected software to hospital laboratories.",
            "Growth is driven by a mix of recurring volumes and targeted innovation.",
          ],
        },
        investmentCase: {
          fr: [
            "Marche final relativement peu cyclique.",
            "Portefeuille de produits differenciants avec barriere reglementaire.",
            "Free cash-flow robuste pour financer la R&D.",
          ],
          en: [
            "End market is relatively non-cyclical.",
            "Differentiated product portfolio with regulatory barriers.",
            "Robust free cash flow to fund R&D.",
          ],
        },
        strengths: {
          fr: [
            "Bonne resilience du chiffre d'affaires.",
            "Base installee qui soutient les ventes de consommables.",
            "Exposition internationale equilibree.",
          ],
          en: [
            "Strong revenue resilience.",
            "Installed base supports recurring consumables sales.",
            "Balanced international exposure.",
          ],
        },
        weaknesses: {
          fr: [
            "Cycles d'homologation parfois longs.",
            "Risque de pression prix sur certains appels d'offres publics.",
            "Dependance a l'innovation produit sur le long terme.",
          ],
          en: [
            "Approval cycles can be lengthy.",
            "Risk of pricing pressure in some public tenders.",
            "Long-term dependence on product innovation.",
          ],
        },
        leadership: {
          name: "Sofia Martins",
          role: {
            fr: "Presidente directrice generale",
            en: "Chief Executive Officer",
          },
          biography: {
            fr: [
              "Sofia Martins a repris Helios Biotech en 2020 avec une experience de quinze ans dans le diagnostic medical.",
              "Elle a recentre le portefeuille sur les tests a plus forte valeur clinique et economique.",
            ],
            en: [
              "Sofia Martins took over Helios Biotech in 2020 with fifteen years of experience in medical diagnostics.",
              "She refocused the portfolio on tests with stronger clinical and economic value.",
            ],
          },
          highlights: {
            fr: [
              "Ancienne responsable innovation d'un leader du diagnostic.",
              "Culture forte de qualite operationnelle.",
              "Historique credible de croissance rentable.",
            ],
            en: [
              "Former innovation leader at a diagnostic market leader.",
              "Strong culture of operational quality.",
              "Credible track record of profitable growth.",
            ],
          },
        },
      },
    },
  },
  {
    slug: "atelier-forge",
    name: "Atelier Forge",
    ticker: "ATF",
    sector: "industry",
    country: "Germany",
    website: "https://atelier-forge.example.com",
    description:
      "Atelier Forge manufactures precision industrial components for energy grids and transportation infrastructure.",
    financials: {
      asOf: new Date("2025-12-31T00:00:00.000Z"),
      revenue: "980000000",
      netIncome: "97000000",
      debt: "141000000",
      freeCashFlow: "118000000",
      ebitda: "184000000",
      peRatio: "13.8",
      netMargin: "9.9",
    },
    extraFinancial: {
      environmental: { score: 77 },
      social: { score: 73 },
      governance: { score: 76 },
      metadata: {
        thesis: {
          fr: "Leader industriel de niche avec carnet de commandes visible et discipline de bilan.",
          en: "Niche industrial leader with visible backlog and solid balance-sheet discipline.",
        },
        overview: {
          fr: [
            "Atelier Forge fournit des composants de precision pour les infrastructures critiques en Europe.",
            "Le groupe profite de contrats longs et d'une base clients institutionnelle relativement stable.",
          ],
          en: [
            "Atelier Forge supplies precision components for critical infrastructure projects across Europe.",
            "The group benefits from long contracts and a relatively stable institutional customer base.",
          ],
        },
        investmentCase: {
          fr: [
            "Visibilite sur le carnet de commandes a moyen terme.",
            "Bonne discipline industrielle et faible intensite concurrentielle sur certaines lignes.",
            "Capacite a repercuter une partie de l'inflation des couts.",
          ],
          en: [
            "Medium-term backlog visibility.",
            "Strong industrial discipline and limited competition on some product lines.",
            "Ability to pass through part of cost inflation.",
          ],
        },
        strengths: {
          fr: [
            "Carnet de commandes solide.",
            "Relation client profonde avec grands donneurs d'ordre.",
            "Historique de cash generation satisfaisant.",
          ],
          en: [
            "Solid order backlog.",
            "Deep client relationships with major contractors.",
            "Satisfactory cash generation track record.",
          ],
        },
        weaknesses: {
          fr: [
            "Marge plus cyclique que les logiciels ou la sante.",
            "Capex industriel a surveiller.",
            "Sensibilite aux retards de projets publics.",
          ],
          en: [
            "Margins are more cyclical than software or healthcare.",
            "Industrial capex needs monitoring.",
            "Exposure to public project delays.",
          ],
        },
        leadership: {
          name: "Eva Schneider",
          role: {
            fr: "Directrice generale",
            en: "Chief Executive Officer",
          },
          biography: {
            fr: [
              "Eva Schneider pilote Atelier Forge depuis 2017 apres avoir dirige plusieurs activites d'equipements industriels.",
              "Elle a mis l'accent sur la selectivite commerciale et la discipline de cash.",
            ],
            en: [
              "Eva Schneider has led Atelier Forge since 2017 after running several industrial equipment businesses.",
              "She emphasized commercial selectivity and cash discipline.",
            ],
          },
          highlights: {
            fr: [
              "Experience forte sur les cycles industriels.",
              "Bonne execution sur l'amelioration des marges.",
              "Priorite donnee aux contrats a bon retour sur capital.",
            ],
            en: [
              "Deep experience across industrial cycles.",
              "Strong execution on margin improvement.",
              "Focus on contracts with attractive returns on capital.",
            ],
          },
        },
      },
    },
  },
  {
    slug: "orion-patrimoine",
    name: "Orion Patrimoine",
    ticker: "ORP",
    sector: "finance",
    country: "Luxembourg",
    website: "https://orion-patrimoine.example.com",
    description:
      "Orion Patrimoine is a premium wealth and asset management platform focused on long-duration client relationships.",
    financials: {
      asOf: new Date("2025-12-31T00:00:00.000Z"),
      revenue: "690000000",
      netIncome: "111000000",
      debt: "58000000",
      freeCashFlow: "132000000",
      ebitda: "173000000",
      peRatio: "14.5",
      netMargin: "16.1",
    },
    extraFinancial: {
      environmental: { score: 71 },
      social: { score: 76 },
      governance: { score: 83 },
      metadata: {
        thesis: {
          fr: "Maison de gestion premium avec bonne retention client et rentabilite elevee.",
          en: "Premium asset manager with strong client retention and high profitability.",
        },
        overview: {
          fr: [
            "Orion Patrimoine accompagne une clientele patrimoniale et institutionnelle via une offre de gestion et de conseil haut de gamme.",
            "La societe beneficie de revenus recurrentiels lies aux encours et a la fidelite de sa clientele.",
          ],
          en: [
            "Orion Patrimoine serves wealth and institutional clients through a premium advisory and asset management offering.",
            "The company benefits from recurring revenue tied to assets under management and strong client loyalty.",
          ],
        },
        investmentCase: {
          fr: [
            "Modele peu capitalistique.",
            "Rentabilite superieure a la moyenne grace au positionnement premium.",
            "Bonne optionalite via l'extension de l'offre private markets.",
          ],
          en: [
            "Capital-light operating model.",
            "Above-average profitability driven by premium positioning.",
            "Good optionality through expansion in private markets offerings.",
          ],
        },
        strengths: {
          fr: [
            "Forte generation de cash.",
            "Retention client tres elevee.",
            "Risque de bilan limite.",
          ],
          en: [
            "Strong cash generation.",
            "Very high client retention.",
            "Limited balance-sheet risk.",
          ],
        },
        weaknesses: {
          fr: [
            "Sensibilite aux cycles de marche sur les encours.",
            "Image premium a entretenir dans le temps.",
            "Exposition partielle a l'evolution reglementaire.",
          ],
          en: [
            "Exposure to market cycles through assets under management.",
            "Premium brand positioning must be maintained over time.",
            "Partial exposure to regulatory change.",
          ],
        },
        leadership: {
          name: "Nora Lambert",
          role: {
            fr: "Presidente directrice generale",
            en: "Chief Executive Officer",
          },
          biography: {
            fr: [
              "Nora Lambert a rejoint Orion Patrimoine en 2018 apres une carriere dans la banque privee et la gestion d'actifs.",
              "Elle a structure une culture client tres exigeante et renforce la qualite des revenus.",
            ],
            en: [
              "Nora Lambert joined Orion Patrimoine in 2018 after a career in private banking and asset management.",
              "She built a demanding client culture and strengthened revenue quality.",
            ],
          },
          highlights: {
            fr: [
              "Expertise reconnue en clientele haut de gamme.",
              "Strategie disciplinee d'expansion de gamme.",
              "Approche prudente sur les couts et le recrutement.",
            ],
            en: [
              "Recognized expertise with premium client segments.",
              "Disciplined strategy for range expansion.",
              "Prudent approach to costs and hiring.",
            ],
          },
        },
      },
    },
  },
];

function getAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

async function seedPermissions() {
  for (const permission of basePermissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: permission,
    });
  }
}

async function seedRoles() {
  for (const [roleName, permissions] of Object.entries(roleMatrix)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {
        description:
          roleName === "ADMIN"
            ? "Platform administrators with advanced permissions."
            : "Default authenticated user role.",
      },
      create: {
        name: roleName,
        description:
          roleName === "ADMIN"
            ? "Platform administrators with advanced permissions."
            : "Default authenticated user role.",
      },
    });

    for (const permissionName of permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { name: permissionName },
      });

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
}

async function assignBootstrapAdmins() {
  const adminEmails = getAdminEmails();

  if (adminEmails.size === 0) {
    return;
  }

  const adminRole = await prisma.role.findUnique({
    where: { name: "ADMIN" },
  });

  if (!adminRole) {
    return;
  }

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: Array.from(adminEmails),
      },
    },
    select: {
      id: true,
    },
  });

  for (const user of users) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: adminRole.id,
      },
    });
  }
}

async function seedCompanies() {
  for (const companyData of companyCatalog) {
    const company = await prisma.company.upsert({
      where: { slug: companyData.slug },
      update: {
        name: companyData.name,
        ticker: companyData.ticker,
        sector: companyData.sector,
        country: companyData.country,
        website: companyData.website,
        description: companyData.description,
      },
      create: {
        slug: companyData.slug,
        name: companyData.name,
        ticker: companyData.ticker,
        sector: companyData.sector,
        country: companyData.country,
        website: companyData.website,
        description: companyData.description,
      },
    });

    await prisma.extraFinancialMetrics.upsert({
      where: {
        companyId: company.id,
      },
      update: {
        environmental: companyData.extraFinancial.environmental,
        social: companyData.extraFinancial.social,
        governance: companyData.extraFinancial.governance,
        metadata: companyData.extraFinancial.metadata,
      },
      create: {
        companyId: company.id,
        environmental: companyData.extraFinancial.environmental,
        social: companyData.extraFinancial.social,
        governance: companyData.extraFinancial.governance,
        metadata: companyData.extraFinancial.metadata,
      },
    });

    await prisma.financialMetrics.upsert({
      where: {
        companyId_asOf: {
          companyId: company.id,
          asOf: companyData.financials.asOf,
        },
      },
      update: {
        revenue: companyData.financials.revenue,
        netIncome: companyData.financials.netIncome,
        debt: companyData.financials.debt,
        freeCashFlow: companyData.financials.freeCashFlow,
        ebitda: companyData.financials.ebitda,
        peRatio: companyData.financials.peRatio,
        netMargin: companyData.financials.netMargin,
      },
      create: {
        companyId: company.id,
        asOf: companyData.financials.asOf,
        revenue: companyData.financials.revenue,
        netIncome: companyData.financials.netIncome,
        debt: companyData.financials.debt,
        freeCashFlow: companyData.financials.freeCashFlow,
        ebitda: companyData.financials.ebitda,
        peRatio: companyData.financials.peRatio,
        netMargin: companyData.financials.netMargin,
      },
    });
  }
}

async function main() {
  await seedPermissions();
  await seedRoles();
  await seedCompanies();
  await assignBootstrapAdmins();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed RBAC data.", error);
    await prisma.$disconnect();
    process.exit(1);
  });
