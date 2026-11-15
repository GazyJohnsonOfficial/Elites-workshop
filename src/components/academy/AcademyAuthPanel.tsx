"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import type { AcademySessionUser } from "./AcademySignInModal";

const COURSE_OPTIONS = [
  { id: "course-data-bi", label: "Data Analysis & BI Engineering (12 Weeks)" },
  { id: "course-cloud-devops", label: "Cloud & DevOps Automation (12 Weeks)" },
  { id: "course-cyber-secops", label: "Cybersecurity & Compliance Operations (10 Weeks)" },
  { id: "course-python-etl", label: "Python & Pipeline Automation (8 Weeks)" },
];

/**
 * Full-Bleed Bauhaus Geometric Artwork & Circular Student Portraits
 * Fills 100% of the right viewport column edge-to-edge (x=0..500, y=0..620)
 * using the Elites Tech Solutions page theme (--navy-deep #0a1a40, --blue #2d4fd6, --gold #f5b82e).
 */
export function BauhausThemeArt() {
  return (
    <div className="acad-bauhaus-right" aria-hidden="true">
      <svg
        className="acad-bauhaus-svg"
        viewBox="0 0 500 620"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Full-Canvas Edge-to-Edge Base */}
        <rect x="0" y="0" width="500" height="620" fill="#eef3ff" />

        {/* Band 1 (x=0..96): Left Geometric Strip — Zero Empty White Margin */}
        <rect x="0" y="0" width="96" height="620" fill="#eef3ff" />
        <path d="M 0 0 H 96 V 136 C 96 168 68 192 34 192 H 0 Z" fill="#0f2557" />
        <circle cx="48" cy="92" r="18" fill="#f5b82e" />

        {/* 4 Vertical Navy Dots */}
        <circle cx="48" cy="252" r="9.5" fill="#0a1a40" />
        <circle cx="48" cy="298" r="9.5" fill="#0a1a40" />
        <circle cx="48" cy="344" r="9.5" fill="#0a1a40" />
        <circle cx="48" cy="390" r="9.5" fill="#0a1a40" />

        {/* Band 1 Bottom: Royal Blue Rounded-Top Arch */}
        <path
          d="M 0 486 C 0 454 22 432 48 432 C 74 432 96 454 96 486 V 620 H 0 Z"
          fill="#2d4fd6"
        />

        {/* Band 2 (x=96..292): Deep Navy Base + Gold S-Curve Block */}
        <rect x="96" y="0" width="196" height="412" fill="#0a1a40" />
        <path
          d="M 96 0 H 292 V 198 C 220 198 194 250 194 316 C 194 374 154 402 96 402 Z"
          fill="#f5b82e"
        />

        {/* Two Deep Navy Circles inside Gold Block */}
        <circle cx="128" cy="44" r="15" fill="#0a1a40" />
        <circle cx="142" cy="190" r="20" fill="#0a1a40" />

        {/* Band 2 Bottom (y=412..620): Horizontal Navy & White Stripes */}
        <rect x="96" y="412" width="196" height="208" fill="#ffffff" />
        <rect x="96" y="412" width="196" height="15" fill="#0a1a40" />
        <rect x="96" y="440" width="196" height="15" fill="#0a1a40" />
        <rect x="96" y="468" width="196" height="15" fill="#0a1a40" />
        <rect x="96" y="496" width="196" height="15" fill="#0a1a40" />
        <rect x="96" y="524" width="196" height="15" fill="#0a1a40" />
        <rect x="96" y="552" width="196" height="15" fill="#0a1a40" />
        <rect x="96" y="580" width="196" height="15" fill="#0a1a40" />
        <rect x="96" y="606" width="196" height="14" fill="#0a1a40" />

        {/* Band 3 (x=292..404): Royal Blue Vertical Column + Deep Navy Lower Block */}
        <rect x="292" y="0" width="112" height="620" fill="#0f2557" />
        <path
          d="M 292 0 H 404 V 525 C 404 578 364 620 308 620 H 292 Z"
          fill="#2d4fd6"
        />

        {/* Band 4 (x=404..500): Far-Right Geometric Strip Flush to Right Edge */}
        <rect x="404" y="0" width="96" height="620" fill="#e4ecff" />
        <circle cx="446" cy="52" r="20" fill="#0a1a40" />
        <circle cx="464" cy="128" r="34" fill="#f5b82e" />

        {/* Band 4 Bottom-Right: Royal Blue Rounded-Top Pillar Flush to Right Edge */}
        <path
          d="M 404 452 C 404 422 426 398 452 398 C 478 398 500 422 500 452 V 620 H 404 Z"
          fill="#2d4fd6"
        />
        <circle cx="452" cy="556" r="22" fill="#f5b82e" />
      </svg>

      {/* Top Small Circular Portrait */}
      <div className="acad-bauhaus-portrait-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/aistudio/original-a08e19b7d3de655050076a2e7b8651f7_e59ab2bc.webp"
          alt=""
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Main Large Circular Portrait */}
      <div className="acad-bauhaus-portrait-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/aistudio/original-a08e19b7d3de655050076a2e7b8651f7_e59ab2bc.webp"
          alt=""
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}

export function AcademyAuthPanel({
  defaultRole = "learner",
  initialAuthMode = "signin",
  defaultCourseId = "course-data-bi",
  heading,
  subheading,
  onAuthenticated,
}: {
  defaultRole?: "learner" | "org_admin";
  initialAuthMode?: "signin" | "register" | "forgot" | "reset";
  defaultCourseId?: string;
  heading?: string;
  subheading?: string;
  onAuthenticated?: (user: AcademySessionUser) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authMode, setAuthMode] = useState<"signin" | "register" | "forgot" | "reset">(initialAuthMode);
  const [role, setRole] = useState<"learner" | "org_admin">(defaultRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Ghana");
  const [courseId, setCourseId] = useState(defaultCourseId);
  const [paymentPlan, setPaymentPlan] = useState<"installment_2" | "full">("installment_2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [socialNotice, setSocialNotice] = useState("");

  // Password Recovery States
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [copiedToken, setCopiedToken] = useState(false);

  // Set New Password (Reset) States
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    setAuthMode(initialAuthMode);
  }, [initialAuthMode]);

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  // Read URL query parameters on mount (e.g. ?mode=forgot or ?token=RESET-XXXX&mode=reset)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get("mode");
      const urlToken = params.get("token");

      if (urlToken) {
        setResetToken(urlToken);
        setAuthMode("reset");
      } else if (urlMode === "forgot") {
        setAuthMode("forgot");
      } else if (urlMode === "reset") {
        setAuthMode("reset");
      }
    }
  }, []);

  const switchMode = (targetMode: "signin" | "register" | "forgot" | "reset") => {
    setError("");
    setSocialNotice("");
    setRecoverySent(false);
    setResetSuccess(false);

    if (targetMode === "forgot") {
      setRecoveryEmail(email || recoveryEmail);
      setAuthMode("forgot");
      return;
    }

    if (targetMode === "reset") {
      setAuthMode("reset");
      return;
    }

    if (pathname === "/academy/signin" && targetMode === "register") {
      router.push("/academy/register");
      return;
    }
    if (pathname === "/academy/register" && targetMode === "signin") {
      router.push("/academy/signin");
      return;
    }
    if (pathname === "/signin" && targetMode === "register") {
      router.push("/register");
      return;
    }
    if (pathname === "/register" && targetMode === "signin") {
      router.push("/signin");
      return;
    }
    setAuthMode(targetMode);
  };

  const completeSignIn = (user: AcademySessionUser) => {
    window.dispatchEvent(new Event("ets-academy-session-changed"));
    if (onAuthenticated) {
      onAuthenticated(user);
      return;
    }
    if (user.role === "staff_admin") {
      router.push("/admin");
    } else if (user.role === "org_admin") {
      router.push("/academy/corporate");
    } else {
      router.push("/academy/learn");
    }
    router.refresh();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSocialNotice("");

    if (authMode === "register") {
      if (!registerPassword || registerPassword.length < 6) {
        setError("Please choose a passphrase of at least 6 characters.");
        return;
      }
      if (registerPassword !== registerConfirmPassword) {
        setError("Passphrases do not match. Please ensure both fields are identical.");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/academy/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authMode: authMode === "register" ? "register" : "signin",
          fullName,
          email,
          password: authMode === "register" ? registerPassword : password,
          phone,
          country,
          role,
          courseId: authMode === "register" ? courseId : undefined,
          paymentPlan: authMode === "register" ? paymentPlan : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to complete request.");
      }
      completeSignIn(data.user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleaned = recoveryEmail.trim().toLowerCase();
    if (!cleaned || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      setError("Please enter a valid registered email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/academy/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleaned }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to send password recovery instructions.");
      }

      setGeneratedToken(data.token || "");
      setResetToken(data.token || "");
      setRecoverySent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resetToken.trim()) {
      setError("Please enter your one-time recovery token.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("New passphrase must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passphrases do not match. Please ensure both fields are identical.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/academy/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetToken.trim(),
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to update passphrase.");
      }

      setResetSuccess(true);
      if (data.user?.email) {
        setEmail(data.user.email);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyTokenToClipboard = (tokenText: string) => {
    if (!tokenText) return;
    navigator.clipboard?.writeText(tokenText);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleSocialClick = (provider: "Google" | "Apple") => {
    setError("");
    setSocialNotice(
      `${provider} Single Sign-On UI is ready and will be connected to your identity provider soon. Please sign in or register using your email below.`
    );
  };

  const displayTitle =
    authMode === "forgot"
      ? "Password Recovery"
      : authMode === "reset"
      ? "Set New Passphrase"
      : heading || "Your Journey Starts Here";

  const displayDesc =
    authMode === "forgot"
      ? "Enter the email address associated with your learner workspace or corporate portal. We will dispatch verified password recovery instructions to your inbox."
      : authMode === "reset"
      ? "Enter your one-time security recovery token and set a fresh, secure passphrase for your Academy workspace account."
      : subheading ||
        (authMode === "register"
          ? "The application should take approximately 2 minutes to complete. You can complete your registration now or return later to finish. Don't worry, we'll save your information so you can pick up where you left off."
          : "Sign in with your enrolled email address to resume your learning modules, capstone labs, or corporate seat portal. Don't worry, we save your progress automatically so you can pick up where you left off.");

  return (
    <motion.div
      className="acad-bauhaus-frame"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Left Interactive Sign In / Register / Forgot Password / Reset Password Column */}
      <div className="acad-bauhaus-left">
        <div className="acad-bauhaus-left-inner">
          <div>
            {/* Brand-Themed Wireframe Globe Icon (--blue & --gold) */}
            <div className="acad-bauhaus-globe" aria-hidden="true">
              <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="#2d4fd6" strokeWidth="2.2" />
                <ellipse cx="24" cy="24" rx="10" ry="20" stroke="#2d4fd6" strokeWidth="1.9" />
                <line x1="24" y1="4" x2="24" y2="44" stroke="#f5b82e" strokeWidth="2" />
                <line x1="4" y1="24" x2="44" y2="24" stroke="#2d4fd6" strokeWidth="1.9" />
                <path d="M7 15C13 18 35 18 41 15" stroke="#2d4fd6" strokeWidth="1.8" />
                <path d="M7 33C13 30 35 30 41 33" stroke="#2d4fd6" strokeWidth="1.8" />
              </svg>
            </div>

            <div className="acad-bauhaus-welcome">
              {authMode === "forgot" || authMode === "reset" ? "Account Recovery" : "Welcome!"}
            </div>

            <h1 className="acad-bauhaus-title">{displayTitle}</h1>

            <p className="acad-bauhaus-desc">{displayDesc}</p>

            {authMode === "forgot" ? (
              /* ============ 1. FORGOT PASSWORD / REQUEST RECOVERY FORM VIEW ============ */
              <div className="acad-bauhaus-recovery-view">
                {error && (
                  <div className="acad-bauhaus-error" role="alert">
                    {error}
                  </div>
                )}

                {recoverySent ? (
                  <div className="acad-bauhaus-recovery-box" role="status">
                    <div className="acad-bauhaus-recovery-head">
                      <CheckCircle2 size={22} />
                      <strong>Recovery Instructions Dispatched</strong>
                    </div>
                    <p>
                      We have generated your secure recovery link and dispatched password reset instructions to{" "}
                      <strong>{recoveryEmail}</strong>.
                    </p>

                    {generatedToken && (
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", marginBottom: "4px" }}>
                          ONE-TIME SECURITY TOKEN:
                        </div>
                        <div className="acad-bauhaus-token-chip">
                          <span className="acad-bauhaus-token-code">{generatedToken}</span>
                          <button
                            type="button"
                            onClick={() => copyTokenToClipboard(generatedToken)}
                            className="acad-bauhaus-token-copy"
                            title="Copy recovery token"
                          >
                            {copiedToken ? (
                              <>
                                <Check size={13} />
                                <span>COPIED!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>COPY</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <ol className="acad-bauhaus-recovery-steps">
                      <li>Check your inbox for the email from <strong>Elites Tech Academy Security</strong>.</li>
                      <li>Use the security token above or click the direct button below to set a new passphrase.</li>
                      <li>Token remains valid for 60 minutes across any browser session.</li>
                    </ol>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "18px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setResetToken(generatedToken);
                          switchMode("reset");
                        }}
                        className="acad-bauhaus-btn-primary"
                      >
                        <span>SET NEW PASSPHRASE NOW &rarr;</span>
                      </button>

                      <div className="acad-bauhaus-or" style={{ margin: "2px 0" }}>
                        <span className="acad-bauhaus-or-line" />
                        <span className="acad-bauhaus-or-text">OR</span>
                        <span className="acad-bauhaus-or-line" />
                      </div>

                      <button
                        type="button"
                        onClick={() => switchMode("signin")}
                        className="acad-bauhaus-btn-secondary"
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      >
                        <ArrowLeft size={14} />
                        <span>RETURN TO SIGN IN</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRecoverySubmit} className="acad-bauhaus-form">
                    <div className="acad-bauhaus-field">
                      <label htmlFor="bh-recovery-email">Registered Email Address *</label>
                      <div className="acad-bauhaus-input-wrap">
                        <Mail size={16} />
                        <input
                          id="bh-recovery-email"
                          type="email"
                          required
                          autoFocus
                          placeholder="akua.mensah@meridianfin.com"
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="acad-bauhaus-recovery-hint">
                      <KeyRound size={16} />
                      <span>
                        Enter your enrolled learner email or corporate sponsor address to receive an instant verification link and passphrase reset instructions.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      aria-busy={loading}
                      className="acad-bauhaus-btn-primary"
                    >
                      {loading && <Loader2 size={18} className="acad-btn-spinner" aria-hidden="true" />}
                      <span>
                        {loading ? "DISPATCHING INSTRUCTIONS..." : "SEND RECOVERY INSTRUCTIONS!"}
                      </span>
                    </button>

                    <div className="acad-bauhaus-or">
                      <span className="acad-bauhaus-or-line" />
                      <span className="acad-bauhaus-or-text">OR</span>
                      <span className="acad-bauhaus-or-line" />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => switchMode("signin")}
                        className="acad-bauhaus-btn-secondary"
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      >
                        <ArrowLeft size={14} />
                        <span>BACK TO SIGN IN</span>
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => switchMode("reset")}
                        className="acad-bauhaus-btn-secondary"
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      >
                        <KeyRound size={14} />
                        <span>HAVE A TOKEN?</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : authMode === "reset" ? (
              /* ============ 2. SET NEW PASSPHRASE (RESET TOKEN) FORM VIEW ============ */
              <div className="acad-bauhaus-recovery-view">
                {error && (
                  <div className="acad-bauhaus-error" role="alert">
                    {error}
                  </div>
                )}

                {resetSuccess ? (
                  <div className="acad-bauhaus-recovery-box" role="status">
                    <div className="acad-bauhaus-recovery-head">
                      <CheckCircle2 size={22} />
                      <strong>Passphrase Successfully Updated!</strong>
                    </div>
                    <p>
                      Your new secure passphrase has been applied to your workspace account. You can now sign in immediately with your updated credentials.
                    </p>
                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="acad-bauhaus-btn-primary"
                    >
                      <span>SIGN IN TO WORKSPACE NOW &rarr;</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetSubmit} className="acad-bauhaus-form">
                    <div className="acad-bauhaus-field">
                      <label htmlFor="bh-reset-token">One-Time Recovery Token *</label>
                      <div className="acad-bauhaus-input-wrap">
                        <KeyRound size={16} />
                        <input
                          id="bh-reset-token"
                          type="text"
                          required
                          placeholder="e.g. RESET-9B2F4K7A"
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value.toUpperCase())}
                          style={{ fontFamily: "var(--font-mono)", letterSpacing: "1px" }}
                        />
                      </div>
                    </div>

                    <div className="acad-bauhaus-field-grid">
                      <div className="acad-bauhaus-field">
                        <label htmlFor="bh-new-password">New Passphrase *</label>
                        <div className="acad-bauhaus-input-wrap">
                          <Lock size={15} />
                          <input
                            id="bh-new-password"
                            type={showNewPassword ? "text" : "password"}
                            required
                            placeholder="At least 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="acad-bauhaus-toggle-pw"
                            title={showNewPassword ? "Hide passphrase" : "Show passphrase"}
                          >
                            {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div className="acad-bauhaus-field">
                        <label htmlFor="bh-confirm-password">Confirm Passphrase *</label>
                        <div className="acad-bauhaus-input-wrap">
                          <Lock size={15} />
                          <input
                            id="bh-confirm-password"
                            type={showNewPassword ? "text" : "password"}
                            required
                            placeholder="Re-enter passphrase"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {confirmPassword && (
                      <div className="acad-bauhaus-pw-hint">
                        <span>Minimum 6 characters</span>
                        <span
                          className={`acad-bauhaus-pw-match ${
                            newPassword === confirmPassword ? "ok" : "err"
                          }`}
                        >
                          {newPassword === confirmPassword ? "✓ Passphrases match" : "✕ Passphrases do not match"}
                        </span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      aria-busy={loading}
                      className="acad-bauhaus-btn-primary"
                    >
                      {loading && <Loader2 size={18} className="acad-btn-spinner" aria-hidden="true" />}
                      <span>
                        {loading ? "UPDATING PASSPHRASE..." : "CONFIRM & UPDATE PASSPHRASE!"}
                      </span>
                    </button>

                    <div className="acad-bauhaus-or">
                      <span className="acad-bauhaus-or-line" />
                      <span className="acad-bauhaus-or-text">OR</span>
                      <span className="acad-bauhaus-or-line" />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => switchMode("forgot")}
                        className="acad-bauhaus-btn-secondary"
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      >
                        <ArrowLeft size={14} />
                        <span>REQUEST NEW TOKEN</span>
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => switchMode("signin")}
                        className="acad-bauhaus-btn-secondary"
                      >
                        <span>CANCEL &amp; SIGN IN</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* ============ 3. STANDARD SIGN IN & REGISTER VIEW ============ */
              <>
                {/* Mode & Account Type Switcher */}
                <div className="acad-bauhaus-switch-row">
                  <div className="acad-bauhaus-tabs" role="tablist" aria-label="Authentication mode">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authMode === "register"}
                      onClick={() => switchMode("register")}
                      className={`acad-bauhaus-tab ${authMode === "register" ? "active" : ""}`}
                    >
                      Register / New Application
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authMode === "signin"}
                      onClick={() => switchMode("signin")}
                      className={`acad-bauhaus-tab ${authMode === "signin" ? "active" : ""}`}
                    >
                      Sign In / Continue
                    </button>
                  </div>

                  <div className="acad-bauhaus-role-pills" role="group" aria-label="Account role">
                    <button
                      type="button"
                      onClick={() => setRole("learner")}
                      className={`acad-bauhaus-role-btn ${role === "learner" ? "active" : ""}`}
                    >
                      <GraduationCap size={14} />
                      <span>Learner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("org_admin")}
                      className={`acad-bauhaus-role-btn ${role === "org_admin" ? "active" : ""}`}
                    >
                      <Building2 size={14} />
                      <span>Corporate</span>
                    </button>
                  </div>
                </div>

                {/* Social Login Buttons (Google & Apple — UI Ready) */}
                <div className="acad-bauhaus-social-grid">
                  <button
                    type="button"
                    onClick={() => handleSocialClick("Google")}
                    className="acad-bauhaus-social-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 21.4 7.4 24 12 24z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialClick("Apple")}
                    className="acad-bauhaus-social-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    <span>Continue with Apple</span>
                  </button>
                </div>

                {socialNotice && (
                  <div className="acad-bauhaus-social-notice" role="status">
                    {socialNotice}
                  </div>
                )}

                <div className="acad-bauhaus-or" style={{ margin: "12px 0" }}>
                  <span className="acad-bauhaus-or-line" />
                  <span className="acad-bauhaus-or-text">OR CONTINUE WITH EMAIL</span>
                  <span className="acad-bauhaus-or-line" />
                </div>

                {error && (
                  <div className="acad-bauhaus-error" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="acad-bauhaus-form">
                  {authMode === "register" ? (
                    <>
                      <div className="acad-bauhaus-field-grid">
                        <div className="acad-bauhaus-field">
                          <label htmlFor="bh-reg-name">
                            {role === "org_admin" ? "Sponsor Full Name *" : "Full Name *"}
                          </label>
                          <input
                            id="bh-reg-name"
                            type="text"
                            required
                            placeholder={role === "org_admin" ? "David Osei-Bonsu" : "Akua Mensah"}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                        <div className="acad-bauhaus-field">
                          <label htmlFor="bh-reg-email">
                            {role === "org_admin" ? "Work Email *" : "Email Address *"}
                          </label>
                          <input
                            id="bh-reg-email"
                            type="email"
                            required
                            placeholder={
                              role === "org_admin"
                                ? "learning@meridianfin.com"
                                : "akua.mensah@meridianfin.com"
                            }
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="acad-bauhaus-field-grid">
                        <div className="acad-bauhaus-field">
                          <label htmlFor="bh-reg-password">Create Passphrase *</label>
                          <div className="acad-bauhaus-input-wrap">
                            <Lock size={15} />
                            <input
                              id="bh-reg-password"
                              type={showRegisterPassword ? "text" : "password"}
                              required
                              placeholder="At least 6 characters"
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                              className="acad-bauhaus-toggle-pw"
                              title={showRegisterPassword ? "Hide passphrase" : "Show passphrase"}
                              aria-label={showRegisterPassword ? "Hide passphrase" : "Show passphrase"}
                            >
                              {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="acad-bauhaus-field">
                          <label htmlFor="bh-reg-confirm-password">Confirm Passphrase *</label>
                          <div className="acad-bauhaus-input-wrap">
                            <Lock size={15} />
                            <input
                              id="bh-reg-confirm-password"
                              type={showRegisterConfirmPassword ? "text" : "password"}
                              required
                              placeholder="Re-enter passphrase"
                              value={registerConfirmPassword}
                              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                              className="acad-bauhaus-toggle-pw"
                              title={showRegisterConfirmPassword ? "Hide passphrase" : "Show passphrase"}
                              aria-label={showRegisterConfirmPassword ? "Hide passphrase" : "Show passphrase"}
                            >
                              {showRegisterConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {registerConfirmPassword && (
                        <div className="acad-bauhaus-pw-hint" style={{ marginTop: "-2px", marginBottom: "4px" }}>
                          <span>Minimum 6 characters</span>
                          <span
                            className={`acad-bauhaus-pw-match ${
                              registerPassword === registerConfirmPassword ? "ok" : "err"
                            }`}
                          >
                            {registerPassword === registerConfirmPassword
                              ? "✓ Passphrases match"
                              : "✕ Passphrases do not match"}
                          </span>
                        </div>
                      )}

                      <div className="acad-bauhaus-field-grid">
                        <div className="acad-bauhaus-field">
                          <label htmlFor="bh-reg-phone">Phone / WhatsApp *</label>
                          <input
                            id="bh-reg-phone"
                            type="tel"
                            required
                            placeholder="+233 53 353 4687"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        <div className="acad-bauhaus-field">
                          <label htmlFor="bh-reg-country">Country *</label>
                          <select
                            id="bh-reg-country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          >
                            <option value="Ghana">Ghana</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Canada">Canada</option>
                            <option value="Germany">Germany</option>
                          </select>
                        </div>
                      </div>

                      <div className="acad-bauhaus-field-grid">
                        <div className="acad-bauhaus-field">
                          <label htmlFor="bh-reg-course">Select Cohort Track</label>
                          <select
                            id="bh-reg-course"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                          >
                            {COURSE_OPTIONS.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="acad-bauhaus-field">
                          <label htmlFor="bh-reg-plan">Tuition Schedule</label>
                          <select
                            id="bh-reg-plan"
                            value={paymentPlan}
                            onChange={(e) =>
                              setPaymentPlan(e.target.value as "installment_2" | "full")
                            }
                          >
                            <option value="installment_2">2 Monthly Installments (50% Deposit)</option>
                            <option value="full">Full Tuition Settlement</option>
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="acad-bauhaus-field-grid">
                        <div className="acad-bauhaus-field">
                          <label htmlFor="bh-sign-email">
                            {role === "org_admin" ? "Corporate Work Email *" : "Registered Email Address *"}
                          </label>
                          <input
                            id="bh-sign-email"
                            type="email"
                            required
                            placeholder={
                              role === "org_admin"
                                ? "learning@meridianfin.com"
                                : "akua.mensah@meridianfin.com"
                            }
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="acad-bauhaus-field">
                          <label htmlFor="bh-sign-password">Passphrase / Access Key</label>
                          <div className="acad-bauhaus-input-wrap">
                            <Lock size={15} />
                            <input
                              id="bh-sign-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="acad-bauhaus-toggle-pw"
                              title={showPassword ? "Hide passphrase" : "Show passphrase"}
                              aria-label={showPassword ? "Hide passphrase" : "Show passphrase"}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="acad-bauhaus-forgot-row">
                        <button
                          type="button"
                          onClick={() => switchMode("forgot")}
                          className="acad-bauhaus-forgot-link"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </>
                  )}

                  {/* Primary Button ("START NOW!" / "SIGN IN") with Animated Loading Spinner */}
                  <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    className="acad-bauhaus-btn-primary"
                  >
                    {loading && <Loader2 size={18} className="acad-btn-spinner" aria-hidden="true" />}
                    <span>
                      {loading
                        ? authMode === "register"
                          ? "REGISTERING APPLICATION..."
                          : "SIGNING IN TO WORKSPACE..."
                        : authMode === "register"
                        ? "START NOW!"
                        : "SIGN IN TO WORKSPACE!"}
                    </span>
                  </button>

                  {/* OR Divider */}
                  <div className="acad-bauhaus-or">
                    <span className="acad-bauhaus-or-line" />
                    <span className="acad-bauhaus-or-text">OR</span>
                    <span className="acad-bauhaus-or-line" />
                  </div>

                  {/* Outlined Secondary Button ("CONTINUE YOUR APPLICATION") */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => switchMode(authMode === "register" ? "signin" : "register")}
                    className="acad-bauhaus-btn-secondary"
                  >
                    <span>
                      {authMode === "register"
                        ? "CONTINUE YOUR APPLICATION"
                        : "START NEW APPLICATION"}
                    </span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Bauhaus Geometric Collage & Portraits in Page Theme */}
      <BauhausThemeArt />
    </motion.div>
  );
}
