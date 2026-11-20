"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Award,
  Compass,
  FolderGit2,
  Terminal,
} from "lucide-react";

const SECTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const LEARNING_STEPS = [
  {
    step: "01",
    icon: Compass,
    title: "Pick Your Career Track",
    desc: "Start with Beginner IT Support, Data Analysis, or Applied AI, or match a specialization to your next role.",
  },
  {
    step: "02",
    icon: Terminal,
    title: "Practice in Real Tooling",
    desc: "Configure real environments with guided runbooks and complete weekly hands-on labs in SQL, Linux, AWS, Python, or Power BI.",
  },
  {
    step: "03",
    icon: FolderGit2,
    title: "Build a Portfolio Capstone",
    desc: "Ship an applied project reviewed against practitioner rubrics so you graduate with tangible work to show hiring managers.",
  },
  {
    step: "04",
    icon: Award,
    title: "Publish Verified Credentials",
    desc: "Earn an Open Badges v2 certificate with a public verification code ready for LinkedIn and employer background checks.",
  },
] as const;

export function IndividualLearningFlowSection() {
  return (
    <section
      className="acad-section acad-flow-section"
      id="how-it-works"
      aria-labelledby="acad-flow-heading"
    >
      <div className="container">
        <div className="acad-section-head">
          <div>
            <span className="acad-cat-eyebrow">How Individual Learning Works</span>
            <h2 id="acad-flow-heading">From First Lesson to Verifiable Proof</h2>
            <p>
              Every course pairs structured instruction with applied technical deliverables, regional 2-part installments, and public credential verification.
            </p>
          </div>
          <Link href="/academy/get-started" className="btn btn-navy btn-sm">
            <span>Find My Starting Track</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="acad-flow-row">
          {LEARNING_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.step}
                className="acad-flow-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.06,
                  ease: SECTION_EASE,
                }}
              >
                <div className="acad-flow-card-top">
                  <div className="acad-flow-icon" aria-hidden="true">
                    <Icon size={20} />
                  </div>
                  <span className="acad-flow-num">{item.step}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
