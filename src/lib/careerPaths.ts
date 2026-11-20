import type { AcademyCategory } from "./academyStore";

export interface CareerLadderTier {
  tier: "Entry & Associate" | "Mid-Level Practitioner" | "Senior & Leadership";
  roleTitle: string;
  typicalExperience: string;
  compBenchmark: string;
  responsibilities: string;
}

export interface SystemCollaborationPillar {
  label: string;
  detail: string;
  href: string;
}

export interface RecommendedProgramLink {
  courseId: string;
  recommendationBadge: string;
  stageLabel: string;
  whyItFitsCareer: string;
}

export interface IndividualCareerPath {
  id: string;
  domain: AcademyCategory;
  professionCategory: string;
  title: string;
  executiveOverview: string;
  startingLevel: "Career-Entry Accessible" | "Mid-Career Transition" | "Senior Specialization";
  idealFor: string;
  heroImage: string;
  jobMarket: {
    demandOutlook: string;
    demandMetric: string;
    globalCompRange: string;
    regionalMobility: string;
    hiringIndustries: string[];
    marketDrivers: string[];
    hiringManagerBar: string[];
  };
  careerLadder: CareerLadderTier[];
  expertise: {
    technicalExpertise: string[];
    advisoryExpertise: string[];
    productionToolchain: string[];
  };
  systemCollaboration: {
    summary: string;
    pillars: SystemCollaborationPillar[];
    capstoneOutcome: string;
  };
  recommendedPrograms: RecommendedProgramLink[];
}

export interface CapabilityMaturityTier {
  stage: "Stage 01 · Standardized Baseline" | "Stage 02 · Production Autonomy" | "Stage 03 · Enterprise Excellence";
  capabilityTitle: string;
  teamFocus: string;
  targetKpi: string;
  operationalOwnership: string;
}

export interface BusinessCareerPath {
  id: string;
  domain: AcademyCategory;
  department: string;
  title: string;
  executiveOverview: string;
  recommendedTeamSize: string;
  deliveryFormat: string;
  heroImage: string;
  talentMarket: {
    marketChallenge: string;
    buildVsBuyAdvantage: string;
    targetSectors: string[];
    operationalDrivers: string[];
    auditAndRiskImpact: string;
  };
  capabilityLadder: CapabilityMaturityTier[];
  teamExpertise: {
    technicalStandards: string[];
    governanceCapabilities: string[];
    rolesTransformed: string[];
  };
  systemCollaboration: {
    summary: string;
    pillars: SystemCollaborationPillar[];
    governanceDeliverable: string;
  };
  recommendedPrograms: RecommendedProgramLink[];
}

export interface MarketMacroSignal {
  eyebrow: string;
  headline: string;
  detail: string;
}

export interface EcosystemPillar {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  href: string;
}

export const INDIVIDUAL_MARKET_SIGNALS: MarketMacroSignal[] = [
  {
    eyebrow: "Hiring Shift",
    headline: "Portfolio-Verified Hiring",
    detail:
      "Employers increasingly screen for live SQL models, Terraform repositories, and defended architectures over passive certificates.",
  },
  {
    eyebrow: "Global Mobility",
    headline: "Cross-Border Remote Demand",
    detail:
      "Cloud, Data, and Security roles hire globally across North America, Europe, the UK, and Africa with competitive USD/GBP bands.",
  },
  {
    eyebrow: "Enduring Shortage",
    headline: "Practitioner Supply Gap",
    detail:
      "Organizations face persistent shortages in multi-cloud infrastructure, analytics engineering, and cloud security defense.",
  },
  {
    eyebrow: "Our System",
    headline: "Consulting-Backed Standards",
    detail:
      "Every career track aligns directly with Elites Technology Systems' active enterprise architecture, data, and security practice.",
  },
];

export const BUSINESS_MARKET_SIGNALS: MarketMacroSignal[] = [
  {
    eyebrow: "Talent Economics",
    headline: "Build vs. Buy Advantage",
    detail:
      "External senior cloud and security hires routinely take 4 to 6 months; structured internal upskilling converts domain staff faster.",
  },
  {
    eyebrow: "Standardization",
    headline: "Unified Team Architecture",
    detail:
      "Replace fragmented ad-hoc scripts and conflicting spreadsheets with shared IaC, dbt, FinOps, and zero-trust operating standards.",
  },
  {
    eyebrow: "Risk & Compliance",
    headline: "Audit-Ready Execution",
    detail:
      "Close security, cloud spend, and AI data-privacy exposure with hands-on labs mapped to NIST CSF 2.0, SOC 2, and FinOps controls.",
  },
  {
    eyebrow: "System Telemetry",
    headline: "Measurable Capability ROI",
    detail:
      "Track departmental seat progress, quiz readiness, and Open Badges v2 credentials directly inside our Corporate Enablement Portal.",
  },
];

export const INDIVIDUAL_ECOSYSTEM_PILLARS: EcosystemPillar[] = [
  {
    index: "01",
    title: "Consulting-Grade Career Standards",
    subtitle: "Informed by Active Enterprise Delivery",
    description:
      "Our career blueprints are not academic theory. They are shaped directly by the cloud migrations, BI warehouses, and security audits Elites Technology Systems delivers for real organizations across three continents.",
    ctaLabel: "Explore Our Consulting Practice",
    href: "/services",
  },
  {
    index: "02",
    title: "Interactive Classroom & Sandbox Labs",
    subtitle: "Production Tooling Over Slide Decks",
    description:
      "Inside the Elites Learner Workspace, you build real SQL star schemas, Terraform landing zones, SIEM investigation rules, and Python pipelines with structured lab rubrics and weekly practitioner reviews.",
    ctaLabel: "Preview Learner Workspace",
    href: "/academy/learn",
  },
  {
    index: "03",
    title: "Defended Capstone & Credential Registry",
    subtitle: "Employer-Verifiable Open Badges v2",
    description:
      "Graduate with a live GitHub/BI architecture portfolio defended before senior practitioners, paired with a permanent credential code employers and recruiters can verify in seconds.",
    ctaLabel: "Open Verification Registry",
    href: "/academy/verify",
  },
  {
    index: "04",
    title: "Guided Role Alignment & Progression",
    subtitle: "First Role to Senior Track",
    description:
      "Use our onboarding assessment to map your background to the right career track, pay transparently with 2-part installments, and stack credentials as you advance toward senior roles.",
    ctaLabel: "Start Career Alignment",
    href: "/academy/get-started",
  },
];

export const BUSINESS_ECOSYSTEM_PILLARS: EcosystemPillar[] = [
  {
    index: "01",
    title: "Consulting & Academy Synergy",
    subtitle: "Aligned to Your Live Production Stack",
    description:
      "Pair departmental upskilling with Elites Technology Systems' senior architects so your engineers train on the exact AWS, Azure, Power BI, Kubernetes, and security patterns your business runs.",
    ctaLabel: "View Consulting Capabilities",
    href: "/services",
  },
  {
    index: "02",
    title: "Private Cohorts & Shared Seat Pods",
    subtitle: "Flexible Scale From 5 to 250+ Staff",
    description:
      "Enroll small squads into scheduled practitioner cohorts or launch a private, company-dedicated bootcamp tailored to your compliance calendar, internal repositories, and team roles.",
    ctaLabel: "Scope Private Cohort",
    href: "/academy/corporate#request-demo",
  },
  {
    index: "03",
    title: "Live Manager Telemetry & Governance",
    subtitle: "Real Completion & Assessment Visibility",
    description:
      "Engineering leaders and L&D managers monitor module completion, technical quiz performance, seat reassignment, and CSV readiness exports from one unified portal.",
    ctaLabel: "Explore Enterprise Portal",
    href: "/academy/corporate",
  },
  {
    index: "04",
    title: "Transparent Net-30 Corporate Billing",
    subtitle: "Procurement-Ready Quotes in USD, GBP & GHS",
    description:
      "Generate auditable per-seat corporate quotes in minutes with standard Net-30 purchase order invoicing, Open Badges v2 audit proof, and zero hidden platform fees.",
    ctaLabel: "Configure Team Seat Quote",
    href: "/academy/tuition?mode=corporate",
  },
];

export const INDIVIDUAL_CAREER_PATHS: IndividualCareerPath[] = [
  {
    id: "ind-path-data-bi",
    domain: "Data & BI",
    professionCategory: "Decision Intelligence & Analytics",
    title: "Data Analytics & Business Intelligence",
    executiveOverview:
      "Data and Business Intelligence professionals serve as the analytical engine of modern enterprises. Rather than simply building charts, they translate fragmented operational, financial, and customer data into trusted executive KPI systems that govern pricing, growth, risk, and capital allocation.",
    startingLevel: "Career-Entry Accessible",
    idealFor:
      "Finance, operations, business graduates, and career switchers who enjoy solving commercial problems with structured data.",
    heroImage: "/academy/prog-data-bi.jpg",
    jobMarket: {
      demandOutlook: "Sustained High Demand",
      demandMetric: "Core hiring priority across 90%+ mid-to-large enterprises",
      globalCompRange: "$65,000 – $140,000+ USD (Global Remote & US/UK)",
      regionalMobility: "High remote & hybrid portability across North America, UK, Europe & Africa",
      hiringIndustries: [
        "Banking & FinTech",
        "Telecommunications",
        "Retail & E-Commerce",
        "Healthcare & Insurance",
        "Management Consulting",
      ],
      marketDrivers: [
        "Organizations are retiring fragile manual spreadsheet packs in favor of governed self-refreshing semantic models.",
        "Executives expect analysts to pair SQL and Python automation with clear commercial storytelling—not just Excel exports.",
        "AI-assisted analytics increases demand for practitioners who can validate metric definitions and data quality upstream.",
      ],
      hiringManagerBar: [
        "Write clean, performant SQL joins, CTEs, and window functions under timed technical review.",
        "Model a proper star schema in Power BI / Tableau and explain DAX filter context clearly.",
        "Present an executive KPI dashboard and defend business recommendations to non-technical stakeholders.",
      ],
    },
    careerLadder: [
      {
        tier: "Entry & Associate",
        roleTitle: "Data Analyst / Reporting Analyst",
        typicalExperience: "0 – 2 Years",
        compBenchmark: "$55k – $80k",
        responsibilities:
          "Clean operational datasets, automate recurring Excel/SQL reporting packs, maintain departmental dashboards, and investigate metric variances.",
      },
      {
        tier: "Mid-Level Practitioner",
        roleTitle: "BI Developer / Analytics Engineer",
        typicalExperience: "2 – 5 Years",
        compBenchmark: "$85k – $125k",
        responsibilities:
          "Design dimensional star schemas, build tested dbt Core transformation layers, govern enterprise Power BI/Tableau workspaces, and partner with finance & product leads.",
      },
      {
        tier: "Senior & Leadership",
        roleTitle: "Lead BI Architect / Head of Analytics",
        typicalExperience: "5+ Years",
        compBenchmark: "$130k – $175k+",
        responsibilities:
          "Define enterprise KPI taxonomy, oversee cloud warehouse governance, mentor analyst pods, and advise C-suite leaders on data-driven strategy.",
      },
    ],
    expertise: {
      technicalExpertise: [
        "Relational SQL mastery (CTEs, window functions, query tuning & reconciliation)",
        "Dimensional star-schema modeling, fact/dimension grain & SCD history design",
        "Power BI DAX semantic modeling & interactive Tableau executive storytelling",
        "Python Pandas data cleaning, automated QA checks & ETL orchestration",
        "Tested dbt Core warehouse marts with automated freshness and uniqueness tests",
      ],
      advisoryExpertise: [
        "Translating ambiguous executive questions into precise, auditable KPI formulas",
        "Eliminating conflicting departmental numbers through certified data dictionaries",
        "Presenting financial and operational narratives concisely to senior leadership",
        "Scoping self-service reporting governance and stakeholder adoption workflows",
      ],
      productionToolchain: [
        "PostgreSQL & Snowflake",
        "Power BI & DAX",
        "Tableau",
        "Python Pandas",
        "dbt Core",
        "Excel Power Query & Alteryx",
      ],
    },
    systemCollaboration: {
      summary:
        "Elites Technology Systems builds enterprise BI architectures and data platforms for corporate clients—meaning our curriculum trains you on the exact modeling conventions, SQL standards, and executive review rubrics real hiring teams expect.",
      pillars: [
        {
          label: "Consulting-Backed BI Rubrics",
          detail:
            "Dashboard layouts, star schemas, and KPI definitions follow the exact quality bar our advisory team delivers to enterprise clients.",
          href: "/services",
        },
        {
          label: "Live SQL & Warehouse Lab Environment",
          detail:
            "Practice inside our guided Learner Workspace with realistic messy business datasets, automated grading checks, and mentor feedback.",
          href: "/academy/learn",
        },
        {
          label: "Verifiable Portfolio & Credential Proof",
          detail:
            "Defend your live warehouse and Power BI portfolio to earn an employer-verifiable Open Badges v2 credential link.",
          href: "/academy/verify",
        },
      ],
      capstoneOutcome:
        "A production-grade cloud warehouse + certified Power BI and Tableau executive decision suite defended live before senior practitioners.",
    },
    recommendedPrograms: [
      {
        courseId: "course-data-bi",
        recommendationBadge: "Best Starting Program",
        stageLabel: "Core Analytics & BI Foundation",
        whyItFitsCareer:
          "Builds end-to-end commercial analyst readiness across Excel modeling, production SQL, Python Pandas, Alteryx, Tableau, and Power BI DAX.",
      },
      {
        courseId: "course-sql-warehouse",
        recommendationBadge: "Best Career Accelerator",
        stageLabel: "Analytics Engineering & Warehousing",
        whyItFitsCareer:
          "Elevates analysts into high-demand Analytics Engineer roles by adding star-schema warehousing, SCD history, and tested dbt Core pipelines.",
      },
    ],
  },
  {
    id: "ind-path-it-cloud",
    domain: "Cloud & DevOps",
    professionCategory: "Cloud Infrastructure & Platform Engineering",
    title: "Cloud Engineering & DevOps Infrastructure",
    executiveOverview:
      "Cloud and DevOps engineers design, automate, and operate the infrastructure that keeps digital businesses resilient, fast, and scalable. From Linux systems and networking foundations to Terraform automation and CI/CD pipelines, this career sits at the backbone of every modern technology organization.",
    startingLevel: "Career-Entry Accessible",
    idealFor:
      "Beginners entering IT, help-desk technicians, system administrators, and developers moving into cloud infrastructure and automation.",
    heroImage: "/academy/prog-cloud-devops.jpg",
    jobMarket: {
      demandOutlook: "Critical Global Shortage",
      demandMetric: "85%+ of enterprises actively expanding cloud automation & IaC",
      globalCompRange: "$75,000 – $160,000+ USD (Global Remote & US/UK)",
      regionalMobility: "Exceptionally strong international & remote demand across all major cloud regions",
      hiringIndustries: [
        "Cloud SaaS & Software",
        "Financial Services & Payments",
        "Telecoms & Media",
        "Energy & Logistics",
        "Technology Consulting",
      ],
      marketDrivers: [
        "Manual server clicks create outages and audit failures; companies urgently hire engineers who codify cloud systems in Terraform.",
        "Continuous deployment and containerized workloads have become baseline expectations for software delivery teams.",
        "A structured entry ramp from IT Support & Linux into Cloud DevOps remains one of the clearest high-ROI transitions in tech.",
      ],
      hiringManagerBar: [
        "Troubleshoot Linux permissions, DNS resolution, VPC routing, and subnetting cleanly from the command line.",
        "Write modular Terraform code with remote state locking instead of provisioning resources manually.",
        "Diagnose a broken Docker container build or failing CI/CD deployment pipeline systematically.",
      ],
    },
    careerLadder: [
      {
        tier: "Entry & Associate",
        roleTitle: "IT Support Specialist / Junior Linux SysAdmin",
        typicalExperience: "0 – 2 Years",
        compBenchmark: "$50k – $75k",
        responsibilities:
          "Manage endpoints, troubleshoot TCP/IP and DNS issues, administer Linux servers, write Bash maintenance scripts, and support cloud access workflows.",
      },
      {
        tier: "Mid-Level Practitioner",
        roleTitle: "Cloud Engineer / DevOps Engineer",
        typicalExperience: "2 – 5 Years",
        compBenchmark: "$95k – $140k",
        responsibilities:
          "Provision AWS and Azure environments with Terraform, build multi-stage Docker images, run GitHub Actions CI/CD pipelines, and maintain monitoring alerts.",
      },
      {
        tier: "Senior & Leadership",
        roleTitle: "Senior Platform Engineer / DevOps Lead",
        typicalExperience: "5+ Years",
        compBenchmark: "$145k – $195k+",
        responsibilities:
          "Architect multi-account cloud platforms, standardize golden IaC modules across engineering squads, govern reliability SLOs, and lead zero-downtime cutovers.",
      },
    ],
    expertise: {
      technicalExpertise: [
        "Linux administration, systemd diagnostics, SSH hardening & Bash automation",
        "TCP/IP networking, CIDR subnetting, DNS, firewalls & cloud VPC design",
        "Reusable Terraform Infrastructure-as-Code modules with remote state locking",
        "Multi-stage Docker containerization, Kubernetes workload basics & registry hygiene",
        "Automated CI/CD delivery pipelines, blue/green deployments & log observability",
      ],
      advisoryExpertise: [
        "Documenting repeatable operational runbooks and post-incident root-cause reviews",
        "Collaborating cleanly between software developers, security teams, and infrastructure ops",
        "Enforcing full code ownership, change control, and drift-free environment hygiene",
        "Estimating infrastructure reliability trade-offs and cloud resource footprints",
      ],
      productionToolchain: [
        "AWS & Microsoft Azure",
        "Linux & Bash",
        "Terraform IaC",
        "Docker & Kubernetes",
        "Git & GitHub Actions",
        "Prometheus & CloudWatch",
      ],
    },
    systemCollaboration: {
      summary:
        "Cloud migration and DevOps automation are Elites Technology Systems' flagship consulting practices. You learn infrastructure-as-code and operational handover using the same open-standard patterns we deploy for enterprise production systems.",
      pillars: [
        {
          label: "Real-World Architecture Standards",
          detail:
            "Every VPC topology, Terraform module, and CI/CD workflow mirrors our client-owned cloud consulting standards.",
          href: "/services",
        },
        {
          label: "Hands-On Command-Line & IaC Labs",
          detail:
            "Build, break, and automate live Linux, Docker, and cloud configurations inside structured classroom sprints.",
          href: "/academy/learn",
        },
        {
          label: "Verified Deployment Portfolio",
          detail:
            "Graduate with a documented GitHub Terraform & CI/CD repository backed by an employer-verifiable Open Badges v2 record.",
          href: "/academy/verify",
        },
      ],
      capstoneOutcome:
        "A repeatable, version-controlled multi-environment cloud landing zone deployed end-to-end with Terraform, Docker, and CI/CD.",
    },
    recommendedPrograms: [
      {
        courseId: "course-it-foundations",
        recommendationBadge: "Best Entry Ramp",
        stageLabel: "IT, Networking & Linux Foundations",
        whyItFitsCareer:
          "Ideal if you are starting from scratch—builds non-negotiable OS, TCP/IP networking, DNS, Linux CLI, and Bash mastery before touching cloud IaC.",
      },
      {
        courseId: "course-cloud-devops",
        recommendationBadge: "Best Core Career Program",
        stageLabel: "Cloud Automation & DevOps Engineering",
        whyItFitsCareer:
          "Delivers the production AWS/Azure, Terraform, Docker, Kubernetes, and CI/CD skillset directly tested in Cloud & DevOps interviews.",
      },
    ],
  },
  {
    id: "ind-path-cyber-soc",
    domain: "Cybersecurity",
    professionCategory: "Cyber Defense & Cloud Security Operations",
    title: "Cybersecurity Operations & Cloud Defense",
    executiveOverview:
      "Cybersecurity defenders protect enterprise cloud accounts, identities, customer data, and revenue continuity from active adversaries. As organizations migrate critical workloads to AWS and Azure under strict regulatory scrutiny, skilled SOC analysts and cloud security engineers are among the most resilient roles in technology.",
    startingLevel: "Career-Entry Accessible",
    idealFor:
      "Analytical problem-solvers targeting Blue-Team SOC roles and IT or cloud practitioners pivoting into security engineering.",
    heroImage: "/academy/prog-cybersecurity.jpg",
    jobMarket: {
      demandOutlook: "Recession-Resilient Shortage",
      demandMetric: "3.5M+ unfilled global cybersecurity positions worldwide",
      globalCompRange: "$70,000 – $155,000+ USD (Global Remote & US/UK)",
      regionalMobility: "High demand across regulated banks, MSSPs, telecoms, government & cloud vendors",
      hiringIndustries: [
        "Banking & Payments",
        "Managed Security (MSSPs)",
        "Healthcare & Insurance",
        "Government & Defense",
        "Enterprise Cloud SaaS",
      ],
      marketDrivers: [
        "Identity compromise, phishing, and misconfigured cloud IAM policies remain the leading root causes of modern enterprise breaches.",
        "Regulatory regimes (SOC 2, ISO 27001, PCI-DSS, NIST CSF 2.0) mandate continuous monitoring and audit evidence.",
        "Organizations need practitioners who can actually read packets, write SIEM rules, and lock down cloud IAM—not just memorize compliance glossaries.",
      ],
      hiringManagerBar: [
        "Walk through a real phishing or anomalous login alert from triage to containment using MITRE ATT&CK.",
        "Inspect a Wireshark packet capture or CloudTrail log to isolate compromised credentials and lateral movement.",
        "Identify overly permissive IAM policies and propose least-privilege remediation plus secret rotation controls.",
      ],
    },
    careerLadder: [
      {
        tier: "Entry & Associate",
        roleTitle: "SOC Analyst (Tier 1 / Tier 2)",
        typicalExperience: "0 – 2 Years",
        compBenchmark: "$60k – $85k",
        responsibilities:
          "Monitor SIEM alerts, investigate phishing and endpoint anomalies, analyze network traffic PCAPs, document incident tickets, and execute containment playbooks.",
      },
      {
        tier: "Mid-Level Practitioner",
        roleTitle: "Cloud Security Analyst / IAM Engineer",
        typicalExperience: "2 – 5 Years",
        compBenchmark: "$95k – $140k",
        responsibilities:
          "Harden multi-account AWS/Azure IAM boundaries, deploy dynamic secrets with HashiCorp Vault, embed Trivy/OPA gates into CI/CD, and lead forensic reviews.",
      },
      {
        tier: "Senior & Leadership",
        roleTitle: "Lead Security Architect / Incident Response Lead",
        typicalExperience: "5+ Years",
        compBenchmark: "$145k – $200k+",
        responsibilities:
          "Design enterprise zero-trust blueprints, oversee continuous compliance automation (NIST CSF 2.0 / SOC 2), command major incident response, and brief executive boards.",
      },
    ],
    expertise: {
      technicalExpertise: [
        "SIEM querying, log correlation & threat mapping with MITRE ATT&CK",
        "Wireshark packet forensics, DNS inspection & phishing artifact analysis",
        "Zero-trust AWS/Azure IAM hardening, SCP guardrails & CloudTrail auditing",
        "HashiCorp Vault dynamic secrets rotation & DevSecOps CI vulnerability gating",
        "Incident containment playbooks, root-cause dossiers & continuous compliance controls",
      ],
      advisoryExpertise: [
        "Communicating breach scope and business risk clearly under time pressure",
        "Translating NIST CSF 2.0 and SOC 2 requirements into actionable engineering controls",
        "Balancing strict zero-trust security posture with developer deployment velocity",
        "Writing clean, audit-ready incident reports and executive remediation plans",
      ],
      productionToolchain: [
        "Splunk / SIEM Querying",
        "Wireshark & TCPDump",
        "MITRE ATT&CK",
        "AWS IAM & CloudTrail",
        "HashiCorp Vault",
        "Trivy & Policy-as-Code",
      ],
    },
    systemCollaboration: {
      summary:
        "Elites Technology Systems embeds zero-trust identity and security baselines into every client cloud architecture. Our security pathway pairs blue-team SOC investigation fundamentals with hands-on cloud defense and compliance governance.",
      pillars: [
        {
          label: "Zero-Trust Consulting Pedigree",
          detail:
            "Learn IAM boundaries, audit telemetry, and secret hygiene directly modeled on our enterprise security engagements.",
          href: "/services",
        },
        {
          label: "Blue-Team Investigation Labs",
          detail:
            "Analyze realistic network captures, write detection queries, and harden cloud accounts inside guided workspace labs.",
          href: "/academy/learn",
        },
        {
          label: "Verifiable Defense Portfolio",
          detail:
            "Publish a complete incident investigation dossier and hardened cloud security baseline backed by Open Badges v2 verification.",
          href: "/academy/verify",
        },
      ],
      capstoneOutcome:
        "A full SOC breach investigation dossier plus a zero-trust multi-account cloud security baseline with automated CI security gates.",
    },
    recommendedPrograms: [
      {
        courseId: "course-soc-analyst",
        recommendationBadge: "Best Entry-Level Security Track",
        stageLabel: "Blue-Team SOC & Incident Triage",
        whyItFitsCareer:
          "Builds practical Tier-1/Tier-2 SOC readiness from MITRE ATT&CK and Wireshark forensics to SIEM correlation rules and containment playbooks.",
      },
      {
        courseId: "course-cybersecurity",
        recommendationBadge: "Best Cloud Security Track",
        stageLabel: "Cloud Defense, IAM & Compliance",
        whyItFitsCareer:
          "Advances you into high-compensation Cloud Security & IAM roles covering zero-trust guardrails, HashiCorp Vault, DevSecOps gates, and CloudTrail forensics.",
      },
    ],
  },
  {
    id: "ind-path-ai-python",
    domain: "Data & Automation",
    professionCategory: "Applied AI & Workflow Engineering",
    title: "Applied AI & Python Workflow Automation",
    executiveOverview:
      "Modern companies are racing to turn AI capabilities and fragmented SaaS tools into reliable, privacy-safe operational workflows. Applied AI and Python Automation specialists sit at the intersection of business operations and software engineering—eliminating thousands of manual hours while keeping company data governed and accurate.",
    startingLevel: "Career-Entry Accessible",
    idealFor:
      "Working professionals, operations managers, business analysts, and aspiring automation developers who want high-leverage AI & Python engineering skills.",
    heroImage: "/academy/prog-python-etl.jpg",
    jobMarket: {
      demandOutlook: "Fastest-Growing Skill Category",
      demandMetric: "3× surge in job postings combining Python automation & Applied AI",
      globalCompRange: "$70,000 – $145,000+ USD (Global Remote & US/UK)",
      regionalMobility: "High demand across agile remote startups, mid-market operations & consulting firms",
      hiringIndustries: [
        "Tech & SaaS Operations",
        "Financial Operations & FinTech",
        "Consulting & Legal Services",
        "Supply Chain & Logistics",
        "Media & Digital Commerce",
      ],
      marketDrivers: [
        "Enterprises are moving past ad-hoc chatbot experiments toward structured, verified RAG assistants and automated API workflows.",
        "Teams that combine Python API engineering with AI workflow orchestration dramatically outperform traditional manual ops.",
        "Privacy, hallucination verification, and data-validation contracts (Pydantic) separate production builders from hobbyists.",
      ],
      hiringManagerBar: [
        "Design a grounded document-retrieval (RAG) workflow with measurable accuracy and strict data-privacy boundaries.",
        "Write clean, modular Python code that consumes paginated REST APIs, validates payloads, and handles retries safely.",
        "Package and schedule an automated pipeline in Docker with structured logging and failure alerting.",
      ],
    },
    careerLadder: [
      {
        tier: "Entry & Associate",
        roleTitle: "AI Workflow Specialist / Operations Automation Analyst",
        typicalExperience: "0 – 2 Years",
        compBenchmark: "$55k – $82k",
        responsibilities:
          "Audit repetitive departmental bottlenecks, design structured prompt & verification workflows, automate spreadsheet/API tasks, and deploy grounded internal assistants.",
      },
      {
        tier: "Mid-Level Practitioner",
        roleTitle: "Python Automation Developer / Junior Data Engineer",
        typicalExperience: "2 – 5 Years",
        compBenchmark: "$90k – $135k",
        responsibilities:
          "Build resilient Python ETL extractors, enforce Pydantic data contracts, integrate SaaS APIs with PostgreSQL, and deploy containerized scheduled pipelines.",
      },
      {
        tier: "Senior & Leadership",
        roleTitle: "Lead Automation & Applied AI Engineer",
        typicalExperience: "5+ Years",
        compBenchmark: "$140k – $185k+",
        responsibilities:
          "Architect cross-departmental AI & data automation platforms, establish AI risk and accuracy guardrails, and measure hard ROI across business units.",
      },
    ],
    expertise: {
      technicalExpertise: [
        "Structured prompt engineering, evaluation rubrics & grounded RAG retrieval",
        "Modular Python 3.12 engineering, REST API integration & error handling",
        "Schema validation contracts with Pydantic & relational persistence in PostgreSQL",
        "No-code + Python hybrid workflow orchestration & webhook automation",
        "Containerized Docker execution, scheduled pipeline runs & health alerting",
      ],
      advisoryExpertise: [
        "Identifying high-ROI operational workflows worth automating vs. keeping human-in-the-loop",
        "Enforcing enterprise data privacy, PII protection & AI hallucination controls",
        "Documenting clean SOPs and handover playbooks so teams trust automated outputs",
        "Quantifying hours saved, error reduction, and SLA gains for business leaders",
      ],
      productionToolchain: [
        "Python 3.12",
        "REST APIs & FastAPI",
        "RAG & Structured Prompts",
        "Pydantic Validation",
        "PostgreSQL",
        "Docker & Scheduled Runners",
      ],
    },
    systemCollaboration: {
      summary:
        "Rather than teaching fragile hype tricks, Elites Technology Systems anchors Applied AI in dependable software and data engineering principles—moving you cleanly from structured workflow design to containerized Python production services.",
      pillars: [
        {
          label: "Self-Paced Flexible Architecture",
          detail:
            "Study on your own schedule inside our structured Classroom Portal with modular lab checkpoints and instant quiz validation.",
          href: "/academy/learn",
        },
        {
          label: "Privacy-First Enterprise Guardrails",
          detail:
            "Apply practical AI verification and data governance standards modeled on real corporate compliance frameworks.",
          href: "/services",
        },
        {
          label: "Demonstrable Build Portfolio",
          detail:
            "Deploy a grounded RAG workflow and Dockerized Python pipeline paired with an Open Badges v2 verified credential.",
          href: "/academy/verify",
        },
      ],
      capstoneOutcome:
        "A privacy-safe grounded document assistant plus a containerized, schema-validated Python API ingestion pipeline.",
    },
    recommendedPrograms: [
      {
        courseId: "course-ai-productivity",
        recommendationBadge: "Best Starting Program",
        stageLabel: "Applied AI & Workflow Automation",
        whyItFitsCareer:
          "Equips you quickly with structured prompt systems, privacy-safe RAG design, and no-code + Python automation patterns.",
      },
      {
        courseId: "course-python-etl",
        recommendationBadge: "Best Engineering Depth",
        stageLabel: "Python Programming & Production Pipelines",
        whyItFitsCareer:
          "Turns workflow builders into production Python engineers capable of building type-safe API extractors, dbt layers, and Dockerized pipelines.",
      },
    ],
  },
  {
    id: "ind-path-analytics-eng",
    domain: "Data & Automation",
    professionCategory: "Modern Data Stack & Platform Engineering",
    title: "Analytics Engineering & Data Platforms",
    executiveOverview:
      "Analytics and Data Engineers build the trusted data supply chain that powers both executive BI and AI initiatives. Sitting between raw application databases and business stakeholders, they apply software engineering discipline—version control, automated testing, modular SQL, and Python pipelines—to enterprise data warehouses.",
    startingLevel: "Mid-Career Transition",
    idealFor:
      "SQL analysts, BI developers, and backend developers transitioning into higher-compensation Analytics Engineering and Data Engineering roles.",
    heroImage: "/academy/track-data.jpg",
    jobMarket: {
      demandOutlook: "High-Compensation Specialty",
      demandMetric: "Consistently ranks among top-paid mid-to-senior data roles",
      globalCompRange: "$95,000 – $175,000+ USD (Global Remote & US/UK)",
      regionalMobility: "Heavily recruited by distributed global tech, fintech, and consulting teams",
      hiringIndustries: [
        "FinTech & Digital Banking",
        "High-Growth SaaS",
        "E-Commerce & Marketplaces",
        "Telecoms & Analytics Vendors",
        "Data Consulting Practices",
      ],
      marketDrivers: [
        "AI and executive BI fail without clean, tested upstream data—making Analytics Engineers indispensable.",
        "The modern data stack (Cloud Warehouses + dbt Core + Python ingestion) has become the universal enterprise standard.",
        "Existing SQL analysts who add dbt modeling and Python engineering see one of the strongest salary jumps in the data profession.",
      ],
      hiringManagerBar: [
        "Design a 3-layer warehouse architecture (staging, intermediate, marts) with clear grain and SCD Type 2 history.",
        "Implement automated dbt Core schema, freshness, and referential integrity tests in version control.",
        "Engineer an idempotent Python API ingestion job that handles incremental loads and malformed records gracefully.",
      ],
    },
    careerLadder: [
      {
        tier: "Entry & Associate",
        roleTitle: "Junior Analytics Engineer / ETL Developer",
        typicalExperience: "1 – 2 Years",
        compBenchmark: "$75k – $100k",
        responsibilities:
          "Maintain dbt staging models, write SQL quality tests, troubleshoot scheduled pipeline failures, and document warehouse lineage.",
      },
      {
        tier: "Mid-Level Practitioner",
        roleTitle: "Analytics Engineer / Data Engineer",
        typicalExperience: "2 – 5 Years",
        compBenchmark: "$110k – $150k",
        responsibilities:
          "Own conformed star schemas, build Python extraction microservices, optimize Snowflake/PostgreSQL query costs, and maintain semantic KPI layers.",
      },
      {
        tier: "Senior & Leadership",
        roleTitle: "Staff Data Engineer / Data Platform Architect",
        typicalExperience: "5+ Years",
        compBenchmark: "$155k – $210k+",
        responsibilities:
          "Architect multi-domain enterprise data platforms, set governance and SLA contracts across squads, and guide warehouse FinOps optimization.",
      },
    ],
    expertise: {
      technicalExpertise: [
        "Advanced SQL optimization, window analytics, indexing & partitioning strategy",
        "Dimensional modeling (Kimball star schemas, conformed dimensions & SCD Type 2)",
        "Modular dbt Core engineering with automated CI testing and lineage documentation",
        "Idempotent Python ingestion pipelines with Pydantic validation contracts",
        "Dockerized orchestration, observability logging & warehouse cost awareness",
      ],
      advisoryExpertise: [
        "Defining strict data contracts between backend engineering and business analytics teams",
        "Resolving historical reporting discrepancies through auditable transformation lineage",
        "Balancing warehouse compute efficiency against data freshness SLAs",
        "Reviewing pull requests and enforcing SQL/Python style standards across data squads",
      ],
      productionToolchain: [
        "Snowflake & PostgreSQL",
        "dbt Core",
        "Python 3.12 & Pydantic",
        "Docker & Airflow Concepts",
        "Git CI/CD",
        "Semantic Metrics Layers",
      ],
    },
    systemCollaboration: {
      summary:
        "Our Analytics Engineering track combines two flexible self-paced engineering programs built around real enterprise data-platform patterns—allowing working analysts and developers to upgrade into backend data engineering without leaving their jobs.",
      pillars: [
        {
          label: "End-to-End Modern Data Stack",
          detail:
            "Covers both upstream Python ingestion and downstream dbt/SQL warehousing in one cohesive engineering architecture.",
          href: "/academy/learn",
        },
        {
          label: "Production Consulting Patterns",
          detail:
            "Grounded in the exact data-modernization blueprints Elites Technology Systems implements for enterprise clients.",
          href: "/services",
        },
        {
          label: "GitHub-Backed Verification",
          detail:
            "Showcase a tested 3-layer warehouse repository and verified credential code directly to technical hiring panels.",
          href: "/academy/verify",
        },
      ],
      capstoneOutcome:
        "A tested 3-layer dbt Core cloud warehouse fed by an automated, containerized Python REST API ingestion service.",
    },
    recommendedPrograms: [
      {
        courseId: "course-sql-warehouse",
        recommendationBadge: "Best Core Specialization",
        stageLabel: "SQL Warehousing & dbt Core",
        whyItFitsCareer:
          "Directly masters dimensional star schemas, SCD Type 2 modeling, query optimization, and modular dbt Core warehouse engineering.",
      },
      {
        courseId: "course-python-etl",
        recommendationBadge: "Best Companion Engineering Track",
        stageLabel: "Python Ingestion & Containerized ETL",
        whyItFitsCareer:
          "Adds upstream Python API extraction, Pydantic schema validation, and Dockerized pipeline delivery to complete your Data Engineer profile.",
      },
    ],
  },
  {
    id: "ind-path-cloud-architect",
    domain: "Cloud & DevOps",
    professionCategory: "Principal Infrastructure & Enterprise Architecture",
    title: "Multi-Cloud Solutions Architecture",
    executiveOverview:
      "Solutions Architects are the senior technical leaders who translate business strategy, uptime requirements, security compliance, and cloud budgets into resilient multi-region systems. Mastering both AWS and Azure architecture positions practitioners at the top tier of technical influence and compensation.",
    startingLevel: "Senior Specialization",
    idealFor:
      "Experienced SysAdmins, DevOps engineers, and senior software developers stepping into Solutions Architect, Principal Cloud, or Technical Lead roles.",
    heroImage: "/academy/track-cloud.jpg",
    jobMarket: {
      demandOutlook: "Elite Senior Demand",
      demandMetric: "Top-tier enterprise compensation across AWS & Azure ecosystems",
      globalCompRange: "$125,000 – $220,000+ USD (Global Remote & US/UK)",
      regionalMobility: "High executive visibility across global consulting, banking & enterprise IT",
      hiringIndustries: [
        "Cloud & Technology Consulting",
        "Global Banking & Capital Markets",
        "Enterprise Telecommunications",
        "Healthcare & Regulated SaaS",
        "Public Sector Modernization",
      ],
      marketDrivers: [
        "Most regulated enterprises operate across both AWS and Microsoft Azure and urgently need architects fluent across clouds.",
        "Board-level focus on resilience (RPO/RTO), cloud FinOps unit economics, and zero-trust landing zones demands senior architectural judgment.",
        "Architects who combine hands-on Terraform fluency with Well-Architected executive defense command top-decile packages.",
      ],
      hiringManagerBar: [
        "Design a multi-account AWS/Azure landing zone with hub-and-spoke networking and identity federation on a live whiteboard.",
        "Justify active-active vs. pilot-light disaster recovery trade-offs against explicit RPO, RTO, and monthly budget constraints.",
        "Lead a Well-Architected review identifying reliability bottlenecks, security gaps, and immediate FinOps rightsizing wins.",
      ],
    },
    careerLadder: [
      {
        tier: "Entry & Associate",
        roleTitle: "Associate Cloud Architect / Senior Cloud Engineer",
        typicalExperience: "2 – 4 Years",
        compBenchmark: "$105k – $135k",
        responsibilities:
          "Build standardized landing zones, review Terraform pull requests, design VPC peering/transit topologies, and support migration cutovers.",
      },
      {
        tier: "Mid-Level Practitioner",
        roleTitle: "Multi-Cloud Solutions Architect",
        typicalExperience: "4 – 7 Years",
        compBenchmark: "$140k – $185k",
        responsibilities:
          "Own end-to-end AWS & Azure system blueprints, architect event-driven hybrid workloads, lead Well-Architected reviews, and partner with product & security directors.",
      },
      {
        tier: "Senior & Leadership",
        roleTitle: "Principal Architect / VP of Cloud Engineering",
        typicalExperience: "7+ Years",
        compBenchmark: "$190k – $250k+",
        responsibilities:
          "Set enterprise cloud strategy, govern multi-million-dollar FinOps economics, advise CTOs/CIOs on modernization risk, and lead architectural governance boards.",
      },
    ],
    expertise: {
      technicalExpertise: [
        "AWS Organizations & Azure Landing Zone governance and identity federation",
        "Hub-and-spoke networking, hybrid VPN/Direct Connect & private service endpoints",
        "Multi-region high availability, disaster recovery engineering & RPO/RTO modeling",
        "Event-driven serverless, messaging queues & decoupled microservice integration",
        "Well-Architected reliability, security, performance & FinOps cost trade-offs",
      ],
      advisoryExpertise: [
        "Defending architectural trade-offs concisely before CTOs, security boards, and CFOs",
        "Writing crisp Architecture Decision Records (ADRs) and migration cutover plans",
        "Eliminating vendor lock-in through open, portable IaC and container standards",
        "Evaluating total cost of ownership (TCO) and cloud unit-cost sustainability",
      ],
      productionToolchain: [
        "AWS Organizations & Transit Gateway",
        "Azure Landing Zones",
        "Terraform Enterprise Patterns",
        "EventBridge / Service Bus",
        "Multi-Region Failover & DR",
        "Well-Architected & FinOps Models",
      ],
    },
    systemCollaboration: {
      summary:
        "This career path draws directly on Elites Technology Systems' core consulting DNA—direct mentorship from lead solutions architects, live system-design defense sessions, and portable open-standard blueprints.",
      pillars: [
        {
          label: "Direct Lead Architect Mentorship",
          detail:
            "Defend real AWS & Azure architectural diagrams in live review panels modeled on our enterprise advisory engagements.",
          href: "/services",
        },
        {
          label: "IaC-First Architecture Execution",
          detail:
            "Every architectural diagram is paired with verifiable Terraform patterns and operational failover runbooks.",
          href: "/academy/learn",
        },
        {
          label: "Executive Credential & Portfolio Defense",
          detail:
            "Graduate with a complete multi-region migration blueprint, RPO/RTO plan, and Open Badges v2 verification record.",
          href: "/academy/verify",
        },
      ],
      capstoneOutcome:
        "A board-ready multi-region AWS and Azure reference architecture with Terraform blueprints, RPO/RTO failover runbooks, and TCO cost model.",
    },
    recommendedPrograms: [
      {
        courseId: "course-cloud-devops",
        recommendationBadge: "Best IaC Foundation",
        stageLabel: "Cloud Automation & Terraform Mastery",
        whyItFitsCareer:
          "Ensures you can codify and ship what you architect—establishing deep hands-on mastery of Terraform, Docker, and cloud networking.",
      },
      {
        courseId: "course-azure-aws-architect",
        recommendationBadge: "Best Flagship Architect Program",
        stageLabel: "Multi-Cloud Solutions Architecture",
        whyItFitsCareer:
          "Focuses directly on senior architect competencies: AWS/Azure landing zones, multi-region DR, event-driven systems, and Well-Architected defense.",
      },
    ],
  },
];

export const BUSINESS_CAREER_PATHS: BusinessCareerPath[] = [
  {
    id: "biz-path-platform-sre",
    domain: "Cloud & DevOps",
    department: "Platform & Infrastructure Engineering",
    title: "Cloud Platform & Site Reliability Organization",
    executiveOverview:
      "High-velocity digital organizations cannot rely on heroic manual troubleshooting or fragile console configurations. Building an internal Platform and SRE capability equips your existing infrastructure and developer squads to ship repeatable Terraform environments and run resilient Kubernetes clusters with predictable uptime.",
    recommendedTeamSize: "10 to 50+ Engineers",
    deliveryFormat: "Shared Cohorts or Private Dedicated Bootcamp",
    heroImage: "/academy/prog-k8s-sre.jpg",
    talentMarket: {
      marketChallenge: "4–6 month recruiting lag and high attrition for senior Cloud & Kubernetes SRE talent",
      buildVsBuyAdvantage:
        "Upskilling internal systems engineers who already understand your legacy applications and compliance rules delivers production autonomy in weeks at a fraction of agency hiring costs.",
      targetSectors: [
        "Banking & Financial Platforms",
        "Telecoms & Digital Infrastructure",
        "Enterprise SaaS",
        "Logistics & Energy",
      ],
      operationalDrivers: [
        "Eliminate environment drift and weekend deployment outages caused by manual cloud console clicks.",
        "Standardize container scheduling, autoscaling, and Prometheus SLO alerts across product squads.",
        "Retain 100% internal code ownership instead of creating permanent dependency on external contractors.",
      ],
      auditAndRiskImpact:
        "Reduces Mean Time to Recovery (MTTR), enforces reproducible change control in Git, and eliminates single-point-of-failure operational knowledge.",
    },
    capabilityLadder: [
      {
        stage: "Stage 01 · Standardized Baseline",
        capabilityTitle: "Codified Cloud & IaC Consistency",
        teamFocus: "SysAdmins, DevOps & Infrastructure Staff",
        targetKpi: "Zero manual production console changes",
        operationalOwnership:
          "Teams standardize AWS/Azure networking, remote-locked Terraform modules, and multi-stage Docker CI/CD pipelines.",
      },
      {
        stage: "Stage 02 · Production Autonomy",
        capabilityTitle: "Resilient Kubernetes & SRE Operations",
        teamFocus: "Platform & Reliability Squads",
        targetKpi: "Measurable SLOs & sub-15-min incident triage",
        operationalOwnership:
          "Engineers manage Helm packaging, horizontal autoscaling, NetworkPolicies, and rehearsed broken-cluster failover drills.",
      },
      {
        stage: "Stage 03 · Enterprise Excellence",
        capabilityTitle: "Internal Developer Platform (IDP) Maturity",
        teamFocus: "Cross-Squad Platform Center of Excellence",
        targetKpi: "Self-service compliant deployments across squads",
        operationalOwnership:
          "Platform teams publish golden infrastructure templates enabling product developers to deploy safely with built-in guardrails.",
      },
    ],
    teamExpertise: {
      technicalStandards: [
        "Versioned, remote-locked Terraform module libraries across AWS & Azure",
        "Production Kubernetes scheduling, Helm releases & namespace isolation",
        "Prometheus/Grafana SLO dashboards, alert hygiene & runbook drills",
        "Automated GitHub Actions CI/CD delivery and rollback pipelines",
      ],
      governanceCapabilities: [
        "100% client-owned infrastructure repositories and change audit trails",
        "Repeatable incident post-mortems and error-budget governance",
        "Standardized environment parity across dev, staging, and production",
      ],
      rolesTransformed: [
        "Systems Administrators",
        "DevOps Engineers",
        "Site Reliability Engineers",
        "Backend Release Leads",
      ],
    },
    systemCollaboration: {
      summary:
        "Elites Technology Systems combines enterprise cloud consulting with dedicated cohort delivery—training your engineers directly against your cloud provider standards while giving leadership live visibility into completion and readiness.",
      pillars: [
        {
          label: "Private Stack & Sandbox Alignment",
          detail:
            "Tailor Terraform modules and Kubernetes drills to your organization's live AWS or Azure reference architecture.",
          href: "/academy/corporate#request-demo",
        },
        {
          label: "Corporate Enablement Telemetry",
          detail:
            "Track squad module progress, practical lab readiness, and seat reassignment in real time with CSV exports.",
          href: "/academy/corporate",
        },
        {
          label: "Consulting Handover Synergy",
          detail:
            "Pair team training alongside active Elites Tech architecture or migration sprints for seamless internal handover.",
          href: "/services",
        },
      ],
      governanceDeliverable:
        "Internal Production Terraform Landing Zone Library + Hardened Multi-Namespace Kubernetes SRE Runbook Pack.",
    },
    recommendedPrograms: [
      {
        courseId: "course-cloud-devops",
        recommendationBadge: "Best Foundational Cohort",
        stageLabel: "Cloud Automation & IaC Baseline",
        whyItFitsCareer:
          "Aligns infrastructure and DevOps staff on reusable Terraform code, cloud VPC security, Docker builds, and CI/CD pipelines.",
      },
      {
        courseId: "course-k8s-sre",
        recommendationBadge: "Best Dedicated Bootcamp",
        stageLabel: "Production Kubernetes & SRE Drills",
        whyItFitsCareer:
          "Intensive 6-week corporate bootcamp focused on Day-2 cluster resilience, SLO engineering, and live outage recovery.",
      },
    ],
  },
  {
    id: "biz-path-data-modernization",
    domain: "Data & BI",
    department: "Finance, BI & Data Operations",
    title: "Enterprise Data & Decision Intelligence Function",
    executiveOverview:
      "When finance, sales, and operations arrive at leadership reviews with conflicting spreadsheets, decision speed collapses. Building an internal Decision Intelligence capability unifies your organization around one certified semantic model, tested cloud data marts, and automated executive Power BI scorecards.",
    recommendedTeamSize: "10 to 40+ Analysts & Engineers",
    deliveryFormat: "Role-Split Departmental Cohort",
    heroImage: "/academy/prog-exec-bi.jpg",
    talentMarket: {
      marketChallenge: "High turnover among BI developers and persistent silos between business analysts and IT data teams",
      buildVsBuyAdvantage:
        "Your existing finance and operations analysts already know your business rules—upgrading them in SQL, star schemas, dbt Core, and Python removes reporting bottlenecks permanently.",
      targetSectors: [
        "Banking, Insurance & FinTech",
        "Retail & FMCG",
        "Telecommunications",
        "Healthcare & Public Agencies",
      ],
      operationalDrivers: [
        "Reclaim hundreds of monthly staff hours lost to manual copy-paste reporting decks.",
        "Establish a single certified KPI dictionary governed across finance, commercial, and executive teams.",
        "Build clean, tested warehouse foundations required before launching enterprise AI initiatives.",
      ],
      auditAndRiskImpact:
        "Eliminates silent spreadsheet formula errors, creates auditable lineage from source systems to board KPIs, and enforces automated data quality testing.",
    },
    capabilityLadder: [
      {
        stage: "Stage 01 · Standardized Baseline",
        capabilityTitle: "Unified SQL & BI Analytical Fluency",
        teamFocus: "Business, Finance & Operations Analysts",
        targetKpi: "Certified departmental Power BI & Tableau KPIs",
        operationalOwnership:
          "Analysts move off ad-hoc spreadsheets onto consistent SQL queries, Power BI DAX models, and clean executive dashboards.",
      },
      {
        stage: "Stage 02 · Production Autonomy",
        capabilityTitle: "Governed Cloud Warehouse & dbt Testing",
        teamFocus: "BI Developers & Analytics Engineers",
        targetKpi: "Automated data freshness & reconciliation gates",
        operationalOwnership:
          "Teams construct conformed dimensional star schemas and tested 3-layer dbt Core transformation pipelines.",
      },
      {
        stage: "Stage 03 · Enterprise Excellence",
        capabilityTitle: "Automated End-to-End Decision Pipelines",
        teamFocus: "Integrated Data & Analytics Engineering Pod",
        targetKpi: "Self-refreshing multi-source executive telemetry",
        operationalOwnership:
          "Automated Python API extractors feed validated data continuously into enterprise marts with schema alerts.",
      },
    ],
    teamExpertise: {
      technicalStandards: [
        "Production SQL analysis, reconciliation & dimensional star-schema design",
        "Certified Power BI DAX semantic layers & executive Tableau storytelling",
        "Tested dbt Core staging, intermediate & mart warehouse architecture",
        "Automated Python API ingestion with Pydantic schema contracts",
      ],
      governanceCapabilities: [
        "Organization-wide certified KPI glossary and metric ownership",
        "Automated warehouse quality tests catching upstream breaks before executives see them",
        "Self-service BI workspace access governance and row-level security",
      ],
      rolesTransformed: [
        "Financial & Commercial Analysts",
        "BI Reporting Specialists",
        "Data Operations Staff",
        "Analytics Engineers",
      ],
    },
    systemCollaboration: {
      summary:
        "Our role-split departmental pathways let business analysts, BI developers, and backend data staff train in synchronized tracks—converging on one shared semantic data standard backed by Elites Tech Academy verification.",
      pillars: [
        {
          label: "Role-Split Departmental Design",
          detail:
            "Assign analysts, engineers, and leaders into right-sized tracks under one unified corporate seat agreement.",
          href: "/academy/tuition?mode=corporate",
        },
        {
          label: "Real Enterprise KPI Alignment",
          detail:
            "Structure team capstones around anonymized versions of your actual reporting models and executive scorecards.",
          href: "/academy/corporate#request-demo",
        },
        {
          label: "Measurable Skill Telemetry",
          detail:
            "Review cohort completion rates, SQL/BI assessment scores, and Open Badges v2 credentials per department.",
          href: "/academy/corporate",
        },
      ],
      governanceDeliverable:
        "Certified Enterprise Semantic KPI Model + Tested 3-Layer dbt Core Data Warehouse Repository.",
    },
    recommendedPrograms: [
      {
        courseId: "course-data-bi",
        recommendationBadge: "Best Analyst Team Program",
        stageLabel: "BI & SQL Analytical Foundation",
        whyItFitsCareer:
          "Standardizes departmental analysts across SQL, Python Pandas, Alteryx, Tableau, and Power BI DAX modeling.",
      },
      {
        courseId: "course-sql-warehouse",
        recommendationBadge: "Best Warehouse Governance Track",
        stageLabel: "Cloud Warehousing & dbt Testing",
        whyItFitsCareer:
          "Equips BI leads and data staff to build conformed star schemas and automated dbt Core data quality gates.",
      },
      {
        courseId: "course-python-etl",
        recommendationBadge: "Best Pipeline Automation Track",
        stageLabel: "Python Ingestion & Automation",
        whyItFitsCareer:
          "Automates upstream SaaS API extraction with Pydantic validation and containerized pipeline scheduling.",
      },
    ],
  },
  {
    id: "biz-path-devsecops",
    domain: "Cybersecurity",
    department: "Security, Compliance & Cloud Ops",
    title: "Zero-Trust Cyber Defense & DevSecOps Operations",
    executiveOverview:
      "Security can no longer sit as a manual review gate at the end of a release cycle. Building an internal Zero-Trust and DevSecOps capability embeds least-privilege IAM, dynamic secret rotation, container supply-chain verification, and continuous audit evidence directly into how engineering teams ship software.",
    recommendedTeamSize: "8 to 35+ Security & Platform Staff",
    deliveryFormat: "Private Sandbox Residency or Shared Seats",
    heroImage: "/training-platform.jpg",
    talentMarket: {
      marketChallenge: "Acute shortage of engineers fluent in both cloud infrastructure and security compliance automation",
      buildVsBuyAdvantage:
        "Embedding practical DevSecOps capabilities into your existing security and cloud squads closes audit gaps far faster than competing for scarce external principal security hires.",
      targetSectors: [
        "Regulated Banking & FinTech",
        "Healthcare & Life Sciences",
        "Government & Critical Infrastructure",
        "Enterprise SaaS Vendors",
      ],
      operationalDrivers: [
        "Eliminate static long-lived API keys and over-privileged cloud IAM roles across delivery environments.",
        "Block critical container CVEs and unapproved IaC drift automatically before production merges.",
        "Replace stressful manual audit scrambles with continuous NIST CSF 2.0 and SOC 2 evidence collection.",
      ],
      auditAndRiskImpact:
        "Directly lowers breach surface area, accelerates enterprise customer security questionnaires, and produces verifiable NIST CSF 2.0 / SOC 2 compliance artifacts.",
    },
    capabilityLadder: [
      {
        stage: "Stage 01 · Standardized Baseline",
        capabilityTitle: "Cloud Perimeter & IAM Hardening",
        teamFocus: "Cloud Ops & Security Analysts",
        targetKpi: "Zero static root/long-lived IAM credentials",
        operationalOwnership:
          "Teams audit multi-account IAM boundaries, enforce SCP guardrails, deploy Vault dynamic secrets, and run CloudTrail forensics.",
      },
      {
        stage: "Stage 02 · Production Autonomy",
        capabilityTitle: "Automated DevSecOps & Supply-Chain Controls",
        teamFocus: "Platform Security & Release Engineers",
        targetKpi: "100% signed container builds & CI policy gates",
        operationalOwnership:
          "Squads enforce SBOM generation, Trivy vulnerability blocking, and OPA/Kyverno admission controls in CI/CD.",
      },
      {
        stage: "Stage 03 · Enterprise Excellence",
        capabilityTitle: "Continuous Audit-Ready Governance",
        teamFocus: "Security Architecture & Compliance Leaders",
        targetKpi: "Continuous NIST CSF 2.0 & SOC 2 evidence",
        operationalOwnership:
          "Security controls emit automated compliance telemetry ready for external auditors and enterprise procurement reviews.",
      },
    ],
    teamExpertise: {
      technicalStandards: [
        "Multi-account zero-trust IAM boundaries & CloudTrail forensic workflows",
        "HashiCorp Vault dynamic secret injection across CI/CD and workloads",
        "Container supply-chain SBOMs, cryptographic signing & CVE gating",
        "OPA / Kyverno policy-as-code admission enforcement",
      ],
      governanceCapabilities: [
        "Continuous NIST CSF 2.0 and SOC 2 technical control mapping",
        "Rehearsed incident containment and escalation playbooks",
        "Shared security ownership between platform engineers and compliance teams",
      ],
      rolesTransformed: [
        "Cloud Operations Engineers",
        "Security Analysts",
        "DevOps & Release Leads",
        "Compliance Engineers",
      ],
    },
    systemCollaboration: {
      summary:
        "Backed by Elites Technology Systems' cybersecurity governance practice, this workforce track delivers hands-on zero-trust labs, audit-aligned control matrices, and verifiable staff credentials for compliance documentation.",
      pillars: [
        {
          label: "Compliance-Mapped Sandbox Drills",
          detail:
            "Every lab exercise maps directly to real NIST CSF 2.0 and SOC 2 technical control objectives.",
          href: "/academy/corporate#request-demo",
        },
        {
          label: "Audit-Proof Staff Credentials",
          detail:
            "Export verifiable Open Badges v2 completion records to demonstrate workforce security readiness to auditors.",
          href: "/academy/verify",
        },
        {
          label: "Zero-Trust Advisory Integration",
          detail:
            "Coordinate team training alongside Elites Tech security baseline reviews and IAM architecture hardening.",
          href: "/services",
        },
      ],
      governanceDeliverable:
        "Hardened Zero-Trust CI/CD Pipeline Blueprint + Continuous NIST CSF 2.0 / SOC 2 Control Matrix.",
    },
    recommendedPrograms: [
      {
        courseId: "course-cybersecurity",
        recommendationBadge: "Best Cloud Security Core",
        stageLabel: "Cloud Defense & IAM Governance",
        whyItFitsCareer:
          "Establishes practical multi-account IAM hardening, Vault secret rotation, and CloudTrail forensics across security and cloud staff.",
      },
      {
        courseId: "course-devsecops-bootcamp",
        recommendationBadge: "Best Enterprise Bootcamp",
        stageLabel: "Enterprise DevSecOps & Audit Automation",
        whyItFitsCareer:
          "Dedicated 6-week corporate bootcamp installing SBOM signing, OPA/Kyverno admission gates, and continuous compliance automation.",
      },
    ],
  },
  {
    id: "biz-path-arch-finops",
    domain: "Cloud & DevOps",
    department: "Architecture, FinOps & Technology Leadership",
    title: "Multi-Cloud Architecture & FinOps Leadership",
    executiveOverview:
      "As enterprise cloud footprints expand across AWS and Azure alongside new AI workloads, uncontrolled architecture sprawl quietly drains IT budgets and creates hidden disaster-recovery risk. This senior pathway aligns principal architects, engineering directors, and FinOps partners around resilient, cost-accountable multi-cloud governance.",
    recommendedTeamSize: "5 to 25+ Senior Architects & Leads",
    deliveryFormat: "Executive & Principal Roundtable Cohort",
    heroImage: "/hero-datacenter.jpg",
    talentMarket: {
      marketChallenge: "Disconnect between engineering architecture choices, cloud billing shock, and enterprise AI risk oversight",
      buildVsBuyAdvantage:
        "Uniting internal engineering leads and finance/FinOps partners under one shared architectural and unit-economics operating model produces measurable cloud savings within 90 days.",
      targetSectors: [
        "Multi-Region Enterprises",
        "Banking & Financial Groups",
        "Telecoms & Cloud-First Scaleups",
        "Regulated Conglomerates",
      ],
      operationalDrivers: [
        "Gain transparent departmental showback and unit-cost accountability across AWS and Azure spend.",
        "Validate multi-region disaster recovery (RPO/RTO) before critical workload cutovers.",
        "Install pragmatic NIST AI RMF risk guardrails as teams adopt generative AI APIs.",
      ],
      auditAndRiskImpact:
        "Curbs runaway cloud waste, protects uptime commitments across regions, and establishes executive oversight over AI vendor and model risk.",
    },
    capabilityLadder: [
      {
        stage: "Stage 01 · Standardized Baseline",
        capabilityTitle: "Multi-Cloud Landing Zone & Cost Visibility",
        teamFocus: "Principal Engineers & Cloud Architects",
        targetKpi: "100% mandatory cost-allocation tagging",
        operationalOwnership:
          "Teams establish standardized AWS Organizations / Azure Landing Zone guardrails and departmental spend visibility.",
      },
      {
        stage: "Stage 02 · Production Autonomy",
        capabilityTitle: "Resilient Failover & Continuous Rightsizing",
        teamFocus: "Architecture & FinOps Partners",
        targetKpi: "Validated RPO/RTO & automated anomaly alerts",
        operationalOwnership:
          "Leads conduct Well-Architected reviews, rightsizing sprints, and hybrid multi-region resilience testing.",
      },
      {
        stage: "Stage 03 · Enterprise Excellence",
        capabilityTitle: "Governed Cloud & AI Operating Model",
        teamFocus: "CTO Office, Architecture Board & FinOps",
        targetKpi: "Predictable unit economics & NIST AI RMF controls",
        operationalOwnership:
          "Leadership operates a repeatable architecture review board governing cloud unit costs and enterprise AI governance.",
      },
    ],
    teamExpertise: {
      technicalStandards: [
        "AWS Organizations & Azure Landing Zone security & network federation",
        "Multi-region active-active / pilot-light DR and event-driven systems",
        "Cloud cost-allocation tagging, showback models & compute rightsizing",
        "NIST AI RMF governance frameworks & API usage risk guardrails",
      ],
      governanceCapabilities: [
        "Cross-functional engineering + finance FinOps decision cadences",
        "Executive Architecture Decision Records (ADRs) & migration risk reviews",
        "Board-level cloud investment justification and AI risk accountability",
      ],
      rolesTransformed: [
        "Solutions Architects",
        "Engineering Managers & Tech Leads",
        "Cloud FinOps Partners",
        "IT Directors & Enterprise Architects",
      ],
    },
    systemCollaboration: {
      summary:
        "Led directly by senior solutions architects from Elites Technology Systems, this executive roundtable combines multi-cloud architectural defense with pragmatic 90-day FinOps and AI governance charters.",
      pillars: [
        {
          label: "Principal Architect Roundtables",
          detail:
            "Workshop real AWS/Azure migration blueprints and cost models directly with senior practicing architects.",
          href: "/academy/corporate#request-demo",
        },
        {
          label: "FinOps & Governance Deliverables",
          detail:
            "Teams exit with an actionable 90-day cloud rightsizing plan and enterprise AI usage policy.",
          href: "/services",
        },
        {
          label: "Net-30 Executive Procurement",
          detail:
            "Simple transparent per-seat quotes in USD, GBP, or GHS with zero licensing bloat.",
          href: "/academy/tuition?mode=corporate",
        },
      ],
      governanceDeliverable:
        "Enterprise Multi-Cloud Reference Blueprint + 90-Day Cloud FinOps & AI Governance Charter.",
    },
    recommendedPrograms: [
      {
        courseId: "course-azure-aws-architect",
        recommendationBadge: "Best Senior Architecture Track",
        stageLabel: "Multi-Cloud Enterprise Architecture",
        whyItFitsCareer:
          "Aligns senior architects on AWS & Azure landing zones, multi-region disaster recovery, and Well-Architected reviews.",
      },
      {
        courseId: "course-finops-governance",
        recommendationBadge: "Best Leadership Bootcamp",
        stageLabel: "Enterprise Cloud FinOps & AI Governance",
        whyItFitsCareer:
          "Dedicated 6-week corporate bootcamp equipping tech and FinOps leaders with unit-cost scorecards and NIST AI risk guardrails.",
      },
    ],
  },
  {
    id: "biz-path-workforce-ai",
    domain: "Data & Automation",
    department: "Cross-Functional Operations & Leadership",
    title: "Enterprise Applied AI & Data-Fluent Workforce",
    executiveOverview:
      "Digital transformation stalls when modern AI tools and BI dashboards remain locked inside IT. Elevating organization-wide technical fluency empowers managers, operations staff, and executives to automate routine workflows safely while interpreting live data scorecards with confidence.",
    recommendedTeamSize: "15 to 100+ Cross-Functional Staff",
    deliveryFormat: "Self-Paced + Executive Live Workshops",
    heroImage: "/academy/blog-finops-teams.jpg",
    talentMarket: {
      marketChallenge: "Shadow AI data leaks and under-utilized BI investments across non-engineering business units",
      buildVsBuyAdvantage:
        "Structured organization-wide fluency unlocks immediate productivity gains across existing staff while shutting down unsafe ad-hoc AI prompting habits.",
      targetSectors: [
        "Financial & Professional Services",
        "Retail, Logistics & Operations",
        "Healthcare Administration",
        "Corporate Headquarters & Shared Services",
      ],
      operationalDrivers: [
        "Replace risky copy-paste shadow AI habits with governed, privacy-safe departmental workflows.",
        "Move management teams from static monthly slide decks to live, interactive Power BI decision rooms.",
        "Build a shared vocabulary between business stakeholders and technical engineering teams.",
      ],
      auditAndRiskImpact:
        "Mitigates confidential data leakage into unapproved AI tools while dramatically increasing ROI on existing Microsoft/BI licensing.",
    },
    capabilityLadder: [
      {
        stage: "Stage 01 · Standardized Baseline",
        capabilityTitle: "Safe Everyday AI Productivity",
        teamFocus: "Operations, HR, Finance & Commercial Staff",
        targetKpi: "100% adherence to safe AI privacy guardrails",
        operationalOwnership:
          "Teams apply structured prompting, output verification checklists, and safe document workflows across daily tasks.",
      },
      {
        stage: "Stage 02 · Production Autonomy",
        capabilityTitle: "Departmental Workflow & KPI Fluency",
        teamFocus: "Team Leads & Department Managers",
        targetKpi: "Automated routine reporting & live BI reviews",
        operationalOwnership:
          "Managers question live Power BI scorecards, eliminate static deck prep, and deploy repeatable grounded templates.",
      },
      {
        stage: "Stage 03 · Enterprise Excellence",
        capabilityTitle: "Data-Driven & AI-Ready Culture",
        teamFocus: "Cross-Functional Leadership & Business Units",
        targetKpi: "Sustained operational cycle-time reduction",
        operationalOwnership:
          "Business units collaborate seamlessly with IT and Data teams to prioritize high-ROI automation initiatives.",
      },
    ],
    teamExpertise: {
      technicalStandards: [
        "Structured prompt engineering, verification rubrics & grounded document Q&A",
        "No-code departmental workflow automation templates",
        "Interactive executive Power BI navigation, filtering & KPI interrogation",
        "KPI alignment connecting operational levers to financial outcomes",
      ],
      governanceCapabilities: [
        "Clear PII & confidential data boundaries for everyday AI usage",
        "Elimination of unverified AI hallucinations in client or board documents",
        "Consistent executive KPI definitions across departments",
      ],
      rolesTransformed: [
        "Department Heads & Directors",
        "Operations & Project Managers",
        "Finance, HR & Commercial Staff",
        "Executive Leadership Teams",
      ],
    },
    systemCollaboration: {
      summary:
        "Deploy scalable self-paced AI fluency across large departments paired with focused 4-week executive BI workshops—monitored effortlessly through our Corporate Enablement Portal.",
      pillars: [
        {
          label: "Scalable Cross-Org Rollout",
          detail:
            "Roll out self-paced AI modules to 100+ staff with zero disruption to daily client or operational schedules.",
          href: "/academy/corporate",
        },
        {
          label: "Executive Decision Workshops",
          detail:
            "Run high-impact live sessions converting your directors' monthly packs into automated Power BI scorecards.",
          href: "/academy/corporate#request-demo",
        },
        {
          label: "Transparent Seat Governance",
          detail:
            "Track department adoption rates, reassign unused seats anytime, and bill cleanly via Net-30 invoice.",
          href: "/academy/tuition?mode=corporate",
        },
      ],
      governanceDeliverable:
        "Departmental Safe-AI Workflow Playbook + Unified Executive Power BI Decision Room.",
    },
    recommendedPrograms: [
      {
        courseId: "course-ai-productivity",
        recommendationBadge: "Best Organization-Wide Rollout",
        stageLabel: "Workforce Applied AI & Privacy Guardrails",
        whyItFitsCareer:
          "Equips cross-functional staff with safe prompt patterns, verification checks, and practical workflow automation in 6 self-paced weeks.",
      },
      {
        courseId: "course-exec-literacy",
        recommendationBadge: "Best Executive Workshop",
        stageLabel: "Executive Data Literacy & Automated BI",
        whyItFitsCareer:
          "Focused 4-week corporate bootcamp transforming static leadership reporting decks into live, governed Power BI scorecards.",
      },
    ],
  },
];
