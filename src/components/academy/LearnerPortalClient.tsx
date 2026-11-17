"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  ExternalLink,
  GraduationCap,
  Lock,
  Printer,
  X,
} from "lucide-react";
import {
  formatCurrencyAmount,
  type Certificate,
  type Cohort,
  type Course,
  type Enrollment,
  type TuitionPayment,
} from "@/lib/academyStore";
import { buildLinkedInCertificationUrl } from "@/lib/credentialUtils";
import { getModuleCheckpointQuestions } from "@/lib/curriculumAssessments";
import { LearnerDashboard } from "./LearnerDashboard";
import { LearnerSkillTelemetry } from "./LearnerSkillTelemetry";
import { CareerRoadmapTab } from "./CareerRoadmapTab";

interface EnrichedEnrollment extends Enrollment {
  course: Course | null;
  cohort: Cohort | null;
  certificate: Certificate | null;
}

export function LearnerPortalClient() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [enrollments, setEnrollments] = useState<EnrichedEnrollment[]>([]);
  const [payments, setPayments] = useState<TuitionPayment[]>([]);
  const [selectedEnrId, setSelectedEnrId] = useState<string>("");
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [capstoneUrl, setCapstoneUrl] = useState("");
  const [capstoneNotes, setCapstoneNotes] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"curriculum" | "roadmap">("curriculum");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{ scorePct: number; passed: boolean } | null>(null);

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/learn", { cache: "no-store" });
      if (res.status === 401) {
        setAuthenticated(false);
        setEnrollments([]);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setAuthenticated(true);
      setUserName(data.user?.fullName || "");
      setUserEmail(data.user?.email || "");
      const list: EnrichedEnrollment[] = data.enrollments || [];
      setEnrollments(list);
      setPayments(data.payments || []);

      if (list.length > 0) {
        setSelectedEnrId((prev) => {
          const exists = list.some((e) => e.id === prev);
          return exists ? prev : list[0].id;
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspace();
    const handler = () => loadWorkspace();
    window.addEventListener("ets-academy-session-changed", handler);
    return () => window.removeEventListener("ets-academy-session-changed", handler);
  }, [loadWorkspace]);

  const activeEnrollment = enrollments.find((e) => e.id === selectedEnrId) || enrollments[0] || null;
  const activeCourse = activeEnrollment?.course || null;

  useEffect(() => {
    if (activeEnrollment) {
      setCapstoneUrl(activeEnrollment.capstoneUrl || "");
      setCapstoneNotes(activeEnrollment.capstoneNotes || "");
      const modules = activeEnrollment.course?.modules || [];
      if (modules.length > 0) {
        setSelectedModuleId((prev) =>
          modules.some((m) => m.id === prev) ? prev : modules[0].id
        );
      }
    }
  }, [activeEnrollment?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectCourseModule = (enrollmentId: string, moduleId?: string) => {
    setSelectedEnrId(enrollmentId);
    setActiveWorkspaceTab("curriculum");
    setFeedback(null);
    if (moduleId) {
      setTimeout(() => setSelectedModuleId(moduleId), 0);
    }
    setTimeout(() => {
      const el = document.getElementById("acad-module-workspace");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  const handleToggleModule = async (moduleId: string) => {
    if (!activeEnrollment) return;
    setActionBusy(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/academy/learn", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId: activeEnrollment.id,
          toggleModuleId: moduleId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update module progress.");
      await loadWorkspace();
      setFeedback({ type: "ok", text: "Module completion updated." });
    } catch (err) {
      setFeedback({ type: "err", text: (err as Error).message });
    } finally {
      setActionBusy(false);
    }
  };

  const handleGradeCheckpoint = async (moduleId: string, category: Course["category"], order: number) => {
    if (!activeEnrollment) return;
    const questions = getModuleCheckpointQuestions(category, order);
    const allAnswered = questions.every((q) => typeof quizAnswers[q.id] === "number");
    if (!allAnswered) {
      setFeedback({ type: "err", text: "Answer all 3 checkpoint questions before grading." });
      return;
    }
    const correctCount = questions.filter((q) => quizAnswers[q.id] === q.correctIndex).length;
    const scorePct = Math.round((correctCount / questions.length) * 100);
    const passed = scorePct >= 80;
    setQuizResult({ scorePct, passed });

    setActionBusy(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/academy/learn", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId: activeEnrollment.id,
          quizSubmission: { moduleId, scorePct },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to record checkpoint score.");
      await loadWorkspace();
      setFeedback({
        type: passed ? "ok" : "err",
        text: passed
          ? `Knowledge checkpoint passed (${scorePct}%). Module telemetry updated.`
          : `Scored ${scorePct}%. Review rationales below and retake to clear the 80% gate.`,
      });
    } catch (err) {
      setFeedback({ type: "err", text: (err as Error).message });
    } finally {
      setActionBusy(false);
    }
  };

  const handleCapstoneSubmit = async (claimCertificate: boolean) => {
    if (!activeEnrollment) return;
    setActionBusy(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/academy/learn", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId: activeEnrollment.id,
          capstoneUrl,
          capstoneNotes,
          claimCertificate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to save capstone submission.");
      await loadWorkspace();
      setFeedback({
        type: "ok",
        text: claimCertificate && data.certificate
          ? `Verified Certificate Issued: ${data.certificate.code}`
          : "Capstone deliverable saved.",
      });
      if (claimCertificate && data.certificate) {
        setShowCertModal(true);
      }
    } catch (err) {
      setFeedback({ type: "err", text: (err as Error).message });
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) {
    return (
      <main id="main" className="acad-section">
        <div className="container">
          <div className="acad-card acad-gate-card">Loading learning workspace...</div>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main id="main" className="acad-section">
        <div className="container" style={{ maxWidth: "680px", margin: "40px auto" }}>
          <div className="acad-gate-card">
            <div className="acad-gate-icon">
              <GraduationCap size={32} />
            </div>
            <h2>Learner Workspace Sign In Required</h2>
            <p>
              Please sign in with your enrolled student account to access your live technical modules,
              capstone laboratory submissions, and verifiable credentials.
            </p>
            <div className="acad-gate-actions">
              <Link href="/academy/signin" className="btn btn-navy" style={{ padding: "12px 24px" }}>
                Sign In to Workspace
              </Link>
              <Link href="/academy/register" className="btn btn-outline" style={{ padding: "12px 24px" }}>
                Create Learner Account
              </Link>
            </div>
            <div className="acad-gate-footnote">
              New to Elites Tech Academy?{" "}
              <Link href="/academy/register" style={{ color: "var(--blue)", fontWeight: 600 }}>
                Apply for an upcoming cohort
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!activeEnrollment || !activeCourse) {
    return (
      <main id="main" className="acad-section">
        <div className="container">
          <div className="acad-card acad-gate-card">
            <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", marginBottom: "10px" }}>
              Welcome, {userName}
            </h1>
            <p style={{ color: "var(--muted)", marginBottom: "22px" }}>
              You do not have an active Academy enrollment linked to <strong>{userEmail}</strong> yet. Browse the catalog or enroll through the Tuition Calculator to unlock your modules immediately.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/academy" className="btn btn-navy">
                Browse Course Catalog
              </Link>
              <Link href="/academy/tuition" className="btn btn-gold">
                Enroll &amp; Calculate Tuition
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const totalModules = activeCourse.modules.length || 1;
  const completedCount = activeEnrollment.completedModuleIds.length;
  const progressPct = Math.round((completedCount / totalModules) * 100);
  const activeModule =
    activeCourse.modules.find((m) => m.id === selectedModuleId) || activeCourse.modules[0];
  const isModuleDone = activeModule
    ? activeEnrollment.completedModuleIds.includes(activeModule.id)
    : false;
  const allModulesDone = completedCount >= activeCourse.modules.length;
  const enrPayments = payments.filter((p) => p.enrollmentId === activeEnrollment.id);

  const paymentLabel =
    activeEnrollment.paymentStatus === "paid_in_full"
      ? "Paid in Full"
      : activeEnrollment.paymentStatus === "deposit_paid"
      ? "Deposit Paid · Installment 2 Pending"
      : activeEnrollment.paymentStatus === "corporate_sponsored"
      ? "Corporate Seat Sponsored"
      : "Payment Pending Verification";

  const certData = activeEnrollment.certificate || {
    code: activeEnrollment.certificateCode || "ETS-CERT-PENDING",
    learnerName: userName || "Academy Scholar",
    courseTitle: activeCourse.title,
    category: activeCourse.category,
    durationWeeks: activeCourse.durationWeeks,
    issuedAt: (activeEnrollment.certificate as unknown as Certificate)?.issuedAt || activeEnrollment.lastActiveAt || new Date().toISOString(),
    instructorName: "Dr. Kweku Mensah, Chief Solutions Architect",
  };

  return (
    <main id="main">
      <section className="acad-page-hero" style={{ padding: "26px 0" }}>
        <div className="container">
          <div className="acad-page-hero-row">
            <div>
              <div className="acad-course-meta-line" style={{ marginBottom: "4px" }}>
                Learner Workspace · {userName} ({userEmail})
              </div>
              <h1 style={{ fontSize: "clamp(1.38rem, 2.2vw, 1.88rem)", margin: 0 }}>{activeCourse.title}</h1>
            </div>

            {enrollments.length > 1 && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label htmlFor="switch-enrollment" style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)" }}>
                  Active Track:
                </label>
                <select
                  id="switch-enrollment"
                  className="acad-select"
                  value={activeEnrollment.id}
                  onChange={(e) => {
                    setSelectedEnrId(e.target.value);
                    setFeedback(null);
                  }}
                >
                  {enrollments.map((enr) => (
                    <option key={enr.id} value={enr.id}>
                      {enr.course?.title || enr.courseId} ({enr.reference})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="acad-section acad-section-compact">
        <div className="container">
          {/* Status & Tuition Bar */}
          <div className="acad-learn-bar">
            <div>
              <div className="acad-overview-label" style={{ marginBottom: "2px" }}>
                Enrollment &amp; Tuition Status
              </div>
              <div className="acad-learn-meta">
                <strong className="acad-mono" style={{ color: "var(--navy)" }}>{activeEnrollment.reference}</strong>
                <span>·</span>
                <span className={activeEnrollment.paymentStatus === "pending" ? "acad-status-warn" : "acad-status-ok"}>
                  {paymentLabel}
                </span>
                <span>·</span>
                <span className="acad-mono" style={{ color: "var(--muted)" }}>
                  Paid {formatCurrencyAmount(activeEnrollment.amountPaidUsd, activeEnrollment.currency)} of {formatCurrencyAmount(activeEnrollment.totalUsd, activeEnrollment.currency)}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              {activeEnrollment.cohort && (
                <span className="acad-mono" style={{ fontSize: "0.83rem", color: "var(--navy)" }}>
                  Cohort {activeEnrollment.cohort.code} · {activeEnrollment.cohort.startDateText}
                </span>
              )}
              {activeEnrollment.certificateCode && (
                <button
                  type="button"
                  onClick={() => setShowCertModal(true)}
                  className="btn btn-gold btn-sm"
                >
                  <Award size={15} />
                  <span>Branded PDF Certificate ({activeEnrollment.certificateCode})</span>
                </button>
              )}
            </div>
          </div>

          {feedback && (
            <div className={feedback.type === "ok" ? "alert-success" : "alert-error"} role="status">
              {feedback.text}
            </div>
          )}

          {/* Cohort Progress & Completion Percentage Indicator Card */}
          <div
            className={`acad-card ${progressPct >= 100 ? "is-complete" : ""}`}
            style={{ marginBottom: "24px", padding: "20px 24px", background: progressPct >= 100 ? "#f1fbf5" : "#f8faff", borderColor: progressPct >= 100 ? "#bfe6ce" : "#dce5f5" }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: progressPct >= 100 ? "#d2f0dd" : "var(--blue-soft)", color: progressPct >= 100 ? "var(--ok-text)" : "var(--blue)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {progressPct >= 100 ? <CheckCircle2 size={20} /> : <BookOpen size={20} />}
                </div>
                <div>
                  <div className="acad-overview-label" style={{ marginBottom: "2px" }}>
                    Current Cohort Progress &amp; Completion Indicator
                  </div>
                  <strong style={{ fontSize: "1.05rem", color: "var(--navy)" }}>
                    {activeCourse.title} {activeEnrollment.cohort ? `(Cohort ${activeEnrollment.cohort.code})` : ""}
                  </strong>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="acad-mono" style={{ fontSize: "1.5rem", fontWeight: 700, color: progressPct >= 100 ? "var(--ok-text)" : "var(--blue)" }}>
                  {progressPct}%
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 600 }}>
                  {completedCount} of {totalModules} Modules Completed
                </div>
              </div>
            </div>

            <div
              className="acad-progress-track"
              role="progressbar"
              aria-label="Cohort module completion progress"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ height: "10px", marginBottom: "12px" }}
            >
              <div
                className="acad-progress-fill"
                style={{
                  width: `${progressPct}%`,
                  background: progressPct >= 100 ? "linear-gradient(90deg, #15803d, #22c55e)" : "linear-gradient(90deg, var(--blue), var(--cyan))",
                }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px", fontSize: "0.82rem", color: "var(--muted)" }}>
              <span>
                {progressPct >= 100
                  ? "Congratulations! All curriculum modules completed and verified."
                  : `Next up: ${activeCourse.modules.find((m) => !activeEnrollment.completedModuleIds.includes(m.id))?.title || "Complete remaining curriculum milestones"}`}
              </span>
              <span className="acad-mono" style={{ fontWeight: 600, color: "var(--navy)" }}>
                {totalModules - completedCount} modules remaining
              </span>
            </div>
          </div>

          {/* Learner Dashboard Overview */}
          <LearnerDashboard
            userName={userName}
            enrollments={enrollments}
            selectedEnrollmentId={activeEnrollment.id}
            onSelectCourseModule={handleSelectCourseModule}
            onOpenCertificate={(enrId) => {
              setSelectedEnrId(enrId);
              setShowCertModal(true);
            }}
          />

          {/* Workspace Tab Switcher */}
          <div id="acad-module-workspace" className="acad-tabs" role="tablist" aria-label="Workspace tabs" style={{ marginBottom: "20px", scrollMarginTop: "88px" }}>
            <button
              type="button"
              role="tab"
              aria-selected={activeWorkspaceTab === "curriculum"}
              onClick={() => setActiveWorkspaceTab("curriculum")}
              className={`acad-tab ${activeWorkspaceTab === "curriculum" ? "active" : ""}`}
            >
              Curriculum, Labs &amp; Telemetry
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeWorkspaceTab === "roadmap"}
              onClick={() => setActiveWorkspaceTab("roadmap")}
              className={`acad-tab ${activeWorkspaceTab === "roadmap" ? "active" : ""}`}
            >
              Career Roadmap &amp; Next-Level Milestones
            </button>
          </div>

          {/* Skill Telemetry Dashboard */}
          <LearnerSkillTelemetry
            learnerName={userName}
            course={activeCourse}
            enrollment={activeEnrollment}
          />

          {activeWorkspaceTab === "roadmap" ? (
            <CareerRoadmapTab
              courseTitle={activeCourse.title}
              category={activeCourse.category}
              completedCount={completedCount}
              totalModules={totalModules}
            />
          ) : (
            <div className="acad-workspace-grid">
              {/* Left Curriculum Outline */}
              <aside className="acad-outline-card">
                <div className="acad-outline-head">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                    <strong style={{ fontSize: "0.9rem", color: "var(--navy)" }}>Course Outline</strong>
                    <span className="acad-mono" style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--blue)" }}>
                      {progressPct}% ({completedCount}/{totalModules})
                    </span>
                  </div>
                  <div className="acad-progress-track">
                    <div className="acad-progress-fill" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <div>
                  {activeCourse.modules.map((mod) => {
                    const done = activeEnrollment.completedModuleIds.includes(mod.id);
                    const isCurrent = activeModule?.id === mod.id;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => {
                          setSelectedModuleId(mod.id);
                          setQuizAnswers({});
                          setQuizResult(null);
                        }}
                        className={`acad-outline-item ${isCurrent ? "active" : ""}`}
                      >
                        {done ? (
                          <CheckCircle2 size={17} color="var(--ok)" style={{ flexShrink: 0, marginTop: "2px" }} />
                        ) : (
                          <Circle size={17} color="var(--muted)" style={{ flexShrink: 0, marginTop: "2px" }} />
                        )}
                        <div>
                          <strong>
                            {String(mod.order).padStart(2, "0")}. {mod.title}
                          </strong>
                          <span>
                            {mod.weekLabel} · {mod.durationHours} hrs
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>

              {/* Right Active Lesson & Capstone Panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {activeModule && (
                  <motion.article
                    key={activeModule.id}
                    className="acad-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <span className="acad-module-week">
                        Module {String(activeModule.order).padStart(2, "0")} · {activeModule.weekLabel} · {activeModule.durationHours} Hours
                      </span>
                      <button
                        type="button"
                        disabled={actionBusy}
                        onClick={() => handleToggleModule(activeModule.id)}
                        className={`btn btn-sm ${isModuleDone ? "btn-outline" : "btn-navy"}`}
                      >
                        <CheckCircle2 size={15} />
                        <span>{isModuleDone ? "Completed (Click to Undo)" : "Mark Module Completed"}</span>
                      </button>
                    </div>

                    <h2 style={{ fontSize: "1.42rem", color: "var(--navy)", marginBottom: "8px" }}>
                      {activeModule.title}
                    </h2>
                    <p style={{ color: "var(--muted)", marginBottom: "18px", maxWidth: "65ch" }}>
                      {activeModule.summary}
                    </p>

                    <div style={{ marginBottom: "18px" }}>
                      <h3 style={{ fontSize: "0.94rem", color: "var(--navy)", marginBottom: "8px" }}>
                        Key Engineering Objectives
                      </h3>
                      <ul className="acad-obj-list">
                        {activeModule.objectives.map((obj, idx) => (
                          <li key={idx} className="acad-obj-item">
                            <CheckCircle2 size={15} color="var(--blue)" style={{ flexShrink: 0, marginTop: "3px" }} />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="acad-lab-panel">
                      <div className="acad-overview-label" style={{ color: "var(--blue)" }}>
                        Hands-On Production Lab Assignment
                      </div>
                      <p style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "6px", fontSize: "0.95rem" }}>
                        {activeModule.labTask}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.83rem", color: "var(--muted)" }}>
                        <BookOpen size={14} />
                        <span>Session Pack: {activeModule.resourceNote}</span>
                      </div>
                    </div>

                    {/* Interactive Module Knowledge Checkpoint (80% Passing Gate) */}
                    {(() => {
                      const checkpointQuestions = getModuleCheckpointQuestions(
                        activeCourse.category,
                        activeModule.order
                      );
                      const existingScore = activeEnrollment.moduleScores?.[activeModule.id];
                      return (
                        <div
                          style={{
                            marginTop: "18px",
                            padding: "18px",
                            borderRadius: "12px",
                            border: "1px solid #d5e0f4",
                            background: "#f8faff",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: "10px",
                              marginBottom: "12px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <ClipboardCheck size={17} color="var(--blue)" />
                              <strong style={{ fontSize: "0.94rem", color: "var(--navy)" }}>
                                Module Knowledge Checkpoint
                              </strong>
                            </div>
                            <span
                              className="acad-mono"
                              style={{
                                fontSize: "0.76rem",
                                fontWeight: 700,
                                color:
                                  typeof existingScore === "number" && existingScore >= 80
                                    ? "var(--ok-text)"
                                    : "var(--blue)",
                              }}
                            >
                              {typeof existingScore === "number"
                                ? `Recorded Score: ${existingScore}%`
                                : "3 Questions · 80% Passing"}
                            </span>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {checkpointQuestions.map((q, qIdx) => {
                              const picked = quizAnswers[q.id];
                              return (
                                <div
                                  key={q.id}
                                  style={{
                                    background: "#ffffff",
                                    border: "1px solid #dce5f5",
                                    borderRadius: "10px",
                                    padding: "12px 14px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "0.85rem",
                                      fontWeight: 700,
                                      color: "var(--navy)",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    {qIdx + 1}. {q.prompt}
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {q.options.map((opt, optIdx) => {
                                      const selected = picked === optIdx;
                                      const showRight =
                                        quizResult && optIdx === q.correctIndex;
                                      const showWrong =
                                        quizResult && selected && optIdx !== q.correctIndex;
                                      return (
                                        <button
                                          key={optIdx}
                                          type="button"
                                          onClick={() =>
                                            setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                          }
                                          style={{
                                            textAlign: "left",
                                            padding: "8px 10px",
                                            borderRadius: "7px",
                                            border: showRight
                                              ? "1px solid #22c55e"
                                              : showWrong
                                              ? "1px solid #ef4444"
                                              : selected
                                              ? "1px solid var(--blue)"
                                              : "1px solid #e3ebfa",
                                            background: showRight
                                              ? "#f0fdf4"
                                              : showWrong
                                              ? "#fef2f2"
                                              : selected
                                              ? "var(--blue-soft)"
                                              : "#ffffff",
                                            color: "var(--navy)",
                                            fontSize: "0.81rem",
                                            fontWeight: selected ? 700 : 500,
                                            cursor: "pointer",
                                          }}
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {quizResult && (
                                    <div
                                      style={{
                                        marginTop: "8px",
                                        fontSize: "0.78rem",
                                        color: "var(--muted)",
                                        lineHeight: 1.45,
                                      }}
                                    >
                                      <strong>Rationale:</strong> {q.rationale}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: "10px",
                              marginTop: "14px",
                            }}
                          >
                            <button
                              type="button"
                              disabled={actionBusy}
                              onClick={() =>
                                handleGradeCheckpoint(
                                  activeModule.id,
                                  activeCourse.category,
                                  activeModule.order
                                )
                              }
                              className="btn btn-navy btn-sm"
                            >
                              <ClipboardCheck size={14} />
                              <span>Grade &amp; Record Checkpoint</span>
                            </button>
                            {quizResult && (
                              <span
                                className="acad-mono"
                                style={{
                                  fontSize: "0.82rem",
                                  fontWeight: 700,
                                  color: quizResult.passed ? "var(--ok-text)" : "var(--danger)",
                                }}
                              >
                                {quizResult.passed
                                  ? `Passed (${quizResult.scorePct}%)`
                                  : `Score: ${quizResult.scorePct}% (Need 80%)`}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </motion.article>
                )}

                {/* Capstone Submission & Credential Claim */}
                <article className="acad-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "10px" }}>
                    <h3 style={{ fontSize: "1.18rem", color: "var(--navy)", margin: 0 }}>
                      Capstone Deliverable &amp; Verified Certificate
                    </h3>
                    {activeEnrollment.certificateCode && (
                      <button
                        type="button"
                        onClick={() => setShowCertModal(true)}
                        className="acad-mono"
                        style={{ fontSize: "0.85rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px", background: "none", border: 0, color: "var(--blue)", cursor: "pointer" }}
                      >
                        <span>{activeEnrollment.certificateCode}</span>
                        <Award size={14} />
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "16px", maxWidth: "65ch" }}>
                    Complete all {totalModules} course modules and attach your capstone GitHub repository or published dashboard URL to issue your verifiable Elites Tech Academy credential.
                  </p>

                  <div className="acad-form-grid">
                    <div className="acad-field full">
                      <label htmlFor="capstone-url">GitHub Repository or Live Dashboard URL</label>
                      <input
                        id="capstone-url"
                        type="url"
                        placeholder="https://github.com/your-handle/capstone-project"
                        value={capstoneUrl}
                        onChange={(e) => setCapstoneUrl(e.target.value)}
                      />
                    </div>
                    <div className="acad-field full">
                      <label htmlFor="capstone-notes">Architecture &amp; Methodology Notes</label>
                      <textarea
                        id="capstone-notes"
                        rows={2}
                        placeholder="Summarize schema design, transformations, or deployment stack..."
                        value={capstoneNotes}
                        onChange={(e) => setCapstoneNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px" }}>
                    <button
                      type="button"
                      disabled={actionBusy}
                      onClick={() => handleCapstoneSubmit(false)}
                      className="btn btn-outline btn-sm"
                    >
                      Save Capstone Link
                    </button>
                    {!activeEnrollment.certificateCode ? (
                      <button
                        type="button"
                        disabled={actionBusy || !allModulesDone}
                        onClick={() => handleCapstoneSubmit(true)}
                        className="btn btn-gold btn-sm"
                      >
                        <Award size={16} />
                        <span>
                          {allModulesDone
                            ? "Claim Verified Certificate"
                            : `Complete Remaining ${totalModules - completedCount} Modules to Claim`}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowCertModal(true)}
                        className="btn btn-gold btn-sm"
                      >
                        <Award size={16} />
                        <span>Download Branded PDF Certificate</span>
                      </button>
                    )}
                  </div>
                </article>

                {/* Tuition Payment Ledger for This Enrollment */}
                {enrPayments.length > 0 && (
                  <article className="acad-card">
                    <h3 style={{ fontSize: "1.1rem", color: "var(--navy)", marginBottom: "12px" }}>
                      Tuition Schedule &amp; Receipts
                    </h3>
                    <div className="acad-table-wrap">
                      <table className="acad-table">
                        <thead>
                          <tr>
                            <th>Reference</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Channel</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrPayments.map((pay) => (
                            <tr key={pay.id}>
                              <td className="acad-mono" style={{ fontWeight: 700 }}>{pay.reference}</td>
                              <td>{pay.description}</td>
                              <td className="acad-mono" style={{ fontWeight: 700 }}>{pay.amountLocalFormatted}</td>
                              <td>{pay.channel}</td>
                              <td>
                                <span className={pay.status === "verified" ? "acad-status-ok" : "acad-status-warn"}>
                                  {pay.status === "verified" ? "Verified" : "Pending Verification"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ BRANDED PDF CERTIFICATE GENERATOR MODAL ============ */}
      <AnimatePresence>
        {showCertModal && (
          <div className="acad-modal-backdrop" role="dialog" aria-modal="true">
            <motion.div
              className="acad-modal-container"
              style={{ maxWidth: "860px", width: "94%", maxHeight: "90vh", overflowY: "auto", padding: "32px", background: "#ffffff", borderRadius: "16px" }}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }} className="acad-no-print">
                <div>
                  <span className="acad-kicker">Elites Tech Academy · High-Resolution PDF Service</span>
                  <h2 style={{ fontSize: "1.25rem", color: "var(--navy)", margin: 0 }}>Official Branded Graduate Credential</h2>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  {activeEnrollment.certificateCode && (
                    <a
                      href={buildLinkedInCertificationUrl(certData)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-gold btn-sm"
                    >
                      <ExternalLink size={15} />
                      <span>Add to LinkedIn</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-navy btn-sm"
                  >
                    <Printer size={15} />
                    <span>Download / Print PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCertModal(false)}
                    className="acad-modal-close"
                    aria-label="Close modal"
                    style={{ background: "#f0f4ff", border: "1px solid #dce5f5", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Printable High-Resolution Certificate Sheet */}
              <article className="acad-cert-sheet" style={{ border: "3px solid #0f2557", padding: "48px", background: "#ffffff", position: "relative" }}>
                <div className="acad-cert-header">
                  <div className="acad-status-ok" style={{ fontSize: "0.95rem" }}>
                    <CheckCircle2 size={20} />
                    <span>Verified Official Credential · Elites Tech Solutions LLC</span>
                  </div>
                  <div className="acad-mono" style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)" }}>
                    {certData.code}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "var(--blue-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--blue)", flexShrink: 0 }}>
                    <Award size={32} />
                  </div>
                  <div>
                    <div className="acad-overview-label" style={{ color: "var(--blue)", marginBottom: "2px", letterSpacing: "0.08em" }}>
                      ELITES TECH SOLUTIONS ACADEMY
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--navy)" }}>
                      Certificate of Professional Engineering Completion
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "0.92rem", color: "var(--muted)", marginBottom: "10px" }}>
                  This is to certify that
                </p>

                <h2 className="acad-cert-recipient" style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem", fontWeight: 800, color: "var(--navy)", marginBottom: "14px" }}>
                  {certData.learnerName}
                </h2>

                <p style={{ color: "var(--muted)", marginBottom: "24px", maxWidth: "60ch", lineHeight: 1.6 }}>
                  has successfully demonstrated rigorous mastery through instructor-led practitioner tracks, practical code laboratories, and capstone defense requirements for the professional curriculum:
                </p>

                <div className="acad-cert-program" style={{ background: "#f8fafd", border: "1px solid #dce5f5", borderRadius: "10px", padding: "22px", marginBottom: "28px" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy)", marginBottom: "4px" }}>
                    {certData.courseTitle}
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
                    Track: {certData.category} · {certData.durationWeeks} Weeks Guided Practicum &amp; Systems Engineering
                  </div>
                </div>

                <div className="acad-cert-meta-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", borderTop: "1px solid #dce5f5", paddingTop: "20px" }}>
                  <div>
                    <div className="acad-overview-label">Credential Verification ID</div>
                    <strong className="acad-mono" style={{ color: "var(--navy)", fontSize: "0.92rem" }}>{certData.code}</strong>
                  </div>
                  <div>
                    <div className="acad-overview-label">Completion &amp; Issue Date</div>
                    <strong className="acad-mono" style={{ color: "var(--navy)", fontSize: "0.92rem" }}>
                      {new Date(certData.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </strong>
                  </div>
                  <div>
                    <div className="acad-overview-label">Academic Dean / Instructor</div>
                    <strong style={{ color: "var(--navy)", fontSize: "0.92rem" }}>{certData.instructorName}</strong>
                  </div>
                </div>
              </article>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }} className="acad-no-print">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="btn btn-outline"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-gold"
                >
                  <Printer size={16} />
                  <span>Download / Print High-Resolution PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
