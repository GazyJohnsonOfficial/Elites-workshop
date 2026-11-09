import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { HomeHero } from "@/components/HomeHero";

export default function HomePage() {
  return (
    <main id="main">
      {/* ============ 1. HERO ============ */}
      <HomeHero />

      {/* ============ 2. CORE PRACTICE AREAS ============ */}
      <section className="section hp-services-section" id="services">
        <div className="container">
          <div className="hp-sec-intro reveal">
            <p className="hp-tag">Core Practice Areas</p>
            <h2>Technology Support from Assessment to Operations</h2>
            <p>
              Engage our senior engineering teams for targeted architectural reviews, full delivery lifecycles, or managed operational governance. We build resilient, transparent systems your organization can operate independently.
            </p>
          </div>

          <div className="hp-practice-grid">
            {/* Practice 01 */}
            <Link className="hp-practice-card reveal" href="/services#cloud-strategy">
              <div className="hp-practice-top">
                <div className="hp-practice-icon-box" aria-hidden="true">
                  <Icon id="i-cloud" />
                </div>
                <div className="hp-practice-meta">
                  <span className="hp-practice-index">Practice 01</span>
                  <span className="hp-practice-cat">Cloud Architecture</span>
                </div>
              </div>
              <h3>Cloud Strategy, Migration &amp; Hybrid Infrastructure</h3>
              <p>
                Assess legacy workloads, determine optimal cloud economics, and execute phased cutovers across AWS, Azure, and Google Cloud with verified zero-downtime rollbacks.
              </p>
              <ul className="hp-practice-list">
                <li>
                  <Icon id="i-check" />
                  <span>Workload readiness audit and total cost of ownership (TCO)</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>Multi-cloud and hybrid infrastructure design</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>Phased data cutovers and automated failover testing</span>
                </li>
              </ul>
              <div className="hp-practice-tags">
                <span>AWS</span>
                <span>Microsoft Azure</span>
                <span>Google Cloud</span>
                <span>Hybrid Cloud</span>
              </div>
              <span className="hp-practice-cta">
                Explore Cloud Practices <Icon id="i-arrow-right" />
              </span>
            </Link>

            {/* Practice 02 */}
            <Link className="hp-practice-card reveal" href="/services#security">
              <div className="hp-practice-top">
                <div className="hp-practice-icon-box" aria-hidden="true">
                  <Icon id="i-shield" />
                </div>
                <div className="hp-practice-meta">
                  <span className="hp-practice-index">Practice 02</span>
                  <span className="hp-practice-cat">Security &amp; Governance</span>
                </div>
              </div>
              <h3>Cybersecurity, Identity (IAM) &amp; Compliance</h3>
              <p>
                Harden perimeter defences, eliminate identity vulnerabilities, and implement continuous compliance controls aligned with ISO 27001, SOC 2, and GDPR standards.
              </p>
              <ul className="hp-practice-list">
                <li>
                  <Icon id="i-check" />
                  <span>Zero Trust architecture and least-privilege IAM controls</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>Automated vulnerability scanning and penetration audits</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>Regulatory compliance frameworks (HIPAA, SOC 2, PCI-DSS)</span>
                </li>
              </ul>
              <div className="hp-practice-tags">
                <span>Zero Trust</span>
                <span>Cloud IAM</span>
                <span>SOC 2</span>
                <span>ISO 27001</span>
              </div>
              <span className="hp-practice-cta">
                Explore Security Practices <Icon id="i-arrow-right" />
              </span>
            </Link>

            {/* Practice 03 */}
            <Link className="hp-practice-card reveal" href="/services#devops">
              <div className="hp-practice-top">
                <div className="hp-practice-icon-box" aria-hidden="true">
                  <Icon id="i-cpu" />
                </div>
                <div className="hp-practice-meta">
                  <span className="hp-practice-index">Practice 03</span>
                  <span className="hp-practice-cat">Automation &amp; FinOps</span>
                </div>
              </div>
              <h3>DevOps Automation, CI/CD &amp; Cloud Cost Optimisation</h3>
              <p>
                Accelerate software releases with automated pipelines and Infrastructure as Code while rightsizing cloud resources to eliminate wasteful spending.
              </p>
              <ul className="hp-practice-list">
                <li>
                  <Icon id="i-check" />
                  <span>Infrastructure as Code (IaC) via Terraform and CloudFormation</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>Container orchestration with Docker and Kubernetes</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>FinOps resource governance and continuous cost rightsizing</span>
                </li>
              </ul>
              <div className="hp-practice-tags">
                <span>Terraform</span>
                <span>Kubernetes</span>
                <span>CI/CD</span>
                <span>FinOps</span>
              </div>
              <span className="hp-practice-cta">
                Explore DevOps &amp; FinOps <Icon id="i-arrow-right" />
              </span>
            </Link>

            {/* Practice 04 */}
            <Link className="hp-practice-card reveal" href="/services#training-workshops">
              <div className="hp-practice-top">
                <div className="hp-practice-icon-box" aria-hidden="true">
                  <Icon id="i-chart" />
                </div>
                <div className="hp-practice-meta">
                  <span className="hp-practice-index">Practice 04</span>
                  <span className="hp-practice-cat">Analytics &amp; Enablement</span>
                </div>
              </div>
              <h3>Data Engineering, Analytics &amp; Workforce Training</h3>
              <p>
                Consolidate enterprise data into resilient analytics pipelines, automated executive dashboards, and hands-on technical upskilling for internal engineering teams.
              </p>
              <ul className="hp-practice-list">
                <li>
                  <Icon id="i-check" />
                  <span>Automated ETL pipelines, data warehousing, and modeling</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>Executive dashboards in Power BI, Tableau, and SQL</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>Tailored corporate workshops for engineers and analysts</span>
                </li>
              </ul>
              <div className="hp-practice-tags">
                <span>SQL</span>
                <span>Python</span>
                <span>Power BI</span>
                <span>ETL Pipelines</span>
              </div>
              <span className="hp-practice-cta">
                Explore Data &amp; Enablement <Icon id="i-arrow-right" />
              </span>
            </Link>
          </div>

          {/* ============ TACTICAL & SPECIALISED CAPABILITIES BAR ============ */}
          <div className="hp-services-adjunct reveal">
            <div className="hp-adjunct-header">
              <div>
                <span className="hp-adjunct-kicker">Extended Capabilities</span>
                <h3>Specialised Tactical &amp; Operational Engagements</h3>
              </div>
              <p>
                Beyond strategic consultancy, we deploy dedicated engineering squads, SLA-backed managed systems, and rapid technical resources to support day-to-day enterprise demands.
              </p>
            </div>

            <div className="hp-adjunct-grid">
              <Link className="hp-adjunct-card" href="/services#support">
                <div className="hp-adjunct-card-top">
                  <div className="hp-adjunct-icon" aria-hidden="true">
                    <Icon id="i-users" />
                  </div>
                  <span className="hp-adjunct-card-badge">Staff Pods</span>
                </div>
                <h4>IT Staff Augmentation</h4>
                <p>
                  Certified cloud engineers and analysts embedded directly into your sprint cycles.
                </p>
                <ul className="hp-adjunct-checklist">
                  <li>
                    <Icon id="i-check" />
                    <span>Senior engineers integrated into team workflows</span>
                  </li>
                  <li>
                    <Icon id="i-check" />
                    <span>Rapid onboarding for project crunches</span>
                  </li>
                </ul>
                <span className="hp-adjunct-link">
                  Explore Augmentation <Icon id="i-arrow-right" />
                </span>
              </Link>

              <Link className="hp-adjunct-card" href="/services#support">
                <div className="hp-adjunct-card-top">
                  <div className="hp-adjunct-icon" aria-hidden="true">
                    <Icon id="i-server" />
                  </div>
                  <span className="hp-adjunct-card-badge">24/7 SRE</span>
                </div>
                <h4>24/7 Managed Operations</h4>
                <p>
                  Proactive health monitoring, rapid incident response, and SLA-backed infrastructure care.
                </p>
                <ul className="hp-adjunct-checklist">
                  <li>
                    <Icon id="i-check" />
                    <span>Continuous telemetry, log auditing and alerts</span>
                  </li>
                  <li>
                    <Icon id="i-check" />
                    <span>Tier-2 and tier-3 incident resolution</span>
                  </li>
                </ul>
                <span className="hp-adjunct-link">
                  Explore Managed Ops <Icon id="i-arrow-right" />
                </span>
              </Link>

              <Link className="hp-adjunct-card" href="/services#support">
                <div className="hp-adjunct-card-top">
                  <div className="hp-adjunct-icon" aria-hidden="true">
                    <Icon id="i-db" />
                  </div>
                  <span className="hp-adjunct-card-badge">BCDR</span>
                </div>
                <h4>Disaster Recovery &amp; Backup</h4>
                <p>
                  Automated multi-region replication, continuous backups, and rapid failover runbooks.
                </p>
                <ul className="hp-adjunct-checklist">
                  <li>
                    <Icon id="i-check" />
                    <span>Automated cross-region data replication</span>
                  </li>
                  <li>
                    <Icon id="i-check" />
                    <span>Documented and verified failover simulations</span>
                  </li>
                </ul>
                <span className="hp-adjunct-link">
                  Explore Disaster Recovery <Icon id="i-arrow-right" />
                </span>
              </Link>

              <Link className="hp-adjunct-card" href="/services#support">
                <div className="hp-adjunct-card-top">
                  <div className="hp-adjunct-icon" aria-hidden="true">
                    <Icon id="i-laptop" />
                  </div>
                  <span className="hp-adjunct-card-badge">Turnkey</span>
                </div>
                <h4>Hardware &amp; Network Logistics</h4>
                <p>
                  Enterprise network design, datacenter hardware setups, and device deployments.
                </p>
                <ul className="hp-adjunct-checklist">
                  <li>
                    <Icon id="i-check" />
                    <span>Datacenter rack, stack and SDN configuration</span>
                  </li>
                  <li>
                    <Icon id="i-check" />
                    <span>Enterprise device procurement and staging</span>
                  </li>
                </ul>
                <span className="hp-adjunct-link">
                  Explore Infrastructure <Icon id="i-arrow-right" />
                </span>
              </Link>
            </div>

            <div className="hp-adjunct-bottom">
              <div className="hp-adjunct-actions">
                <Link href="/services" className="btn btn-navy">
                  Explore Complete 10-Service Directory <Icon id="i-arrow-right" />
                </Link>
                <Link href="/contact#enquiry" className="btn btn-outline">
                  Request Tactical Support
                </Link>
              </div>
              <div className="hp-adjunct-assurance">
                <Icon id="i-shield" />
                <span>Transparent scopes, verified NDAs, and flexible monthly engagements.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. WHY CHOOSE US ============ */}
      <section className="section section-tint hp-why-section" id="why-us">
        <div className="container hp-why-grid">
          <div className="hp-why-copy reveal">
            <p className="hp-tag">Why Elites Tech Solutions</p>
            <h2>Built for Long-Term Reliability, Cost Clarity, and Full Client Ownership</h2>
            <p>
              Most IT consultancies engineer long-term dependence. We do the opposite. We design transparent, well-documented cloud architectures and train your internal personnel so your team maintains complete operational autonomy.
            </p>

            <div className="hp-why-commitments">
              <div className="hp-why-commit-item">
                <span className="hp-why-commit-icon" aria-hidden="true">
                  <Icon id="i-lock" />
                </span>
                <div>
                  <strong>Zero Vendor Lock-In</strong>
                  <span>Open standards, standard IaC, and 100% client source code ownership.</span>
                </div>
              </div>
              <div className="hp-why-commit-item">
                <span className="hp-why-commit-icon" aria-hidden="true">
                  <Icon id="i-compass" />
                </span>
                <div>
                  <strong>Senior Engineering Direct Access</strong>
                  <span>Direct collaboration with senior architects without junior delegation.</span>
                </div>
              </div>
            </div>

            <div className="hp-why-cta">
              <Link href="/about" className="btn btn-navy">
                Learn More About Our Firm <Icon id="i-arrow-right" />
              </Link>
              <Link href="#approach" className="btn btn-outline">
                Our Delivery Methodology
              </Link>
            </div>
          </div>

          <div className="hp-benefit-grid reveal">
            <article className="hp-benefit-card">
              <div className="hp-benefit-top">
                <div className="hp-benefit-icon" aria-hidden="true">
                  <Icon id="i-lock" />
                </div>
                <span className="hp-benefit-badge">100% Client IP</span>
              </div>
              <h3>Full Client Ownership</h3>
              <p>
                We favour open, documented standards and ensure full client ownership of all source code, configurations, architecture diagrams, and administrative credentials from day one.
              </p>
              <ul className="hp-benefit-points">
                <li>
                  <Icon id="i-check" />
                  <span>Open-standard Terraform and cloud-native IaC</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>Unrestricted access to all repositories and keys</span>
                </li>
              </ul>
            </article>

            <article className="hp-benefit-card">
              <div className="hp-benefit-top">
                <div className="hp-benefit-icon" aria-hidden="true">
                  <Icon id="i-target" />
                </div>
                <span className="hp-benefit-badge">Predictable FinOps</span>
              </div>
              <h3>Clear Cost Decisions</h3>
              <p>
                We review cloud resource use, compute sizing, and licensing models, explaining practical trade-offs so executive leadership can make informed spending decisions.
              </p>
              <ul className="hp-benefit-points">
                <li>
                  <Icon id="i-check" />
                  <span>Transparent cloud spend models before deployment</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>Continuous rightsizing and reserved instance guidance</span>
                </li>
              </ul>
            </article>

            <article className="hp-benefit-card">
              <div className="hp-benefit-top">
                <div className="hp-benefit-icon" aria-hidden="true">
                  <Icon id="i-shield" />
                </div>
                <span className="hp-benefit-badge">Zero Trust</span>
              </div>
              <h3>Security Considered Early</h3>
              <p>
                We build security and compliance directly into the architecture foundations, integrating least-privilege access, encryption at rest, and automated audit controls.
              </p>
              <ul className="hp-benefit-points">
                <li>
                  <Icon id="i-check" />
                  <span>Zero Trust identity and least-privilege IAM policies</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>Compliance alignment for SOC 2, ISO 27001, and HIPAA</span>
                </li>
              </ul>
            </article>

            <article className="hp-benefit-card">
              <div className="hp-benefit-top">
                <div className="hp-benefit-icon" aria-hidden="true">
                  <Icon id="i-user-check" />
                </div>
                <span className="hp-benefit-badge">Full Autonomy</span>
              </div>
              <h3>Complete Knowledge Transfer</h3>
              <p>
                Every engagement culminates in comprehensive delivery handovers, complete operational runbooks, disaster recovery playbooks, and hands-on team mentoring.
              </p>
              <ul className="hp-benefit-points">
                <li>
                  <Icon id="i-check" />
                  <span>Verified production runbooks and architectural ADRs</span>
                </li>
                <li>
                  <Icon id="i-check" />
                  <span>Interactive coaching sessions for internal engineers</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ============ 4. INDUSTRIES WE SERVE ============ */}
      <section className="section" id="sectors">
        <div className="container">
          <div className="hp-approach-head reveal">
            <div>
              <p className="hp-tag">Industries We Serve</p>
              <h2>Technology needs we understand</h2>
            </div>
            <p>
              We tailor our cloud architectures, security governance, and analytics solutions to match
              the operational and regulatory demands of your industry.
            </p>
          </div>

          <div className="hp-sector-cards">
            <article className="hp-sector-card reveal">
              <div className="hp-sector-top">
                <span className="hp-sector-std">Data residency requirements</span>
              </div>
              <h3>Government &amp; Public Institutions</h3>
              <p>
                Cloud, identity and data solutions shaped around public-sector operations and
                residency requirements.
              </p>
            </article>

            <article className="hp-sector-card reveal">
              <div className="hp-sector-top">
                <span className="hp-sector-std">Patient data and privacy needs</span>
              </div>
              <h3>Healthcare &amp; Life Sciences</h3>
              <p>
                Infrastructure and data systems designed with patient information and privacy in mind.
              </p>
            </article>

            <article className="hp-sector-card reveal">
              <div className="hp-sector-top">
                <span className="hp-sector-std">Payment and audit requirements</span>
              </div>
              <h3>Financial Services &amp; Fintech</h3>
              <p>
                Cloud, security and analytics support for financial operations and reporting.
              </p>
            </article>

            <article className="hp-sector-card reveal">
              <div className="hp-sector-top">
                <span className="hp-sector-std">Institutional &amp; Corporate IT</span>
              </div>
              <h3>Higher Education &amp; Corporate</h3>
              <p>
                Modernise systems, improve access, and build practical data skills across teams.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ 5. HOW WE WORK (4-STAGE METHODOLOGY) ============ */}
      <section className="section section-tint hp-process-section" id="approach">
        <div className="container">
          <div className="hp-process-head reveal">
            <div>
              <p className="hp-tag">Delivery Methodology</p>
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
                      <span>Architecture and security review</span>
                    </li>
                    <li>
                      <Icon id="i-check" />
                      <span>Cost, capacity and risk baselines</span>
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

      {/* ============ 6. TRAINING PATHWAY ============ */}
      <section className="section" id="training">
        <div className="container">
          <div className="hp-training-banner reveal">
            <div className="hp-training-copy">
              <span className="hp-tag hp-tag-light">Enablement &amp; Upskilling</span>
              <h2>Practical Technology Training for Teams &amp; Learners</h2>
              <p>
                From corporate staff enablement to our signature live Data Analysis Cohort,
                we deliver hands-on, project-driven training in Excel, SQL, Power BI, Python, and cloud infrastructure.
              </p>
              <div className="hp-training-actions">
                <Link href="/training" className="btn btn-gold">
                  Explore Training Catalog <Icon id="i-arrow-right" />
                </Link>
                <Link href="/data-analysis" className="btn btn-outline-light">
                  Data Analysis Programme <Icon id="i-arrow-right" />
                </Link>
              </div>
            </div>
            <div className="hp-training-features">
              <div className="hp-train-feat-card">
                <span className="hp-feat-icon"><Icon id="i-check" /></span>
                <div>
                  <strong>Corporate Workshops</strong>
                  <p>Tailored curriculum designed around your team&apos;s stack, pipelines, and reporting needs.</p>
                </div>
              </div>
              <div className="hp-train-feat-card">
                <span className="hp-feat-icon"><Icon id="i-check" /></span>
                <div>
                  <strong>Live Instructor Mentorship</strong>
                  <p>Real-time coaching, project code reviews, and structured capstone evaluations.</p>
                </div>
              </div>
              <div className="hp-train-feat-card">
                <span className="hp-feat-icon"><Icon id="i-check" /></span>
                <div>
                  <strong>Career-Ready Projects</strong>
                  <p>Build enterprise dashboards, automated ETL scripts, and production-grade queries.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
