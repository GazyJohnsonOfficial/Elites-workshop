import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_CONFIG.COMPANY}`,
  description:
    "How Elites Tech Solutions LLC collects, processes, protects, and governs personal information across our advisory, staffing, and training operations.",
};

export default function PrivacyPage() {
  return (
    <main id="main">
      <section className="legal-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>
            How Elites Tech Solutions LLC collects, processes, protects, and governs personal
            information across our enterprise advisory, IT staffing, and workforce enablement
            operations.
          </p>
          <div className="legal-meta-bar">
            <span>
              <strong>Last updated:</strong> November 13, 2026
            </span>
            <span>
              <strong>Controller:</strong> {SITE_CONFIG.COMPANY}
            </span>
            <span>
              <strong>Regions:</strong> United States · United Kingdom · Ghana
            </span>
          </div>
        </div>
      </section>

      <div className="container legal-wrap">
        <aside>
          <nav className="toc" aria-label="On this page">
            <h2>On This Page</h2>
            <ol>
              <li><a href="#who">1. Data Controller &amp; Scope</a></li>
              <li><a href="#collect">2. Information We Collect</a></li>
              <li><a href="#use">3. Purpose &amp; Lawful Basis</a></li>
              <li><a href="#providers">4. Service Providers</a></li>
              <li><a href="#transfers">5. Cross-Border Transfers</a></li>
              <li><a href="#retention">6. Data Retention</a></li>
              <li><a href="#rights">7. Your Privacy Rights</a></li>
              <li><a href="#security">8. Information Security</a></li>
              <li><a href="#children">9. Children&apos;s Privacy</a></li>
              <li><a href="#links">10. External Websites</a></li>
              <li><a href="#changes">11. Policy Updates</a></li>
              <li><a href="#contact">12. Contact Us</a></li>
            </ol>

            <div className="toc-related">
              <h3>Related Policies</h3>
              <div className="toc-related-links">
                <Link href="/cookies">Cookie &amp; Storage Policy</Link>
                <Link href="/terms">Terms of Enrolment</Link>
              </div>
            </div>
          </nav>
        </aside>

        <article className="legal">
          <h2 id="who">1. Data Controller &amp; Scope</h2>
          <p>
            {SITE_CONFIG.COMPANY} (&quot;Elites Tech Solutions,&quot; &quot;we,&quot; &quot;us,&quot;
            or &quot;our&quot;) is a technology consulting, engineering delivery, IT staffing, and
            professional training organization serving enterprise and individual clients across the
            United States, the United Kingdom, and Ghana. We act as the data controller for personal
            information collected through this website, our consultation intake workflows, and the{" "}
            {SITE_CONFIG.PROGRAMME.NAME}.
          </p>
          <p>
            This Privacy Policy should be read together with our{" "}
            <Link href="/cookies">Cookie &amp; Browser Storage Policy</Link> and our{" "}
            <Link href="/terms">Terms of Enrolment</Link>.
          </p>

          <h2 id="collect">2. Information We Collect</h2>
          <p>
            We collect only the personal information necessary to respond to client requests,
            administer training admissions, distribute requested technical briefings, and protect
            our systems against misuse.
          </p>

          <h3>Advisory &amp; Consultation Enquiries</h3>
          <ul>
            <li>
              Full name, business email address, regional location, requested service area, and
              project enquiry message.
            </li>
            <li>
              Optional business details where provided, including telephone number and organization
              name.
            </li>
            <li>
              System-generated enquiry reference number, submission timestamp, and recorded privacy
              acknowledgement.
            </li>
          </ul>

          <h3>Data Analysis Programme Registrations</h3>
          <ul>
            <li>
              Full name, email address, phone or WhatsApp contact number, country of residence, job
              title, and prior analytical experience level.
            </li>
            <li>
              Optional context including current organization, tools used, career or training goals,
              and referral source.
            </li>
            <li>
              Your agreement to this Privacy Policy and the Terms of Enrolment, optional preference
              regarding future cohort announcements, registration reference code, and timestamp.
            </li>
          </ul>

          <h3>Executive Briefing Subscriptions &amp; Direct Correspondence</h3>
          <ul>
            <li>
              Work email address voluntarily submitted through our newsletter briefing form.
            </li>
            <li>
              Contact details and message records provided when you initiate direct correspondence
              with our advisory or admissions desks via email or telephone.
            </li>
          </ul>

          <div className="callout">
            <p>
              <strong>No Payment Credentials Collected Online:</strong> This website does not
              process credit cards, bank logins, or direct financial settlements. Please refrain from
              entering government identification numbers, banking account numbers, or confidential
              trade secrets into open text fields.
            </p>
          </div>

          <h2 id="use">3. Purpose &amp; Lawful Basis</h2>
          <p>
            Where applicable data protection law requires a specific legal ground for processing, we
            rely on the lawful bases detailed below:
          </p>
          <div
            className="table-wrap"
            tabIndex={0}
            role="region"
            aria-label="Processing purposes and lawful bases"
          >
            <table>
              <thead>
                <tr>
                  <th>Processing Activity</th>
                  <th>Lawful Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Evaluating, confirming, and administering registrations for the{" "}
                    {SITE_CONFIG.PROGRAMME.NAME}
                  </td>
                  <td>Pre-contractual steps requested by you and performance of enrolment terms</td>
                </tr>
                <tr>
                  <td>
                    Coordinating onboarding instructions, software setup, schedules, and live class
                    access links
                  </td>
                  <td>Performance of our training agreement with you</td>
                </tr>
                <tr>
                  <td>
                    Responding to consulting, engineering delivery, cybersecurity, data, and
                    staffing enquiries
                  </td>
                  <td>
                    Legitimate business interest in responding to prospective clients, or
                    pre-contractual steps
                  </td>
                </tr>
                <tr>
                  <td>
                    Delivering requested executive technology briefings and future cohort notices
                    (opt-in only)
                  </td>
                  <td>Your explicit consent, which you may withdraw at any time</td>
                </tr>
                <tr>
                  <td>
                    Enforcing rate limits, bot mitigation, fraud prevention, and portal access
                    controls
                  </td>
                  <td>Legitimate interest in maintaining platform security and service integrity</td>
                </tr>
                <tr>
                  <td>
                    Maintaining corporate audit trails, tax records, and regulatory documentation
                  </td>
                  <td>Compliance with applicable legal obligations</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            We do not sell personal information, rent contact lists, or share visitor data with
            third-party advertising platforms.
          </p>

          <h2 id="providers">4. Service Providers</h2>
          <p>
            To operate reliably across regions, we engage vetted infrastructure and operational
            service providers under appropriate confidentiality and security obligations. Specifically,
            submitted records are stored within our backend application database, confirmation and
            advisory notifications are routed through configured transactional SMTP email
            infrastructure, live training sessions are hosted via Zoom, and public pages are
            delivered over encrypted web hosting.
          </p>

          <h2 id="transfers">5. Cross-Border Transfers</h2>
          <p>
            Because {SITE_CONFIG.COMPANY} operates across the United States (Medford, NJ), the
            United Kingdom (Rugby), and Ghana (Takoradi), your information may be reviewed or
            processed by authorized personnel across these offices to fulfill your enquiry or
            enrolment. Cross-border processing is governed by technical safeguards and operational
            controls aligned with the UK GDPR, the Ghana Data Protection Act, 2012 (Act 843), and
            applicable United States privacy standards.
          </p>

          <h2 id="retention">6. Data Retention</h2>
          <p>
            We retain personal records strictly for the duration necessary to fulfill the purposes
            outlined in this policy: responding to advisory enquiries, managing active and alumni
            training cohorts, honoring briefing preferences, and meeting statutory legal, tax, and
            accounting obligations. Records no longer required for active operational or compliance
            needs are securely deleted or anonymized upon review or verified request.
          </p>

          <h2 id="rights">7. Your Privacy Rights</h2>
          <p>
            Subject to applicable local law, you may exercise rights to request access to personal
            information we hold about you, request correction of inaccurate fields, request erasure
            or restriction of processing, object to legitimate-interest processing, or withdraw
            previously granted consent for optional briefings at any time. To submit a verified
            privacy request, contact our team using the details in Section 12.
          </p>

          <h2 id="security">8. Information Security</h2>
          <p>
            We maintain layered organizational and technical safeguards designed to protect personal
            information against unauthorized access, disclosure, alteration, or automated misuse:
          </p>
          <ul>
            <li>
              <strong>Encrypted Transport:</strong> All public pages and intake submissions are
              transmitted over encrypted HTTPS/TLS connections.
            </li>
            <li>
              <strong>Application &amp; Browser Hardening:</strong> We apply strict browser security
              policies, server-side input validation, and output sanitization to protect against
              unauthorized script injection and data manipulation.
            </li>
            <li>
              <strong>Anti-Abuse Controls:</strong> Automated request filtering and submission rate
              controls protect our advisory and registration workflows against spam and denial of
              service.
            </li>
            <li>
              <strong>Least-Privilege Access:</strong> Submitted client enquiries and enrolment
              records are isolated behind authenticated, role-restricted access limited strictly to
              authorized personnel on a need-to-know basis.
            </li>
          </ul>

          <h2 id="children">9. Children&apos;s Privacy</h2>
          <p>
            Our consulting services, enterprise engagements, and workforce training programmes are
            intended solely for adult professionals and corporate clients. We do not knowingly
            collect personal information from individuals under the age of 18 (or the applicable age
            of majority in your jurisdiction). If we become aware that information from a minor has
            been submitted without verified authorization, we will promptly purge those records.
          </p>

          <h2 id="links">10. External Websites</h2>
          <p>
            Certain pages on this website provide links to external platforms operated by third
            parties (such as LinkedIn or WhatsApp). Once you leave our domain, your interactions are
            governed by the respective provider&apos;s privacy notice and security practices rather
            than this Privacy Policy.
          </p>

          <h2 id="changes">11. Policy Updates</h2>
          <p>
            We may revise this Privacy Policy periodically to reflect changes in our technical
            controls, service offerings, or regulatory obligations. Material updates will be posted on
            this page with an updated effective date at the top of the document.
          </p>

          <h2 id="contact">12. Contact Us</h2>
          <p>
            To ask questions about this Privacy Policy, exercise your privacy rights, or report a
            security concern, please reach out to our governance desk:
          </p>
          <div className="legal-contact-card">
            <div className="legal-contact-item">
              <span>Data Protection Desk</span>
              <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`}>{SITE_CONFIG.CONTACT.EMAIL}</a>
            </div>
            <div className="legal-contact-item">
              <span>Corporate Telephone</span>
              <a href={`tel:${SITE_CONFIG.CONTACT.PHONE_E164}`}>
                {SITE_CONFIG.CONTACT.PHONE_DISPLAY}
              </a>
            </div>
            <div className="legal-contact-item">
              <span>Regional Offices</span>
              <strong>Medford, NJ · Rugby, UK · Takoradi, GH</strong>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
