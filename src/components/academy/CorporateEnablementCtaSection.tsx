"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BarChart3, Building2, Layers, ReceiptText } from "lucide-react";

const SECTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TEAM_ADVANTAGES = [
  {
    icon: Layers,
    title: "Tailored or Shared Team Cohorts",
    desc: "Align training directly with your live cloud, analytics, and security workflows.",
  },
  {
    icon: ReceiptText,
    title: "Unified Billing & Net-30 Invoicing",
    desc: "Streamlined multi-seat invoicing for 5+ learners with Net-30 Purchase Order procurement.",
  },
  {
    icon: BarChart3,
    title: "Shared Manager Visibility",
    desc: "Follow cohort attendance, lab milestones, and verified credentials in one portal.",
  },
] as const;

export function CorporateEnablementCtaSection({
  compact = false,
}: {
  compact?: boolean;
}) {
  if (compact) {
    return (
      <section
        className="acad-biz-crosslink-band"
        aria-labelledby="acad-biz-crosslink-heading"
      >
        <div className="container">
          <div className="acad-biz-crosslink-card">
            <div className="acad-biz-crosslink-copy">
              <div className="acad-biz-crosslink-icon" aria-hidden="true">
                <Building2 size={20} />
              </div>
              <div>
                <h2 id="acad-biz-crosslink-heading">
                  Training a team of 5 or more?
                </h2>
                <p>
                  Explore corporate bootcamps, multi-seat team cohorts, Net-30 PO billing, and engineering lead telemetry in our dedicated Business Hub.
                </p>
              </div>
            </div>
            <div className="acad-biz-crosslink-actions">
              <Link href="/academy/corporate" className="btn btn-gold btn-sm">
                <span>Explore For Businesses</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link
                href="/academy/tuition?mode=corporate"
                className="btn btn-outline-light btn-sm"
              >
                <span>Estimate Team Seats</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="acad-corp-cta-band"
      aria-labelledby="acad-corp-cta-heading"
    >
      <div className="acad-corp-cta-grid-bg" aria-hidden="true" />
      <div className="acad-corp-cta-glow acad-corp-cta-glow-a" aria-hidden="true" />
      <div className="acad-corp-cta-glow acad-corp-cta-glow-b" aria-hidden="true" />

      <div className="container">
        <div className="acad-corp-cta-inner">
          <motion.div
            className="acad-corp-cta-copy"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.52, ease: SECTION_EASE }}
          >
            <span className="acad-corp-cta-kicker">
              For Businesses &amp; Engineering Teams
            </span>
            <h2 id="acad-corp-cta-heading">
              Practical Technical Training Built for Growing Teams
            </h2>
            <p>
              Equip your organization with instructor-led cohorts aligned to your real cloud, data, and security workflows. Enroll 5 or more team members with centralized seat provisioning, Net-30 corporate invoicing, and shared progress visibility for engineering leads.
            </p>

            <motion.div
              className="acad-corp-cta-actions"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.48, delay: 0.08, ease: SECTION_EASE }}
            >
              <Link
                href="/academy/tuition?mode=corporate"
                className="btn btn-gold"
              >
                <span>Plan a Team Cohort</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/academy/corporate"
                className="btn btn-outline-light"
              >
                <span>Explore Corporate Portal</span>
              </Link>
            </motion.div>
          </motion.div>

          <div className="acad-corp-cta-pillars">
            {TEAM_ADVANTAGES.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.title}
                  className="acad-corp-cta-pillar"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.48,
                    delay: 0.1 + idx * 0.08,
                    ease: SECTION_EASE,
                  }}
                >
                  <div className="acad-corp-cta-pillar-icon" aria-hidden="true">
                    <IconComp size={18} />
                  </div>
                  <div className="acad-corp-cta-pillar-text">
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
