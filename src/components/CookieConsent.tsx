"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "./Sprite";

const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [savedTimestamp, setSavedTimestamp] = useState<string | null>(null);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("ets_consent");
      if (!consent) {
        setIsOpen(true);
      } else {
        const parsed = JSON.parse(consent);
        const savedAt = parsed?.timestamp ? Date.parse(parsed.timestamp) : NaN;
        if (!Number.isFinite(savedAt) || Date.now() - savedAt > CONSENT_MAX_AGE_MS) {
          setIsOpen(true);
        } else {
          setAnalytics(!!parsed.analytics);
          setSavedTimestamp(parsed.timestamp);
        }
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }

    const handleOpenModal = () => {
      try {
        const consent = localStorage.getItem("ets_consent");
        if (consent) {
          const parsed = JSON.parse(consent);
          setAnalytics(!!parsed.analytics);
          setSavedTimestamp(parsed.timestamp || null);
        } else {
          setSavedTimestamp(null);
        }
      } catch {
        // Ignore storage errors
      }
      setShowPreferences(true);
    };

    window.addEventListener("ets-open-cookie-settings", handleOpenModal);
    return () => window.removeEventListener("ets-open-cookie-settings", handleOpenModal);
  }, []);

  useEffect(() => {
    if (!showPreferences) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPreferences(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPreferences]);

  const saveConsent = (allowAnalytics: boolean) => {
    const timestamp = new Date().toISOString();
    try {
      localStorage.setItem(
        "ets_consent",
        JSON.stringify({
          essential: true,
          analytics: allowAnalytics,
          timestamp,
        })
      );
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setAnalytics(allowAnalytics);
    setSavedTimestamp(timestamp);
    setIsOpen(false);
    setShowPreferences(false);
    window.dispatchEvent(new Event("ets-consent-updated"));
  };

  const formattedSavedDate = savedTimestamp
    ? new Date(savedTimestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      {isOpen && !showPreferences && (
        <aside className="cookie-banner show" role="region" aria-label="Cookie consent">
          <div className="ck-banner-inner">
            <div className="ck-banner-lead">
              <span className="ck-banner-icon" aria-hidden="true">
                <Icon id="i-shield" />
              </span>
              <div className="ck-banner-copy">
                <strong className="ck-banner-title">We Respect Your Privacy</strong>
                <p>
                  We use essential cookies to keep the site secure and reliable, plus optional
                  analytics if you allow them. Read our{" "}
                  <Link href="/cookies">Cookie Policy</Link> to learn more.
                </p>
              </div>
            </div>

            <div className="ck-banner-actions">
              <button
                type="button"
                className="ck-btn ck-btn-ghost"
                onClick={() => setShowPreferences(true)}
              >
                Customize
              </button>
              <button
                type="button"
                className="ck-btn ck-btn-light-outline"
                onClick={() => saveConsent(false)}
              >
                Essential only
              </button>
              <button
                type="button"
                className="ck-btn ck-btn-navy"
                onClick={() => saveConsent(true)}
              >
                Accept all
              </button>
            </div>
          </div>
        </aside>
      )}

      {showPreferences && (
        <div
          className="ck-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ck-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPreferences(false);
          }}
        >
          <div className="ck-modal">
            <div className="ck-modal-head">
              <div className="ck-modal-head-left">
                <span className="ck-modal-icon" aria-hidden="true">
                  <Icon id="i-shield" />
                </span>
                <div>
                  <h2 id="ck-modal-title">Privacy &amp; Cookie Preferences</h2>
                  <p>
                    Choose how we use cookies to support your browsing experience and protect our
                    services.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="ck-modal-close"
                aria-label="Close cookie preferences"
                onClick={() => setShowPreferences(false)}
              >
                <Icon id="i-x" />
              </button>
            </div>

            <div className="ck-modal-body">
              <div className="ck-pref-card">
                <div className="ck-pref-top">
                  <div className="ck-pref-info">
                    <div className="ck-pref-title-row">
                      <strong>Essential &amp; Security Cookies</strong>
                    </div>
                    <p>
                      Keep page navigation, enquiry and registration forms, and your saved privacy
                      preferences working reliably across our website.
                    </p>
                  </div>
                  <span className="ck-lock-chip" aria-hidden="true" title="Required">
                    <Icon id="i-lock" />
                  </span>
                </div>
              </div>

              <div className="ck-pref-card">
                <div className="ck-pref-top">
                  <div className="ck-pref-info">
                    <div className="ck-pref-title-row">
                      <label htmlFor="ck-analytics-toggle">
                        <strong>Analytics &amp; Performance Cookies</strong>
                      </label>
                    </div>
                    <p>
                      Help us understand which advisory services and training pages visitors find
                      most useful so we can improve site quality. We never run third-party
                      advertising trackers or sell browsing data.
                    </p>
                  </div>

                  <label className="ck-toggle" aria-label="Toggle analytics and performance cookies">
                    <input
                      id="ck-analytics-toggle"
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                    />
                    <span className="ck-toggle-track" aria-hidden="true" />
                  </label>
                </div>
              </div>

              {formattedSavedDate && (
                <p className="ck-saved-note">
                  Preferences last updated on {formattedSavedDate}.
                </p>
              )}
            </div>

            <div className="ck-modal-foot">
              <Link
                href="/cookies"
                className="ck-policy-link"
                onClick={() => setShowPreferences(false)}
              >
                Cookie Policy
              </Link>
              <div className="ck-modal-foot-actions">
                <button
                  type="button"
                  className="ck-btn ck-btn-light-outline"
                  onClick={() => saveConsent(false)}
                >
                  Essential only
                </button>
                <button
                  type="button"
                  className="ck-btn ck-btn-navy"
                  onClick={() => saveConsent(analytics)}
                >
                  Save preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
