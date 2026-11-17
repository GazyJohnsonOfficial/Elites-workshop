"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BarChart3, Layers, ReceiptText } from "lucide-react";

const SECTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TEAM_ADVANTAGES = [
  {
    icon: Layers,
    title: "Tailored or Shared Team Cohorts",
    desc: "Align training directly with your live cloud, analytics, and security workflows.",
  },
  {
    icon: ReceiptText,
    title: "Volume Pricing & Net-30 Invoicing",
    desc: "Automatic 10% to 22% multi-seat savings on 5+ seats with streamlined procurement.",
  },
  {
    icon: BarChart3,
    title: "Shared Manager Visibility",
    desc: "Follow cohort attendance, lab milestones, and verified credentials in one portal.",
  },
] as const;

export function CorporateEnablementCtaSection() {
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
              Equip your organization with instructor-led cohorts aligned to your real cloud, data, and security workflows. Enroll 5 or more team members with automatic volume pricing, Net-30 corporate invoicing, and shared progress visibility for engineering leads.
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
