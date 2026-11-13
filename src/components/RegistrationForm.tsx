"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "./Sprite";
import { SITE_CONFIG } from "@/lib/config";

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

    // Honeypot check
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
      <div className="card reg-success" style={{ textAlign: "center", padding: "40px 24px" }}>
        <div style={{ color: "var(--ok)", marginBottom: "16px" }}>
          <Icon id="i-check" className="ico" />
        </div>
        <h3 style={{ fontSize: "1.75rem", color: "var(--navy)", marginBottom: "8px" }}>
          Registration received
        </h3>
        <p style={{ color: "var(--muted)", maxWidth: "500px", margin: "0 auto 20px" }}>
          Thank you for registering for the <strong>{SITE_CONFIG.PROGRAMME.NAME}</strong>. A
          confirmation email has been sent to <strong>{formData.email}</strong>.
        </p>

        <div
          style={{
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: "12px",
            padding: "20px",
            maxWidth: "380px",
            margin: "0 auto 24px",
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "var(--muted)", display: "block" }}>
            Your Reference Number
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--navy)",
              letterSpacing: "1px",
            }}
          >
            {result.reference}
          </span>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "6px", margin: 0 }}>
            Quote this reference in any communication with our admissions team.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              navigator.clipboard?.writeText(result.reference || "");
              alert("Reference number copied to clipboard!");
            }}
          >
            Copy reference
          </button>
          <button
            type="button"
            className="btn btn-gold btn-sm"
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
            Submit another registration
          </button>
        </div>
      </div>
    );
  }

  const toolOptions = ["Excel", "SQL", "Tableau", "Power BI", "Python", "R", "None yet"];

  return (
    <form className="card reg-form" onSubmit={handleSubmit} noValidate>
      {result && !result.success && (
        <div className="alert-error" role="alert">
          <strong>Registration failed:</strong> {result.message}
        </div>
      )}

      {/* Honeypot field for bot suppression */}
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

      <div className="form-grid">
        {/* Full Name */}
        <div className={`field ${errors.fullName ? "invalid" : ""}`}>
          <label htmlFor="reg-name">
            Full name <span className="req">*</span>
          </label>
          <input
            id="reg-name"
            type="text"
            required
            placeholder="e.g. Akua Mensah"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        {/* Email */}
        <div className={`field ${errors.email ? "invalid" : ""}`}>
          <label htmlFor="reg-email">
            Email address <span className="req">*</span>
          </label>
          <input
            id="reg-email"
            type="email"
            required
            placeholder="e.g. akua@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className={`field ${errors.phone ? "invalid" : ""}`}>
          <label htmlFor="reg-phone">
            Phone / WhatsApp <span className="req">*</span>
          </label>
          <input
            id="reg-phone"
            type="tel"
            required
            placeholder="e.g. +1 (609) 304-7571"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        {/* Country */}
        <div className={`field ${errors.country ? "invalid" : ""}`}>
          <label htmlFor="reg-country">
            Country of residence <span className="req">*</span>
          </label>
          <input
            id="reg-country"
            type="text"
            required
            placeholder="e.g. Ghana, United States, UK"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            aria-invalid={!!errors.country}
          />
          {errors.country && <span className="error">{errors.country}</span>}
        </div>

        {/* Job Title */}
        <div className={`field ${errors.jobTitle ? "invalid" : ""}`}>
          <label htmlFor="reg-job">
            Job title / occupation <span className="req">*</span>
          </label>
          <input
            id="reg-job"
            type="text"
            required
            placeholder="e.g. Marketing Specialist, Accountant"
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            aria-invalid={!!errors.jobTitle}
          />
          {errors.jobTitle && <span className="error">{errors.jobTitle}</span>}
        </div>

        {/* Organization */}
        <div className="field">
          <label htmlFor="reg-org">Organization / Company (optional)</label>
          <input
            id="reg-org"
            type="text"
            placeholder="Where you work or study"
            value={formData.organisation}
            onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
          />
        </div>

        {/* Experience level */}
        <div className={`field full ${errors.experience ? "invalid" : ""}`}>
          <label htmlFor="reg-exp">
            Data analysis experience <span className="req">*</span>
          </label>
          <select
            id="reg-exp"
            required
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            aria-invalid={!!errors.experience}
          >
            <option value="">Select your experience level</option>
            <option value="Complete beginner">Complete beginner: no previous experience</option>
            <option value="Basic spreadsheet user">Basic: I use spreadsheets for simple tables</option>
            <option value="Intermediate">Intermediate: comfortable with VLOOKUP, pivot tables</option>
            <option value="Advanced / transitioning">Advanced: transitioning to modern BI tools</option>
          </select>
          {errors.experience && <span className="error">{errors.experience}</span>}
        </div>

        {/* Tools used */}
        <div className="field full">
          <label>Tools you have used before (select all that apply):</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "6px" }}>
            {toolOptions.map((tool) => (
              <label
                key={tool}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: formData.tools.includes(tool) ? "var(--blue-soft)" : "var(--paper)",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  border: "1px solid var(--line)",
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.tools.includes(tool)}
                  onChange={() => handleToolToggle(tool)}
                  style={{ cursor: "pointer" }}
                />
                {tool}
              </label>
            ))}
          </div>
        </div>

        {/* Learning Goals */}
        <div className="field full">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label htmlFor="reg-goals">What are your main goals for this program?</label>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              {formData.goals.length}/500
            </span>
          </div>
          <textarea
            id="reg-goals"
            rows={3}
            maxLength={500}
            placeholder="e.g. Gain confidence presenting data to management, automate reports..."
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
          />
        </div>

        {/* Source */}
        <div className="field full">
          <label htmlFor="reg-source">How did you hear about us? (optional)</label>
          <select
            id="reg-source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          >
            <option value="">Select an option</option>
            <option value="Colleague / Friend recommendation">Colleague / Friend</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="WhatsApp group or message">WhatsApp</option>
            <option value="Google search">Google Search</option>
            <option value="Company training program">Employer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Consents */}
        <div className="field full" style={{ marginTop: "10px" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              required
              checked={formData.privacyConsent}
              onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
              style={{ marginTop: "4px" }}
            />
            <span style={{ fontSize: "0.9rem", color: "var(--ink)" }}>
              I agree to the{" "}
              <Link href="/privacy" target="_blank" style={{ color: "var(--blue)", textDecoration: "underline" }}>
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" target="_blank" style={{ color: "var(--blue)", textDecoration: "underline" }}>
                Terms of Service
              </Link>
              . <span className="req">*</span>
            </span>
          </label>
          {errors.privacyConsent && <span className="error">{errors.privacyConsent}</span>}

          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={formData.marketingConsent}
              onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
              style={{ marginTop: "4px" }}
            />
            <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
              Keep me informed about future cohorts, masterclasses, and alumni resources. (Optional)
            </span>
          </label>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <button
          type="submit"
          className="btn btn-gold btn-lg"
          disabled={isSubmitting}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {isSubmitting ? (
            <>
              <span className="spinner" />
              Submitting registration...
            </>
          ) : (
            "Complete registration"
          )}
        </button>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--muted)",
            textAlign: "center",
            marginTop: "12px",
            marginBottom: 0,
          }}
        >
          No payment is taken on this site. Our team will contact you directly to confirm onboarding.
        </p>
      </div>
    </form>
  );
}

