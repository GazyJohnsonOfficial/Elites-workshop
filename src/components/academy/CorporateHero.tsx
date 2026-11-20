"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { AcademyCategory } from "@/lib/academyStore";
import { BRAND_LOGOS, MeshGradient, PixelCanvas } from "./AcademyHero";

const BIZ_QUICK_FILTERS: Array<{
  label: string;
  category?: AcademyCategory;
  mode?: "Corporate Bootcamp";
}> = [
  { label: "+Corporate Bootcamps", mode: "Corporate Bootcamp" },
  { label: "+Cloud & DevOps", category: "Cloud & DevOps" },
  { label: "+Data & BI", category: "Data & BI" },
  { label: "+Cybersecurity", category: "Cybersecurity" },
  { label: "+Python & AI", category: "Data & Automation" },
];

export interface CorporateHeroProps {
  courseCount: number;
  bootcampCount: number;
  onSelectFilter?: (opts: {
    category?: AcademyCategory;
    mode?: "Corporate Bootcamp";
  }) => void;
}

export function CorporateHero({
  courseCount,
  bootcampCount,
  onSelectFilter,
}: CorporateHeroProps) {
  const pixelColors = useMemo(
    () => [
      "rgba(76, 155, 255, 0.28)",
      "rgba(245, 184, 46, 0.28)",
      "rgba(147, 197, 253, 0.16)",
      "rgba(45, 79, 214, 0.24)",
    ],
    []
  );

  const handleQuickFilter = (filter: {
    category?: AcademyCategory;
    mode?: "Corporate Bootcamp";
  }) => {
    if (onSelectFilter) {
      onSelectFilter(filter);
    } else {
      document
        .getElementById("corporate-catalog")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      className="acad-biz-hero2"
      aria-labelledby="acad-biz-hero2-title"
    >
      <PixelCanvas colors={pixelColors} gap={13} speed={22} />
      <div className="acad-biz-hero2-vignette" aria-hidden="true" />

      <div className="container">
        <div className="acad-biz-hero2-stage">
          {/* ============ LEFT EDITORIAL ENTERPRISE COLUMN ============ */}
          <motion.div
            className="acad-biz-hero2-left"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="acad-biz-hero2-kicker">
              <Building2 size={14} aria-hidden="true" />
              <span>For Businesses &amp; Engineering Teams</span>
            </div>

            <h1 id="acad-biz-hero2-title" className="acad-biz-hero2-title">
              <span className="acad-biz-hero2-title-line">UPSKILL YOUR</span>
              <span className="acad-biz-hero2-title-line acad-biz-hero2-title-inline">
                <span>CLOUD</span>
                <span className="acad-biz-hero2-accent">&amp; DATA</span>
              </span>
              <span className="acad-biz-hero2-title-line">TEAMS AT SCALE.</span>
            </h1>

            <p className="acad-biz-hero2-lead">
              Dedicated corporate bootcamps, shared cohort seats, and departmental
              engineering pathways aligned to your live AWS, Azure, Power BI, and
              zero-trust security stack. Provision 5 to 250+ seats with Net-30 PO
              billing and real-time manager telemetry.
            </p>

            <div className="acad-biz-hero2-actions">
              <Link
                href="/academy/tuition?mode=corporate"
                className="acad-biz-hero2-btn-gold"
              >
                <span>Configure Team Seat Quote</span>
                <span className="acad-biz-hero2-btn-arrow" aria-hidden="true">
                  <ArrowRight size={15} />
                </span>
              </Link>
              <a
                href="#corporate-catalog"
                className="acad-biz-hero2-btn-outline"
              >
                <span>Explore Business Programs</span>
              </a>
              <a
                href="#request-demo"
                className="acad-biz-hero2-text-link"
              >
                <span>Book Scoping Call</span>
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>

            <div
              className="acad-biz-hero2-metrics"
              aria-label="Enterprise program highlights"
            >
              <div className="acad-biz-hero2-metric">
                <strong className="acad-nums">5 to 250+</strong>
                <span>Shared or Private Team Seats</span>
              </div>
              <div className="acad-biz-hero2-metric-div" aria-hidden="true" />
              <div className="acad-biz-hero2-metric">
                <strong className="acad-nums">Net-30 PO</strong>
                <span>USD · GBP · GHS Billing</span>
              </div>
              <div className="acad-biz-hero2-metric-div" aria-hidden="true" />
              <div className="acad-biz-hero2-metric">
                <strong className="acad-nums">Live CSV</strong>
                <span>Manager Telemetry &amp; Badges</span>
              </div>
            </div>
          </motion.div>

          {/* ============ RIGHT ARCHITECTURAL VISUAL & INTERACTIVE STAGE ============ */}
          <motion.div
            className="acad-biz-hero2-right"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="acad-biz-hero2-visual-top">
              <div
                className="acad-biz-hero2-fin acad-biz-hero2-fin-steel"
                aria-hidden="true"
              />
              <div
                className="acad-biz-hero2-fin acad-biz-hero2-fin-gold"
                aria-hidden="true"
              />

              <div className="acad-biz-hero2-frame">
                <MeshGradient
                  color1="#2d4fd6"
                  color2="#0f2557"
                  color3="#06112d"
                  color4="#f5b82e"
                  speed={0.9}
                  swirl={0.55}
                  scale={1.4}
                  rotation={110}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/academy/blog-finops-teams.jpg"
                  alt="Engineering leaders and technical teams collaborating on cloud and analytics roadmaps"
                  width={640}
                  height={440}
                  className="acad-biz-hero2-img"
                />
                <div className="acad-biz-hero2-scrim" aria-hidden="true" />
              </div>

              {/* Floating Enterprise Proof Badges */}
              <div className="acad-biz-hero2-check-stack">
                <div className="acad-biz-hero2-check-pill">
                  <CheckCircle2 size={14} />
                  <span>Private Cohorts (15+ Seats)</span>
                </div>
                <div className="acad-biz-hero2-check-pill">
                  <ShieldCheck size={14} />
                  <span>Seat Reassignment &amp; SSO Ready</span>
                </div>
              </div>

              {/* Floating Gold Accent Counter Card */}
              <div className="acad-biz-hero2-gold-card">
                <strong className="acad-nums">
                  {String(courseCount).padStart(2, "0")}
                </strong>
                <span>
                  Team Tracks · {bootcampCount} Exclusive Bootcamps
                </span>
              </div>

              {/* Floating Interactive Department Filter Card */}
              <div className="acad-biz-hero2-skills-card">
                <div className="acad-biz-hero2-skills-head">
                  <Award size={14} />
                  <span>Filter Business Tracks</span>
                </div>
                <div className="acad-biz-hero2-skills-list">
                  {BIZ_QUICK_FILTERS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleQuickFilter(item)}
                      className="acad-biz-hero2-skill-chip"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Manager Telemetry Cockpit Card */}
            <div className="acad-biz-hero2-telemetry">
              <div className="acad-biz-hero2-telemetry-copy">
                <div className="acad-biz-hero2-telemetry-kicker">
                  <span>Enterprise Enablement Portal</span>
                </div>
                <div className="acad-biz-hero2-telemetry-title">
                  Track cohort completion, quiz scores &amp; Open Badges v2 across every department
                </div>
              </div>

              <div className="acad-biz-hero2-bars" aria-hidden="true">
                <div className="acad-hero2-bar-col">
                  <div className="acad-hero2-bar acad-hero2-bar-1" />
                  <span>Seats</span>
                </div>
                <div className="acad-hero2-bar-col">
                  <div className="acad-hero2-bar acad-hero2-bar-2" />
                  <span>Labs</span>
                </div>
                <div className="acad-hero2-bar-col">
                  <div className="acad-hero2-bar acad-hero2-bar-3" />
                  <span>Verified</span>
                </div>
              </div>

              <div className="acad-hero2-telemetry-badge" aria-hidden="true">
                <TrendingUp size={16} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============ BOTTOM DARK VECTOR TOOLCHAIN MARQUEE ============ */}
        <div className="acad-biz-hero2-marquee-row">
          <div className="acad-biz-hero2-marquee-label">
            <span>Enterprise Toolchains &amp; Cloud Ecosystems</span>
          </div>

          <div className="acad-hero2-marquee-viewport">
            <div className="acad-hero2-marquee-track">
              <div className="acad-hero2-marquee-group">
                {BRAND_LOGOS.map((item) => (
                  <div
                    key={item.name}
                    className="acad-hero2-marquee-slot acad-biz-marquee-slot"
                  >
                    {item.render()}
                  </div>
                ))}
              </div>
              <div className="acad-hero2-marquee-group" aria-hidden="true">
                {BRAND_LOGOS.map((item) => (
                  <div
                    key={`biz-dup-${item.name}`}
                    className="acad-hero2-marquee-slot acad-biz-marquee-slot"
                  >
                    {item.render()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
