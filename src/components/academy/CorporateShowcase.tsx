"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  Cpu,
  FileText,
  Layers,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  formatCurrencyAmount,
  getCorporateDiscountPercent,
  type Course,
  type CurrencyCode,
} from "@/lib/academyStore";
import { CORPORATE_LEARNING_PLANS } from "@/lib/curriculumAssessments";
import { getClientDetectedRegion } from "@/lib/geoCurrency";

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
    feature: "Automated Volume Discount",
    team: "10% off (5 to 14) · 15% off (15 to 29)",
    enterprise: "22% off standard (30+ seats)",
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
    targetAudience: "Cross-functional product squads, business analysts, operations, and junior IT",
    durationText: "4 Weeks · 8 Guided Live Sessions",
    summary:
      "Establish an aligned technical baseline across non-platform staff to eliminate silos, enforce secure cloud habits, and harness generative AI tooling safely.",
    competencies: [
      "Core cloud computing primitives across AWS & Azure",
      "Responsible Generative AI & GitHub Copilot workflows",
      "Essential zero-trust security hygiene & credential protection",
      "Git collaborative version control & structured engineering tickets",
    ],
    deliverable: "Company-Wide Cloud & AI Literacy Digital Badge + Shared Tech Taxonomy",
    tools: ["AWS Console", "GitHub Copilot", "Claude Code", "Jira", "Git"],
  },
  {
    id: "tier-engineering",
    tierNumber: "Tier 02",
    badge: "Role-Aligned Engineering",
    title: "Practitioner Engineering & Production Bootcamps",
    targetAudience: "Software engineers, cloud practitioners, data analysts, and security engineers",
    durationText: "8–12 Weeks · 24–36 Hands-on Cohort Sessions",
    summary:
      "Deep technical reskilling into production-grade infrastructure, automated deployment pipelines, data warehouse modeling, and zero-trust perimeter defense.",
    competencies: [
      "Modular Infrastructure-as-Code with Terraform & OpenTofu",
      "Multi-stage Docker packaging & GitHub Actions CI/CD gates",
      "Kubernetes pod scheduling, ingress control & HPA autoscaling",
      "dbt semantic transformation, SQL contracts & Power BI DAX",
      "HashiCorp Vault secret rotation & Trivy image scanning",
    ],
    deliverable: "Production Infrastructure Capstone + Net-30 Invoiced Cohort Telemetry",
    tools: ["Terraform", "Docker", "Kubernetes", "AWS EKS", "dbt", "Power BI", "Vault"],
  },
  {
    id: "tier-leadership",
    tierNumber: "Tier 03",
    badge: "Executive & Strategic Leadership",
    title: "Platform Architecture, FinOps & Cloud Governance",
    targetAudience: "Principal architects, engineering leads, VPs of Technology, and FinOps practitioners",
    durationText: "6 Weeks · Executive Architecture Roundtables",
    summary:
      "High-level strategic enablement for technology leaders managing multi-cloud migration, cloud spend unit economics, regulatory compliance, and platform engineering teams.",
    competencies: [
      "Multi-account AWS Control Tower & Azure Landing Zone architecture",
      "FinOps foundation framework: Cloud cost allocation & tag policies",
      "Zero-Trust compliance readiness (SOC2, ISO 27001, PCI-DSS)",
      "Internal Developer Platform (IDP) strategy & engineering velocity metrics",
    ],
    deliverable: "Enterprise Architecture Review Blueprint + FinOps Unit Cost Action Plan",
    tools: ["AWS Organizations", "Control Tower", "OpenCost", "Datadog", "Prometheus"],
  },
];

export function CorporateShowcase({ courses = [] }: { courses?: Course[] }) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses[0]?.id || "course-cloud-devops"
  );
  const [seatCount, setSeatCount] = useState<number>(15);
  const [activeDept, setActiveDept] = useState<DepartmentPreview["id"]>("platform");

  useEffect(() => {
    setCurrency(getClientDetectedRegion().currency);
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) || courses[0],
    [courses, selectedCourseId]
  );

  const discountPct = getCorporateDiscountPercent(seatCount);
  const baseUnitUsd = selectedCourse?.tuitionUsd || 1000;
  const discountedUnitUsd = Math.round(baseUnitUsd * (1 - discountPct / 100));
  const netTotalUsd = discountedUnitUsd * seatCount;
  const currentDept =
    DEPARTMENT_PREVIEWS.find((d) => d.id === activeDept) || DEPARTMENT_PREVIEWS[0];

  return (
    <main id="main">
      {/* Dark Architectural Hero for Business Visitors */}
      <section className="acad-biz-hero">
        <div className="container acad-biz-hero-inner">
          <div className="acad-biz-hero-copy">
            <div className="acad-biz-kicker">
              <Building2 size={15} aria-hidden="true" />
              <span>For Businesses &amp; Engineering Teams</span>
            </div>
            <h1>Workforce Cloud, Data &amp; Security Training Built for Teams</h1>
            <p className="acad-biz-hero-lead">
              Equip 5 or more engineers with instructor-led cohorts aligned to real cloud, BI, and zero-trust security workflows. Manage seat quotas, Net-30 invoicing, and completion telemetry from one portal.
            </p>
            <div className="acad-biz-hero-actions">
              <Link href="/academy/tuition?mode=corporate" className="btn btn-gold">
                <span>Configure Seat Quote</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/academy/corporate/signin" className="btn acad-biz-btn-ghost">
                <span>For Business Sign In</span>
              </Link>
              <Link href="/academy/corporate/register" className="btn acad-biz-btn-ghost">
                <span>Create Business Account</span>
              </Link>
            </div>
          </div>

          <div className="acad-biz-hero-stats">
            <div className="acad-biz-stat-item">
              <strong>5+ Seats</strong>
              <span>Instant corporate quota provisioning &amp; seat reassignment</span>
            </div>
            <div className="acad-biz-stat-item">
              <strong>10% to 22%</strong>
              <span>Automated volume discount scaling cleanly by team size</span>
            </div>
            <div className="acad-biz-stat-item">
              <strong>Net-30 PO</strong>
              <span>Instant multi-currency quotes for US, UK &amp; West Africa hubs</span>
            </div>
            <div className="acad-biz-stat-item">
              <strong>CSV + Verified</strong>
              <span>Real-time module mastery telemetry &amp; Open Badges v2 outputs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Departmental Learning Pathways (SkillSets Equivalent) */}
      <section className="acad-section acad-section-compact">
        <div className="container">
          <div className="acad-section-head">
            <div>
              <h2>Departmental Engineering Pathways</h2>
              <p className="acad-section-sub">
                Pre-sequenced multi-course tracks designed to upskill specific technical functions from fundamentals to production operations.
              </p>
            </div>
            <Link href="/academy/tuition?mode=corporate" className="btn btn-navy btn-sm">
              <span>Quote Any Pathway</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="acad-biz-plan-cards">
            {CORPORATE_LEARNING_PLANS.map((plan) => {
              const matchedCourses = courses.filter((c) => plan.courseIds.includes(c.id));
              const totalWeeks = matchedCourses.reduce((acc, c) => acc + c.durationWeeks, 0);
              return (
                <article key={plan.id} className="acad-biz-pathway-card">
                  <div className="acad-biz-pathway-dept">{plan.targetDepartment}</div>
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
                    {matchedCourses.map((c) => (
                      <Link key={c.id} href={`/academy/courses/${c.slug}`}>
                        {c.title}
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3-Tier Enterprise Technical Capability Framework */}
      <section className="acad-section acad-section-compact acad-biz-framework-section" id="enterprise-framework">
        <div className="container">
          <div className="acad-section-head">
            <div>
              <span className="acad-overview-label" style={{ color: "var(--blue)" }}>
                WORKFORCE CAPABILITY BLUEPRINT
              </span>
              <h2>3-Tier Enterprise Technical Capability Framework</h2>
              <p className="acad-section-sub">
                Structured on world-class workforce transformation models: from organization-wide technical fluency to intensive engineering bootcamps and executive cloud governance.
              </p>
            </div>
            <Link href="/academy/tuition?mode=corporate" className="btn btn-navy btn-sm">
              <span>Schedule Capability Scoping</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="acad-biz-framework-grid">
            {ENTERPRISE_TIERS.map((tier) => (
              <div key={tier.id} className="acad-biz-tier-card">
                <div className="acad-biz-tier-top">
                  <span className="acad-biz-tier-num">{tier.tierNumber}</span>
                  <span className="acad-biz-tier-badge">{tier.badge}</span>
                </div>
                <h3>{tier.title}</h3>
                <p className="acad-biz-tier-summary">{tier.summary}</p>

                <div className="acad-biz-tier-meta">
                  <div>
                    <span className="acad-biz-tier-meta-lbl">Target Audience</span>
                    <strong>{tier.targetAudience}</strong>
                  </div>
                  <div>
                    <span className="acad-biz-tier-meta-lbl">Delivery Format</span>
                    <strong>{tier.durationText}</strong>
                  </div>
                </div>

                <div className="acad-biz-tier-comps">
                  <span className="acad-biz-tier-meta-lbl">Core Competencies</span>
                  <ul className="acad-biz-tier-list">
                    {tier.competencies.map((comp, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={14} color="var(--blue)" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="acad-biz-tier-deliverable">
                  <Award size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: "2px" }} />
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
                    className="btn btn-outline btn-block btn-sm"
                  >
                    <span>Request {tier.tierNumber} Syllabus &amp; Pricing</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Volume Pricing & Team vs Enterprise Comparison */}
      <section className="acad-section acad-section-tint" id="compare-plans">
        <div className="container">
          <div className="acad-section-head">
            <div>
              <h2>Team &amp; Enterprise Volume Plans</h2>
              <p className="acad-section-sub">
                Preview live seat discounts using your program selection, or review side-by-side plan capabilities across team sizes.
              </p>
            </div>
          </div>

          <div className="acad-biz-compare-layout">
            {/* Left: Interactive Seat Discount Preview */}
            <div className="acad-card acad-biz-estimator">
              <div className="acad-biz-est-head">
                <Users size={18} color="var(--blue)" />
                <h3>Interactive Seat Volume Estimator</h3>
              </div>

              {courses.length > 0 && (
                <div className="acad-field" style={{ marginBottom: "14px" }}>
                  <label htmlFor="biz-est-course">Reference Program</label>
                  <select
                    id="biz-est-course"
                    className="acad-select"
                    value={selectedCourse?.id || selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({formatCurrencyAmount(c.tuitionUsd, currency)} base)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="acad-biz-seat-presets" role="group" aria-label="Select seat count tier">
                {[5, 10, 15, 25, 30, 50].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setSeatCount(qty)}
                    className={`acad-biz-seat-btn ${seatCount === qty ? "active" : ""}`}
                  >
                    {qty} Seats
                  </button>
                ))}
              </div>

              <div className="acad-tier-strip" style={{ margin: "14px 0" }}>
                <div className={`acad-tier-step ${seatCount >= 5 && seatCount < 15 ? "active" : ""}`}>
                  <span>5 to 14 Seats</span>
                  <strong>10% off</strong>
                </div>
                <div className={`acad-tier-step ${seatCount >= 15 && seatCount < 30 ? "active" : ""}`}>
                  <span>15 to 29 Seats</span>
                  <strong>15% off</strong>
                </div>
                <div className={`acad-tier-step ${seatCount >= 30 ? "active" : ""}`}>
                  <span>30+ Seats</span>
                  <strong>22% off</strong>
                </div>
              </div>

              <div className="acad-biz-est-totals">
                <div>
                  <span>Applied Volume Tier</span>
                  <strong style={{ color: "var(--ok-text)" }}>-{discountPct}% Discount</strong>
                </div>
                <div>
                  <span>Estimated Total ({seatCount} Seats · {currency})</span>
                  <strong style={{ fontSize: "1.28rem", color: "var(--navy)" }}>
                    {formatCurrencyAmount(netTotalUsd, currency)}
                  </strong>
                </div>
              </div>

              <Link
                href={`/academy/tuition?mode=corporate&course=${encodeURIComponent(selectedCourse?.id || "")}`}
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
                      <th>Enterprise Plan (30+ Seats)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLAN_FEATURES.map((row) => (
                      <tr key={row.feature}>
                        <td className="acad-biz-compare-cap">{row.feature}</td>
                        <td data-label="Team Plan (5 to 29 Seats)">
                          <span className="acad-biz-cell-check">
                            <Check size={14} color="var(--blue)" aria-hidden="true" />
                            <span>{row.team}</span>
                          </span>
                        </td>
                        <td data-label="Enterprise Plan (30+ Seats)">
                          <span className="acad-biz-cell-check">
                            <CheckCircle2 size={14} color="var(--ok)" aria-hidden="true" />
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

      {/* Visual Engineering Lead Skills & Proficiency Dashboard Preview */}
      <section className="acad-section acad-section-compact" id="telemetry-preview">
        <div className="container">
          <div className="acad-section-head">
            <div>
              <h2>Engineering Lead Visibility &amp; Telemetry Preview</h2>
              <p className="acad-section-sub">
                Monitor module mastery, checkpoint exam averages, and credential readiness across departments. Illustrative sample preview shown below prior to sign-in.
              </p>
            </div>
            <div className="acad-cat-view-switch" role="tablist" aria-label="Department telemetry preview">
              {DEPARTMENT_PREVIEWS.map((dept) => (
                <button
                  key={dept.id}
                  type="button"
                  role="tab"
                  aria-selected={activeDept === dept.id}
                  onClick={() => setActiveDept(dept.id)}
                  className={`acad-cat-view-btn ${activeDept === dept.id ? "active" : ""}`}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </div>

          <div className="acad-card acad-biz-telemetry-preview">
            <div className="acad-biz-telemetry-top">
              <div>
                <div className="acad-overview-label" style={{ marginBottom: "4px" }}>
                  Sample Telemetry Preview · {currentDept.label}
                </div>
                <h3 style={{ margin: 0, color: "var(--navy)", fontSize: "1.18rem" }}>
                  {currentDept.headline}
                </h3>
              </div>
              <span className="acad-biz-preview-tag">
                <BarChart3 size={14} aria-hidden="true" />
                <span>Lead Dashboard View</span>
              </span>
            </div>

            <div className="acad-biz-preview-kpis">
              <div className="acad-biz-preview-kpi">
                <span>Cohort Module Completion</span>
                <strong style={{ color: "var(--blue)" }}>{currentDept.completionRate}%</strong>
              </div>
              <div className="acad-biz-preview-kpi">
                <span>Checkpoint Assessment Avg</span>
                <strong style={{ color: "var(--navy)" }}>{currentDept.assessmentAvg}%</strong>
              </div>
              <div className="acad-biz-preview-kpi">
                <span>Capstone Certification Ready</span>
                <strong style={{ color: "var(--ok-text)" }}>{currentDept.capstoneReadiness}%</strong>
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

          {/* Organization Sign-In & Onboarding Footer Strip */}
          <div className="acad-biz-admin-banner">
            <div className="acad-biz-admin-copy">
              <ShieldCheck size={20} color="var(--blue)" />
              <div>
                <strong>Already managing an active organization seat quota?</strong>
                <span>
                  Sign in as an organization administrator to assign staff seats, filter team progress, and export CSV reports.
                </span>
              </div>
            </div>
            <div className="acad-biz-admin-actions">
              <Link href="/academy/corporate/signin" className="btn btn-navy btn-sm">
                For Business Sign In
              </Link>
              <Link href="/academy/corporate/register" className="btn btn-outline btn-sm">
                Create Organization Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
