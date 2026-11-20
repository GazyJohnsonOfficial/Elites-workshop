"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import {
  getClientDetectedRegion,
  mapCountryNameToCurrency,
} from "@/lib/geoCurrency";
import { SITE_CONFIG } from "@/lib/config";
import type { AcademySessionUser } from "./AcademySignInModal";

export interface AuthCourseOption {
  id: string;
  label: string;
}

const DEFAULT_INDIVIDUAL_COURSE_OPTIONS: AuthCourseOption[] = [
  { id: "course-data-bi", label: "Data Analysis & Business Intelligence Engineering (12 Weeks)" },
  { id: "course-it-foundations", label: "IT Support, Networking & Linux Fundamentals (8 Weeks)" },
  { id: "course-soc-analyst", label: "SOC Analyst, SIEM Monitoring & Incident Response (10 Weeks)" },
  { id: "course-ai-productivity", label: "Applied AI & Workflow Automation for Professionals (6 Weeks)" },
  { id: "course-sql-warehouse", label: "SQL Analytics Engineering & Cloud Data Warehousing (8 Weeks)" },
  { id: "course-cloud-devops", label: "Cloud & DevOps Engineering (12 Weeks)" },
  { id: "course-cybersecurity", label: "Cybersecurity & Compliance Operations (10 Weeks)" },
  { id: "course-python-etl", label: "Python Programming, ETL & Data Automation (8 Weeks)" },
  { id: "course-azure-aws-architect", label: "Multi-Cloud Solutions Architecture (AWS & Azure) (12 Weeks)" },
];

/**
 * Bauhaus Geometric Visual Showcase
 * Solid color blocks (--navy #0a1a40, --blue #2d4fd6, --gold #f5b82e)
 * with authentic circular portraits of Academy scholars.
 */
export function BauhausThemeArt() {
  return (
    <div className="acad-bauhaus-right" aria-hidden="true">
      <svg
        className="acad-bauhaus-svg"
        viewBox="0 0 580 620"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Base Canvas */}
        <rect x="0" y="0" width="580" height="620" fill="#eef3ff" />

        {/* Left Geometric Pillar */}
        <rect x="0" y="0" width="112" height="620" fill="#eef3ff" />
        <path d="M 0 0 H 112 V 132 C 112 164 80 186 42 186 H 0 Z" fill="#0f2557" />
        <circle cx="62" cy="88" r="16" fill="#f5b82e" />

        {/* Vertical Graphic Dots */}
        <circle cx="64" cy="242" r="9" fill="#0a1a40" />
        <circle cx="64" cy="286" r="9" fill="#0a1a40" />
        <circle cx="64" cy="330" r="9" fill="#0a1a40" />
        <circle cx="64" cy="374" r="9" fill="#0a1a40" />

        {/* Royal Blue Bottom Arch */}
        <path
          d="M 0 482 C 0 450 24 428 56 428 C 88 428 112 450 112 482 V 620 H 0 Z"
          fill="#2d4fd6"
        />

        {/* Center Navy Block with Gold S-Curve */}
        <rect x="112" y="0" width="224" height="410" fill="#0a1a40" />
        <path
          d="M 112 0 H 336 V 196 C 254 196 224 250 224 312 C 224 370 176 398 112 398 Z"
          fill="#f5b82e"
        />
        <circle cx="144" cy="48" r="14" fill="#0a1a40" />
        <circle cx="158" cy="218" r="17" fill="#0a1a40" />

        {/* Horizontal Stripes */}
        <rect x="112" y="410" width="224" height="210" fill="#ffffff" />
        <rect x="112" y="410" width="224" height="14" fill="#0a1a40" />
        <rect x="112" y="437" width="224" height="14" fill="#0a1a40" />
        <rect x="112" y="464" width="224" height="14" fill="#0a1a40" />
        <rect x="112" y="491" width="224" height="14" fill="#0a1a40" />
        <rect x="112" y="518" width="224" height="14" fill="#0a1a40" />
        <rect x="112" y="545" width="224" height="14" fill="#0a1a40" />
        <rect x="112" y="572" width="224" height="14" fill="#0a1a40" />
        <rect x="112" y="599" width="224" height="14" fill="#0a1a40" />

        {/* Right Vertical Pillar */}
        <rect x="336" y="0" width="128" height="620" fill="#0f2557" />
        <path
          d="M 336 0 H 464 V 524 C 464 578 416 620 354 620 H 336 Z"
          fill="#2d4fd6"
        />

        {/* Far-Right Column */}
        <rect x="464" y="0" width="116" height="620" fill="#e4ecff" />
        <circle cx="508" cy="68" r="17" fill="#0a1a40" />
        <circle cx="522" cy="142" r="30" fill="#f5b82e" />
        <path
          d="M 464 456 C 464 426 488 402 522 402 C 556 402 580 426 580 456 V 620 H 464 Z"
          fill="#2d4fd6"
        />
        <circle cx="514" cy="548" r="19" fill="#f5b82e" />
      </svg>

      {/* Top Circular Portrait */}
      <div className="acad-bauhaus-portrait-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/academy/portrait_sm.webp"
          alt="Academy engineering scholar"
          className="acad-scholar-img"
        />
      </div>

      {/* Large Circular Portrait */}
      <div className="acad-bauhaus-portrait-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/academy/portrait_lg.webp"
          alt="Academy cloud graduate"
          className="acad-scholar-img"
        />
      </div>
    </div>
  );
}

export function AcademyAuthPanel({
  defaultRole = "learner",
  initialAuthMode = "signin",
  defaultCourseId = "course-data-bi",
  courses,
  heading,
  subheading,
  variant = "page",
  onAuthenticated,
}: {
  defaultRole?: "learner" | "org_admin";
  initialAuthMode?: "signin" | "register" | "forgot" | "reset";
  defaultCourseId?: string;
  courses?: AuthCourseOption[];
  heading?: string;
  subheading?: string;
  variant?: "page" | "modal";
  onAuthenticated?: (user: AcademySessionUser) => void;
}) {
  const courseOptions =
    courses && courses.length > 0 ? courses : DEFAULT_INDIVIDUAL_COURSE_OPTIONS;
  const router = useRouter();
  const pathname = usePathname();
  const isCorporate = defaultRole === "org_admin";
  const [authMode, setAuthMode] = useState<"signin" | "register" | "forgot" | "reset">(initialAuthMode);
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  const hasEditedCountry = useRef(false);
  const [courseId, setCourseId] = useState(defaultCourseId);
  const [paymentPlan, setPaymentPlan] = useState<"installment_2" | "full">("installment_2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password Recovery States
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySent, setRecoverySent] = useState(false);

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
    if (!hasEditedCountry.current) {
      setCountry(getClientDetectedRegion().defaultCountry);
    }
    const syncCountry = () => {
      if (!hasEditedCountry.current) {
        setCountry(getClientDetectedRegion().defaultCountry);
      }
    };
    window.addEventListener("ets-region-currency-changed", syncCountry);
    return () => {
      window.removeEventListener("ets-region-currency-changed", syncCountry);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get("mode");
      const urlToken = params.get("token");
      const urlCourse = params.get("course");

      if (urlCourse && courseOptions.some((c) => c.id === urlCourse)) {
        setCourseId(urlCourse);
      }

      if (urlToken) {
        setResetToken(urlToken);
        setAuthMode("reset");
      } else if (urlMode === "forgot") {
        setAuthMode("forgot");
      } else if (urlMode === "reset") {
        setAuthMode("reset");
      }
    }
  }, [courseOptions]);

  const switchMode = (targetMode: "signin" | "register" | "forgot" | "reset") => {
    setError("");
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

    if (variant === "page") {
      if (pathname === "/academy/signin" && targetMode === "register") {
        router.push("/academy/register");
        return;
      }
      if (pathname === "/academy/register" && targetMode === "signin") {
        router.push("/academy/signin");
        return;
      }
      if (pathname === "/academy/corporate/signin" && targetMode === "register") {
        router.push("/academy/corporate/register");
        return;
      }
      if (pathname === "/academy/corporate/register" && targetMode === "signin") {
        router.push("/academy/corporate/signin");
        return;
      }
    }
    setAuthMode(targetMode);
  };

  const completeSignIn = (user: AcademySessionUser) => {
    window.dispatchEvent(new Event("ets-academy-session-changed"));
    if (onAuthenticated) {
      onAuthenticated(user);
      return;
    }
    if (user.role === "org_admin") {
      router.push("/academy/corporate");
    } else {
      router.push("/academy/learn");
    }
    router.refresh();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (authMode === "register") {
      if (!registerPassword || registerPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (registerPassword !== registerConfirmPassword) {
        setError("Passwords do not match. Please ensure both fields are identical.");
        return;
      }
    } else {
      if (!password) {
        setError("Please enter your password.");
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
          organizationName: isCorporate ? organizationName : undefined,
          email,
          password: authMode === "register" ? registerPassword : password,
          phone,
          country,
          currency: mapCountryNameToCurrency(country),
          role: defaultRole,
          courseId: authMode === "register" && !isCorporate ? courseId : undefined,
          paymentPlan: authMode === "register" && !isCorporate ? paymentPlan : undefined,
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
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please ensure both fields are identical.");
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
        throw new Error(data.error || "Unable to update password.");
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

  const displayTitle =
    authMode === "forgot"
      ? "Reset Password"
      : authMode === "reset"
        ? "Set New Password"
        : heading ||
        (isCorporate
          ? authMode === "register"
            ? "Corporate Account Setup"
            : "Corporate Sign In"
          : authMode === "register"
            ? "Create an Account"
            : "Individual Sign In");

  const displayDesc =
    authMode === "forgot"
      ? "Enter your registered email address to receive password reset instructions."
      : authMode === "reset"
        ? "Enter the security token sent to your email and set a new password."
        : subheading ||
        (isCorporate
          ? authMode === "register"
            ? "Create your organization administrator account to manage team training seats and quotes."
            : "Sign in with your corporate administrator credentials to manage seats and telemetry."
          : authMode === "register"
            ? "Apply for an upcoming cohort and set up your student workspace."
            : "Sign in with your registered email and password to access your modules.");

  const isModal = variant === "modal";

  return (
    <div className={`acad-bauhaus-frame ${isModal ? "acad-modal-frame" : ""}`}>
      {/* Form Column */}
      <div className="acad-bauhaus-left">
        {/* Top Brand & Nav Bar */}
        {!isModal && (
          <div className="acad-bauhaus-top-nav">
            <Link
              href={isCorporate ? "/academy/corporate" : "/academy"}
              className="acad-brand"
              style={{ textDecoration: "none" }}
            >
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

            <Link
              href={isCorporate ? "/academy/corporate" : "/academy"}
              className="acad-bauhaus-nav-link"
            >
              <ArrowLeft size={15} />
              <span>{isCorporate ? "Back to For Business" : "Back to Academy"}</span>
            </Link>
          </div>
        )}

        <div className="acad-bauhaus-left-inner">
          {/* Heading Block (No badges, no italic accents, no gradients) */}
          <div className="acad-auth-header">
            <h1 className="acad-auth-title">{displayTitle}</h1>
            <p className="acad-auth-desc">{displayDesc}</p>
          </div>

          {/* Clean Segmented Mode Switcher (Sign In vs Register only, rectangular, no pills) */}
          {(authMode === "signin" || authMode === "register") && (
            <div className="acad-auth-switcher" role="tablist" aria-label="Sign in or register">
              <button
                type="button"
                role="tab"
                aria-selected={authMode === "signin"}
                onClick={() => switchMode("signin")}
                className={`acad-auth-switch-tab ${authMode === "signin" ? "active" : ""}`}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authMode === "register"}
                onClick={() => switchMode("register")}
                className={`acad-auth-switch-tab ${authMode === "register" ? "active" : ""}`}
              >
                Register
              </button>
            </div>
          )}

          {error && (
            <div className="acad-bauhaus-error" role="alert">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait" initial={false}>
            {authMode === "forgot" ? (
              /* ============ 1. FORGOT PASSWORD VIEW ============ */
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="acad-bauhaus-recovery-view"
              >
                {recoverySent ? (
                  <div className="acad-bauhaus-recovery-box" role="status">
                    <div className="acad-bauhaus-recovery-head">
                      <CheckCircle2 size={20} />
                      <strong>Instructions Dispatched</strong>
                    </div>
                    <p>
                      If an account exists for <strong>{recoveryEmail}</strong>, instructions and a one-time token
                      have been sent to your inbox.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                      <button
                        type="button"
                        onClick={() => switchMode("reset")}
                        className="acad-bauhaus-btn-primary"
                      >
                        Enter Token &amp; Set New Password
                      </button>

                      <button
                        type="button"
                        onClick={() => switchMode("signin")}
                        className="acad-bauhaus-btn-secondary"
                      >
                        Return to Sign In
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRecoverySubmit} className="acad-bauhaus-form">
                    <div className="acad-bauhaus-field">
                      <label htmlFor="bh-recovery-email">Registered Email Address</label>
                      <div className="acad-bauhaus-input-wrap">
                        <Mail size={16} />
                        <input
                          id="bh-recovery-email"
                          type="email"
                          required
                          autoFocus
                          autoComplete="email"
                          placeholder="name@example.com"
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      aria-busy={loading}
                      className="acad-bauhaus-btn-primary"
                    >
                      {loading && <Loader2 size={16} className="acad-btn-spinner" aria-hidden="true" />}
                      <span>{loading ? "Sending..." : "Send Reset Link"}</span>
                    </button>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "6px" }}>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => switchMode("signin")}
                        className="acad-bauhaus-btn-secondary"
                      >
                        Back to Sign In
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => switchMode("reset")}
                        className="acad-bauhaus-btn-secondary"
                      >
                        Have a Token?
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            ) : authMode === "reset" ? (
              /* ============ 2. SET NEW PASSWORD VIEW ============ */
              <motion.div
                key="reset"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                className="acad-bauhaus-recovery-view"
              >
                {resetSuccess ? (
                  <div className="acad-bauhaus-recovery-box" role="status">
                    <div className="acad-bauhaus-recovery-head">
                      <CheckCircle2 size={20} />
                      <strong>Password Updated</strong>
                    </div>
                    <p>
                      Your new password has been saved. You can now sign in with your updated credentials.
                    </p>
                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="acad-bauhaus-btn-primary"
                    >
                      Sign In Now
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetSubmit} className="acad-bauhaus-form">
                    <div className="acad-bauhaus-field">
                      <label htmlFor="bh-reset-token">One-Time Recovery Token</label>
                      <div className="acad-bauhaus-input-wrap">
                        <KeyRound size={16} />
                        <input
                          id="bh-reset-token"
                          type="text"
                          required
                          placeholder="RESET-XXXXX"
                          value={resetToken}
                          onChange={(e) => setResetToken(e.target.value.toUpperCase())}
                          style={{ letterSpacing: "1px" }}
                        />
                      </div>
                    </div>

                    <div className="acad-bauhaus-field-grid">
                      <div className="acad-bauhaus-field">
                        <label htmlFor="bh-new-password">New Password</label>
                        <div className="acad-bauhaus-input-wrap">
                          <Lock size={15} />
                          <input
                            id="bh-new-password"
                            type={showNewPassword ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            placeholder="Min. 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="acad-bauhaus-toggle-pw"
                            title={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div className="acad-bauhaus-field">
                        <label htmlFor="bh-confirm-password">Confirm Password</label>
                        <div className="acad-bauhaus-input-wrap">
                          <Lock size={15} />
                          <input
                            id="bh-confirm-password"
                            type={showNewPassword ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            placeholder="Re-enter password"
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
                          className={`acad-bauhaus-pw-match ${newPassword === confirmPassword ? "ok" : "err"
                            }`}
                        >
                          {newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}
                        </span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      aria-busy={loading}
                      className="acad-bauhaus-btn-primary"
                    >
                      {loading && <Loader2 size={16} className="acad-btn-spinner" aria-hidden="true" />}
                      <span>{loading ? "Updating..." : "Save New Password"}</span>
                    </button>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "6px" }}>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => switchMode("forgot")}
                        className="acad-bauhaus-btn-secondary"
                      >
                        Request New Token
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => switchMode("signin")}
                        className="acad-bauhaus-btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            ) : authMode === "signin" ? (
              /* ============ 3. SIGN IN VIEW ============ */
              <motion.form
                key="signin"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                onSubmit={handleFormSubmit}
                className="acad-bauhaus-form"
              >
                <div className="acad-bauhaus-field">
                  <label htmlFor="bh-sign-email">Email Address</label>
                  <div className="acad-bauhaus-input-wrap">
                    <Mail size={16} />
                    <input
                      id="bh-sign-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="acad-bauhaus-field">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <label htmlFor="bh-sign-password" style={{ margin: 0 }}>Password</label>
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="acad-bauhaus-forgot-link"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="acad-bauhaus-input-wrap">
                    <Lock size={15} />
                    <input
                      id="bh-sign-password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="acad-bauhaus-toggle-pw"
                      title={showPassword ? "Hide password" : "Show password"}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="acad-bauhaus-btn-primary"
                  style={{ marginTop: "10px" }}
                >
                  {loading && <Loader2 size={16} className="acad-btn-spinner" aria-hidden="true" />}
                  <span>{loading ? "Signing In..." : "Sign In"}</span>
                </button>
              </motion.form>
            ) : (
              /* ============ 4. REGISTER VIEW ============ */
              <motion.form
                key="register"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
                onSubmit={handleFormSubmit}
                className="acad-bauhaus-form"
              >
                <div className="acad-bauhaus-field-grid">
                  <div className="acad-bauhaus-field">
                    <label htmlFor="bh-reg-name">Full Name</label>
                    <input
                      id="bh-reg-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Akua Mensah"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="acad-bauhaus-field">
                    <label htmlFor="bh-reg-email">Email Address</label>
                    <input
                      id="bh-reg-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="acad-bauhaus-field-grid">
                  <div className="acad-bauhaus-field">
                    <label htmlFor="bh-reg-password">Password</label>
                    <div className="acad-bauhaus-input-wrap">
                      <Lock size={15} />
                      <input
                        id="bh-reg-password"
                        type={showRegisterPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="Min. 6 characters"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="acad-bauhaus-toggle-pw"
                        title={showRegisterPassword ? "Hide password" : "Show password"}
                        aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                      >
                        {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="acad-bauhaus-field">
                    <label htmlFor="bh-reg-confirm-password">Confirm Password</label>
                    <div className="acad-bauhaus-input-wrap">
                      <Lock size={15} />
                      <input
                        id="bh-reg-confirm-password"
                        type={showRegisterConfirmPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="Re-enter password"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                        className="acad-bauhaus-toggle-pw"
                        title={showRegisterConfirmPassword ? "Hide password" : "Show password"}
                        aria-label={showRegisterConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showRegisterConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {registerConfirmPassword && (
                  <div className="acad-bauhaus-pw-hint" style={{ marginTop: "-4px" }}>
                    <span>Minimum 6 characters</span>
                    <span
                      className={`acad-bauhaus-pw-match ${registerPassword === registerConfirmPassword ? "ok" : "err"
                        }`}
                    >
                      {registerPassword === registerConfirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                )}

                <div className="acad-bauhaus-field-grid">
                  <div className="acad-bauhaus-field">
                    <label htmlFor="bh-reg-phone">Phone / WhatsApp</label>
                    <input
                      id="bh-reg-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+233 53 353 4687"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="acad-bauhaus-field">
                    <label htmlFor="bh-reg-country">Country</label>
                    <select
                      id="bh-reg-country"
                      value={country}
                      onChange={(e) => {
                        hasEditedCountry.current = true;
                        setCountry(e.target.value);
                      }}
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

                {isCorporate ? (
                  <div className="acad-bauhaus-field">
                    <label htmlFor="bh-reg-org">Organization / Company Name</label>
                    <input
                      id="bh-reg-org"
                      type="text"
                      required
                      autoComplete="organization"
                      placeholder="e.g. Acme Engineering Ltd"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="acad-bauhaus-field-grid">
                    <div className="acad-bauhaus-field">
                      <label htmlFor="bh-reg-course">Selected Cohort Track</label>
                      <select
                        id="bh-reg-course"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                      >
                        {courseOptions.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="acad-bauhaus-field">
                      <label htmlFor="bh-reg-plan">Tuition Plan</label>
                      <select
                        id="bh-reg-plan"
                        value={paymentPlan}
                        onChange={(e) =>
                          setPaymentPlan(e.target.value as "installment_2" | "full")
                        }
                      >
                        <option value="installment_2">2 Installments (50% Deposit)</option>
                        <option value="full">Full Tuition Settlement</option>
                      </select>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="acad-bauhaus-btn-primary"
                  style={{ marginTop: "10px" }}
                >
                  {loading && <Loader2 size={16} className="acad-btn-spinner" aria-hidden="true" />}
                  <span>
                    {loading
                      ? "Creating Account..."
                      : isCorporate
                        ? "Create Corporate Account"
                        : "Create Account & Apply"}
                  </span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {!isModal && (authMode === "signin" || authMode === "register") && (
            <div className="acad-auth-alt-link">
              <span>{isCorporate ? "Joining as a solo student?" : "Upskilling a company team?"}</span>
              <Link href={isCorporate ? "/academy/signin" : "/academy/corporate/signin"}>
                {isCorporate ? "Individual Sign In" : "Corporate Sign In"}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Bauhaus Geometric Artwork with Clean Circular Scholar Portraits */}
      {!isModal && <BauhausThemeArt />}
    </div>
  );
}
