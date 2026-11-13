"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "./Sprite";

interface ConsentState {
  loaded: boolean;
  hasChoice: boolean;
  analytics: boolean;
  timestamp: string | null;
}

export function CookieManageButton() {
  const [state, setState] = useState<ConsentState>({
    loaded: false,
    hasChoice: false,
    analytics: false,
    timestamp: null,
  });

  const readConsent = () => {
    try {
      const raw = localStorage.getItem("ets_consent");
      if (!raw) {
        setState({ loaded: true, hasChoice: false, analytics: false, timestamp: null });
        return;
      }
      const parsed = JSON.parse(raw);
      setState({
        loaded: true,
        hasChoice: true,
        analytics: !!parsed.analytics,
        timestamp: parsed.timestamp || null,
      });
    } catch {
      setState({ loaded: true, hasChoice: false, analytics: false, timestamp: null });
    }
  };

  useEffect(() => {
    readConsent();
    window.addEventListener("ets-consent-updated", readConsent);
    return () => window.removeEventListener("ets-consent-updated", readConsent);
  }, []);

  const openSettings = () => {
    window.dispatchEvent(new Event("ets-open-cookie-settings"));
  };

  const resetToEssential = () => {
    try {
      localStorage.setItem(
        "ets_consent",
        JSON.stringify({
          essential: true,
          analytics: false,
          timestamp: new Date().toISOString(),
        })
      );
      readConsent();
      window.dispatchEvent(new Event("ets-consent-updated"));
    } catch {
      // Ignore storage errors
    }
  };

  const formattedDate = state.timestamp
    ? new Date(state.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="ck-policy-card">
      <div className="ck-policy-card-head">
        <span className="ck-policy-card-icon" aria-hidden="true">
          <Icon id="i-sliders" />
        </span>
        <div>
          <h3>Current Consent Status</h3>
          <p>
            {!state.loaded
              ? "Reviewing your saved preferences..."
              : !state.hasChoice
              ? "No cookie preference has been saved on this browser yet."
              : state.analytics
              ? `Essential security cookies and optional analytics preferences are enabled${formattedDate ? ` (saved ${formattedDate})` : ""}.`
              : `Only essential security cookies are active${formattedDate ? ` (saved ${formattedDate})` : ""}.`}
          </p>
        </div>
      </div>

      <div className="ck-policy-card-actions">
        <span
          className={`ck-pill ${
            !state.hasChoice
              ? "ck-pill-muted"
              : state.analytics
              ? "ck-pill-blue"
              : "ck-pill-ok"
          }`}
        >
          {!state.hasChoice
            ? "Pending choice"
            : state.analytics
            ? "Essential + Analytics"
            : "Essential only"}
        </span>

        <div className="ck-policy-btns">
          {state.analytics && (
            <button
              type="button"
              className="ck-btn ck-btn-light-outline"
              onClick={resetToEssential}
            >
              Decline Non-Essential
            </button>
          )}
          <button type="button" className="ck-btn ck-btn-navy" onClick={openSettings}>
            Open Cookie Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

