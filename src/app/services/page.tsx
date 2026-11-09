import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Engineering Practices & Cloud Solutions | ${SITE_CONFIG.COMPANY}`,
  description:
    "Accelerate your enterprise with production-grade cloud architectures, zero-downtime migrations, automated DevOps delivery pipelines, FinOps governance, and 24/7 managed SRE support.",
};

export default function ServicesPage() {
  const jumpLinks = [
    { href: "#cloud-strategy", label: "01 Strategy" },
    { href: "#migration", label: "02 Migration" },
    { href: "#architecture", label: "03 Architecture" },
    { href: "#security", label: "04 Security & IAM" },
    { href: "#devops", label: "05 DevOps & CI/CD" },
    { href: "#optimization", label: "06 FinOps & Cost" },
    { href: "#support", label: "07 24/7 SRE & DR" },
    { href: "#native", label: "08 Cloud-Native" },
    { href: "#hybrid", label: "09 Multi-Cloud" },
    { href: "#training-workshops", label: "10 Academy" },
    { href: "#industries", label: "Regulated Sectors" },
  ];

  const services = [
    {
      id: "cloud-strategy",
      number: "01",
      badge: "Cloud Advisory",
      title: "Cloud Strategy & Assessment",
      icon: "i-compass",
      summary:
        "Chart an optimal, risk-free path to the cloud. We evaluate your current technical readiness and build actionable roadmaps aligned with business objectives.",
      btnText: "Request a Readiness Assessment",
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
      title: "Cloud Migration & Modernisation",
      icon: "i-cloud-upload",
      summary:
        "Seamless, secure migration of workloads, applications, and enterprise databases with guaranteed data integrity and zero disruption to business continuity.",
      btnText: "Plan Your Migration",
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
      summary:
        "Engineer high-availability, fault-tolerant cloud environments that scale dynamically with your workload across AWS, Azure, and Google Cloud Platform.",
      btnText: "Design Your Infrastructure",
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
      id: "security",
      number: "04",
      badge: "SecOps & Governance",
      title: "Cloud Security, IAM & Compliance",
      icon: "i-shield",
      summary:
        "Ironclad, multi-layer security safeguarding sensitive corporate data, mitigating threats, and guaranteeing strict compliance with international standards.",
      btnText: "Get a Security Assessment",
      techStack: [
        "SOC 2 Type II",
        "ISO 27001",
        "HIPAA",
        "PCI-DSS",
        "Zero Trust IAM",
        "GuardDuty & Sentinel",
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
          desc: "Implement automated compliance monitoring aligned with HIPAA, SOC 2, ISO 27001, PCI-DSS, and GDPR standards with audit-ready reporting.",
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
      number: "05",
      badge: "GitOps & Automation",
      title: "DevOps & Infrastructure Automation",
      icon: "i-infinity",
      summary:
        "Accelerate your release cycles, enhance engineering collaboration, and eliminate human error with automated pipelines and Infrastructure as Code.",
      btnText: "Automate Your Delivery",
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
          desc: "Define all infrastructure via modular Terraform and CloudFormation manifests for repeatable, version-controlled, and testable deployments.",
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
      number: "06",
      badge: "FinOps & Efficiency",
      title: "Cloud Cost Optimization & FinOps",
      icon: "i-gauge",
      summary:
        "Maximize the return on your cloud investment. We identify inefficiencies, eliminate wasteful spend, and fine-tune resources for peak speed and responsiveness.",
      btnText: "Optimize Your Cloud Spend",
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
          desc: "Structure committed use discounts, Savings Plans, and Spot instance workflows to lock in cost reductions up to 40% without sacrificing availability.",
        },
      ],
    },
    {
      id: "support",
      number: "07",
      badge: "Managed SRE",
      title: "24/7 Managed Support & Disaster Recovery",
      icon: "i-server",
      summary:
        "Dedicated engineering care ensuring high availability, continuous health monitoring, and enterprise disaster recovery safeguarding all data.",
      btnText: "Engage 24/7 SRE Support",
      techStack: [
        "24/7/365 Monitoring",
        "15-Min Critical SLA",
        "Automated Failover",
        "RPO < 5 Min",
        "RTO < 15 Min",
      ],
      capabilities: [
        {
          title: "24/7/365 SRE Operations",
          icon: "i-clock",
          desc: "Round-the-clock incident response, proactive uptime monitoring, and guaranteed 15-minute response SLA for critical production alerts.",
        },
        {
          title: "Backup & Disaster Recovery (DR)",
          icon: "i-shield",
          desc: "Design and validate multi-region failover playbooks with aggressive Recovery Time Objective (RTO) and Recovery Point Objective (RPO) guarantees.",
        },
      ],
    },
    {
      id: "native",
      number: "08",
      badge: "Cloud-Native",
      title: "Cloud-Native Software Engineering",
      icon: "i-code",
      summary:
        "Build and modernize resilient, scalable software engineered specifically for the cloud using modern container frameworks and clean APIs.",
      btnText: "Build Cloud-Native Apps",
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
    {
      id: "hybrid",
      number: "09",
      badge: "Hybrid Infrastructure",
      title: "Multi-Cloud & Hybrid Cloud Solutions",
      icon: "i-layers",
      summary:
        "Eliminate vendor lock-in. Seamlessly integrate your private datacenter, AWS, Microsoft Azure, and Google Cloud into one unified infrastructure.",
      btnText: "Integrate Hybrid Clouds",
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
    {
      id: "training-workshops",
      number: "10",
      badge: "Workforce Enablement",
      title: "Corporate Training & Technical Workshops",
      icon: "i-grad",
      summary:
        "Equip your technical personnel and teams with modern cloud engineering, DevOps, and data analytics competencies through live, practitioner-led masterclasses.",
      btnText: "Request Custom Workshops",
      techStack: [
        "Cloud Architecture Labs",
        "Hands-on DevOps",
        "Data Analysis Academy",
        "SQL & Python",
        "Power BI & Tableau",
      ],
      capabilities: [
        {
          title: "Cloud Best Practices & Architecture Labs",
          icon: "i-compass",
          desc: "Upskill internal engineering staff on resilient architecture design, AWS/Azure service selection, security baselines, and cloud governance protocols.",
        },
        {
          title: "Data Analysis & Business Intelligence Academy",
          icon: "i-chart",
          desc: "Our intensive 12-week training cohort for corporate analysts covering SQL, Python, Excel/VBA, Alteryx, Tableau, and enterprise Power BI modeling.",
        },
      ],
    },
  ];

  const industries = [
    {
      title: "Healthcare & Life Sciences",
      standard: "HIPAA & HITECH Compliance",
      desc: "Encrypted PHI data lakes, secure clinical APIs, business associate agreement (BAA) alignments, and zero-trust patient portal architectures.",
    },
    {
      title: "Financial Services & Fintech",
      standard: "PCI-DSS Level 1 & SOC 2",
      desc: "Real-time fraud detection pipelines, immutable transaction ledgers, encrypted payment gateways, and automated regulatory reporting.",
    },
    {
      title: "Retail & E-Commerce",
      standard: "Sub-Second SLA & Flash Scale",
      desc: "Dynamic auto-scaling Kubernetes clusters, multi-region CDN edge caching, and resilient inventory microservices built for peak concurrency.",
    },
    {
      title: "Higher Education & Research",
      standard: "FERPA & Single Sign-On",
      desc: "Campus-wide identity federation, centralized student data platforms, and research computing clusters with granular access governance.",
    },
    {
      title: "Public Sector & Civil Systems",
      standard: "Data Sovereignty & ISO 27001",
      desc: "Sovereign cloud deployments, strict role-based access management, and civil service workforce enablement aligned with regional digital mandates.",
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
            <span className="svc-hero-eyebrow">Enterprise Cloud &amp; Tactical Capabilities</span>
            <h1>Engineering Scalable, Secure Cloud Architectures</h1>
            <p>
              From zero-downtime migrations and automated GitOps delivery pipelines to FinOps cost
              governance and 24/7/365 managed SRE operations. We build resilient systems engineered
              for regulated enterprise scale.
            </p>
          </div>

          <div className="svc-hero-actions">
            <Link href="/contact#enquiry" className="btn btn-gold btn-lg">
              Request Technical Consultation
            </Link>
            <a href="#cloud-strategy" className="btn btn-ghost btn-lg">
              Browse All 10 Practices
            </a>
          </div>

          {/* Quick Metrics Strip */}
          <div className="svc-hero-metrics">
            <div className="svc-hero-metric">
              <span className="svc-metric-val">AWS / Azure / GCP</span>
              <span className="svc-metric-lbl">Multi-Cloud Certified Architects</span>
            </div>
            <div className="svc-hero-metric">
              <span className="svc-metric-val">Zero-Downtime</span>
              <span className="svc-metric-lbl">Validated Cutover Playbooks</span>
            </div>
            <div className="svc-hero-metric">
              <span className="svc-metric-val">99.99% Availability</span>
              <span className="svc-metric-lbl">Production Architecture SLA</span>
            </div>
            <div className="svc-hero-metric">
              <span className="svc-metric-val">SOC 2 &amp; ISO 27001</span>
              <span className="svc-metric-lbl">Built-In Security &amp; Compliance</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STICKY JUMP BAR ============ */}
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

      {/* ============ SERVICE OFFERINGS ============ */}
      {services.map((svc) => (
        <section key={svc.id} className="svc-section" id={svc.id}>
          <div className="container svc-grid-row">
            {/* Left Column: Practice Overview */}
            <div className="svc-col-overview">
              <div className="svc-meta-strip">
                <span className="svc-phase-idx">{svc.number}</span>
                <span className="svc-phase-badge">{svc.badge}</span>
              </div>
              <h2 className="svc-heading">{svc.title}</h2>
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
                  href={`/contact?service=${encodeURIComponent(svc.title)}#enquiry`}
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
                <p>Direct leadership from certified engineers with over a decade of hands-on cloud experience.</p>
              </div>
            </div>

            <div className="svc-guarantee-item">
              <span className="svc-guarantee-ico">
                <Icon id="i-shield" />
              </span>
              <div>
                <h4>Zero-Downtime Guarantee</h4>
                <p>Thoroughly rehearsed migration cutovers with automated rollbacks protecting business continuity.</p>
              </div>
            </div>

            <div className="svc-guarantee-item">
              <span className="svc-guarantee-ico">
                <Icon id="i-target" />
              </span>
              <div>
                <h4>Strict SLAs &amp; Full IP Ownership</h4>
                <p>Contractual uptime and response commitments with 100% intellectual property transfer upon delivery.</p>
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
              or scope an upcoming engineering engagement.
            </p>
            <div className="svc-cta-actions">
              <Link href="/contact#enquiry" className="btn btn-gold btn-lg">
                Book a Technical Consultation
              </Link>
              <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`} className="btn btn-outline btn-lg">
                Email Engineering Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
