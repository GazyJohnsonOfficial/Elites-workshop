import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Technical Academy & Workforce Enablement | ${SITE_CONFIG.COMPANY}`,
  description:
    "Industry-grade technical training and corporate workforce enablement across Data Analytics, Cloud Architecture, DevOps Automation, and Cybersecurity Operations. Led by practicing solutions architects.",
};

interface ToolItem {
  name: string;
  icon: string;
}

interface PhaseModule {
  tag: string;
  title: string;
  desc: string;
}

interface CurriculumTrack {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  roles: string[];
  tools: ToolItem[];
  phases: PhaseModule[];
  facts: { label: string; val: string }[];
  primaryAction: { text: string; href: string; btnClass: string };
  secondaryAction?: { text: string; href: string; btnClass: string };
  tertiaryAction?: { text: string; href: string };
}

export default function TrainingPage() {
  const primaryPhone = SITE_CONFIG.CONTACT.PHONE_DISPLAY;
  const primaryPhoneE164 = SITE_CONFIG.CONTACT.PHONE_E164;
  const programme = SITE_CONFIG.PROGRAMME;

  const jumpLinks = [
    { href: "#pathways", label: "01 Learning Pathways" },
    { href: "#programmes", label: "02 Curricula & Cohorts" },
    { href: "#corporate", label: "03 Enterprise Enablement" },
    { href: "#mentorship", label: "04 Senior Mentorship" },
    { href: "#labs", label: "05 Production Labs" },
    { href: "#methodology", label: "06 Methodology" },
    { href: "#faq", label: "07 Academy FAQ" },
  ];

  const pathways = [
    {
      tier: "Path 01",
      icon: "i-building",
      title: "Enterprise Corporate Training",
      desc: "Tailored cohort enablement engineered around your organization's specific toolchains, security guidelines, and production cloud roadmaps.",
      features: [
        "Custom departmental curriculum scoped with your tech leads",
        "Private dedicated cohort with live architect instruction",
        "Direct alignment with production cloud roadmaps",
        "Comprehensive team progress and telemetry reports",
      ],
      actionText: "Explore Corporate Programs",
      actionHref: "#corporate",
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
      actionText: "View Featured Cohorts",
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
      actionText: "Explore Mentorship Tracks",
      actionHref: "#mentorship",
      btnClass: "btn btn-outline btn-sm",
    },
  ];

  const curriculaTracks: CurriculumTrack[] = [
    {
      id: "track-data",
      badge: "Flagship 12-Week Live Cohort",
      title: "Data Analysis & Business Intelligence Engineering",
      subtitle: "End-to-End Enterprise Analytics from SQL Extraction to Executive KPI Dashboards",
      desc: "From raw, unstructured relational schemas to automated analytical intelligence in 12 weeks. Master high-performance SQL querying, Python data wrangling, automated ETL pipelines, and interactive BI dashboards.",
      roles: ["Data Analyst", "BI Developer", "Analytics Engineer", "Financial Reporting Analyst"],
      tools: [
        { name: "SQL", icon: "i-db" },
        { name: "Python", icon: "i-code" },
        { name: "Power BI", icon: "i-chart" },
        { name: "Tableau", icon: "i-chart" },
        { name: "Excel & VBA", icon: "i-table" },
        { name: "Alteryx & ETL", icon: "i-workflow" },
      ],
      phases: [
        {
          tag: "Weeks 01-03",
          title: "Advanced SQL & Relational Architecture",
          desc: "Window functions, Common Table Expressions (CTEs), multi-table joins, subqueries, database indexing, and query execution plan optimization.",
        },
        {
          tag: "Weeks 04-06",
          title: "Python for Analytics & Data Cleansing",
          desc: "Pandas dataframes, NumPy vectorization, data normalization, regex text cleansing, automated API extraction, and robust ETL pipelines.",
        },
        {
          tag: "Weeks 07-09",
          title: "Enterprise BI Modeling & Dashboards",
          desc: "Star/snowflake data schemas, Power BI DAX measures, Tableau calculated fields, drill-down parameters, and executive visual UX storytelling.",
        },
        {
          tag: "Weeks 10-12",
          title: "Capstone Pipeline & Executive Defense",
          desc: "Complete end-to-end data pipeline from raw ingestion to interactive dashboard, defended live before senior analytics architects.",
        },
      ],
      facts: [
        { label: "Cohort Start", val: programme.START_DATE_TEXT },
        { label: "Live Contact", val: "36 Live Zoom Sessions" },
        { label: "Tuition", val: programme.TUITION },
      ],
      primaryAction: {
        text: "Register for Upcoming Cohort",
        href: "/data-analysis#register",
        btnClass: "btn btn-navy btn-sm",
      },
      secondaryAction: {
        text: "View Full 12-Week Syllabus",
        href: "/data-analysis",
        btnClass: "btn btn-outline btn-sm",
      },
      tertiaryAction: {
        text: "Tuition & Payment Plans",
        href: "/tuition",
      },
    },
    {
      id: "track-cloud",
      badge: "Enterprise & Individual Cohort",
      title: "Cloud Systems Architecture & DevOps Automation",
      subtitle: "Multi-Cloud Landing Zones, Immutable Terraform IaC, and Kubernetes Orchestration",
      desc: "Bridge software development and production operations. Master immutable cloud landing zones on AWS and Azure, automate deployments with Terraform, containerize microservices with Docker, and orchestrate resilient Kubernetes clusters.",
      roles: ["Cloud Solutions Architect", "DevOps Engineer", "Platform Engineer", "Site Reliability Engineer"],
      tools: [
        { name: "AWS & Azure", icon: "i-cloud" },
        { name: "Terraform IaC", icon: "i-code" },
        { name: "Docker", icon: "i-box" },
        { name: "Kubernetes", icon: "i-server" },
        { name: "GitHub Actions", icon: "i-git-branch" },
        { name: "Prometheus & Grafana", icon: "i-gauge" },
      ],
      phases: [
        {
          tag: "Weeks 01-03",
          title: "Cloud Networking & Linux Systems",
          desc: "VPC architecture, multi-tier subnets, route tables, least-privilege IAM policies, security groups, Linux CLI administration, and bash automation.",
        },
        {
          tag: "Weeks 04-06",
          title: "Infrastructure as Code with Terraform",
          desc: "State locking with remote backends, reusable modular architecture, multi-environment workspaces, automated plan testing, and drift detection.",
        },
        {
          tag: "Weeks 07-09",
          title: "Containers & Kubernetes Cluster Ops",
          desc: "Docker multi-stage builds, Pods, Deployments, Services, Ingress controllers, Helm chart packaging, and horizontal pod autoscaling.",
        },
        {
          tag: "Weeks 10-12",
          title: "Automated CI/CD Pipelines & Telemetry",
          desc: "GitHub Actions delivery pipelines, canary rollouts, Prometheus metric scraping, Grafana dashboards, and capstone cluster deployment.",
        },
      ],
      facts: [
        { label: "Delivery Mode", val: "Live Remote Cloud Consoles" },
        { label: "Prerequisite", val: "Fundamental Linux & Networking" },
        { label: "Deliverable", val: "Production Cluster Portfolio" },
      ],
      primaryAction: {
        text: "Inquire for Upcoming Cohort",
        href: "/contact?service=devops#enquiry",
        btnClass: "btn btn-navy btn-sm",
      },
      secondaryAction: {
        text: "Request Corporate Curriculum",
        href: "/contact?service=Corporate+%2F+Team+Training#enquiry",
        btnClass: "btn btn-outline btn-sm",
      },
    },
    {
      id: "track-security",
      badge: "Security Practitioner & Enterprise",
      title: "Cybersecurity Operations, Cloud Defense & Compliance",
      subtitle: "Zero Trust Architecture, Automated Vulnerability Scanning, and Regulatory Auditing",
      desc: "Defend cloud-native infrastructure against modern threats, configuration drift, and supply-chain vulnerabilities. Learn to implement Zero Trust IAM, run automated vulnerability scans, codify SOC 2 and HIPAA controls, and execute incident response runbooks.",
      roles: ["Cloud Security Analyst", "DevSecOps Specialist", "Cybersecurity Engineer", "Compliance & Risk Auditor"],
      tools: [
        { name: "Zero Trust IAM", icon: "i-key" },
        { name: "AWS CloudTrail", icon: "i-eye" },
        { name: "Amazon GuardDuty", icon: "i-shield" },
        { name: "HashiCorp Vault", icon: "i-lock" },
        { name: "Trivy Scanner", icon: "i-target" },
        { name: "SOC 2 & HIPAA", icon: "i-file" },
      ],
      phases: [
        {
          tag: "Weeks 01-03",
          title: "Zero Trust Identity & Cloud Access",
          desc: "Least-privilege IAM, role-based access control, federated SSO, multi-factor authentication, permission boundaries, and SCP guardrails.",
        },
        {
          tag: "Weeks 04-06",
          title: "Vulnerability Scanning & DevSecOps",
          desc: "Static code analysis, container image vulnerability scanning with Trivy, pipeline security gates, and automated secret rotation with Vault.",
        },
        {
          tag: "Weeks 07-09",
          title: "Cloud Compliance & Security Auditing",
          desc: "Codifying SOC 2 Type II, HIPAA, and ISO 27001 technical controls into policy-as-code, and continuous evaluation with AWS Config.",
        },
        {
          tag: "Weeks 10-12",
          title: "Incident Detection & Breach Response",
          desc: "Log analysis with CloudTrail and Athena, automated alerting with GuardDuty, table-top breach simulation, and forensic runbooks.",
        },
      ],
      facts: [
        { label: "Delivery Mode", val: "Live Threat Simulations" },
        { label: "Prerequisite", val: "Fundamental OS & Networking" },
        { label: "Deliverable", val: "Auditable Security Defense Pack" },
      ],
      primaryAction: {
        text: "Inquire for Security Cohort",
        href: "/contact?service=Cybersecurity+and+Protection#enquiry",
        btnClass: "btn btn-navy btn-sm",
      },
      secondaryAction: {
        text: "Request Corporate Security Training",
        href: "/contact?service=Corporate+%2F+Team+Training#enquiry",
        btnClass: "btn btn-outline btn-sm",
      },
    },
  ];

  const corporatePillars = [
    {
      icon: "i-sliders",
      title: "Custom Departmental Alignment",
      desc: "Curricula tailored directly to your organization's specific cloud provider, proprietary toolchains, internal naming conventions, and security guardrails.",
    },
    {
      icon: "i-shield",
      title: "Isolated Cloud Sandboxes",
      desc: "Every engineer receives a dedicated AWS or Azure sandbox account with automated spend caps and strict isolation from production customer data.",
    },
    {
      icon: "i-chart",
      title: "Executive Skill Telemetry",
      desc: "Real-time dashboards for engineering leadership tracking cohort attendance, weekly lab submissions, code quality scores, and skill progression.",
    },
    {
      icon: "i-clock",
      title: "Flexible Delivery Formats",
      desc: "Accelerated full-time bootcamps, part-time evening sprints, or hybrid executive workshops scheduled cleanly around your sprint releases.",
    },
  ];

  const mentorshipTracks = [
    {
      icon: "i-workflow",
      title: "Large-Scale System Design",
      desc: "Distributed caching, event streaming, data partitioning, failure modes, and CAP theorem trade-offs for L5/L6 staff engineering interviews.",
    },
    {
      icon: "i-award",
      title: "Cloud Certification Strategy",
      desc: "Targeted coaching for AWS Solutions Architect Professional, Certified Kubernetes Administrator (CKA), and Azure Solutions Architect Expert.",
    },
    {
      icon: "i-code",
      title: "Codebase & Infrastructure Review",
      desc: "Direct pull request critiques on your Terraform modules, Python pipelines, and Docker configs against enterprise production hygiene.",
    },
    {
      icon: "i-briefcase",
      title: "Technical Leadership & Communication",
      desc: "How to write and defend Architecture Decision Records (ADRs), present trade-offs to executive stakeholders, and lead engineering squads.",
    },
  ];

  const labFeatures = [
    {
      icon: "i-server",
      title: "Live Cloud Accounts",
      desc: "Students deploy real VPCs, IAM roles, EC2 instances, and managed database clusters in actual AWS and Azure management consoles.",
    },
    {
      icon: "i-db",
      title: "Enterprise-Scale Datasets",
      desc: "Analyze multi-million row datasets with missing values, corrupt formatting, and complex joins matching real corporate data chaos.",
    },
    {
      icon: "i-git-branch",
      title: "Pull Request Code Reviews",
      desc: "All homework and lab deliverables are submitted via Git pull requests and reviewed line-by-line by practicing solutions architects.",
    },
    {
      icon: "i-target",
      title: "Failure Mode Simulation",
      desc: "Troubleshoot broken production scenarios: split-brain clusters, misconfigured routing tables, failing CI/CD runners, and memory leaks.",
    },
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

  const faqs = [
    {
      q: "Are the cohort sessions live or pre-recorded?",
      a: "All sessions are 100% live and interactive, led via Zoom by senior practicing solutions architects. Every session includes dedicated live Q&A, active terminal walkthroughs, and lab coaching. Full HD session recordings, slides, and code repositories are uploaded within two hours for ongoing review.",
    },
    {
      q: "What are the computer and software prerequisites?",
      a: "You need a laptop or desktop computer running Windows 10/11, macOS, or modern Linux with at least 8GB of RAM and stable high-speed broadband. All software tools used (such as VS Code, PostgreSQL, Python, Git, and Docker) are open source or have free practitioner tiers.",
    },
    {
      q: "How does the capstone project work?",
      a: "Rather than isolated toy exercises, you build an end-to-end production-grade deliverable hosted in your personal GitHub repository. At the end of the cohort, you present and defend your architecture, schema decisions, and trade-offs live before practicing architects.",
    },
    {
      q: "Can my employer sponsor my tuition or corporate training?",
      a: "Yes. Many of our students are sponsored through corporate learning and development budgets. We provide formal itemized invoices, employer reimbursement support documentation, and corporate payment receipts to simplify your company's expense processing.",
    },
    {
      q: "What happens if I miss a scheduled live session?",
      a: "All live sessions are recorded in high-definition and posted to our secure student portal along with that session's lab scripts, lecture notes, and homework assignments. You can also bring questions to scheduled weekly instructor office hours.",
    },
    {
      q: "How do corporate group enrollments work?",
      a: "For corporate engineering teams of 5 or more, we provide private dedicated cohorts, customized departmental curricula mapped to your specific tech stack, executive attendance telemetry, and flexible billing via Net-30 purchase orders.",
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
            <h1>Enterprise-Grade Technical Training Built for Production Systems</h1>
            <p>
              Live, practical training programs designed and delivered by practicing cloud architects. We bridge
              critical technical skills gaps through bespoke corporate workforce enablement, live professional cohorts,
              and rigorous 1-on-1 engineering mentorship.
            </p>
          </div>

          {/* 4-Item Executive Metrics Strip */}
          <div className="training-metrics-strip">
            <div className="training-metric-card">
              <span className="training-metric-val">36+ Live Hours</span>
              <span className="training-metric-lbl">Direct Architect-Led Cohort Mentorship</span>
            </div>
            <div className="training-metric-card">
              <span className="training-metric-val">100% Production</span>
              <span className="training-metric-lbl">Real AWS/Azure Consoles, Terraform &amp; SQL</span>
            </div>
            <div className="training-metric-card">
              <span className="training-metric-val">Zero Toy Data</span>
              <span className="training-metric-lbl">Multi-Million Row Real Enterprise Schemas</span>
            </div>
            <div className="training-metric-card">
              <span className="training-metric-val">Verifiable Capstones</span>
              <span className="training-metric-lbl">Defensible GitHub Portfolios for Employers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STICKY JUMP NAVIGATION BAR ============ */}
      <nav className="svc-jump-bar" aria-label="Training Navigation">
        <div className="container">
          <div className="svc-jump-scroller">
            {jumpLinks.map((link) => (
              <a key={link.href} href={link.href} className="svc-jump-link">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ============ SECTION 1: THREE LEARNING PATHWAYS ============ */}
      <section className="training-pathways-section" id="pathways">
        <div className="container">
          <div className="training-pathways-head">
            <div>
              <span className="training-section-kicker">Learning Pathways</span>
              <h2>Structured for Corporate Teams &amp; Career Professionals</h2>
            </div>
            <p>
              Whether upskilling an entire internal engineering department or accelerating your personal career
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
                  <a href={path.actionHref} className={path.btnClass}>
                    <span>{path.actionText}</span>
                    <Icon id="i-arrow-right" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 2: ACADEMY CURRICULA & COHORTS ============ */}
      <section className="training-programmes-section" id="programmes">
        <div className="container">
          <div className="training-programmes-head">
            <div>
              <span className="training-section-kicker">Curricula &amp; Cohorts</span>
              <h2>Comprehensive Engineering Tracks &amp; Live Cohorts</h2>
            </div>
            <p>
              Rigorous, cohort-based technical training connecting fundamental computer science with real-world
              enterprise workflows. Each program includes live architect lectures, hands-on production labs,
              and a defensible capstone deliverable.
            </p>
          </div>

          <div className="training-tracks-list">
            {curriculaTracks.map((track) => (
              <article key={track.id} id={track.id} className="training-track-card">
                <div className="training-track-top">
                  <div className="training-track-badge-row">
                    <span className="training-track-badge">{track.badge}</span>
                  </div>
                  <h3>{track.title}</h3>
                  <p className="training-track-subtitle">{track.subtitle}</p>
                  <p className="training-track-desc">{track.desc}</p>

                  <div className="training-roles-row">
                    <span className="training-roles-label">Target Career Roles:</span>
                    {track.roles.map((role, idx) => (
                      <span key={idx} className="training-role-pill">
                        {role}
                      </span>
                    ))}
                  </div>

                  <div className="training-tools-row">
                    {track.tools.map((t, idx) => (
                      <span key={idx} className="training-tool-pill">
                        <Icon id={t.icon} />
                        <span>{t.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4-Phase Curriculum Progression Grid */}
                <div className="training-phases-container">
                  <h4 className="training-phases-heading">12-Week Modular Curriculum Progression</h4>
                  <div className="training-phases-grid">
                    {track.phases.map((ph, idx) => (
                      <div key={idx} className="training-phase-card">
                        <span className="training-phase-tag">{ph.tag}</span>
                        <h4>{ph.title}</h4>
                        <p>{ph.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Track Footer Facts & Actions */}
                <div className="training-track-footer">
                  <div className="training-track-facts">
                    {track.facts.map((fact, idx) => (
                      <div key={idx} className="training-track-fact">
                        <span className="training-track-fact-label">{fact.label}</span>
                        <span className="training-track-fact-val">{fact.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="training-track-actions">
                    <Link href={track.primaryAction.href} className={track.primaryAction.btnClass}>
                      {track.primaryAction.text}
                    </Link>
                    {track.secondaryAction && (
                      <Link href={track.secondaryAction.href} className={track.secondaryAction.btnClass}>
                        {track.secondaryAction.text}
                      </Link>
                    )}
                    {track.tertiaryAction && (
                      <Link href={track.tertiaryAction.href} className="training-link-arrow">
                        <span>{track.tertiaryAction.text}</span>
                        <Icon id="i-arrow-right" />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 3: ENTERPRISE CORPORATE ENABLEMENT ============ */}
      <section className="training-corporate-section" id="corporate">
        <div className="container">
          <div className="training-pathways-head">
            <div>
              <span className="training-section-kicker">Corporate Workforce Transformation</span>
              <h2>Scale Technical Capability Across Your Engineering Organization</h2>
            </div>
            <p>
              We partner with CTOs, VP of Engineering, and IT directors to bridge critical skill gaps, modernize internal
              workflows, and build self-sufficient engineering squads without long-term contractor dependency.
            </p>
          </div>

          <div className="training-corp-grid">
            {corporatePillars.map((pillar, i) => (
              <article key={i} className="training-corp-card">
                <div className="training-corp-icon">
                  <Icon id={pillar.icon} />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
              </article>
            ))}
          </div>

          {/* Corporate Procurement & Delivery Specifications */}
          <div className="training-corp-specs-box">
            <div className="training-corp-specs-copy">
              <span className="training-track-badge">Enterprise Procurement Ready</span>
              <h3>Turnkey Departmental Training Engagements</h3>
              <p>
                From 5-person infrastructure squads to 50+ engineer departmental transformations, our corporate
                training engagements are structured for seamless procurement, legal alignment, and rapid scheduling.
              </p>
              <Link href="/contact?service=Corporate+%2F+Team+Training#enquiry" className="btn btn-navy">
                <span>Request Custom Corporate Proposal</span>
                <Icon id="i-arrow-right" />
              </Link>
            </div>

            <div className="training-specs-grid">
              <div className="training-spec-item">
                <span className="training-spec-label">Proposal Turnaround</span>
                <span className="training-spec-val">1 Business Day SLA</span>
                <span className="training-spec-desc">Detailed syllabus scope, lab requirements, and fixed pricing.</span>
              </div>
              <div className="training-spec-item">
                <span className="training-spec-label">Billing &amp; Payment</span>
                <span className="training-spec-val">Net-30 PO Billing</span>
                <span className="training-spec-desc">Corporate invoicing, purchase orders, and volume tiering.</span>
              </div>
              <div className="training-spec-item">
                <span className="training-spec-label">Legal &amp; Privacy</span>
                <span className="training-spec-val">Mutual NDA Execution</span>
                <span className="training-spec-desc">Enterprise vendor assessments and confidentiality guaranteed.</span>
              </div>
              <div className="training-spec-item">
                <span className="training-spec-label">Instruction Ratio</span>
                <span className="training-spec-val">1 Lead + 1 TA per 15</span>
                <span className="training-spec-desc">Dedicated architect instruction with personal code support.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 4: 1-ON-1 SENIOR MENTORSHIP ============ */}
      <section className="training-mentorship-section" id="mentorship">
        <div className="container">
          <div className="training-pathways-head">
            <div>
              <span className="training-section-kicker">Senior Engineering Advisory</span>
              <h2>Personalized 1-on-1 Mentorship with Principal Architects</h2>
            </div>
            <p>
              Designed for senior engineers, tech leads, and career switchers preparing for high-stakes system design
              interviews, architectural reviews, or executive technical leadership transitions.
            </p>
          </div>

          <div className="training-mentorship-grid">
            {mentorshipTracks.map((track, i) => (
              <article key={i} className="training-mentor-card">
                <div className="training-mentor-icon">
                  <Icon id={track.icon} />
                </div>
                <h3>{track.title}</h3>
                <p>{track.desc}</p>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Link href="/contact?service=training#enquiry" className="btn btn-navy">
              <span>Book an Advisory Consultation</span>
              <Icon id="i-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SECTION 5: LIVE PRODUCTION LAB ENVIRONMENT ============ */}
      <section className="training-labs-section" id="labs">
        <div className="container">
          <div className="training-pathways-head">
            <div>
              <span className="training-section-kicker">Practical Lab Infrastructure</span>
              <h2>Real Cloud Consoles. Real Shells. Zero Toy Simulators.</h2>
            </div>
            <p>
              We reject passive video lectures and synthetic browser sandboxes. Engineering confidence is built by
              making real API calls, diagnosing actual production system breakages, and configuring authentic cloud
              infrastructure.
            </p>
          </div>

          <div className="training-labs-grid">
            {labFeatures.map((feat, i) => (
              <article key={i} className="training-lab-card">
                <div className="training-lab-icon">
                  <Icon id={feat.icon} />
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 6: ACADEMY METHODOLOGY ============ */}
      <section className="training-methodology-section" id="methodology">
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

      {/* ============ SECTION 7: ACADEMY FAQ ============ */}
      <section className="training-faq-section" id="faq">
        <div className="container">
          <div className="training-pathways-head">
            <div>
              <span className="training-section-kicker">Frequently Asked Questions</span>
              <h2>Everything You Need to Know About the Academy</h2>
            </div>
            <p>
              Transparent answers regarding cohort schedules, software prerequisites, employer tuition sponsorship,
              and corporate engagement logistics.
            </p>
          </div>

          <div className="training-faq-grid">
            {faqs.map((faq, i) => (
              <article key={i} className="training-faq-card">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 8: CORPORATE CONSULTATION CTA POD ============ */}
      <section className="training-cta-section" id="contact">
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
                <Link href="/contact?service=Corporate+%2F+Team+Training#enquiry" className="btn btn-navy btn-lg">
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
