import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_CONFIG.COMPANY}`,
  description:
    "Terms of service and engagement conditions for Elites Tech Solutions LLC, covering technical consulting, workforce enablement, and training programs.",
};

export default function TermsPage() {
  return (
    <main id="main">
      <section className="legal-hero">
        <div className="container">
          <h1>Terms of Service</h1>
          <p>The general terms that govern your use of our website, services, and technical programs.</p>
          <p className="updated">Last updated: November 2026</p>
        </div>
      </section>

      <div className="container legal-wrap">
        <nav className="toc" aria-label="On this page">
          <h2>On this page</h2>
          <ol>
            <li><a href="#about">1. About these terms</a></li>
            <li><a href="#programme">2. Educational programs</a></li>
            <li><a href="#registration">3. Registration and your place</a></li>
            <li><a href="#tuition">4. Tuition and payment</a></li>
            <li><a href="#changes">5. Changes, withdrawals and refunds</a></li>
            <li><a href="#responsibilities">6. Your responsibilities</a></li>
            <li><a href="#materials">7. Materials and intellectual property</a></li>
            <li><a href="#outcomes">8. No guarantee of outcomes</a></li>
            <li><a href="#liability">9. Liability</a></li>
            <li><a href="#privacy">10. Privacy</a></li>
            <li><a href="#terms-changes">11. Changes to these terms</a></li>
            <li><a href="#law">12. Governing law</a></li>
            <li><a href="#contact">13. Contact us</a></li>
          </ol>
        </nav>

        <article className="legal">
          <h2 id="about">1. About these terms</h2>
          <p>
            These Terms of Service apply to your use of this website and engagement with {SITE_CONFIG.COMPANY} (&quot;we&quot;, &quot;us&quot;).
            Commercial engagements such as cloud consulting, dedicated engineering pods, and bespoke corporate workforce enablement are
            agreed separately under written Statements of Work (SOW). Individual professional cohort registrations are governed by the program
            terms set forth below.
          </p>

          <h2 id="programme">2. Educational programs</h2>
          <ul>
            <li><strong>Start date:</strong> {SITE_CONFIG.PROGRAMME.START_DATE_TEXT}.</li>
            <li><strong>Duration:</strong> {SITE_CONFIG.PROGRAMME.DURATION}.</li>
            <li><strong>Schedule:</strong> {SITE_CONFIG.PROGRAMME.SCHEDULE}.</li>
            <li><strong>Format:</strong> {SITE_CONFIG.PROGRAMME.FORMAT}.</li>
            <li><strong>Content:</strong> databases and SQL; Python, Excel and VBA; ETL with Alteryx; Tableau and Power BI; and a capstone project.</li>
            <li><strong>Tuition:</strong> see the <Link href="/tuition">Tuition and Fees page</Link>.</li>
          </ul>

          <h2 id="registration">3. Registration and your place</h2>
          <p>
            Submitting the registration form records your interest and reserves your place for
            consideration. <strong>Your place is confirmed when our team confirms it to you in writing and payment arrangements are agreed.</strong>
          </p>

          <h2 id="tuition">4. Tuition and payment</h2>
          <p>
            Tuition is {SITE_CONFIG.PROGRAMME.TUITION} for the full program. <strong>No payment is taken on this website.</strong> Our
            team provides official payment instructions directly.
          </p>

          <h2 id="responsibilities">6. Your responsibilities</h2>
          <ul>
            <li>Give accurate registration details and keep them up to date.</li>
            <li>Arrange a suitable computer, stable internet connection, and the Zoom app.</li>
            <li>Maintain professional and respectful conduct during live sessions.</li>
            <li>Do not distribute course materials or session links to unregistered parties.</li>
          </ul>

          <h2 id="privacy">10. Privacy</h2>
          <p>
            We handle your personal information in strict accordance with our{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2 id="contact">13. Contact us</h2>
          <p>
            Email: <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`}>{SITE_CONFIG.CONTACT.EMAIL}</a><br />
            Phone: <a href={`tel:${SITE_CONFIG.CONTACT.PHONE_E164}`}>{SITE_CONFIG.CONTACT.PHONE_DISPLAY}</a>
          </p>
        </article>
      </div>
    </main>
  );
}

