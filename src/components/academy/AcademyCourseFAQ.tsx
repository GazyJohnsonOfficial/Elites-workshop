"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, HelpCircle } from "lucide-react";

export type AcademyFaqCategory =
  | "All"
  | "Individuals"
  | "Corporate Teams"
  | "Billing & Credentials";

export interface AcademyFaqItem {
  id: string;
  category: Exclude<AcademyFaqCategory, "All">;
  q: string;
  a: string;
}

export const ACADEMY_FAQ_CATEGORIES: readonly AcademyFaqCategory[] = [
  "All",
  "Individuals",
  "Corporate Teams",
  "Billing & Credentials",
] as const;

export const ACADEMY_FAQ_ITEMS: readonly AcademyFaqItem[] = [
  {
    id: "faq-currency-settlement",
    category: "Billing & Credentials",
    q: "How are tuition currency and payment methods handled?",
    a: "Tuition is automatically presented in your local regional currency (USD, GHS, or GBP) based on your location or selected enrollment hub. Individual learners can pay in full or choose our 2-monthly installment plan via bank transfer, Mobile Money (MoMo for GHS), or debit/credit card.",
  },
  {
    id: "faq-hardware-reqs",
    category: "Individuals",
    q: "What are the computer hardware and software environment requirements?",
    a: "Students need a modern laptop (macOS, Windows 10/11 Pro/Enterprise, or Linux Ubuntu) with at least 16GB RAM recommended for containers/virtualization labs and a stable internet connection. All required tooling (Docker, VS Code, Terraform, Python, PostgreSQL, or Power BI Desktop) is configured during Module 1 with guided runbooks.",
  },
  {
    id: "faq-schedules-recordings",
    category: "Individuals",
    q: "How are instructor-led sessions, recordings, and self-paced tracks structured?",
    a: "Instructor-led cohorts run live interactive workshops twice weekly during evening and Saturday morning slots across North America, Europe, and West Africa time zones. All live sessions are recorded and archived in the Learner Workspace alongside self-paced modules and weekly mentor office hours.",
  },
  {
    id: "faq-corporate-teams",
    category: "Corporate Teams",
    q: "How does corporate team enrollment and volume pricing work?",
    a: "Organizations enrolling 5 or more engineers unlock automatic volume discounts (10% off 5–14 seats, 15% off 15–29 seats, and 22% off 30+ seats), Net-30 Purchase Order or upfront invoice billing, and seat allocation plus completion reporting inside the Corporate Team Portal.",
  },
  {
    id: "faq-employer-sponsorship",
    category: "Corporate Teams",
    q: "Can employers sponsor individual tuition or request custom departmental cohorts?",
    a: "Yes. Working professionals receive itemized payment receipts and invoices to support employer L&D reimbursement. Engineering leaders can also scope dedicated corporate bootcamps aligned with internal cloud architectures, security baselines, and toolchains.",
  },
  {
    id: "faq-verified-credentials",
    category: "Billing & Credentials",
    q: "Are the graduate certificates employer-verifiable?",
    a: "Yes. Upon completing all required curriculum modules and submitting your capstone architecture deliverable, you earn a unique credential code (e.g. ETS-CERT-XXXXXX) that hiring managers can verify publicly via our Credential Registry and attach to LinkedIn.",
  },
  {
    id: "faq-choosing-program",
    category: "Individuals",
    q: "How should I choose between programs or delivery formats before enrolling?",
    a: "Use the career track matcher at the top of the page or filter courses by program domain (Data & BI, Cloud & DevOps, Cybersecurity, Data & Automation), format, and toolchain in the catalog sidebar. Clicking View Program on any course lets you inspect the full curriculum and preview Module 01 before committing.",
  },
] as const;

function FaqAccordionList({
  items,
  openId,
  onToggle,
  showCategoryBadge = false,
}: {
  items: readonly AcademyFaqItem[];
  openId: string | null;
  onToggle: (id: string) => void;
  showCategoryBadge?: boolean;
}) {
  return (
    <div className="acad-faq-list">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`acad-faq-item ${isOpen ? "is-open" : ""}`}
          >
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              id={`faq-trigger-${item.id}`}
              className="acad-faq-trigger"
            >
              <span className="acad-faq-trigger-text">
                {showCategoryBadge && (
                  <span className="acad-faq-tag">{item.category}</span>
                )}
                <span className="acad-faq-question">{item.q}</span>
              </span>
              <span className="acad-faq-chevron" aria-hidden="true">
                <ChevronDown size={18} />
              </span>
            </button>
            {isOpen && (
              <div
                id={`faq-panel-${item.id}`}
                role="region"
                aria-labelledby={`faq-trigger-${item.id}`}
                className="acad-faq-panel"
              >
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AcademyCourseFAQ() {
  const courseFaqs = ACADEMY_FAQ_ITEMS.slice(0, 6);
  const [openId, setOpenId] = useState<string | null>(courseFaqs[0]?.id ?? null);

  return (
    <div className="acad-card" style={{ marginTop: "36px" }}>
      <div className="acad-faq-course-head">
        <div className="acad-faq-course-icon" aria-hidden="true">
          <HelpCircle size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: "1.25rem", color: "var(--navy)", margin: 0 }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "2px 0 0 0" }}>
            Common questions regarding enrollment, hardware requirements, and schedules.
          </p>
        </div>
      </div>

      <FaqAccordionList
        items={courseFaqs}
        openId={openId}
        onToggle={(id) => setOpenId((prev) => (prev === id ? null : id))}
      />
    </div>
  );
}

export function AcademyHomeFaqSection() {
  const [selectedCategory, setSelectedCategory] = useState<AcademyFaqCategory>("All");
  const [openId, setOpenId] = useState<string | null>(ACADEMY_FAQ_ITEMS[0]?.id ?? null);

  const visibleItems = useMemo(() => {
    if (selectedCategory === "All") return ACADEMY_FAQ_ITEMS;
    return ACADEMY_FAQ_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleSelectCategory = (category: AcademyFaqCategory) => {
    setSelectedCategory(category);
    const nextList =
      category === "All"
        ? ACADEMY_FAQ_ITEMS
        : ACADEMY_FAQ_ITEMS.filter((item) => item.category === category);
    setOpenId((current) =>
      current && nextList.some((item) => item.id === current)
        ? current
        : (nextList[0]?.id ?? null)
    );
  };

  return (
    <section className="acad-section acad-section-tint acad-faq-section" id="faq">
      <div className="container">
        <div className="acad-faq-shell">
          <div className="acad-faq-intro">
            <span className="acad-faq-eyebrow">Academy Logistics &amp; Support</span>
            <h2>Frequently Asked Questions</h2>
            <p>
              Clear answers on live cohort schedules, hardware prerequisites, localized tuition settlements, and corporate team onboarding.
            </p>

            <div className="acad-faq-tabs" role="tablist" aria-label="Filter FAQ by topic">
              {ACADEMY_FAQ_CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleSelectCategory(category)}
                    className={`acad-faq-tab ${active ? "active" : ""}`}
                  >
                    {category === "All" ? "All Topics" : category}
                  </button>
                );
              })}
            </div>

            <div className="acad-faq-callout">
              <strong>Need tailored guidance for yourself or a team?</strong>
              <p>
                Model individual installments or bulk corporate seat discounts instantly, or speak with our admissions engineers.
              </p>
              <div className="acad-faq-callout-actions">
                <Link href="/academy/tuition" className="btn btn-navy btn-sm">
                  <span>Tuition Calculator</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <Link href="/contact#inquiry" className="btn btn-outline btn-sm">
                  Contact Admissions
                </Link>
              </div>
            </div>
          </div>

          <div className="acad-faq-stage">
            <FaqAccordionList
              items={visibleItems}
              openId={openId}
              onToggle={(id) => setOpenId((prev) => (prev === id ? null : id))}
              showCategoryBadge={selectedCategory === "All"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
