import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Tuition and Fees | ${SITE_CONFIG.COMPANY}`,
  description:
    "Clear, transparent fee structure for the Data Analysis Program. Details on standard tuition ($1,000), installment options ($500), and enrollment terms.",
};

export default function TuitionPage() {
  return (
    <main id="main">
      {/* ============ PHERO ============ */}
      <section className="phero">
        <div className="container">
          <ol className="crumbs" aria-label="Breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Tuition and fees</li>
          </ol>
          <p className="eyebrow">{SITE_CONFIG.PROGRAMME.NAME}</p>
          <h1>Tuition and fees</h1>
          <p>What the Data Analysis Program costs and how payment works.</p>
        </div>
      </section>

      {/* ============ FEE GRID ============ */}
      <section className="section">
        <div className="container fee-grid">
          <aside className="fee-card reveal">
            <p className="lab">Tuition</p>
            <p className="amt">{SITE_CONFIG.PROGRAMME.TUITION}</p>
            <p className="per">For the full 3-month Data Analysis Program</p>
            <ul className="check-list">
              <li>36 live sessions on Zoom</li>
              <li>SQL, Python, Excel and VBA, Alteryx, Tableau and Power BI</li>
              <li>Capstone dashboard project</li>
            </ul>
            <Link href="/data-analysis#register" className="btn btn-gold btn-block mb-8">
              <Icon id="i-lock" /> Register online
            </Link>
            <Link href="/contact?service=training#enquiry" className="btn btn-outline btn-block">
              Request corporate quote
            </Link>
          </aside>

          <div className="reveal">
            <div
              className="table-wrap"
              tabIndex={0}
              role="region"
              aria-label="Program and fee summary (scrollable)"
            >
              <table className="fee-table">
                <tbody>
                  <tr>
                    <th scope="row">Program</th>
                    <td>{SITE_CONFIG.PROGRAMME.NAME}</td>
                  </tr>
                  <tr>
                    <th scope="row">Start date</th>
                    <td>{SITE_CONFIG.PROGRAMME.START_DATE_TEXT}</td>
                  </tr>
                  <tr>
                    <th scope="row">Duration</th>
                    <td>{SITE_CONFIG.PROGRAMME.DURATION}, {SITE_CONFIG.PROGRAMME.SCHEDULE}</td>
                  </tr>
                  <tr>
                    <th scope="row">Format</th>
                    <td>{SITE_CONFIG.PROGRAMME.FORMAT}</td>
                  </tr>
                  <tr>
                    <th scope="row">Tuition</th>
                    <td>{SITE_CONFIG.PROGRAMME.TUITION} for the full program</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="h-gap">How payment works</h2>
            <ol className="expect">
              <li>
                <span className="n">1</span>
                <div>
                  <strong>Register or choose your plan</strong>
                  <span className="d">
                    Register online or proceed directly to payment. Choose full tuition (USD 1,000)
                    or split into two monthly installments (USD 500 deposit).
                  </span>
                </div>
              </li>
              <li>
                <span className="n">2</span>
                <div>
                  <strong>Pay securely online</strong>
                  <span className="d">
                    Pay with Debit/Credit Card (Visa, MasterCard), Mobile Money (MTN MoMo, Telecel
                    Cash in Ghana), or direct bank transfer.
                  </span>
                </div>
              </li>
              <li>
                <span className="n">3</span>
                <div>
                  <strong>Instant receipt &amp; onboarding</strong>
                  <span className="d">
                    Receive your official verified payment receipt immediately by email, followed by
                    your Zoom onboarding link.
                  </span>
                </div>
              </li>
            </ol>

            <div className="callout plain">
              <p>
                <strong>Secure Payment:</strong> All transactions are processed through verified corporate
                accounts. Need corporate invoicing or bank transfer details? Contact us at{" "}
                <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`}>{SITE_CONFIG.CONTACT.EMAIL}</a>.
              </p>
            </div>

            <p className="p-gap">
              Enrolling a team or several people?{" "}
              <Link href="/contact?service=training#enquiry">Send us an enquiry</Link> and we will discuss
              arrangements for your group.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
