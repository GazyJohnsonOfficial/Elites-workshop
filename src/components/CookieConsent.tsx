"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "./Sprite";

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    try {
      const consent = localStorage.getItem("ets_consent");
      if (!consent) {
        setIsOpen(true);
      } else {
        const parsed = JSON.parse(consent);
        setAnalytics(!!parsed.analytics);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }

    // Listen for custom trigger to open preferences
    const handleOpenModal = () => setShowPreferences(true);
    window.addEventListener("ets-open-cookie-settings", handleOpenModal);
    return () => window.removeEventListener("ets-open-cookie-settings", handleOpenModal);
  }, []);

  const saveConsent = (allowAnalytics: boolean) => {
    try {
      localStorage.setItem(
        "ets_consent",
        JSON.stringify({
          essential: true,
          analytics: allowAnalytics,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore
    }
    setAnalytics(allowAnalytics);
    setIsOpen(false);
    setShowPreferences(false);
  };

  return (
    <>
      {/* Banner */}
      {isOpen && !showPreferences && (
        <aside className="cookie-banner" role="region" aria-label="Cookie consent">
          <div className="container cookie-inner">
            <div className="cookie-text">
              <p>
                <strong>We respect your privacy.</strong> We use cookies to ensure the website
                functions properly and, with your consent, to understand how visitors interact
                with our site. Read our{" "}
                <Link href="/cookies" style={{ textDecoration: "underline" }}>
                  Cookie Policy
                </Link>{" "}
                to learn more.
              </p>
            </div>
            <div className="cookie-actions">
              <button
                type="button"
                className="btn btn-gold btn-sm"
                onClick={() => saveConsent(true)}
              >
                Accept all
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => saveConsent(false)}
              >
                Essential only
              </button>
              <button
                type="button"
                className="link-btn"
                onClick={() => setShowPreferences(true)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--blue)" }}
              >
                Customise
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="cookie-modal-backdrop" role="dialog" aria-modal="true" aria-label="Cookie settings">
          <div className="cookie-modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Cookie preferences</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowPreferences(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem" }}
              >
                <Icon id="i-x" />
              </button>
            </div>

            <p style={{ fontSize: "0.95rem", color: "var(--muted)", marginBottom: "20px" }}>
              Customise which cookies you allow us to set. Essential cookies are required for the
              site to work and cannot be switched off.
            </p>

            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "16px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>Essential cookies</strong>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                    Necessary for site security, navigation, and anti-spam verification.
                  </p>
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ok-text)" }}>Always active</span>
              </div>
            </div>

            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "16px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>Analytics cookies</strong>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                    Help us improve our website by collecting anonymous traffic and usage patterns.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  aria-label="Allow analytics cookies"
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowPreferences(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-gold btn-sm"
                onClick={() => saveConsent(analytics)}
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

