"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  GraduationCap,
  Layers,
  Target,
} from "lucide-react";
import type { Course, DeliveryMode } from "@/lib/academyStore";
import {
  recommendTrackPathway,
  type PathfinderInput,
} from "@/lib/curriculumAssessments";
import { SITE_CONFIG } from "@/lib/config";
import { BauhausThemeArt } from "./AcademyAuthPanel";

type AudienceType = "individual" | "business";
type IndividualGoalId = "start" | "advance" | "transition" | "certify";

const GOAL_OPTIONS: Array<{ id: IndividualGoalId; label: string; desc: string }> = [
  {
    id: "start",
    label: "Launch a technical career",
    desc: "Build core engineering workflows with guided labs and capstone proof.",
  },
  {
    id: "advance",
    label: "Advance in my current role",
    desc: "Deepen cloud automation, SQL/dbt modeling, or Kubernetes operations.",
  },
  {
    id: "transition",
    label: "Pivot into Cloud, Data, or Security",
    desc: "Follow a structured role track from foundations to production readiness.",
  },
  {
    id: "certify",
    label: "Earn a verifiable credential",
    desc: "Complete assessment checkpoints and publish an Open Badges v2 credential.",
  },
];

const BACKGROUND_OPTIONS: Array<{ value: PathfinderInput["background"]; label: string }> = [
  { value: "none", label: "New to Tech / Data" },
  { value: "analyst", label: "Analyst / BI / Excel" },
  { value: "sysadmin", label: "IT Support / SysAdmin" },
  { value: "developer", label: "Software Developer" },
];

const ROLE_OPTIONS: Array<{ value: PathfinderInput["targetRole"]; label: string }> = [
  { value: "bi_analyst", label: "Data & BI Analyst" },
  { value: "cloud_sre", label: "Cloud & DevOps SRE" },
  { value: "security", label: "Cybersecurity & IAM" },
  { value: "data_eng", label: "Python & ETL Engineer" },
  { value: "exec_leader", label: "Technical Executive" },
];

const PACE_OPTIONS: Array<{ value: "all" | DeliveryMode; label: string }> = [
  { value: "all", label: "Any Format" },
  { value: "Instructor-Led", label: "Instructor-Led" },
  { value: "Self-Paced", label: "Self-Paced" },
  { value: "Corporate Bootcamp", label: "Corporate Bootcamp" },
];

export function AcademyGetStarted({ courses = [] }: { courses?: Course[] }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [audience, setAudience] = useState<AudienceType>("individual");
  const [goalId, setGoalId] = useState<IndividualGoalId>("advance");
  const [background, setBackground] = useState<PathfinderInput["background"]>("analyst");
  const [targetRole, setTargetRole] = useState<PathfinderInput["targetRole"]>("bi_analyst");
  const [pace, setPace] = useState<"all" | DeliveryMode>("all");

  const recommendation = useMemo(
    () => recommendTrackPathway({ background, targetRole, pace }, courses),
    [background, targetRole, pace, courses]
  );

  const primaryCourse = useMemo(
    () => courses.find((c) => c.id === recommendation.primaryCourseId) || courses[0],
    [courses, recommendation.primaryCourseId]
  );

  const secondaryCourse = useMemo(
    () => courses.find((c) => c.id === recommendation.secondaryCourseId),
    [courses, recommendation.secondaryCourseId]
  );

  const selectedGoalLabel =
    GOAL_OPTIONS.find((g) => g.id === goalId)?.label || "Advance your technical skills";
  const selectedRoleLabel =
    ROLE_OPTIONS.find((r) => r.value === targetRole)?.label || "Engineering Specialist";

  return (
    <div className="acad-bauhaus-frame">
      {/* Left Column: 3-Step Guided Onboarding */}
      <div className="acad-bauhaus-left">
        <div className="acad-bauhaus-top-nav">
          <Link href="/academy" className="acad-brand" style={{ textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mark.png"
              alt={SITE_CONFIG.COMPANY}
              width={50}
              height={50}
              className="acad-brand-logo acad-bauhaus-brand-logo"
            />
            <span className="acad-brand-text">
              Elites Tech <span>Academy</span>
            </span>
          </Link>

          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev === 3 ? 2 : 1))}
              className="acad-bauhaus-nav-link"
              style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              <ArrowLeft size={15} />
              <span>Previous Step</span>
            </button>
          ) : (
            <Link href="/academy" className="acad-bauhaus-nav-link">
              <ArrowLeft size={15} />
              <span>Back to Academy</span>
            </Link>
          )}
        </div>

        <div className="acad-bauhaus-left-inner acad-getstarted-wizard">
          {/* Progress Rail */}
          <div className="acad-onboard-steps" aria-label="Onboarding progress">
            {[
              { num: 1, title: "Audience" },
              { num: 2, title: "Role & Skills" },
              { num: 3, title: "Pathway" },
            ].map((item) => {
              const active = step === item.num;
              const done = step > item.num;
              return (
                <div
                  key={item.num}
                  className={`acad-onboard-step ${active ? "active" : ""} ${done ? "done" : ""}`}
                >
                  <span className="acad-onboard-step-num">
                    {done ? <CheckCircle2 size={14} /> : item.num}
                  </span>
                  <span className="acad-onboard-step-label">{item.title}</span>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.22 }}
                className="acad-onboard-panel"
              >
                <div className="acad-auth-header">
                  <h1 className="acad-getstarted-title">Your Journey Starts Here</h1>
                  <p className="acad-auth-desc acad-getstarted-desc">
                    Select how you are joining Elites Tech Academy so we can tailor your track or team workspace setup.
                  </p>
                </div>

                <div className="acad-onboard-audience-grid" role="radiogroup" aria-label="Joining as">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={audience === "individual"}
                    onClick={() => setAudience("individual")}
                    className={`acad-onboard-choice-card ${audience === "individual" ? "selected" : ""}`}
                  >
                    <GraduationCap size={20} />
                    <div>
                      <strong>Individual Practitioner</strong>
                      <span>Role-based tracks &amp; personal credentials</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={audience === "business"}
                    onClick={() => setAudience("business")}
                    className={`acad-onboard-choice-card ${audience === "business" ? "selected" : ""}`}
                  >
                    <Building2 size={20} />
                    <div>
                      <strong>For Business &amp; Teams</strong>
                      <span>5+ seat volume pricing, Net-30 &amp; team telemetry</span>
                    </div>
                  </button>
                </div>

                {audience === "individual" ? (
                  <>
                    <div className="acad-onboard-subhead">What is your main learning focus?</div>
                    <div className="acad-onboard-goal-list">
                      {GOAL_OPTIONS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGoalId(g.id)}
                          className={`acad-onboard-goal-item ${goalId === g.id ? "selected" : ""}`}
                        >
                          <Target size={16} />
                          <div>
                            <strong>{g.label}</strong>
                            <span>{g.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="acad-bauhaus-btn-primary"
                      style={{ marginTop: "6px" }}
                    >
                      <span>Select Target Role</span>
                      <ArrowRight size={16} />
                    </button>
                  </>
                ) : (
                  <div className="acad-onboard-biz-actions">
                    <div className="acad-onboard-biz-card">
                      <strong>Engineering Team &amp; Enterprise Enablement</strong>
                      <p>
                        Compare Team (5 to 29 seats) and Enterprise (30+ seats) plans, assign departmental role paths, or generate a formal quote.
                      </p>
                    </div>
                    <Link
                      href="/academy/corporate"
                      className="acad-bauhaus-btn-primary"
                      style={{ textDecoration: "none", marginTop: 0 }}
                    >
                      <span>Explore Business Plans &amp; Dashboard</span>
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/academy/tuition?mode=corporate"
                      className="acad-bauhaus-btn-secondary"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                      }}
                    >
                      Configure 5+ Seat Volume Quote
                    </Link>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="acad-onboard-text-btn"
                    >
                      Or map recommended curriculum tracks first
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.22 }}
                className="acad-onboard-panel"
              >
                <div className="acad-auth-header">
                  <h1 className="acad-getstarted-title" style={{ fontSize: "clamp(1.85rem, 3vw, 2.4rem)" }}>
                    Tailor Your Role &amp; Track
                  </h1>
                  <p className="acad-auth-desc acad-getstarted-desc">
                    Tell us your background and target engineering discipline so we match the highest-impact starting program.
                  </p>
                </div>

                <div className="acad-onboard-group">
                  <div className="acad-onboard-subhead">1. Current Technical Background</div>
                  <div className="acad-onboard-chip-grid">
                    {BACKGROUND_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setBackground(opt.value)}
                        className={`acad-onboard-chip ${background === opt.value ? "selected" : ""}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="acad-onboard-group">
                  <div className="acad-onboard-subhead">2. Target Career Role</div>
                  <div className="acad-onboard-chip-grid">
                    {ROLE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setTargetRole(opt.value)}
                        className={`acad-onboard-chip ${targetRole === opt.value ? "selected" : ""}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="acad-onboard-group">
                  <div className="acad-onboard-subhead">3. Preferred Delivery Pace</div>
                  <div className="acad-onboard-chip-grid">
                    {PACE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPace(opt.value)}
                        className={`acad-onboard-chip ${pace === opt.value ? "selected" : ""}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="acad-bauhaus-btn-primary"
                  style={{ marginTop: "6px" }}
                >
                  <span>Build My Pathway</span>
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.22 }}
                className="acad-onboard-panel"
              >
                <div className="acad-onboard-summary-banner">
                  <Compass size={18} />
                  <span>
                    Goal: <strong>{selectedGoalLabel}</strong> · Target Role: <strong>{selectedRoleLabel}</strong> ·{" "}
                    Est. <strong>{recommendation.estimatedWeeks} Weeks</strong>
                  </span>
                </div>

                <div className="acad-onboard-rec-card">
                  <div className="acad-onboard-rec-label">Recommended Starting Program</div>
                  {primaryCourse ? (
                    <>
                      <h2>{primaryCourse.title}</h2>
                      <p>{recommendation.summary}</p>
                      <div className="acad-onboard-rec-meta">
                        <span>{primaryCourse.category}</span>
                        <span>{primaryCourse.deliveryMode}</span>
                        <span>{primaryCourse.durationWeeks} Weeks</span>
                      </div>
                    </>
                  ) : (
                    <p>{recommendation.summary}</p>
                  )}

                  <div className="acad-onboard-skills-list">
                    {recommendation.skillGaps.map((skill) => (
                      <span key={skill} className="acad-onboard-skill-tag">
                        <CheckCircle2 size={13} />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {secondaryCourse && (
                  <div className="acad-onboard-next-track">
                    <Layers size={16} />
                    <div>
                      <strong>Recommended Companion Track:</strong>{" "}
                      <Link href={`/academy/courses/${secondaryCourse.slug}`}>
                        {secondaryCourse.title}
                      </Link>
                    </div>
                  </div>
                )}

                <div className="acad-getstarted-actions" style={{ marginTop: "4px" }}>
                  <Link
                    href={audience === "business" ? "/academy/corporate/register" : "/academy/register"}
                    className="acad-bauhaus-btn-primary"
                    style={{ textDecoration: "none", marginTop: 0 }}
                  >
                    <span>
                      {audience === "business"
                        ? "Create Business Team Account"
                        : "Create Individual Learner Account"}
                    </span>
                    <ArrowRight size={16} />
                  </Link>

                  <div className="acad-onboard-secondary-row">
                    {primaryCourse && (
                      <Link
                        href={`/academy/courses/${primaryCourse.slug}`}
                        className="acad-bauhaus-btn-secondary"
                        style={{
                          flex: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textDecoration: "none",
                        }}
                      >
                        Inspect Syllabus
                      </Link>
                    )}
                    <Link
                      href={audience === "business" ? "/academy/corporate/signin" : "/academy/signin"}
                      className="acad-bauhaus-btn-secondary"
                      style={{
                        flex: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                      }}
                    >
                      Sign In Instead
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="acad-onboard-auth-footnote">
            <span>Already enrolled?</span>
            <Link href="/academy/signin">Individual Sign In</Link>
            <span>·</span>
            <Link href="/academy/corporate/signin">For Business Sign In</Link>
          </div>
        </div>
      </div>

      {/* Right Column: Full-Height Bauhaus Artwork with Circular Scholar Portraits */}
      <BauhausThemeArt />
    </div>
  );
}
