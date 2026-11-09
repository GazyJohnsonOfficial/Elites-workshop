import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `What We Do · Pioneering Digital Transformation | ${SITE_CONFIG.COMPANY}`,
  description:
    "Accelerate your business with cutting-edge cloud solutions, zero-downtime migrations, ironclad cybersecurity, DevOps automation, 24/7 managed support, and industry-specific architectures.",
};

export default function ServicesPage() {
  const services = [
    {
      id: "cloud-strategy",
      title: "Cloud Strategy & Assessment",
      icon: "i-compass",
      summary:
        "Chart an optimal, risk-free path to the cloud. We evaluate your current technical readiness and build actionable roadmaps aligned with business objectives.",
      btnText: "Request a readiness assessment",
      capabilities: [
        {
          title: "Cloud Readiness Assessment",
          icon: "i-target",
          desc: "Evaluate your organization’s cloud maturity, identify gaps, and assess the feasibility of cloud migration. We analyze your infrastructure and business objectives to determine optimal cloud strategies.",
        },
        {
          title: "Cloud Strategy Development",
          icon: "i-compass",
          desc: "Develop a tailored cloud strategy that aligns with your business goals. Our experts create a roadmap for optimizing resources and ensuring a smooth cloud journey for your organization.",
        },
      ],
    },
    {
      id: "migration",
      title: "Cloud Migration",
      icon: "i-cloud-upload",
      summary:
        "Seamless, secure migration of workloads, applications, and enterprise databases with guaranteed data integrity and zero disruption to business continuity.",
      btnText: "Plan your migration",
      capabilities: [
        {
          title: "Migration Planning",
          icon: "i-calendar",
          desc: "We develop a detailed migration plan that outlines the steps, timeline, and resources required to ensure a smooth, efficient, and risk-free transition to the cloud.",
        },
        {
          title: "Data and Application Migration",
          icon: "i-db",
          desc: "Securely migrate your data and applications to the cloud, ensuring minimal downtime and preserving data integrity throughout the process for business continuity.",
        },
        {
          title: "Rehosting, Refactoring, Replatforming",
          icon: "i-repeat",
          span: true,
          desc: "Our team helps you decide between rehosting (lift and shift), refactoring (code optimization), or replatforming (platform migration) based on your business objectives, cost, and time constraints.",
        },
      ],
    },
    {
      id: "architecture",
      title: "Cloud Architecture & Design",
      icon: "i-cloud",
      summary:
        "Engineer high-availability, fault-tolerant cloud environments that scale dynamically with your workload across AWS, Azure, and Google Cloud Platform.",
      btnText: "Design your infrastructure",
      capabilities: [
        {
          title: "Infrastructure Design",
          icon: "i-server",
          desc: "Create a robust, scalable cloud infrastructure tailored to your business needs, ensuring reliability, security, and optimal performance across all operations and workloads.",
        },
        {
          title: "Microservices & Containerization",
          icon: "i-box",
          desc: "Break down complex applications into smaller, independently deployable services. Implement microservices architecture by leveraging containerization technologies to boost productivity.",
        },
        {
          title: "Serverless Architecture",
          icon: "i-cloud",
          span: true,
          desc: "Adopt serverless architecture to eliminate server management, reduce costs, and improve scalability. This allows your team to focus on code and innovation rather than infrastructure.",
        },
      ],
    },
    {
      id: "security",
      title: "Cloud Security, IAM & Compliance",
      icon: "i-shield",
      summary:
        "Ironclad, multi-layer security safeguarding sensitive corporate data, mitigating threats, and guaranteeing strict compliance with international standards.",
      btnText: "Get a security assessment",
      capabilities: [
        {
          title: "Security Assessment",
          icon: "i-shield",
          desc: "We conduct a comprehensive security assessment to identify vulnerabilities and establish robust defences against potential threats within your cloud environment.",
        },
        {
          title: "Compliance and Governance",
          icon: "i-file",
          desc: "Our team implements strict compliance and governance frameworks to meet industry regulations (HIPAA, SOC 2, ISO 27001, PCI-DSS, GDPR) and ensure your cloud environment meets all legal standards.",
        },
        {
          title: "Identity and Access Management (IAM)",
          icon: "i-key",
          span: true,
          desc: "Manage and control access to your cloud resources with IAM solutions, ensuring that only authorized users have access to critical data and systems.",
        },
      ],
    },
    {
      id: "devops",
      title: "DevOps & Automation",
      icon: "i-infinity",
      summary:
        "Accelerate your release cycles, enhance engineering collaboration, and eliminate human error with automated pipelines and Infrastructure as Code.",
      btnText: "Automate your delivery",
      capabilities: [
        {
          title: "DevOps Strategy & Assessment",
          icon: "i-target",
          desc: "Optimize your development pipeline with our customized DevOps strategy and assessment, aligning processes and tools to accelerate delivery and enhance collaboration.",
        },
        {
          title: "CI/CD Pipelines",
          icon: "i-git-branch",
          desc: "Implement continuous integration and continuous deployment (CI/CD) pipelines to automate the software development process. This enables faster releases and reduces time to market.",
        },
        {
          title: "Infrastructure as Code (IaC)",
          icon: "i-terminal",
          desc: "Automate infrastructure management with Infrastructure as Code (IaC) using Terraform and CloudFormation, allowing consistent, repeatable, and scalable deployments while reducing human error.",
        },
        {
          title: "Containerization & Orchestration",
          icon: "i-box",
          desc: "Deploy, manage, and scale applications seamlessly with our containerization and orchestration services using Docker and Kubernetes. Ensure flexibility and consistency in your cloud environment.",
        },
        {
          title: "Configuration Management",
          icon: "i-sliders",
          desc: "Efficiently manage your infrastructure with our configuration management solutions, ensuring consistent environments and streamlining updates across your cloud systems.",
        },
        {
          title: "Automation and Scripting",
          icon: "i-code",
          desc: "Simplify repetitive tasks with our automation and scripting services, boosting productivity and reliability while minimizing manual intervention in your cloud operations.",
        },
        {
          title: "Monitoring and Logging",
          icon: "i-eye",
          span: true,
          desc: "We deploy comprehensive monitoring and logging solutions to track system performance, identify issues proactively, and ensure continuous availability and reliability.",
        },
      ],
    },
    {
      id: "optimization",
      title: "Cloud Optimization",
      icon: "i-gauge",
      summary:
        "Maximize the return on your cloud investment. We identify inefficiencies, eliminate wasteful spend, and fine-tune resources for peak speed and responsiveness.",
      btnText: "Optimize your cloud",
      capabilities: [
        {
          title: "Cost Optimization",
          icon: "i-gauge",
          desc: "Analyze and optimize cloud spending by identifying inefficiencies, rightsizing resources, and eliminating waste to ensure you get the maximum value from your cloud investments.",
        },
        {
          title: "Performance Tuning",
          icon: "i-sliders",
          desc: "Enhance the performance of your cloud environment by fine-tuning applications and infrastructure to ensure optimal speed and user experience across all services.",
        },
        {
          title: "Resource Management",
          icon: "i-cpu",
          span: true,
          desc: "Efficiently manage cloud resources to balance workload demands, avoid over-provisioning, and ensure that your cloud environment is both cost-effective and responsive.",
        },
      ],
    },
    {
      id: "support",
      title: "Reliable Support & Disaster Recovery",
      icon: "i-server",
      summary:
        "24/7 dedicated engineering care ensuring high availability, continuous health monitoring, and enterprise disaster recovery safeguarding all data.",
      btnText: "Get 24/7 support",
      capabilities: [
        {
          title: "Around-the-Clock Care (24/7)",
          icon: "i-clock",
          desc: "Receive 24/7 support and monitoring to ensure your systems are always secure and operational, no matter the time.",
        },
        {
          title: "Backup & Disaster Recovery",
          icon: "i-shield",
          desc: "Safeguard your data with reliable backup and disaster recovery, minimizing downtime and guaranteeing business continuity with rapid failover.",
        },
      ],
    },
    {
      id: "native",
      title: "Cloud-Native Development",
      icon: "i-code",
      summary:
        "Build and modernize resilient, scalable software engineered specifically for the cloud using modern container frameworks and clean APIs.",
      btnText: "Build cloud-native apps",
      capabilities: [
        {
          title: "Application Development",
          icon: "i-code",
          desc: "We offer the development and deployment of cloud-native applications using modern development frameworks and methodologies. This improves scalability and enhances user experience.",
        },
        {
          title: "API Management",
          icon: "i-workflow",
          desc: "Design, develop, and manage APIs to enable seamless integration between applications and services with us. Ensure API security and efficient data flow across your cloud environment.",
        },
      ],
    },
    {
      id: "hybrid",
      title: "Multi-Cloud & Hybrid Cloud Solutions",
      icon: "i-layers",
      summary:
        "Eliminate vendor lock-in. Seamlessly integrate your private datacenter, AWS, Microsoft Azure, and Google Cloud into one unified infrastructure.",
      btnText: "Integrate hybrid clouds",
      capabilities: [
        {
          title: "Hybrid Cloud Integration",
          icon: "i-layers",
          span: true,
          desc: "We integrate your existing systems with public and private clouds, enabling flexibility, scalability, and optimized resource utilization across your entire IT environment.",
        },
      ],
    },
    {
      id: "training-workshops",
      title: "Training & Workshops",
      icon: "i-grad",
      summary:
        "Equip your technical personnel and teams with modern cloud engineering, DevOps, and data analytics competencies through live, practitioner-led masterclasses.",
      btnText: "Request custom workshops",
      capabilities: [
        {
          title: "Cloud Best Practices & Architecture",
          icon: "i-compass",
          desc: "Upskill internal staff on resilient architecture design, AWS/Azure service selection, security baselines, and cloud governance protocols.",
        },
        {
          title: "Data Analysis & Business Intelligence Academy",
          icon: "i-chart",
          desc: "Our flagship 12-week intensive training for analysts and career changers covering SQL, Python, Excel/VBA, Alteryx, Tableau, and Power BI.",
        },
      ],
    },
  ];

  return (
    <main id="main">
      {/* ============ HERO ============ */}
      <section className="phero">
        <div className="container">
          <ol className="crumbs" aria-label="Breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Services</li>
          </ol>
          <p className="eyebrow">Enterprise Cloud &amp; IT Solutions</p>
          <h1>What We Do · Pioneering Digital Transformation</h1>
          <p>
            Accelerate your business with cutting-edge cloud solutions. We help drive your growth through
            high-speed architectures, ironclad security, and tailored solutions aligned with your goals.
            With over 20 years of proven expertise, discover how our cloud and IT capabilities optimize your
            operations.
          </p>
          <div className="ahero-actions">
            <Link href="/contact#enquiry" className="btn btn-gold btn-lg">
              Get Started at Zero Cost (Free Consultation)
            </Link>
            <a href="#cloud-strategy" className="btn btn-ghost btn-lg">
              Explore all services
            </a>
          </div>
        </div>
      </section>

      {/* ============ SERVICE OFFERINGS ============ */}
      {services.map((svc) => (
        <section key={svc.id} className="svc-sec" id={svc.id}>
          <div className="container svc-row">
            <div className="reveal">
              <span className="svc-ico">
                <Icon id={svc.icon} />
              </span>
              <h2>{svc.title}</h2>
              <p>{svc.summary}</p>
              <Link
                href={`/contact?service=${encodeURIComponent(svc.title)}#enquiry`}
                className="btn btn-navy"
              >
                {svc.btnText}
              </Link>
            </div>
            <div className="reveal">
              <div className="cap-grid">
                {svc.capabilities.map((cap, i) => (
                  <div key={i} className={`cap-item ${cap.span ? "cap-span" : ""}`}>
                    <h4>
                      <span className="cap-ico">
                        <Icon id={cap.icon} />
                      </span>
                      {cap.title}
                    </h4>
                    <p>{cap.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ============ INDUSTRY-SPECIFIC SOLUTIONS ============ */}
      <section className="section section-tint" id="industries">
        <div className="container">
          <div className="sec-head reveal">
            <p className="eyebrow">Tailored Implementations</p>
            <h2>Industry-Specific Solutions</h2>
            <p>
              Every industry carries distinct operational and compliance mandates. We tailor our cloud
              deployments to meet the highest regulatory standards.
            </p>
          </div>

          <div className="svc-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <article className="svc reveal">
              <h3>Healthcare</h3>
              <p>
                HIPAA-compliant cloud hosting, encrypted patient portals, and automated clinical data
                pipelines ensuring PHI security and high availability.
              </p>
            </article>

            <article className="svc reveal">
              <h3>Finance</h3>
              <p>
                PCI-DSS aligned transaction architectures, fraud monitoring pipelines, and immutable audit
                logging for banks, fintechs, and asset managers.
              </p>
            </article>

            <article className="svc reveal">
              <h3>Retail &amp; E-Commerce</h3>
              <p>
                Elastic auto-scaling cloud architectures engineered to handle massive flash-sale traffic
                spikes with sub-second response times.
              </p>
            </article>

            <article className="svc reveal">
              <h3>Education</h3>
              <p>
                Unified campus learning management systems (LMS), student data platforms, and secure single
                sign-on infrastructure for universities and schools.
              </p>
            </article>

            <article className="svc reveal">
              <h3>Public Sector</h3>
              <p>
                Sovereign government cloud architectures, data residency compliance, and civil service
                workforce upskilling for public administration.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="cta">
        <div className="container reveal">
          <h2>Ready to Accelerate Your Digital Transformation?</h2>
          <p>
            Share an overview of your systems and project timeline. Our senior solutions architects will
            respond within one business day.
          </p>
          <div className="ahero-actions">
            <Link href="/contact#enquiry" className="btn btn-gold btn-lg">
              Book a Free Consultation
            </Link>
            <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`} className="btn btn-outline btn-lg">
              Email Our Cloud Team
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
