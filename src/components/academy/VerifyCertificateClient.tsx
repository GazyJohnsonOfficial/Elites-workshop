"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, Check, CheckCircle2, Copy, ExternalLink, Printer, Search, XCircle } from "lucide-react";
import type { Certificate } from "@/lib/academyStore";
import { buildLinkedInCertificationUrl } from "@/lib/credentialUtils";

export function VerifyCertificateClient({
  initialCode,
  initialCertificate,
  initialSearched,
}: {
  initialCode: string;
  initialCertificate: Certificate | null;
  initialSearched: boolean;
}) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [cert, setCert] = useState<Certificate | null>(initialCertificate);
  const [searched, setSearched] = useState(initialSearched);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        // Fallback if clipboard API restricted
      }
    }
  };

  const handleLookup = async (targetCode: string) => {
    const clean = targetCode.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/academy/verify?code=${encodeURIComponent(clean)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setCert(data.certificate || null);
      } else {
        setCert(null);
      }
      setSearched(true);
      router.replace(`/academy/verify/${encodeURIComponent(clean)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main">
      <section className="acad-page-hero">
        <div className="container">
          <div className="acad-crumbs">
            <Link href="/academy">Academy Catalog</Link>
            <span>/</span>
            <span>Credential Registry</span>
          </div>
          <h1>Verify Graduate Certificate</h1>
          <p className="lead">
            Confirm the authenticity of any Elites Tech Academy completion credential using its unique certificate code.
          </p>
        </div>
      </section>

      <section className="acad-section">
        <div className="container">
          <div className="acad-card acad-no-print" style={{ maxWidth: "780px", margin: "0 auto 28px" }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLookup(code);
              }}
              style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
            >
              <input
                type="text"
                className="acad-input acad-mono"
                placeholder="Enter Credential Code (e.g. ETS-CERT-XXXXXX)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ flex: 1, minWidth: "240px", textTransform: "uppercase" }}
                aria-label="Certificate code"
              />
              <button type="submit" className="btn btn-navy" disabled={loading}>
                <Search size={16} />
                <span>{loading ? "Verifying..." : "Verify Credential"}</span>
              </button>
            </form>
          </div>

          {searched && !cert && (
            <div className="acad-card acad-gate-card" style={{ maxWidth: "780px" }}>
              <XCircle size={32} color="var(--danger)" style={{ marginBottom: "10px" }} />
              <h2 style={{ color: "var(--navy)", marginBottom: "6px" }}>Credential Not Found</h2>
              <p style={{ color: "var(--muted)", margin: 0 }}>
                No issued Academy certificate matched <span className="acad-mono">{code.toUpperCase()}</span>. Check the code printed on the graduate&apos;s transcript.
              </p>
            </div>
          )}

          {cert && (
            <article className="acad-cert-sheet">
              <div className="acad-cert-header">
                <div className="acad-status-ok" style={{ fontSize: "0.95rem" }}>
                  <CheckCircle2 size={20} />
                  <span>Verified Official Credential</span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }} className="acad-no-print">
                  <a
                    href={buildLinkedInCertificationUrl(cert)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold btn-sm"
                    title="Add verified certification directly to your LinkedIn profile"
                  >
                    <ExternalLink size={15} />
                    <span>Add to LinkedIn</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="btn btn-outline btn-sm"
                    title="Copy verification link to share"
                  >
                    {copied ? <Check size={15} color="var(--ok)" /> : <Copy size={15} />}
                    <span>{copied ? "Link Copied!" : "Share Link"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-navy btn-sm"
                  >
                    <Printer size={15} />
                    <span>Print Credential</span>
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                <Award size={36} color="var(--gold-dark)" />
                <div>
                  <div className="acad-overview-label" style={{ color: "var(--blue)", marginBottom: "2px" }}>
                    Elites Tech Solutions LLC · Technical Academy
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                    Certificate of Engineering Completion
                  </div>
                </div>
              </div>

              <h2 className="acad-cert-recipient">
                {cert.learnerName}
              </h2>
              <p style={{ color: "var(--muted)", marginBottom: "20px", maxWidth: "60ch" }}>
                has successfully completed all module laboratories and capstone defense requirements for:
              </p>

              <div className="acad-cert-program">
                <div style={{ fontSize: "1.22rem", fontWeight: 800, color: "var(--navy)" }}>
                  {cert.courseTitle}
                </div>
                <div style={{ fontSize: "0.88rem", color: "var(--muted)", marginTop: "4px" }}>
                  Track: {cert.category} · {cert.durationWeeks} Weeks Guided Practicum
                </div>
              </div>

              <div className="acad-cert-meta-grid">
                <div>
                  <div className="acad-overview-label">Credential ID</div>
                  <strong className="acad-mono" style={{ color: "var(--navy)" }}>{cert.code}</strong>
                </div>
                <div>
                  <div className="acad-overview-label">Issue Date</div>
                  <strong className="acad-mono" style={{ color: "var(--navy)" }}>
                    {new Date(cert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </strong>
                </div>
                <div>
                  <div className="acad-overview-label">Issuing Authority</div>
                  <strong style={{ color: "var(--navy)" }}>{cert.instructorName}</strong>
                </div>
              </div>

              <div
                className="acad-no-print"
                style={{
                  marginTop: "18px",
                  paddingTop: "14px",
                  borderTop: "1px dashed #d5e0f4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                  fontSize: "0.8rem",
                  color: "var(--muted)",
                }}
              >
                <span>Open Badges v2 verifiable assertion available for ATS &amp; HR systems:</span>
                <a
                  href={`/api/academy/badges/${encodeURIComponent(cert.code)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="acad-mono"
                  style={{ color: "var(--blue)", fontWeight: 700, textDecoration: "none" }}
                >
                  /api/academy/badges/{cert.code} ↗
                </a>
              </div>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
