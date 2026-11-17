"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BookOpen, CheckCircle2, X } from "lucide-react";

export interface AcademyBlogBrief {
  id: string;
  category: string;
  publishedLabel: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  courseTitle: string;
  courseSlug: string;
  industryContext: string[];
  standoutAdvantage: string;
  keyTakeaways: readonly string[];
}

const SECTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const ACADEMY_BLOG_BRIEFS: readonly AcademyBlogBrief[] = [
  {
    id: "blog-k8s-ai-dra",
    category: "Cloud Native & SRE",
    publishedLabel: "November 2026",
    readTime: "4 min read",
    title: "Kubernetes AI Workloads & Resource Allocation Shift Day-2 Ops",
    excerpt:
      "As teams standardize AI microservices and inference on Kubernetes, Dynamic Resource Allocation and strict SLO error budgets separate resilient platforms from runaway bills.",
    image: "/academy/blog-k8s-ai.jpg",
    imageAlt: "High-density network patch panels and cluster fiber interconnects",
    courseTitle: "Kubernetes & Production SRE Foundations",
    courseSlug: "kubernetes-sre-foundations",
    industryContext: [
      "Across recent CNCF ecosystem updates, Kubernetes has moved well beyond basic stateless web containers. Production clusters now schedule heterogeneous compute, multi-tenant inference workloads, and strict workload isolation using Dynamic Resource Allocation (DRA) and fine-grained PodDisruptionBudgets.",
      "Because Day-2 failures rarely happen in single-pod tutorials, organizations scrutinizing cloud ROI are prioritizing engineers who can diagnose cascading node exhaustion, lock down east-west pod networking, and tie Prometheus burn-rate alerts directly to customer reliability targets.",
    ],
    standoutAdvantage:
      "Instead of clicking through synthetic simulators, learners harden multi-namespace clusters against simulated node loss and resolve three live broken-cluster tabletop scenarios before finishing.",
    keyTakeaways: [
      "Hands-on fault isolation using NetworkPolicies and resource quotas",
      "Actionable SLO burn-rate alerting in Prometheus and Grafana",
      "Realistic incident drills structured like enterprise SRE on-call reviews",
    ],
  },
  {
    id: "blog-iac-platform-drift",
    category: "DevOps & Platform Engineering",
    publishedLabel: "November 2026",
    readTime: "5 min read",
    title: "Why State Drift & Platform Scale Demand Modular Infrastructure Code",
    excerpt:
      "AI-assisted commits accelerate cloud changes, making remote state locking, composable Terraform modules, and GitOps review gates critical for zero-downtime teams.",
    image: "/academy/blog-iac-platform.jpg",
    imageAlt: "Dual workstation displays showing modular codebase and system docs",
    courseTitle: "Cloud Systems Architecture & DevOps Automation",
    courseSlug: "cloud-devops-automation",
    industryContext: [
      "Platform engineering teams building Internal Developer Platforms increasingly rely on declarative control planes alongside Terraform and OpenTofu workflows. As code generation speeds up pull requests, unmanaged manual console edits and state drift become the top reliability risk during cutovers.",
      "Modern infrastructure roles require mastering why state backends lock, how multi-AZ VPC topologies isolate blast radius, and how OIDC-authenticated CI/CD runners replace brittle long-lived deployment keys.",
    ],
    standoutAdvantage:
      "Every cohort builds staging and production landing zones from one parameterized Terraform codebase with encrypted remote state locking, Docker multi-stage builds, and architect code reviews.",
    keyTakeaways: [
      "Multi-AZ AWS and Azure networking designed from clean architectural specs",
      "Encrypted remote state locking eliminating team collision and drift",
      "OIDC-backed GitHub Actions pipelines with automated plan verification",
    ],
  },
  {
    id: "blog-devsecops-zero-trust",
    category: "Cybersecurity & Compliance",
    publishedLabel: "November 2026",
    readTime: "4 min read",
    title: "NIST CSF 2.0 & Automated DevSecOps End Static Cloud Credentials",
    excerpt:
      "With NIST CSF 2.0 elevating governance and supply-chain controls, engineering squads are replacing static keys with Vault leases, Trivy CI gates, and audit automation.",
    image: "/academy/blog-devsecops.jpg",
    imageAlt: "Encrypted telemetry streams and automated security policy terminal",
    courseTitle: "Cybersecurity Operations, Cloud Defense & Compliance",
    courseSlug: "cybersecurity-cloud-defense",
    industryContext: [
      "NIST Cybersecurity Framework 2.0 formalized Govern as a sixth core pillar alongside Identify, Protect, Detect, Respond, and Recover. Regulators and enterprise buyers now expect technical safeguards to be continuously enforced rather than checked annually in spreadsheets.",
      "Leading security operations teams embed container CVE blocking directly inside CI pull requests, replace static environment secrets with short-lived dynamic leases, and trace API activity across multi-account boundaries automatically.",
    ],
    standoutAdvantage:
      "Rather than memorizing compliance acronyms, participants remediate intentionally misconfigured multi-account IAM environments, configure live Trivy gates, and run a full breach containment simulation.",
    keyTakeaways: [
      "Zero-trust IAM policy audits eliminating static root and service keys",
      "Dynamic database secret rotation using HashiCorp Vault",
      "CloudTrail and GuardDuty forensics backed by incident containment playbooks",
    ],
  },
  {
    id: "blog-dbt-python-contracts",
    category: "Data Engineering",
    publishedLabel: "October 2026",
    readTime: "5 min read",
    title: "Tested dbt Warehouses & Schema Contracts Replace Fragile Scripts",
    excerpt:
      "Teams tired of silent dashboard breakages are pairing Python API contract validation with incremental dbt transformations packaged inside deterministic containers.",
    image: "/academy/blog-dbt-python.jpg",
    imageAlt: "Multi-monitor engineering IDE desk for Python ETL and pipeline code",
    courseTitle: "Enterprise Python, ETL & Analytics Automation",
    courseSlug: "python-data-engineering",
    industryContext: [
      "As analytics pipelines pull from dozens of SaaS APIs and event streams, ad-hoc cron scripts break silently whenever an upstream payload changes. Production data engineering now hinges on enforcing Pydantic schema validation at ingestion and unit testing staging-to-mart models in dbt.",
      "Organizations hiring analytics engineers specifically evaluate whether candidates can explain idempotent retries, warehouse grain uniqueness, and containerized scheduling rather than one-off notebook scripts.",
    ],
    standoutAdvantage:
      "Self-paced learners pair weekly architect office hours with real deliverables: building a type-safe Python extractor into PostgreSQL and delivering a 3-layer tested dbt project inside Docker.",
    keyTakeaways: [
      "Type-safe REST API pagination with structured retries and Pydantic validation",
      "Tested incremental dbt models enforcing uniqueness and referential integrity",
      "Repeatable Dockerized pipeline runs outputting automated health alerts",
    ],
  },
  {
    id: "blog-bi-semantic-modeling",
    category: "Business Intelligence",
    publishedLabel: "October 2026",
    readTime: "4 min read",
    title: "Why Star Schema Modeling & DAX Rigor Decide BI Tool Adoption",
    excerpt:
      "Even as BI platforms expand self-service copilot features, messy tables produce conflicting numbers unless analysts master SQL window functions and semantic layers.",
    image: "/academy/blog-bi-modeling.jpg",
    imageAlt: "Laptop showing interactive analytics metrics and semantic reporting views",
    courseTitle: "Data Analysis & Business Intelligence Engineering",
    courseSlug: "data-analysis-bi",
    industryContext: [
      "Business intelligence teams face an ongoing credibility gap when finance, sales, and operations pull contradictory KPI totals from unmodeled flat exports. AI-assisted reporting accelerates chart creation, yet magnifies modeling flaws when fact and dimension relationships are poorly designed.",
      "Practitioners who combine clean PostgreSQL window functions, reproducible Python cleaning, low-code Alteryx workflows, and disciplined Power BI DAX semantic modeling remain essential across growing enterprises.",
    ],
    standoutAdvantage:
      "Students progress from real messy 180k-row retail and SaaS schemas to an end-to-end executive dashboard portfolio defended live before practicing architects.",
    keyTakeaways: [
      "Relational SQL joins, CTEs, and rolling cohort retention window functions",
      "Automated Pandas cleanup paired with low-code Alteryx ETL blending",
      "Live capstone architecture review building employer-verifiable proof",
    ],
  },
  {
    id: "blog-finops-exec-literacy",
    category: "Executive & Team Enablement",
    publishedLabel: "October 2026",
    readTime: "4 min read",
    title: "Pairing Cloud FinOps Controls With Cross-Department Data Literacy",
    excerpt:
      "Growing enterprises curb wasted cloud spend and reporting lag when engineering, finance, and operations share governed KPI dictionaries and telemetry standards.",
    image: "/academy/blog-finops-teams.jpg",
    imageAlt: "Cross-functional engineering leadership session reviewing roadmap priorities",
    courseTitle: "Executive Data Literacy & Automated BI Bootcamp",
    courseSlug: "executive-data-literacy",
    industryContext: [
      "With cloud compute and warehouse consumption climbing across departments, FinOps and executive data governance are no longer back-office afterthoughts. Finance managers and engineering leads need one shared vocabulary linking technical resource usage to operational outcomes.",
      "Organizations that invest in structured internal capability consistently reduce external contractor lock-in while replacing manual spreadsheet packs with governed, self-refreshing KPI scorecards.",
    ],
    standoutAdvantage:
      "Designed specifically for corporate teams, this focused 4-week bootcamp takes real departmental monthly packs and turns them into unified KPI dictionaries and live Power BI decision rooms.",
    keyTakeaways: [
      "Cross-departmental metric standardization eliminating conflicting numbers",
      "Hands-on transition from manual workbook consolidation to automated refresh",
      "Direct applicability to corporate reporting cadences within 4 weeks",
    ],
  },
] as const;

export function AcademyInsightsBlogSection() {
  const [activePost, setActivePost] = useState<AcademyBlogBrief | null>(null);

  useEffect(() => {
    if (!activePost) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePost(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePost]);

  return (
    <section className="acad-section acad-blog-section" id="insights">
      <div className="container">
        <div className="acad-section-head">
          <div>
            <span className="acad-blog-kicker">Industry Briefs &amp; Curriculum Insights</span>
            <h2>Why Our Programs Stand Out</h2>
            <p>
              Six technical dispatches connecting real cloud, data, and security shifts directly to how our practitioner programs build job-ready engineering depth.
            </p>
          </div>
          <Link href="/academy/courses/data-analysis-bi" className="btn btn-outline btn-sm">
            <span>Inspect Flagship Syllabus</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="acad-blog-flex">
          {ACADEMY_BLOG_BRIEFS.map((post, idx) => (
            <motion.article
              key={post.id}
              className="acad-blog-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.45,
                delay: Math.min(idx * 0.06, 0.25),
                ease: SECTION_EASE,
              }}
            >
              <div className="acad-blog-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  width={640}
                  height={360}
                />
              </div>

              <div className="acad-blog-body">
                <div className="acad-blog-meta">
                  <span className="acad-blog-cat">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.publishedLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>

                <h3>{post.title}</h3>
                <p className="acad-blog-excerpt">{post.excerpt}</p>

                <div className="acad-blog-foot">
                  <div className="acad-blog-track-ref">
                    <span>Aligned Track:</span>{" "}
                    <Link href={`/academy/courses/${post.courseSlug}`}>
                      {post.courseTitle}
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePost(post)}
                    className="acad-blog-read-btn"
                  >
                    <span>Read Dispatch</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activePost && (
          <motion.div
            className="acad-blog-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="acad-blog-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setActivePost(null);
            }}
          >
            <motion.div
              className="acad-blog-modal"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: SECTION_EASE }}
            >
              <div className="acad-blog-modal-top">
                <div className="acad-blog-meta">
                  <span className="acad-blog-cat">{activePost.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activePost.publishedLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activePost.readTime}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePost(null)}
                  className="acad-blog-modal-close"
                  aria-label="Close article dispatch"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 id="acad-blog-modal-title" className="acad-blog-modal-title">
                {activePost.title}
              </h3>

              <div className="acad-blog-modal-prose">
                {activePost.industryContext.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="acad-blog-standout-box">
                <div className="acad-blog-standout-head">
                  <BookOpen size={16} aria-hidden="true" />
                  <strong>How Elites Tech Academy Prepares You Differently</strong>
                </div>
                <p>{activePost.standoutAdvantage}</p>
                <ul className="acad-blog-takeaways">
                  {activePost.keyTakeaways.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={15} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="acad-blog-modal-actions">
                <Link
                  href={`/academy/courses/${activePost.courseSlug}`}
                  className="btn btn-navy btn-sm"
                  onClick={() => setActivePost(null)}
                >
                  <span>View Program: {activePost.courseTitle}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setActivePost(null)}
                  className="btn btn-outline btn-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
