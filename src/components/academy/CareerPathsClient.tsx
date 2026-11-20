"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Cloud,
  Compass,
  Cpu,
  Database,
  GraduationCap,
  Layers,
  Search,
  ShieldCheck,
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
  INDIVIDUAL_CAREER_PATHS,
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

  // Interactive Role Matcher (Individual view)
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
            "rgba(76, 155, 255, 0.25)",
            "rgba(245, 184, 46, 0.26)",
            "rgba(147, 197, 253, 0.14)",
          ]
        : [
            "rgba(45, 79, 214, 0.2)",
            "rgba(76, 155, 255, 0.22)",
            "rgba(245, 184, 46, 0.22)",
          ],
    [isBusiness]
  );

  const filteredIndividualPaths = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INDIVIDUAL_CAREER_PATHS.filter((path) => {
      if (selectedDomain !== "all" && path.domain !== selectedDomain) return false;
      if (!q) return true;
      const stageTitles = path.stages
        .map((s) => courseById[s.courseId]?.title || "")
        .join(" ");
      const hay = [
        path.title,
        path.tagline,
        path.domain,
        path.startingLevel,
        path.idealFor,
        ...path.targetRoles,
        ...path.keySkills,
        stageTitles,
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
      const stageTitles = path.stages
        .map((s) => courseById[s.courseId]?.title || "")
        .join(" ");
      const hay = [
        path.title,
        path.tagline,
        path.department,
        path.domain,
        path.deliveryFormat,
        ...path.businessOutcomes,
        stageTitles,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [selectedDomain, query, courseById]);

  const activePathCount = isBusiness
    ? filteredBusinessPaths.length
    : filteredIndividualPaths.length;

  const matcherRec = useMemo(
    () =>
      recommendTrackPathway({ ...matcherInput, audience: "individual" }, courses),
    [matcherInput, courses]
  );
  const matcherPrimary = courseById[matcherRec.primaryCourseId];
  const matcherSecondary = courseById[matcherRec.secondaryCourseId];

  return (
    <main id="main">
      {/* ============ 1. AUDIENCE-TAILORED CAREER PATHS HERO ============ */}
      <section
        className={`acad-cp-hero ${isBusiness ? "is-business" : "is-individual"}`}
        aria-labelledby="acad-cp-hero-title"
      >
        <PixelCanvas colors={pixelColors} gap={13} speed={22} />
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
                    ? "For Businesses · Departmental Upskilling Paths"
                    : "For Individuals · Role-Based Career Roadmaps"}
                </span>
              </span>

              {/* Seamless Audience Switcher Between Individual & Business Paths */}
              <div
                className="acad-cp-aud-switch"
                role="navigation"
                aria-label="Switch between Individual and Business career paths"
              >
                <Link
                  href="/academy/paths"
                  className={`acad-cp-aud-pill ${!isBusiness ? "active" : ""}`}
                >
                  Individual Paths
                </Link>
                <Link
                  href="/academy/corporate/paths"
                  className={`acad-cp-aud-pill ${isBusiness ? "active" : ""}`}
                >
                  Business Team Paths
                </Link>
              </div>
            </div>

            <h1 id="acad-cp-hero-title">
              {isBusiness
                ? "Departmental Capability Pathways Built for Growing Engineering Teams"
                : "Structured Tech Career Paths From First Skill to Portfolio Proof"}
            </h1>

            <p className="acad-cp-hero-lead">
              {isBusiness
                ? "Sequence multi-course cloud, data, DevSecOps, FinOps, and applied AI tracks across your organization. Align every department around shared architectural standards, Net-30 invoicing, and measurable completion telemetry."
                : "Follow clear, multi-course learning roadmaps built around real IT, Data, Cloud, Cybersecurity, and Applied AI roles. Every stage pairs hands-on labs with a verified capstone and flexible 2-part installments."}
            </p>

            <div className="acad-cp-hero-actions">
              {isBusiness ? (
                <>
                  <Link
                    href="/academy/tuition?mode=corporate"
                    className="btn btn-gold"
                  >
                    <span>Configure Team Seat Quote</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <Link
                    href="/academy/corporate#request-demo"
                    className="btn acad-biz-btn-ghost"
                  >
                    <span>Scope Private Team Pathway</span>
                  </Link>
                </>
              ) : (
                <>
                  <a href="#path-matcher" className="btn btn-gold">
                    <Compass size={16} aria-hidden="true" />
                    <span>Match My Role &amp; Background</span>
                  </a>
                  <Link href="/academy#catalog" className="btn btn-outline">
                    <span>Browse All Individual Courses</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="acad-cp-hero-stats">
            <div className="acad-cp-stat-box">
              <strong>
                {isBusiness
                  ? BUSINESS_CAREER_PATHS.length
                  : INDIVIDUAL_CAREER_PATHS.length}
              </strong>
              <span>
                {isBusiness
                  ? "Departmental Team Pathways"
                  : "Role-Based Career Paths"}
              </span>
            </div>
            <div className="acad-cp-stat-box">
              <strong>{courses.length}</strong>
              <span>Active Academy Courses Linked</span>
            </div>
            <div className="acad-cp-stat-box">
              <strong>{formatCurrencyAmount(3000, currency)}</strong>
              <span>
                {isBusiness
                  ? `Per-Seat Standard Rate (${currency})`
                  : `Per Course · 2 × ${formatCurrencyAmount(1500, currency)}`}
              </span>
            </div>
            <div className="acad-cp-stat-box">
              <strong>Open Badges v2</strong>
              <span>Employer-Verifiable Credentials</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. FILTER BAR + ROADMAP CARDS ============ */}
      <section className="acad-section acad-section-tint" id="roadmaps">
        <div className="container">
          <div className="acad-cp-filter-bar">
            <div
              className="acad-cp-domain-tabs"
              role="tablist"
              aria-label="Filter career paths by domain"
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
                    {dom === "all" ? "All Domains" : dom}
                  </button>
                );
              })}
            </div>

            <div className="acad-cp-search-wrap">
              <Search size={15} aria-hidden="true" />
              <input
                type="search"
                className="acad-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isBusiness
                    ? "Search FinOps, Kubernetes, DevSecOps, BI..."
                    : "Search SOC Analyst, Cloud Architect, SQL, AI..."
                }
                aria-label="Filter career paths by role or skill"
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
            {isBusiness ? "enterprise team" : "individual career"}{" "}
            {activePathCount === 1 ? "pathway" : "pathways"}
            {selectedDomain !== "all" ? ` in ${selectedDomain}` : ""}
          </div>

          {activePathCount === 0 ? (
            <div className="acad-cat-empty">
              <h3>No pathways match your current filter</h3>
              <p>
                Reset the domain or search term to explore all structured career
                roadmaps.
              </p>
              <button
                type="button"
                className="btn btn-navy btn-sm"
                onClick={() => {
                  setSelectedDomain("all");
                  setQuery("");
                }}
              >
                Show All Pathways
              </button>
            </div>
          ) : isBusiness ? (
            /* ============ BUSINESS PATHWAY CARDS ============ */
            <div className="acad-cp-list">
              {filteredBusinessPaths.map((path, idx) => {
                const stageCourses = path.stages
                  .map((stage) => ({
                    stage,
                    course: courseById[stage.courseId],
                  }))
                  .filter(
                    (entry): entry is { stage: (typeof path.stages)[number]; course: Course } =>
                      Boolean(entry.course)
                  );
                const totalWeeks = stageCourses.reduce(
                  (acc, s) => acc + s.course.durationWeeks,
                  0
                );
                const totalHours = stageCourses.reduce(
                  (acc, s) =>
                    acc +
                    s.course.modules.reduce((mAcc, m) => mAcc + m.durationHours, 0),
                  0
                );
                const firstCourse = stageCourses[0]?.course;

                return (
                  <motion.article
                    key={path.id}
                    className="acad-cp-card"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.2) }}
                  >
                    <div className="acad-cp-card-header">
                      <div className="acad-cp-card-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={path.heroImage}
                          alt={path.title}
                          width={420}
                          height={240}
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
                            <Clock size={13} aria-hidden="true" />
                            {totalWeeks} Weeks · {totalHours} Guided Hours
                          </span>
                        </div>

                        <h2>{path.title}</h2>
                        <p className="acad-cp-tagline">{path.tagline}</p>

                        <div className="acad-cp-outcomes-block">
                          <span className="acad-cp-sublabel">
                            Measurable Team Outcomes
                          </span>
                          <ul className="acad-cp-outcomes-list">
                            {path.businessOutcomes.map((item) => (
                              <li key={item}>
                                <CheckCircle2 size={14} aria-hidden="true" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Visual Step-by-Step Course Pipeline */}
                    <div className="acad-cp-pipeline">
                      <div className="acad-cp-pipeline-head">
                        <span className="acad-cp-sublabel">
                          Sequenced Program Roadmap ({stageCourses.length} Integrated
                          Courses)
                        </span>
                        <span className="acad-cp-delivery-note">
                          Delivery: {path.deliveryFormat}
                        </span>
                      </div>

                      <div className="acad-cp-stages-row">
                        {stageCourses.map(({ stage, course }) => (
                          <div key={stage.courseId} className="acad-cp-stage-box">
                            <div className="acad-cp-stage-top">
                              <span className="acad-cp-stage-num">
                                Step {stage.stepNumber}
                              </span>
                              <span className="acad-cp-stage-mode">
                                {course.deliveryMode} · {course.durationWeeks} Wks
                              </span>
                            </div>
                            <div className="acad-cp-stage-kicker">
                              {stage.stageLabel}
                            </div>
                            <h3>
                              <Link href={`/academy/courses/${course.slug}`}>
                                {course.title}
                              </Link>
                            </h3>
                            <p>{stage.focusSummary}</p>
                            <div className="acad-cp-stage-tools">
                              {course.tools.slice(0, 4).map((tool) => (
                                <span key={tool} className="acad-cp-tool-tag">
                                  {tool}
                                </span>
                              ))}
                            </div>
                            <Link
                              href={`/academy/courses/${course.slug}`}
                              className="acad-cp-stage-link"
                            >
                              <span>Inspect Course Syllabus</span>
                              <ArrowRight size={13} aria-hidden="true" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="acad-cp-card-footer">
                      <div className="acad-cp-deliverable">
                        <Award size={16} aria-hidden="true" />
                        <span>
                          <strong>Organization Deliverable:</strong>{" "}
                          {path.governanceDeliverable}
                        </span>
                      </div>

                      <div className="acad-cp-card-actions">
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
                          <span>Quote This Pathway</span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                        <Link
                          href="/academy/corporate#request-demo"
                          className="btn btn-outline btn-sm"
                        >
                          <span>Scope Private Cohort</span>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            /* ============ INDIVIDUAL CAREER PATH CARDS ============ */
            <div className="acad-cp-list">
              {filteredIndividualPaths.map((path, idx) => {
                const stageCourses = path.stages
                  .map((stage) => ({
                    stage,
                    course: courseById[stage.courseId],
                  }))
                  .filter(
                    (entry): entry is { stage: (typeof path.stages)[number]; course: Course } =>
                      Boolean(entry.course)
                  );
                const totalWeeks = stageCourses.reduce(
                  (acc, s) => acc + s.course.durationWeeks,
                  0
                );
                const totalHours = stageCourses.reduce(
                  (acc, s) =>
                    acc +
                    s.course.modules.reduce((mAcc, m) => mAcc + m.durationHours, 0),
                  0
                );
                const firstCourse = stageCourses[0]?.course;

                return (
                  <motion.article
                    key={path.id}
                    className="acad-cp-card"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.2) }}
                  >
                    <div className="acad-cp-card-header">
                      <div className="acad-cp-card-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={path.heroImage}
                          alt={path.title}
                          width={420}
                          height={240}
                        />
                        <span className="acad-cp-thumb-badge">
                          <DomainBadgeIcon domain={path.domain} />
                          <span>{path.domain}</span>
                        </span>
                      </div>

                      <div className="acad-cp-card-intro">
                        <div className="acad-cp-meta-chips">
                          <span className="acad-cp-chip-level">
                            {path.startingLevel}
                          </span>
                          <span className="acad-cp-chip-neutral">
                            <Layers size={13} aria-hidden="true" />
                            {stageCourses.length} Sequenced Courses
                          </span>
                          <span className="acad-cp-chip-neutral">
                            <Clock size={13} aria-hidden="true" />
                            {totalWeeks} Weeks · {totalHours} Guided Hours
                          </span>
                        </div>

                        <h2>{path.title}</h2>
                        <p className="acad-cp-tagline">{path.tagline}</p>

                        <div className="acad-cp-ideal-line">
                          <strong>Ideal for:</strong> {path.idealFor}
                        </div>

                        <div className="acad-cp-roles-row">
                          <span className="acad-cp-sublabel">Target Career Roles:</span>
                          <div className="acad-cp-roles-tags">
                            {path.targetRoles.map((role) => (
                              <span key={role} className="acad-cp-role-tag">
                                <Briefcase size={12} aria-hidden="true" />
                                <span>{role}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Step-by-Step Course Progression Pipeline */}
                    <div className="acad-cp-pipeline">
                      <div className="acad-cp-pipeline-head">
                        <span className="acad-cp-sublabel">
                          Step-by-Step Learning Roadmap
                        </span>
                        <span className="acad-cp-delivery-note">
                          Per course: {formatCurrencyAmount(3000, currency)} (or 2 ×{" "}
                          {formatCurrencyAmount(1500, currency)})
                        </span>
                      </div>

                      <div className="acad-cp-stages-row">
                        {stageCourses.map(({ stage, course }) => (
                          <div key={stage.courseId} className="acad-cp-stage-box">
                            <div className="acad-cp-stage-top">
                              <span className="acad-cp-stage-num">
                                Step {stage.stepNumber}
                              </span>
                              <span className="acad-cp-stage-mode">
                                {course.level} · {course.durationWeeks} Wks ·{" "}
                                {course.deliveryMode}
                              </span>
                            </div>
                            <div className="acad-cp-stage-kicker">
                              {stage.stageLabel}
                            </div>
                            <h3>
                              <Link href={`/academy/courses/${course.slug}`}>
                                {course.title}
                              </Link>
                            </h3>
                            <p>{stage.focusSummary}</p>
                            <div className="acad-cp-stage-tools">
                              {course.tools.slice(0, 4).map((tool) => (
                                <span key={tool} className="acad-cp-tool-tag">
                                  {tool}
                                </span>
                              ))}
                            </div>
                            <Link
                              href={`/academy/courses/${course.slug}`}
                              className="acad-cp-stage-link"
                            >
                              <span>View Full Syllabus</span>
                              <ArrowRight size={13} aria-hidden="true" />
                            </Link>
                          </div>
                        ))}
                      </div>

                      <div className="acad-cp-skills-strip">
                        <span className="acad-cp-sublabel">Core Skills Mastered:</span>
                        <div className="acad-cp-stage-tools">
                          {path.keySkills.map((skill) => (
                            <span key={skill} className="acad-cp-skill-chip">
                              <CheckCircle2 size={12} aria-hidden="true" />
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="acad-cp-card-footer">
                      <div className="acad-cp-deliverable">
                        <Award size={16} aria-hidden="true" />
                        <span>
                          <strong>Portfolio Capstone:</strong>{" "}
                          {path.capstoneOutcome}
                        </span>
                      </div>

                      <div className="acad-cp-card-actions">
                        {firstCourse && (
                          <>
                            <Link
                              href={`/academy/tuition?course=${encodeURIComponent(
                                firstCourse.id
                              )}`}
                              className="btn btn-gold btn-sm"
                            >
                              <span>Start Step 01 Enrollment</span>
                              <ArrowRight size={14} aria-hidden="true" />
                            </Link>
                            <Link
                              href={`/academy/courses/${firstCourse.slug}`}
                              className="btn btn-outline btn-sm"
                            >
                              <span>Inspect Step 01</span>
                            </Link>
                          </>
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

      {/* ============ 3. INTERACTIVE ROLE MATCHER OR ENTERPRISE SCOPING CTA ============ */}
      <section className="acad-section" id="path-matcher">
        <div className="container">
          {isBusiness ? (
            <div className="acad-cp-biz-banner">
              <div className="acad-cp-biz-banner-copy">
                <span className="acad-overview-label" style={{ color: "var(--gold)" }}>
                  CUSTOM DEPARTMENTAL DESIGN
                </span>
                <h2>Need a Custom Multi-Course Pathway for Your Organization?</h2>
                <p>
                  Mix and match any of our {courses.length} active programs into a
                  role-specific syllabus tailored to your cloud provider, BI stack,
                  and compliance calendar.
                </p>
              </div>
              <div className="acad-cp-biz-banner-actions">
                <Link
                  href="/academy/corporate#request-demo"
                  className="btn btn-gold"
                >
                  <span>Schedule Team Consultation</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/academy/corporate#corporate-catalog"
                  className="btn acad-biz-btn-ghost"
                >
                  <span>Browse Business Catalog</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="acad-cp-matcher-card">
              <div className="acad-cp-matcher-head">
                <div>
                  <span className="acad-cat-eyebrow">Interactive Career Matcher</span>
                  <h2>Not Sure Which Career Path Fits You Best?</h2>
                  <p>
                    Select your current experience, target role, and preferred
                    learning format to generate a tailored two-step starting sequence.
                  </p>
                </div>
                <Link href="/academy/get-started" className="btn btn-outline btn-sm">
                  <span>Full Guided Onboarding</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>

              <div className="acad-pathfinder-inputs">
                <div className="acad-pathfinder-field">
                  <label htmlFor="cp-bg">1. Current Experience</label>
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
                    <option value="analyst">Spreadsheets / Basic Reporting</option>
                    <option value="sysadmin">IT Support / Linux Admin</option>
                    <option value="developer">Software Developer / Engineer</option>
                  </select>
                </div>

                <div className="acad-pathfinder-field">
                  <label htmlFor="cp-role">2. Target Career Role</label>
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
                    <option value="bi_analyst">Data Analyst / BI Developer</option>
                    <option value="it_support">IT Support &amp; Linux Specialist</option>
                    <option value="security">SOC Analyst / Cybersecurity</option>
                    <option value="ai_automation">Applied AI &amp; Automation</option>
                    <option value="data_eng">SQL &amp; Python Data Engineer</option>
                    <option value="cloud_sre">Cloud &amp; Solutions Architect</option>
                  </select>
                </div>

                <div className="acad-pathfinder-field">
                  <label htmlFor="cp-pace">3. Learning Pace</label>
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
                    <option value="Instructor-Led">Live Instructor-Led</option>
                    <option value="Self-Paced">Self-Paced Online</option>
                  </select>
                </div>
              </div>

              {matcherPrimary && (
                <div className="acad-pathfinder-result" style={{ marginTop: "16px" }}>
                  <div className="acad-pathfinder-result-copy">
                    <span className="acad-cat-eyebrow" style={{ marginBottom: "6px" }}>
                      Recommended Path · {matcherRec.estimatedWeeks} Weeks Combined
                    </span>
                    <h3>
                      Step 1: {matcherPrimary.title}
                      {matcherSecondary && matcherSecondary.id !== matcherPrimary.id
                        ? ` -> Step 2: ${matcherSecondary.title}`
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
                      href={`/academy/tuition?course=${encodeURIComponent(
                        matcherPrimary.id
                      )}`}
                      className="btn btn-gold btn-sm"
                    >
                      <span>Enroll in Step 1</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                    <Link
                      href={`/academy/courses/${matcherPrimary.slug}`}
                      className="btn btn-outline btn-sm"
                    >
                      Inspect Syllabus
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
