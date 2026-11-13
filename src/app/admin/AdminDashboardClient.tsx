"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";

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

export function AdminDashboardClient({
  initialRegistrations,
  initialEnquiries,
  userEmail,
}: {
  initialRegistrations: Registration[];
  initialEnquiries: Enquiry[];
  userEmail: string;
}) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [activeTab, setActiveTab] = useState<"registrations" | "enquiries">("registrations");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
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
    if (!confirm("Are you sure you want to delete this registration? This cannot be undone.")) return;
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
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // Filtering
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

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh", padding: "32px 0 64px 0" }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "1.75rem", color: "var(--navy)", margin: 0 }}>
                Operations Dashboard
              </h1>
              <span className="admin-badge admin-badge-confirmed">Online</span>
            </div>
            <p style={{ margin: "4px 0 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>
              Logged in as <strong>{userEmail}</strong>
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link href="/" className="btn btn-outline btn-sm">
              View Website
            </Link>
            <button type="button" onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ border: "1px solid var(--line)" }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          <div className="card" style={{ padding: "20px" }}>
            <div style={{ color: "var(--muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Total Registrations
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--navy)", marginTop: "4px" }}>
              {registrations.length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px" }}>
              {registrations.filter((r) => r.status === "confirmed" || r.status === "enrolled").length} confirmed/enrolled
            </div>
          </div>

          <div className="card" style={{ padding: "20px" }}>
            <div style={{ color: "var(--muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Pending Action
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--gold-dark)", marginTop: "4px" }}>
              {registrations.filter((r) => r.status === "pending").length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px" }}>
              Awaiting cohort onboarding
            </div>
          </div>

          <div className="card" style={{ padding: "20px" }}>
            <div style={{ color: "var(--muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Website Inquiries
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--blue)", marginTop: "4px" }}>
              {enquiries.length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px" }}>
              {enquiries.filter((e) => e.status === "new").length} new unanswered
            </div>
          </div>

          <div className="card" style={{ padding: "20px" }}>
            <div style={{ color: "var(--muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Upcoming Cohort
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--navy)", marginTop: "6px" }}>
              {SITE_CONFIG.PROGRAMME.START_DATE_TEXT}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px" }}>
              {SITE_CONFIG.PROGRAMME.NAME}
            </div>
          </div>
        </div>

        {/* Tab Controls & Actions */}
        <div className="card" style={{ padding: "24px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "16px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === "registrations" ? "btn-gold" : "btn-outline"}`}
                onClick={() => { setActiveTab("registrations"); setStatusFilter("all"); }}
              >
                Data Analysis Registrations ({registrations.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === "enquiries" ? "btn-gold" : "btn-outline"}`}
                onClick={() => { setActiveTab("enquiries"); setStatusFilter("all"); }}
              >
                Service Inquiries ({enquiries.length})
              </button>
            </div>

            {activeTab === "registrations" && (
              <a href="/api/admin/export" className="btn btn-outline btn-sm" download>
                <Icon id="i-table" className="ico" /> Export CSV
              </a>
            )}
          </div>

          {/* Search & Filters */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Search by name, email, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, minWidth: "240px", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "0.9rem" }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: "160px", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "0.9rem" }}
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

          {/* Registrations Table */}
          {activeTab === "registrations" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "var(--paper)", borderBottom: "2px solid var(--line)", textAlign: "left" }}>
                    <th style={{ padding: "12px" }}>Reference</th>
                    <th style={{ padding: "12px" }}>Student</th>
                    <th style={{ padding: "12px" }}>Contact</th>
                    <th style={{ padding: "12px" }}>Background</th>
                    <th style={{ padding: "12px" }}>Status</th>
                    <th style={{ padding: "12px" }}>Date</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
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
                      <tr key={r.id} style={{ borderBottom: "1px solid var(--line)" }}>
                        <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: 700 }}>
                          {r.reference}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <strong>{r.fullName}</strong>
                          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                            {r.jobTitle} {r.organisation ? `· ${r.organisation}` : ""}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--blue)" }}>{r.country}</div>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <div><a href={`mailto:${r.email}`}>{r.email}</a></div>
                          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{r.phone}</div>
                        </td>
                        <td style={{ padding: "12px", maxWidth: "200px" }}>
                          <span style={{ fontSize: "0.8rem" }}>{r.experience}</span>
                          {r.tools && (
                            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "2px" }}>
                              Tools: {r.tools}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <select
                            value={r.status}
                            disabled={updatingId === r.id}
                            onChange={(e) => handleUpdateRegStatus(r.id, e.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid var(--line)",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              background: r.status === "enrolled" ? "#dbeafe" : r.status === "confirmed" ? "#d1fae5" : "#fef3c7",
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="enrolled">Enrolled</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ padding: "12px", fontSize: "0.8rem", color: "var(--muted)" }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteRegistration(r.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", fontSize: "0.85rem" }}
                            title="Delete registration"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Enquiries Table */}
          {activeTab === "enquiries" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "var(--paper)", borderBottom: "2px solid var(--line)", textAlign: "left" }}>
                    <th style={{ padding: "12px" }}>Reference</th>
                    <th style={{ padding: "12px" }}>Contact</th>
                    <th style={{ padding: "12px" }}>Topic & Region</th>
                    <th style={{ padding: "12px" }}>Message</th>
                    <th style={{ padding: "12px" }}>Status</th>
                    <th style={{ padding: "12px" }}>Date</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
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
                      <tr key={e.id} style={{ borderBottom: "1px solid var(--line)" }}>
                        <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: 700 }}>
                          {e.reference}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <strong>{e.fullName}</strong>
                          <div><a href={`mailto:${e.email}`}>{e.email}</a></div>
                          {e.phone && <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{e.phone}</div>}
                          {e.organisation && (
                            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Org: {e.organisation}</div>
                          )}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span className="admin-badge admin-badge-new">{e.topic}</span>
                          <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "4px" }}>
                            Region: {e.region}
                          </div>
                        </td>
                        <td style={{ padding: "12px", maxWidth: "300px" }}>
                          <div style={{ fontSize: "0.85rem", maxHeight: "80px", overflowY: "auto", whiteSpace: "pre-wrap" }}>
                            {e.message}
                          </div>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <select
                            value={e.status}
                            disabled={updatingId === e.id}
                            onChange={(eVal) => handleUpdateEnqStatus(e.id, eVal.target.value)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid var(--line)",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              background: e.status === "responded" ? "#d1fae5" : "#e0e7ff",
                            }}
                          >
                            <option value="new">New</option>
                            <option value="responded">Responded</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td style={{ padding: "12px", fontSize: "0.8rem", color: "var(--muted)" }}>
                          {new Date(e.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteEnquiry(e.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", fontSize: "0.85rem" }}
                            title="Delete inquiry"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

