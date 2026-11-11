import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { HomeHero } from "@/components/HomeHero";
import { SITE_CONFIG } from "@/lib/config";

export default function HomePage() {
  const primaryPhone = SITE_CONFIG.CONTACT.PHONE_DISPLAY;
  const primaryPhoneE164 = SITE_CONFIG.CONTACT.PHONE_E164;

  const collabs = [
    { name: "AWS Well-Architected Aligned", icon: "i-cloud" },
    { name: "Microsoft Azure Solutions", icon: "i-server" },
    { name: "Google Cloud Platform", icon: "i-globe" },
    { name: "HashiCorp Terraform Validated", icon: "i-code" },
    { name: "SOC 2 Type II Architecture", icon: "i-shield" },
    { name: "ISO 27001 Security Controls", icon: "i-lock" },
    { name: "HIPAA Security & Privacy", icon: "i-check" },
  ];

  const milestones = [
    {
      val: "20+ Years",
      label: "Operational Lineage",
      desc: "Continuous enterprise infrastructure and cloud systems practice across hybrid environments.",
    },
    {
      val: "150+",
      label: "Completed Deliveries",
      desc: "Enterprise cloud cutovers, Kubernetes clusters, and automated DevOps deployment pipelines.",
    },
    {
      val: "99.99%",
      label: "Production SLA Target",
      desc: "Engineered high-availability architectures with automated failover and telemetry monitoring.",
    },
    {
      val: "3 Desks",
      label: "Global Coordination",
      desc: "Follow-the-sun client delivery across North America (HQ), United Kingdom, and West Africa.",
    },
  ];

  const pillars = [
    {
      icon: "i-cloud",
      title: "Cloud, DevOps & Security Consulting",
      desc: "High-stakes architectural blueprints, cloud cutovers, and regulatory governance for organizations modernizing complex digital infrastructure.",
      services: [
        "Cloud Strategy & Zero-Downtime Migration (AWS, Azure, Google Cloud)",
        "DevOps Automation, CI/CD & Terraform Infrastructure as Code",
        "Zero-Trust Identity (IAM), SOC 2, HIPAA & ISO 27001 Compliance",
        "FinOps Cloud Cost Governance & Continuous Rightsizing",
      ],
      ctaText: "Explore Consulting Practices",
      ctaHref: "/services",
    },
    {
      icon: "i-users",
      title: "Engineering Staffing & Dedicated Pods",
      desc: "Pre-vetted senior cloud architects, DevOps leads, and data specialists embedded directly into your agile delivery cycles without recruiting lag.",
      services: [
        "Dedicated Cloud & DevOps Engineering Squads",
        "Embedded Data Engineers & BI Dashboard Analysts",
        "Turnkey 24/7 SRE Incident Response & Managed Operations",
        "Flexible Sprint Scaling & Contract-to-Hire Placement",
      ],
      ctaText: "Explore Staffing Solutions",
      ctaHref: "/services#support",
    },
    {
      icon: "i-building",
      title: "Corporate Workforce Training & Labs",
      desc: "Bespoke technical upskilling programs aligned directly with your enterprise toolchain, internal security baselines, and engineering roadmaps.",
      services: [
        "Custom Departmental Curricula for Cloud, DevOps & Analytics",
        "Production Sandbox Labs on Real Cloud Consoles",
        "Executive Data Literacy & Automated Reporting Bootcamps",
        "Measurable Skill Telemetry & Progress Reporting for Leadership",
      ],
      ctaText: "Explore Corporate Training",
      ctaHref: "/training#pathways",
    },
    {
      icon: "i-grad",
      title: "Individual Professional Academy",
      desc: "Rigorous multi-week live programs for working professionals and career switchers seeking verifiable, production-grade capabilities with live architect guidance.",
      services: [
        "Flagship 3-Month Data Analysis Cohort (SQL, Python, Power BI, Tableau)",
        "Cloud Architecture & DevOps Hands-On Lab Work",
        "1-on-1 Architect Mentorship & System Design Interview Defense",
        "Capstone Project Portfolios Verifiable by Employers",
      ],
      ctaText: "Explore Academy Curricula",
      ctaHref: "/training#programmes",
    },
  ];

  return (
    <main id="main">
      {/* ============ 1. HERO ============ */}
      <HomeHero />

      {/* ============ 2. ENTERPRISE COLLABORATIONS & PLATFORMS STRIP ============ */}
      <section className="hp-collabs-strip" id="collaborations" aria-label="Enterprise Platform Alignments and Certifications">
        <div className="container hp-collabs-inner">
          <span className="hp-collabs-label">Enterprise Platform Alignments &amp; Standards</span>
          <div className="hp-collabs-items">
            {collabs.map((collab, i) => (
              <span key={i} className="hp-collab-badge">
                <Icon id={collab.icon} />
                <span>{collab.name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3. ORGANIZATIONAL PEDIGREE, MILESTONES & ACHIEVEMENTS ============ */}
      <section className="hp-pedigree-section" id="about-overview">
        <div className="container hp-pedigree-grid">
          <div className="hp-pedigree-copy reveal">
            <span className="hp-pedigree-kicker">Corporate Pedigree &amp; Track Record</span>
            <h2>Two Decades of Resilient Engineering &amp; Architectural Sovereignty</h2>
            <p className="hp-pedigree-lead">
              Founded on 20 years of production infrastructure practice, {SITE_CONFIG.COMPANY} operates across
              North America, Europe, and West Africa. We architect, migrate, and secure mission-critical cloud
              environments while ensuring internal engineering teams retain complete operational independence.
            </p>
            <p className="hp-pedigree-sub">
              We reject vendor lock-in. Every architecture is codified in versioned Infrastructure as Code, fully
              documented in operational runbooks, and backed by comprehensive knowledge transfer.
            </p>

            <div className="hp-pedigree-trust-row">
              <div className="hp-pedigree-trust-item">
                <Icon id="i-check" />
                <span>100% Client Code &amp; Key Ownership</span>
              </div>
              <div className="hp-pedigree-trust-item">
                <Icon id="i-check" />
                <span>Zero Vendor Lock-In Philosophy</span>
              </div>
              <div className="hp-pedigree-trust-item">
                <Icon id="i-check" />
                <span>Direct Access to Lead Architects</span>
              </div>
            </div>

            <div className="hp-pedigree-cta">
              <Link href="/about" className="btn btn-navy">
                <span>Read Full Corporate Profile</span>
                <Icon id="i-arrow-right" />
              </Link>
              <Link href="/contact#locations" className="btn btn-outline">
                <span>Global Operating Desks</span>
              </Link>
            </div>
          </div>

          <div className="hp-milestones-grid reveal">
            {milestones.map((m, i) => (
              <article key={i} className="hp-milestone-card">
                <span className="hp-milestone-val">{m.val}</span>
                <span className="hp-milestone-label">{m.label}</span>
                <p>{m.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. CATEGORIZED PRACTICE PILLARS ============ */}
      <section className="hp-pillars-section" id="services">
        <div className="container">
          <div className="hp-pillars-head reveal">
            <div>
              <span className="hp-pillars-kicker">Core Practice Areas</span>
              <h2>Technology Support from Assessment to Operations</h2>
            </div>
            <p>
              Engage our senior engineering teams for targeted architectural reviews, full delivery lifecycles, or managed operational governance. We build resilient, transparent systems your organization can operate independently.
            </p>
          </div>

          <div className="hp-pillars-grid">
            {pillars.map((pillar, i) => (
              <article key={i} className="hp-pillar-card reveal">
                <div className="hp-pillar-top">
                  <div className="hp-pillar-icon" aria-hidden="true">
                    <Icon id={pillar.icon} />
                  </div>
                  <h3>{pillar.title}</h3>
                </div>
                <p className="hp-pillar-desc">{pillar.desc}</p>

                <span className="hp-pillar-list-label">Deep-Dive Capabilities</span>
                <ul className="hp-pillar-list">
                  {pillar.services.map((svc, idx) => (
                    <li key={idx}>
                      <Icon id="i-check" />
                      <span>{svc}</span>
                    </li>
                  ))}
                </ul>

                <div className="hp-pillar-action">
                  <Link href={pillar.ctaHref} className="hp-pillar-action-link">
                    <span>{pillar.ctaText}</span>
                    <Icon id="i-arrow-right" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. DELIVERY METHODOLOGY (4-STAGE PIPELINE) ============ */}
      <section className="section section-tint hp-process-section" id="approach">
        <div className="container">
          <div className="hp-process-head reveal">
            <div>
              <span className="hp-pillars-kicker">Delivery Methodology</span>
              <h2>A Clear Path from Assessment to Handover</h2>
            </div>
            <p className="hp-process-lead">
              A structured, four-phase engagement model designed to de-risk technical decisions, maintain operational continuity, and ensure complete institutional ownership.
            </p>
          </div>

          <div className="hp-process-pipeline reveal">
            <ol className="hp-process-track">
              {/* Phase 01 */}
              <li className="hp-process-step">
                <div className="hp-step-indicator">
                  <span className="hp-step-badge">01</span>
                  <span className="hp-step-phase">Assessment</span>
                </div>
                <div className="hp-step-body">
                  <div className="hp-step-header">
                    <span className="hp-step-icon" aria-hidden="true">
                      <Icon id="i-compass" />
                    </span>
                    <h3>Discovery &amp; Audit</h3>
                  </div>
                  <p>
                    Evaluate existing infrastructure, data workflows, compliance posture, and business dependencies.
                  </p>
                  <ul className="hp-step-activities">
                    <li>
                      <Icon id="i-check" />
                      <span>Architecture and security posture review</span>
                    </li>
                    <li>
                      <Icon id="i-check" />
                      <span>Cost, capacity, and risk baselines</span>
                    </li>
                  </ul>
                  <div className="hp-step-deliverable">
                    <span className="hp-deliverable-label">Key Deliverable</span>
                    <strong className="hp-deliverable-val">Scope Matrix &amp; Findings Report</strong>
                  </div>
                </div>
              </li>

              {/* Phase 02 */}
              <li className="hp-process-step">
                <div className="hp-step-indicator">
                  <span className="hp-step-badge">02</span>
                  <span className="hp-step-phase">Strategy</span>
                </div>
                <div className="hp-step-body">
                  <div className="hp-step-header">
                    <span className="hp-step-icon" aria-hidden="true">
                      <Icon id="i-workflow" />
                    </span>
                    <h3>Architecture &amp; Roadmap</h3>
                  </div>
                  <p>
                    Architect the target cloud environment, select appropriate toolchains, and define a phased delivery blueprint.
                  </p>
                  <ul className="hp-step-activities">
                    <li>
                      <Icon id="i-check" />
                      <span>Target state blueprint and ADRs</span>
                    </li>
                    <li>
                      <Icon id="i-check" />
                      <span>Phased milestones and rollback plan</span>
                    </li>
                  </ul>
                  <div className="hp-step-deliverable">
                    <span className="hp-deliverable-label">Key Deliverable</span>
                    <strong className="hp-deliverable-val">Migration Blueprint &amp; Schedule</strong>
                  </div>
                </div>
              </li>

              {/* Phase 03 */}
              <li className="hp-process-step">
                <div className="hp-step-indicator">
                  <span className="hp-step-badge">03</span>
                  <span className="hp-step-phase">Execution</span>
                </div>
                <div className="hp-step-body">
                  <div className="hp-step-header">
                    <span className="hp-step-icon" aria-hidden="true">
                      <Icon id="i-server" />
                    </span>
                    <h3>Delivery &amp; Cutover</h3>
                  </div>
                  <p>
                    Deploy production infrastructure as code, execute data migrations, and perform rigorous resilience testing.
                  </p>
                  <ul className="hp-step-activities">
                    <li>
                      <Icon id="i-check" />
                      <span>Automated IaC and pipeline deployment</span>
                    </li>
                    <li>
                      <Icon id="i-check" />
                      <span>Validation under production conditions</span>
                    </li>
                  </ul>
                  <div className="hp-step-deliverable">
                    <span className="hp-deliverable-label">Key Deliverable</span>
                    <strong className="hp-deliverable-val">Verified Production Stack</strong>
                  </div>
                </div>
              </li>

              {/* Phase 04 */}
              <li className="hp-process-step">
                <div className="hp-step-indicator">
                  <span className="hp-step-badge">04</span>
                  <span className="hp-step-phase">Enablement</span>
                </div>
                <div className="hp-step-body">
                  <div className="hp-step-header">
                    <span className="hp-step-icon" aria-hidden="true">
                      <Icon id="i-user-check" />
                    </span>
                    <h3>Handover &amp; Ownership</h3>
                  </div>
                  <p>
                    Deliver comprehensive operational runbooks and train internal teams to manage and scale the environment.
                  </p>
                  <ul className="hp-step-activities">
                    <li>
                      <Icon id="i-check" />
                      <span>Operational runbooks and monitoring setup</span>
                    </li>
                    <li>
                      <Icon id="i-check" />
                      <span>Direct mentoring and knowledge transfer</span>
                    </li>
                  </ul>
                  <div className="hp-step-deliverable">
                    <span className="hp-deliverable-label">Key Deliverable</span>
                    <strong className="hp-deliverable-val">Independent Operational Capability</strong>
                  </div>
                </div>
              </li>
            </ol>

            {/* Bottom Assurance Strip */}
            <div className="hp-process-guarantees">
              <div className="hp-guarantee-item">
                <span className="hp-guarantee-icon" aria-hidden="true"><Icon id="i-lock" /></span>
                <div>
                  <strong>Zero Vendor Lock-In</strong>
                  <p>Open standards, standard IaC, and full client access to all configurations.</p>
                </div>
              </div>
              <div className="hp-guarantee-item">
                <span className="hp-guarantee-icon" aria-hidden="true"><Icon id="i-shield" /></span>
                <div>
                  <strong>Phased Gate Approvals</strong>
                  <p>Each phase requires explicit review and milestone sign-off before proceeding.</p>
                </div>
              </div>
              <div className="hp-guarantee-item">
                <span className="hp-guarantee-icon" aria-hidden="true"><Icon id="i-award" /></span>
                <div>
                  <strong>Operational Independence</strong>
                  <p>We train your engineers so your team never depends on external consultants.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. INDUSTRIES WE SERVE ============ */}
      <section className="section" id="sectors">
        <div className="container">
          <div className="hp-approach-head reveal">
            <div>
              <span className="hp-pillars-kicker">Industries We Serve</span>
              <h2>Technology Needs We Understand</h2>
            </div>
            <p>
              We tailor our cloud architectures, security governance, and analytics solutions to match
              the operational and regulatory demands of your sector.
            </p>
          </div>

          <div className="hp-sector-cards">
            <article className="hp-sector-card reveal">
              <div className="hp-sector-top">
                <span className="hp-sector-std">Data residency requirements</span>
              </div>
              <h3>Government &amp; Public Institutions</h3>
              <p>
                Cloud, identity, and data solutions shaped around public-sector governance and data sovereignty.
              </p>
            </article>

            <article className="hp-sector-card reveal">
              <div className="hp-sector-top">
                <span className="hp-sector-std">Patient data &amp; HIPAA privacy</span>
              </div>
              <h3>Healthcare &amp; Life Sciences</h3>
              <p>
                Infrastructure and data systems designed with strict patient information protection and privacy in mind.
              </p>
            </article>

            <article className="hp-sector-card reveal">
              <div className="hp-sector-top">
                <span className="hp-sector-std">Payment &amp; SOC 2 audit controls</span>
              </div>
              <h3>Financial Services &amp; Fintech</h3>
              <p>
                High-throughput cloud, security, and analytics support for transaction-critical operations.
              </p>
            </article>

            <article className="hp-sector-card reveal">
              <div className="hp-sector-top">
                <span className="hp-sector-std">Enterprise &amp; Institutional IT</span>
              </div>
              <h3>Higher Education &amp; Corporate</h3>
              <p>
                Modernize legacy systems, eliminate technical debt, and build practical data capability across teams.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ 7. CLOSING EXECUTIVE CONSULTATION CTA POD ============ */}
      <section className="section hp-cta-section" id="contact-cta">
        <div className="container">
          <div className="hp-cta-card reveal">
            <div className="hp-cta-content">
              <span className="hp-cta-kicker">Start a Technical Discussion</span>
              <h2>Ready to Discuss Your Architecture, Staffing, or Team Enablement?</h2>
              <p>
                Speak directly with our senior solutions architects to explore strategic cloud consulting,
                dedicated staff augmentation pods, or custom workforce training programs.
              </p>
              <div className="hp-cta-actions">
                <Link href="/contact#enquiry" className="btn btn-gold btn-lg">
                  <span>Request a Consultation</span>
                  <Icon id="i-arrow-right" />
                </Link>
                <a href={`tel:${primaryPhoneE164}`} className="btn btn-outline-light btn-lg">
                  <Icon id="i-phone" /> Call {primaryPhone}
                </a>
              </div>
            </div>
            <div className="hp-cta-aside">
              <div className="hp-cta-assurance-item">
                <span className="hp-cta-assurance-icon">
                  <Icon id="i-check" />
                </span>
                <div>
                  <strong>1 Business Day SLA</strong>
                  <p>Guaranteed response from a senior technical architect.</p>
                </div>
              </div>
              <div className="hp-cta-assurance-item">
                <span className="hp-cta-assurance-icon">
                  <Icon id="i-shield" />
                </span>
                <div>
                  <strong>Strict Confidentiality</strong>
                  <p>Mutual NDAs executed prior to detailed technical discovery.</p>
                </div>
              </div>
              <div className="hp-cta-assurance-item">
                <span className="hp-cta-assurance-icon">
                  <Icon id="i-lock" />
                </span>
                <div>
                  <strong>Zero Vendor Lock-In</strong>
                  <p>Open standards, clear IP ownership, and transparent scopes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
