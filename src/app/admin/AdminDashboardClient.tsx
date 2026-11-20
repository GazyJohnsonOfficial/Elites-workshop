"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Award, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";
import type {
  Certificate,
  CorporateQuote,
  Course,
  Enrollment,
  Organization,
  TuitionPayment,
} from "@/lib/academyStore";

interface Registration {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  jobTitle: string;
  organisation: string | null;
  experience: string;
  tools: string | null;
  goals: string | null;
  source: string | null;
  status: string;
  createdAt: string;
}

interface Enquiry {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  region: string;
  topic: string;
  message: string;
  status: string;
  createdAt: string;
}

interface InitialAcademyData {
  courses: Course[];
  enrollments: Enrollment[];
  payments: TuitionPayment[];
  quotes: CorporateQuote[];
  organizations: Organization[];
  certificates: Certificate[];
}

type AdminTab =
  | "registrations"
  | "enquiries"
  | "academy_enrollments"
  | "academy_quotes"
  | "academy_courses";

export function AdminDashboardClient({
  initialRegistrations,
  initialEnquiries,
  initialAcademy,
  userEmail,
}: {
  initialRegistrations: Registration[];
  initialEnquiries: Enquiry[];
  initialAcademy: InitialAcademyData;
  userEmail: string;
}) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [academy, setAcademy] = useState<InitialAcademyData>(initialAcademy);
  const [activeTab, setActiveTab] = useState<AdminTab>("registrations");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [adminFeedback, setAdminFeedback] = useState<string>("");

  // Add course form
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newCategory, setNewCategory] = useState("Cloud & DevOps");
  const [newMode, setNewMode] = useState("Instructor-Led");
  const [newLevel, setNewLevel] = useState("Intermediate");
  const [newWeeks, setNewWeeks] = useState(8);
  const [newTuitionUsd, setNewTuitionUsd] = useState(950);
  const [newTools, setNewTools] = useState("Terraform, AWS, Docker");

  const router = useRouter();

  const refreshAcademy = async () => {
    const res = await fetch("/api/academy/admin", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setAcademy({
        courses: data.courses || [],
        enrollments: data.enrollments || [],
        payments: data.payments || [],
        quotes: data.quotes || [],
        organizations: data.organizations || [],
        certificates: data.certificates || [],
      });
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.dispatchEvent(new Event("ets-academy-session-changed"));
    router.push("/admin/login");
    router.refresh();
  };

  const handleUpdateRegStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    const res = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleUpdateEnqStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleAcademyAction = async (payload: Record<string, unknown>, message: string) => {
    setUpdatingId(String(payload.paymentId || payload.quoteId || payload.enrollmentId || payload.courseId || "busy"));
    setAdminFeedback("");
    try {
      const res = await fetch("/api/academy/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await refreshAcademy();
        setAdminFeedback(message);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingId("new-course");
    setAdminFeedback("");
    try {
      const res = await fetch("/api/academy/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          subtitle: newSubtitle,
          category: newCategory,
          deliveryMode: newMode,
          level: newLevel,
          durationWeeks: newWeeks,
          tuitionUsd: newTuitionUsd,
          tools: newTools,
        }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewSubtitle("");
        setShowAddCourse(false);
        await refreshAcademy();
        setAdminFeedback("New Academy course track added to live catalog.");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingPaymentsCount = academy.payments.filter((p) => p.status === "pending").length;

  return (
    <div className="adm-shell">
      <header className="adm-topbar">
        <div className="container adm-topbar-inner">
          <div className="adm-title-group">
            <h1>Unified Operations &amp; Academy Console</h1>
            <p>
              Signed in as <strong>{userEmail}</strong>
            </p>
          </div>

          <div className="adm-actions">
            <Link href="/academy" className="btn btn-navy btn-sm">
              Open Academy Portal
            </Link>
            <Link href="/" className="btn btn-outline btn-sm">
              Corporate Site
            </Link>
            <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="adm-body">
        <div className="container">
          {/* KPI Strip */}
          <div className="acad-kpi-grid">
            <div className="acad-kpi-card">
              <span className="label">Cohort Registrations</span>
              <strong>{registrations.length}</strong>
              <small>{registrations.filter((r) => r.status === "pending").length} pending follow-up</small>
            </div>

            <div className="acad-kpi-card">
              <span className="label">Academy Enrollments</span>
              <strong style={{ color: "var(--blue)" }}>{academy.enrollments.length}</strong>
              <small>{academy.certificates.length} verified certificates issued</small>
            </div>

            <div className="acad-kpi-card">
              <span className="label">Pending Tuition Verification</span>
              <strong style={{ color: pendingPaymentsCount > 0 ? "var(--gold-dark)" : "var(--ok-text)" }}>
                {pendingPaymentsCount}
              </strong>
              <small>{academy.quotes.length} corporate quotes tracked</small>
            </div>

            <div className="acad-kpi-card">
              <span className="label">Website Inquiries</span>
              <strong>{enquiries.length}</strong>
              <small>Next cohort: {SITE_CONFIG.PROGRAMME.START_DATE_TEXT}</small>
            </div>
          </div>

          {adminFeedback && (
            <div className="alert-success" role="status">
              {adminFeedback}
            </div>
          )}

          {/* Main Console Panel */}
          <section className="adm-panel">
            <div className="adm-panel-bar">
              <div className="adm-tabs" role="tablist" aria-label="Operations sections">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "registrations"}
                  className={`adm-tab ${activeTab === "registrations" ? "active" : ""}`}
                  onClick={() => { setActiveTab("registrations"); setStatusFilter("all"); }}
                >
                  Registrations ({registrations.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "enquiries"}
                  className={`adm-tab ${activeTab === "enquiries" ? "active" : ""}`}
                  onClick={() => { setActiveTab("enquiries"); setStatusFilter("all"); }}
                >
                  Service Inquiries ({enquiries.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "academy_enrollments"}
                  className={`adm-tab ${activeTab === "academy_enrollments" ? "active" : ""}`}
                  onClick={() => { setActiveTab("academy_enrollments"); setStatusFilter("all"); }}
                >
                  Academy Enrollments &amp; Tuition ({academy.enrollments.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "academy_quotes"}
                  className={`adm-tab ${activeTab === "academy_quotes" ? "active" : ""}`}
                  onClick={() => { setActiveTab("academy_quotes"); setStatusFilter("all"); }}
                >
                  Corporate Quotes ({academy.quotes.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "academy_courses"}
                  className={`adm-tab ${activeTab === "academy_courses" ? "active" : ""}`}
                  onClick={() => { setActiveTab("academy_courses"); setStatusFilter("all"); }}
                >
                  Courses Catalog ({academy.courses.length})
                </button>
              </div>

              {activeTab === "registrations" && (
                <a href="/api/admin/export" className="btn btn-outline btn-sm" download>
                  <Icon id="i-table" className="ico" />
                  <span>Export CSV</span>
                </a>
              )}
            </div>

            {(activeTab === "registrations" || activeTab === "enquiries") && (
              <div className="adm-filter-row">
                <input
                  type="search"
                  className="acad-input"
                  placeholder="Search by name, email, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ flex: 1, minWidth: "240px" }}
                />
                <select
                  className="acad-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ minWidth: "160px" }}
                >
                  <option value="all">All statuses</option>
                  {activeTab === "registrations" ? (
                    <>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="cancelled">Cancelled</option>
                    </>
                  ) : (
                    <>
                      <option value="new">New</option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* TAB 1: Legacy Registrations */}
            {activeTab === "registrations" && (
              <div className="acad-table-wrap">
                <table className="acad-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Student</th>
                      <th>Contact</th>
                      <th>Background</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "var(--muted)" }}>
                          No registrations found matching your query.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((r) => (
                        <tr key={r.id}>
                          <td className="acad-mono" style={{ fontWeight: 700 }}>{r.reference}</td>
                          <td>
                            <strong>{r.fullName}</strong>
                            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                              {r.jobTitle} {r.organisation ? `· ${r.organisation}` : ""}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--blue)", fontWeight: 600 }}>{r.country}</div>
                          </td>
                          <td>
                            <div><a href={`mailto:${r.email}`}>{r.email}</a></div>
                            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{r.phone}</div>
                          </td>
                          <td style={{ maxWidth: "200px", fontSize: "0.82rem" }}>{r.experience}</td>
                          <td>
                            <select
                              value={r.status}
                              disabled={updatingId === r.id}
                              onChange={(e) => handleUpdateRegStatus(r.id, e.target.value)}
                              className="adm-status-select"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="enrolled">Enrolled</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="acad-mono" style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteRegistration(r.id)}
                              className="acad-link-danger"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: Service Inquiries */}
            {activeTab === "enquiries" && (
              <div className="acad-table-wrap">
                <table className="acad-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Contact</th>
                      <th>Topic &amp; Region</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "var(--muted)" }}>
                          No inquiries found matching your query.
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map((e) => (
                        <tr key={e.id}>
                          <td className="acad-mono" style={{ fontWeight: 700 }}>{e.reference}</td>
                          <td>
                            <strong>{e.fullName}</strong>
                            <div><a href={`mailto:${e.email}`}>{e.email}</a></div>
                          </td>
                          <td>
                            <strong style={{ color: "var(--blue)", fontSize: "0.84rem" }}>{e.topic}</strong>
                            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "2px" }}>
                              Region: {e.region}
                            </div>
                          </td>
                          <td style={{ maxWidth: "300px" }}>
                            <div style={{ fontSize: "0.83rem", maxHeight: "76px", overflowY: "auto", whiteSpace: "pre-wrap" }}>
                              {e.message}
                            </div>
                          </td>
                          <td>
                            <select
                              value={e.status}
                              disabled={updatingId === e.id}
                              onChange={(eVal) => handleUpdateEnqStatus(e.id, eVal.target.value)}
                              className="adm-status-select"
                            >
                              <option value="new">New</option>
                              <option value="responded">Responded</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="acad-mono" style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                            {new Date(e.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteEnquiry(e.id)}
                              className="acad-link-danger"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: Academy Enrollments & Tuition Ledger */}
            {activeTab === "academy_enrollments" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                <div>
                  <h2 style={{ fontSize: "1.12rem", color: "var(--navy)", marginBottom: "12px" }}>
                    Learner Enrollments &amp; Credentials
                  </h2>
                  <div className="acad-table-wrap">
                    <table className="acad-table">
                      <thead>
                        <tr>
                          <th>Reference</th>
                          <th>Learner</th>
                          <th>Course</th>
                          <th>Plan &amp; Paid</th>
                          <th>Modules Done</th>
                          <th>Credential</th>
                        </tr>
                      </thead>
                      <tbody>
                        {academy.enrollments.map((enr) => {
                          const crs = academy.courses.find((c) => c.id === enr.courseId);
                          const totalMods = crs?.modules.length || 1;
                          return (
                            <tr key={enr.id}>
                              <td className="acad-mono" style={{ fontWeight: 700 }}>{enr.reference}</td>
                              <td>
                                <strong>{enr.learnerName}</strong>
                                <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{enr.learnerEmail}</div>
                              </td>
                              <td>{crs?.title || enr.courseId}</td>
                              <td className="acad-mono">
                                ${enr.amountPaidUsd} / ${enr.totalUsd} ({enr.paymentStatus.replace(/_/g, " ")})
                              </td>
                              <td className="acad-mono">
                                {enr.completedModuleIds.length}/{totalMods}
                              </td>
                              <td>
                                {enr.certificateCode ? (
                                  <Link href={`/academy/verify/${enr.certificateCode}`} className="acad-mono" style={{ fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                    <Award size={14} />
                                    <span>{enr.certificateCode}</span>
                                  </Link>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={updatingId === enr.id}
                                    onClick={() =>
                                      handleAcademyAction(
                                        { action: "issue_certificate", enrollmentId: enr.id },
                                        `Certificate issued for ${enr.learnerName}.`
                                      )
                                    }
                                    className="btn btn-outline btn-sm"
                                  >
                                    Issue Certificate
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h2 style={{ fontSize: "1.12rem", color: "var(--navy)", marginBottom: "12px" }}>
                    Tuition Payment &amp; Installment Ledger
                  </h2>
                  <div className="acad-table-wrap">
                    <table className="acad-table">
                      <thead>
                        <tr>
                          <th>Payment Ref</th>
                          <th>Payer</th>
                          <th>Description</th>
                          <th>Amount</th>
                          <th>Channel</th>
                          <th>Status / Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {academy.payments.map((pay) => (
                          <tr key={pay.id}>
                            <td className="acad-mono" style={{ fontWeight: 700 }}>{pay.reference}</td>
                            <td>
                              <strong>{pay.payerName}</strong>
                              <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{pay.payerEmail}</div>
                            </td>
                            <td>{pay.description}</td>
                            <td className="acad-mono" style={{ fontWeight: 700 }}>{pay.amountLocalFormatted}</td>
                            <td>{pay.channel}</td>
                            <td>
                              {pay.status === "verified" ? (
                                <span className="acad-status-ok">
                                  <CheckCircle2 size={15} /> Verified
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={updatingId === pay.id}
                                  onClick={() =>
                                    handleAcademyAction(
                                      { action: "verify_payment", paymentId: pay.id },
                                      `Payment ${pay.reference} verified and enrollment balance updated.`
                                    )
                                  }
                                  className="btn btn-gold btn-sm"
                                >
                                  Verify Settlement
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Corporate Quotes & Organizations */}
            {activeTab === "academy_quotes" && (
              <div className="acad-table-wrap">
                <table className="acad-table">
                  <thead>
                    <tr>
                      <th>Quote Ref</th>
                      <th>Organization</th>
                      <th>Course</th>
                      <th>Seats</th>
                      <th>Quoted Total</th>
                      <th>Terms</th>
                      <th>Status / Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academy.quotes.map((qt) => (
                      <tr key={qt.id}>
                        <td className="acad-mono" style={{ fontWeight: 700 }}>{qt.reference}</td>
                        <td>
                          <strong>{qt.organizationName}</strong>
                          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                            {qt.contactName} · {qt.contactEmail}
                          </div>
                        </td>
                        <td>{qt.courseTitle}</td>
                        <td className="acad-mono">{qt.seatCount}</td>
                        <td className="acad-mono" style={{ fontWeight: 700 }}>{qt.totalLocalFormatted}</td>
                        <td>{qt.billingTerms}</td>
                        <td>
                          {qt.status === "pending" ? (
                            <button
                              type="button"
                              disabled={updatingId === qt.id}
                              onClick={() =>
                                handleAcademyAction(
                                  { action: "approve_quote", quoteId: qt.id },
                                  `Quote ${qt.reference} approved and Net-30 invoice active.`
                                )
                              }
                              className="btn btn-navy btn-sm"
                            >
                              Approve Quote
                            </button>
                          ) : (
                            <span className="acad-status-ok" style={{ textTransform: "capitalize" }}>
                              {qt.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 5: Courses Catalog */}
            {activeTab === "academy_courses" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                  <h2 style={{ fontSize: "1.12rem", color: "var(--navy)", margin: 0 }}>
                    Academy Catalog Programs ({academy.courses.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowAddCourse(!showAddCourse)}
                    className="btn btn-navy btn-sm"
                  >
                    <Plus size={15} />
                    <span>{showAddCourse ? "Cancel New Course" : "Add Course Track"}</span>
                  </button>
                </div>

                {showAddCourse && (
                  <form
                    onSubmit={handleCreateCourse}
                    className="acad-surface-note"
                    style={{ marginTop: 0, marginBottom: "20px", padding: "18px" }}
                  >
                    <div className="acad-form-grid">
                      <div className="acad-field">
                        <label htmlFor="new-course-title">Program Title</label>
                        <input
                          id="new-course-title"
                          type="text"
                          required
                          placeholder="AWS Solutions Architect Accelerator"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                      </div>
                      <div className="acad-field">
                        <label htmlFor="new-course-sub">Subtitle</label>
                        <input
                          id="new-course-sub"
                          type="text"
                          required
                          placeholder="Multi-account landing zones, IAM governance, and high-availability labs"
                          value={newSubtitle}
                          onChange={(e) => setNewSubtitle(e.target.value)}
                        />
                      </div>
                      <div className="acad-field">
                        <label htmlFor="new-course-cat">Category</label>
                        <select id="new-course-cat" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                          <option value="Cloud & DevOps">Cloud &amp; DevOps</option>
                          <option value="Data & BI">Data &amp; BI</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                          <option value="Data & Automation">Data &amp; Automation</option>
                        </select>
                      </div>
                      <div className="acad-field">
                        <label htmlFor="new-course-mode">Delivery Format</label>
                        <select id="new-course-mode" value={newMode} onChange={(e) => setNewMode(e.target.value)}>
                          <option value="Instructor-Led">Instructor-Led</option>
                          <option value="Self-Paced">Self-Paced</option>
                          <option value="Corporate Bootcamp">Corporate Bootcamp</option>
                        </select>
                      </div>
                      <div className="acad-field">
                        <label htmlFor="new-course-level">Skill Level</label>
                        <select id="new-course-level" value={newLevel} onChange={(e) => setNewLevel(e.target.value)}>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div className="acad-field">
                        <label htmlFor="new-course-weeks">Duration (Weeks)</label>
                        <input
                          id="new-course-weeks"
                          type="number"
                          min={1}
                          max={52}
                          value={newWeeks}
                          onChange={(e) => setNewWeeks(Number(e.target.value) || 8)}
                        />
                      </div>
                      <div className="acad-field">
                        <label htmlFor="new-course-usd">Standard Tuition (USD)</label>
                        <input
                          id="new-course-usd"
                          type="number"
                          min={100}
                          max={25000}
                          value={newTuitionUsd}
                          onChange={(e) => setNewTuitionUsd(Number(e.target.value) || 950)}
                        />
                      </div>
                      <div className="acad-field">
                        <label htmlFor="new-course-tools">Tools (comma separated)</label>
                        <input
                          id="new-course-tools"
                          type="text"
                          value={newTools}
                          onChange={(e) => setNewTools(e.target.value)}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: "14px" }}>
                      <button type="submit" disabled={updatingId === "new-course"} className="btn btn-gold btn-sm">
                        Save &amp; Publish Course Track
                      </button>
                    </div>
                  </form>
                )}

                <div className="acad-table-wrap">
                  <table className="acad-table">
                    <thead>
                      <tr>
                        <th>Program Title</th>
                        <th>Category &amp; Mode</th>
                        <th>Duration</th>
                        <th>Tuition (USD)</th>
                        <th>Status</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {academy.courses.map((course) => (
                        <tr key={course.id}>
                          <td>
                            <Link href={`/academy/courses/${course.slug}`} style={{ fontWeight: 700, color: "var(--navy)" }}>
                              {course.title}
                            </Link>
                          </td>
                          <td>{course.category} · {course.deliveryMode}</td>
                          <td className="acad-mono">{course.durationWeeks} wks ({course.modules.length} modules)</td>
                          <td className="acad-mono" style={{ fontWeight: 700 }}>${course.tuitionUsd.toLocaleString("en-US")}</td>
                          <td style={{ fontWeight: 700, color: course.status === "active" ? "var(--ok-text)" : "var(--muted)", textTransform: "capitalize" }}>
                            {course.status}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              disabled={updatingId === course.id}
                              onClick={() =>
                                handleAcademyAction(
                                  {
                                    action: "update_course",
                                    courseId: course.id,
                                    status: course.status === "active" ? "draft" : "active",
                                  },
                                  `Updated status for ${course.title}.`
                                )
                              }
                              className="btn btn-outline btn-sm"
                            >
                              {course.status === "active" ? "Move to Draft" : "Publish Active"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
