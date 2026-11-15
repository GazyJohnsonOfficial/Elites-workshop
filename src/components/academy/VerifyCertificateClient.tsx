"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, CheckCircle2, Printer, Search, XCircle } from "lucide-react";
import type { Certificate } from "@/lib/academyStore";

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
                placeholder="Enter Credential Code (e.g. ETS-CERT-9482AX)"
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

            <div style={{ marginTop: "12px", fontSize: "0.84rem", color: "var(--muted)", display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <span>Sample active credentials:</span>
              <button
                type="button"
                onClick={() => {
                  setCode("ETS-CERT-9482AX");
                  handleLookup("ETS-CERT-9482AX");
                }}
                style={{ background: "none", border: 0, padding: 0, color: "var(--blue)", cursor: "pointer", fontFamily: "var(--font-mono)", fontWeight: 700 }}
              >
                ETS-CERT-9482AX
              </button>
              <button
                type="button"
                onClick={() => {
                  setCode("ETS-CERT-7120MK");
                  handleLookup("ETS-CERT-7120MK");
                }}
                style={{ background: "none", border: 0, padding: 0, color: "var(--blue)", cursor: "pointer", fontFamily: "var(--font-mono)", fontWeight: 700 }}
              >
                ETS-CERT-7120MK
              </button>
            </div>
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
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-outline btn-sm acad-no-print"
                >
                  <Printer size={15} />
                  <span>Print Credential</span>
                </button>
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
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
