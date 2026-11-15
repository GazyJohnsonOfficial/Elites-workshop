"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import { BauhausThemeArt } from "@/components/academy/AcademyAuthPanel";

export function AdminLoginClient({ allowPreview }: { allowPreview: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewEnter = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/academy/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoRole: "staff_admin" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to open preview admin session.");
      window.dispatchEvent(new Event("ets-academy-session-changed"));
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main" className="acad-auth-section">
      <motion.div
        className="acad-bauhaus-frame"
        style={{ minHeight: "100vh" }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Left Column: Full-Page Bauhaus Staff Login Form */}
        <div className="acad-bauhaus-left">
          <div className="acad-bauhaus-left-inner">
            <div>
              <div className="acad-bauhaus-top-nav">
                <Link href="/" className="acad-brand" style={{ textDecoration: "none" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt={SITE_CONFIG.COMPANY}
                    width={32}
                    height={32}
                    referrerPolicy="no-referrer"
                    className="acad-brand-logo"
                  />
                  <span className="acad-brand-text" style={{ fontSize: "0.92rem" }}>
                    {SITE_CONFIG.COMPANY} · <span>Staff Governance</span>
                  </span>
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <Link
                    href="/"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "var(--muted)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    <ArrowLeft size={13} />
                    <span>Website</span>
                  </Link>
                  <Link
                    href="/academy/signin"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "var(--blue)",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    <span>Student Sign In</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              <div className="acad-bauhaus-globe" aria-hidden="true">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="24" cy="24" r="20" stroke="#2d4fd6" strokeWidth="2.4" />
                  <ellipse cx="24" cy="24" rx="10" ry="20" stroke="#2d4fd6" strokeWidth="2" />
                  <path d="M5 18H43" stroke="#2d4fd6" strokeWidth="2" />
                  <path d="M5 30H43" stroke="#2d4fd6" strokeWidth="2" />
                  <path d="M24 4V44" stroke="#f5b82e" strokeWidth="2.2" />
                </svg>
              </div>

              <div className="acad-bauhaus-welcome">Welcome!</div>
              <h1 className="acad-bauhaus-title">
                Staff Operations
                <br />
                Starts Here
              </h1>

              <p className="acad-bauhaus-copy">
                Authorized console for {SITE_CONFIG.COMPANY} directors and operations leads overseeing
                cohort enrollments, multi-currency tuition settlements, and enterprise quotes.
              </p>

              {error && (
                <div className="acad-bauhaus-error" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="acad-bauhaus-form">
                <div className="acad-bauhaus-field">
                  <label htmlFor="admin-email">Authorized Staff Email</label>
                  <div className="acad-bauhaus-input-wrap">
                    <Mail size={15} />
                    <input
                      id="admin-email"
                      type="email"
                      required
                      autoFocus
                      placeholder="admin@elitestechsolutions.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="acad-bauhaus-field">
                  <label htmlFor="admin-password">Staff Passphrase</label>
                  <div className="acad-bauhaus-input-wrap">
                    <KeyRound size={15} />
                    <input
                      id="admin-password"
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="acad-bauhaus-btn-primary"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading && <span className="acad-btn-spinner" aria-hidden="true" />}
                  <span>{loading ? "AUTHENTICATING..." : "START NOW!"}</span>
                </button>
              </form>

              {allowPreview && (
                <>
                  <div className="acad-bauhaus-or">
                    <span className="acad-bauhaus-or-line" />
                    <span className="acad-bauhaus-or-text">OR</span>
                    <span className="acad-bauhaus-or-line" />
                  </div>

                  <button
                    type="button"
                    onClick={handlePreviewEnter}
                    disabled={loading}
                    className="acad-bauhaus-btn-secondary"
                  >
                    ENTER AS ACADEMY DIRECTOR (PREVIEW)
                  </button>
                </>
              )}
            </div>

            <div className="acad-bauhaus-demo-bar">
              <span className="acad-bauhaus-demo-title">
                <Lock size={12} style={{ display: "inline", marginRight: "5px" }} />
                Zero-Trust Governance · Medford NJ · Rugby UK · Takoradi GH
              </span>
              <div className="acad-bauhaus-demo-chips">
                <Link
                  href="/academy/signin"
                  className="acad-bauhaus-chip"
                  style={{ textDecoration: "none" }}
                >
                  <ShieldCheck size={13} />
                  <span>Switch to Learner / Corporate Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bauhaus Geometric Artwork & Circular Portraits in Page Theme */}
        <BauhausThemeArt />
      </motion.div>
    </main>
  );
}
