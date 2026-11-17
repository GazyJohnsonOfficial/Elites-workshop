"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, CreditCard, Landmark, Smartphone } from "lucide-react";
import {
  formatCurrencyAmount,
  getCorporateDiscountPercent,
  type Cohort,
  type Course,
  type CurrencyCode,
} from "@/lib/academyStore";
import {
  mapCountryCodeToCurrency,
  mapCountryNameToCurrency,
  mapCurrencyToDefaultCountry,
} from "@/lib/geoCurrency";
import { SITE_CONFIG } from "@/lib/config";

export function TuitionEngineClient({
  courses,
  cohorts,
  initialCourseId,
  initialCohortId,
  initialMode,
  initialCurrency = "USD",
  initialCountry,
}: {
  courses: Course[];
  cohorts: Cohort[];
  initialCourseId: string;
  initialCohortId: string;
  initialMode: "individual" | "corporate";
  initialCurrency?: CurrencyCode;
  initialCountry?: string;
}) {
  const defaultCountry = initialCountry || mapCurrencyToDefaultCountry(initialCurrency);
  const [mode, setMode] = useState<"individual" | "corporate">(initialMode);
  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || courses[0]?.id || ""
  );
  const [selectedCohortId, setSelectedCohortId] = useState<string>(initialCohortId || "");

  // Individual state
  const [paymentPlan, setPaymentPlan] = useState<"full" | "installment_2">("installment_2");
  const [channel, setChannel] = useState<"Bank Transfer" | "Mobile Money (MoMo)" | "Debit / Credit Card">("Bank Transfer");
  const [indName, setIndName] = useState("");
  const [indEmail, setIndEmail] = useState("");
  const [indPhone, setIndPhone] = useState("");
  const [indCountry, setIndCountry] = useState(defaultCountry);

  // Corporate state
  const [seatCount, setSeatCount] = useState<number>(10);
  const [billingTerms, setBillingTerms] = useState<"Net-30 Purchase Order" | "Upfront Corporate Invoice">("Net-30 Purchase Order");
  const [orgName, setOrgName] = useState("");
  const [corpContactName, setCorpContactName] = useState("");
  const [corpContactEmail, setCorpContactEmail] = useState("");
  const [corpPhone, setCorpPhone] = useState("");
  const [corpRegion, setCorpRegion] = useState(defaultCountry);
  const [corpNotes, setCorpNotes] = useState("");
  const hasManualRegionEdit = useRef(false);

  useEffect(() => {
    if (hasManualRegionEdit.current) return;
    setCurrency(initialCurrency);
    const derived = initialCountry || mapCurrencyToDefaultCountry(initialCurrency);
    setIndCountry(derived);
    setCorpRegion(derived);
  }, [initialCurrency, initialCountry]);

  useEffect(() => {
    const handleRegionChange = (event: Event) => {
      if (hasManualRegionEdit.current) return;
      const detail = (event as CustomEvent<{ currency?: CurrencyCode; countryCode?: string }>).detail;
      const nextCurr =
        detail?.currency ||
        (detail?.countryCode ? mapCountryCodeToCurrency(detail.countryCode) : null);
      if (nextCurr) {
        const nextCountry = mapCurrencyToDefaultCountry(nextCurr);
        setCurrency(nextCurr);
        setIndCountry(nextCountry);
        setCorpRegion(nextCountry);
      }
    };
    window.addEventListener("ets-region-currency-changed", handleRegionChange);
    return () => {
      window.removeEventListener("ets-region-currency-changed", handleRegionChange);
    };
  }, []);

  const handleModeChange = (nextMode: "individual" | "corporate") => {
    setMode(nextMode);
    setError("");
    const activeTarget = nextMode === "individual" ? indCountry : corpRegion;
    setCurrency(mapCountryNameToCurrency(activeTarget));
  };

  const handleIndividualCountryChange = (nextCountry: string) => {
    hasManualRegionEdit.current = true;
    setIndCountry(nextCountry);
    const nextCurrency = mapCountryNameToCurrency(nextCountry);
    setCurrency(nextCurrency);
    if (nextCurrency !== "GHS" && channel === "Mobile Money (MoMo)") {
      setChannel("Bank Transfer");
    }
  };

  const handleCorporateRegionChange = (nextRegion: string) => {
    hasManualRegionEdit.current = true;
    setCorpRegion(nextRegion);
    setCurrency(mapCountryNameToCurrency(nextRegion));
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{
    type: "individual" | "corporate";
    reference: string;
    amountFormatted: string;
    title: string;
    detail: string;
  } | null>(null);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) || courses[0],
    [courses, selectedCourseId]
  );

  const availableCohorts = useMemo(
    () => cohorts.filter((c) => c.courseId === selectedCourse?.id),
    [cohorts, selectedCourse]
  );

  const unitUsd = selectedCourse?.tuitionUsd || 1000;
  const indDueNowUsd = paymentPlan === "installment_2" ? Math.ceil(unitUsd / 2) : unitUsd;
  const indBalanceLaterUsd = unitUsd - indDueNowUsd;

  const discountPercent = getCorporateDiscountPercent(seatCount);
  const corpGrossUsd = unitUsd * seatCount;
  const corpNetUsd = Math.round(corpGrossUsd * (1 - discountPercent / 100));
  const corpSavingsUsd = corpGrossUsd - corpNetUsd;

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/academy/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: indName,
          email: indEmail,
          phone: indPhone,
          country: indCountry,
          courseId: selectedCourse.id,
          cohortId: selectedCohortId || availableCohorts[0]?.id || "",
          paymentPlan,
          currency,
          channel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to submit enrollment.");
      }
      window.dispatchEvent(new Event("ets-academy-session-changed"));
      setReceipt({
        type: "individual",
        reference: data.reference,
        amountFormatted: data.amountDueFormatted,
        title: selectedCourse.title,
        detail:
          paymentPlan === "installment_2"
            ? "Installment 1 of 2 scheduled. Your Academy workspace is now unlocked."
            : "Full tuition registration recorded. Your Academy workspace is now unlocked.",
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCorporateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/academy/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName: orgName,
          contactName: corpContactName,
          contactEmail: corpContactEmail,
          phone: corpPhone,
          region: corpRegion,
          courseId: selectedCourse.id,
          seatCount,
          currency,
          billingTerms,
          notes: corpNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to generate corporate quote.");
      }
      window.dispatchEvent(new Event("ets-academy-session-changed"));
      setReceipt({
        type: "corporate",
        reference: data.reference,
        amountFormatted: data.quote.totalLocalFormatted,
        title: `${orgName} · ${seatCount} Seats (${selectedCourse.title})`,
        detail: `${billingTerms} generated with ${data.quote.discountPercent}% corporate volume savings. Your Corporate Team Portal is ready for seat assignments.`,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const activeRegionBank = useMemo(() => {
    const target = mode === "individual" ? indCountry : corpRegion;
    if (target.toLowerCase().includes("ghana")) return SITE_CONFIG.PAYMENT.BANKS.gh;
    if (target.toLowerCase().includes("kingdom") || target === "UK") return SITE_CONFIG.PAYMENT.BANKS.uk;
    return SITE_CONFIG.PAYMENT.BANKS.us;
  }, [mode, indCountry, corpRegion]);

  return (
    <main id="main">
      <section className="acad-page-hero">
        <div className="container">
          <div className="acad-crumbs">
            <Link href="/academy">Academy Catalog</Link>
            <span>/</span>
            <span>Tuition Calculator &amp; Corporate Quotes</span>
          </div>
          <div className="acad-page-hero-row">
            <div>
              <h1>Tuition Enrollment, Installments &amp; Corporate Quotes</h1>
              <p className="lead">
                Pricing is automatically displayed in your local settlement currency ({currency}). Enroll individually on a full or 2-installment schedule, or generate an instant corporate volume quote tailored to your hub.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="acad-section">
        <div className="container">
          {receipt ? (
            <div className="acad-card" style={{ maxWidth: "740px", margin: "0 auto", padding: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", color: "var(--ok-text)" }}>
                <CheckCircle2 size={26} />
                <h2 style={{ margin: 0, color: "var(--navy)" }}>
                  {receipt.type === "individual" ? "Academy Enrollment Confirmed" : "Corporate Quote & Seat Account Provisioned"}
                </h2>
              </div>
              <p style={{ color: "var(--muted)", marginBottom: "20px", maxWidth: "62ch" }}>{receipt.detail}</p>

              <div className="acad-summary-row">
                <span>Reference Number</span>
                <strong className="acad-mono" style={{ color: "var(--navy)" }}>{receipt.reference}</strong>
              </div>
              <div className="acad-summary-row">
                <span>Program</span>
                <strong>{receipt.title}</strong>
              </div>
              <div className="acad-summary-row">
                <span>Amount Due ({currency})</span>
                <strong className="acad-mono" style={{ color: "var(--blue)" }}>{receipt.amountFormatted}</strong>
              </div>
              <div className="acad-summary-row">
                <span>Settlement Bank / Desk</span>
                <span>{activeRegionBank.BANK} · {activeRegionBank.ACCOUNT_NAME}</span>
              </div>
              {activeRegionBank.MOMO_MERCHANT && (
                <div className="acad-summary-row">
                  <span>MoMo Merchant Line</span>
                  <span className="acad-mono">{activeRegionBank.MOMO_MERCHANT}</span>
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
                <Link
                  href={receipt.type === "individual" ? "/academy/learn" : "/academy/corporate"}
                  className="btn btn-gold"
                >
                  <span>{receipt.type === "individual" ? "Open My Learning Workspace" : "Open Corporate Team Portal"}</span>
                  <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => setReceipt(null)}
                  className="btn btn-outline"
                >
                  Calculate Another Quote
                </button>
              </div>
            </div>
          ) : (
            <div className="acad-tuition-grid">
              {/* Left Interactive Form Column */}
              <div className="acad-card">
                <div className="acad-mode-switch" role="tablist" aria-label="Enrollment mode">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "individual"}
                    onClick={() => handleModeChange("individual")}
                    className={`acad-mode-btn ${mode === "individual" ? "active" : ""}`}
                  >
                    <strong>Individual Learner</strong>
                    <span>Full payment or 50% + 50% monthly split</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "corporate"}
                    onClick={() => handleModeChange("corporate")}
                    className={`acad-mode-btn ${mode === "corporate" ? "active" : ""}`}
                  >
                    <strong>Corporate Team Pack (5+ Seats)</strong>
                    <span>Volume savings up to 22% &amp; Net-30 PO</span>
                  </button>
                </div>

                {error && (
                  <div className="alert-error" role="alert" style={{ padding: "12px 14px", fontSize: "0.88rem" }}>
                    {error}
                  </div>
                )}

                <div className="acad-form-grid" style={{ marginBottom: "18px" }}>
                  <div className={`acad-field ${mode === "corporate" ? "full" : ""}`}>
                    <label htmlFor="tuition-course">Select Academy Program</label>
                    <select
                      id="tuition-course"
                      value={selectedCourse?.id || ""}
                      onChange={(e) => {
                        setSelectedCourseId(e.target.value);
                        setSelectedCohortId("");
                      }}
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} · {formatCurrencyAmount(c.tuitionUsd, currency)} ({c.durationWeeks} wks)
                        </option>
                      ))}
                    </select>
                  </div>

                  {mode === "individual" && (
                    <div className="acad-field">
                      <label htmlFor="tuition-cohort">Preferred Cohort</label>
                      <select
                        id="tuition-cohort"
                        value={selectedCohortId || availableCohorts[0]?.id || ""}
                        onChange={(e) => setSelectedCohortId(e.target.value)}
                      >
                        {availableCohorts.length === 0 ? (
                          <option value="">Rolling Immediate Access</option>
                        ) : (
                          availableCohorts.map((ch) => (
                            <option key={ch.id} value={ch.id}>
                              {ch.code} · {ch.startDateText}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  )}
                </div>

                {mode === "corporate" && (
                  <div className="acad-seat-slider-box">
                    <div className="acad-seat-slider-head">
                      <label htmlFor="tuition-seats" style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--navy)" }}>
                        Team Seat Quantity (min. 5)
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          id="tuition-seats"
                          type="number"
                          min={5}
                          max={250}
                          value={seatCount}
                          onChange={(e) => setSeatCount(Math.max(5, Math.min(250, Number(e.target.value) || 5)))}
                          className="acad-input acad-mono"
                          style={{ width: "86px", fontWeight: 700, textAlign: "right" }}
                        />
                        <span style={{ fontSize: "0.82rem", color: "var(--muted)", fontWeight: 600 }}>seats</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      value={Math.min(100, seatCount)}
                      onChange={(e) => setSeatCount(Number(e.target.value))}
                      className="acad-range"
                      aria-label="Team seat count slider"
                    />
                    <div className="acad-tier-row">
                      <div className={`acad-tier-step ${seatCount >= 5 && seatCount <= 14 ? "active" : ""}`}>
                        <span>5–14 Seats</span>
                        <strong>10% off</strong>
                      </div>
                      <div className={`acad-tier-step ${seatCount >= 15 && seatCount <= 29 ? "active" : ""}`}>
                        <span>15–29 Seats</span>
                        <strong>15% off</strong>
                      </div>
                      <div className={`acad-tier-step ${seatCount >= 30 ? "active" : ""}`}>
                        <span>30+ Seats</span>
                        <strong>22% off</strong>
                      </div>
                    </div>
                  </div>
                )}

                {mode === "individual" ? (
                  <form onSubmit={handleIndividualSubmit} className="acad-form-grid">
                    <div className="acad-field">
                      <label htmlFor="tuition-plan">Installment Schedule</label>
                      <select
                        id="tuition-plan"
                        value={paymentPlan}
                        onChange={(e) => setPaymentPlan(e.target.value as "full" | "installment_2")}
                      >
                        <option value="installment_2">2 Monthly Installments (50% Deposit Now)</option>
                        <option value="full">Full Tuition Upfront (100%)</option>
                      </select>
                    </div>

                    <div className="acad-field">
                      <label htmlFor="tuition-channel">Settlement Channel</label>
                      <select
                        id="tuition-channel"
                        value={channel}
                        onChange={(e) =>
                          setChannel(
                            e.target.value as "Bank Transfer" | "Mobile Money (MoMo)" | "Debit / Credit Card"
                          )
                        }
                      >
                        <option value="Bank Transfer">Direct Corporate Bank Transfer</option>
                        <option value="Mobile Money (MoMo)">Mobile Money (MTN MoMo / Telecel)</option>
                        <option value="Debit / Credit Card">Debit / Credit Card (Visa / MasterCard)</option>
                      </select>
                    </div>

                    <div className="acad-field">
                      <label htmlFor="ind-name">Full Name</label>
                      <input
                        id="ind-name"
                        type="text"
                        required
                        placeholder="Akua Mensah"
                        value={indName}
                        onChange={(e) => setIndName(e.target.value)}
                      />
                    </div>

                    <div className="acad-field">
                      <label htmlFor="ind-email">Email Address</label>
                      <input
                        id="ind-email"
                        type="email"
                        required
                        placeholder="akua@company.com"
                        value={indEmail}
                        onChange={(e) => setIndEmail(e.target.value)}
                      />
                    </div>

                    <div className="acad-field">
                      <label htmlFor="ind-phone">Phone / WhatsApp</label>
                      <input
                        id="ind-phone"
                        type="tel"
                        required
                        placeholder="+233 54 000 0000"
                        value={indPhone}
                        onChange={(e) => setIndPhone(e.target.value)}
                      />
                    </div>

                    <div className="acad-field">
                      <label htmlFor="ind-country">Country / Hub</label>
                      <select
                        id="ind-country"
                        value={indCountry}
                        onChange={(e) => handleIndividualCountryChange(e.target.value)}
                      >
                        <option value="Ghana">Ghana</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Canada">Canada</option>
                        <option value="Other International">Other International</option>
                      </select>
                    </div>

                    <div className="acad-field full" style={{ marginTop: "6px" }}>
                      <button type="submit" className="btn btn-gold btn-block" disabled={submitting}>
                        {submitting
                          ? "Generating Enrollment & Receipt..."
                          : `Complete Enrollment · ${formatCurrencyAmount(indDueNowUsd, currency)} Due Now`}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleCorporateSubmit} className="acad-form-grid">
                    <div className="acad-field">
                      <label htmlFor="corp-org">Organization Name</label>
                      <input
                        id="corp-org"
                        type="text"
                        required
                        placeholder="Acme Financial Services Ltd"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                      />
                    </div>

                    <div className="acad-field">
                      <label htmlFor="corp-terms">Billing Arrangement</label>
                      <select
                        id="corp-terms"
                        value={billingTerms}
                        onChange={(e) =>
                          setBillingTerms(
                            e.target.value as "Net-30 Purchase Order" | "Upfront Corporate Invoice"
                          )
                        }
                      >
                        <option value="Net-30 Purchase Order">Net-30 Purchase Order</option>
                        <option value="Upfront Corporate Invoice">Upfront Corporate Invoice</option>
                      </select>
                    </div>

                    <div className="acad-field">
                      <label htmlFor="corp-contact">L&amp;D / Sponsor Name</label>
                      <input
                        id="corp-contact"
                        type="text"
                        required
                        placeholder="David Osei-Bonsu"
                        value={corpContactName}
                        onChange={(e) => setCorpContactName(e.target.value)}
                      />
                    </div>

                    <div className="acad-field">
                      <label htmlFor="corp-email">Work Billing Email</label>
                      <input
                        id="corp-email"
                        type="email"
                        required
                        placeholder="learning@organization.com"
                        value={corpContactEmail}
                        onChange={(e) => setCorpContactEmail(e.target.value)}
                      />
                    </div>

                    <div className="acad-field">
                      <label htmlFor="corp-phone">Direct Phone</label>
                      <input
                        id="corp-phone"
                        type="tel"
                        placeholder="+1 609 555 0100"
                        value={corpPhone}
                        onChange={(e) => setCorpPhone(e.target.value)}
                      />
                    </div>

                    <div className="acad-field">
                      <label htmlFor="corp-region">Operating Region</label>
                      <select
                        id="corp-region"
                        value={corpRegion}
                        onChange={(e) => handleCorporateRegionChange(e.target.value)}
                      >
                        <option value="Ghana">Ghana</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="EMEA Multi-Region">EMEA Multi-Region</option>
                        <option value="Global Remote Team">Global Remote Team</option>
                      </select>
                    </div>

                    <div className="acad-field full">
                      <label htmlFor="corp-notes">Cohort Goals / Custom Environment Notes (Optional)</label>
                      <textarea
                        id="corp-notes"
                        rows={3}
                        placeholder="Target start window, AWS/Azure alignment, or departmental KPI focus..."
                        value={corpNotes}
                        onChange={(e) => setCorpNotes(e.target.value)}
                      />
                    </div>

                    <div className="acad-field full" style={{ marginTop: "6px" }}>
                      <button type="submit" className="btn btn-navy btn-block" disabled={submitting}>
                        <Building2 size={16} />
                        <span>
                          {submitting
                            ? "Provisioning Organization Quote..."
                            : `Generate Formal Quote & Provision ${seatCount} Seats (${formatCurrencyAmount(corpNetUsd, currency)})`}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Right Live Financial Breakdown Column */}
              <aside className="acad-card acad-card-sticky">
                <div className="acad-overview-label" style={{ marginBottom: "6px" }}>
                  Live Itemized Tuition Summary
                </div>
                <h2 style={{ fontSize: "1.18rem", color: "var(--navy)", marginBottom: "14px" }}>
                  {selectedCourse?.title}
                </h2>

                {mode === "individual" ? (
                  <>
                    <div className="acad-summary-row">
                      <span>Standard Track Fee ({currency})</span>
                      <strong className="acad-mono">{formatCurrencyAmount(unitUsd, currency)}</strong>
                    </div>
                    <div className="acad-summary-row">
                      <span>Selected Schedule</span>
                      <strong>{paymentPlan === "installment_2" ? "2 Monthly Installments" : "Full Payment"}</strong>
                    </div>
                    <div className="acad-summary-row">
                      <span>Second Installment (Week 5)</span>
                      <span className="acad-mono">{formatCurrencyAmount(indBalanceLaterUsd, currency)}</span>
                    </div>
                    <div className="acad-summary-total">
                      <span>Due Today</span>
                      <span className="acad-mono" style={{ color: "var(--blue)" }}>
                        {formatCurrencyAmount(indDueNowUsd, currency)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="acad-summary-row">
                      <span>Seat Pack Quantity</span>
                      <strong className="acad-mono">{seatCount} Seats</strong>
                    </div>
                    <div className="acad-summary-row">
                      <span>Gross Standard Value</span>
                      <span className="acad-mono">{formatCurrencyAmount(corpGrossUsd, currency)}</span>
                    </div>
                    <div className="acad-summary-row">
                      <span>Corporate Volume Discount</span>
                      <strong className="acad-mono" style={{ color: "var(--ok-text)" }}>
                        -{discountPercent}% ({formatCurrencyAmount(corpSavingsUsd, currency)} saved)
                      </strong>
                    </div>
                    <div className="acad-summary-row">
                      <span>Effective Per-Seat Rate</span>
                      <span className="acad-mono">
                        {formatCurrencyAmount(Math.round(corpNetUsd / seatCount), currency)} / seat
                      </span>
                    </div>
                    <div className="acad-summary-total">
                      <span>Quoted Total ({currency})</span>
                      <span className="acad-mono" style={{ color: "var(--blue)" }}>
                        {formatCurrencyAmount(corpNetUsd, currency)}
                      </span>
                    </div>
                  </>
                )}

                <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: "10px" }}>
                    Regional Settlement Channels ({activeRegionBank.NAME})
                  </div>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.83rem", color: "var(--muted)" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Landmark size={15} color="var(--blue)" />
                      <span>{activeRegionBank.BANK} · {activeRegionBank.ACCOUNT_NAME}</span>
                    </li>
                    {activeRegionBank.MOMO_MERCHANT && (
                      <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Smartphone size={15} color="var(--blue)" />
                        <span>MoMo Merchant: {activeRegionBank.MOMO_MERCHANT}</span>
                      </li>
                    )}
                    <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CreditCard size={15} color="var(--blue)" />
                      <span>Visa, MasterCard &amp; Corporate PO Settlement</span>
                    </li>
                  </ul>
                </div>

                <div className="acad-surface-note">
                  <strong style={{ color: "var(--navy)" }}>Volume Tiers:</strong> 5–14 seats (10% off) · 15–29 seats (15% off) · 30+ seats (22% off).
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
