"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "./Sprite";
import { SITE_CONFIG } from "@/lib/config";
import { BauhausThemeArt } from "./academy/AcademyAuthPanel";
import "@/styles/academy.css";

export function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    jobTitle: "",
    organisation: "",
    experience: "",
    tools: [] as string[],
    goals: "",
    source: "",
    privacyConsent: false,
    marketingConsent: false,
    hp: "", // Honeypot field for spam prevention
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    reference?: string;
    message?: string;
  } | null>(null);

  const clean = (val: string) => val.trim().replace(/\s+/g, " ");

  const validate = () => {
    const errs: Record<string, string> = {};

    const name = clean(formData.fullName);
    if (!name || name.length < 3 || name.length > 80 || !/\s/.test(name)) {
      errs.fullName = "Enter your first and last name, using letters only.";
    }

    const email = clean(formData.email);
    if (!email || !/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email)) {
      errs.email = "Enter a valid email address (e.g. name@example.com).";
    }

    const phone = clean(formData.phone);
    const digits = phone.replace(/\D/g, "");
    if (!phone || digits.length < 9 || digits.length > 15) {
      errs.phone = "Enter a valid phone number with 9 to 15 digits (e.g. +233 53 353 4687).";
    }

    const country = clean(formData.country);
    if (!country || country.length < 2) {
      errs.country = "Enter your country.";
    }

    const jobTitle = clean(formData.jobTitle);
    if (!jobTitle || jobTitle.length < 2 || jobTitle.length > 80) {
      errs.jobTitle = "Enter your job title (2 to 80 characters).";
    }

    if (!formData.experience) {
      errs.experience = "Select your experience level.";
    }

    if (formData.goals && formData.goals.length > 500) {
      errs.goals = "Keep this under 500 characters.";
    }

    if (!formData.privacyConsent) {
      errs.privacyConsent = "You need to agree before you can submit.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (formData.hp) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tools: formData.tools.join(", "),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit registration.");
      }

      setResult({
        success: true,
        reference: data.reference,
        message: "Registration received! Check your inbox for your confirmation email.",
      });
    } catch (err) {
      setResult({
        success: false,
        message: (err as Error).message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToolToggle = (tool: string) => {
    setFormData((prev) => {
      const exists = prev.tools.includes(tool);
      return {
        ...prev,
        tools: exists ? prev.tools.filter((t) => t !== tool) : [...prev.tools, tool],
      };
    });
  };

  if (result?.success) {
    return (
      <div className="acad-bauhaus-frame">
        <div className="acad-bauhaus-left" style={{ justifyContent: "center" }}>
          <div style={{ color: "var(--ok)", marginBottom: "14px" }}>
            <Icon id="i-check" className="ico" />
          </div>
          <div className="acad-bauhaus-welcome">Application Saved!</div>
          <h3 className="acad-bauhaus-title" style={{ marginBottom: "10px" }}>
            Registration Confirmed
          </h3>
          <p className="acad-bauhaus-copy">
            Thank you for registering for the <strong>{SITE_CONFIG.PROGRAMME.NAME}</strong>. A
            confirmation email has been sent to <strong>{formData.email}</strong>.
          </p>

          <div
            style={{
              background: "#f8fafc",
              border: "2px solid #121316",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#64748b",
                display: "block",
              }}
            >
              Your Application Reference
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "1.45rem",
                fontWeight: 800,
                color: "#121316",
                letterSpacing: "1px",
              }}
            >
              {result.reference}
            </span>
          </div>

          <button
            type="button"
            className="acad-bauhaus-btn-primary"
            onClick={() => {
              navigator.clipboard?.writeText(result.reference || "");
            }}
          >
            COPY REFERENCE NUMBER
          </button>

          <div className="acad-bauhaus-or">
            <span className="acad-bauhaus-or-line" />
            <span className="acad-bauhaus-or-text">OR</span>
            <span className="acad-bauhaus-or-line" />
          </div>

          <button
            type="button"
            className="acad-bauhaus-btn-secondary"
            onClick={() => {
              setResult(null);
              setFormData({
                fullName: "",
                email: "",
                phone: "",
                country: "",
                jobTitle: "",
                organisation: "",
                experience: "",
                tools: [],
                goals: "",
                source: "",
                privacyConsent: false,
                marketingConsent: false,
                hp: "",
              });
            }}
          >
            SUBMIT ANOTHER APPLICATION
          </button>
        </div>

        <BauhausThemeArt />
      </div>
    );
  }

  const toolOptions = ["Excel", "SQL", "Tableau", "Power BI", "Python", "R", "None yet"];

  return (
    <div className="acad-bauhaus-frame">
      <div className="acad-bauhaus-left">
        <div className="acad-bauhaus-globe" aria-hidden="true">
          <svg
            width="46"
            height="46"
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
        <h3 className="acad-bauhaus-title">
          Your Journey
          <br />
          Starts Here
        </h3>
        <p className="acad-bauhaus-copy">
          The application should take approximately 10 minutes to complete. You can complete your
          application now or return later to finish. Don&apos;t worry, we&apos;ll save your
          information so you can pick up where you left off.
        </p>

        {result && !result.success && (
          <div className="acad-bauhaus-error" role="alert">
            <strong>Registration failed:</strong> {result.message}
          </div>
        )}

        <form className="acad-bauhaus-form" onSubmit={handleSubmit} noValidate>
          <div style={{ display: "none" }} aria-hidden="true">
            <input
              type="text"
              name="website_url"
              tabIndex={-1}
              autoComplete="off"
              value={formData.hp}
              onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
            />
          </div>

          <div className="acad-bauhaus-grid-2">
            <div className="acad-bauhaus-field">
              <label htmlFor="reg-name">Full Name *</label>
              <div className="acad-bauhaus-input-wrap">
                <input
                  id="reg-name"
                  type="text"
                  required
                  style={{ paddingLeft: "12px" }}
                  placeholder="e.g. Akua Mensah"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              {errors.fullName && (
                <span style={{ fontSize: "0.75rem", color: "#b91c1c" }}>{errors.fullName}</span>
              )}
            </div>

            <div className="acad-bauhaus-field">
              <label htmlFor="reg-email">Email Address *</label>
              <div className="acad-bauhaus-input-wrap">
                <input
                  id="reg-email"
                  type="email"
                  required
                  style={{ paddingLeft: "12px" }}
                  placeholder="e.g. akua@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && (
                <span style={{ fontSize: "0.75rem", color: "#b91c1c" }}>{errors.email}</span>
              )}
            </div>
          </div>

          <div className="acad-bauhaus-grid-2">
            <div className="acad-bauhaus-field">
              <label htmlFor="reg-phone">Phone / WhatsApp *</label>
              <div className="acad-bauhaus-input-wrap">
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  style={{ paddingLeft: "12px" }}
                  placeholder="+1 (609) 304-7571"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              {errors.phone && (
                <span style={{ fontSize: "0.75rem", color: "#b91c1c" }}>{errors.phone}</span>
              )}
            </div>

            <div className="acad-bauhaus-field">
              <label htmlFor="reg-country">Country *</label>
              <div className="acad-bauhaus-input-wrap">
                <input
                  id="reg-country"
                  type="text"
                  required
                  style={{ paddingLeft: "12px" }}
                  placeholder="Ghana, USA, UK"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
              {errors.country && (
                <span style={{ fontSize: "0.75rem", color: "#b91c1c" }}>{errors.country}</span>
              )}
            </div>
          </div>

          <div className="acad-bauhaus-grid-2">
            <div className="acad-bauhaus-field">
              <label htmlFor="reg-job">Job Title / Occupation *</label>
              <div className="acad-bauhaus-input-wrap">
                <input
                  id="reg-job"
                  type="text"
                  required
                  style={{ paddingLeft: "12px" }}
                  placeholder="Analyst, Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>
              {errors.jobTitle && (
                <span style={{ fontSize: "0.75rem", color: "#b91c1c" }}>{errors.jobTitle}</span>
              )}
            </div>

            <div className="acad-bauhaus-field">
              <label htmlFor="reg-org">Organization (Optional)</label>
              <div className="acad-bauhaus-input-wrap">
                <input
                  id="reg-org"
                  type="text"
                  style={{ paddingLeft: "12px" }}
                  placeholder="Company or University"
                  value={formData.organisation}
                  onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="acad-bauhaus-field">
            <label htmlFor="reg-exp">Data Analysis Experience *</label>
            <select
              id="reg-exp"
              required
              className="acad-bauhaus-select"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            >
              <option value="">Select your experience level</option>
              <option value="Complete beginner">Complete beginner: no previous experience</option>
              <option value="Basic spreadsheet user">Basic: spreadsheets for simple tables</option>
              <option value="Intermediate">Intermediate: VLOOKUP, pivot tables</option>
              <option value="Advanced / transitioning">Advanced: transitioning to BI tools</option>
            </select>
            {errors.experience && (
              <span style={{ fontSize: "0.75rem", color: "#b91c1c" }}>{errors.experience}</span>
            )}
          </div>

          <div className="acad-bauhaus-field">
            <label>Prior Tools Used</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {toolOptions.map((tool) => {
                const active = formData.tools.includes(tool);
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => handleToolToggle(tool)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: active ? "1.5px solid var(--blue)" : "1.5px solid var(--line)",
                      background: active ? "var(--blue-soft)" : "var(--paper)",
                      color: active ? "var(--blue)" : "var(--ink)",
                    }}
                  >
                    {tool}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="acad-bauhaus-field">
            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer", textTransform: "none", fontWeight: 500 }}>
              <input
                type="checkbox"
                required
                checked={formData.privacyConsent}
                onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                style={{ marginTop: "3px" }}
              />
              <span style={{ fontSize: "0.8rem", color: "var(--ink)" }}>
                I agree to the{" "}
                <Link href="/privacy" target="_blank" style={{ color: "var(--blue)", fontWeight: 700 }}>
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" target="_blank" style={{ color: "var(--blue)", fontWeight: 700 }}>
                  Terms of Service
                </Link>
                . *
              </span>
            </label>
            {errors.privacyConsent && (
              <span style={{ fontSize: "0.75rem", color: "#b91c1c" }}>{errors.privacyConsent}</span>
            )}
          </div>

          <button
            type="submit"
            className="acad-bauhaus-btn-primary"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting && <span className="acad-btn-spinner" aria-hidden="true" />}
            <span>{isSubmitting ? "SUBMITTING APPLICATION..." : "START NOW!"}</span>
          </button>
        </form>

        <div className="acad-bauhaus-or">
          <span className="acad-bauhaus-or-line" />
          <span className="acad-bauhaus-or-text">OR</span>
          <span className="acad-bauhaus-or-line" />
        </div>

        <Link
          href="/academy/signin"
          className="acad-bauhaus-btn-secondary"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
        >
          CONTINUE YOUR APPLICATION
        </Link>
      </div>

      <BauhausThemeArt />
    </div>
  );
}
