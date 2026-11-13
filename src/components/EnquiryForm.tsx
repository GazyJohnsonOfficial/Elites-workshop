"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "./Sprite";
import { SITE_CONFIG } from "@/lib/config";

const SERVICE_OPTIONS = [
  "IT Consulting and Strategy",
  "Data and Analytics",
  "Cybersecurity and Protection",
  "Cloud and Infrastructure",
  "IT Staffing and Talent",
  "Corporate / Team Training",
  "Data Analysis Program",
  "General Consultation",
] as const;

function normalizeDefaultService(raw?: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const exact = SERVICE_OPTIONS.find(
    (opt) => opt.toLowerCase() === trimmed.toLowerCase()
  );
  if (exact) return exact;

  const lower = trimmed.toLowerCase();
  if (lower.includes("staff") || lower.includes("pod") || lower.includes("augment") || lower.includes("talent")) {
    return "IT Staffing and Talent";
  }
  if (lower.includes("security") || lower.includes("iam") || lower.includes("compliance") || lower.includes("hipaa") || lower.includes("soc")) {
    return "Cybersecurity and Protection";
  }
  if (lower.includes("cohort") || lower.includes("academy") || lower.includes("programme") || lower.includes("program")) {
    return "Data Analysis Program";
  }
  if (lower.includes("training") || lower.includes("workshop") || lower.includes("corporate") || lower.includes("enablement")) {
    return "Corporate / Team Training";
  }
  if (lower.includes("data") || lower.includes("analytics") || lower.includes("bi")) {
    return "Data and Analytics";
  }
  if (lower.includes("devops") || lower.includes("finops") || lower.includes("strategy") || lower.includes("consulting") || lower.includes("optimization")) {
    return "IT Consulting and Strategy";
  }
  if (lower.includes("cloud") || lower.includes("migration") || lower.includes("infrastructure") || lower.includes("sre") || lower.includes("hybrid") || lower.includes("native")) {
    return "Cloud and Infrastructure";
  }
  return "General Consultation";
}

export function EnquiryForm({ defaultService }: { defaultService?: string }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organisation: "",
    region: "",
    topic: normalizeDefaultService(defaultService),
    message: "",
    privacyConsent: false,
    hp: "",
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

    if (formData.phone) {
      const digits = formData.phone.replace(/\D/g, "");
      if (digits.length < 9 || digits.length > 15) {
        errs.phone = "Enter a valid phone number with 9 to 15 digits, or leave it blank.";
      }
    }

    if (!formData.region) {
      errs.region = "Select your region.";
    }

    if (!formData.topic) {
      errs.topic = "Select a service or topic.";
    }

    const msg = formData.message.trim();
    if (!msg || msg.length < 15 || msg.length > 1500) {
      errs.message = "Write a message of 15 to 1,500 characters.";
    }

    if (!formData.privacyConsent) {
      errs.privacyConsent = "You need to agree before you can send your inquiry.";
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
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setResult({
        success: true,
        reference: data.reference,
        message: "Inquiry received! Our team will reply by email with sensible next steps.",
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

  if (result?.success) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>
        <div style={{ color: "var(--ok)", marginBottom: "16px" }}>
          <Icon id="i-check" />
        </div>
        <h3 style={{ fontSize: "1.75rem", color: "var(--navy)", marginBottom: "8px" }}>
          Inquiry sent
        </h3>
        <p style={{ color: "var(--muted)", maxWidth: "500px", margin: "0 auto 20px" }}>
          Thank you for getting in touch. A member of our team will review your inquiry and reply to{" "}
          <strong>{formData.email}</strong>.
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
            Inquiry Reference
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
        </div>

        <button
          type="button"
          className="btn btn-gold btn-sm"
          onClick={() => {
            setResult(null);
            setFormData({
              fullName: "",
              email: "",
              phone: "",
              organisation: "",
              region: "",
              topic: "",
              message: "",
              privacyConsent: false,
              hp: "",
            });
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="card" id="enquiry" onSubmit={handleSubmit} noValidate>
      {result && !result.success && (
        <div className="alert-error" role="alert">
          {result.message}
        </div>
      )}

      {/* Honeypot field */}
      <div style={{ display: "none" }} aria-hidden="true">
        <input
          type="text"
          name="user_web_site"
          tabIndex={-1}
          autoComplete="off"
          value={formData.hp}
          onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
        />
      </div>

      <div className="form-grid">
        <div className={`field ${errors.fullName ? "invalid" : ""}`}>
          <label htmlFor="enq-name">
            Full name <span className="req">*</span>
          </label>
          <input
            id="enq-name"
            type="text"
            required
            placeholder="First and last name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        <div className={`field ${errors.email ? "invalid" : ""}`}>
          <label htmlFor="enq-email">
            Work or personal email <span className="req">*</span>
          </label>
          <input
            id="enq-email"
            type="email"
            required
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className={`field ${errors.phone ? "invalid" : ""}`}>
          <label htmlFor="enq-phone">Phone number (optional)</label>
          <input
            id="enq-phone"
            type="tel"
            placeholder="e.g. +1 (609) 304-7571"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="field">
          <label htmlFor="enq-org">Organization (optional)</label>
          <input
            id="enq-org"
            type="text"
            placeholder="Company, school or department"
            value={formData.organisation}
            onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
          />
        </div>

        <div className={`field ${errors.region ? "invalid" : ""}`}>
          <label htmlFor="enq-region">
            Your location / region <span className="req">*</span>
          </label>
          <select
            id="enq-region"
            required
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            aria-invalid={!!errors.region}
          >
            <option value="">Select region</option>
            <option value="United States">United States</option>
            <option value="Ghana">Ghana</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Other / International">Other / International</option>
          </select>
          {errors.region && <span className="error">{errors.region}</span>}
        </div>

        <div className={`field ${errors.topic ? "invalid" : ""}`}>
          <label htmlFor="enq-topic">
            Service or area of interest <span className="req">*</span>
          </label>
          <select
            id="enq-topic"
            required
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            aria-invalid={!!errors.topic}
          >
            <option value="">Select a service</option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.topic && <span className="error">{errors.topic}</span>}
        </div>

        <div className={`field full ${errors.message ? "invalid" : ""}`}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label htmlFor="enq-msg">
              How can we help? <span className="req">*</span>
            </label>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              {formData.message.length}/1500
            </span>
          </div>
          <textarea
            id="enq-msg"
            rows={5}
            required
            maxLength={1500}
            placeholder="Tell us what your organization is looking to achieve, current challenges, or questions..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            aria-invalid={!!errors.message}
          />
          {errors.message && <span className="error">{errors.message}</span>}
        </div>

        <div className="field full">
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
              </Link>
              . We only use your contact details to reply to your inquiry. <span className="req">*</span>
            </span>
          </label>
          {errors.privacyConsent && <span className="error">{errors.privacyConsent}</span>}
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
              Sending inquiry...
            </>
          ) : (
            "Send inquiry"
          )}
        </button>
      </div>
    </form>
  );
}

