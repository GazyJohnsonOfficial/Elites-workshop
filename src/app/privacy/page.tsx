import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_CONFIG.COMPANY}`,
  description:
    "How Elites Tech Solutions LLC collects, uses, and safeguards personal information across our website, services, and programmes.",
};

export default function PrivacyPage() {
  return (
    <main id="main">
      <section className="legal-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>How we collect, use and protect your personal information when you register for the programme or contact us.</p>
          <p className="updated">Last updated: 4 November 2026</p>
        </div>
      </section>

      <div className="container legal-wrap">
        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <ol>
            <li><a href="#who">1. Who we are</a></li>
            <li><a href="#collect">2. Information we collect</a></li>
            <li><a href="#use">3. How we use your information</a></li>
            <li><a href="#providers">4. Email delivery and service providers</a></li>
            <li><a href="#transfers">5. International transfers</a></li>
            <li><a href="#retention">6. How long we keep your information</a></li>
            <li><a href="#rights">7. Your rights</a></li>
            <li><a href="#security">8. How we protect your information</a></li>
            <li><a href="#children">9. Children</a></li>
            <li><a href="#links">10. Links to other sites</a></li>
            <li><a href="#changes">11. Changes to this policy</a></li>
            <li><a href="#contact">12. Contact us</a></li>
          </ol>
        </nav>

        <article className="legal">
          <h2 id="who">1. Who we are</h2>
          <p>
            {SITE_CONFIG.COMPANY} (&quot;we&quot;, &quot;us&quot;) is an IT solutions agency serving organisations and
            individuals in the United States, Ghana and the United Kingdom. We run this website, our
            services and the Data Analysis Programme, and we are responsible for the personal
            information described in this policy.
          </p>
          <p>
            Email <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`}>{SITE_CONFIG.CONTACT.EMAIL}</a> or call{" "}
            <a href={`tel:${SITE_CONFIG.CONTACT.PHONE_E164}`}>{SITE_CONFIG.CONTACT.PHONE_DISPLAY}</a>.
          </p>

          <h2 id="collect">2. Information we collect</h2>
          <h3>When you register</h3>
          <ul>
            <li>Full name, email address, phone or WhatsApp number, country and job title.</li>
            <li>Optional: organisation, experience level, tools you already use, your goals and how you heard about us.</li>
            <li>Your consent choices: agreement to this policy and the Terms of Enrolment (required), and whether you want news about future programmes (optional).</li>
            <li>The date and time of registration and a reference number we generate for you.</li>
          </ul>

          <h3>When you make an enquiry or use a contact form</h3>
          <ul>
            <li>Your name, email address and your message.</li>
            <li>For the enquiry form: your region, the service you are asking about, and, if you choose to give them, your phone number and organisation.</li>
            <li>The date and time of the enquiry and a reference number we generate for you.</li>
          </ul>

          <h3>When you contact us directly</h3>
          <p>Whatever you choose to share by phone, WhatsApp or email.</p>

          <div className="callout">
            <p>
              <strong>We do not collect payment details on this website.</strong> Please do not enter
              sensitive information, such as identity numbers or financial account details, in the
              free-text fields.
            </p>
          </div>

          <h2 id="use">3. How we use your information</h2>
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Purposes and lawful bases">
            <table>
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Basis (where your local law requires one)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Register you, send your confirmation email and manage your place in the programme</td>
                  <td>Taking steps at your request before enrolment</td>
                </tr>
                <tr>
                  <td>Contact you about onboarding, software setup, schedules and Zoom links</td>
                  <td>Taking steps at your request before enrolment; performing our agreement with you</td>
                </tr>
                <tr>
                  <td>Answer your enquiries about consulting, staffing, training and our other services</td>
                  <td>Our legitimate interest in responding to enquiries, or steps you request before entering a contract</td>
                </tr>
                <tr>
                  <td>Send news about future programmes (only if you opted in)</td>
                  <td>Your consent. You can withdraw it at any time</td>
                </tr>
                <tr>
                  <td>Protect this website from spam, abuse and misuse</td>
                  <td>Our legitimate interest in keeping the service secure</td>
                </tr>
                <tr>
                  <td>Keep records and meet legal, tax and accounting obligations</td>
                  <td>Legal obligation</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>We do not sell your personal information, and we do not use it for advertising.</p>

          <h2 id="providers">4. Email delivery and service providers</h2>
          <p>
            When you submit a form, your details are securely stored in our backend database and sent
            through trusted email infrastructure to generate your formal acknowledgement and alert our
            team. We use Zoom to deliver live training sessions, and encrypted hosting to serve this website.
          </p>

          <h2 id="transfers">5. International transfers</h2>
          <p>
            We serve clients across the United States, Ghana and the United Kingdom. Your information
            may be processed in these jurisdictions with appropriate technical and contractual safeguards
            in compliance with the UK GDPR, Ghana DPA 2012, and applicable US privacy laws.
          </p>

          <h2 id="retention">6. How long we keep your information</h2>
          <p>
            We keep registration and enquiry records only as long as necessary to administer programmes,
            maintain operations, and satisfy legal compliance.
          </p>

          <h2 id="rights">7. Your rights</h2>
          <p>
            Depending on your jurisdiction, you have the right to request access, correction, deletion,
            or restriction of your personal data, or to withdraw consent at any time. To exercise these
            rights, contact us at <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`}>{SITE_CONFIG.CONTACT.EMAIL}</a>.
          </p>

          <h2 id="security">8. How we protect your information</h2>
          <ul>
            <li>HTTPS encryption across all endpoints and modern TLS transport.</li>
            <li>Strict Content Security Policy (CSP) and secure HTTP headers.</li>
            <li>Server-side input sanitation and automated anti-abuse defenses.</li>
            <li>Restricted, authenticated access to operational administrative records.</li>
          </ul>

          <h2 id="contact">12. Contact us</h2>
          <p>
            Email: <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`}>{SITE_CONFIG.CONTACT.EMAIL}</a><br />
            Phone: <a href={`tel:${SITE_CONFIG.CONTACT.PHONE_E164}`}>{SITE_CONFIG.CONTACT.PHONE_DISPLAY}</a>
          </p>
        </article>
      </div>
    </main>
  );
}

