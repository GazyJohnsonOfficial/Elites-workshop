"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  FileText,
  Layers,
  Loader2,
  Send,
  ShieldCheck,
  Sliders,
  Users,
} from "lucide-react";
import {
  formatCurrencyAmount,
  isBusinessCourse,
  type AcademyCategory,
  type Course,
  type CurrencyCode,
} from "@/lib/academyStore";
import { CORPORATE_LEARNING_PLANS } from "@/lib/curriculumAssessments";
import { SITE_CONFIG } from "@/lib/config";
import { CorporateHero } from "./CorporateHero";
import { CorporateCatalogSection } from "./CorporateCatalogSection";
import { AcademyInsightsBlogSection } from "./AcademyInsightsBlogSection";
import { CloudAdvisorPanel } from "./CloudAdvisorPanel";
import { AcademyHomeFaqSection } from "./AcademyCourseFAQ";

interface DepartmentPreview {
  id: "platform" | "data" | "security";
  label: string;
  headline: string;
  completionRate: number;
  assessmentAvg: number;
  capstoneReadiness: number;
  competencies: Array<{ name: string; masteryPct: number }>;
}

const DEPARTMENT_PREVIEWS: DepartmentPreview[] = [
  {
    id: "platform",
    label: "Platform & Cloud SRE",
    headline: "Infrastructure-as-Code, CI/CD & Cluster Reliability",
    completionRate: 84,
    assessmentAvg: 89,
    capstoneReadiness: 78,
    competencies: [
      { name: "Terraform State & Multi-Cloud Landing Zones", masteryPct: 91 },
      { name: "Docker Multi-Stage & GitHub Actions Pipelines", masteryPct: 86 },
      { name: "Kubernetes Scheduling, Ingress & HPA Autoscaling", masteryPct: 79 },
      { name: "Prometheus Alerting & Incident Runbooks", masteryPct: 74 },
    ],
  },
  {
    id: "data",
    label: "Data & BI Analytics",
    headline: "Warehouse Transformation, SQL Modeling & Executive BI",
    completionRate: 88,
    assessmentAvg: 91,
    capstoneReadiness: 83,
    competencies: [
      { name: "Relational SQL Optimization & Window Queries", masteryPct: 94 },
      { name: "Power BI Semantic Star Schema & DAX Measures", masteryPct: 88 },
      { name: "Python & dbt Automated Schema Contracts", masteryPct: 81 },
      { name: "Executive KPI Scorecards & Governance", masteryPct: 85 },
    ],
  },
  {
    id: "security",
    label: "Cloud Security Ops",
    headline: "Zero-Trust IAM, Vault Secrets & Policy Compliance",
    completionRate: 82,
    assessmentAvg: 87,
    capstoneReadiness: 76,
    competencies: [
      { name: "Least-Privilege IAM & OIDC Workload Identity", masteryPct: 90 },
      { name: "HashiCorp Vault Dynamic Secret Rotation", masteryPct: 82 },
      { name: "Trivy Container Scanning & CI Security Gates", masteryPct: 84 },
      { name: "CloudTrail Forensics & Audit Documentation", masteryPct: 77 },
    ],
  },
];

const DELIVERY_MODELS = [
  {
    num: "01",
    icon: Users,
    range: "5 to 29 Seats",
    title: "Shared Cohort Seat Packs",
    desc: "Enroll engineers into scheduled instructor-led cohorts with centralized seat provisioning, unified invoicing, and live admin progress tracking.",
    bullets: [
      "Immediate seat provisioning & reassignment",
      "Net-30 Purchase Order or wire settlement",
      "Manager progress dashboard & CSV exports",
    ],
    ctaLabel: "Estimate Shared Seats",
    ctaHref: "#team-pricing",
  },
  {
    num: "02",
    icon: CalendarClock,
    range: "15+ Seats",
    title: "Private Dedicated Team Cohorts",
    desc: "Reserve a private instructor-led bootcamp scheduled around your company time zone, release sprints, and internal security policies.",
    bullets: [
      "Dedicated live sessions for your organization",
      "Flexible pacing across 4 to 12 week windows",
      "Role-based labs for Data, Cloud, SRE & Security",
    ],
    ctaLabel: "Scope Private Cohort",
    ctaHref: "#request-demo",
  },
  {
    num: "03",
    icon: Sliders,
    range: "30+ Seats",
    title: "Custom Architecture & Toolchain Alignment",
    desc: "Tailor modules and capstone projects to your internal AWS/Azure landing zones, BI schemas, or compliance controls with dedicated enterprise onboarding.",
    bullets: [
      "Labs aligned to your live cloud & BI stack",
      "Multi-department seat pools across regions",
      "Executive capability reviews & readiness reports",
    ],
    ctaLabel: "Request Enterprise Proposal",
    ctaHref: "#request-demo",
  },
] as const;

const PLAN_FEATURES: Array<{
  feature: string;
  team: string;
  enterprise: string;
}> = [
  {
    feature: "Seat Allocation Range",
    team: "5 to 29 seats per order",
    enterprise: "30+ seats & multi-department pools",
  },
  {
    feature: "Cohort Delivery Format",
    team: "Shared scheduled live cohorts",
    enterprise: "Private dedicated cohorts & custom schedules",
  },
  {
    feature: "Departmental Learning Plans",
    team: "Included multi-course tracks",
    enterprise: "Role-mapped cohort scheduling & custom plans",
  },
  {
    feature: "Engineering Lead Telemetry",
    team: "Live progress %, quiz scores & CSV export",
    enterprise: "Department completion reporting & audit printouts",
  },
  {
    feature: "Credential Verification",
    team: "Public Open Badges v2 & QR verification",
    enterprise: "Bulk organization credential tracking",
  },
  {
    feature: "Invoicing & Procurement",
    team: "Instant quote & Net-30 Purchase Order",
    enterprise: "Dedicated onboarding & multi-hub settlement",
  },
];

interface EnterpriseTier {
  id: string;
  tierNumber: string;
  badge: string;
  featured?: boolean;
  title: string;
  targetAudience: string;
  durationText: string;
  summary: string;
  competencies: string[];
  deliverable: string;
  tools: string[];
}

const ENTERPRISE_TIERS: EnterpriseTier[] = [
  {
    id: "tier-fluency",
    tierNumber: "Tier 01",
    badge: "Organization-Wide Baseline",
    title: "Cloud, Security & AI Workforce Fluency",
    targetAudience:
      "Cross-functional product squads, business analysts, operations, and junior IT",
    durationText: "4 Weeks · 8 Guided Live Sessions",
    summary:
      "Establish an aligned technical baseline across non-platform staff to eliminate silos, enforce secure cloud habits, and adopt generative AI safely.",
    competencies: [
      "Core cloud computing primitives across AWS & Azure",
      "Responsible Generative AI & workflow automation guardrails",
      "Essential zero-trust security hygiene & credential protection",
      "Shared KPI definitions and automated departmental reporting",
    ],
    deliverable:
      "Company-Wide Cloud & AI Literacy Digital Badge + Shared Tech Taxonomy",
    tools: ["AWS Console", "Power BI", "Applied AI", "Git", "Jira"],
  },
  {
    id: "tier-engineering",
    tierNumber: "Tier 02",
    badge: "Most Requested · Role-Aligned",
    featured: true,
    title: "Practitioner Engineering & Production Bootcamps",
    targetAudience:
      "Software engineers, cloud practitioners, data analysts, and security engineers",
    durationText: "8 to 12 Weeks · 24 to 36 Hands-on Cohort Sessions",
    summary:
      "Deep technical reskilling into production-grade infrastructure, automated deployment pipelines, data warehouse modeling, and zero-trust defense.",
    competencies: [
      "Modular Infrastructure-as-Code with Terraform & OpenTofu",
      "Multi-stage Docker packaging & GitHub Actions CI/CD gates",
      "Kubernetes pod scheduling, ingress control & HPA autoscaling",
      "dbt semantic transformation, SQL contracts & Power BI DAX",
      "HashiCorp Vault secret rotation & Trivy image scanning",
    ],
    deliverable:
      "Production Infrastructure Capstone + Net-30 Invoiced Cohort Telemetry",
    tools: [
      "Terraform",
      "Docker",
      "Kubernetes",
      "AWS EKS",
      "dbt",
      "Power BI",
      "Vault",
    ],
  },
  {
    id: "tier-leadership",
    tierNumber: "Tier 03",
    badge: "Executive & Strategic Leadership",
    title: "Platform Architecture, FinOps & Cloud Governance",
    targetAudience:
      "Principal architects, engineering leads, VPs of Technology, and FinOps leads",
    durationText: "6 Weeks · Executive Architecture Roundtables",
    summary:
      "Strategic enablement for technology leaders managing multi-cloud architecture, cloud spend unit economics, compliance readiness, and platform teams.",
    competencies: [
      "Multi-account AWS Control Tower & Azure Landing Zone architecture",
      "FinOps foundation framework: cloud cost allocation & tag policies",
      "Zero-Trust compliance readiness (NIST CSF 2.0, SOC2, ISO 27001)",
      "Internal Developer Platform (IDP) strategy & engineering velocity metrics",
    ],
    deliverable:
      "Enterprise Architecture Review Blueprint + FinOps Unit Cost Action Plan",
    tools: [
      "AWS Organizations",
      "Control Tower",
      "Prometheus",
      "Grafana",
      "Kubernetes",
    ],
  },
];

export function CorporateShowcase({
  courses = [],
  initialCurrency = "USD",
}: {
  courses?: Course[];
  initialCurrency?: CurrencyCode;
}) {
  const businessCourses = useMemo(() => {
    const filtered = courses.filter((c) => isBusinessCourse(c));
    return [...filtered].sort((a, b) => {
      const aBizOnly = a.audience === "business" ? 0 : 1;
      const bBizOnly = b.audience === "business" ? 0 : 1;
      if (aBizOnly !== bBizOnly) return aBizOnly - bBizOnly;
      return a.title.localeCompare(b.title);
    });
  }, [courses]);

  const bootcampCount = useMemo(
    () => businessCourses.filter((c) => c.audience === "business").length,
    [businessCourses]
  );

  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    businessCourses[0]?.id || "course-cloud-devops"
  );
  const [seatCount, setSeatCount] = useState<number>(15);
  const [activeDept, setActiveDept] =
    useState<DepartmentPreview["id"]>("platform");

  // Shared filter state driven by Hero quick chips AND CorporateCatalogSection
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMode, setSelectedMode] = useState<string>("all");

  // Inline Corporate Consultation form state
  const [consultName, setConsultName] = useState("");
  const [consultEmail, setConsultEmail] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultOrg, setConsultOrg] = useState("");
  const [consultTeamSize, setConsultTeamSize] = useState("15 to 29 seats");
  const [consultTrack, setConsultTrack] = useState(
    "Cloud, DevOps & Kubernetes"
  );
  const [consultNotes, setConsultNotes] = useState("");
  const [consultBusy, setConsultBusy] = useState(false);
  const [consultError, setConsultError] = useState("");
  const [consultRef, setConsultRef] = useState("");

  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  useEffect(() => {
    const handleRegionChange = (event: Event) => {
      const detail = (event as CustomEvent<{ currency?: CurrencyCode }>).detail;
      if (detail?.currency) {
        setCurrency(detail.currency);
      }
    };
    window.addEventListener("ets-region-currency-changed", handleRegionChange);
    return () => {
      window.removeEventListener(
        "ets-region-currency-changed",
        handleRegionChange
      );
    };
  }, []);

  const handleHeroQuickFilter = (opts: {
    category?: AcademyCategory;
    mode?: "Corporate Bootcamp";
  }) => {
    if (opts.mode) {
      setSelectedCategory("all");
      setSelectedMode(opts.mode);
    } else if (opts.category) {
      setSelectedMode("all");
      setSelectedCategory(opts.category);
    }
    const el = document.getElementById("corporate-catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const selectedCourse = useMemo(
    () =>
      businessCourses.find((c) => c.id === selectedCourseId) ||
      businessCourses[0],
    [businessCourses, selectedCourseId]
  );

  const baseUnitUsd = selectedCourse?.tuitionUsd || 3000;
  const netTotalUsd = baseUnitUsd * seatCount;
  const activeTierLabel =
    seatCount >= 30
      ? "Enterprise Pool"
      : seatCount >= 15
      ? "Private Cohort"
      : "Team Pack";
  const currentDept =
    DEPARTMENT_PREVIEWS.find((d) => d.id === activeDept) ||
    DEPARTMENT_PREVIEWS[0];

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConsultError("");
    setConsultBusy(true);
    try {
      const res = await fetch("/api/academy/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "corporate_consultation",
          fullName: consultName,
          email: consultEmail,
          phone: consultPhone,
          organizationName: consultOrg,
          teamSize: consultTeamSize,
          objective: consultTrack,
          notes: consultNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ||
            "Unable to submit consultation request. Please check your details."
        );
      }
      setConsultRef(data.reference || "ETS-BIZ-CONFIRMED");
    } catch (err) {
      setConsultError((err as Error).message);
    } finally {
      setConsultBusy(false);
    }
  };

  return (
    <main id="main">
      {/* 1. Bespoke Dark Enterprise Architectural Hero */}
      <CorporateHero
        courseCount={businessCourses.length}
        bootcampCount={bootcampCount}
        onSelectFilter={handleHeroQuickFilter}
      />

      {/* 2. Enterprise Delivery Models (Clean White Surface) */}
      <section className="acad-section" id="delivery-models">
        <div className="container">
          <div className="acad-section-head">
            <div>
              <span
                className="acad-overview-label"
                style={{ color: "var(--blue)" }}
              >
                FLEXIBLE CORPORATE DELIVERY
              </span>
              <h2>Three Ways to Train Your Organization</h2>
              <p className="acad-section-sub">
                Start with a 5-seat pack in an upcoming cohort or run a private
                bootcamp tailored directly to your internal cloud and BI
                architecture.
              </p>
            </div>
            <a href="#request-demo" className="btn btn-outline btn-sm">
              <span>Discuss Private Delivery</span>
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="acad-biz-delivery-row">
            {DELIVERY_MODELS.map((model) => {
              const Icon = model.icon;
              return (
                <article key={model.num} className="acad-biz-delivery-card">
                  <div className="acad-biz-delivery-top">
                    <div className="acad-biz-delivery-icon" aria-hidden="true">
                      <Icon size={20} />
                    </div>
                    <div className="acad-biz-delivery-meta-right">
                      <span className="acad-biz-delivery-range">
                        {model.range}
                      </span>
                      <span className="acad-flow-num">{model.num}</span>
                    </div>
                  </div>
                  <h3>{model.title}</h3>
                  <p>{model.desc}</p>
                  <ul className="acad-biz-tier-list">
                    {model.bullets.map((bullet) => (
                      <li key={bullet}>
                        <CheckCircle2
                          size={14}
                          color="var(--blue)"
                          style={{ flexShrink: 0, marginTop: "3px" }}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={model.ctaHref}
                    className="acad-biz-delivery-link"
                  >
                    <span>{model.ctaLabel}</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Full Architectural Enterprise Program Filtering & Catalog Section (Tinted Surface) */}
      <CorporateCatalogSection
        courses={businessCourses}
        currency={currency}
        seatCount={seatCount}
        onSeatCountChange={setSeatCount}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
      />

      {/* 4. Departmental Engineering Pathways (Clean White Surface) */}
      <section className="acad-section" id="departmental-pathways">
        <div className="container">
          <div className="acad-section-head">
            <div>
              <span
                className="acad-overview-label"
                style={{ color: "var(--blue)" }}
              >
                ROLE-MAPPED MULTI-COURSE PATHWAYS
              </span>
              <h2>Departmental Engineering Pathways</h2>
              <p className="acad-section-sub">
                Pre-sequenced multi-course tracks designed to upskill specific
                technical departments from core foundations to production
                operations.
              </p>
            </div>
            <Link
              href={`/academy/tuition?mode=corporate&seats=${seatCount}`}
              className="btn btn-navy btn-sm"
            >
              <span>Quote Any Pathway</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="acad-biz-plan-cards">
            {CORPORATE_LEARNING_PLANS.map((plan, idx) => {
              const matchedCourses = courses.filter((c) =>
                plan.courseIds.includes(c.id)
              );
              const totalWeeks = matchedCourses.reduce(
                (acc, c) => acc + c.durationWeeks,
                0
              );
              return (
                <article key={plan.id} className="acad-biz-pathway-card">
                  <div className="acad-biz-pathway-head">
                    <span className="acad-biz-pathway-dept">
                      {plan.targetDepartment}
                    </span>
                    <span className="acad-flow-num">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                  <div className="acad-biz-pathway-meta">
                    <span>
                      <Layers size={14} aria-hidden="true" />
                      {plan.courseIds.length} Integrated Courses
                    </span>
                    {totalWeeks > 0 && <span>{totalWeeks} Combined Weeks</span>}
                  </div>
                  <div className="acad-biz-pathway-links">
                    {matchedCourses.map((c, stepIdx) => (
                      <Link key={c.id} href={`/academy/courses/${c.slug}`}>
                        <span className="acad-biz-pathway-step">
                          0{stepIdx + 1}
                        </span>
                        <span>{c.title}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="acad-biz-pathway-foot">
                    <Link
                      href={`/academy/tuition?mode=corporate&course=${encodeURIComponent(
                        plan.courseIds[0] || ""
                      )}&seats=${seatCount}`}
                      className="btn btn-outline btn-block btn-sm"
                    >
                      <span>Quote This Pathway</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. 3-Tier Enterprise Capability Framework (Tinted Surface) */}
      <section
        className="acad-section acad-section-tint acad-biz-framework-section"
        id="enterprise-framework"
      >
        <div className="container">
          <div className="acad-section-head">
            <div>
              <span
                className="acad-overview-label"
                style={{ color: "var(--blue)" }}
              >
                WORKFORCE CAPABILITY BLUEPRINT
              </span>
              <h2>3-Tier Enterprise Technical Capability Framework</h2>
              <p className="acad-section-sub">
                Structured on proven workforce transformation models: from
                organization-wide technical fluency to intensive engineering
                bootcamps and executive cloud governance.
              </p>
            </div>
            <a href="#request-demo" className="btn btn-navy btn-sm">
              <span>Schedule Capability Scoping</span>
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="acad-biz-framework-grid">
            {ENTERPRISE_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`acad-biz-tier-card ${
                  tier.featured ? "is-featured" : ""
                }`}
              >
                <div className="acad-biz-tier-top">
                  <span className="acad-biz-tier-num">{tier.tierNumber}</span>
                  <span
                    className={`acad-biz-tier-badge ${
                      tier.featured ? "is-featured" : ""
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>
                <h3>{tier.title}</h3>
                <p className="acad-biz-tier-summary">{tier.summary}</p>

                <div className="acad-biz-tier-meta">
                  <div>
                    <span className="acad-biz-tier-meta-lbl">
                      Target Audience
                    </span>
                    <strong>{tier.targetAudience}</strong>
                  </div>
                  <div>
                    <span className="acad-biz-tier-meta-lbl">
                      Delivery Format
                    </span>
                    <strong>{tier.durationText}</strong>
                  </div>
                </div>

                <div className="acad-biz-tier-comps">
                  <span className="acad-biz-tier-meta-lbl">
                    Core Competencies
                  </span>
                  <ul className="acad-biz-tier-list">
                    {tier.competencies.map((comp, idx) => (
                      <li key={idx}>
                        <CheckCircle2
                          size={14}
                          color="var(--blue)"
                          style={{ flexShrink: 0, marginTop: "2px" }}
                        />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="acad-biz-tier-deliverable">
                  <Award
                    size={14}
                    color="var(--gold)"
                    style={{ flexShrink: 0, marginTop: "2px" }}
                  />
                  <span>
                    <strong>Outcome:</strong> {tier.deliverable}
                  </span>
                </div>

                <div className="acad-biz-tier-tools">
                  {tier.tools.map((tool) => (
                    <span key={tool} className="acad-biz-tier-tool">
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="acad-biz-tier-action">
                  <Link
                    href={`/academy/tuition?mode=corporate&tier=${tier.id}`}
                    className={`btn btn-block btn-sm ${
                      tier.featured ? "btn-navy" : "btn-outline"
                    }`}
                  >
                    <span>Request {tier.tierNumber} Pricing &amp; Quote</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Interactive Team Seat Estimator & Team vs Enterprise Comparison (Clean White Surface) */}
      <section className="acad-section" id="team-pricing">
        <div className="container">
          <div className="acad-section-head">
            <div>
              <span
                className="acad-overview-label"
                style={{ color: "var(--blue)" }}
              >
                TRANSPARENT TEAM PRICING
              </span>
              <h2>Team &amp; Enterprise Seat Plans</h2>
              <p className="acad-section-sub">
                Estimate total tuition in {currency} for your selected program
                and team size, or compare Team and Enterprise capabilities side
                by side.
              </p>
            </div>
          </div>

          <div className="acad-biz-compare-layout">
            {/* Left: Interactive Seat Estimator */}
            <div className="acad-card acad-biz-estimator">
              <div className="acad-biz-est-head">
                <Users size={18} color="var(--blue)" />
                <h3>Interactive Seat Cost Estimator</h3>
              </div>

              {businessCourses.length > 0 && (
                <div className="acad-field" style={{ marginBottom: "14px" }}>
                  <label htmlFor="biz-est-course">Reference Program</label>
                  <select
                    id="biz-est-course"
                    className="acad-select"
                    value={selectedCourse?.id || selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                  >
                    {businessCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({formatCurrencyAmount(c.tuitionUsd, currency)}{" "}
                        / seat)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div
                className="acad-biz-seat-presets"
                role="group"
                aria-label="Select seat count"
              >
                {[5, 10, 15, 25, 30, 50].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setSeatCount(qty)}
                    className={`acad-biz-seat-btn ${
                      seatCount === qty ? "active" : ""
                    }`}
                  >
                    {qty} Seats
                  </button>
                ))}
              </div>

              <div className="acad-tier-strip" style={{ margin: "14px 0" }}>
                <div
                  className={`acad-tier-step ${
                    seatCount >= 5 && seatCount < 15 ? "active" : ""
                  }`}
                >
                  <span>5 to 14 Seats</span>
                  <strong>Team Pack</strong>
                </div>
                <div
                  className={`acad-tier-step ${
                    seatCount >= 15 && seatCount < 30 ? "active" : ""
                  }`}
                >
                  <span>15 to 29 Seats</span>
                  <strong>Private Cohort</strong>
                </div>
                <div className={`acad-tier-step ${seatCount >= 30 ? "active" : ""}`}>
                  <span>30+ Seats</span>
                  <strong>Enterprise Pool</strong>
                </div>
              </div>

              <div className="acad-biz-est-totals">
                <div>
                  <span>Selected Plan ({activeTierLabel})</span>
                  <strong style={{ color: "var(--navy)" }}>
                    {formatCurrencyAmount(baseUnitUsd, currency)} / seat
                  </strong>
                </div>
                <div>
                  <span>
                    Estimated Total ({seatCount} Seats · {currency})
                  </span>
                  <strong style={{ fontSize: "1.28rem", color: "var(--navy)" }}>
                    {formatCurrencyAmount(netTotalUsd, currency)}
                  </strong>
                </div>
              </div>

              <Link
                href={`/academy/tuition?mode=corporate&course=${encodeURIComponent(
                  selectedCourse?.id || ""
                )}&seats=${seatCount}`}
                className="btn btn-gold btn-block"
              >
                <FileText size={16} />
                <span>Generate Formal Quote for {seatCount} Seats</span>
              </Link>
            </div>

            {/* Right: Team vs Enterprise Comparison Table */}
            <div className="acad-card acad-biz-matrix-card">
              <div className="acad-table-wrap">
                <table className="acad-table acad-biz-compare-table">
                  <thead>
                    <tr>
                      <th>Capability</th>
                      <th>Team Plan (5 to 29 Seats)</th>
                      <th className="acad-biz-th-ent">
                        Enterprise Plan (30+ Seats)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLAN_FEATURES.map((row) => (
                      <tr key={row.feature}>
                        <td className="acad-biz-compare-cap">{row.feature}</td>
                        <td data-label="Team Plan (5 to 29 Seats)">
                          <span className="acad-biz-cell-check">
                            <Check
                              size={14}
                              color="var(--blue)"
                              aria-hidden="true"
                            />
                            <span>{row.team}</span>
                          </span>
                        </td>
                        <td
                          data-label="Enterprise Plan (30+ Seats)"
                          className="acad-biz-td-ent"
                        >
                          <span className="acad-biz-cell-check">
                            <CheckCircle2
                              size={14}
                              color="var(--ok)"
                              aria-hidden="true"
                            />
                            <span>{row.enterprise}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Visual Engineering Lead Skills & Proficiency Dashboard Preview (Tinted Surface) */}
      <section
        className="acad-section acad-section-tint"
        id="telemetry-preview"
      >
        <div className="container">
          <div className="acad-section-head">
            <div>
              <span
                className="acad-overview-label"
                style={{ color: "var(--blue)" }}
              >
                MANAGER REPORTING COCKPIT
              </span>
              <h2>Engineering Lead Visibility &amp; Telemetry Preview</h2>
              <p className="acad-section-sub">
                Monitor module mastery, checkpoint exam averages, and credential
                readiness across departments. Illustrative sample preview shown
                prior to sign-in.
              </p>
            </div>
            <div
              className="acad-cat-view-switch"
              role="tablist"
              aria-label="Department telemetry preview"
            >
              {DEPARTMENT_PREVIEWS.map((dept) => (
                <button
                  key={dept.id}
                  type="button"
                  role="tab"
                  aria-selected={activeDept === dept.id}
                  onClick={() => setActiveDept(dept.id)}
                  className={`acad-cat-view-btn ${
                    activeDept === dept.id ? "active" : ""
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </div>

          <div className="acad-biz-telemetry-shell">
            <div className="acad-biz-telemetry-bar">
              <div>
                <div className="acad-biz-telemetry-label">
                  Sample Telemetry Preview · {currentDept.label}
                </div>
                <h3>{currentDept.headline}</h3>
              </div>
              <span className="acad-biz-telemetry-pill">
                <BarChart3 size={14} aria-hidden="true" />
                <span>Lead Dashboard View</span>
              </span>
            </div>

            <div className="acad-biz-telemetry-body">
              <div className="acad-biz-preview-kpis">
                <div className="acad-biz-preview-kpi">
                  <span>Cohort Module Completion</span>
                  <strong style={{ color: "var(--blue)" }}>
                    {currentDept.completionRate}%
                  </strong>
                </div>
                <div className="acad-biz-preview-kpi">
                  <span>Checkpoint Assessment Avg</span>
                  <strong style={{ color: "var(--navy)" }}>
                    {currentDept.assessmentAvg}%
                  </strong>
                </div>
                <div className="acad-biz-preview-kpi">
                  <span>Capstone Certification Ready</span>
                  <strong style={{ color: "var(--ok-text)" }}>
                    {currentDept.capstoneReadiness}%
                  </strong>
                </div>
              </div>

              <div className="acad-biz-comp-bars">
                {currentDept.competencies.map((comp) => (
                  <div key={comp.name} className="acad-outcomes-bar-row">
                    <div className="acad-outcomes-bar-head">
                      <strong>{comp.name}</strong>
                      <span>{comp.masteryPct}% proficiency</span>
                    </div>
                    <div className="acad-outcomes-bar-track" aria-hidden="true">
                      <div
                        className="acad-outcomes-bar-fill"
                        style={{ width: `${comp.masteryPct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Organization Sign-In & Onboarding Strip */}
          <div className="acad-biz-admin-banner">
            <div className="acad-biz-admin-copy">
              <ShieldCheck size={20} color="var(--blue)" />
              <div>
                <strong>
                  Already managing an active organization seat quota?
                </strong>
                <span>
                  Sign in as an organization administrator to assign staff
                  seats, filter team progress, and export CSV telemetry reports.
                </span>
              </div>
            </div>
            <div className="acad-biz-admin-actions">
              <Link
                href="/academy/corporate/signin"
                className="btn btn-navy btn-sm"
              >
                For Business Sign In
              </Link>
              <Link
                href="/academy/corporate/register"
                className="btn btn-outline btn-sm"
              >
                Create Organization Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Enterprise Engineering Briefs & Technical Dispatches (White Surface) */}
      <AcademyInsightsBlogSection variant="business" />

      {/* 9. Enterprise Architecture & Compliance Advisor */}
      <CloudAdvisorPanel selectedCategory="all" />

      {/* 10. Corporate Procurement & Onboarding FAQ */}
      <AcademyHomeFaqSection audience="business" />

      {/* 11. Inline Corporate Scoping & Consultation Form (Deep Navy Surface) */}
      <section className="acad-section acad-biz-consult-section" id="request-demo">
        <div className="container">
          <div className="acad-biz-consult-shell">
            <div className="acad-biz-consult-info">
              <span className="acad-biz-kicker" style={{ color: "var(--gold)" }}>
                <Building2 size={15} aria-hidden="true" />
                <span>Private Cohort &amp; Enterprise Scoping</span>
              </span>
              <h2>Request a Corporate Training Consultation</h2>
              <p>
                Share your team headcount, technical focus, and target quarter.
                A solutions architecture lead will respond within one business
                day with a tailored curriculum roadmap and Net-30 pricing
                proposal.
              </p>

              <ul className="acad-biz-consult-points">
                <li>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>
                    Custom lab alignment for AWS, Azure, Power BI, and NIST CSF
                    2.0
                  </span>
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>
                    Flexible private schedules across North America, EMEA, and
                    West Africa
                  </span>
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>
                    Formal Net-30 Purchase Order documentation in USD, GBP, or
                    GHS
                  </span>
                </li>
              </ul>

              <div className="acad-biz-consult-direct">
                Prefer to speak directly? Call{" "}
                <strong>{SITE_CONFIG.CONTACT.PHONE_DISPLAY}</strong> or email{" "}
                <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL_ACADEMY}`}>
                  {SITE_CONFIG.CONTACT.EMAIL_ACADEMY}
                </a>
                .
              </div>
            </div>

            <div className="acad-biz-consult-card">
              {consultRef ? (
                <div className="acad-biz-consult-success" role="status">
                  <div className="acad-success-icon-wrap">
                    <CheckCircle2 size={32} color="var(--ok)" />
                  </div>
                  <h3>Consultation Request Received</h3>
                  <p>
                    Thank you, <strong>{consultName}</strong>. Our enterprise
                    enablement team has logged your request for{" "}
                    <strong>{consultOrg}</strong> and will reach out to{" "}
                    <strong>{consultEmail}</strong> shortly.
                  </p>
                  <div className="acad-biz-consult-ref">
                    Reference: <strong>{consultRef}</strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <Link
                      href={`/academy/tuition?mode=corporate&seats=${seatCount}`}
                      className="btn btn-gold btn-sm"
                    >
                      <span>Generate Instant Seat Quote</span>
                      <ArrowRight size={14} />
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setConsultRef("");
                        setConsultNotes("");
                      }}
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleConsultSubmit}
                  className="acad-biz-consult-form"
                >
                  <h3>Scope Your Team Training Plan</h3>

                  {consultError && (
                    <div
                      className="alert-error"
                      role="alert"
                      style={{ marginBottom: 0 }}
                    >
                      {consultError}
                    </div>
                  )}

                  <div className="acad-biz-consult-row">
                    <div className="acad-field">
                      <label htmlFor="biz-consult-name">Your Full Name *</label>
                      <input
                        id="biz-consult-name"
                        type="text"
                        required
                        className="acad-input"
                        placeholder="e.g. Kwame Mensah"
                        value={consultName}
                        onChange={(e) => setConsultName(e.target.value)}
                      />
                    </div>
                    <div className="acad-field">
                      <label htmlFor="biz-consult-email">Work Email *</label>
                      <input
                        id="biz-consult-email"
                        type="email"
                        required
                        className="acad-input"
                        placeholder="k.mensah@company.com"
                        value={consultEmail}
                        onChange={(e) => setConsultEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="acad-biz-consult-row">
                    <div className="acad-field">
                      <label htmlFor="biz-consult-org">
                        Organization / Company *
                      </label>
                      <input
                        id="biz-consult-org"
                        type="text"
                        required
                        className="acad-input"
                        placeholder="e.g. Meridian Financial Group"
                        value={consultOrg}
                        onChange={(e) => setConsultOrg(e.target.value)}
                      />
                    </div>
                    <div className="acad-field">
                      <label htmlFor="biz-consult-phone">
                        Phone / WhatsApp
                      </label>
                      <input
                        id="biz-consult-phone"
                        type="tel"
                        className="acad-input"
                        placeholder="+1 (555) 234-5678"
                        value={consultPhone}
                        onChange={(e) => setConsultPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="acad-biz-consult-row">
                    <div className="acad-field">
                      <label htmlFor="biz-consult-size">
                        Estimated Team Size
                      </label>
                      <select
                        id="biz-consult-size"
                        className="acad-select"
                        value={consultTeamSize}
                        onChange={(e) => setConsultTeamSize(e.target.value)}
                      >
                        <option value="5 to 14 seats">
                          5 to 14 seats (Team Pack)
                        </option>
                        <option value="15 to 29 seats">
                          15 to 29 seats (Private Cohort)
                        </option>
                        <option value="30 to 99 seats">
                          30 to 99 seats (Enterprise Pool)
                        </option>
                        <option value="100+ seats">
                          100+ seats (Enterprise Custom)
                        </option>
                      </select>
                    </div>
                    <div className="acad-field">
                      <label htmlFor="biz-consult-track">
                        Primary Training Focus
                      </label>
                      <select
                        id="biz-consult-track"
                        className="acad-select"
                        value={consultTrack}
                        onChange={(e) => setConsultTrack(e.target.value)}
                      >
                        <option value="Cloud, DevOps & Kubernetes">
                          Cloud, DevOps &amp; Kubernetes
                        </option>
                        <option value="Enterprise Data, SQL & Power BI">
                          Enterprise Data, SQL &amp; Power BI
                        </option>
                        <option value="Cybersecurity & Zero-Trust Compliance">
                          Cybersecurity &amp; Compliance Ops
                        </option>
                        <option value="Executive Data Literacy & Applied AI">
                          Executive Data Literacy &amp; AI
                        </option>
                        <option value="Multi-Department Capability Program">
                          Multi-Department Capability Program
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="acad-field">
                    <label htmlFor="biz-consult-notes">
                      Training Goals &amp; Preferred Timeline
                    </label>
                    <textarea
                      id="biz-consult-notes"
                      rows={3}
                      className="acad-textarea"
                      placeholder="Tell us about your team's cloud/data stack, target quarter, or private cohort preferences..."
                      value={consultNotes}
                      onChange={(e) => setConsultNotes(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={consultBusy}
                    className="btn btn-gold btn-block"
                  >
                    {consultBusy ? (
                      <>
                        <Loader2 size={16} className="acad-btn-spinner" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Request Corporate Consultation</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
