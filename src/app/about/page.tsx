import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Corporate Profile & Architectural Pedigree | ${SITE_CONFIG.COMPANY}`,
  description:
    "Elites Tech Solutions LLC provides enterprise cloud architecture, DevOps automation, cybersecurity governance, and technical workforce training across North America, Europe, and West Africa.",
};

export default function AboutPage() {
  const primaryPhone = SITE_CONFIG.CONTACT.PHONE_DISPLAY;
  const primaryPhoneE164 = SITE_CONFIG.CONTACT.PHONE_E164;

  const principles = [
    {
      num: "01",
      icon: "i-code",
      title: "Infrastructure as Code & Zero Drift",
      desc: "Every virtual network, compute node, and security policy is defined in versioned code. No manual configuration drifts, and complete auditability across deployments.",
    },
    {
      num: "02",
      icon: "i-infinity",
      title: "Cloud-Agnostic & Vendor Neutrality",
      desc: "Architectures engineered for portable workloads across AWS, Microsoft Azure, Google Cloud, and private data centers to protect client autonomy.",
    },
    {
      num: "03",
      icon: "i-shield",
      title: "Security & Compliance by Default",
      desc: "Zero-trust network boundaries, strict least-privilege identity access, and continuous compliance telemetry adhering to industry security baselines.",
    },
    {
      num: "04",
      icon: "i-gauge",
      title: "High Availability & Resilient Design",
      desc: "Observability pipelines, automated health checking, and fault-tolerant cluster design engineered to maintain high availability and rapid recovery.",
    },
    {
      num: "05",
      icon: "i-users",
      title: "Direct Senior Accountability",
      desc: "Engagements are executed directly by seasoned solutions architects and technical leads. Clear communication with zero intermediary handoffs.",
    },
    {
      num: "06",
      icon: "i-grad",
      title: "Capability Transfer & Autonomy",
      desc: "We ensure client engineering teams become completely self-sufficient through comprehensive system documentation, runbooks, and paired operational drills.",
    },
  ];

  const hubs = [
    {
      region: "North America Desk",
      country: "United States",
      city: "Medford, New Jersey, USA",
      role: "Global Corporate Headquarters & Advisory Desk",
      features: [
        "Strategic architecture discovery",
        "Commercial governance & legal",
        "Executive client partnership",
      ],
    },
    {
      region: "EMEA Operations",
      country: "United Kingdom",
      city: "Rugby, United Kingdom",
      role: "European Delivery Hub & Infrastructure Operations",
      features: [
        "Time-zone aligned EMEA execution",
        "GDPR data privacy alignment",
        "Cross-border cloud engineering",
      ],
    },
    {
      region: "West Africa Hub",
      country: "Ghana",
      city: "Poolside Ave, Takoradi, Ghana",
      role: "Regional Delivery Center & Technical Academy",
      features: [
        "Production engineering laboratories",
        "Workforce capability acceleration",
        "Cloud & DevOps apprentice programs",
      ],
    },
  ];

  const standards = [
    { label: "AWS Well-Architected Framework", icon: "i-cloud" },
    { label: "Azure Cloud Solutions", icon: "i-server" },
    { label: "Google Cloud Platform", icon: "i-globe" },
    { label: "HashiCorp Terraform Ecosystem", icon: "i-code" },
    { label: "Security & Compliance Baselines", icon: "i-shield" },
    { label: "Zero-Trust Identity Governance", icon: "i-lock" },
    { label: "GDPR Data Governance", icon: "i-globe" },
  ];

  return (
    <main id="main">
      {/* ============ EXECUTIVE HERO ============ */}
      <section className="about-hero">
        <div className="container">
          <ol className="crumbs" aria-label="Breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>About</li>
          </ol>
          <div className="about-hero-header">
            <span className="about-hero-kicker">Corporate Profile &amp; Architectural Pedigree</span>
            <h1>Engineering Resilient Cloud Systems &amp; Building Technical Capability</h1>
            <p>
              {SITE_CONFIG.COMPANY} partners with enterprises, growing organizations, and engineering
              teams across North America, Europe, and West Africa. We operate at the intersection of
              complex cloud architecture, cybersecurity governance, and hands-on workforce enablement.
            </p>
          </div>

          {/* 4-Item Executive Principles Strip */}
          <div className="about-metrics-strip">
            <div className="about-metric-card">
              <span className="about-metric-val">100%</span>
              <span className="about-metric-lbl">Client Code &amp; Key Ownership</span>
            </div>
            <div className="about-metric-card">
              <span className="about-metric-val">Zero</span>
              <span className="about-metric-lbl">Vendor Lock-In Philosophy</span>
            </div>
            <div className="about-metric-card">
              <span className="about-metric-val">Direct</span>
              <span className="about-metric-lbl">Solutions Architect Access</span>
            </div>
            <div className="about-metric-card">
              <span className="about-metric-val">3 Hubs</span>
              <span className="about-metric-lbl">North America, Europe &amp; West Africa</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STRATEGIC NARRATIVE & DUAL-ENGINE MODEL ============ */}
      <section className="about-engine-section">
        <div className="container about-engine-grid">
          {/* Left Column: Lineage & Thesis */}
          <div className="about-thesis-col">
            <span className="about-section-kicker">Foundational Thesis</span>
            <h2>Production Stability Without Vendor Lock-In</h2>
            <p className="about-thesis-text">
              Modern enterprises face an acute dilemma: hyperscale cloud adoption often comes at the price of
              spiraling compute costs, unmanaged architectural drift, and deep proprietary lock-in. Our practice
              was established to restore architectural autonomy.
            </p>
            <p className="about-thesis-text-muted">
              We build strictly on reproducible, code-defined infrastructure using immutable patterns,
              declarative state, and open standards. Whether orchestrating multi-region Kubernetes clusters on
              AWS, hardening identity boundaries across Azure, or establishing continuous deployment automation,
              our implementations are documented, transparent, and built to survive beyond any single vendor
              engagement.
            </p>

            <div className="about-credentials-bar">
              <div className="about-cred-item">
                <Icon id="i-check" />
                <span>Zero-Trust Security Design</span>
              </div>
              <div className="about-cred-item">
                <Icon id="i-check" />
                <span>Declarative Infrastructure as Code</span>
              </div>
              <div className="about-cred-item">
                <Icon id="i-check" />
                <span>Cross-Cloud Resilience</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dual-Engine Model */}
          <div className="about-engines-col">
            <div className="about-engines-head">
              <h3>The Dual-Engine Practice</h3>
              <p>How our organization delivers lasting value to modern institutions.</p>
            </div>

            <article className="about-engine-card">
              <div className="about-engine-card-header">
                <div className="about-engine-icon">
                  <Icon id="i-cloud" />
                </div>
                <div>
                  <span className="about-engine-num">Practice 01</span>
                  <h4>Enterprise Cloud &amp; Infrastructure Solutions</h4>
                </div>
              </div>
              <p>
                Direct architecture and engineering execution. We design, migrate, automate, and secure mission-critical
                workloads with high availability, automated disaster recovery, and FinOps cost governance.
              </p>
              <Link href="/services" className="about-engine-link">
                <span>Explore Technical Practices</span>
                <Icon id="i-arrow-right" />
              </Link>
            </article>

            <article className="about-engine-card">
              <div className="about-engine-card-header">
                <div className="about-engine-icon">
                  <Icon id="i-grad" />
                </div>
                <div>
                  <span className="about-engine-num">Practice 02</span>
                  <h4>Technical Academy &amp; Workforce Capability</h4>
                </div>
              </div>
              <p>
                Infrastructure is only as sustainable as the engineers operating it. Our academy delivers rigorous,
                production-simulated training in Cloud, DevOps, and Data Analytics so internal teams maintain full mastery.
              </p>
              <Link href="/training" className="about-engine-link">
                <span>Explore Academy Curricula</span>
                <Icon id="i-arrow-right" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ============ 6 ARCHITECTURAL OPERATING PRINCIPLES ============ */}
      <section className="about-principles-section">
        <div className="container">
          <div className="about-principles-head">
            <div>
              <span className="about-section-kicker">Operating Playbook</span>
              <h2>Six Principles Guiding Every Engagement</h2>
            </div>
            <p>
              Our baseline engineering standards for resilience, governance, and long-term client sovereignty across
              every deployed system.
            </p>
          </div>

          <div className="about-principles-grid">
            {principles.map((p, i) => (
              <article key={i} className="about-principle-card">
                <div className="about-principle-header">
                  <div className="about-principle-icon">
                    <Icon id={p.icon} />
                  </div>
                  <span className="about-principle-num">{p.num}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GLOBAL DELIVERY FOOTPRINT ============ */}
      <section className="about-global-section">
        <div className="container">
          <div className="about-global-head">
            <div>
              <span className="about-section-kicker">Global Footprint</span>
              <h2>Cross-Continental Delivery &amp; Coordination</h2>
            </div>
            <p>
              With operations spanning three continents, our follow-the-sun model ensures time-zone aligned
              technical advisory, seamless project delivery, and responsive support.
            </p>
          </div>

          <div className="about-hubs-grid">
            {hubs.map((hub, i) => (
              <article key={i} className="about-hub-card">
                <span className="about-hub-region">{hub.region}</span>
                <h3>{hub.country}</h3>
                <span className="about-hub-city">{hub.city}</span>
                <p className="about-hub-role">{hub.role}</p>
                <ul className="about-hub-features">
                  {hub.features.map((feat, idx) => (
                    <li key={idx}>
                      <Icon id="i-check" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="about-global-footer">
            <p>
              Need direct coordination with a specific office? All locations route through our corporate desk at{" "}
              <strong>{primaryPhone}</strong>.
            </p>
            <Link href="/contact#locations" className="btn btn-navy btn-sm">
              <span>View Office Coordinates</span>
              <Icon id="i-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ STANDARDS & COMPLIANCE STRIP ============ */}
      <section className="about-standards-strip">
        <div className="container about-standards-inner">
          <span className="about-standards-label">Enterprise Standards &amp; Frameworks</span>
          <div className="about-standards-items">
            {standards.map((s, i) => (
              <div key={i} className="about-standard-tag">
                <Icon id={s.icon} />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONSULTATION CTA POD ============ */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-box">
            <div className="about-cta-content">
              <span className="about-section-kicker">Start a Technical Discussion</span>
              <h2>Ready to Discuss Your Architecture or Team Development?</h2>
              <p>
                Our senior solutions architects provide a comprehensive discovery session to understand your
                current infrastructure, operational bottlenecks, and strategic milestones.
              </p>
            </div>
            <div className="about-cta-actions">
              <div className="about-cta-buttons">
                <Link href="/contact#enquiry" className="btn btn-navy btn-lg">
                  Request a Consultation
                </Link>
                <a href={`tel:${primaryPhoneE164}`} className="btn btn-outline btn-lg">
                  <Icon id="i-phone" /> Call {primaryPhone}
                </a>
              </div>
              <div className="about-cta-sla">
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
