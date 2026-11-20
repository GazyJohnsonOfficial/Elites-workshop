"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Cloud,
  Compass,
  Cpu,
  Database,
  Globe2,
  GraduationCap,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  ACADEMY_CATEGORIES,
  formatCurrencyAmount,
  type AcademyCategory,
  type Course,
  type CurrencyCode,
} from "@/lib/academyStore";
import {
  BUSINESS_CAREER_PATHS,
  BUSINESS_ECOSYSTEM_PILLARS,
  BUSINESS_MARKET_SIGNALS,
  INDIVIDUAL_CAREER_PATHS,
  INDIVIDUAL_ECOSYSTEM_PILLARS,
  INDIVIDUAL_MARKET_SIGNALS,
} from "@/lib/careerPaths";
import {
  recommendTrackPathway,
  type PathfinderInput,
} from "@/lib/curriculumAssessments";
import { PixelCanvas } from "./AcademyHero";

const DOMAIN_FILTERS: Array<"all" | AcademyCategory> = [
  "all",
  ...ACADEMY_CATEGORIES,
];

type DossierTab = "opportunities" | "expertise" | "system";

function DomainBadgeIcon({ domain }: { domain: AcademyCategory }) {
  if (domain === "Data & BI") return <Database size={14} aria-hidden="true" />;
  if (domain === "Cloud & DevOps") return <Cloud size={14} aria-hidden="true" />;
  if (domain === "Cybersecurity") return <ShieldCheck size={14} aria-hidden="true" />;
  return <Cpu size={14} aria-hidden="true" />;
}

export function CareerPathsClient({
  audience,
  courses,
  initialCurrency = "USD",
}: {
  audience: "individual" | "business";
  courses: Course[];
  initialCurrency?: CurrencyCode;
}) {
  const isBusiness = audience === "business";
  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [selectedDomain, setSelectedDomain] = useState<"all" | AcademyCategory>("all");
  const [query, setQuery] = useState("");
  const [activeTabs, setActiveTabs] = useState<Record<string, DossierTab>>({});

  // Interactive Role Alignment Studio (Individual view)
  const [matcherInput, setMatcherInput] = useState<PathfinderInput>({
    background: "none",
    targetRole: "bi_analyst",
    pace: "all",
    audience: "individual",
  });

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
      window.removeEventListener("ets-region-currency-changed", handleRegionChange);
    };
  }, []);

  const courseById = useMemo(() => {
    const map: Record<string, Course> = {};
    for (const c of courses) {
      map[c.id] = c;
    }
    return map;
  }, [courses]);

  const pixelColors = useMemo(
    () =>
      isBusiness
        ? [
            "rgba(76, 155, 255, 0.24)",
            "rgba(245, 184, 46, 0.26)",
            "rgba(147, 197, 253, 0.14)",
          ]
        : [
            "rgba(45, 79, 214, 0.18)",
            "rgba(76, 155, 255, 0.2)",
            "rgba(245, 184, 46, 0.2)",
          ],
    [isBusiness]
  );

  const getTab = (pathId: string): DossierTab => activeTabs[pathId] || "opportunities";
  const setTab = (pathId: string, tab: DossierTab) => {
    setActiveTabs((prev) => ({ ...prev, [pathId]: tab }));
  };

  const filteredIndividualPaths = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INDIVIDUAL_CAREER_PATHS.filter((path) => {
      if (selectedDomain !== "all" && path.domain !== selectedDomain) return false;
      if (!q) return true;
      const recCourseTitles = path.recommendedPrograms
        .map((p) => courseById[p.courseId]?.title || "")
        .join(" ");
      const ladderRoles = path.careerLadder.map((t) => `${t.roleTitle} ${t.responsibilities}`).join(" ");
      const hay = [
        path.title,
        path.professionCategory,
        path.executiveOverview,
        path.domain,
        path.startingLevel,
        path.idealFor,
        path.jobMarket.demandOutlook,
        ...path.jobMarket.hiringIndustries,
        ...path.jobMarket.marketDrivers,
        ...path.expertise.technicalExpertise,
        ...path.expertise.productionToolchain,
        ladderRoles,
        recCourseTitles,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [selectedDomain, query, courseById]);

  const filteredBusinessPaths = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BUSINESS_CAREER_PATHS.filter((path) => {
      if (selectedDomain !== "all" && path.domain !== selectedDomain) return false;
      if (!q) return true;
      const recCourseTitles = path.recommendedPrograms
        .map((p) => courseById[p.courseId]?.title || "")
        .join(" ");
      const hay = [
        path.title,
        path.executiveOverview,
        path.department,
        path.domain,
        path.talentMarket.marketChallenge,
        ...path.talentMarket.targetSectors,
        ...path.talentMarket.operationalDrivers,
        ...path.teamExpertise.technicalStandards,
        ...path.teamExpertise.rolesTransformed,
        recCourseTitles,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [selectedDomain, query, courseById]);

  const activePathCount = isBusiness
    ? filteredBusinessPaths.length
    : filteredIndividualPaths.length;

  const macroSignals = isBusiness ? BUSINESS_MARKET_SIGNALS : INDIVIDUAL_MARKET_SIGNALS;
  const ecosystemPillars = isBusiness
    ? BUSINESS_ECOSYSTEM_PILLARS
    : INDIVIDUAL_ECOSYSTEM_PILLARS;

  const matcherRec = useMemo(
    () =>
      recommendTrackPathway({ ...matcherInput, audience: "individual" }, courses),
    [matcherInput, courses]
  );
  const matcherPrimary = courseById[matcherRec.primaryCourseId];
  const matcherSecondary = courseById[matcherRec.secondaryCourseId];

  return (
    <main id="main">
      {/* ============ 1. CAREER INTELLIGENCE & WORKFORCE STRATEGY HERO ============ */}
      <section
        className={`acad-cp-hero ${isBusiness ? "is-business" : "is-individual"}`}
        aria-labelledby="acad-cp-hero-title"
      >
        <PixelCanvas colors={pixelColors} gap={14} speed={20} />
        <div className="acad-cp-hero-vignette" aria-hidden="true" />

        <div className="container acad-cp-hero-inner">
          <div className="acad-cp-hero-copy">
            <div className="acad-cp-hero-top-row">
              <span className="acad-cp-kicker">
                {isBusiness ? (
                  <Building2 size={14} aria-hidden="true" />
                ) : (
                  <GraduationCap size={14} aria-hidden="true" />
                )}
                <span>
                  {isBusiness
                    ? "For Businesses · Workforce Capability & Talent Strategy"
                    : "For Individuals · Tech Career Intelligence & Market Guide"}
                </span>
              </span>

              <div
                className="acad-cp-aud-switch"
                role="navigation"
                aria-label="Switch between Individual Career Guide and Business Workforce Pathways"
              >
                <Link
                  href="/academy/paths"
                  className={`acad-cp-aud-pill ${!isBusiness ? "active" : ""}`}
                >
                  Individual Careers
                </Link>
                <Link
                  href="/academy/corporate/paths"
                  className={`acad-cp-aud-pill ${isBusiness ? "active" : ""}`}
                >
                  Business Workforce
                </Link>
              </div>
            </div>

            <h1 id="acad-cp-hero-title">
              {isBusiness
                ? "Enterprise Capability Paths Built Around Real Talent Markets"
                : "Navigate High-Growth Tech Careers With Market Clarity"}
            </h1>

            <p className="acad-cp-hero-lead">
              {isBusiness
                ? "Understand external hiring bottlenecks, build-vs-buy economics, departmental maturity ladders, and the exact technical governance standards modern teams need—delivered in collaboration with Elites Technology Systems' consulting and enterprise academy platform."
                : "Go beyond course listings. Examine real career opportunities, hiring demand, global compensation ladders, day-to-day practitioner expertise, and what hiring managers actually test—paired with the best programs and tools inside the Elites Tech Systems ecosystem."}
            </p>

            <div className="acad-cp-hero-actions">
              {isBusiness ? (
                <>
                  <a href="#career-dossiers" className="btn btn-gold">
                    <span>Explore Capability Tracks</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <Link
                    href="/academy/corporate#request-demo"
                    className="btn acad-biz-btn-ghost"
                  >
                    <span>Book Workforce Strategy Call</span>
                  </Link>
                </>
              ) : (
                <>
                  <a href="#career-dossiers" className="btn btn-gold">
                    <span>Explore Career Opportunities</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <a href="#path-matcher" className="btn btn-outline">
                    <Compass size={16} aria-hidden="true" />
                    <span>Match My Career Profile</span>
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="acad-cp-hero-stats">
            <div className="acad-cp-stat-box">
              <strong>
                {isBusiness
                  ? `${BUSINESS_CAREER_PATHS.length} Core Functions`
                  : `${INDIVIDUAL_CAREER_PATHS.length} Career Tracks`}
              </strong>
              <span>
                {isBusiness
                  ? "Cloud, Data, Security, FinOps & AI"
                  : "Entry-level to Senior Architect ladders"}
              </span>
            </div>
            <div className="acad-cp-stat-box">
              <strong>3-Tier Ladders</strong>
              <span>
                {isBusiness
                  ? "Baseline → Autonomy → Center of Excellence"
                  : "Associate → Practitioner → Senior benchmarks"}
              </span>
            </div>
            <div className="acad-cp-stat-box">
              <strong>Consulting-Backed</strong>
              <span>
                {isBusiness
                  ? "Aligned to live AWS, Azure, BI & NIST controls"
                  : "Standards from active enterprise delivery"}
              </span>
            </div>
            <div className="acad-cp-stat-box">
              <strong>Open Badges v2</strong>
              <span>
                {isBusiness
                  ? "Audit-ready team telemetry & seat control"
                  : "Portfolio defense & verifiable credentials"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. MACRO JOB MARKET & WORKFORCE REALITY STRIP ============ */}
      <section className="acad-cp-macro-strip" aria-label="Job market intelligence overview">
        <div className="container">
          <div className="acad-cp-macro-grid">
            {macroSignals.map((signal) => (
              <div key={signal.headline} className="acad-cp-macro-card">
                <span className="acad-cp-macro-eyebrow">{signal.eyebrow}</span>
                <strong>{signal.headline}</strong>
                <p>{signal.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3. INTERACTIVE CAREER INTELLIGENCE DOSSIERS ============ */}
      <section className="acad-section acad-section-tint" id="career-dossiers">
        <div className="container">
          <div className="acad-cp-section-intro">
            <div>
              <span className="acad-cat-eyebrow">
                {isBusiness
                  ? "Organizational Capability Blueprints"
                  : "Career & Job Market Intelligence"}
              </span>
              <h2>
                {isBusiness
                  ? "Workforce Pathways, Talent Economics & Maturity Ladders"
                  : "Explore Professions, Job Markets, Expertise & Best-Fit Programs"}
              </h2>
              <p>
                {isBusiness
                  ? "Inspect each departmental track to review talent-market challenges, organizational maturity stages, core team standards, and the best corporate programs in our system."
                  : "Inspect any career track below to evaluate real hiring opportunities, compensation progression, technical and advisory expertise, hiring-manager benchmarks, and how Elites Tech Systems prepares you."}
              </p>
            </div>
          </div>

          <div className="acad-cp-filter-bar">
            <div
              className="acad-cp-domain-tabs"
              role="tablist"
              aria-label="Filter careers by domain"
            >
              {DOMAIN_FILTERS.map((dom) => {
                const active = selectedDomain === dom;
                return (
                  <button
                    key={dom}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedDomain(dom)}
                    className={`acad-cat-facet-chip ${active ? "active" : ""}`}
                  >
                    {dom === "all"
                      ? isBusiness
                        ? "All Functions"
                        : "All Careers"
                      : dom}
                  </button>
                );
              })}
            </div>

            <div className="acad-cp-search-wrap">
              <Search size={15} aria-hidden="true" />
              <input
                id="cp-career-search"
                name="careerSearch"
                type="search"
                className="acad-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isBusiness
                    ? "Search FinOps, SRE, Banking, BI..."
                    : "Search role, industry, SQL, SOC..."
                }
                aria-label="Filter career dossiers by role, industry, or expertise"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="acad-cat-search-clear"
                  aria-label="Clear filter"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="acad-cp-count-line">
            Showing <strong>{activePathCount}</strong>{" "}
            {isBusiness ? "enterprise workforce capability" : "career intelligence"}{" "}
            {activePathCount === 1 ? "blueprint" : "blueprints"}
            {selectedDomain !== "all" ? ` in ${selectedDomain}` : ""}
          </div>

          {activePathCount === 0 ? (
            <div className="acad-cat-empty">
              <h3>No career blueprints match your filter</h3>
              <p>
                Reset the domain or search term to explore all career tracks, market
                benchmarks, and required expertise profiles.
              </p>
              <button
                type="button"
                className="btn btn-navy btn-sm"
                onClick={() => {
                  setSelectedDomain("all");
                  setQuery("");
                }}
              >
                Show All Blueprints
              </button>
            </div>
          ) : isBusiness ? (
            /* ============ BUSINESS WORKFORCE BLUEPRINTS ============ */
            <div className="acad-cp-list">
              {filteredBusinessPaths.map((path, idx) => {
                const activeTab = getTab(path.id);
                const resolvedPrograms = path.recommendedPrograms
                  .map((rec) => ({
                    rec,
                    course: courseById[rec.courseId],
                  }))
                  .filter(
                    (
                      entry
                    ): entry is {
                      rec: (typeof path.recommendedPrograms)[number];
                      course: Course;
                    } => Boolean(entry.course)
                  );
                const firstCourse = resolvedPrograms[0]?.course;

                return (
                  <motion.article
                    key={path.id}
                    className="acad-cp-card"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.16) }}
                  >
                    {/* Header: Department Identity + Executive Narrative + Talent Market Bar */}
                    <div className="acad-cp-card-header">
                      <div className="acad-cp-card-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={path.heroImage}
                          alt={path.title}
                          width={420}
                          height={260}
                        />
                        <span className="acad-cp-thumb-badge gold">
                          <DomainBadgeIcon domain={path.domain} />
                          <span>{path.domain}</span>
                        </span>
                      </div>

                      <div className="acad-cp-card-intro">
                        <div className="acad-cp-meta-chips">
                          <span className="acad-cp-chip-dept">{path.department}</span>
                          <span className="acad-cp-chip-neutral">
                            <Users size={13} aria-hidden="true" />
                            {path.recommendedTeamSize}
                          </span>
                          <span className="acad-cp-chip-neutral">
                            <Layers size={13} aria-hidden="true" />
                            {path.deliveryFormat}
                          </span>
                        </div>

                        <h2>{path.title}</h2>
                        <p className="acad-cp-tagline">{path.executiveOverview}</p>

                        {/* Executive Talent Market Snapshot Bar */}
                        <div className="acad-cp-market-bar">
                          <div className="acad-cp-market-cell">
                            <span className="acad-cp-market-k">Talent Market Reality</span>
                            <strong>{path.talentMarket.marketChallenge}</strong>
                          </div>
                          <div className="acad-cp-market-cell">
                            <span className="acad-cp-market-k">Priority Industries</span>
                            <strong>
                              {path.talentMarket.targetSectors.slice(0, 3).join(" · ")}
                            </strong>
                          </div>
                          <div className="acad-cp-market-cell">
                            <span className="acad-cp-market-k">Roles Transformed</span>
                            <strong>
                              {path.teamExpertise.rolesTransformed.slice(0, 2).join(", ")} +{" "}
                              {Math.max(0, path.teamExpertise.rolesTransformed.length - 2)} more
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive 3-Tab Intelligence Switcher */}
                    <div className="acad-cp-dossier-nav" role="tablist" aria-label={`${path.title} sections`}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "opportunities"}
                        className={`acad-cp-tab-btn ${activeTab === "opportunities" ? "active" : ""}`}
                        onClick={() => setTab(path.id, "opportunities")}
                      >
                        <TrendingUp size={15} aria-hidden="true" />
                        <span>Maturity Ladder &amp; Talent Market</span>
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "expertise"}
                        className={`acad-cp-tab-btn ${activeTab === "expertise" ? "active" : ""}`}
                        onClick={() => setTab(path.id, "expertise")}
                      >
                        <Target size={15} aria-hidden="true" />
                        <span>Team Expertise &amp; Risk Governance</span>
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "system"}
                        className={`acad-cp-tab-btn ${activeTab === "system" ? "active" : ""}`}
                        onClick={() => setTab(path.id, "system")}
                      >
                        <BookOpen size={15} aria-hidden="true" />
                        <span>Best Programs &amp; Our System ({resolvedPrograms.length})</span>
                      </button>
                    </div>

                    {/* Tab Panel Content */}
                    <div className="acad-cp-dossier-body">
                      {activeTab === "opportunities" && (
                        <div className="acad-cp-panel">
                          <div className="acad-cp-callout-row">
                            <div className="acad-cp-insight-box">
                              <span className="acad-cp-sublabel">
                                Build vs. Buy Talent Economics
                              </span>
                              <p>{path.talentMarket.buildVsBuyAdvantage}</p>
                            </div>
                            <div className="acad-cp-insight-box">
                              <span className="acad-cp-sublabel">
                                Why Organizations Invest Now
                              </span>
                              <ul className="acad-cp-bullet-list">
                                {path.talentMarket.operationalDrivers.map((drv) => (
                                  <li key={drv}>
                                    <CheckCircle2 size={14} aria-hidden="true" />
                                    <span>{drv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="acad-cp-ladder-block">
                            <span className="acad-cp-sublabel">
                              Organizational Capability Maturity Ladder
                            </span>
                            <div className="acad-cp-ladder-grid">
                              {path.capabilityLadder.map((tier) => (
                                <div key={tier.stage} className="acad-cp-ladder-card">
                                  <div className="acad-cp-ladder-top">
                                    <span className="acad-cp-ladder-tier">{tier.stage}</span>
                                    <span className="acad-cp-ladder-kpi">{tier.targetKpi}</span>
                                  </div>
                                  <h3>{tier.capabilityTitle}</h3>
                                  <div className="acad-cp-ladder-meta">
                                    Target Staff: {tier.teamFocus}
                                  </div>
                                  <p>{tier.operationalOwnership}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "expertise" && (
                        <div className="acad-cp-panel">
                          <div className="acad-cp-expertise-grid">
                            <div className="acad-cp-exp-col">
                              <span className="acad-cp-sublabel">
                                Production Engineering &amp; Technical Standards
                              </span>
                              <ul className="acad-cp-bullet-list">
                                {path.teamExpertise.technicalStandards.map((item) => (
                                  <li key={item}>
                                    <CheckCircle2 size={14} aria-hidden="true" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="acad-cp-exp-col">
                              <span className="acad-cp-sublabel">
                                Governance, Leadership &amp; Operational Maturity
                              </span>
                              <ul className="acad-cp-bullet-list">
                                {path.teamExpertise.governanceCapabilities.map((item) => (
                                  <li key={item}>
                                    <ShieldCheck size={14} aria-hidden="true" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="acad-cp-hiring-bar-box">
                            <div className="acad-cp-hiring-bar-head">
                              <BarChart3 size={16} aria-hidden="true" />
                              <span>Operational Risk &amp; Audit Impact</span>
                            </div>
                            <p>{path.talentMarket.auditAndRiskImpact}</p>
                            <div className="acad-cp-roles-tags" style={{ marginTop: "10px" }}>
                              {path.teamExpertise.rolesTransformed.map((role) => (
                                <span key={role} className="acad-cp-role-tag">
                                  <Users size={12} aria-hidden="true" />
                                  <span>{role}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "system" && (
                        <div className="acad-cp-panel">
                          <div className="acad-cp-system-split">
                            {/* Left: System Collaboration */}
                            <div className="acad-cp-sys-box">
                              <span className="acad-cp-sys-kicker">
                                In Collaboration With Elites Tech Systems
                              </span>
                              <h3>How Our Enterprise System Builds This Capability</h3>
                              <p>{path.systemCollaboration.summary}</p>
                              <div className="acad-cp-sys-pillars">
                                {path.systemCollaboration.pillars.map((pillar) => (
                                  <Link
                                    key={pillar.label}
                                    href={pillar.href}
                                    className="acad-cp-sys-pillar-item"
                                  >
                                    <div>
                                      <strong>{pillar.label}</strong>
                                      <span>{pillar.detail}</span>
                                    </div>
                                    <ArrowRight size={14} aria-hidden="true" />
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Right: Best-Fit Programs */}
                            <div className="acad-cp-progs-col">
                              <div className="acad-cp-progs-head">
                                <span className="acad-cp-sublabel" style={{ margin: 0 }}>
                                  Best-Fit Programs for This Workforce Track
                                </span>
                                <span className="acad-cp-delivery-note">
                                  Standard Rate: {formatCurrencyAmount(3000, currency)} / seat
                                </span>
                              </div>
                              <div className="acad-cp-rec-list">
                                {resolvedPrograms.map(({ rec, course }) => (
                                  <div key={course.id} className="acad-cp-rec-card">
                                    <div className="acad-cp-rec-top">
                                      <span className="acad-cp-rec-badge gold">
                                        {rec.recommendationBadge}
                                      </span>
                                      <span className="acad-cp-stage-mode">
                                        {course.deliveryMode} · {course.durationWeeks} Wks
                                      </span>
                                    </div>
                                    <h4>
                                      <Link href={`/academy/courses/${course.slug}`}>
                                        {course.title}
                                      </Link>
                                    </h4>
                                    <p>{rec.whyItFitsCareer}</p>
                                    <div className="acad-cp-rec-foot">
                                      <Link
                                        href={`/academy/courses/${course.slug}`}
                                        className="acad-cp-stage-link"
                                      >
                                        <span>Inspect Program Syllabus</span>
                                        <ArrowRight size={13} aria-hidden="true" />
                                      </Link>
                                      <Link
                                        href={`/academy/tuition?mode=corporate&course=${encodeURIComponent(
                                          course.id
                                        )}&seats=15`}
                                        className="acad-cp-stage-link-muted"
                                      >
                                        Quote Seats
                                      </Link>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer: Deliverable + Quick Program Bridge + Actions */}
                    <div className="acad-cp-card-footer">
                      <div className="acad-cp-deliverable">
                        <Award size={16} aria-hidden="true" />
                        <span>
                          <strong>Organization Deliverable:</strong>{" "}
                          {path.systemCollaboration.governanceDeliverable}
                        </span>
                      </div>

                      <div className="acad-cp-card-actions">
                        {activeTab !== "system" && (
                          <button
                            type="button"
                            onClick={() => setTab(path.id, "system")}
                            className="btn btn-outline btn-sm"
                          >
                            <span>View Best Programs &amp; System Fit</span>
                          </button>
                        )}
                        <Link
                          href={
                            firstCourse
                              ? `/academy/tuition?mode=corporate&course=${encodeURIComponent(
                                  firstCourse.id
                                )}&seats=15`
                              : "/academy/tuition?mode=corporate"
                          }
                          className="btn btn-gold btn-sm"
                        >
                          <span>Configure Team Quote</span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            /* ============ INDIVIDUAL CAREER INTELLIGENCE DOSSIERS ============ */
            <div className="acad-cp-list">
              {filteredIndividualPaths.map((path, idx) => {
                const activeTab = getTab(path.id);
                const resolvedPrograms = path.recommendedPrograms
                  .map((rec) => ({
                    rec,
                    course: courseById[rec.courseId],
                  }))
                  .filter(
                    (
                      entry
                    ): entry is {
                      rec: (typeof path.recommendedPrograms)[number];
                      course: Course;
                    } => Boolean(entry.course)
                  );
                const firstCourse = resolvedPrograms[0]?.course;

                return (
                  <motion.article
                    key={path.id}
                    className="acad-cp-card"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.08 }}
                    transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.16) }}
                  >
                    {/* Top Career Identity + Executive Narrative + Job Market Snapshot Bar */}
                    <div className="acad-cp-card-header">
                      <div className="acad-cp-card-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={path.heroImage}
                          alt={path.title}
                          width={420}
                          height={260}
                        />
                        <span className="acad-cp-thumb-badge">
                          <DomainBadgeIcon domain={path.domain} />
                          <span>{path.domain}</span>
                        </span>
                      </div>

                      <div className="acad-cp-card-intro">
                        <div className="acad-cp-meta-chips">
                          <span className="acad-cp-chip-level">
                            {path.professionCategory}
                          </span>
                          <span className="acad-cp-chip-neutral">
                            <TrendingUp size={13} aria-hidden="true" />
                            {path.jobMarket.demandOutlook}
                          </span>
                          <span className="acad-cp-chip-neutral">
                            <Sparkles size={13} aria-hidden="true" />
                            {path.startingLevel}
                          </span>
                        </div>

                        <h2>{path.title}</h2>
                        <p className="acad-cp-tagline">{path.executiveOverview}</p>

                        <div className="acad-cp-ideal-line">
                          <strong>Who Thrives Here:</strong> {path.idealFor}
                        </div>

                        {/* 3-Cell Job Market Snapshot Bar */}
                        <div className="acad-cp-market-bar">
                          <div className="acad-cp-market-cell">
                            <span className="acad-cp-market-k">Global Comp Benchmark</span>
                            <strong>{path.jobMarket.globalCompRange}</strong>
                          </div>
                          <div className="acad-cp-market-cell">
                            <span className="acad-cp-market-k">Market Demand Signal</span>
                            <strong>{path.jobMarket.demandMetric}</strong>
                          </div>
                          <div className="acad-cp-market-cell">
                            <span className="acad-cp-market-k">Mobility &amp; Reach</span>
                            <strong>{path.jobMarket.regionalMobility}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive 3-Tab Career Intelligence Switcher */}
                    <div className="acad-cp-dossier-nav" role="tablist" aria-label={`${path.title} intelligence tabs`}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "opportunities"}
                        className={`acad-cp-tab-btn ${activeTab === "opportunities" ? "active" : ""}`}
                        onClick={() => setTab(path.id, "opportunities")}
                      >
                        <Briefcase size={15} aria-hidden="true" />
                        <span>Career Opportunities &amp; Job Market</span>
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "expertise"}
                        className={`acad-cp-tab-btn ${activeTab === "expertise" ? "active" : ""}`}
                        onClick={() => setTab(path.id, "expertise")}
                      >
                        <Target size={15} aria-hidden="true" />
                        <span>Core Expertise &amp; Hiring Bar</span>
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "system"}
                        className={`acad-cp-tab-btn ${activeTab === "system" ? "active" : ""}`}
                        onClick={() => setTab(path.id, "system")}
                      >
                        <BookOpen size={15} aria-hidden="true" />
                        <span>Best Programs &amp; Our System ({resolvedPrograms.length})</span>
                      </button>
                    </div>

                    {/* Tab Panel Content */}
                    <div className="acad-cp-dossier-body">
                      {activeTab === "opportunities" && (
                        <div className="acad-cp-panel">
                          {/* 3-Tier Career Progression Ladder */}
                          <div className="acad-cp-ladder-block">
                            <span className="acad-cp-sublabel">
                              Career Progression &amp; Role Opportunities
                            </span>
                            <div className="acad-cp-ladder-grid">
                              {path.careerLadder.map((tier) => (
                                <div key={tier.tier} className="acad-cp-ladder-card">
                                  <div className="acad-cp-ladder-top">
                                    <span className="acad-cp-ladder-tier">{tier.tier}</span>
                                    <span className="acad-cp-ladder-comp">
                                      {tier.compBenchmark}
                                    </span>
                                  </div>
                                  <h3>{tier.roleTitle}</h3>
                                  <div className="acad-cp-ladder-meta">
                                    Typical Horizon: {tier.typicalExperience}
                                  </div>
                                  <p>{tier.responsibilities}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Job Market Drivers & Top Hiring Industries */}
                          <div className="acad-cp-callout-row">
                            <div className="acad-cp-insight-box">
                              <span className="acad-cp-sublabel">
                                Why This Job Market Is Expanding
                              </span>
                              <ul className="acad-cp-bullet-list">
                                {path.jobMarket.marketDrivers.map((drv) => (
                                  <li key={drv}>
                                    <TrendingUp size={14} aria-hidden="true" />
                                    <span>{drv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="acad-cp-insight-box">
                              <span className="acad-cp-sublabel">
                                Top Hiring Sectors &amp; Employers
                              </span>
                              <div className="acad-cp-roles-tags" style={{ marginBottom: "12px" }}>
                                {path.jobMarket.hiringIndustries.map((sector) => (
                                  <span key={sector} className="acad-cp-role-tag">
                                    <Globe2 size={12} aria-hidden="true" />
                                    <span>{sector}</span>
                                  </span>
                                ))}
                              </div>
                              <p className="acad-cp-micro-note">
                                Compensation benchmarks reflect global remote, US, UK, and
                                senior enterprise bands; regional packages vary by market
                                and seniority.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "expertise" && (
                        <div className="acad-cp-panel">
                          <div className="acad-cp-expertise-grid">
                            <div className="acad-cp-exp-col">
                              <span className="acad-cp-sublabel">
                                Technical &amp; Production Expertise
                              </span>
                              <ul className="acad-cp-bullet-list">
                                {path.expertise.technicalExpertise.map((skill) => (
                                  <li key={skill}>
                                    <CheckCircle2 size={14} aria-hidden="true" />
                                    <span>{skill}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="acad-cp-exp-col">
                              <span className="acad-cp-sublabel">
                                Business, Architecture &amp; Advisory Expertise
                              </span>
                              <ul className="acad-cp-bullet-list">
                                {path.expertise.advisoryExpertise.map((skill) => (
                                  <li key={skill}>
                                    <ShieldCheck size={14} aria-hidden="true" />
                                    <span>{skill}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="acad-cp-toolchain-row">
                            <span className="acad-cp-sublabel">
                              Daily Industry Toolchain &amp; Stack
                            </span>
                            <div className="acad-cp-stage-tools">
                              {path.expertise.productionToolchain.map((tool) => (
                                <span key={tool} className="acad-cp-skill-chip">
                                  <CheckCircle2 size={12} aria-hidden="true" />
                                  <span>{tool}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="acad-cp-hiring-bar-box">
                            <div className="acad-cp-hiring-bar-head">
                              <BarChart3 size={16} aria-hidden="true" />
                              <span>What Hiring Managers Actually Evaluate in Interviews</span>
                            </div>
                            <ul className="acad-cp-bullet-list">
                              {path.jobMarket.hiringManagerBar.map((criteria) => (
                                <li key={criteria}>
                                  <Target size={14} aria-hidden="true" />
                                  <span>{criteria}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeTab === "system" && (
                        <div className="acad-cp-panel">
                          <div className="acad-cp-system-split">
                            {/* Left: How Our System Collaborates */}
                            <div className="acad-cp-sys-box">
                              <span className="acad-cp-sys-kicker">
                                In Collaboration With Elites Tech Systems
                              </span>
                              <h3>How Our System Prepares You for This Career</h3>
                              <p>{path.systemCollaboration.summary}</p>
                              <div className="acad-cp-sys-pillars">
                                {path.systemCollaboration.pillars.map((pillar) => (
                                  <Link
                                    key={pillar.label}
                                    href={pillar.href}
                                    className="acad-cp-sys-pillar-item"
                                  >
                                    <div>
                                      <strong>{pillar.label}</strong>
                                      <span>{pillar.detail}</span>
                                    </div>
                                    <ArrowRight size={14} aria-hidden="true" />
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Right: Best Programs Supporting This Career */}
                            <div className="acad-cp-progs-col">
                              <div className="acad-cp-progs-head">
                                <span className="acad-cp-sublabel" style={{ margin: 0 }}>
                                  Best-Fit Programs to Build This Career
                                </span>
                                <span className="acad-cp-delivery-note">
                                  {formatCurrencyAmount(3000, currency)} · 2 ×{" "}
                                  {formatCurrencyAmount(1500, currency)}
                                </span>
                              </div>
                              <div className="acad-cp-rec-list">
                                {resolvedPrograms.map(({ rec, course }) => (
                                  <div key={course.id} className="acad-cp-rec-card">
                                    <div className="acad-cp-rec-top">
                                      <span className="acad-cp-rec-badge">
                                        {rec.recommendationBadge}
                                      </span>
                                      <span className="acad-cp-stage-mode">
                                        {course.level} · {course.durationWeeks} Wks ·{" "}
                                        {course.deliveryMode}
                                      </span>
                                    </div>
                                    <h4>
                                      <Link href={`/academy/courses/${course.slug}`}>
                                        {course.title}
                                      </Link>
                                    </h4>
                                    <p>{rec.whyItFitsCareer}</p>
                                    <div className="acad-cp-rec-foot">
                                      <Link
                                        href={`/academy/courses/${course.slug}`}
                                        className="acad-cp-stage-link"
                                      >
                                        <span>Inspect Full Syllabus</span>
                                        <ArrowRight size={13} aria-hidden="true" />
                                      </Link>
                                      <Link
                                        href={`/academy/tuition?course=${encodeURIComponent(
                                          course.id
                                        )}`}
                                        className="acad-cp-stage-link-muted"
                                      >
                                        Start Enrollment
                                      </Link>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer: Career Proof Deliverable + Recommended Program Links */}
                    <div className="acad-cp-card-footer">
                      <div className="acad-cp-deliverable">
                        <Award size={16} aria-hidden="true" />
                        <span>
                          <strong>Employer-Verified Portfolio Proof:</strong>{" "}
                          {path.systemCollaboration.capstoneOutcome}
                        </span>
                      </div>

                      <div className="acad-cp-card-actions">
                        {activeTab !== "system" && (
                          <button
                            type="button"
                            onClick={() => setTab(path.id, "system")}
                            className="btn btn-outline btn-sm"
                          >
                            <span>Best Programs &amp; System Fit</span>
                          </button>
                        )}
                        {firstCourse && (
                          <Link
                            href={`/academy/courses/${firstCourse.slug}`}
                            className="btn btn-gold btn-sm"
                          >
                            <span>Explore Best Starting Program</span>
                            <ArrowRight size={14} aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============ 4. IN COLLABORATION WITH OUR SYSTEM (4-PILLAR ECOSYSTEM) ============ */}
      <section className="acad-cp-eco-section" aria-labelledby="acad-cp-eco-title">
        <div className="container">
          <div className="acad-cp-eco-head">
            <span className="acad-cp-eco-kicker">
              {isBusiness
                ? "Elites Technology Systems · Integrated Enterprise Ecosystem"
                : "In Collaboration With Elites Technology Systems"}
            </span>
            <h2 id="acad-cp-eco-title">
              {isBusiness
                ? "How Our Consulting & Academy System Accelerates Team Readiness"
                : "How Our Entire System Connects Career Strategy to Real Job Proof"}
            </h2>
            <p>
              {isBusiness
                ? "We are not a passive video library. Our consulting architects, hands-on lab platform, live manager telemetry, and Open Badges v2 verification work together as one capability engine."
                : "Choosing a career is only half the journey. Our academy operates directly alongside Elites Technology Systems' active cloud, data, and security engineering practice—giving you real tooling, real reviews, and verifiable credentials."}
            </p>
          </div>

          <div className="acad-cp-eco-grid">
            {ecosystemPillars.map((pillar) => (
              <div key={pillar.index} className="acad-cp-eco-card">
                <div className="acad-cp-eco-top">
                  <span className="acad-cp-eco-num">{pillar.index}</span>
                  <span className="acad-cp-eco-sub">{pillar.subtitle}</span>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
                <Link href={pillar.href} className="acad-cp-eco-link">
                  <span>{pillar.ctaLabel}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. INTERACTIVE CAREER PROFILE MATCHER OR ENTERPRISE SCOPING ============ */}
      <section className="acad-section" id="path-matcher">
        <div className="container">
          {isBusiness ? (
            <div className="acad-cp-biz-banner">
              <div className="acad-cp-biz-banner-copy">
                <span className="acad-overview-label" style={{ color: "var(--gold)" }}>
                  CUSTOM WORKFORCE ARCHITECTURE
                </span>
                <h2>Align Your Organization&apos;s Talent Roadmap With Our Architects</h2>
                <p>
                  Combine any of our {courses.length} active technical tracks with a
                  tailored skill-gap diagnostic, private cloud sandboxes, and Net-30
                  departmental seat allocation.
                </p>
              </div>
              <div className="acad-cp-biz-banner-actions">
                <Link
                  href="/academy/corporate#request-demo"
                  className="btn btn-gold"
                >
                  <span>Schedule Workforce Consultation</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/academy/corporate#corporate-catalog"
                  className="btn acad-biz-btn-ghost"
                >
                  <span>Browse Business Programs</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="acad-cp-matcher-card">
              <div className="acad-cp-matcher-head">
                <div>
                  <span className="acad-cat-eyebrow">
                    Career &amp; Expertise Alignment Studio
                  </span>
                  <h2>Match Your Background to the Right Career &amp; Best Starting Program</h2>
                  <p>
                    Tell us where you are starting from and the career you are targeting—our
                    system maps the exact technical skill gaps hiring managers evaluate and
                    recommends the best program to bridge them.
                  </p>
                </div>
                <Link href="/academy/get-started" className="btn btn-outline btn-sm">
                  <span>Full Guided Career Onboarding</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>

              <div className="acad-pathfinder-inputs">
                <div className="acad-pathfinder-field">
                  <label htmlFor="cp-bg">1. Current Professional Background</label>
                  <select
                    id="cp-bg"
                    className="acad-select"
                    value={matcherInput.background}
                    onChange={(e) =>
                      setMatcherInput((prev) => ({
                        ...prev,
                        background: e.target.value as PathfinderInput["background"],
                      }))
                    }
                  >
                    <option value="none">New to Tech / Career Switcher</option>
                    <option value="analyst">Business, Finance or Spreadsheet Reporting</option>
                    <option value="sysadmin">IT Support / Linux Administration</option>
                    <option value="developer">Software Developer / Engineer</option>
                  </select>
                </div>

                <div className="acad-pathfinder-field">
                  <label htmlFor="cp-role">2. Target Career Direction</label>
                  <select
                    id="cp-role"
                    className="acad-select"
                    value={matcherInput.targetRole}
                    onChange={(e) =>
                      setMatcherInput((prev) => ({
                        ...prev,
                        targetRole: e.target.value as PathfinderInput["targetRole"],
                      }))
                    }
                  >
                    <option value="bi_analyst">Data Analytics &amp; Business Intelligence</option>
                    <option value="it_support">IT Support &amp; Linux Infrastructure</option>
                    <option value="security">Cybersecurity SOC &amp; Cloud Defense</option>
                    <option value="ai_automation">Applied AI &amp; Workflow Automation</option>
                    <option value="data_eng">Analytics &amp; Data Engineering</option>
                    <option value="cloud_sre">Cloud Engineering &amp; Solutions Architecture</option>
                  </select>
                </div>

                <div className="acad-pathfinder-field">
                  <label htmlFor="cp-pace">3. Preferred Study Format</label>
                  <select
                    id="cp-pace"
                    className="acad-select"
                    value={matcherInput.pace}
                    onChange={(e) =>
                      setMatcherInput((prev) => ({
                        ...prev,
                        pace: e.target.value as PathfinderInput["pace"],
                      }))
                    }
                  >
                    <option value="all">Any Format</option>
                    <option value="Instructor-Led">Live Instructor-Led Workshops</option>
                    <option value="Self-Paced">Self-Paced Online Study</option>
                  </select>
                </div>
              </div>

              {matcherPrimary && (
                <div className="acad-pathfinder-result" style={{ marginTop: "16px" }}>
                  <div className="acad-pathfinder-result-copy">
                    <span className="acad-cat-eyebrow" style={{ marginBottom: "6px" }}>
                      Recommended System Bridge · {matcherRec.estimatedWeeks} Weeks Estimated
                    </span>
                    <h3>
                      Best Starting Program: {matcherPrimary.title}
                      {matcherSecondary && matcherSecondary.id !== matcherPrimary.id
                        ? ` → Specialization: ${matcherSecondary.title}`
                        : ""}
                    </h3>
                    <p>{matcherRec.summary}</p>
                    <div className="acad-pathfinder-gaps">
                      {matcherRec.skillGaps.map((gap) => (
                        <span key={gap} className="acad-prog-tool-btn acad-mono">
                          +{gap}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="acad-pathfinder-actions">
                    <Link
                      href={`/academy/courses/${matcherPrimary.slug}`}
                      className="btn btn-gold btn-sm"
                    >
                      <span>Inspect Recommended Program</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                    <Link
                      href={`/academy/tuition?course=${encodeURIComponent(
                        matcherPrimary.id
                      )}`}
                      className="btn btn-outline btn-sm"
                    >
                      Review Tuition &amp; Installments
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
