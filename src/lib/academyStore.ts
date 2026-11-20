import { SITE_CONFIG } from "./config";
import { generateSecureReference } from "./security";

export type AcademyCategory =
  | "Data & BI"
  | "Cloud & DevOps"
  | "Cybersecurity"
  | "Data & Automation";

export type DeliveryMode = "Instructor-Led" | "Self-Paced" | "Corporate Bootcamp";
export type CourseAudience = "individual" | "business" | "both";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type CurrencyCode = "USD" | "GHS" | "GBP";
export type UserRole = "learner" | "org_admin" | "staff_admin";

export function isIndividualCourse(course: Pick<Course, "audience" | "deliveryMode">): boolean {
  return course.audience === "individual" || course.audience === "both";
}

export function isBusinessCourse(course: Pick<Course, "audience" | "deliveryMode">): boolean {
  return course.audience === "business" || course.audience === "both";
}

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
  audience: CourseAudience;
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

export interface AcademyLead {
  id: string;
  reference: string;
  type: "syllabus_download" | "corporate_consultation";
  fullName: string;
  email: string;
  phone: string;
  organizationName?: string;
  teamSize?: string;
  courseId?: string;
  courseTitle?: string;
  experienceLevel?: string;
  objective?: string;
  notes?: string;
  requestAdvisorCall?: boolean;
  createdAt: string;
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
  leads: AcademyLead[];
}

export function formatCurrencyAmount(amountUsd: number, currency: CurrencyCode): string {
  const cfg = SITE_CONFIG.PAYMENT.CURRENCIES[currency] || SITE_CONFIG.PAYMENT.CURRENCIES.USD;
  const converted = Math.round(amountUsd * cfg.RATE);
  return `${cfg.SYMBOL}${converted.toLocaleString("en-US")}`;
}

export function getCorporateDiscountPercent(_seats: number): number {
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
      audience: "both",
      level: "Beginner",
      durationWeeks: 12,
      sessionCount: 36,
      tuitionUsd: 3000,
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
      audience: "both",
      level: "Intermediate",
      durationWeeks: 12,
      sessionCount: 36,
      tuitionUsd: 3000,
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
      audience: "both",
      level: "Intermediate",
      durationWeeks: 12,
      sessionCount: 36,
      tuitionUsd: 3000,
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
      title: "Python Programming, ETL & Data Automation",
      subtitle: "Build resilient API extractors, PostgreSQL warehouses, and scheduled transformation pipelines",
      category: "Data & Automation",
      deliveryMode: "Self-Paced",
      audience: "both",
      level: "Intermediate",
      durationWeeks: 8,
      sessionCount: 24,
      tuitionUsd: 3000,
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
      audience: "business",
      level: "Beginner",
      durationWeeks: 4,
      sessionCount: 12,
      tuitionUsd: 3000,
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
      audience: "business",
      level: "Advanced",
      durationWeeks: 6,
      sessionCount: 18,
      tuitionUsd: 3000,
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
    {
      id: "course-it-foundations",
      slug: "it-support-networking-linux",
      title: "IT Support, Networking & Linux Systems Foundations",
      subtitle: "Go from zero technical background to troubleshooting networks, Linux servers, and enterprise help-desk tickets",
      category: "Cloud & DevOps",
      deliveryMode: "Instructor-Led",
      audience: "individual",
      level: "Beginner",
      durationWeeks: 8,
      sessionCount: 24,
      tuitionUsd: 3000,
      heroImage: "/academy/blog-iac-platform.jpg",
      tools: ["Linux CLI", "TCP/IP & DNS", "Windows Admin", "Bash Scripting", "Git", "CompTIA A+ / Net+"],
      roles: ["IT Support Specialist", "Help Desk Analyst", "Junior Systems Administrator", "Network Technician"],
      description:
        "Built for career switchers and aspiring IT professionals. Master hardware/OS fundamentals, IP subnetting, DNS/HTTP diagnostics, Linux shell administration, and ticketing workflows that prepare you for entry-level IT roles and CompTIA A+/Network+ exams.",
      featured: true,
      status: "active",
      createdAt: "2026-10-02T09:00:00Z",
      modules: [
        {
          id: "mod-it-1",
          order: 1,
          weekLabel: "Weeks 1 to 2",
          title: "Operating Systems, Hardware Diagnostics & Help-Desk Triage",
          summary: "Understand CPU/memory/storage diagnostics, Windows & macOS administration, and structured ITIL incident triage.",
          durationHours: 6,
          objectives: [
            "Diagnose workstation boot, storage, and driver failures methodically",
            "Manage user accounts, permissions, and group policies across endpoints",
          ],
          labTask: "Document and resolve 10 realistic Tier-1/Tier-2 help-desk tickets with root-cause notes.",
          resourceNote: "Endpoint Troubleshooting Handbook + Virtual Lab Guide",
        },
        {
          id: "mod-it-2",
          order: 2,
          weekLabel: "Weeks 3 to 4",
          title: "TCP/IP Networking, Subnetting, DNS & Firewall Basics",
          summary: "Trace packet flow across LANs, routers, DHCP, DNS records, VPNs, and firewall rules.",
          durationHours: 6,
          objectives: [
            "Calculate CIDR subnets and diagnose routing, DNS, and TLS errors",
            "Use ping, traceroute, dig, nslookup, and curl for live network diagnostics",
          ],
          labTask: "Configure a segmented office network topology and debug broken DNS and firewall rules.",
          resourceNote: "Networking Diagnostics Cheat Sheet + Lab Topology",
        },
        {
          id: "mod-it-3",
          order: 3,
          weekLabel: "Weeks 5 to 6",
          title: "Linux Command Line, Permissions & Bash Automation",
          summary: "Operate Ubuntu Linux servers over SSH, manage systemd services, inspect logs, and automate repetitive tasks.",
          durationHours: 6,
          objectives: [
            "Manage Linux file permissions, processes, cron jobs, and SSH keys",
            "Write repeatable Bash scripts for log rotation and server health checks",
          ],
          labTask: "Harden a fresh Ubuntu server over SSH and deploy an automated disk/service monitor script.",
          resourceNote: "Linux SysAdmin Playbook + Bash Exercises",
        },
        {
          id: "mod-it-4",
          order: 4,
          weekLabel: "Weeks 7 to 8",
          title: "Cloud Readiness, Git Workflows & Career Capstone",
          summary: "Connect on-premises IT concepts to cloud virtual machines, Git version control, and technical interview labs.",
          durationHours: 6,
          objectives: [
            "Provision a Linux web server in the cloud with SSH key authentication",
            "Track runbooks and scripts cleanly in GitHub for your hiring portfolio",
          ],
          labTask: "Publish your IT Systems Runbook repository and pass a timed live troubleshooting assessment.",
          resourceNote: "CompTIA A+ / Network+ Readiness Checklist + Portfolio Guide",
        },
      ],
    },
    {
      id: "course-ai-productivity",
      slug: "applied-ai-workflow-automation",
      title: "Applied AI, Prompt Engineering & Workflow Automation",
      subtitle: "Use modern AI assistants, structured prompts, and lightweight Python scripts to automate daily work",
      category: "Data & Automation",
      deliveryMode: "Self-Paced",
      audience: "both",
      level: "Beginner",
      durationWeeks: 6,
      sessionCount: 18,
      tuitionUsd: 3000,
      heroImage: "/academy/blog-bi-modeling.jpg",
      tools: ["Prompt Engineering", "Python Automation", "REST APIs", "RAG Basics", "Excel & Docs AI", "GitHub Copilot"],
      roles: ["AI Productivity Specialist", "Operations Analyst", "Junior Automation Developer", "Business Systems Analyst"],
      description:
        "Practical, beginner-accessible course showing working professionals and aspiring technologists how to build reliable prompt systems, summarize structured documents, connect AI APIs with Python, and automate repetitive workflows safely.",
      featured: true,
      status: "active",
      createdAt: "2026-10-12T09:00:00Z",
      modules: [
        {
          id: "mod-ai-1",
          order: 1,
          weekLabel: "Weeks 1 to 2",
          title: "Structured Prompt Engineering & Verification Frameworks",
          summary: "Replace ad-hoc prompts with repeatable templates, output schemas, and hallucination checks.",
          durationHours: 6,
          objectives: [
            "Design system instructions, few-shot templates, and structured JSON outputs",
            "Audit AI outputs for factual grounding, privacy hygiene, and edge cases",
          ],
          labTask: "Build a reusable 10-template prompt playbook for reporting, research, and technical docs.",
          resourceNote: "Prompt Engineering Pattern Library",
        },
        {
          id: "mod-ai-2",
          order: 2,
          weekLabel: "Weeks 3 to 4",
          title: "No-Code & Python API Workflow Automation",
          summary: "Connect spreadsheets, email digests, and structured CSV exports to modern LLM APIs with Python.",
          durationHours: 6,
          objectives: [
            "Call REST AI APIs safely with rate limits, retries, and environment variables",
            "Automate meeting notes, ticket triage, and structured table extraction",
          ],
          labTask: "Ship a Python CLI script that classifies incoming support CSV records into structured reports.",
          resourceNote: "Starter Python API Repo + Sample Datasets",
        },
        {
          id: "mod-ai-3",
          order: 3,
          weekLabel: "Weeks 5 to 6",
          title: "Document Retrieval (RAG) Basics & Portfolio Capstone",
          summary: "Ground AI assistants in your own PDFs and knowledge bases using chunking and citation checks.",
          durationHours: 6,
          objectives: [
            "Build a cited Q&A assistant over policy or technical documentation",
            "Evaluate retrieval accuracy and package a shareable capstone demo",
          ],
          labTask: "Deliver an end-to-end grounded document workflow with evaluation checklist and GitHub README.",
          resourceNote: "RAG Architecture Starter Kit + Capstone Rubric",
        },
      ],
    },
    {
      id: "course-soc-analyst",
      slug: "soc-analyst-siem-incident-response",
      title: "SOC Analyst, SIEM Monitoring & Incident Response",
      subtitle: "Launch a cybersecurity career with log analysis, SIEM triage, Wireshark packet inspection, and threat playbooks",
      category: "Cybersecurity",
      deliveryMode: "Instructor-Led",
      audience: "individual",
      level: "Beginner",
      durationWeeks: 10,
      sessionCount: 30,
      tuitionUsd: 3000,
      heroImage: "/academy/blog-devsecops.jpg",
      tools: ["SIEM / Splunk", "Wireshark", "Linux Logs", "MITRE ATT&CK", "Phishing Triage", "Incident Playbooks"],
      roles: ["Junior SOC Analyst", "Security Operations Technician", "Threat Triage Analyst", "IT Security Specialist"],
      description:
        "A practical entry-level cybersecurity career track teaching network packet inspection, SIEM alert triage, phishing investigation, MITRE ATT&CK mapping, and structured incident containment from scratch.",
      featured: true,
      status: "active",
      createdAt: "2026-11-18T09:00:00Z",
      modules: [
        {
          id: "mod-soc-1",
          order: 1,
          weekLabel: "Weeks 1 to 2",
          title: "Security Foundations, Threat Landscapes & MITRE ATT&CK",
          summary: "Understand adversary kill chains, common attack vectors, CIA triad trade-offs, and SOC tier escalation workflows.",
          durationHours: 6,
          objectives: [
            "Map real intrusion scenarios to MITRE ATT&CK tactics and techniques",
            "Analyze authentication, endpoint, and perimeter firewall telemetry",
          ],
          labTask: "Classify 12 realistic SOC alerts by severity, MITRE tactic, and escalation runbook.",
          resourceNote: "SOC Analyst Triage Guide + MITRE ATT&CK Lab Workbook",
        },
        {
          id: "mod-soc-2",
          order: 2,
          weekLabel: "Weeks 3 to 5",
          title: "Network Traffic Inspection With Wireshark & DNS Forensics",
          summary: "Inspect TCP handshakes, HTTP/TLS anomalies, suspicious DNS beacons, and lateral movement inside packet captures.",
          durationHours: 8,
          objectives: [
            "Filter malicious traffic streams using Wireshark display expressions",
            "Extract indicators of compromise from PCAP forensic traces",
          ],
          labTask: "Investigate a simulated malware beacon PCAP and author a structured IOC brief.",
          resourceNote: "Curated PCAP Evidence Pack + Wireshark Filter Reference",
        },
        {
          id: "mod-soc-3",
          order: 3,
          weekLabel: "Weeks 6 to 8",
          title: "SIEM Querying, Log Correlation & Phishing Investigation",
          summary: "Write detection queries across Linux auth logs, Windows event IDs, and email headers to spot credential compromise.",
          durationHours: 8,
          objectives: [
            "Build SIEM correlation queries detecting brute-force and impossible-travel logins",
            "Audit SPF/DKIM/DMARC headers and safely detonate suspicious links in sandboxes",
          ],
          labTask: "Author three SIEM detection rules and complete a phishing header forensic dossier.",
          resourceNote: "SIEM Query Lab Environment + Email Header Analysis Kit",
        },
        {
          id: "mod-soc-4",
          order: 4,
          weekLabel: "Weeks 9 to 10",
          title: "Incident Containment Playbooks & SOC Portfolio Capstone",
          summary: "Execute end-to-end containment, host isolation, timeline reconstruction, and executive post-incident reporting.",
          durationHours: 6,
          objectives: [
            "Lead a simulated breach triage timeline from initial alert to closure",
            "Present a portfolio-ready incident response report for hiring managers",
          ],
          labTask: "Deliver a full SOC incident investigation report with containment timeline and remediation plan.",
          resourceNote: "Tabletop Incident Simulation + Capstone Assessment Rubric",
        },
      ],
    },
    {
      id: "course-sql-warehouse",
      slug: "sql-analytics-engineering-dbt",
      title: "SQL Analytics Engineering & Cloud Data Warehousing",
      subtitle: "Design dimensional star schemas, tested dbt Core transformation layers, and cloud warehouse marts",
      category: "Data & BI",
      deliveryMode: "Self-Paced",
      audience: "both",
      level: "Intermediate",
      durationWeeks: 8,
      sessionCount: 24,
      tuitionUsd: 3000,
      heroImage: "/academy/track-data.jpg",
      tools: ["PostgreSQL", "Snowflake", "dbt Core", "SQL", "Git", "Dimensional Modeling"],
      roles: ["Analytics Engineer", "BI Data Modeler", "SQL Developer", "Data Warehouse Analyst"],
      description:
        "Bridge raw operational tables and executive BI reporting by mastering dimensional star-schema design, advanced SQL performance tuning, modular dbt Core models, and automated warehouse testing.",
      featured: true,
      status: "active",
      createdAt: "2026-11-18T10:00:00Z",
      modules: [
        {
          id: "mod-ae-1",
          order: 1,
          weekLabel: "Weeks 1 to 2",
          title: "Advanced SQL Window Functions, CTEs & Query Optimization",
          summary: "Refactor slow ad-hoc queries into indexed, readable SQL layers using EXPLAIN plans and analytical window frames.",
          durationHours: 6,
          objectives: [
            "Interpret PostgreSQL and Snowflake execution plans to eliminate full-table bottlenecks",
            "Write cohort retention, funnel attribution, and deduplication SQL patterns",
          ],
          labTask: "Optimize five high-latency reporting queries and document execution-plan speedups.",
          resourceNote: "Cloud Warehouse Tuning Pack + 250k-Row SaaS Schema",
        },
        {
          id: "mod-ae-2",
          order: 2,
          weekLabel: "Weeks 3 to 4",
          title: "Dimensional Star-Schema Design & Slowly Changing Dimensions",
          summary: "Model clean fact tables, conformed dimensions, and Type 2 history snapshots powering trustworthy BI metrics.",
          durationHours: 6,
          objectives: [
            "Design grain-verified fact and dimension tables from normalized ERP/CRM feeds",
            "Implement SCD Type 2 snapshots tracking historical customer and pricing changes",
          ],
          labTask: "Architect a conformed multi-department retail star schema with ERD documentation.",
          resourceNote: "Dimensional Modeling Playbook + Reference Schema Diagrams",
        },
        {
          id: "mod-ae-3",
          order: 3,
          weekLabel: "Weeks 5 to 6",
          title: "Modular dbt Core Staging, Intermediate & Mart Layers",
          summary: "Structure version-controlled dbt projects with Jinja macros, incremental materializations, and automated data quality tests.",
          durationHours: 8,
          objectives: [
            "Enforce not_null, unique, relationship, and freshness checks in CI",
            "Generate live dbt lineage graphs and searchable column documentation",
          ],
          labTask: "Build and test a 3-layer dbt project passing 100% of schema and freshness checks.",
          resourceNote: "dbt Core Starter Repository + CI GitHub Actions Workflow",
        },
        {
          id: "mod-ae-4",
          order: 4,
          weekLabel: "Weeks 7 to 8",
          title: "Semantic Metrics Layer & Warehouse Capstone Delivery",
          summary: "Connect governed warehouse marts directly into Power BI and Tableau while implementing data SLA alerting.",
          durationHours: 6,
          objectives: [
            "Publish certified KPI tables with row-level governance and refresh monitoring",
            "Defend warehouse architecture and test coverage in a portfolio capstone",
          ],
          labTask: "Ship a complete cloud warehouse repository with dbt docs, lineage graph, and BI semantic layer.",
          resourceNote: "Analytics Engineering Capstone Rubric + Review Checklist",
        },
      ],
    },
    {
      id: "course-azure-aws-architect",
      slug: "multi-cloud-solutions-architecture",
      title: "Multi-Cloud Solutions Architecture (AWS & Azure)",
      subtitle: "Design resilient, high-availability enterprise landing zones, disaster recovery, and secure hybrid networking across AWS and Azure",
      category: "Cloud & DevOps",
      deliveryMode: "Instructor-Led",
      audience: "both",
      level: "Advanced",
      durationWeeks: 12,
      sessionCount: 36,
      tuitionUsd: 3000,
      heroImage: "/academy/track-cloud.jpg",
      tools: ["AWS", "Microsoft Azure", "Terraform", "VPC & VNet", "Route 53", "CloudWatch & Monitor"],
      roles: ["Cloud Solutions Architect", "Senior Cloud Engineer", "Infrastructure Lead", "Enterprise Architect"],
      description:
        "An advanced architecture track guiding experienced cloud practitioners and engineering leads through multi-account AWS Organizations, Azure Landing Zones, global failover design, security guardrails, and cost-efficient architecture trade-offs.",
      featured: true,
      status: "active",
      createdAt: "2026-11-18T11:00:00Z",
      modules: [
        {
          id: "mod-mca-1",
          order: 1,
          weekLabel: "Weeks 1 to 3",
          title: "Multi-Account Landing Zones & Identity Federation",
          summary: "Design AWS Organizations SCPs and Azure Management Groups with centralized SSO and isolated workload environments.",
          durationHours: 8,
          objectives: [
            "Architect hub-and-spoke network boundaries across AWS Transit Gateway and Azure Virtual WAN",
            "Enforce preventive guardrails via Service Control Policies and Azure Policy",
          ],
          labTask: "Deliver an Architecture Decision Record and Terraform landing-zone topology.",
          resourceNote: "Enterprise Landing Zone Reference Pack + ADR Templates",
        },
        {
          id: "mod-mca-2",
          order: 2,
          weekLabel: "Weeks 4 to 6",
          title: "High Availability, Multi-Region Failover & DR Design",
          summary: "Engineer active-active and pilot-light recovery topologies achieving strict RPO and RTO reliability targets.",
          durationHours: 8,
          objectives: [
            "Configure Route 53 health-checked failover and cross-region database replication",
            "Calculate availability budgets and stress-test simulated regional outages",
          ],
          labTask: "Build and validate a multi-region failover blueprint with documented RPO/RTO runbooks.",
          resourceNote: "Disaster Recovery Drill Guide + Failover Calculator",
        },
        {
          id: "mod-mca-3",
          order: 3,
          weekLabel: "Weeks 7 to 9",
          title: "Event-Driven Serverless, Messaging & Hybrid Integration",
          summary: "Decouple high-throughput microservices using queues, event buses, private API gateways, and caching tiers.",
          durationHours: 8,
          objectives: [
            "Select between managed Kubernetes, containers, and serverless compute for workload patterns",
            "Eliminate single points of failure across API gateways, queues, and read replicas",
          ],
          labTask: "Design an event-driven order-processing architecture handling burst traffic gracefully.",
          resourceNote: "Distributed Systems Pattern Library + Architecture Lab",
        },
        {
          id: "mod-mca-4",
          order: 4,
          weekLabel: "Weeks 10 to 12",
          title: "Well-Architected Review, FinOps Trade-Offs & Defense",
          summary: "Audit security, reliability, and cost-efficiency pillars and defend an enterprise migration blueprint live.",
          durationHours: 8,
          objectives: [
            "Conduct a structured AWS Well-Architected and Azure CAF workload review",
            "Present a cost-modeled multi-cloud migration roadmap to principal architects",
          ],
          labTask: "Complete a full enterprise architecture review dossier and live panel defense.",
          resourceNote: "Well-Architected Review Matrix + Executive Presentation Kit",
        },
      ],
    },
    {
      id: "course-finops-governance",
      slug: "enterprise-cloud-finops-ai-governance",
      title: "Enterprise Cloud FinOps & AI Governance Bootcamp",
      subtitle: "Equip engineering, finance, and leadership teams with cloud unit economics, tag governance, and NIST AI risk controls",
      category: "Data & Automation",
      deliveryMode: "Corporate Bootcamp",
      audience: "business",
      level: "Intermediate",
      durationWeeks: 6,
      sessionCount: 18,
      tuitionUsd: 3000,
      heroImage: "/hero-datacenter.jpg",
      tools: ["AWS Cost Explorer", "Azure Cost Management", "OpenCost", "Tag Policies", "NIST AI RMF", "Power BI"],
      roles: ["FinOps Practitioner", "VP of Engineering", "Cloud Platform Manager", "AI Governance Lead"],
      description:
        "A dedicated corporate bootcamp aligning engineering leaders, finance partners, and compliance officers around transparent cloud unit-cost allocation, automated budget guardrails, and responsible enterprise AI governance.",
      featured: true,
      status: "active",
      createdAt: "2026-11-18T12:00:00Z",
      modules: [
        {
          id: "mod-fin-1",
          order: 1,
          weekLabel: "Weeks 1 to 2",
          title: "Cloud Cost Allocation, Tag Enforcement & Showback",
          summary: "Eliminate unallocated cloud spend by enforcing mandatory cost-center tags and departmental chargeback scorecards.",
          durationHours: 6,
          objectives: [
            "Define an enterprise tagging taxonomy enforced automatically via IaC policies",
            "Build unit-cost metrics tying AWS/Azure compute directly to product revenue",
          ],
          labTask: "Audit sample multi-account billing exports and publish a departmental showback scorecard.",
          resourceNote: "FinOps Foundation Alignment Pack + Sample CUR Dataset",
        },
        {
          id: "mod-fin-2",
          order: 2,
          weekLabel: "Weeks 3 to 4",
          title: "Compute Rightsizing, Storage Lifecycle & Anomaly Alerts",
          summary: "Identify idle clusters, oversized databases, and unattached storage while automating spend anomaly alerts.",
          durationHours: 6,
          objectives: [
            "Implement Kubernetes OpenCost visibility and S3/Blob tiering lifecycles",
            "Design automated Slack/Teams budget threshold alerts before billing spikes compound",
          ],
          labTask: "Produce an actionable 90-day cloud waste remediation roadmap for leadership.",
          resourceNote: "Rightsizing Playbook + Anomaly Alert Templates",
        },
        {
          id: "mod-fin-3",
          order: 3,
          weekLabel: "Weeks 5 to 6",
          title: "Enterprise AI Risk Controls & Governance Operating Model",
          summary: "Apply NIST AI RMF controls, vendor data-privacy review gates, and internal AI usage policies across departments.",
          durationHours: 6,
          objectives: [
            "Establish model inventory, data residency, and human-in-the-loop review policies",
            "Deliver a unified Cloud FinOps & AI Governance charter for executive sign-off",
          ],
          labTask: "Complete a corporate FinOps & AI Governance charter with KPI review cadence.",
          resourceNote: "NIST AI RMF Executive Checklist + Policy Templates",
        },
      ],
    },
    {
      id: "course-devsecops-bootcamp",
      slug: "enterprise-devsecops-compliance-bootcamp",
      title: "Enterprise DevSecOps & Zero-Trust Compliance Bootcamp",
      subtitle: "Embed automated security gates, SBOM supply-chain checks, OPA policies, and SOC 2 evidence into engineering pipelines",
      category: "Cybersecurity",
      deliveryMode: "Corporate Bootcamp",
      audience: "business",
      level: "Advanced",
      durationWeeks: 6,
      sessionCount: 18,
      tuitionUsd: 3000,
      heroImage: "/training-platform.jpg",
      tools: ["NIST CSF 2.0", "Trivy", "OPA / Kyverno", "HashiCorp Vault", "GitHub Actions", "SBOM / Cosign"],
      roles: ["DevSecOps Lead", "AppSec Engineer", "Cloud Compliance Architect", "Platform Security Team"],
      description:
        "An intensive corporate security engineering bootcamp helping software, platform, and security teams embed continuous compliance, software supply-chain signing, policy-as-code admission gates, and automated audit evidence into CI/CD.",
      featured: true,
      status: "active",
      createdAt: "2026-11-18T13:00:00Z",
      modules: [
        {
          id: "mod-dso-1",
          order: 1,
          weekLabel: "Weeks 1 to 2",
          title: "Supply-Chain Hardening, SBOMs & Signed Container Builds",
          summary: "Secure build pipelines with dependency pinning, CycloneDX SBOM generation, Trivy gates, and cryptographic signing.",
          durationHours: 6,
          objectives: [
            "Block critical CVEs and leaked secrets automatically inside pull requests",
            "Generate verifiable SBOM artifacts and signed container releases",
          ],
          labTask: "Harden a reference CI/CD repository with automated Trivy, secret scanning, and SBOM output.",
          resourceNote: "DevSecOps CI Pipeline Pack + Supply-Chain Checklist",
        },
        {
          id: "mod-dso-2",
          order: 2,
          weekLabel: "Weeks 3 to 4",
          title: "Policy-as-Code Admission Controls & Dynamic Secrets",
          summary: "Enforce non-root workloads, egress restrictions, and short-lived Vault workload identity across production clusters.",
          durationHours: 6,
          objectives: [
            "Write OPA/Kyverno policies blocking privileged containers and open ingress rules",
            "Replace static CI/CD deployment keys with OIDC and Vault dynamic leases",
          ],
          labTask: "Deploy admission guardrails and verify automated policy rejection against non-compliant manifests.",
          resourceNote: "Policy-as-Code Rule Library + Vault OIDC Runbook",
        },
        {
          id: "mod-dso-3",
          order: 3,
          weekLabel: "Weeks 5 to 6",
          title: "Continuous NIST CSF 2.0 & SOC 2 Audit Automation",
          summary: "Turn daily security telemetry and IaC drift scans into continuous audit evidence ready for external assessors.",
          durationHours: 6,
          objectives: [
            "Map technical CI/CD and IAM safeguards directly to NIST CSF 2.0 and SOC 2 controls",
            "Run an executive red-team tabletop review validating detection and containment SLAs",
          ],
          labTask: "Deliver a continuous compliance control matrix and automated audit evidence package.",
          resourceNote: "NIST CSF 2.0 & SOC 2 Evidence Mapping Kit",
        },
      ],
    },
  ];

  const cohorts: Cohort[] = [
    {
      id: "cohort-da-nov26",
      courseId: "course-data-bi",
      code: "DA-2026-Q4",
      startDateText: "November 10, 2026",
      startDateIso: "2026-11-10T00:00:00Z",
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
      startDateText: SITE_CONFIG.PROGRAMME.START_DATE_TEXT,
      startDateIso: SITE_CONFIG.PROGRAMME.START_DATE_ISO,
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
    {
      id: "cohort-it-jan27",
      courseId: "course-it-foundations",
      code: "IT-2027-Q1",
      startDateText: "January 25, 2027",
      startDateIso: "2027-01-25T00:00:00Z",
      schedule: "Mon, Wed evenings + Sat Troubleshooting Lab (24 sessions)",
      format: "Instructor-Led Online · Virtual Lab Sandbox",
      seatCapacity: 30,
      seatsTaken: 9,
      status: "open",
    },
    {
      id: "cohort-ai-rolling",
      courseId: "course-ai-productivity",
      code: "AI-FLEX-01",
      startDateText: "Rolling Enrollment (Immediate Access)",
      startDateIso: "2026-11-15T00:00:00Z",
      schedule: "Self-paced modules + Weekly Live Automation Office Hours",
      format: "On-Demand Portal + Weekly Mentor Q&A",
      seatCapacity: 60,
      seatsTaken: 14,
      status: "open",
    },
    {
      id: "cohort-soc-feb27",
      courseId: "course-soc-analyst",
      code: "SOC-2027-Q1",
      startDateText: "February 1, 2027",
      startDateIso: "2027-02-01T00:00:00Z",
      schedule: "Tue & Thu evenings + Sat SOC Triage Lab (30 sessions)",
      format: "Instructor-Led Online · SIEM & PCAP Sandbox",
      seatCapacity: 28,
      seatsTaken: 7,
      status: "open",
    },
    {
      id: "cohort-ae-rolling",
      courseId: "course-sql-warehouse",
      code: "AE-FLEX-01",
      startDateText: "Rolling Enrollment (Immediate Access)",
      startDateIso: "2026-11-18T00:00:00Z",
      schedule: "Self-paced modules + Weekly dbt & SQL Office Hours",
      format: "On-Demand Portal + Weekly Mentor Q&A",
      seatCapacity: 50,
      seatsTaken: 12,
      status: "open",
    },
    {
      id: "cohort-mca-feb27",
      courseId: "course-azure-aws-architect",
      code: "MCA-2027-Q1",
      startDateText: "February 15, 2027",
      startDateIso: "2027-02-15T00:00:00Z",
      schedule: "Mon & Wed evenings + Sat Architecture Lab (36 sessions)",
      format: "Instructor-Led Online + Multi-Cloud Sandboxes",
      seatCapacity: 24,
      seatsTaken: 8,
      status: "open",
    },
    {
      id: "cohort-fin-feb27",
      courseId: "course-finops-governance",
      code: "FIN-2027-Q1",
      startDateText: "February 8, 2027",
      startDateIso: "2027-02-08T00:00:00Z",
      schedule: "Tue & Thu Leadership Workshops (18 sessions)",
      format: "Corporate Team Cohort",
      seatCapacity: 25,
      seatsTaken: 9,
      status: "open",
    },
    {
      id: "cohort-dso-feb27",
      courseId: "course-devsecops-bootcamp",
      code: "DSO-2027-Q1",
      startDateText: "February 22, 2027",
      startDateIso: "2027-02-22T00:00:00Z",
      schedule: "Mon, Wed & Sat DevSecOps Labs (18 sessions)",
      format: "Corporate Sandbox Residency",
      seatCapacity: 20,
      seatsTaken: 6,
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
      unitPriceUsd: 3000,
      discountPercent: 0,
      totalUsd: 45000,
      totalLocalFormatted: "$45,000",
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
      totalUsd: 3000,
      amountPaidUsd: 1500,
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
      totalUsd: 3000,
      amountPaidUsd: 3000,
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
      totalUsd: 3000,
      amountPaidUsd: 3000,
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
      totalUsd: 3000,
      amountPaidUsd: 3000,
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
      totalUsd: 3000,
      amountPaidUsd: 3000,
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
      totalUsd: 3000,
      amountPaidUsd: 3000,
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
      amountUsd: 1500,
      amountLocalFormatted: formatCurrencyAmount(1500, "GHS"),
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
      amountUsd: 1500,
      amountLocalFormatted: formatCurrencyAmount(1500, "GHS"),
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
      description: "Python Programming, ETL & Data Automation · Full Tuition",
      installmentNumber: 1,
      currency: "USD",
      amountUsd: 3000,
      amountLocalFormatted: "$3,000",
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
      amountUsd: 45000,
      amountLocalFormatted: "$45,000",
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
      courseTitle: "Python Programming, ETL & Data Automation",
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
    leads: [],
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
  if (!globalForAcademy.__etsAcademyStore.leads) {
    globalForAcademy.__etsAcademyStore.leads = [];
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
