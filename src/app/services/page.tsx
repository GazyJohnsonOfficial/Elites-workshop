import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Engineering Practices & Cloud Solutions | ${SITE_CONFIG.COMPANY}`,
  description:
    "Accelerate your enterprise with production-grade cloud architectures, zero-downtime migrations, automated DevOps delivery pipelines, FinOps governance, dedicated engineering pods, and 24/7 managed SRE support.",
};

interface ServiceCapability {
  title: string;
  icon: string;
  desc: string;
  span?: boolean;
}

interface ServiceOffering {
  id: string;
  aliasId?: string;
  number: string;
  badge: string;
  title: string;
  icon: string;
  impact?: string;
  summary: string;
  btnText: string;
  contactTopic: string;
  techStack: string[];
  capabilities: ServiceCapability[];
}

interface PracticeCategory {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  services: ServiceOffering[];
}

export default function ServicesPage() {
  const jumpLinks = [
    { href: "#cloud", label: "01 Cloud & Migration" },
    { href: "#security-devops", label: "02 Security & DevOps" },
    { href: "#sre-native", label: "03 SRE & Platforms" },
    { href: "#staffing", label: "04 Staffing & Pods" },
    { href: "#industries", label: "Regulated Sectors" },
  ];

  const practiceCategories: PracticeCategory[] = [
    {
      id: "cloud",
      eyebrow: "Practice Domain 01",
      title: "Cloud Infrastructure, Architecture & Migration",
      desc: "Architect, migrate, and modernize mission-critical systems across AWS, Azure, and Google Cloud with zero downtime and guaranteed business continuity.",
      services: [
        {
          id: "cloud-strategy",
          number: "01",
          badge: "Cloud Advisory",
          title: "Cloud Strategy & Assessment",
          icon: "i-compass",
          impact: "Actionable migration roadmaps aligned with business and TCO targets",
          summary:
            "Chart an optimal, risk-free path to the cloud. We evaluate your current technical readiness, model total cost of ownership (TCO), and build phased architectural roadmaps aligned with business goals.",
          btnText: "Request a Readiness Assessment",
          contactTopic: "IT Consulting and Strategy",
          techStack: [
            "AWS Well-Architected",
            "Cloud Adoption Framework",
            "TCO Modeling",
            "Readiness Assessment",
          ],
          capabilities: [
            {
              title: "Cloud Readiness Assessment",
              icon: "i-target",
              desc: "Evaluate your organization's cloud maturity, identify technical gaps, and assess migration feasibility across compute, storage, and networking layers.",
            },
            {
              title: "Cloud Strategy Development",
              icon: "i-compass",
              desc: "Develop a tailored cloud strategy that aligns with your business goals, resource constraints, and multi-year technology roadmaps.",
            },
          ],
        },
        {
          id: "migration",
          number: "02",
          badge: "Workload Transition",
          title: "Cloud Migration & Modernization",
          icon: "i-cloud-upload",
          impact: "Automated cutover validation and rollback protection",
          summary:
            "Seamless, secure migration of mission-critical workloads, applications, and enterprise databases with guaranteed data integrity, automated rollbacks, and zero disruption to business continuity.",
          btnText: "Plan Your Migration",
          contactTopic: "Cloud and Infrastructure",
          techStack: [
            "AWS MGN",
            "Azure Migrate",
            "Database Migration Service",
            "Zero-Downtime Cutover",
            "VMware Cloud",
          ],
          capabilities: [
            {
              title: "Migration Planning & Phasing",
              icon: "i-calendar",
              desc: "We develop a phased migration plan outlining timeline, network connectivity, dependencies, and risk mitigation checkpoints.",
            },
            {
              title: "Data & Application Migration",
              icon: "i-db",
              desc: "Securely migrate transactional databases and distributed applications with real-time replication, zero data loss, and verified integrity.",
            },
            {
              title: "Rehosting, Refactoring, Replatforming",
              icon: "i-repeat",
              span: true,
              desc: "Select the optimal path between lift-and-shift, containerized refactoring, or managed-platform replatforming based on speed, cost, and long-term maintainability.",
            },
          ],
        },
        {
          id: "architecture",
          number: "03",
          badge: "Resilient Systems",
          title: "Cloud Architecture & Design",
          icon: "i-cloud",
          impact: "Multi-region high availability with automated failover",
          summary:
            "Engineer high-availability, fault-tolerant cloud environments that scale dynamically with your workload across AWS, Azure, and Google Cloud Platform.",
          btnText: "Design Your Infrastructure",
          contactTopic: "Cloud and Infrastructure",
          techStack: [
            "AWS",
            "Microsoft Azure",
            "Google Cloud",
            "Microservices",
            "Kubernetes",
            "Serverless",
          ],
          capabilities: [
            {
              title: "Infrastructure Design",
              icon: "i-server",
              desc: "Create robust, multi-region cloud topology tailored to your throughput, latency, security, and geographic redundancy requirements.",
            },
            {
              title: "Microservices & Containerization",
              icon: "i-box",
              desc: "Decompose monolithic systems into independently scalable, loosely coupled services managed through enterprise container orchestration.",
            },
            {
              title: "Serverless Architecture",
              icon: "i-cloud",
              span: true,
              desc: "Implement event-driven serverless architectures to eliminate idle server costs, achieve instant auto-scaling, and accelerate feature shipping.",
            },
          ],
        },
        {
          id: "hybrid",
          number: "04",
          badge: "Hybrid Infrastructure",
          title: "Multi-Cloud & Hybrid Cloud Solutions",
          icon: "i-layers",
          impact: "Zero vendor lock-in with unified cross-cloud connectivity",
          summary:
            "Eliminate vendor lock-in. Seamlessly integrate your private datacenter, AWS, Microsoft Azure, and Google Cloud into one unified infrastructure.",
          btnText: "Integrate Hybrid Clouds",
          contactTopic: "Cloud and Infrastructure",
          techStack: [
            "DirectConnect & ExpressRoute",
            "Cross-Cloud Networking",
            "HashiCorp Consul",
            "Hybrid Mesh",
          ],
          capabilities: [
            {
              title: "Hybrid Cloud Network Integration",
              icon: "i-layers",
              span: true,
              desc: "Establish dedicated high-bandwidth interconnects (AWS Direct Connect, Azure ExpressRoute) bridging on-premise datacenters with multi-cloud environments.",
            },
          ],
        },
      ],
    },
    {
      id: "security-devops",
      eyebrow: "Practice Domain 02",
      title: "Cybersecurity, DevOps Automation & FinOps",
      desc: "Enforce zero-trust defense postures, automate compliance monitoring aligned with industry baselines, and eliminate wasteful cloud expenditure.",
      services: [
        {
          id: "security",
          number: "05",
          badge: "SecOps & Governance",
          title: "Cloud Security, IAM & Compliance",
          icon: "i-shield",
          impact: "Automated security controls and continuous audit readiness",
          summary:
            "Multi-layer defense safeguarding sensitive corporate workloads, mitigating infrastructure threats, and supporting compliance with industry regulatory standards.",
          btnText: "Get a Security Assessment",
          contactTopic: "Cybersecurity and Protection",
          techStack: [
            "Security Baselines",
            "Audit Readiness",
            "Data Protection",
            "Least-Privilege IAM",
            "GuardDuty & Sentinel",
            "Policy as Code",
          ],
          capabilities: [
            {
              title: "Security & Vulnerability Assessment",
              icon: "i-shield",
              desc: "Conduct thorough security reviews to identify misconfigurations, attack vectors, and enforce hardened defense postures across cloud workloads.",
            },
            {
              title: "Compliance & Regulatory Governance",
              icon: "i-file",
              desc: "Implement automated compliance monitoring aligned with major regulatory baselines and audit-ready reporting.",
            },
            {
              title: "Zero-Trust Identity & Access Management",
              icon: "i-key",
              span: true,
              desc: "Enforce least-privilege access, role-based access controls (RBAC), multi-factor authentication, and temporary credential rotation across all infrastructure.",
            },
          ],
        },
        {
          id: "devops",
          number: "06",
          badge: "GitOps & Automation",
          title: "DevOps & Infrastructure Automation",
          icon: "i-infinity",
          impact: "Daily verified deployments replacing bi-weekly manual releases",
          summary:
            "Accelerate your release cycles, enhance engineering collaboration, and eliminate human error with automated pipelines, telemetry, and Infrastructure as Code.",
          btnText: "Automate Your Delivery",
          contactTopic: "IT Consulting and Strategy",
          techStack: [
            "Terraform",
            "Kubernetes",
            "Docker",
            "GitHub Actions",
            "GitLab CI",
            "Ansible",
            "ArgoCD",
          ],
          capabilities: [
            {
              title: "DevOps Strategy & Pipeline Audit",
              icon: "i-target",
              desc: "Audit development workflows and implement standardized GitOps pipelines that reduce deployment lead times and eliminate release bottlenecks.",
            },
            {
              title: "Automated CI/CD Pipelines",
              icon: "i-git-branch",
              desc: "Deploy robust continuous integration and delivery pipelines with automated testing, linting, security scanning, and one-click rollback.",
            },
            {
              title: "Infrastructure as Code (IaC)",
              icon: "i-terminal",
              desc: "Define all infrastructure via modular Terraform manifests for repeatable, version-controlled, and testable deployments.",
            },
            {
              title: "Containerization & Orchestration",
              icon: "i-box",
              desc: "Package and operate applications reliably across environments using standardized Docker containers and production-hardened Kubernetes clusters.",
            },
            {
              title: "Configuration Management",
              icon: "i-sliders",
              desc: "Standardize server baselines and automate patch management across hybrid and multi-cloud instances using Ansible and SSM automation.",
            },
            {
              title: "Telemetry, Monitoring & Alerting",
              icon: "i-eye",
              desc: "Deploy unified telemetry with Datadog, Prometheus, and Grafana to detect anomalies before they impact end-user experience.",
            },
          ],
        },
        {
          id: "optimization",
          number: "07",
          badge: "FinOps & Efficiency",
          title: "Cloud Cost Optimization & FinOps",
          icon: "i-gauge",
          impact: "Measurable cloud infrastructure cost reduction and continuous right-sizing",
          summary:
            "Maximize the return on your cloud investment. We identify inefficiencies, eliminate wasteful spend, and fine-tune resources for peak speed and responsiveness.",
          btnText: "Optimize Your Cloud Spend",
          contactTopic: "IT Consulting and Strategy",
          techStack: [
            "FinOps Protocol",
            "AWS Cost Explorer",
            "Resource Right-Sizing",
            "Savings Plans",
            "Performance Tuning",
          ],
          capabilities: [
            {
              title: "Cost & Waste Audit",
              icon: "i-gauge",
              desc: "Systematically analyze infrastructure billing to identify unattached volumes, idle instances, sub-optimal tiers, and unused bandwidth.",
            },
            {
              title: "Performance & Workload Tuning",
              icon: "i-sliders",
              desc: "Tune database indexes, caching layers, and container memory limits to deliver maximum application speed while shrinking compute footprint.",
            },
            {
              title: "Reservation & Savings Strategy",
              icon: "i-cpu",
              span: true,
              desc: "Structure committed use discounts, Savings Plans, and Spot instance workflows to lower recurring cloud expenditure without sacrificing availability.",
            },
          ],
        },
      ],
    },
    {
      id: "sre-native",
      eyebrow: "Practice Domain 03",
      title: "Site Reliability (SRE) & Cloud-Native Platforms",
      desc: "Round-the-clock production operations, automated disaster recovery, and resilient API microservices.",
      services: [
        {
          id: "support",
          number: "08",
          badge: "Managed SRE",
          title: "24/7 Managed Support & Disaster Recovery",
          icon: "i-server",
          impact: "Rapid incident triage and automated failover orchestration",
          summary:
            "Dedicated engineering care ensuring high availability, continuous health monitoring, and enterprise disaster recovery safeguarding all data.",
          btnText: "Engage 24/7 SRE Support",
          contactTopic: "Cloud and Infrastructure",
          techStack: [
            "24/7 Monitoring",
            "Incident Response",
            "Automated Failover",
            "Runbook Automation",
            "Health Telemetry",
          ],
          capabilities: [
            {
              title: "24/7/365 SRE Operations",
              icon: "i-clock",
              desc: "Round-the-clock incident response, proactive uptime monitoring, and rapid triage runbooks for critical production alerts.",
            },
            {
              title: "Backup & Disaster Recovery (DR)",
              icon: "i-shield",
              desc: "Design and validate multi-region failover playbooks with verified Recovery Time Objective (RTO) and Recovery Point Objective (RPO) targets.",
            },
          ],
        },
        {
          id: "native",
          number: "09",
          badge: "Cloud-Native",
          title: "Cloud-Native Software Engineering",
          icon: "i-code",
          impact: "High-throughput containerized microservices and API gateways",
          summary:
            "Build and modernize resilient, scalable software engineered specifically for the cloud using modern container frameworks and clean APIs.",
          btnText: "Build Cloud-Native Apps",
          contactTopic: "Cloud and Infrastructure",
          techStack: [
            "TypeScript / Node.js",
            "Go & Python",
            "REST & GraphQL",
            "Kafka Event Streams",
            "Containerized APIs",
          ],
          capabilities: [
            {
              title: "Modern Application Engineering",
              icon: "i-code",
              desc: "Design and build resilient, test-driven applications leveraging cloud-native paradigms, asynchronous messaging, and horizontal scalability.",
            },
            {
              title: "Enterprise API Design & Gateway Management",
              icon: "i-workflow",
              desc: "Implement secure, high-throughput REST and GraphQL APIs with rate limiting, JWT token authorization, and automated developer documentation.",
            },
          ],
        },
      ],
    },
    {
      id: "staffing",
      eyebrow: "Practice Domain 04",
      title: "Engineering Staffing & Dedicated Pods",
      desc: "Scale engineering velocity without recruiting lag by embedding senior cloud architects, DevOps leads, and data specialists directly into your delivery cycles.",
      services: [
        {
          id: "staffing",
          aliasId: "consulting-staffing",
          number: "10",
          badge: "Talent & Embedded Pods",
          title: "Engineering Staffing & Dedicated Pods",
          icon: "i-users",
          impact: "Pre-vetted senior engineering practitioners embedded into your delivery cycles",
          summary:
            "Eliminate months of recruiting lag. Pre-vetted senior cloud architects, DevOps leads, and data specialists embedded directly into your agile delivery cycles with full team enablement.",
          btnText: "Request Engineering Talent",
          contactTopic: "IT Staffing and Talent",
          techStack: [
            "Cloud & DevOps Pods",
            "Embedded Data Analysts",
            "Senior Cloud Architects",
            "Contract-to-Hire",
            "Co-Managed Handover",
          ],
          capabilities: [
            {
              title: "Dedicated Cloud & DevOps Squads",
              icon: "i-users",
              desc: "Deploy cohesive cross-functional engineering pods ready to deliver migrations, Kubernetes rollouts, or CI/CD automation immediately.",
            },
            {
              title: "Embedded Data Engineers & BI Analysts",
              icon: "i-chart",
              desc: "Strengthen product and leadership teams with hands-on SQL, Python, warehouse modeling, and Power BI / Tableau reporting specialists.",
            },
            {
              title: "Flexible Sprint Scaling & Contract-to-Hire",
              icon: "i-briefcase",
              span: true,
              desc: "Scale engineering capacity up or down around critical launch windows, with clean pathways to transition vetted talent to full-time internal roles.",
            },
          ],
        },
      ],
    },
  ];

  const industries = [
    {
      title: "Healthcare & Life Sciences",
      standard: "Healthcare Data Safeguards",
      desc: "Encrypted PHI data lakes, secure clinical APIs, business associate agreement (BAA) alignments, and zero-trust patient portal architectures.",
      topic: "Cybersecurity and Protection",
    },
    {
      title: "Financial Services & Fintech",
      standard: "Payment Security & Audit Baselines",
      desc: "Real-time fraud detection pipelines, immutable transaction ledgers, encrypted payment gateways, and automated regulatory reporting.",
      topic: "Cloud and Infrastructure",
    },
    {
      title: "Retail & E-Commerce",
      standard: "High-Concurrency Scalability",
      desc: "Dynamic auto-scaling Kubernetes clusters, multi-region CDN edge caching, and resilient inventory microservices built for peak concurrency.",
      topic: "Cloud and Infrastructure",
    },
    {
      title: "Higher Education & Research",
      standard: "FERPA & Single Sign-On",
      desc: "Campus-wide identity federation, centralized student data platforms, and research computing clusters with granular access governance.",
      topic: "Data and Analytics",
    },
    {
      title: "Public Sector & Civil Systems",
      standard: "Data Sovereignty & Governance",
      desc: "Sovereign cloud deployments, strict role-based access management, and civil service workforce enablement aligned with regional digital mandates.",
      topic: "IT Consulting and Strategy",
    },
  ];

  return (
    <main id="main">
      {/* ============ EXECUTIVE HERO ============ */}
      <section className="svc-hero">
        <div className="container">
          <ol className="crumbs" aria-label="Breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Services</li>
          </ol>
          <div className="svc-hero-header">
            <span className="svc-hero-eyebrow">Enterprise Cloud &amp; Engineering Practices</span>
            <h1>Engineering Scalable, Secure Cloud Architectures</h1>
            <p>
              From zero-downtime migrations and automated GitOps delivery pipelines to FinOps cost
              governance, dedicated engineering pods, and 24/7/365 managed SRE operations. We build
              resilient systems engineered for regulated enterprise scale with complete operational ownership.
            </p>
          </div>

          <div className="svc-hero-actions">
            <Link href="/contact?service=Cloud+and+Infrastructure#enquiry" className="btn btn-gold btn-lg">
              Request Technical Consultation
            </Link>
            <a href="#cloud" className="btn btn-ghost btn-lg">
              Explore Practice Domains
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="svc-hero-metrics">
            <div className="svc-hero-metric">
              <span className="svc-metric-val">AWS / Azure / GCP</span>
              <span className="svc-metric-lbl">Multi-Cloud Solutions Architects</span>
            </div>
            <div className="svc-hero-metric">
              <span className="svc-metric-val">Zero-Downtime</span>
              <span className="svc-metric-lbl">Validated Cutover Playbooks</span>
            </div>
            <div className="svc-hero-metric">
              <span className="svc-metric-val">High Availability</span>
              <span className="svc-metric-lbl">Fault-Tolerant System Design</span>
            </div>
            <div className="svc-hero-metric">
              <span className="svc-metric-val">Security Baselines</span>
              <span className="svc-metric-lbl">Enterprise Compliance Alignment</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STICKY PRACTICE JUMP BAR ============ */}
      <nav className="svc-jump-bar" aria-label="Practice Navigation">
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

      {/* ============ GROUPED PRACTICE OFFERINGS ============ */}
      {practiceCategories.map((cat) => (
        <div key={cat.id} className="svc-category-group" id={cat.id}>
          {/* Category Pillar Header */}
          <section className="svc-category-band">
            <div className="container">
              <span className="svc-category-eyebrow">{cat.eyebrow}</span>
              <h2>{cat.title}</h2>
              <p>{cat.desc}</p>
            </div>
          </section>

          {/* Category Service Rows */}
          {cat.services.map((svc) => (
            <section key={svc.id} className="svc-section" id={svc.id}>
              {svc.aliasId && (
                <span id={svc.aliasId} className="svc-anchor-alias" aria-hidden="true" />
              )}
              <div className="container svc-grid-row">
                {/* Left Column: Practice Overview */}
                <div className="svc-col-overview">
                  <div className="svc-meta-strip">
                    <span className="svc-phase-idx">{svc.number}</span>
                    <span className="svc-phase-badge">{svc.badge}</span>
                  </div>
                  <h3 className="svc-heading">{svc.title}</h3>

                  {svc.impact && (
                    <div className="svc-impact-pill">
                      <Icon id="i-award" />
                      <span>{svc.impact}</span>
                    </div>
                  )}

                  <p className="svc-desc">{svc.summary}</p>

                  {/* Toolchain & Standards Chips */}
                  <div className="svc-tech-block">
                    <span className="svc-tech-heading">Key Standards &amp; Toolchain</span>
                    <div className="svc-tech-tags">
                      {svc.techStack.map((tech) => (
                        <span key={tech} className="svc-tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="svc-action-wrap">
                    <Link
                      href={`/contact?service=${encodeURIComponent(svc.contactTopic)}#enquiry`}
                      className="btn btn-navy"
                    >
                      {svc.btnText}
                    </Link>
                  </div>
                </div>

                {/* Right Column: Detailed Capability Cards */}
                <div className="svc-col-caps">
                  <div className="svc-cap-cards">
                    {svc.capabilities.map((cap, i) => (
                      <div
                        key={i}
                        className={`svc-cap-card ${cap.span ? "svc-cap-span" : ""}`}
                      >
                        <div className="svc-cap-head">
                          <span className="svc-cap-ico">
                            <Icon id={cap.icon} />
                          </span>
                          <h4>{cap.title}</h4>
                        </div>
                        <p>{cap.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      ))}

      {/* ============ REGULATED INDUSTRY MATRICES ============ */}
      <section className="svc-industries-section" id="industries">
        <div className="container">
          <div className="sec-head reveal">
            <span className="hp-section-tag hp-tag-cyan">Regulated Sector Deployments</span>
            <h2>Tailored High-Compliance Architecture</h2>
            <p>
              Every industry carries distinct operational and regulatory mandates. We tailor our cloud
              deployments to meet the highest international security standards.
            </p>
          </div>

          <div className="svc-industry-grid">
            {industries.map((ind, i) => (
              <article key={i} className="svc-industry-card">
                <span className="svc-industry-std">{ind.standard}</span>
                <h3>{ind.title}</h3>
                <p>{ind.desc}</p>
                <Link
                  href={`/contact?service=${encodeURIComponent(ind.topic)}#enquiry`}
                  className="svc-industry-action"
                >
                  <span>Scope {ind.title.split("&")[0].trim()} Architecture</span>
                  <Icon id="i-arrow-right" />
                </Link>
              </article>
            ))}
          </div>

          {/* Delivery Guarantees Pod */}
          <div className="svc-guarantees-pod">
            <div className="svc-guarantee-item">
              <span className="svc-guarantee-ico">
                <Icon id="i-award" />
              </span>
              <div>
                <h4>Senior Practitioners Only</h4>
                <p>Direct leadership from senior solutions architects with extensive production cloud experience.</p>
              </div>
            </div>

            <div className="svc-guarantee-item">
              <span className="svc-guarantee-ico">
                <Icon id="i-shield" />
              </span>
              <div>
                <h4>Zero-Downtime Cutover Playbooks</h4>
                <p>Thoroughly rehearsed migration cutovers with automated rollbacks protecting business continuity.</p>
              </div>
            </div>

            <div className="svc-guarantee-item">
              <span className="svc-guarantee-ico">
                <Icon id="i-target" />
              </span>
              <div>
                <h4>Clear Service Commitments &amp; Full IP Ownership</h4>
                <p>Agreed uptime and delivery commitments with 100% intellectual property transfer upon delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HIGH-IMPACT CLOSING CTA ============ */}
      <section className="svc-closing-cta">
        <div className="container">
          <div className="svc-cta-card">
            <h2>Ready to Architect Your Cloud Future?</h2>
            <p>
              Connect with our solutions architects to evaluate your architecture, discuss migration pathways,
              or scope a dedicated engineering pod.
            </p>
            <div className="svc-cta-actions">
              <Link href="/contact?service=Cloud+and+Infrastructure#enquiry" className="btn btn-gold btn-lg">
                Book a Technical Consultation
              </Link>
              <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`} className="btn btn-outline-light btn-lg">
                Email Engineering Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
