import type { AcademyCategory, Course, DeliveryMode } from "./academyStore";

export interface CheckpointQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface RoadmapStage {
  level: string;
  title: string;
  desc: string;
  tools: string[];
  recommendedSlug?: string;
}

export interface PathfinderInput {
  background: "none" | "analyst" | "sysadmin" | "developer";
  targetRole:
    | "bi_analyst"
    | "cloud_sre"
    | "security"
    | "data_eng"
    | "it_support"
    | "ai_automation"
    | "exec_leader";
  pace: "all" | DeliveryMode;
  audience?: "individual" | "business";
}

export interface PathfinderResult {
  primaryCourseId: string;
  secondaryCourseId: string;
  summary: string;
  skillGaps: string[];
  estimatedWeeks: number;
}

export interface CorporateLearningPlan {
  id: string;
  name: string;
  targetDepartment: string;
  description: string;
  courseIds: string[];
}

export const CORPORATE_LEARNING_PLANS: CorporateLearningPlan[] = [
  {
    id: "plan-analytics-pipeline",
    name: "Analytics & Automated ETL Pathway",
    targetDepartment: "Finance, BI & Data Operations",
    description:
      "Pairs executive BI & SQL analytics with production Python & dbt warehouse automation.",
    courseIds: ["course-data-bi", "course-python-etl"],
  },
  {
    id: "plan-cloud-platform",
    name: "Cloud Architecture & Kubernetes SRE Pathway",
    targetDepartment: "Infrastructure & Platform Engineering",
    description:
      "Builds immutable Terraform & AWS foundations before scaling into Kubernetes reliability.",
    courseIds: ["course-cloud-devops", "course-k8s-sre"],
  },
  {
    id: "plan-secops-defense",
    name: "Zero-Trust Cloud Security Pathway",
    targetDepartment: "Security, Compliance & Cloud Ops",
    description:
      "Combines IAM governance, Vault/Trivy security pipelines, and resilient cloud landing zones.",
    courseIds: ["course-cybersecurity", "course-cloud-devops"],
  },
];

export function recommendTrackPathway(
  input: PathfinderInput,
  courses: Course[]
): PathfinderResult {
  let primaryCourseId = "course-data-bi";
  let secondaryCourseId = "course-python-etl";
  let summary =
    "Start with relational analytics, SQL, and executive BI modeling, then progress into tested dbt/Python data pipelines.";
  let skillGaps = ["Relational SQL Modeling", "Power BI DAX & Storytelling", "Automated Python/dbt ETL"];

  if (input.targetRole === "it_support") {
    primaryCourseId = "course-it-foundations";
    secondaryCourseId = "course-cloud-devops";
    summary =
      "Build hands-on OS troubleshooting, TCP/IP networking, and Linux command-line fluency first, then advance into cloud engineering and automation.";
    skillGaps = ["Linux CLI & Bash", "TCP/IP & DNS Troubleshooting", "Help-Desk & Cloud Readiness"];
  } else if (input.targetRole === "ai_automation") {
    primaryCourseId = "course-ai-productivity";
    secondaryCourseId = "course-python-etl";
    summary =
      "Master structured prompt engineering, Python AI API automation, and grounded document workflows, then scale into full data pipelines.";
    skillGaps = ["Structured Prompt Systems", "Python API Automation", "Grounded Document Retrieval (RAG)"];
  } else if (input.targetRole === "cloud_sre") {
    if (input.background === "developer" || input.background === "sysadmin") {
      primaryCourseId = "course-cloud-devops";
      secondaryCourseId =
        input.audience === "individual" ? "course-cybersecurity" : "course-k8s-sre";
      summary =
        input.audience === "individual"
          ? "Your technical background transitions directly into Terraform Infrastructure-as-Code and AWS/Azure landing zones, followed by zero-trust cloud security."
          : "Your technical background transitions directly into Terraform Infrastructure-as-Code and AWS/Azure landing zones, followed by production Kubernetes SRE.";
      skillGaps = ["Terraform State & Modules", "CI/CD Container Pipelines", "Kubernetes Ingress & Autoscaling"];
    } else {
      primaryCourseId =
        input.audience === "individual" && input.background === "none"
          ? "course-it-foundations"
          : "course-cloud-devops";
      secondaryCourseId =
        input.audience === "individual" && input.background === "none"
          ? "course-cloud-devops"
          : "course-cybersecurity";
      summary =
        input.audience === "individual" && input.background === "none"
          ? "Start with Linux, networking, and systems troubleshooting foundations before stepping into AWS/Azure cloud automation and Terraform."
          : "Build foundational Linux, networking, and IaC cloud automation before adding zero-trust IAM compliance controls.";
      skillGaps = ["VPC & Cloud Networking", "Terraform Automation", "Docker & Prometheus Monitoring"];
    }
  } else if (input.targetRole === "security") {
    primaryCourseId = "course-cybersecurity";
    secondaryCourseId =
      input.audience === "individual" && input.background === "none"
        ? "course-it-foundations"
        : "course-cloud-devops";
    summary =
      "Establish least-privilege IAM boundaries, HashiCorp Vault secrets hygiene, and Trivy scanning before expanding full cloud automation.";
    skillGaps = ["Zero-Trust IAM Policies", "Container Vulnerability Gates", "CloudTrail Forensics"];
  } else if (input.targetRole === "data_eng") {
    if (input.background === "analyst" || input.background === "developer") {
      primaryCourseId = "course-python-etl";
      secondaryCourseId = "course-cloud-devops";
      summary =
        "Move straight into Python extractors, SQL transformations, and dbt data quality tests, then layer on cloud container orchestration.";
      skillGaps = ["Incremental dbt Models", "Idempotent API Extractors", "Automated Schema Assertions"];
    } else {
      primaryCourseId = "course-data-bi";
      secondaryCourseId = "course-python-etl";
      summary =
        "Master core SQL joins, Excel/Alteryx workflows, and dimensional modeling first before engineering automated Python/dbt pipelines.";
      skillGaps = ["SQL Joins & Window Functions", "Dimensional Star Schemas", "Python ETL Automation"];
    }
  } else if (input.targetRole === "exec_leader") {
    primaryCourseId = "course-exec-literacy";
    secondaryCourseId = "course-data-bi";
    summary =
      "Complete the 4-week governance intensive for technical architecture & KPI oversight, then pair with practical BI literacy as needed.";
    skillGaps = ["Metric Governance & SLAs", "Build-vs-Buy AI/Cloud Evaluation", "Vendor Risk Frameworks"];
  }

  // Respect delivery pace preference if Self-Paced explicitly chosen
  if (input.pace === "Self-Paced") {
    const primaryObj = courses.find((c) => c.id === primaryCourseId);
    if (primaryObj && primaryObj.deliveryMode !== "Self-Paced") {
      const altSelfPaced = courses.find(
        (c) => c.deliveryMode === "Self-Paced" && c.category === primaryObj.category
      );
      if (altSelfPaced) {
        secondaryCourseId = primaryCourseId;
        primaryCourseId = altSelfPaced.id;
        summary = `${altSelfPaced.title} matches your self-paced schedule immediately, preparing you for deeper instructor-led workshops later.`;
      }
    }
  }

  const pCourse = courses.find((c) => c.id === primaryCourseId) || courses[0];
  const sCourse = courses.find((c) => c.id === secondaryCourseId) || courses[1] || courses[0];

  return {
    primaryCourseId: pCourse?.id || primaryCourseId,
    secondaryCourseId: sCourse?.id || secondaryCourseId,
    summary,
    skillGaps,
    estimatedWeeks: (pCourse?.durationWeeks || 0) + (sCourse?.id !== pCourse?.id ? sCourse?.durationWeeks || 0 : 0),
  };
}

export function getCategoryRoadmapMilestones(
  category: AcademyCategory,
  courseTitle: string,
  completedCount: number,
  totalModules: number
): RoadmapStage[] {
  const isCompleted = completedCount >= totalModules;
  const stage1Status = isCompleted
    ? "Mastery Verified · Core Track Complete"
    : `In Progress (${completedCount}/${totalModules} Modules Completed)`;

  switch (category) {
    case "Data & BI":
      return [
        {
          level: "Stage 01 · Analytical Foundation",
          title: `${courseTitle} · ${stage1Status}`,
          desc: "Solidify relational SQL window functions, Alteryx preparation flows, star-schema data modeling, and executive Power BI DAX measures.",
          tools: ["PostgreSQL", "Python (Pandas)", "Alteryx", "Power BI", "Tableau"],
        },
        {
          level: "Stage 02 · Pipeline & Warehouse Automation",
          title: "Next Specialization: Python & Pipeline Automation",
          desc: "Automate upstream ingestion, build tested incremental dbt transformations, and eliminate manual spreadsheet refreshes across BI datasets.",
          tools: ["Python 3.12", "dbt Core", "PostgreSQL", "Airflow", "FastAPI"],
          recommendedSlug: "python-data-engineering",
        },
        {
          level: "Stage 03 · Governance & Architecture Readiness",
          title: "Enterprise Analytics Lead & Certification Benchmark",
          desc: "Align executive KPI glossaries, semantic layer SLAs, and data governance controls ahead of Microsoft PL-300 / cloud data exams.",
          tools: ["Microsoft PL-300 Readiness", "Semantic Layer Modeling", "Executive KPI Frameworks"],
          recommendedSlug: "executive-data-literacy",
        },
      ];

    case "Cloud & DevOps":
      return [
        {
          level: "Stage 01 · Infrastructure Automation",
          title: `${courseTitle} · ${stage1Status}`,
          desc: "Standardize multi-AZ AWS & Azure networking, Terraform state locking, multi-stage Docker builds, and CI/CD delivery pipelines.",
          tools: ["AWS", "Terraform", "Docker", "GitHub Actions", "Prometheus"],
        },
        {
          level: "Stage 02 · Container Platform Reliability",
          title: "Next Specialization: Kubernetes & Cloud-Native SRE",
          desc: "Advance into Helm packaging, horizontal pod autoscaling, SLO alerting runbooks, and zero-downtime canary rollouts.",
          tools: ["Kubernetes", "Helm", "ArgoCD", "Grafana", "SLO Engineering"],
          recommendedSlug: "kubernetes-sre-foundations",
        },
        {
          level: "Stage 03 · Zero-Trust Security Posture",
          title: "Principal Cloud Architect & CKA / AWS SAP Readiness",
          desc: "Layer policy-as-code guardrails, Vault secret rotation, and disaster recovery drills across production clusters.",
          tools: ["HashiCorp Vault", "Trivy", "AWS SAP Readiness", "CKA Prep"],
          recommendedSlug: "cybersecurity-cloud-defense",
        },
      ];

    case "Cybersecurity":
      return [
        {
          level: "Stage 01 · Cloud Defense & IAM",
          title: `${courseTitle} · ${stage1Status}`,
          desc: "Enforce least-privilege IAM boundaries, automated container vulnerability gates with Trivy, Vault secrets rotation, and CloudTrail forensics.",
          tools: ["AWS IAM", "HashiCorp Vault", "Trivy", "GuardDuty", "CIS Controls"],
        },
        {
          level: "Stage 02 · Immutable Infrastructure Alignment",
          title: "Next Specialization: Cloud & DevOps Automation",
          desc: "Embed security controls directly into Terraform modules and GitHub Actions workflows for automated DevSecOps remediation.",
          tools: ["Terraform", "GitHub Actions", "Kubernetes Network Policies", "AWS Config"],
          recommendedSlug: "cloud-devops-automation",
        },
        {
          level: "Stage 03 · Executive Compliance & Risk Advisory",
          title: "Lead Security Architect & Audit Governance",
          desc: "Lead table-top incident drills, board-level risk briefings, and cross-framework audit mapping (SOC 2, ISO 27001).",
          tools: ["SOC 2 Evidence Automation", "ISO 27001", "Incident Command"],
          recommendedSlug: "executive-data-literacy",
        },
      ];

    case "Data & Automation":
    default:
      return [
        {
          level: "Stage 01 · Pipeline Engineering",
          title: `${courseTitle} · ${stage1Status}`,
          desc: "Deliver resilient REST/API ingestion scripts, tested dbt incremental models, schema freshness checks, and scheduled orchestration DAGs.",
          tools: ["Python 3.12", "dbt Core", "PostgreSQL", "FastAPI", "Docker"],
        },
        {
          level: "Stage 02 · Executive Analytics & BI Modeling",
          title: "Companion Track: Data Analysis & BI Engineering",
          desc: "Bridge backend data warehouses directly into decision-ready Tableau and Power BI semantic models for business stakeholders.",
          tools: ["Power BI", "Tableau", "DAX", "Alteryx"],
          recommendedSlug: "data-analysis-bi",
        },
        {
          level: "Stage 03 · Cloud Scale & Observability",
          title: "Senior Data Platform & Kubernetes Orchestration",
          desc: "Containerize workloads onto auto-scaling cloud clusters with automated CI testing and Prometheus latency telemetry.",
          tools: ["Terraform", "Kubernetes", "GitHub Actions", "Observability"],
          recommendedSlug: "cloud-devops-automation",
        },
      ];
  }
}

const DOMAIN_QUESTION_BANK: Record<AcademyCategory, CheckpointQuestion[]> = {
  "Data & BI": [
    {
      id: "q-dbi-1",
      prompt: "Which SQL pattern calculates a running cumulative revenue total per region without collapsing individual order rows?",
      options: [
        "GROUP BY region with SUM(revenue)",
        "SUM(revenue) OVER (PARTITION BY region ORDER BY order_date)",
        "DISTINCT region JOIN revenue_table",
      ],
      correctIndex: 1,
      rationale: "Window functions with OVER (PARTITION BY ... ORDER BY ...) preserve row granularity while computing partitioned cumulative totals.",
    },
    {
      id: "q-dbi-2",
      prompt: "Why do enterprise Power BI semantic models organize facts and dimensions as a Star Schema?",
      options: [
        "It reduces join ambiguity, improves VertiPaq compression, and prevents bidirectional filter propagation bugs",
        "It removes the need to define primary keys or date tables",
        "It stores every dashboard visual inside raw CSV files",
      ],
      correctIndex: 0,
      rationale: "Star schemas keep one-to-many filter propagation unambiguous and maximize columnar compression speed.",
    },
    {
      id: "q-dbi-3",
      prompt: "In Python analytics prep, when should vectorized Pandas operations be preferred over row-by-row iterrows()?",
      options: [
        "Only when exporting static PDF charts",
        "For almost all numeric, string, and conditional column transformations across large datasets",
        "Only when datasets contain fewer than 100 rows",
      ],
      correctIndex: 1,
      rationale: "Vectorized NumPy/Pandas column expressions execute in compiled C loops and outperform Python row iteration by orders of magnitude.",
    },
  ],
  "Cloud & DevOps": [
    {
      id: "q-cdv-1",
      prompt: "What risk does remote state locking (e.g. S3 + DynamoDB or Azure Blob lease) prevent in Terraform workflows?",
      options: [
        "Simultaneous concurrent applies corrupting shared infrastructure state files",
        "Docker container images exceeding memory limits",
        "TLS certificates expiring inside browser caches",
      ],
      correctIndex: 0,
      rationale: "Remote state locks prevent race conditions when two engineers or CI pipelines run terraform apply simultaneously.",
    },
    {
      id: "q-cdv-2",
      prompt: "Why do production Dockerfiles use multi-stage builds?",
      options: [
        "To ship build compilers inside production containers for easier debugging",
        "To strip build-time toolchains from final runtime images, shrinking size and vulnerability surface",
        "To allow root SSH access into running Kubernetes pods",
      ],
      correctIndex: 1,
      rationale: "Multi-stage builds compile dependencies in an intermediate stage and copy only runtime artifacts to a minimal final image.",
    },
    {
      id: "q-cdv-3",
      prompt: "In Kubernetes, what separates a Liveness probe from a Readiness probe?",
      options: [
        "Readiness removes a pod from Service traffic while busy starting; Liveness restarts a deadlocked container",
        "Liveness handles DNS routing while Readiness mounts storage volumes",
        "Both probes permanently delete the Deployment on first failure",
      ],
      correctIndex: 0,
      rationale: "Failing Readiness stops Service endpoints from sending traffic; failing Liveness triggers kubelet to restart the unhealthy container.",
    },
  ],
  Cybersecurity: [
    {
      id: "q-sec-1",
      prompt: "How do AWS IAM Permission Boundaries differ from attached identity policies?",
      options: [
        "They automatically grant AdministratorAccess across accounts",
        "They set the maximum possible effective permissions a delegated role can exercise, even if an attached policy asks for more",
        "They replace VPC security groups for inbound TLS traffic",
      ],
      correctIndex: 1,
      rationale: "Effective permissions equal the intersection of identity policies and the permission boundary ceiling.",
    },
    {
      id: "q-sec-2",
      prompt: "What does integrating Trivy as a blocking CI/CD gate accomplish before deployment?",
      options: [
        "Blocks container images containing critical/high known CVEs or exposed secrets from reaching production",
        "Encrypts SQL tables inside Excel spreadsheets",
        "Automatically provisions VPC subnets without Terraform",
      ],
      correctIndex: 0,
      rationale: "Trivy scans container layers, OS packages, and IaC manifests pre-push to enforce security gates early.",
    },
    {
      id: "q-sec-3",
      prompt: "Why use HashiCorp Vault dynamic database credentials instead of static .env secrets?",
      options: [
        "Dynamic leases are short-lived, per-workload unique, and automatically revoked on TTL expiration",
        "Static secrets load faster in frontend React bundles",
        "Vault bypasses CloudTrail logging requirements",
      ],
      correctIndex: 0,
      rationale: "Dynamic credentials minimize blast radius if leaked and eliminate manual credential rotation outages.",
    },
  ],
  "Data & Automation": [
    {
      id: "q-dat-1",
      prompt: "What makes a Python ingestion pipeline genuinely idempotent?",
      options: [
        "Deleting the entire database before every test",
        "Re-running the same extraction batch produces the exact same target state without duplicating rows",
        "Hardcoding API bearer tokens directly inside Airflow DAG files",
      ],
      correctIndex: 1,
      rationale: "Idempotency via deterministic merge/upsert keys allows safe retries without duplicate records.",
    },
    {
      id: "q-dat-2",
      prompt: "Which dbt Core schema tests catch upstream pipeline quality breaks before dashboards refresh?",
      options: [
        "not_null, unique, relationships, and custom freshness assertions",
        "CSS border-radius utility checks",
        "SSH key fingerprint comparisons",
      ],
      correctIndex: 0,
      rationale: "dbt built-in integrity and source freshness tests halt broken models from cascading downstream.",
    },
    {
      id: "q-dat-3",
      prompt: "Why validate incoming JSON payloads with Pydantic models in FastAPI microservice extractors?",
      options: [
        "Strict type coercion and early 422 schema failure reporting before malformed data hits downstream warehouses",
        "To disable HTTPS encryption in local containers",
        "To replace SQL primary keys in Postgres",
      ],
      correctIndex: 0,
      rationale: "Pydantic enforces runtime data contracts at ingestion boundaries cleanly.",
    },
  ],
};

export function getModuleCheckpointQuestions(
  category: AcademyCategory,
  moduleOrder: number
): CheckpointQuestion[] {
  const pool = DOMAIN_QUESTION_BANK[category] || DOMAIN_QUESTION_BANK["Data & BI"];
  // Rotate question order deterministically per module order so each module emphasizes a fresh lead prompt
  const offset = Math.max(0, (moduleOrder - 1) % pool.length);
  return [...pool.slice(offset), ...pool.slice(0, offset)].map((q, idx) => ({
    ...q,
    id: `${q.id}-m${moduleOrder}-${idx}`,
  }));
}
