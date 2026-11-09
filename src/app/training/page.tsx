import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Technical Academy & Workforce Enablement | ${SITE_CONFIG.COMPANY}`,
  description:
    "Live, practical technical training for engineering teams, working professionals, and career switchers across Cloud Architecture, DevOps Automation, Data Analytics, and Cybersecurity.",
};

export default function TrainingPage() {
  const primaryPhone = SITE_CONFIG.CONTACT.PHONE_DISPLAY;
  const primaryPhoneE164 = SITE_CONFIG.CONTACT.PHONE_E164;
  const programme = SITE_CONFIG.PROGRAMME;

  const pathways = [
    {
      tier: "Path 01",
      icon: "i-building",
      title: "Enterprise Corporate Training",
      desc: "Tailored cohort enablement engineered around your organization's specific toolchains, security guidelines, and infrastructure roadmaps.",
      features: [
        "Custom curriculum scoped with your tech leads",
        "Private dedicated cohort with live architect instruction",
        "Direct alignment with production cloud roadmaps",
        "Comprehensive team progress and telemetry reports",
      ],
      actionText: "Request Corporate Proposal",
      actionHref: "/contact?service=training#enquiry",
      btnClass: "btn btn-navy btn-sm",
    },
    {
      tier: "Path 02",
      icon: "i-users",
      title: "Professional Live Cohorts",
      desc: "Structured multi-week programs for working professionals and career switchers looking to master production skills with live weekly accountability.",
      features: [
        "Interactive live online sessions via Zoom",
        "Hands-on exercises and real-world datasets",
        "Employer-ready capstone portfolio projects",
        "Verified certificate of technical completion",
      ],
      actionText: "View Live Cohorts",
      actionHref: "#programmes",
      btnClass: "btn btn-outline btn-sm",
    },
    {
      tier: "Path 03",
      icon: "i-compass",
      title: "1-on-1 Senior Mentorship",
      desc: "Personalized technical advisory with principal solutions architects for engineers targeting senior roles or career transitions.",
      features: [
        "Targeted skill gap and capability auditing",
        "System design and architecture interview preparation",
        "Cloud certification strategy and roadmap",
        "Direct code review and GitHub portfolio critique",
      ],
      actionText: "Book Advisory Session",
      actionHref: "/contact#enquiry",
      btnClass: "btn btn-outline btn-sm",
    },
  ];

  const tools = [
    { name: "SQL", icon: "i-db" },
    { name: "Python", icon: "i-code" },
    { name: "Excel & VBA", icon: "i-table" },
    { name: "Alteryx", icon: "i-workflow" },
    { name: "Tableau", icon: "i-chart" },
    { name: "Power BI", icon: "i-chart" },
  ];

  const methodology = [
    {
      icon: "i-terminal",
      title: "Live Production Labs",
      desc: "Students build in actual cloud consoles, terminals, and database environments. Zero canned sandboxes or multiple-choice simulations.",
    },
    {
      icon: "i-award",
      title: "Practicing Architect Mentorship",
      desc: "Every cohort is led by practicing solutions architects who design and deploy mission-critical systems in industry every day.",
    },
    {
      icon: "i-box",
      title: "Demonstrable Capstones",
      desc: "Graduates complete an end-to-end capstone deliverable that can be defended in technical interviews and showcased to stakeholders.",
    },
    {
      icon: "i-git-branch",
      title: "Rigorous Code & Query Reviews",
      desc: "Detailed personal feedback on query optimization, code modularity, pipeline safety, and visualization design hygiene.",
    },
  ];

  return (
    <main id="main">
      {/* ============ EXECUTIVE HERO ============ */}
      <section className="training-hero">
        <div className="container">
          <ol className="crumbs" aria-label="Breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Training</li>
          </ol>
          <div className="training-hero-header">
            <span className="training-hero-kicker">Technical Academy &amp; Workforce Enablement</span>
            <h1>Industry-Grade Technical Training Built for Production Excellence</h1>
            <p>
              Live, practical training programs designed by senior cloud architects. We bridge the critical skills
              gap through bespoke corporate upskilling, live professional cohorts, and rigorous 1-on-1 technical
              mentorship.
            </p>
          </div>

          {/* 4-Item Executive Metrics Strip */}
          <div className="training-metrics-strip">
            <div className="training-metric-card">
              <span className="training-metric-val">36+ Live Hours</span>
              <span className="training-metric-lbl">Direct Architect-Led Cohort Mentorship</span>
            </div>
            <div className="training-metric-card">
              <span className="training-metric-val">Production Labs</span>
              <span className="training-metric-lbl">Real-World Workloads, Not Toy Exercises</span>
            </div>
            <div className="training-metric-card">
              <span className="training-metric-val">100% Practical</span>
              <span className="training-metric-lbl">Active Toolchains: SQL, Python, AWS, Docker</span>
            </div>
            <div className="training-metric-card">
              <span className="training-metric-val">Demonstrable Portfolios</span>
              <span className="training-metric-lbl">Employer-Ready Capstone Artifacts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THREE LEARNING PATHWAYS ============ */}
      <section className="training-pathways-section" id="pathways">
        <div className="container">
          <div className="training-pathways-head">
            <div>
              <span className="training-section-kicker">Learning Pathways</span>
              <h2>Structured for Corporate Teams &amp; Career Professionals</h2>
            </div>
            <p>
              Whether upskilling an entire internal engineering unit or accelerating your personal career
              trajectory, our programs are grounded in modern production environments.
            </p>
          </div>

          <div className="training-pathways-grid">
            {pathways.map((path, i) => (
              <article key={i} className="training-pathway-card">
                <div className="training-pathway-header">
                  <div className="training-pathway-icon">
                    <Icon id={path.icon} />
                  </div>
                  <div>
                    <span className="training-pathway-tier">{path.tier}</span>
                    <h3>{path.title}</h3>
                  </div>
                </div>
                <p className="training-pathway-desc">{path.desc}</p>
                <ul className="training-pathway-features">
                  {path.features.map((feat, idx) => (
                    <li key={idx}>
                      <Icon id="i-check" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="training-pathway-action">
                  <Link href={path.actionHref} className={path.btnClass}>
                    <span>{path.actionText}</span>
                    <Icon id="i-arrow-right" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ACADEMY CURRICULA & FLAGSHIP COHORTS ============ */}
      <section className="training-programmes-section" id="programmes">
        <div className="container">
          <div className="training-programmes-head">
            <div>
              <span className="training-section-kicker">Curricula &amp; Cohorts</span>
              <h2>Featured Programs &amp; Engineering Labs</h2>
            </div>
            <p>
              Rigorous, cohort-based technical training connecting fundamental computer science with real-world
              enterprise workflows.
            </p>
          </div>

          <div className="training-programmes-grid">
            {/* Flagship: Data Analysis Programme */}
            <article className="training-flagship-card">
              <span className="training-card-kicker">Flagship Live Cohort</span>
              <h3>{programme.NAME}</h3>
              <p className="training-flagship-desc">
                From raw, unstructured datasets to executive-ready analytical intelligence in three months. Master
                SQL query optimization, Python data pipelines, automated ETL workflows, and interactive BI dashboards.
              </p>

              <div className="training-tools-row">
                {tools.map((t, idx) => (
                  <span key={idx} className="training-tool-pill">
                    <Icon id={t.icon} />
                    <span>{t.name}</span>
                  </span>
                ))}
              </div>

              <div className="training-facts-grid">
                <div className="training-fact-cell">
                  <span className="training-fact-label">Cohort Start</span>
                  <span className="training-fact-val">{programme.START_DATE_TEXT}</span>
                </div>
                <div className="training-fact-cell">
                  <span className="training-fact-label">Format</span>
                  <span className="training-fact-val">36 Live Zoom Sessions</span>
                </div>
                <div className="training-fact-cell">
                  <span className="training-fact-label">Tuition</span>
                  <span className="training-fact-val">{programme.TUITION}</span>
                </div>
              </div>

              <div className="training-flagship-actions">
                <Link href="/data-analysis#register" className="btn btn-navy btn-sm">
                  Register for Upcoming Cohort
                </Link>
                <Link href="/data-analysis" className="btn btn-outline btn-sm">
                  View Full Curriculum
                </Link>
                <Link href="/tuition" className="training-link-arrow">
                  <span>Tuition &amp; Payment Plans</span>
                  <Icon id="i-arrow-right" />
                </Link>
              </div>
            </article>

            {/* Secondary Curricula Stack */}
            <div className="training-secondary-stack">
              <article className="training-secondary-card">
                <span className="training-card-kicker">Enterprise &amp; Individual</span>
                <h4>Cloud Architecture &amp; DevOps Engineering</h4>
                <p>
                  Master immutable infrastructure, Docker containerization, Kubernetes cluster orchestration, and
                  automated CI/CD pipelines with Terraform and GitHub Actions.
                </p>
                <div className="training-secondary-footer">
                  <span className="training-secondary-meta">AWS · Kubernetes · Terraform · CI/CD</span>
                  <Link href="/contact?service=devops#enquiry" className="training-link-arrow">
                    <span>Inquire for Cohort</span>
                    <Icon id="i-arrow-right" />
                  </Link>
                </div>
              </article>

              <article className="training-secondary-card">
                <span className="training-card-kicker">Corporate &amp; Team</span>
                <h4>Cybersecurity Operations &amp; Cloud Governance</h4>
                <p>
                  Practical security fundamentals including zero-trust network segmentation, least-privilege IAM,
                  automated vulnerability scanning, and compliance audits for SOC 2 and HIPAA.
                </p>
                <div className="training-secondary-footer">
                  <span className="training-secondary-meta">Zero Trust · IAM · SOC 2 · CloudTrail</span>
                  <Link href="/contact?service=security#enquiry" className="training-link-arrow">
                    <span>Request Team Program</span>
                    <Icon id="i-arrow-right" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ACADEMY METHODOLOGY ============ */}
      <section className="training-methodology-section">
        <div className="container">
          <div className="training-methodology-head">
            <div>
              <span className="training-section-kicker">The Academy Methodology</span>
              <h2>Why Our Training Delivers Measurable Capability</h2>
            </div>
            <p>
              We reject passive video-watching. Every module is structured around active execution, direct code
              feedback, and demonstrable portfolio defense.
            </p>
          </div>

          <div className="training-methodology-grid">
            {methodology.map((m, i) => (
              <article key={i} className="training-method-card">
                <div className="training-method-icon">
                  <Icon id={m.icon} />
                </div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CORPORATE CONSULTATION CTA POD ============ */}
      <section className="training-cta-section">
        <div className="container">
          <div className="training-cta-box">
            <div className="training-cta-content">
              <span className="training-section-kicker">Corporate Enablement</span>
              <h2>Empower Your Engineering or Analytics Team</h2>
              <p>
                Looking to upskill your department or onboard new talent? We deliver tailored curricula aligned
                with your internal tools, security policies, and technical deliverables.
              </p>
            </div>
            <div className="training-cta-actions">
              <div className="training-cta-buttons">
                <Link href="/contact?service=training#enquiry" className="btn btn-navy btn-lg">
                  Request Corporate Proposal
                </Link>
                <a href={`tel:${primaryPhoneE164}`} className="btn btn-outline btn-lg">
                  <Icon id="i-phone" /> Call {primaryPhone}
                </a>
              </div>
              <div className="training-cta-sla">
                <Icon id="i-check" />
                <span>Guaranteed technical response within one business day</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
