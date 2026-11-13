"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "./Sprite";
import { SITE_CONFIG } from "@/lib/config";

const TOOL_DATA: Record<
  string,
  {
    name: string;
    weeks: string;
    title: string;
    badge: string;
    desc: string;
    output: string;
  }
> = {
  sql: {
    name: "SQL",
    weeks: "Weeks 3 to 4",
    title: "Relational Database Querying & Analytical Joins",
    badge: "6 Live Sessions",
    desc: "Write production-grade queries, CTEs, window functions, and multi-table joins to extract and structure enterprise datasets for reporting.",
    output: "Revenue & Customer Cohort Retention SQL Pipeline",
  },
  python: {
    name: "Python",
    weeks: "Weeks 5 to 7",
    title: "Python for Data Cleaning, EDA & Automation",
    badge: "9 Live Sessions",
    desc: "Use Pandas, NumPy, and visualization libraries to clean messy records, automate recurring analysis scripts, and uncover statistical trends.",
    output: "Automated Python ETL & Exploratory Analysis Notebook",
  },
  excel: {
    name: "Excel & VBA",
    weeks: "Weeks 1 to 2",
    title: "Advanced Excel Modelling, Pivot Tables & VBA Macros",
    badge: "6 Live Sessions",
    desc: "Master dynamic lookup functions, financial and operational modelling, Power Query transformations, and time-saving VBA macro automation.",
    output: "Executive KPI Tracker & Automated VBA Reporting Workbook",
  },
  alteryx: {
    name: "Alteryx",
    weeks: "Weeks 8 to 9",
    title: "Self-Service ETL Workflows & Data Blending in Alteryx",
    badge: "6 Live Sessions",
    desc: "Design repeatable, no-code/low-code data preparation workflows that blend spreadsheets, SQL databases, and API feeds without manual rework.",
    output: "Multi-Source Enterprise Data Blending Workflow",
  },
  tableau: {
    name: "Tableau",
    weeks: "Weeks 10 to 11",
    title: "Interactive Visual Storytelling with Tableau",
    badge: "6 Live Sessions",
    desc: "Build interactive executive scorecards, calculated fields, geospatial maps, and drill-down visual stories that drive leadership decisions.",
    output: "Interactive Regional Sales & Operations Tableau Scorecard",
  },
  powerbi: {
    name: "Power BI",
    weeks: "Week 12 & Capstone",
    title: "Enterprise Power BI Data Modelling, DAX & Capstone",
    badge: "3 Live Sessions + Defense",
    desc: "Create star-schema data models, write advanced DAX measures, and publish your end-to-end production dashboard for mentor evaluation.",
    output: "Full-Stack Executive BI Capstone Dashboard & Certificate",
  },
};

export function ProgrammeExplorer() {
  const [activeTool, setActiveTool] = useState<string>("sql");
  const [activeCurrency, setActiveCurrency] = useState<"USD" | "GHS" | "GBP">("USD");
  const [timeLeft, setTimeLeft] = useState({
    days: "180",
    hours: "00",
    mins: "00",
    secs: "00",
  });

  const tools = Object.keys(TOOL_DATA);
  const current = TOOL_DATA[activeTool];

  // Auto-rotate tool preview every 5 seconds unless user interacted
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTool((prev) => {
        const nextIdx = (tools.indexOf(prev) + 1) % tools.length;
        return tools[nextIdx];
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [tools]);

  // Cohort Countdown
  useEffect(() => {
    const target = new Date(SITE_CONFIG.PROGRAMME.START_DATE_ISO).getTime();
    const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

    const updateTimer = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      const sec = Math.floor(diff / 1000);
      setTimeLeft({
        days: pad(Math.floor(sec / 86400)),
        hours: pad(Math.floor((sec % 86400) / 3600)),
        mins: pad(Math.floor((sec % 3600) / 60)),
        secs: pad(sec % 60),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTuitionDisplay = () => {
    const payment = SITE_CONFIG.PAYMENT;
    const curr = payment.CURRENCIES[activeCurrency];
    const full = curr.SYMBOL + Math.round(payment.TUITION_FULL_USD * curr.RATE).toLocaleString("en-US");
    const half = curr.SYMBOL + Math.round(payment.TUITION_DEPOSIT_USD * curr.RATE).toLocaleString("en-US");
    return `Pay ${full} in full or 2 instalments of ${half}`;
  };

  return (
    <section className="section hp-programme-sec" id="programme">
      <div className="container">
        <div className="hp-programme-box reveal">
          <div className="hp-programme-content">
            <div className="hp-programme-top">
              <span className="hp-prog-eyebrow">Elites Tech Academy</span>
              <span className="hp-programme-date">
                Next Cohort Starts <span>{SITE_CONFIG.PROGRAMME.START_DATE_TEXT}</span>
              </span>
            </div>

            <h2>12-Week Live Data Analysis &amp; Business Intelligence Programme</h2>
            <p>
              Build job-ready analytics skills from the ground up in 12 weeks. Taught live on Zoom by
              experienced industry practitioners across 36 interactive sessions focused on practical
              business datasets and portfolio projects.
            </p>

            {/* Interactive Curriculum Tool Explorer */}
            <div className="hp-tool-explorer" aria-label="Interactive curriculum explorer">
              <div className="hp-tool-header">
                <span className="hp-tool-Instruction">Select a tool to preview curriculum modules:</span>
                <span className="hp-tool-weeks">{current.weeks}</span>
              </div>
              <div className="hp-skill-pills" role="tablist" aria-label="Curriculum tools">
                {tools.map((tKey) => (
                  <button
                    key={tKey}
                    type="button"
                    className={`hp-tool-tab ${activeTool === tKey ? "active" : ""}`}
                    role="tab"
                    aria-selected={activeTool === tKey}
                    onClick={() => setActiveTool(tKey)}
                  >
                    {TOOL_DATA[tKey].name}
                  </button>
                ))}
              </div>
              <div className="hp-tool-panel" role="tabpanel" aria-live="polite">
                <div className="hp-tool-panel-top">
                  <strong>{current.title}</strong>
                  <span className="hp-tool-badge">{current.badge}</span>
                </div>
                <p>{current.desc}</p>
                <div className="hp-tool-project">
                  <span>Portfolio Project:</span>
                  <strong>{current.output}</strong>
                </div>
              </div>
            </div>

            <div className="ahero-actions">
              <Link href="/data-analysis#register" className="btn btn-gold">
                Apply for the Next Cohort <Icon id="i-arrow-right" />
              </Link>
              <Link href="/data-analysis" className="btn btn-ghost">
                View Full Syllabus
              </Link>
              <Link href="/tuition" className="hp-prog-link">
                Tuition &amp; payment options <Icon id="i-arrow-right" />
              </Link>
            </div>
          </div>

          <aside className="hp-programme-aside" aria-label="Programme overview and live countdown">
            <div className="hp-aside-head">
              <h3>Programme Highlights</h3>
            </div>

            {/* Live Cohort Countdown */}
            <div className="hp-countdown-box" aria-label="Countdown to cohort start">
              <span className="hp-cd-label">Cohort Begins In</span>
              <div className="hp-cd-grid">
                <div className="hp-cd-cell">
                  <strong>{timeLeft.days}</strong>
                  <span>Days</span>
                </div>
                <div className="hp-cd-cell">
                  <strong>{timeLeft.hours}</strong>
                  <span>Hours</span>
                </div>
                <div className="hp-cd-cell">
                  <strong>{timeLeft.mins}</strong>
                  <span>Mins</span>
                </div>
                <div className="hp-cd-cell">
                  <strong>{timeLeft.secs}</strong>
                  <span>Secs</span>
                </div>
              </div>
            </div>

            <ul className="hp-programme-highlights">
              <li>
                <strong>Start Date</strong>
                <span>{SITE_CONFIG.PROGRAMME.START_DATE_TEXT} (Enrollment Open)</span>
              </li>
              <li>
                <strong>Live Schedule</strong>
                <span>12 Weeks, 36 Live Sessions on Zoom (3 hours per week)</span>
              </li>
              <li>
                <strong>Practical Outcome</strong>
                <span>Capstone Dashboard Portfolio and Certificate of Completion</span>
              </li>
              <li className="hp-tuition-item">
                <div className="hp-tuition-top">
                  <strong>Flexible Tuition</strong>
                  <div className="hp-curr-switch" role="group" aria-label="Select currency">
                    <button
                      type="button"
                      className={`hp-curr-btn ${activeCurrency === "USD" ? "active" : ""}`}
                      onClick={() => setActiveCurrency("USD")}
                    >
                      USD
                    </button>
                    <button
                      type="button"
                      className={`hp-curr-btn ${activeCurrency === "GHS" ? "active" : ""}`}
                      onClick={() => setActiveCurrency("GHS")}
                    >
                      GHS
                    </button>
                    <button
                      type="button"
                      className={`hp-curr-btn ${activeCurrency === "GBP" ? "active" : ""}`}
                      onClick={() => setActiveCurrency("GBP")}
                    >
                      GBP
                    </button>
                  </div>
                </div>
                <span>{getTuitionDisplay()}</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

