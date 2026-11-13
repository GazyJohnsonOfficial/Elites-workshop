import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Request a Technical Consultation | ${SITE_CONFIG.COMPANY}`,
  description:
    "Request an enterprise cloud, DevOps, or cybersecurity consultation. Reach our technical advisory desk directly at +1 (609) 304-7571 or submit an inquiry for a guaranteed 1 business day response.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const primaryPhone = SITE_CONFIG.CONTACT.PHONE_DISPLAY;
  const primaryPhoneE164 = SITE_CONFIG.CONTACT.PHONE_E164;
  const whatsappNumber = SITE_CONFIG.CONTACT.WHATSAPP_NUMBER;
  const primaryEmail = SITE_CONFIG.CONTACT.EMAIL;

  const hubs = [
    {
      country: "United States",
      title: "North America Office",
      role: "Global Headquarters & Advisory",
      city: "Medford, NJ, USA",
      timezone: "Eastern Time (UTC-5)",
      hours: "Mon to Fri, 9:00 to 17:00 ET",
      phone: primaryPhone,
      phoneE164: primaryPhoneE164,
      email: primaryEmail,
    },
    {
      country: "United Kingdom",
      title: "United Kingdom Office",
      role: "European Operations & EMEA Delivery",
      city: "Rugby, UK",
      timezone: "Greenwich Mean Time (UTC+0)",
      hours: "Mon to Fri, 9:00 to 17:00 GMT",
      phone: primaryPhone,
      phoneE164: primaryPhoneE164,
      email: primaryEmail,
    },
    {
      country: "Ghana",
      title: "West Africa Office",
      role: "Regional Delivery Hub & Academy",
      city: "Poolside Ave, Takoradi, Ghana",
      timezone: "Greenwich Mean Time (UTC+0)",
      hours: "Mon to Fri, 8:00 to 17:00 GMT",
      phone: primaryPhone,
      phoneE164: primaryPhoneE164,
      email: primaryEmail,
    },
  ];

  return (
    <main id="main">
      {/* ============ EXECUTIVE HERO ============ */}
      <section className="contact-hero">
        <div className="container">
          <ol className="crumbs" aria-label="Breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Contact</li>
          </ol>
          <div className="contact-hero-header">
            <span className="contact-hero-eyebrow">Technical Consultation &amp; Client Inquiries</span>
            <h1>Connect With Our Solutions Architects</h1>
            <p>
              Tell us what your organization is looking to achieve. Whether scoping enterprise cloud
              migration, DevOps automation, cybersecurity governance, or technical training, our senior
              engineering leads respond within one business day.
            </p>
          </div>

          {/* Direct Access Channels Strip */}
          <div className="contact-channels-strip">
            <a href={`tel:${primaryPhoneE164}`} className="contact-channel-card">
              <span className="contact-channel-ico">
                <Icon id="i-phone" />
              </span>
              <div>
                <span className="contact-channel-lbl">Corporate Direct Line</span>
                <span className="contact-channel-val">{primaryPhone}</span>
              </div>
            </a>

            <a href={`mailto:${primaryEmail}`} className="contact-channel-card">
              <span className="contact-channel-ico">
                <Icon id="i-mail" />
              </span>
              <div>
                <span className="contact-channel-lbl">Technical Inquiries</span>
                <span className="contact-channel-val">{primaryEmail}</span>
              </div>
            </a>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-channel-card"
            >
              <span className="contact-channel-ico">
                <Icon id="i-whatsapp" />
              </span>
              <div>
                <span className="contact-channel-lbl">Instant Advisory Desk</span>
                <span className="contact-channel-val">WhatsApp Direct Chat</span>
              </div>
            </a>

            <div className="contact-channel-card">
              <span className="contact-channel-ico">
                <Icon id="i-check" />
              </span>
              <div>
                <span className="contact-channel-lbl">Response Commitment</span>
                <span className="contact-channel-val">1 Business Day SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONSULTATION & ENQUIRY SECTION ============ */}
      <section className="contact-section" id="enquiry">
        <div className="container contact-grid">
          {/* Left Column: Engagement Workflow */}
          <div className="contact-advisory-col">
            <div className="contact-sla-badge">
              <Icon id="i-check" />
              <span>Guaranteed reply within 1 business day</span>
            </div>

            <h2 className="contact-col-title">How Technical Engagements Begin</h2>
            <p className="contact-col-desc">
              Whether you are a regulated enterprise, public institution, growing team, or career professional,
              our engagement path is clear, structured, and transparent.
            </p>

            <ol className="contact-workflow-steps">
              <li className="contact-workflow-step">
                <span className="contact-step-num">01</span>
                <div>
                  <strong>Submit Technical Scope</strong>
                  <p>Choose your area of interest and summarize your architecture goals, current stack, and target timeline.</p>
                </div>
              </li>
              <li className="contact-workflow-step">
                <span className="contact-step-num">02</span>
                <div>
                  <strong>Audit Reference &amp; Assignment</strong>
                  <p>A formal acknowledgement email with a unique tracking reference is generated instantly for your team.</p>
                </div>
              </li>
              <li className="contact-workflow-step">
                <span className="contact-step-num">03</span>
                <div>
                  <strong>Architect Alignment Session</strong>
                  <p>Our solutions architects follow up to review requirements, clarify technical dependencies, and define execution milestones.</p>
                </div>
              </li>
            </ol>

            <div className="contact-direct-box">
              <h4>Prefer a Direct Conversation?</h4>
              <p>
                Speak directly with our solutions advisory desk to discuss organizational goals, staffing requirements, or custom scope.
              </p>
              <div className="contact-direct-actions">
                <a href={`tel:${primaryPhoneE164}`} className="btn btn-navy btn-sm">
                  <Icon id="i-phone" /> Call {primaryPhone}
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <Icon id="i-whatsapp" /> WhatsApp Desk
                </a>
              </div>
            </div>

            <div className="contact-assurance-note">
              <Icon id="i-shield" />
              <p>
                All communications are protected under strict confidentiality. Non-disclosure agreements (NDAs) can be executed prior to detailed technical discovery upon request.
              </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="contact-form-col">
            <div className="contact-form-wrapper">
              <div className="contact-form-header">
                <h3>Request a Consultation</h3>
                <p>Complete this brief form and our engineering team will follow up directly.</p>
              </div>
              <EnquiryForm defaultService={service} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ REGIONAL OPERATING HUBS ============ */}
      <section className="contact-locations-section" id="locations">
        <div className="container">
          <div className="contact-locations-head">
            <div>
              <span className="contact-locations-kicker">Global Operations</span>
              <h2>Regional Operating Offices</h2>
            </div>
            <p>
              Direct regional access and time-zone aligned engineering support across North America, Europe, and West Africa. All offices route through our unified communications system.
            </p>
          </div>

          <div className="contact-hubs-grid">
            {hubs.map((hub, i) => (
              <article key={i} className="contact-hub-card">
                <div className="hub-card-title-block">
                  <span className="hub-card-country">{hub.country}</span>
                  <h3>{hub.title}</h3>
                  <p className="hub-role-text">{hub.role}</p>
                </div>

                <div className="hub-meta-list">
                  <div className="hub-meta-row">
                    <div className="hub-meta-icon">
                      <Icon id="i-pin" />
                    </div>
                    <div className="hub-meta-content">
                      <span className="hub-meta-label">Location</span>
                      <span className="hub-meta-val">{hub.city}</span>
                      <span className="hub-meta-sub">{hub.timezone}</span>
                    </div>
                  </div>

                  <div className="hub-meta-row">
                    <div className="hub-meta-icon">
                      <Icon id="i-clock" />
                    </div>
                    <div className="hub-meta-content">
                      <span className="hub-meta-label">Office Hours</span>
                      <span className="hub-meta-val">{hub.hours}</span>
                    </div>
                  </div>

                  <div className="hub-meta-row">
                    <div className="hub-meta-icon">
                      <Icon id="i-phone" />
                    </div>
                    <div className="hub-meta-content">
                      <span className="hub-meta-label">Phone</span>
                      <a href={`tel:${hub.phoneE164}`} className="hub-meta-link">
                        {hub.phone}
                      </a>
                    </div>
                  </div>

                  <div className="hub-meta-row">
                    <div className="hub-meta-icon">
                      <Icon id="i-mail" />
                    </div>
                    <div className="hub-meta-content">
                      <span className="hub-meta-label">Email Desk</span>
                      <a href={`mailto:${hub.email}`} className="hub-meta-link">
                        {hub.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="hub-actions">
                  <a href={`tel:${hub.phoneE164}`} className="btn btn-navy btn-sm">
                    <Icon id="i-phone" /> Call Office
                  </a>
                  <a href={`mailto:${hub.email}`} className="btn btn-outline btn-sm">
                    <Icon id="i-mail" /> Email Desk
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
