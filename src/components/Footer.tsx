"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "./Sprite";
import { SITE_CONFIG } from "@/lib/config";

export function Footer({ onOpenCookies }: { onOpenCookies?: () => void }) {
  const [year, setYear] = useState(2026);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleOpenCookies = () => {
    if (onOpenCookies) {
      onOpenCookies();
    } else {
      window.dispatchEvent(new Event("ets-open-cookie-settings"));
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hp) return;
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmed || !emailRegex.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid business email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, hp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Unable to subscribe. Please try again.");
      } else {
        setStatus("success");
        setMessage(data.message || "Thank you! You are now subscribed.");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <footer className="site-footer" id="footer">
      <div className="rf-container">
        {/* ============ 1. TOP CTA & NEWSLETTER BRIEFING ============ */}
        <div className="rf-top-banner">
          <div className="rf-cta-copy">
            <span className="rf-cta-kicker">Start an Engagement</span>
            <h2 className="rf-cta-title">Ready to Architect, Migrate, or Modernize?</h2>
            <p className="rf-cta-desc">
              Engage our senior engineering squads for cloud migrations, cybersecurity governance, custom data pipelines, or technical workforce enablement across the United States, the United Kingdom, and Ghana.
            </p>
            <div className="rf-cta-actions">
              <Link href="/contact#enquiry" className="rf-cta-btn-primary">
                Request Technical Consultation <Icon id="i-arrow-right" />
              </Link>
              <Link href="/services" className="rf-cta-link-secondary">
                View Practice Areas
              </Link>
            </div>
          </div>

          <div className="rf-newsletter-wrapper">
            <div className="rf-newsletter-header">
              <h3 className="rf-newsletter-title">Newsletter</h3>
              <p className="rf-newsletter-subtitle">
                Curated quarterly insights on cloud architecture, security baselines, and technical workforce enablement.
              </p>
            </div>

            {status === "success" ? (
              <div className="rf-newsletter-success-state">
                <div className="rf-newsletter-success-left">
                  <span className="rf-newsletter-check"><Icon id="i-check" /></span>
                  <span className="rf-newsletter-success-text" title={message}>
                    {message}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setMessage("");
                  }}
                  className="rf-newsletter-btn rf-newsletter-btn-done"
                >
                  Add another
                </button>
              </div>
            ) : (
              <form
                className={`rf-newsletter-form ${status === "error" ? "has-error" : ""}`}
                onSubmit={handleSubscribe}
                noValidate
              >
                <input
                  type="text"
                  name="company_website"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                    opacity: 0,
                  }}
                />
                <label htmlFor="rf-newsletter-email" className="sr-only">
                  Work email address
                </label>
                <input
                  id="rf-newsletter-email"
                  type="email"
                  className="rf-newsletter-input"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") {
                      setStatus("idle");
                      setMessage("");
                    }
                  }}
                  disabled={status === "loading"}
                  required
                  autoComplete="email"
                  spellCheck={false}
                  aria-label="Work email address"
                />
                <button
                  type="submit"
                  className="rf-newsletter-btn"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="rf-newsletter-error-msg" role="alert">
                <span>⚠</span> {message}
              </p>
            )}
          </div>
        </div>

        {/* ============ 2. MIDDLE 4-COLUMN GRID ============ */}
        <div className="rf-grid">
          {/* Column 1: Brand Profile & Trust Anchor */}
          <div className="rf-col rf-col-brand">
            <Link href="/" className="rf-brand-head" aria-label={`${SITE_CONFIG.COMPANY} Home`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt={SITE_CONFIG.COMPANY}
                className="rf-brand-logo"
                width={54}
                height={54}
              />
              <span className="rf-brand-text">
                Elites Tech Solutions <span className="rf-brand-tag">LLC</span>
              </span>
            </Link>
            <p className="rf-brand-desc">
              Senior-led cloud consultancy, cybersecurity governance, automated DevOps pipelines, and practical technical workforce enablement for organizations across three continents.
            </p>

            <div className="rf-brand-trust">
              <span className="rf-trust-item">
                <Icon id="i-shield" /> Open IaC &amp; 100% Client IP
              </span>
              <span className="rf-trust-item">
                <Icon id="i-lock" /> Zero Vendor Lock-In
              </span>
            </div>

            <div className="rf-socials" aria-label="Social and Direct Channels">
              <a
                href={`https://wa.me/${SITE_CONFIG.CONTACT.WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rf-social-btn"
                aria-label="Direct WhatsApp Operations"
                title="WhatsApp Operations"
              >
                <Icon id="i-whatsapp" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rf-social-btn"
                aria-label="LinkedIn Company Page"
                title="LinkedIn"
              >
                <Icon id="i-linkedin" />
              </a>
              <a
                href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`}
                className="rf-social-btn"
                aria-label="Email Our Engineering Team"
                title="Email Engineering"
              >
                <Icon id="i-mail" />
              </a>
              <a
                href={`tel:${SITE_CONFIG.CONTACT.PHONE_E164}`}
                className="rf-social-btn"
                aria-label="Call Direct Line"
                title="Call Us"
              >
                <Icon id="i-phone" />
              </a>
            </div>
          </div>

          {/* Column 2: Engineering Practices */}
          <div className="rf-col">
            <h3>Engineering Practices</h3>
            <ul className="rf-nav-list">
              <li>
                <Link href="/services#cloud-strategy">Cloud Strategy &amp; Architecture</Link>
              </li>
              <li>
                <Link href="/services#migration">Zero-Downtime Cloud Migration</Link>
              </li>
              <li>
                <Link href="/services#security">Cybersecurity &amp; Compliance</Link>
              </li>
              <li>
                <Link href="/services#devops">DevOps &amp; Infrastructure as Code</Link>
              </li>
              <li>
                <Link href="/services#staffing">Engineering Staffing &amp; Pods</Link>
              </li>
              <li>
                <Link href="/services#support">24/7 Managed Operations &amp; SRE</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academy & Enablement */}
          <div className="rf-col">
            <h3>Academy &amp; Enablement</h3>
            <ul className="rf-nav-list">
              <li>
                <Link href="/data-analysis">Data Analysis Cohort</Link>
              </li>
              <li>
                <Link href="/training">Corporate Team Workshops</Link>
              </li>
              <li>
                <Link href="/data-analysis#curriculum">Curriculum &amp; Capstone Labs</Link>
              </li>
              <li>
                <Link href="/tuition">Tuition, Currencies &amp; Fees</Link>
              </li>
              <li>
                <Link href="/tuition#schedule">Cohort Dates &amp; Schedules</Link>
              </li>
              <li>
                <Link href="/data-analysis#register">Cohort Registration</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Access & Operating Hubs */}
          <div className="rf-col rf-col-contact">
            <h3>Direct Access</h3>
            <ul className="rf-contact-list">
              <li>
                <a
                  href={`tel:${SITE_CONFIG.CONTACT.PHONE_E164}`}
                  className="rf-contact-phone"
                  aria-label="Call Elites Tech Solutions US Headquarters"
                >
                  <Icon id="i-phone" />
                  <span>{SITE_CONFIG.CONTACT.PHONE_DISPLAY}</span>
                </a>
                <span className="rf-contact-subtext">US Headquarters (NJ)</span>
              </li>

              <li>
                <a
                  href={`tel:${SITE_CONFIG.REGIONS.gh.PHONE_E164}`}
                  className="rf-contact-phone"
                  aria-label="Call Elites Tech Solutions Ghana Office"
                >
                  <Icon id="i-phone" />
                  <span>{SITE_CONFIG.REGIONS.gh.PHONE_DISPLAY}</span>
                </a>
                <span className="rf-contact-subtext">Ghana Office (Takoradi)</span>
              </li>

              <li className="rf-contact-item">
                <Icon id="i-mail" />
                <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`}>
                  {SITE_CONFIG.CONTACT.EMAIL}
                </a>
              </li>

              <li className="rf-contact-item">
                <Icon id="i-whatsapp" />
                <a
                  href={`https://wa.me/${SITE_CONFIG.CONTACT.WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Direct WhatsApp Desk
                </a>
              </li>

              <li className="rf-contact-hubs-container">
                <div className="rf-hubs-header">
                  <Icon id="i-pin" />
                  <span>Operating Regional Hubs:</span>
                </div>
                <div className="rf-hubs-tags">
                  <span className="rf-hub-tag">Medford, NJ (USA)</span>
                  <span className="rf-hub-tag">Rugby (UK)</span>
                  <span className="rf-hub-tag">Takoradi (Ghana)</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ============ 3. BOTTOM BAR (LEGAL & STATUS) ============ */}
        <div className="rf-bottom">
          <div className="rf-bottom-left">
            <p className="rf-copy">
              &copy; {year} {SITE_CONFIG.COMPANY}. All rights reserved.
            </p>
            <span className="rf-bottom-note">
              Architectures engineered around enterprise security and compliance baselines.
            </span>
          </div>

          <div className="rf-legal-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Policy</Link>
            <a
              href="#cookies"
              onClick={(e) => {
                e.preventDefault();
                handleOpenCookies();
              }}
              className="rf-cookie-link"
              role="button"
            >
              Cookie settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
