"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, HelpCircle } from "lucide-react";

export type FaqAudience = "individual" | "business";

export interface AcademyFaqItem {
  id: string;
  category: string;
  q: string;
  a: string;
}

const INDIVIDUAL_FAQ_CATEGORIES = [
  "All",
  "Getting Started",
  "Learning & Labs",
  "Tuition & Credentials",
] as const;

const BUSINESS_FAQ_CATEGORIES = [
  "All",
  "Team Plans",
  "Procurement & Billing",
  "Telemetry & Custom",
] as const;

export const INDIVIDUAL_FAQ_ITEMS: readonly AcademyFaqItem[] = [
  {
    id: "ind-faq-beginner",
    category: "Getting Started",
    q: "Do I need prior coding or IT experience to enroll?",
    a: "Not for our beginner-friendly tracks. IT Support, Networking & Linux Fundamentals, Data Analysis & BI Engineering, and Applied AI & Workflow Automation start from practical fundamentals and guide you step by step. Intermediate and advanced tracks list recommended background on each syllabus page.",
  },
  {
    id: "ind-faq-schedules",
    category: "Learning & Labs",
    q: "How are live instructor-led classes and self-paced tracks structured?",
    a: "Instructor-led cohorts meet live twice per week during evening and Saturday slots designed for working professionals across North America, Europe, and West Africa. Every live workshop is recorded and archived inside your Learner Workspace, while self-paced tracks let you progress on your own schedule with weekly mentor office hours.",
  },
  {
    id: "ind-faq-hardware",
    category: "Learning & Labs",
    q: "What computer and software setup do I need?",
    a: "You need a modern macOS, Windows 10/11, or Linux laptop with a reliable internet connection (8GB RAM minimum; 16GB recommended for Cloud, Docker, and Security lab tracks). Module 1 includes step-by-step setup runbooks for every tool used in your course.",
  },
  {
    id: "ind-faq-installments",
    category: "Tuition & Credentials",
    q: "Can I pay in installments and in my local currency?",
    a: "Yes. Tuition is presented in USD, GHS, or GBP based on your regional hub. Individual learners can pay in full or split tuition into 2 equal 50% installments via bank transfer, Mobile Money (MoMo for GHS), or debit/credit card.",
  },
  {
    id: "ind-faq-sponsorship",
    category: "Tuition & Credentials",
    q: "Can my employer reimburse my individual course tuition?",
    a: "Yes. Every individual enrollment generates an itemized invoice and payment receipt with your course syllabus reference so you can submit it directly to your HR or L&D reimbursement portal.",
  },
  {
    id: "ind-faq-credentials",
    category: "Tuition & Credentials",
    q: "Are graduate certificates verifiable by employers?",
    a: "Yes. After completing your required modules and capstone deliverable, you receive a unique credential code (e.g. ETS-CERT-XXXXXX) backed by Open Badges v2 metadata that recruiters and hiring managers can verify publicly in our Credential Registry and view on LinkedIn.",
  },
] as const;

export const BUSINESS_FAQ_ITEMS: readonly AcademyFaqItem[] = [
  {
    id: "biz-faq-volume",
    category: "Team Plans",
    q: "How does corporate team enrollment and seat pricing work?",
    a: "Organizations can enroll 5 or more team members at transparent standard per-seat rates across individual courses, corporate bootcamps, or multi-course departmental pathways. Generate an instant itemized quote in USD, GBP, or GHS inside the Seat Quote Calculator.",
  },
  {
    id: "biz-faq-billing",
    category: "Procurement & Billing",
    q: "Do you support Net-30 Purchase Orders and multi-currency invoicing?",
    a: "Yes. Finance and procurement teams can generate formal corporate quotes instantly in USD, GBP, or GHS and settle via Net-30 Purchase Order, corporate wire transfer, or upfront invoice settlement.",
  },
  {
    id: "biz-faq-private-cohorts",
    category: "Telemetry & Custom",
    q: "Can we run a private dedicated cohort aligned to our internal cloud stack?",
    a: "Yes. Teams of 15 or more can schedule private dedicated cohorts tailored to your company time zone, cloud provider (AWS or Azure), BI semantic model, and compliance policies. Use the consultation form on this page to scope custom schedules and lab alignment.",
  },
  {
    id: "biz-faq-seats",
    category: "Team Plans",
    q: "Can organization administrators assign or reassign seats across employees?",
    a: "Yes. From the Corporate Team Portal, organization administrators can allocate available seats to individual courses or 2-course departmental pathways and revoke or reassign unused seats whenever team priorities shift.",
  },
  {
    id: "biz-faq-telemetry",
    category: "Telemetry & Custom",
    q: "What progress visibility do engineering and L&D managers receive?",
    a: "Admins see live employee completion percentages, module checkpoint scores, and issued certificate codes inside the Corporate Portal, with one-click CSV telemetry export and printable compliance reports.",
  },
  {
    id: "biz-faq-credentials",
    category: "Procurement & Billing",
    q: "How are completed corporate credentials audited for compliance?",
    a: "Every completing team member receives a publicly verifiable Open Badges v2 credential code logged directly in your organization's telemetry ledger, simplifying internal L&D audits and vendor readiness checks.",
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

export function AcademyCourseFAQ({
  audience = "individual",
}: {
  audience?: FaqAudience;
}) {
  const courseFaqs =
    audience === "business" ? BUSINESS_FAQ_ITEMS : INDIVIDUAL_FAQ_ITEMS;
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
            {audience === "business"
              ? "Common questions regarding corporate team seats, Net-30 invoicing, and custom cohorts."
              : "Common questions regarding prerequisites, lab setup, installments, and schedules."}
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

export function AcademyHomeFaqSection({
  audience = "individual",
}: {
  audience?: FaqAudience;
}) {
  const isBusiness = audience === "business";
  const allItems = isBusiness ? BUSINESS_FAQ_ITEMS : INDIVIDUAL_FAQ_ITEMS;
  const categories = isBusiness
    ? BUSINESS_FAQ_CATEGORIES
    : INDIVIDUAL_FAQ_CATEGORIES;

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>(allItems[0]?.id ?? null);

  const visibleItems = useMemo(() => {
    if (selectedCategory === "All") return allItems;
    return allItems.filter((item) => item.category === selectedCategory);
  }, [allItems, selectedCategory]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    const nextList =
      category === "All"
        ? allItems
        : allItems.filter((item) => item.category === category);
    setOpenId((current) =>
      current && nextList.some((item) => item.id === current)
        ? current
        : (nextList[0]?.id ?? null)
    );
  };

  return (
    <section
      className="acad-section acad-section-tint acad-faq-section"
      id={isBusiness ? "corporate-faq" : "faq"}
    >
      <div className="container">
        <div className="acad-faq-shell">
          <div className="acad-faq-intro">
            <span className="acad-faq-eyebrow">
              {isBusiness
                ? "Corporate Procurement & Onboarding"
                : "Learner Support & Admissions"}
            </span>
            <h2>
              {isBusiness
                ? "Corporate Training FAQ"
                : "Frequently Asked Questions"}
            </h2>
            <p>
              {isBusiness
                ? "Clear answers on multi-seat enrollment, Net-30 Purchase Orders, private team cohorts, and engineering manager telemetry."
                : "Clear answers on beginner readiness, live vs. self-paced schedules, flexible 2-part installments, and verified career credentials."}
            </p>

            <div className="acad-faq-tabs" role="tablist" aria-label="Filter FAQ by topic">
              {categories.map((category) => {
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
              <strong>
                {isBusiness
                  ? "Ready to scope training for your team?"
                  : "Not sure which course fits your goals?"}
              </strong>
              <p>
                {isBusiness
                  ? "Generate a formal Net-30 seat quote immediately or request a private cohort consultation with our solutions leads."
                  : "Calculate your local installment plan in seconds or speak directly with our admissions advisors."}
              </p>
              <div className="acad-faq-callout-actions">
                <Link
                  href={isBusiness ? "/academy/tuition?mode=corporate" : "/academy/tuition"}
                  className="btn btn-navy btn-sm"
                >
                  <span>
                    {isBusiness ? "Seat Quote Calculator" : "Tuition & Installments"}
                  </span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <Link
                  href={isBusiness ? "#request-demo" : "/contact#inquiry"}
                  className="btn btn-outline btn-sm"
                >
                  {isBusiness ? "Book Scoping Call" : "Contact Admissions"}
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
