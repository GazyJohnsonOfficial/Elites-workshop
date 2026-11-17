import { SITE_CONFIG } from "./config";
import { generateSecureReference } from "./security";

export type AcademyCategory =
  | "Data & BI"
  | "Cloud & DevOps"
  | "Cybersecurity"
  | "Data & Automation";

export type DeliveryMode = "Instructor-Led" | "Self-Paced" | "Corporate Bootcamp";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type CurrencyCode = "USD" | "GHS" | "GBP";
export type UserRole = "learner" | "org_admin" | "staff_admin";

export const ACADEMY_CATEGORIES: AcademyCategory[] = [
  "Data & BI",
  "Cloud & DevOps",
  "Cybersecurity",
  "Data & Automation",
];

export const DELIVERY_MODES: DeliveryMode[] = [
  "Instructor-Led",
  "Self-Paced",
  "Corporate Bootcamp",
];

export function normalizeAcademyCategory(value?: string): AcademyCategory {
  if (value === "AI & Automation" || value === "Data & Automation") {
    return "Data & Automation";
  }
  if (
    value === "Data & BI" ||
    value === "Cloud & DevOps" ||
    value === "Cybersecurity"
  ) {
    return value;
  }
  return "Cloud & DevOps";
}

export function normalizeDeliveryMode(value?: string): DeliveryMode {
  if (value === "Live Cohort" || value === "Instructor-Led") {
    return "Instructor-Led";
  }
  if (value === "Self-Paced" || value === "Corporate Bootcamp") {
    return value;
  }
  return "Instructor-Led";
}

export function getTodayUtcIsoKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function getCourseUpcomingCohorts(
  course: Pick<Course, "id" | "deliveryMode">,
  cohorts: Cohort[],
  todayKey = getTodayUtcIsoKey()
): Cohort[] {
  return cohorts
    .filter((coh) => {
      if (coh.courseId !== course.id) return false;
      if (coh.status !== "open") return false;
      if (coh.seatCapacity - coh.seatsTaken <= 0) return false;
      if (course.deliveryMode === "Self-Paced") return true;
      return coh.startDateIso.slice(0, 10) >= todayKey;
    })
    .sort((a, b) => a.startDateIso.localeCompare(b.startDateIso));
}

export interface CourseModule {
  id: string;
  order: number;
  weekLabel: string;
  title: string;
  summary: string;
  durationHours: number;
  objectives: string[];
  labTask: string;
  resourceNote: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: AcademyCategory;
  deliveryMode: DeliveryMode;
  level: SkillLevel;
  durationWeeks: number;
  sessionCount: number;
  tuitionUsd: number;
  heroImage: string;
  tools: string[];
  roles: string[];
  description: string;
  featured: boolean;
  status: "active" | "draft";
  createdAt?: string;
  modules: CourseModule[];
}

export interface Cohort {
  id: string;
  courseId: string;
  code: string;
  startDateText: string;
  startDateIso: string;
  schedule: string;
  format: string;
  seatCapacity: number;
  seatsTaken: number;
  status: "open" | "full" | "in_progress" | "completed";
}

export interface AcademyUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  country: string;
  organizationId?: string;
  password?: string;
  lastPasswordResetAt?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  reference: string;
  name: string;
  billingEmail: string;
  contactName: string;
  phone: string;
  region: string;
  seatQuota: number;
  seatsUsed: number;
  billingStatus: "quote_pending" | "net30_invoiced" | "paid";
  createdAt: string;
}

export interface CorporateQuote {
  id: string;
  reference: string;
  organizationId: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  region: string;
  courseId: string;
  courseTitle: string;
  seatCount: number;
  currency: CurrencyCode;
  unitPriceUsd: number;
  discountPercent: number;
  totalUsd: number;
  totalLocalFormatted: string;
  billingTerms: "Net-30 Purchase Order" | "Upfront Corporate Invoice";
  status: "pending" | "approved" | "paid";
  notes: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  reference: string;
  userId: string;
  learnerName: string;
  learnerEmail: string;
  learnerPhone: string;
  country: string;
  courseId: string;
  cohortId?: string;
  organizationId?: string;
  paymentPlan: "full" | "installment_2" | "corporate_seat";
  currency: CurrencyCode;
  totalUsd: number;
  amountPaidUsd: number;
  paymentStatus: "pending" | "deposit_paid" | "paid_in_full" | "corporate_sponsored";
  status: "pending" | "active" | "completed" | "cancelled";
  completedModuleIds: string[];
  moduleScores?: Record<string, number>;
  capstoneUrl: string;
  capstoneNotes: string;
  certificateCode?: string;
  lastActiveAt: string;
  createdAt: string;
}

export interface TuitionPayment {
  id: string;
  reference: string;
  enrollmentId?: string;
  organizationId?: string;
  quoteId?: string;
  payerName: string;
  payerEmail: string;
  description: string;
  installmentNumber: 1 | 2;
  currency: CurrencyCode;
  amountUsd: number;
  amountLocalFormatted: string;
  channel: "Bank Transfer" | "Mobile Money (MoMo)" | "Debit / Credit Card" | "Net-30 Corporate PO";
  status: "pending" | "verified";
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface Certificate {
  code: string;
  enrollmentId: string;
  learnerName: string;
  learnerEmail: string;
  courseTitle: string;
  category: AcademyCategory;
  durationWeeks: number;
  issuedAt: string;
  instructorName: string;
}

export interface PasswordResetRequest {
  id: string;
  token: string;
  email: string;
  userId?: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  usedAt?: string;
}

export interface AcademyStoreState {
  courses: Course[];
  cohorts: Cohort[];
  users: AcademyUser[];
  organizations: Organization[];
  quotes: CorporateQuote[];
  enrollments: Enrollment[];
  payments: TuitionPayment[];
  certificates: Certificate[];
  passwordResets: PasswordResetRequest[];
}

export function formatCurrencyAmount(amountUsd: number, currency: CurrencyCode): string {
  const cfg = SITE_CONFIG.PAYMENT.CURRENCIES[currency] || SITE_CONFIG.PAYMENT.CURRENCIES.USD;
  const converted = Math.round(amountUsd * cfg.RATE);
  return `${cfg.SYMBOL}${converted.toLocaleString("en-US")}`;
}

export function getCorporateDiscountPercent(seats: number): number {
  if (seats >= 30) return 22;
  if (seats >= 15) return 15;
  if (seats >= 5) return 10;
  return 0;
}

export interface CourseCompletionSummary {
  courseId: string;
  enrollmentId: string;
  completedCount: number;
  totalModules: number;
  completionPct: number;
  completedModuleIds: string[];
  status: Enrollment["status"];
  certificateCode?: string;
  nextModuleOrder?: number;
  nextModuleTitle?: string;
}

export function getCourseCompletionSummaries(
  store: AcademyStoreState,
  userId?: string,
  email?: string
): CourseCompletionSummary[] {
  const cleanUserId = userId?.trim();
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanUserId && !cleanEmail) {
    return [];
  }

  const matchingEnrollments = store.enrollments.filter((enr) => {
    if (enr.status === "cancelled") return false;
    const matchesUser = Boolean(cleanUserId && enr.userId === cleanUserId);
    const matchesEmail = Boolean(cleanEmail && enr.learnerEmail.toLowerCase() === cleanEmail);
    return matchesUser || matchesEmail;
  });

  const byCourse = new Map<string, { summary: CourseCompletionSummary; lastActiveAt: string }>();

  for (const enr of matchingEnrollments) {
    const course = store.courses.find((c) => c.id === enr.courseId);
    if (!course) continue;

    const orderedModules = [...course.modules].sort((a, b) => a.order - b.order);
    const validModuleIds = new Set(orderedModules.map((m) => m.id));
    const uniqueCompleted = Array.from(
      new Set(enr.completedModuleIds.filter((id) => validModuleIds.has(id)))
    );
    const completedSet = new Set(uniqueCompleted);
    const totalModules = orderedModules.length;
    const completedCount = uniqueCompleted.length;
    const completionPct =
      totalModules > 0
        ? Math.min(100, Math.max(0, Math.round((completedCount / totalModules) * 100)))
        : 0;
    const nextModule = orderedModules.find((m) => !completedSet.has(m.id));

    const summary: CourseCompletionSummary = {
      courseId: course.id,
      enrollmentId: enr.id,
      completedCount,
      totalModules,
      completionPct,
      completedModuleIds: uniqueCompleted,
      status: enr.status,
      certificateCode: enr.certificateCode,
      nextModuleOrder: nextModule?.order,
      nextModuleTitle: nextModule?.title,
    };

    const existing = byCourse.get(course.id);
    if (!existing) {
      byCourse.set(course.id, { summary, lastActiveAt: enr.lastActiveAt });
    } else {
      const existingCompleted = existing.summary.status === "completed";
      const nextCompleted = summary.status === "completed";
      const shouldReplace =
        (nextCompleted && !existingCompleted) ||
        (nextCompleted === existingCompleted && summary.completionPct > existing.summary.completionPct) ||
        (nextCompleted === existingCompleted &&
          summary.completionPct === existing.summary.completionPct &&
          enr.lastActiveAt > existing.lastActiveAt);
      if (shouldReplace) {
        byCourse.set(course.id, { summary, lastActiveAt: enr.lastActiveAt });
      }
    }
  }

  return Array.from(byCourse.values()).map((entry) => entry.summary);
}

function createSeedState(): AcademyStoreState {
  const courses: Course[] = [
    {
      id: "course-data-bi",
      slug: "data-analysis-bi",
      title: "Data Analysis & Business Intelligence Engineering",
      subtitle: "From raw messy enterprise schemas to automated executive dashboards in 12 weeks",
      category: "Data & BI",
      deliveryMode: "Instructor-Led",
      level: "Beginner",
      durationWeeks: 12,
      sessionCount: 36,
      tuitionUsd: 1000,
      heroImage: "/academy/prog-data-bi.jpg",
      tools: ["SQL", "Python", "Excel & VBA", "Alteryx", "Tableau", "Power BI"],
      roles: ["Data Analyst", "BI Developer", "Analytics Engineer", "Operations Analyst"],
      description:
        "Our flagship practitioner track connecting SQL relational querying, Python Pandas cleaning, Excel/VBA automation, Alteryx ETL blending, and executive storytelling in Tableau & Power BI.",
      featured: true,
      status: "active",
      createdAt: "2026-06-15T09:00:00Z",
      modules: [
        {
          id: "mod-da-1",
          order: 1,
          weekLabel: "Weeks 1–2",
          title: "Excel Financial Modeling, Power Query & VBA Macros",
          summary: "Build resilient lookup models, automated Power Query ingestion pipelines, and time-saving VBA reporting macros.",
          durationHours: 6,
          objectives: [
            "Normalize messy multi-sheet workbooks with Power Query",
            "Implement dynamic XLOOKUP and INDEX/MATCH KPI scorecards",
            "Write automated VBA macros for weekly report generation",
          ],
          labTask: "Automate a 12-region quarterly sales reconciliation workbook with zero manual copy-paste.",
          resourceNote: "Practitioner Session Pack 01–06 + Regional Retail Dataset (180k rows)",
        },
        {
          id: "mod-da-2",
          order: 2,
          weekLabel: "Weeks 3–4",
          title: "Production SQL Querying, Joins & Window Functions",
          summary: "Query normalized relational schemas with CTEs, analytical window functions, and performance-tuned aggregations.",
          durationHours: 6,
          objectives: [
            "Write multi-table INNER, LEFT, and anti-joins safely",
            "Compute rolling retention and cohort revenue with RANK/LAG/OVER",
            "Optimize query plans and isolate data anomalies",
          ],
          labTask: "Write a customer churn and cohort retention SQL pipeline against the SaaS billing schema.",
          resourceNote: "PostgreSQL Lab Sandbox + SQL Query Style Guide",
        },
        {
          id: "mod-da-3",
          order: 3,
          weekLabel: "Weeks 5–7",
          title: "Python Data Wrangling, Pandas & Automated EDA",
          summary: "Clean inconsistent records, handle missing timestamps, and generate repeatable exploratory notebooks in Python.",
          durationHours: 9,
          objectives: [
            "Vectorize transformations with Pandas and NumPy",
            "Clean malformed currencies, dates, and text with regex",
            "Build automated anomaly detection summary scripts",
          ],
          labTask: "Create an automated Python data quality pipeline outputting clean Parquet/CSV tables.",
          resourceNote: "Jupyter Notebook Repository + Messy Logistics CSV Pack",
        },
        {
          id: "mod-da-4",
          order: 4,
          weekLabel: "Weeks 8–9",
          title: "Self-Service ETL Workflows in Alteryx",
          summary: "Blend spreadsheets, SQL tables, and API feeds into repeatable low-code ETL workflows.",
          durationHours: 6,
          objectives: [
            "Design multi-source Alteryx data blending pipelines",
            "Configure spatial joins, fuzzy matching, and output validation",
          ],
          labTask: "Blend customer CRM records with ERP transaction logs and flag duplicate accounts.",
          resourceNote: "Alteryx Designer Workflow Templates",
        },
        {
          id: "mod-da-5",
          order: 5,
          weekLabel: "Weeks 10–11",
          title: "Interactive Visual Storytelling with Tableau",
          summary: "Craft drill-down executive dashboards, parameter controls, and high-signal visual hierarchies.",
          durationHours: 6,
          objectives: [
            "Build calculated fields, Level of Detail (LOD) expressions, and actions",
            "Design accessible executive KPI layouts for stakeholder reviews",
          ],
          labTask: "Publish an interactive Regional Profitability & Margin Variance Tableau scorecard.",
          resourceNote: "Tableau Public Workbook + Visual Design Checklist",
        },
        {
          id: "mod-da-6",
          order: 6,
          weekLabel: "Week 12",
          title: "Power BI Star Schemas, DAX & Capstone Defense",
          summary: "Model enterprise star schemas, author DAX time-intelligence measures, and defend your capstone live.",
          durationHours: 6,
          objectives: [
            "Architect clean star schemas avoiding bidirectional filter pitfalls",
            "Write YoY, MoM, and rolling 90-day DAX measures",
            "Defend your end-to-end capstone before senior architects",
          ],
          labTask: "Submit GitHub repository & live Power BI/Tableau executive capstone link for mentor review.",
          resourceNote: "Capstone Evaluation Rubric + Defense Booking",
        },
      ],
    },
    {
      id: "course-cloud-devops",
      slug: "cloud-devops-automation",
      title: "Cloud Systems Architecture & DevOps Automation",
      subtitle: "Multi-cloud landing zones, immutable Terraform IaC, Docker, and Kubernetes operations",
      category: "Cloud & DevOps",
      deliveryMode: "Instructor-Led",
      level: "Intermediate",
      durationWeeks: 12,
      sessionCount: 36,
      tuitionUsd: 1250,
      heroImage: "/academy/prog-cloud-devops.jpg",
      tools: ["AWS", "Microsoft Azure", "Terraform", "Docker", "Kubernetes", "GitHub Actions"],
      roles: ["Cloud Architect", "DevOps Engineer", "Platform Engineer", "Site Reliability Engineer"],
      description:
        "Bridge development and production operations. Master immutable cloud infrastructure on AWS & Azure with modular Terraform, containerized workloads, automated CI/CD, and Prometheus telemetry.",
      featured: true,
      status: "active",
      createdAt: "2026-07-20T09:00:00Z",
      modules: [
        {
          id: "mod-cd-1",
          order: 1,
          weekLabel: "Weeks 1–3",
          title: "Cloud Networking, VPC Design & Linux Systems",
          summary: "Architect multi-AZ VPCs, public/private subnets, NAT gateways, IAM boundaries, and Linux bash automation.",
          durationHours: 9,
          objectives: [
            "Design segmented public, application, and database subnets",
            "Enforce least-privilege IAM roles and cross-account boundaries",
          ],
          labTask: "Deploy a fault-tolerant multi-AZ VPC topology with bastion-free SSM access.",
          resourceNote: "AWS / Azure Sandbox Guide + Bash Diagnostics Kit",
        },
        {
          id: "mod-cd-2",
          order: 2,
          weekLabel: "Weeks 4–6",
          title: "Modular Infrastructure as Code with Terraform",
          summary: "Codify zero-drift cloud environments with remote state locking, reusable modules, and automated plan gates.",
          durationHours: 9,
          objectives: [
            "Configure encrypted remote state backends with state locking",
            "Author composable Terraform modules for compute and networking",
          ],
          labTask: "Provision staging and production cloud landing zones from one parameterized Terraform repo.",
          resourceNote: "Terraform Module Reference Repo",
        },
        {
          id: "mod-cd-3",
          order: 3,
          weekLabel: "Weeks 7–9",
          title: "Containers, Multi-Stage Docker & Kubernetes Ops",
          summary: "Package lean container images and orchestrate resilient workloads using Kubernetes Deployments, Ingress, and Helm.",
          durationHours: 9,
          objectives: [
            "Reduce image attack surface with distroless multi-stage builds",
            "Configure Horizontal Pod Autoscaling and readiness/liveness probes",
          ],
          labTask: "Deploy a 3-tier microservices stack onto Kubernetes with TLS ingress and Helm.",
          resourceNote: "Kubernetes Manifests & Helm Starter Charts",
        },
        {
          id: "mod-cd-4",
          order: 4,
          weekLabel: "Weeks 10–12",
          title: "CI/CD Pipelines, Observability & Capstone Cutover",
          summary: "Automate zero-downtime canary rollouts and full-stack observability with Prometheus and Grafana.",
          durationHours: 9,
          objectives: [
            "Build GitHub Actions pipelines with OIDC cloud authentication",
            "Instrument golden-signal dashboards and alert thresholds",
          ],
          labTask: "Execute an end-to-end automated pipeline deployment and live incident recovery drill.",
          resourceNote: "Observability Stack Templates + Capstone Checklist",
        },
      ],
    },
    {
      id: "course-cybersecurity",
      slug: "cybersecurity-cloud-defense",
      title: "Cybersecurity Operations, Cloud Defense & Compliance",
      subtitle: "Zero-trust identity governance, vulnerability scanning, and automated incident response",
      category: "Cybersecurity",
      deliveryMode: "Instructor-Led",
      level: "Intermediate",
      durationWeeks: 12,
      sessionCount: 36,
      tuitionUsd: 1250,
      heroImage: "/academy/prog-cybersecurity.jpg",
      tools: ["Zero Trust IAM", "CloudTrail", "GuardDuty", "HashiCorp Vault", "Trivy", "Policy-as-Code"],
      roles: ["Cloud Security Analyst", "DevSecOps Engineer", "Security Architect", "Compliance Auditor"],
      description:
        "Defend cloud-native infrastructure against credential leaks, configuration drift, and supply-chain threats using zero-trust IAM, Vault secret rotation, Trivy scanning, and forensic runbooks.",
      featured: true,
      status: "active",
      createdAt: "2026-08-18T09:00:00Z",
      modules: [
        {
          id: "mod-cs-1",
          order: 1,
          weekLabel: "Weeks 1–3",
          title: "Zero-Trust Identity & Cloud Perimeter Hardening",
          summary: "Enforce federated SSO, permission boundaries, service control policies, and network micro-segmentation.",
          durationHours: 9,
          objectives: [
            "Audit over-privileged IAM policies and eliminate static root keys",
            "Implement organization-wide SCP guardrails",
          ],
          labTask: "Remediate a deliberately misconfigured multi-account IAM environment.",
          resourceNote: "Zero-Trust IAM Audit Workbook",
        },
        {
          id: "mod-cs-2",
          order: 2,
          weekLabel: "Weeks 4–6",
          title: "DevSecOps Pipelines & Dynamic Secrets Management",
          summary: "Embed Trivy container scanning, SAST checks, and HashiCorp Vault secret leases directly into CI/CD.",
          durationHours: 9,
          objectives: [
            "Block critical CVEs automatically in pull request pipelines",
            "Replace static credentials with short-lived Vault tokens",
          ],
          labTask: "Configure an automated DevSecOps gate that blocks vulnerable images and rotates DB secrets.",
          resourceNote: "Trivy Policy Bundle + Vault Dev Lab",
        },
        {
          id: "mod-cs-3",
          order: 3,
          weekLabel: "Weeks 7–9",
          title: "Continuous Compliance & Policy-as-Code",
          summary: "Codify security baselines and audit telemetry using continuous configuration evaluation.",
          durationHours: 9,
          objectives: [
            "Map regulatory controls to automated configuration rules",
            "Generate audit-ready compliance evidence packs",
          ],
          labTask: "Author automated drift rules detecting unencrypted storage and public endpoints.",
          resourceNote: "Compliance Control Mapping Matrix",
        },
        {
          id: "mod-cs-4",
          order: 4,
          weekLabel: "Weeks 10–12",
          title: "Threat Detection & Incident Response Runbooks",
          summary: "Investigate live cloud breach simulations using CloudTrail logs, GuardDuty findings, and containment playbooks.",
          durationHours: 9,
          objectives: [
            "Trace lateral movement across API audit logs",
            "Execute rapid containment and forensic preservation",
          ],
          labTask: "Complete a simulated credential compromise investigation and present your incident report.",
          resourceNote: "Incident Response Runbook Pack",
        },
      ],
    },
    {
      id: "course-python-etl",
      slug: "python-data-engineering",
      title: "Enterprise Python, ETL & Analytics Automation",
      subtitle: "Build resilient API extractors, PostgreSQL warehouses, and scheduled transformation pipelines",
      category: "Data & Automation",
      deliveryMode: "Self-Paced",
      level: "Intermediate",
      durationWeeks: 8,
      sessionCount: 24,
      tuitionUsd: 850,
      heroImage: "/academy/prog-python-etl.jpg",
      tools: ["Python", "PostgreSQL", "dbt", "FastAPI", "Pandas", "Docker"],
      roles: ["Data Engineer", "Analytics Automation Engineer", "Backend Data Specialist"],
      description:
        "Self-paced practitioner track with weekly mentor office hours focused on production Python ingestion scripts, relational modeling, dbt transformations, and automated data validation.",
      featured: false,
      status: "active",
      createdAt: "2026-09-25T09:00:00Z",
      modules: [
        {
          id: "mod-pe-1",
          order: 1,
          weekLabel: "Weeks 1–2",
          title: "Modular Python Engineering & Type-Safe Ingestion",
          summary: "Structure maintainable ingestion packages with Pydantic validation, retries, and structured logging.",
          durationHours: 8,
          objectives: [
            "Build resilient REST API paginators with rate-limit handling",
            "Validate incoming schemas prior to warehouse loading",
          ],
          labTask: "Write a paginated API extractor storing validated records into PostgreSQL.",
          resourceNote: "Python ETL Starter Template",
        },
        {
          id: "mod-pe-2",
          order: 2,
          weekLabel: "Weeks 3–5",
          title: "Dimensional Modeling & dbt Transformations",
          summary: "Transform raw staging schemas into tested fact and dimension models ready for BI tools.",
          durationHours: 10,
          objectives: [
            "Design incremental dbt models with uniqueness and referential tests",
            "Document lineage across staging and mart layers",
          ],
          labTask: "Deliver a tested 3-layer dbt warehouse project with automated schema tests.",
          resourceNote: "Warehouse Modeling Guide",
        },
        {
          id: "mod-pe-3",
          order: 3,
          weekLabel: "Weeks 6–8",
          title: "Pipeline Containerization & Scheduled Delivery",
          summary: "Containerize your data pipelines and ship automated quality alerts to team channels.",
          durationHours: 8,
          objectives: [
            "Package Python + dbt workflows inside deterministic Docker containers",
            "Automate nightly execution and failure notifications",
          ],
          labTask: "Publish your containerized ETL pipeline repository and automated run report.",
          resourceNote: "Deployment & Monitoring Checklist",
        },
      ],
    },
    {
      id: "course-exec-literacy",
      slug: "executive-data-literacy",
      title: "Executive Data Literacy & Automated BI Bootcamp",
      subtitle: "Equip department leaders and analysts to replace manual reporting with governed KPI systems",
      category: "Data & BI",
      deliveryMode: "Corporate Bootcamp",
      level: "Beginner",
      durationWeeks: 4,
      sessionCount: 12,
      tuitionUsd: 600,
      heroImage: "/academy/prog-exec-bi.jpg",
      tools: ["Power BI", "Excel Power Query", "SQL Basics", "KPI Governance"],
      roles: ["Department Lead", "Finance Manager", "Operations Director", "Business Analyst"],
      description:
        "High-impact 4-week corporate acceleration track tailored for finance, operations, and leadership teams transitioning from manual spreadsheet reconciliation to unified BI decision rooms.",
      featured: false,
      status: "active",
      createdAt: "2026-10-18T09:00:00Z",
      modules: [
        {
          id: "mod-ex-1",
          order: 1,
          weekLabel: "Weeks 1–2",
          title: "KPI Architecture & Data Governance Alignment",
          summary: "Standardize metric definitions across departments and eliminate conflicting spreadsheet numbers.",
          durationHours: 6,
          objectives: [
            "Define single-source-of-truth metric dictionaries",
            "Eliminate manual spreadsheet consolidation errors",
          ],
          labTask: "Audit and unify one departmental monthly performance pack.",
          resourceNote: "Enterprise KPI Dictionary Template",
        },
        {
          id: "mod-ex-2",
          order: 2,
          weekLabel: "Weeks 3–4",
          title: "Self-Service Executive Dashboards in Power BI",
          summary: "Connect live reporting sources into clean executive scorecards with automated refresh schedules.",
          durationHours: 6,
          objectives: [
            "Build drill-through executive revenue and operational views",
            "Interpret variance and forecasting visuals accurately",
          ],
          labTask: "Present an executive decision dashboard built from live departmental data.",
          resourceNote: "Executive BI Scorecard Kit",
        },
      ],
    },
    {
      id: "course-k8s-sre",
      slug: "kubernetes-sre-foundations",
      title: "Kubernetes & Production SRE Foundations",
      subtitle: "Hands-on cluster operations, SLO telemetry, and zero-downtime incident recovery",
      category: "Cloud & DevOps",
      deliveryMode: "Corporate Bootcamp",
      level: "Advanced",
      durationWeeks: 6,
      sessionCount: 18,
      tuitionUsd: 750,
      heroImage: "/academy/prog-k8s-sre.jpg",
      tools: ["Kubernetes", "Helm", "Prometheus", "Grafana", "OpenTelemetry"],
      roles: ["Site Reliability Engineer", "Platform Engineer", "Senior Infrastructure Lead"],
      description:
        "Intensive 6-week operational residency for engineering squads running containerized production workloads and formalizing SLO/SLI reliability standards.",
      featured: false,
      status: "active",
      createdAt: "2026-11-05T09:00:00Z",
      modules: [
        {
          id: "mod-k8-1",
          order: 1,
          weekLabel: "Weeks 1–3",
          title: "Cluster Scheduling, Networking & Fault Isolation",
          summary: "Master pod disruption budgets, network policies, node affinity, and ingress resilience.",
          durationHours: 9,
          objectives: [
            "Enforce zero-trust pod-to-pod network policies",
            "Prevent cascading node exhaustion with resource quotas",
          ],
          labTask: "Harden a multi-namespace production cluster against simulated node loss.",
          resourceNote: "SRE Cluster Hardening Playbook",
        },
        {
          id: "mod-k8-2",
          order: 2,
          weekLabel: "Weeks 4–6",
          title: "SLO Engineering, Alert Hygiene & Resilience Drills",
          summary: "Define actionable error budgets and diagnose broken deployments under realistic latency spikes.",
          durationHours: 9,
          objectives: [
            "Design Prometheus burn-rate alerts reducing on-call noise",
            "Execute blameless postmortems and rapid rollbacks",
          ],
          labTask: "Resolve three live broken-cluster scenarios during the final SRE tabletop simulation.",
          resourceNote: "SLO Calculator & Incident Runbooks",
        },
      ],
    },
  ];

  const cohorts: Cohort[] = [
    {
      id: "cohort-da-nov26",
      courseId: "course-data-bi",
      code: "DA-2026-Q4",
      startDateText: SITE_CONFIG.PROGRAMME.START_DATE_TEXT,
      startDateIso: SITE_CONFIG.PROGRAMME.START_DATE_ISO,
      schedule: "3 guided sessions per week, 1 hour each (36 total)",
      format: "Instructor-Led Online · Academy Sandbox",
      seatCapacity: 30,
      seatsTaken: 30,
      status: "full",
    },
    {
      id: "cohort-da-jan27",
      courseId: "course-data-bi",
      code: "DA-2027-Q1",
      startDateText: "January 18, 2027",
      startDateIso: "2027-01-18T00:00:00Z",
      schedule: "3 guided sessions per week, 1 hour each (36 total)",
      format: "Instructor-Led Online · Academy Sandbox",
      seatCapacity: 30,
      seatsTaken: 6,
      status: "open",
    },
    {
      id: "cohort-cd-dec26",
      courseId: "course-cloud-devops",
      code: "CD-2026-Q4",
      startDateText: "December 1, 2026",
      startDateIso: "2026-12-01T00:00:00Z",
      schedule: "Tue & Thu evenings + Sat Lab (36 sessions)",
      format: "Instructor-Led Online + AWS/Azure Sandboxes",
      seatCapacity: 24,
      seatsTaken: 14,
      status: "open",
    },
    {
      id: "cohort-cs-dec26",
      courseId: "course-cybersecurity",
      code: "CS-2026-Q4",
      startDateText: "December 8, 2026",
      startDateIso: "2026-12-08T00:00:00Z",
      schedule: "Mon & Wed evenings + Sat Threat Lab (36 sessions)",
      format: "Instructor-Led Online + Threat Labs",
      seatCapacity: 24,
      seatsTaken: 11,
      status: "open",
    },
    {
      id: "cohort-pe-rolling",
      courseId: "course-python-etl",
      code: "PE-FLEX-01",
      startDateText: "Rolling Enrollment (Immediate Access)",
      startDateIso: "2026-11-15T00:00:00Z",
      schedule: "Self-paced modules + Friday Architect Office Hours",
      format: "On-Demand Portal + Weekly Mentor Q&A",
      seatCapacity: 50,
      seatsTaken: 18,
      status: "open",
    },
    {
      id: "cohort-da-oct26",
      courseId: "course-data-bi",
      code: "DA-2026-Q3",
      startDateText: "October 12, 2026",
      startDateIso: "2026-10-12T00:00:00Z",
      schedule: "3 guided sessions per week, 1 hour each (36 total)",
      format: "Instructor-Led Online · Academy Sandbox",
      seatCapacity: 30,
      seatsTaken: 30,
      status: "completed",
    },
    {
      id: "cohort-ex-nov26",
      courseId: "course-exec-literacy",
      code: "EX-2026-Q4",
      startDateText: "November 24, 2026",
      startDateIso: "2026-11-24T00:00:00Z",
      schedule: "Tue & Thu Executive Workshops (12 sessions)",
      format: "Executive Corporate Cohort",
      seatCapacity: 20,
      seatsTaken: 11,
      status: "open",
    },
    {
      id: "cohort-k8-dec26",
      courseId: "course-k8s-sre",
      code: "K8-2026-Q4",
      startDateText: "December 14, 2026",
      startDateIso: "2026-12-14T00:00:00Z",
      schedule: "Mon, Wed & Sat Cluster Labs (18 sessions)",
      format: "Corporate Sandbox Residency",
      seatCapacity: 15,
      seatsTaken: 8,
      status: "open",
    },
  ];

  const orgId = "org-meridian-01";
  const organizations: Organization[] = [
    {
      id: orgId,
      reference: "ETS-CORP-MRD812",
      name: "Meridian Financial Group",
      billingEmail: "ld-finance@meridian-demo.com",
      contactName: "David Osei-Bonsu",
      phone: "+233 53 353 4687",
      region: "Ghana / UK",
      seatQuota: 15,
      seatsUsed: 4,
      billingStatus: "paid",
      createdAt: "2026-10-12T09:30:00Z",
    },
  ];

  const users: AcademyUser[] = [
    {
      id: "user-learner-demo",
      email: "learner@elitestech-demo.com",
      fullName: "Akua Mensah",
      role: "learner",
      country: "Ghana",
      createdAt: "2026-10-15T10:00:00Z",
    },
    {
      id: "user-corp-demo",
      email: "manager@meridian-demo.com",
      fullName: "David Osei-Bonsu",
      role: "org_admin",
      country: "United Kingdom",
      organizationId: orgId,
      createdAt: "2026-10-12T09:30:00Z",
    },
  ];

  const quotes: CorporateQuote[] = [
    {
      id: "quote-meridian-01",
      reference: "ETS-QT-44109",
      organizationId: orgId,
      organizationName: "Meridian Financial Group",
      contactName: "David Osei-Bonsu",
      contactEmail: "manager@meridian-demo.com",
      region: "Ghana",
      courseId: "course-data-bi",
      courseTitle: "Data Analysis & Business Intelligence Engineering",
      seatCount: 15,
      currency: "USD",
      unitPriceUsd: 1000,
      discountPercent: 15,
      totalUsd: 12750,
      totalLocalFormatted: "$12,750",
      billingTerms: "Net-30 Purchase Order",
      status: "paid",
      notes: "Q4 Analytics & Finance Operations departmental upskilling cohort.",
      createdAt: "2026-10-12T09:30:00Z",
    },
  ];

  const enrollments: Enrollment[] = [
    {
      id: "enr-demo-learner-1",
      reference: "ETS-ACAD-882410",
      userId: "user-learner-demo",
      learnerName: "Akua Mensah",
      learnerEmail: "learner@elitestech-demo.com",
      learnerPhone: "+233 54 118 9021",
      country: "Ghana",
      courseId: "course-data-bi",
      cohortId: "cohort-da-nov26",
      paymentPlan: "installment_2",
      currency: "GHS",
      totalUsd: 1000,
      amountPaidUsd: 500,
      paymentStatus: "deposit_paid",
      status: "active",
      completedModuleIds: ["mod-da-1", "mod-da-2", "mod-da-3"],
      moduleScores: { "mod-da-1": 94, "mod-da-2": 91, "mod-da-3": 88 },
      capstoneUrl: "",
      capstoneNotes: "",
      lastActiveAt: "2026-11-13T16:40:00Z",
      createdAt: "2026-10-18T11:20:00Z",
    },
    {
      id: "enr-demo-learner-2",
      reference: "ETS-ACAD-771029",
      userId: "user-learner-demo",
      learnerName: "Akua Mensah",
      learnerEmail: "learner@elitestech-demo.com",
      learnerPhone: "+233 54 118 9021",
      country: "Ghana",
      courseId: "course-python-etl",
      cohortId: "cohort-pe-rolling",
      paymentPlan: "full",
      currency: "USD",
      totalUsd: 850,
      amountPaidUsd: 850,
      paymentStatus: "paid_in_full",
      status: "completed",
      completedModuleIds: ["mod-pe-1", "mod-pe-2", "mod-pe-3"],
      moduleScores: { "mod-pe-1": 96, "mod-pe-2": 92, "mod-pe-3": 95 },
      capstoneUrl: "https://github.com/akua-mensah-analytics/etl-dbt-warehouse",
      capstoneNotes: "Delivered incremental dbt warehouse with PostgreSQL validation suite.",
      certificateCode: "ETS-CERT-9482AX",
      lastActiveAt: "2026-11-10T14:15:00Z",
      createdAt: "2026-09-02T09:00:00Z",
    },
    {
      id: "enr-corp-1",
      reference: "ETS-ACAD-501921",
      userId: "user-corp-emp-1",
      learnerName: "Kwame Boateng",
      learnerEmail: "k.boateng@meridian-demo.com",
      learnerPhone: "+233 24 881 2201",
      country: "Ghana",
      courseId: "course-data-bi",
      cohortId: "cohort-da-nov26",
      organizationId: orgId,
      paymentPlan: "corporate_seat",
      currency: "USD",
      totalUsd: 850,
      amountPaidUsd: 850,
      paymentStatus: "corporate_sponsored",
      status: "active",
      completedModuleIds: ["mod-da-1", "mod-da-2", "mod-da-3", "mod-da-4"],
      moduleScores: { "mod-da-1": 90, "mod-da-2": 87, "mod-da-3": 92, "mod-da-4": 89 },
      capstoneUrl: "",
      capstoneNotes: "",
      lastActiveAt: "2026-11-13T18:10:00Z",
      createdAt: "2026-10-14T08:45:00Z",
    },
    {
      id: "enr-corp-2",
      reference: "ETS-ACAD-501922",
      userId: "user-corp-emp-2",
      learnerName: "Hannah Whitmore",
      learnerEmail: "h.whitmore@meridian-demo.com",
      learnerPhone: "+44 7700 900412",
      country: "United Kingdom",
      courseId: "course-data-bi",
      cohortId: "cohort-da-nov26",
      organizationId: orgId,
      paymentPlan: "corporate_seat",
      currency: "USD",
      totalUsd: 850,
      amountPaidUsd: 850,
      paymentStatus: "corporate_sponsored",
      status: "active",
      completedModuleIds: ["mod-da-1", "mod-da-2"],
      moduleScores: { "mod-da-1": 85, "mod-da-2": 89 },
      capstoneUrl: "",
      capstoneNotes: "",
      lastActiveAt: "2026-11-12T15:20:00Z",
      createdAt: "2026-10-14T08:50:00Z",
    },
    {
      id: "enr-corp-3",
      reference: "ETS-ACAD-501923",
      userId: "user-corp-emp-3",
      learnerName: "Samuel Adjei",
      learnerEmail: "s.adjei@meridian-demo.com",
      learnerPhone: "+233 20 912 4401",
      country: "Ghana",
      courseId: "course-cloud-devops",
      cohortId: "cohort-cd-dec26",
      organizationId: orgId,
      paymentPlan: "corporate_seat",
      currency: "USD",
      totalUsd: 1063,
      amountPaidUsd: 1063,
      paymentStatus: "corporate_sponsored",
      status: "active",
      completedModuleIds: ["mod-cd-1"],
      moduleScores: { "mod-cd-1": 91 },
      capstoneUrl: "",
      capstoneNotes: "",
      lastActiveAt: "2026-11-11T12:00:00Z",
      createdAt: "2026-10-16T10:15:00Z",
    },
    {
      id: "enr-corp-4",
      reference: "ETS-ACAD-501924",
      userId: "user-corp-emp-4",
      learnerName: "Priya Nair",
      learnerEmail: "p.nair@meridian-demo.com",
      learnerPhone: "+1 609 555 0148",
      country: "United States",
      courseId: "course-data-bi",
      cohortId: "cohort-da-nov26",
      organizationId: orgId,
      paymentPlan: "corporate_seat",
      currency: "USD",
      totalUsd: 850,
      amountPaidUsd: 850,
      paymentStatus: "corporate_sponsored",
      status: "completed",
      completedModuleIds: ["mod-da-1", "mod-da-2", "mod-da-3", "mod-da-4", "mod-da-5", "mod-da-6"],
      moduleScores: {
        "mod-da-1": 95,
        "mod-da-2": 93,
        "mod-da-3": 90,
        "mod-da-4": 94,
        "mod-da-5": 96,
        "mod-da-6": 98,
      },
      capstoneUrl: "https://github.com/meridian-analytics/treasury-bi-capstone",
      capstoneNotes: "Executive Treasury Power BI dashboard approved by lead architect.",
      certificateCode: "ETS-CERT-7120MK",
      lastActiveAt: "2026-11-09T17:30:00Z",
      createdAt: "2026-10-14T09:00:00Z",
    },
  ];

  const payments: TuitionPayment[] = [
    {
      id: "pay-1",
      reference: "ETS-PAY-1001",
      enrollmentId: "enr-demo-learner-1",
      payerName: "Akua Mensah",
      payerEmail: "learner@elitestech-demo.com",
      description: "Data Analysis & Business Intelligence Engineering · Installment 1 of 2",
      installmentNumber: 1,
      currency: "GHS",
      amountUsd: 500,
      amountLocalFormatted: formatCurrencyAmount(500, "GHS"),
      channel: "Mobile Money (MoMo)",
      status: "verified",
      verifiedBy: "director@elitestechsolutions.com",
      verifiedAt: "2026-10-18T12:00:00Z",
      createdAt: "2026-10-18T11:20:00Z",
    },
    {
      id: "pay-2",
      reference: "ETS-PAY-1002",
      enrollmentId: "enr-demo-learner-1",
      payerName: "Akua Mensah",
      payerEmail: "learner@elitestech-demo.com",
      description: "Data Analysis & Business Intelligence Engineering · Installment 2 of 2",
      installmentNumber: 2,
      currency: "GHS",
      amountUsd: 500,
      amountLocalFormatted: formatCurrencyAmount(500, "GHS"),
      channel: "Mobile Money (MoMo)",
      status: "pending",
      createdAt: "2026-10-18T11:20:00Z",
    },
    {
      id: "pay-3",
      reference: "ETS-PAY-1003",
      enrollmentId: "enr-demo-learner-2",
      payerName: "Akua Mensah",
      payerEmail: "learner@elitestech-demo.com",
      description: "Enterprise Python, ETL & Analytics Automation · Full Tuition",
      installmentNumber: 1,
      currency: "USD",
      amountUsd: 850,
      amountLocalFormatted: "$850",
      channel: "Bank Transfer",
      status: "verified",
      verifiedBy: "director@elitestechsolutions.com",
      verifiedAt: "2026-09-02T11:00:00Z",
      createdAt: "2026-09-02T09:00:00Z",
    },
    {
      id: "pay-4",
      reference: "ETS-PAY-1004",
      organizationId: orgId,
      quoteId: "quote-meridian-01",
      payerName: "Meridian Financial Group",
      payerEmail: "ld-finance@meridian-demo.com",
      description: "Corporate 15-Seat Pack · Net-30 PO Settlement",
      installmentNumber: 1,
      currency: "USD",
      amountUsd: 12750,
      amountLocalFormatted: "$12,750",
      channel: "Net-30 Corporate PO",
      status: "verified",
      verifiedBy: "director@elitestechsolutions.com",
      verifiedAt: "2026-10-13T10:00:00Z",
      createdAt: "2026-10-12T09:30:00Z",
    },
  ];

  const certificates: Certificate[] = [
    {
      code: "ETS-CERT-9482AX",
      enrollmentId: "enr-demo-learner-2",
      learnerName: "Akua Mensah",
      learnerEmail: "learner@elitestech-demo.com",
      courseTitle: "Enterprise Python, ETL & Analytics Automation",
      category: "Data & Automation",
      durationWeeks: 8,
      issuedAt: "2026-11-10T14:30:00Z",
      instructorName: "Principal Solutions Architecture Board",
    },
    {
      code: "ETS-CERT-7120MK",
      enrollmentId: "enr-corp-4",
      learnerName: "Priya Nair",
      learnerEmail: "p.nair@meridian-demo.com",
      courseTitle: "Data Analysis & Business Intelligence Engineering",
      category: "Data & BI",
      durationWeeks: 12,
      issuedAt: "2026-11-09T17:45:00Z",
      instructorName: "Principal Solutions Architecture Board",
    },
  ];

  return {
    courses,
    cohorts,
    users,
    organizations,
    quotes,
    enrollments,
    payments,
    certificates,
    passwordResets: [],
  };
}

const globalForAcademy = globalThis as unknown as {
  __etsAcademyStore?: AcademyStoreState;
};

export function getAcademyStore(): AcademyStoreState {
  if (!globalForAcademy.__etsAcademyStore) {
    globalForAcademy.__etsAcademyStore = createSeedState();
  }
  if (!globalForAcademy.__etsAcademyStore.passwordResets) {
    globalForAcademy.__etsAcademyStore.passwordResets = [];
  }
  return globalForAcademy.__etsAcademyStore;
}

export function createNewReference(prefix: string): string {
  return generateSecureReference(prefix);
}

export function createPasswordResetRequest(email: string): PasswordResetRequest {
  const store = getAcademyStore();
  const normalizedEmail = email.trim().toLowerCase();
  const user = store.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  // Generate secure token with random bytes
  const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
  const token = `RESET-${randomSuffix}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour

  const resetReq: PasswordResetRequest = {
    id: `reset-${Date.now()}-${randomSuffix}`,
    token,
    email: normalizedEmail,
    userId: user?.id,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    used: false,
  };

  store.passwordResets.unshift(resetReq);
  return resetReq;
}

export function consumePasswordReset(token: string, newPassword: string): { success: boolean; error?: string; user?: AcademyUser } {
  const store = getAcademyStore();
  const normalizedToken = token.trim();
  const resetReq = store.passwordResets.find((r) => r.token.toUpperCase() === normalizedToken.toUpperCase());

  if (!resetReq) {
    return { success: false, error: "Invalid or unrecognized password reset token." };
  }

  if (resetReq.used) {
    return { success: false, error: "This password reset token has already been used." };
  }

  const now = new Date();
  if (new Date(resetReq.expiresAt) < now) {
    return { success: false, error: "This password reset token has expired. Please request a new recovery link." };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters in length." };
  }

  resetReq.used = true;
  resetReq.usedAt = now.toISOString();

  let user = store.users.find((u) => u.email.toLowerCase() === resetReq.email.toLowerCase());
  if (user) {
    user.password = newPassword;
    user.lastPasswordResetAt = now.toISOString();
  } else {
    // If user was not yet registered in users table, provision user
    const resolvedName = resetReq.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    user = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      email: resetReq.email,
      fullName: resolvedName,
      role: "learner",
      country: "Ghana",
      password: newPassword,
      lastPasswordResetAt: now.toISOString(),
      createdAt: now.toISOString(),
    };
    store.users.push(user);
  }

  return { success: true, user };
}
