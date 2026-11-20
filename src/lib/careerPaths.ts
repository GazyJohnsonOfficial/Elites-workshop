import type { AcademyCategory } from "./academyStore";

export interface CareerPathStage {
  stepNumber: string;
  stageLabel: string;
  courseId: string;
  focusSummary: string;
}

export interface IndividualCareerPath {
  id: string;
  domain: AcademyCategory;
  title: string;
  tagline: string;
  startingLevel: "Beginner Friendly" | "Intermediate Entry" | "Advanced Progression";
  idealFor: string;
  targetRoles: string[];
  keySkills: string[];
  capstoneOutcome: string;
  heroImage: string;
  stages: CareerPathStage[];
}

export interface BusinessCareerPath {
  id: string;
  domain: AcademyCategory;
  department: string;
  title: string;
  tagline: string;
  recommendedTeamSize: string;
  deliveryFormat: string;
  businessOutcomes: string[];
  governanceDeliverable: string;
  heroImage: string;
  stages: CareerPathStage[];
}

export const INDIVIDUAL_CAREER_PATHS: IndividualCareerPath[] = [
  {
    id: "ind-path-data-bi",
    domain: "Data & BI",
    title: "Data & Business Intelligence Analyst",
    tagline:
      "Go from spreadsheet basics to relational SQL, dimensional star schemas, dbt Core modeling, and executive Power BI portfolios.",
    startingLevel: "Beginner Friendly",
    idealFor: "Career switchers, finance/operations professionals, and junior analysts",
    targetRoles: ["Data Analyst", "BI Developer", "Analytics Engineer", "Reporting Lead"],
    keySkills: ["SQL Window Functions", "Power BI DAX", "Tableau", "Dimensional Star Schemas", "dbt Core", "Python Pandas"],
    capstoneOutcome:
      "End-to-end cloud warehouse + executive Power BI and Tableau portfolio defended live.",
    heroImage: "/academy/prog-data-bi.jpg",
    stages: [
      {
        stepNumber: "01",
        stageLabel: "Core Analytics & Visualization",
        courseId: "course-data-bi",
        focusSummary:
          "Build SQL querying, Python Pandas cleaning, Excel/VBA automation, Alteryx workflows, and interactive BI dashboards.",
      },
      {
        stepNumber: "02",
        stageLabel: "Cloud Warehouse & dbt Modeling",
        courseId: "course-sql-warehouse",
        focusSummary:
          "Advance into dimensional star schemas, query optimization, and tested dbt Core warehouse marts.",
      },
    ],
  },
  {
    id: "ind-path-it-cloud",
    domain: "Cloud & DevOps",
    title: "IT Support to Cloud & DevOps Engineer",
    tagline:
      "Start with operating systems, networking, and Linux command-line fluency, then step cleanly into AWS, Azure, Terraform, Docker, and CI/CD.",
    startingLevel: "Beginner Friendly",
    idealFor: "Beginners entering IT, help-desk technicians, and junior system administrators",
    targetRoles: ["IT Support Specialist", "Junior SysAdmin", "Cloud Engineer", "DevOps Practitioner"],
    keySkills: ["Linux CLI & Bash", "TCP/IP & DNS", "AWS & Azure", "Terraform IaC", "Docker", "GitHub Actions"],
    capstoneOutcome:
      "Automated multi-environment cloud landing zone deployed via Terraform and containerized CI/CD.",
    heroImage: "/academy/prog-cloud-devops.jpg",
    stages: [
      {
        stepNumber: "01",
        stageLabel: "IT, Networking & Linux Foundations",
        courseId: "course-it-foundations",
        focusSummary:
          "Master hardware/OS troubleshooting, subnetting, DNS diagnostics, Linux administration, and Bash scripting.",
      },
      {
        stepNumber: "02",
        stageLabel: "Cloud Automation & DevOps Pipelines",
        courseId: "course-cloud-devops",
        focusSummary:
          "Provision repeatable AWS and Azure environments with Terraform, Docker multi-stage builds, and automated CI/CD.",
      },
    ],
  },
  {
    id: "ind-path-cyber-soc",
    domain: "Cybersecurity",
    title: "Cybersecurity & SOC Defense Specialist",
    tagline:
      "Build practical blue-team readiness from SIEM alert triage and Wireshark forensics to zero-trust cloud IAM and Vault secret protection.",
    startingLevel: "Beginner Friendly",
    idealFor: "Career starters targeting SOC roles and IT staff pivoting into security",
    targetRoles: ["SOC Analyst", "Cloud Security Analyst", "IAM Specialist", "Incident Response Technician"],
    keySkills: ["SIEM / Splunk", "Wireshark PCAPs", "MITRE ATT&CK", "AWS IAM Hardening", "HashiCorp Vault", "Trivy CI Gates"],
    capstoneOutcome:
      "Full breach investigation dossier plus a hardened zero-trust multi-account cloud security baseline.",
    heroImage: "/academy/prog-cybersecurity.jpg",
    stages: [
      {
        stepNumber: "01",
        stageLabel: "SOC Monitoring & Incident Triage",
        courseId: "course-soc-analyst",
        focusSummary:
          "Analyze network packets, write SIEM correlation rules, triage phishing attacks, and execute containment playbooks.",
      },
      {
        stepNumber: "02",
        stageLabel: "Cloud Defense & Zero-Trust IAM",
        courseId: "course-cybersecurity",
        focusSummary:
          "Harden multi-account IAM policies, rotate secrets dynamically with Vault, and run CloudTrail forensics.",
      },
    ],
  },
  {
    id: "ind-path-ai-python",
    domain: "Data & Automation",
    title: "Applied AI & Python Automation Builder",
    tagline:
      "Turn manual office and data tasks into dependable AI workflows, Python API extractors, and automated pipeline services.",
    startingLevel: "Beginner Friendly",
    idealFor: "Working professionals, operations leads, analysts, and aspiring automation engineers",
    targetRoles: ["AI Workflow Specialist", "Operations Automation Analyst", "Python Automation Developer", "Junior Data Engineer"],
    keySkills: ["Structured Prompt Systems", "Document Retrieval (RAG)", "Python 3.12", "FastAPI & REST APIs", "PostgreSQL", "Docker"],
    capstoneOutcome:
      "Grounded document assistant plus a containerized Python ingestion and reporting pipeline.",
    heroImage: "/academy/prog-python-etl.jpg",
    stages: [
      {
        stepNumber: "01",
        stageLabel: "Applied AI & Workflow Automation",
        courseId: "course-ai-productivity",
        focusSummary:
          "Design privacy-safe AI workflows, automated spreadsheet/document pipelines, and grounded RAG assistants.",
      },
      {
        stepNumber: "02",
        stageLabel: "Python ETL & Production Pipelines",
        courseId: "course-python-etl",
        focusSummary:
          "Engineer resilient Python API extractors, Pydantic validation contracts, and scheduled Dockerized data pipelines.",
      },
    ],
  },
  {
    id: "ind-path-analytics-eng",
    domain: "Data & Automation",
    title: "Python & Analytics Engineering Specialist",
    tagline:
      "Combine cloud data warehousing and dbt Core semantic modeling with type-safe Python ingestion and containerized orchestration.",
    startingLevel: "Intermediate Entry",
    idealFor: "SQL analysts and developers transitioning into backend analytics engineering",
    targetRoles: ["Analytics Engineer", "Data Engineer", "ETL Pipeline Developer", "Warehouse Architect"],
    keySkills: ["Snowflake & PostgreSQL", "dbt Core Testing", "Dimensional Modeling", "Python ETL", "Pydantic", "Airflow & Docker"],
    capstoneOutcome:
      "Tested 3-layer dbt warehouse fed by an automated Python REST API extractor with alerting.",
    heroImage: "/academy/track-data.jpg",
    stages: [
      {
        stepNumber: "01",
        stageLabel: "SQL Warehousing & dbt Core",
        courseId: "course-sql-warehouse",
        focusSummary:
          "Architect star schemas, SCD Type 2 history tables, and tested dbt transformation pipelines.",
      },
      {
        stepNumber: "02",
        stageLabel: "Python Extraction & Orchestration",
        courseId: "course-python-etl",
        focusSummary:
          "Build idempotent Python ingestion services with schema validation and automated health monitoring.",
      },
    ],
  },
  {
    id: "ind-path-cloud-architect",
    domain: "Cloud & DevOps",
    title: "Multi-Cloud Solutions Architect",
    tagline:
      "Progress from Terraform infrastructure automation into enterprise AWS and Azure multi-region architecture, failover, and Well-Architected reviews.",
    startingLevel: "Advanced Progression",
    idealFor: "SysAdmins, DevOps engineers, and software developers targeting senior architect roles",
    targetRoles: ["Cloud Solutions Architect", "Senior Cloud Engineer", "Platform Architect", "Infrastructure Lead"],
    keySkills: ["AWS Organizations", "Azure Landing Zones", "Terraform Modules", "Multi-Region DR", "Event-Driven Systems", "Well-Architected Reviews"],
    capstoneOutcome:
      "Multi-region AWS and Azure reference architecture with RPO/RTO runbooks and cost model defense.",
    heroImage: "/academy/track-cloud.jpg",
    stages: [
      {
        stepNumber: "01",
        stageLabel: "Infrastructure-as-Code & CI/CD",
        courseId: "course-cloud-devops",
        focusSummary:
          "Standardize modular Terraform codebases, remote state locking, Docker builds, and automated deployment pipelines.",
      },
      {
        stepNumber: "02",
        stageLabel: "Multi-Cloud Enterprise Architecture",
        courseId: "course-azure-aws-architect",
        focusSummary:
          "Design hub-and-spoke landing zones, active-active disaster recovery, and Well-Architected cloud migrations.",
      },
    ],
  },
];

export const BUSINESS_CAREER_PATHS: BusinessCareerPath[] = [
  {
    id: "biz-path-platform-sre",
    domain: "Cloud & DevOps",
    department: "Platform & Infrastructure Engineering",
    title: "Cloud Platform & Kubernetes SRE Organization Path",
    tagline:
      "Standardize Terraform infrastructure-as-code across engineering squads before scaling teams into resilient Kubernetes Day-2 operations.",
    recommendedTeamSize: "10 to 50+ Engineers",
    deliveryFormat: "Shared Cohorts or Private Dedicated Bootcamp",
    businessOutcomes: [
      "Eliminate manual console drift with remote-locked Terraform modules",
      "Reduce cluster incident recovery times with Prometheus SLO runbooks",
      "Establish repeatable multi-stage Docker and GitHub Actions CI/CD",
    ],
    governanceDeliverable:
      "Production Terraform Landing Zone + Hardened Multi-Namespace Kubernetes Runbook Pack",
    heroImage: "/academy/prog-k8s-sre.jpg",
    stages: [
      {
        stepNumber: "01",
        stageLabel: "Cloud Automation & IaC Baseline",
        courseId: "course-cloud-devops",
        focusSummary:
          "Align platform and DevOps teams on reusable Terraform modules, AWS/Azure networking, and automated CI/CD.",
      },
      {
        stepNumber: "02",
        stageLabel: "Production Kubernetes & SRE Operations",
        courseId: "course-k8s-sre",
        focusSummary:
          "Train squads on Helm packaging, autoscaling, NetworkPolicies, and live broken-cluster incident drills.",
      },
    ],
  },
  {
    id: "biz-path-data-modernization",
    domain: "Data & BI",
    department: "Finance, BI & Data Operations",
    title: "Enterprise Data, Warehousing & Automated BI Path",
    tagline:
      "Replace conflicting departmental spreadsheets with governed star schemas, tested dbt pipelines, and self-refreshing executive BI.",
    recommendedTeamSize: "10 to 40+ Analysts & Engineers",
    deliveryFormat: "Role-Split Departmental Cohort",
    businessOutcomes: [
      "Unify finance, sales, and operations around one certified KPI dictionary",
      "Replace manual monthly workbook prep with tested dbt and Python pipelines",
      "Accelerate self-service Power BI and Tableau adoption with semantic modeling",
    ],
    governanceDeliverable:
      "Certified Enterprise Semantic Model + Tested 3-Layer dbt Warehouse Repository",
    heroImage: "/academy/prog-exec-bi.jpg",
    stages: [
      {
        stepNumber: "01",
        stageLabel: "BI & SQL Analytical Foundation",
        courseId: "course-data-bi",
        focusSummary:
          "Standardize SQL window analysis, Power BI DAX modeling, and repeatable dashboard reporting.",
      },
      {
        stepNumber: "02",
        stageLabel: "Cloud Warehousing & dbt Testing",
        courseId: "course-sql-warehouse",
        focusSummary:
          "Build conformed star schemas and automated dbt Core data quality gates.",
      },
      {
        stepNumber: "03",
        stageLabel: "Python Ingestion & Automation",
        courseId: "course-python-etl",
        focusSummary:
          "Automate upstream SaaS API extraction with Pydantic validation and containerized scheduling.",
      },
    ],
  },
  {
    id: "biz-path-devsecops",
    domain: "Cybersecurity",
    department: "Security, Compliance & Cloud Ops",
    title: "Zero-Trust Cloud Security & DevSecOps Path",
    tagline:
      "Embed least-privilege IAM, dynamic Vault secrets, supply-chain SBOMs, and continuous NIST CSF 2.0 compliance across delivery squads.",
    recommendedTeamSize: "8 to 35+ Security & Platform Staff",
    deliveryFormat: "Private Sandbox Residency or Shared Seats",
    businessOutcomes: [
      "Eliminate long-lived static credentials across cloud accounts and CI/CD",
      "Block critical container CVEs and misconfigurations before production merges",
      "Generate continuous audit-ready evidence aligned to NIST CSF 2.0 and SOC 2",
    ],
    governanceDeliverable:
      "Hardened Zero-Trust CI/CD Pipeline + Continuous NIST CSF 2.0 / SOC 2 Control Matrix",
    heroImage: "/training-platform.jpg",
    stages: [
      {
        stepNumber: "01",
        stageLabel: "Cloud Defense & IAM Governance",
        courseId: "course-cybersecurity",
        focusSummary:
          "Audit multi-account IAM boundaries, deploy Vault dynamic secrets, and run CloudTrail forensics.",
      },
      {
        stepNumber: "02",
        stageLabel: "Enterprise DevSecOps & Audit Automation",
        courseId: "course-devsecops-bootcamp",
        focusSummary:
          "Enforce OPA/Kyverno admission controls, SBOM signing, and continuous compliance evidence collection.",
      },
    ],
  },
  {
    id: "biz-path-arch-finops",
    domain: "Cloud & DevOps",
    department: "Architecture, FinOps & Technology Leadership",
    title: "Multi-Cloud Architecture & FinOps Governance Path",
    tagline:
      "Equip principal architects, engineering leads, and FinOps partners to design resilient AWS/Azure systems while controlling cloud unit economics.",
    recommendedTeamSize: "5 to 25+ Senior Architects & Leads",
    deliveryFormat: "Executive & Principal Roundtable Cohort",
    businessOutcomes: [
      "Standardize AWS Organizations and Azure Landing Zone security guardrails",
      "Establish mandatory cost-allocation tags and departmental showback reporting",
      "Deploy NIST AI RMF governance and cloud spend anomaly alerting",
    ],
    governanceDeliverable:
      "Enterprise Multi-Cloud Migration Blueprint + 90-Day Cloud FinOps & AI Governance Charter",
    heroImage: "/hero-datacenter.jpg",
    stages: [
      {
        stepNumber: "01",
        stageLabel: "Multi-Cloud Enterprise Architecture",
        courseId: "course-azure-aws-architect",
        focusSummary:
          "Design hub-and-spoke networking, multi-region disaster recovery, and Well-Architected workload reviews.",
      },
      {
        stepNumber: "02",
        stageLabel: "Cloud FinOps & AI Governance",
        courseId: "course-finops-governance",
        focusSummary:
          "Implement FinOps unit-cost scorecards, compute rightsizing, and NIST AI risk guardrails.",
      },
    ],
  },
  {
    id: "biz-path-workforce-ai",
    domain: "Data & Automation",
    department: "Cross-Functional Operations & Leadership",
    title: "Workforce Applied AI & Executive Data Fluency Path",
    tagline:
      "Raise organization-wide technical fluency across non-engineering teams with privacy-safe AI workflows and governed executive dashboards.",
    recommendedTeamSize: "15 to 100+ Cross-Functional Staff",
    deliveryFormat: "Self-Paced + Executive Live Workshops",
    businessOutcomes: [
      "Replace ad-hoc AI prompting with safe, repeatable departmental workflows",
      "Equip managers to read, question, and act on live Power BI scorecards",
      "Protect sensitive internal documents with clear AI privacy guardrails",
    ],
    governanceDeliverable:
      "Departmental AI Workflow Playbook + Unified Executive KPI Decision Room",
    heroImage: "/academy/blog-finops-teams.jpg",
    stages: [
      {
        stepNumber: "01",
        stageLabel: "Workforce AI Productivity & Guardrails",
        courseId: "course-ai-productivity",
        focusSummary:
          "Train business and operations staff on safe prompt patterns, automation templates, and grounded document Q&A.",
      },
      {
        stepNumber: "02",
        stageLabel: "Executive Data Literacy & Automated BI",
        courseId: "course-exec-literacy",
        focusSummary:
          "Transform static monthly reporting decks into automated Power BI KPI scorecards in 4 weeks.",
      },
    ],
  },
];
