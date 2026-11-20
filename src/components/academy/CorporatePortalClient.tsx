"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Award, Building2, Download, Plus, Printer, Trash2 } from "lucide-react";
import type {
  CorporateQuote,
  Course,
  CurrencyCode,
  Enrollment,
  Organization,
} from "@/lib/academyStore";
import { CORPORATE_LEARNING_PLANS } from "@/lib/curriculumAssessments";
import { getClientDetectedRegion } from "@/lib/geoCurrency";
import { CorporateShowcase } from "./CorporateShowcase";

interface TeamEnrollment extends Enrollment {
  courseTitle: string;
  progressPercent: number;
  totalModules: number;
}

export function CorporatePortalClient({
  initialCourses = [],
  initialAuthenticated = false,
  initialCurrency = "USD",
}: {
  initialCourses?: Course[];
  initialAuthenticated?: boolean;
  initialCurrency?: CurrencyCode;
}) {
  const [loading, setLoading] = useState(initialAuthenticated);
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [org, setOrg] = useState<Organization | null>(null);
  const [quotes, setQuotes] = useState<CorporateQuote[]>([]);
  const [team, setTeam] = useState<TeamEnrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Seat assignment form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("United States");
  const [courseId, setCourseId] = useState("");
  const [assignType, setAssignType] = useState<"course" | "plan">("course");
  const [planId, setPlanId] = useState(CORPORATE_LEARNING_PLANS[0]?.id || "");

  useEffect(() => {
    setCountry(getClientDetectedRegion().defaultCountry);
  }, []);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Table filter
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  const loadCorporateData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/corporate", { cache: "no-store" });
      if (res.status === 401) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setAuthenticated(true);
      setOrg(data.organization || null);
      setQuotes(data.quotes || []);
      setTeam(data.teamEnrollments || []);
      const courseList: Course[] = data.courses || [];
      setCourses(courseList);
      if (courseList.length > 0) {
        setCourseId((prev) => prev || courseList[0].id);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialAuthenticated) {
      loadCorporateData();
    }
    const handler = () => loadCorporateData();
    window.addEventListener("ets-academy-session-changed", handler);
    return () => window.removeEventListener("ets-academy-session-changed", handler);
  }, [initialAuthenticated, loadCorporateData]);

  const handleAssignSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFeedback(null);
    const activePlan = CORPORATE_LEARNING_PLANS.find((p) => p.id === planId);
    const payload =
      assignType === "plan" && activePlan
        ? { fullName, email, country, courseIds: activePlan.courseIds }
        : { fullName, email, country, courseId };
    try {
      const res = await fetch("/api/academy/corporate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to assign seat.");
      const countAssigned = Array.isArray(data.enrollments) ? data.enrollments.length : 1;
      setFullName("");
      setEmail("");
      await loadCorporateData();
      setFeedback({
        type: "ok",
        text:
          countAssigned > 1
            ? `Assigned ${countAssigned}-course departmental pathway to ${fullName}.`
            : `Seat assigned to ${fullName} (${data.enrollment.reference}).`,
      });
    } catch (err) {
      setFeedback({ type: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const handleRevokeSeat = async (enrollmentId: string, name: string) => {
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/academy/corporate?enrollmentId=${encodeURIComponent(enrollmentId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to revoke seat.");
      await loadCorporateData();
      setFeedback({ type: "ok", text: `Seat released from ${name}.` });
    } catch (err) {
      setFeedback({ type: "err", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const filteredTeam = useMemo(() => {
    const q = search.trim().toLowerCase();
    return team.filter((t) => {
      if (courseFilter !== "all" && t.courseId !== courseFilter) return false;
      if (q) {
        const hay = `${t.learnerName} ${t.learnerEmail} ${t.courseTitle} ${t.country}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [team, search, courseFilter]);

  const handleExportCsv = () => {
    if (filteredTeam.length === 0) return;
    const headers = ["Reference", "Employee Name", "Work Email", "Country", "Course", "Progress %", "Completed Modules", "Certificate"];
    const rows = filteredTeam.map((t) => [
      t.reference,
      `"${t.learnerName.replace(/"/g, '""')}"`,
      t.learnerEmail,
      t.country,
      `"${t.courseTitle.replace(/"/g, '""')}"`,
      `${t.progressPercent}%`,
      `${t.completedModuleIds.length}/${t.totalModules}`,
      t.certificateCode || "In Progress",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `corporate-team-telemetry-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main id="main" className="acad-section">
        <div className="container">
          <div className="acad-card acad-gate-card">Loading Corporate Team Portal...</div>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <CorporateShowcase
        courses={initialCourses}
        initialCurrency={initialCurrency}
      />
    );
  }

  if (!org) {
    return (
      <main id="main" className="acad-section">
        <div className="container">
          <div className="acad-card acad-gate-card">
            <h2 style={{ color: "var(--navy)", marginBottom: "10px" }}>No Corporate Seat Account Provisioned Yet</h2>
            <p style={{ color: "var(--muted)", marginBottom: "22px" }}>
              Generate a 5+ seat corporate quote in the Tuition Calculator to immediately provision your organization dashboard and start assigning seats.
            </p>
            <Link href="/academy/tuition?mode=corporate" className="btn btn-gold">
              Create Corporate Seat Quote
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const availableSeats = Math.max(0, org.seatQuota - org.seatsUsed);
  const avgProgress =
    team.length > 0
      ? Math.round(team.reduce((acc, t) => acc + t.progressPercent, 0) / team.length)
      : 0;
  const certifiedCount = team.filter((t) => Boolean(t.certificateCode)).length;
  const teamScores = team.flatMap((t) =>
    Object.values(t.moduleScores || {}).filter(
      (s): s is number => typeof s === "number" && Number.isFinite(s)
    )
  );
  const avgCheckpointPct =
    teamScores.length > 0
      ? Math.round(teamScores.reduce((acc, s) => acc + s, 0) / teamScores.length)
      : 0;

  return (
    <main id="main">
      <section className="acad-page-hero" style={{ padding: "28px 0" }}>
        <div className="container">
          <div className="acad-page-hero-row">
            <div>
              <div className="acad-course-meta-line" style={{ marginBottom: "4px" }}>
                Corporate Seat Account · {org.reference} · {org.region}
              </div>
              <h1 style={{ margin: 0 }}>{org.name}: Team Enablement Portal</h1>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/academy/tuition?mode=corporate" className="btn btn-outline btn-sm">
                Add More Seats
              </Link>
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={filteredTeam.length === 0}
                className="btn btn-navy btn-sm acad-no-print"
              >
                <Download size={15} />
                <span>Export Telemetry CSV</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                disabled={filteredTeam.length === 0}
                className="btn btn-outline btn-sm acad-no-print"
              >
                <Printer size={15} />
                <span>Print Report</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="acad-section acad-section-compact">
        <div className="container">
          {/* KPI Strip */}
          <motion.div
            className="acad-kpi-grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="acad-kpi-card">
              <span className="label">Purchased Seat Quota</span>
              <strong>{org.seatQuota}</strong>
              <small>Active corporate license pool</small>
            </div>
            <div className="acad-kpi-card">
              <span className="label">Assigned Employees</span>
              <strong>{org.seatsUsed}</strong>
              <small>{certifiedCount} certified graduates</small>
            </div>
            <div className="acad-kpi-card">
              <span className="label">Available Seats</span>
              <strong style={{ color: availableSeats > 0 ? "var(--ok-text)" : "var(--danger)" }}>
                {availableSeats}
              </strong>
              <small>Ready for immediate assignment</small>
            </div>
            <div className="acad-kpi-card">
              <span className="label">Avg. Team Completion</span>
              <strong style={{ color: "var(--blue)" }}>{avgProgress}%</strong>
              <small>
                {teamScores.length > 0
                  ? `Checkpoint Avg: ${avgCheckpointPct}%`
                  : "Across all enrolled modules"}
              </small>
            </div>
          </motion.div>

          {feedback && (
            <div className={feedback.type === "ok" ? "alert-success" : "alert-error"} role="status">
              {feedback.text}
            </div>
          )}

          {/* Assign Seat Form */}
          <div className="acad-card acad-no-print" style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.16rem", color: "var(--navy)", marginBottom: "4px" }}>
                  Assign Seat or Departmental Learning Plan
                </h2>
                <p style={{ fontSize: "0.87rem", color: "var(--muted)", margin: 0 }}>
                  Assign an individual program seat or provision a structured multi-course pathway (1 seat per course).
                </p>
              </div>
              <div className="acad-cat-view-switch" role="group" aria-label="Assignment type">
                <button
                  type="button"
                  onClick={() => setAssignType("course")}
                  className={`acad-cat-view-btn ${assignType === "course" ? "active" : ""}`}
                >
                  Single Track
                </button>
                <button
                  type="button"
                  onClick={() => setAssignType("plan")}
                  className={`acad-cat-view-btn ${assignType === "plan" ? "active" : ""}`}
                >
                  Learning Plan (2 Tracks)
                </button>
              </div>
            </div>
            <form onSubmit={handleAssignSeat} className="acad-form-grid-auto">
              <div className="acad-field">
                <label htmlFor="seat-name">Employee Name</label>
                <input
                  id="seat-name"
                  type="text"
                  required
                  placeholder="Ama Serwaa"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="acad-field">
                <label htmlFor="seat-email">Work Email</label>
                <input
                  id="seat-email"
                  type="email"
                  required
                  placeholder="a.serwaa@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="acad-field">
                <label htmlFor="seat-country">Hub / Country</label>
                <select id="seat-country" value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="Ghana">Ghana</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              {assignType === "plan" ? (
                <div className="acad-field">
                  <label htmlFor="seat-plan">Departmental Pathway</label>
                  <select id="seat-plan" value={planId} onChange={(e) => setPlanId(e.target.value)}>
                    {CORPORATE_LEARNING_PLANS.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} ({plan.courseIds.length} seats)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="acad-field">
                  <label htmlFor="seat-course">Assign Program</label>
                  <select id="seat-course" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <button
                  type="submit"
                  disabled={busy || availableSeats <= 0}
                  className="btn btn-gold btn-block"
                  style={{ height: "41px" }}
                >
                  <Plus size={16} />
                  <span>
                    {availableSeats <= 0
                      ? "Quota Full"
                      : assignType === "plan"
                      ? "Assign Learning Plan"
                      : "Assign Seat"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Team Telemetry Table */}
          <div className="acad-card" style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "1.16rem", color: "var(--navy)", margin: 0 }}>
                Team Skill Completion Telemetry ({filteredTeam.length})
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <input
                  type="search"
                  className="acad-input"
                  placeholder="Filter by employee or hub..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="acad-select"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="all">All Assigned Courses</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="acad-table-wrap">
              <table className="acad-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Hub</th>
                    <th>Enrolled Track</th>
                    <th>Completion Progress</th>
                    <th>Credential</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeam.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "28px", color: "var(--muted)" }}>
                        No assigned team members match your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTeam.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <strong>{member.learnerName}</strong>
                          <div style={{ fontSize: "0.79rem", color: "var(--muted)" }}>{member.learnerEmail}</div>
                        </td>
                        <td>{member.country}</td>
                        <td>{member.courseTitle}</td>
                        <td style={{ minWidth: "180px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.77rem", marginBottom: "4px" }}>
                            <span className="acad-mono" style={{ fontWeight: 700, color: "var(--navy)" }}>
                              {member.progressPercent}%
                            </span>
                            <span className="acad-mono" style={{ color: "var(--muted)" }}>
                              {member.completedModuleIds.length}/{member.totalModules} modules
                            </span>
                          </div>
                          <div className="acad-progress-track">
                            <div className="acad-progress-fill" style={{ width: `${member.progressPercent}%` }} />
                          </div>
                        </td>
                        <td>
                          {member.certificateCode ? (
                            <Link href={`/academy/verify/${member.certificateCode}`} className="acad-mono" style={{ fontWeight: 700, fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                              <Award size={14} />
                              <span>{member.certificateCode}</span>
                            </Link>
                          ) : (
                            <span className="acad-status-muted">In Training</span>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleRevokeSeat(member.id, member.learnerName)}
                            className="acad-link-danger"
                          >
                            <Trash2 size={14} />
                            <span>Revoke</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Purchase Orders & Quotes */}
          {quotes.length > 0 && (
            <div className="acad-card">
              <h2 style={{ fontSize: "1.14rem", color: "var(--navy)", marginBottom: "12px" }}>
                Corporate Quotes &amp; Purchase Order Ledger
              </h2>
              <div className="acad-table-wrap">
                <table className="acad-table">
                  <thead>
                    <tr>
                      <th>Quote Ref</th>
                      <th>Program</th>
                      <th>Seats</th>
                      <th>Total</th>
                      <th>Terms</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((qt) => (
                      <tr key={qt.id}>
                        <td className="acad-mono" style={{ fontWeight: 700 }}>{qt.reference}</td>
                        <td>{qt.courseTitle}</td>
                        <td className="acad-mono">{qt.seatCount}</td>
                        <td className="acad-mono" style={{ fontWeight: 700 }}>{qt.totalLocalFormatted}</td>
                        <td>{qt.billingTerms}</td>
                        <td style={{ fontWeight: 700, textTransform: "capitalize", color: qt.status === "paid" ? "var(--ok-text)" : "var(--blue)" }}>
                          {qt.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
