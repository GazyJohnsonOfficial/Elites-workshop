"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "What payment methods and currency options are supported?",
    a: "We support tuition settlement in USD, GHS, and GBP. You can pay in full or choose our 2-monthly installment plan. Accepted channels include bank transfers, Mobile Money (MoMo), debit/credit cards, and Net-30 corporate purchase orders for enterprise sponsors.",
  },
  {
    q: "What are the computer hardware and software environment requirements?",
    a: "Students require a modern laptop (macOS, Windows 11 Pro/Enterprise, or Linux Ubuntu) with at least 16GB RAM and a stable internet connection. All required tooling (Docker, VS Code, Terraform, Python, or Power BI Desktop) is installed during Module 1 with guided setup runbooks.",
  },
  {
    q: "How are live cohort sessions and weekly schedules structured?",
    a: "Live practitioner sessions are held twice weekly (evening and Saturday morning slots) to accommodate working professionals across North America, Europe, and West Africa. All sessions are recorded and archived in the Learner Portal for asynchronous review.",
  },
  {
    q: "Are the graduate certificates employer-verifiable?",
    a: "Yes. Upon completing all modules and submitting your capstone deliverable, you receive a unique cryptographic credential code (e.g. ETS-CERT-9482AX) that employers can instantly verify publicly via our Credential Registry.",
  },
  {
    q: "How does corporate team enrollment and volume pricing work?",
    a: "Organizations enrolling 5 or more engineers unlock volume tier discounts of up to 22%, dedicated Net-30 PO invoicing, and real-time team completion telemetry inside the Corporate Portal.",
  },
];

export function AcademyCourseFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="acad-card" style={{ marginTop: "36px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--blue-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--blue)", flexShrink: 0 }}>
          <HelpCircle size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: "1.25rem", color: "var(--navy)", margin: 0 }}>Frequently Asked Questions</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "2px 0 0 0" }}>Common questions regarding enrollment, hardware requirements, and schedules.</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              style={{
                border: "1px solid #dce5f5",
                borderRadius: "10px",
                background: isOpen ? "#f8fafd" : "#ffffff",
                overflow: "hidden",
                transition: "background-color 0.2s ease",
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "none",
                  border: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "0.98rem",
                  color: "var(--navy)",
                }}
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    color: "var(--blue)",
                    flexShrink: 0,
                  }}
                />
              </button>
              {isOpen && (
                <div style={{ padding: "0 18px 18px 18px", fontSize: "0.91rem", color: "var(--muted)", lineHeight: 1.6, borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
