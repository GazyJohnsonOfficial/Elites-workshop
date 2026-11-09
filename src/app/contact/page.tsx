import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `Request a Consultation | ${SITE_CONFIG.COMPANY}`,
  description:
    "Request an IT consultation or enquiry. Reach our regional offices across the United States, Ghana and the United Kingdom.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <main id="main">
      {/* ============ PHERO ============ */}
      <section className="phero">
        <div className="container">
          <ol className="crumbs" aria-label="Breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Contact</li>
          </ol>
          <p className="eyebrow">Contact</p>
          <h1>Request a consultation</h1>
          <p>
            Tell us what you need. A member of our team will reply by email, usually with a few
            questions and a suggested next step.
          </p>
        </div>
      </section>

      {/* ============ ENQUIRY SECTION ============ */}
      <section className="section" id="enquiry">
        <div className="container enq-grid">
          <div className="enq-aside reveal">
            <div className="response-guarantee">
              <Icon id="i-check" />
              <span>Guaranteed reply within 1 business day</span>
            </div>
            <h2>How an enquiry works</h2>
            <p>
              Whether you are a government body, a school, a large organisation or an individual, start here.
            </p>
            <ol className="expect">
              <li>
                <span className="n">1</span>
                <div>
                  <strong>Send your enquiry</strong>
                  <span className="d">Choose a service and describe what you need.</span>
                </div>
              </li>
              <li>
                <span className="n">2</span>
                <div>
                  <strong>Receive an acknowledgement</strong>
                  <span className="d">
                    A formal email with your reference number arrives in your inbox.
                  </span>
                </div>
              </li>
              <li>
                <span className="n">3</span>
                <div>
                  <strong>We reply</strong>
                  <span className="d">
                    Our team follows up by email to understand your needs and agree next steps.
                  </span>
                </div>
              </li>
            </ol>
            <p className="svc-note">
              Consulting and enterprise service fees are agreed directly with each client. Programme
              tuition and approved invoices can be viewed on our{" "}
              <Link href="/tuition">Tuition &amp; Fees page</Link>.
            </p>
            <div className="booking-prompt">
              <h4>Prefer a direct conversation?</h4>
              <p>
                Speak with our advisory desk to discuss your organizational goals, staff training needs,
                or consulting scope.
              </p>
              <a
                href={`tel:${SITE_CONFIG.REGIONS.gh.PHONE_E164}`}
                className="btn btn-outline btn-sm"
              >
                <Icon id="i-phone" /> Call Regional Advisory Desk
              </a>
            </div>
          </div>

          <div className="enq-card reveal">
            <EnquiryForm defaultService={service} />
          </div>
        </div>
      </section>

      {/* ============ REGIONAL CONTACTS ============ */}
      <section className="section section-tint light" id="locations">
        <div className="container">
          <div className="sec-head reveal">
            <p className="eyebrow">Regional contacts</p>
            <h2>Reach the team closest to you</h2>
          </div>
          <div className="reg-cards">
            <article className="rcard reveal">
              <h3>
                <Icon id="i-pin" /> United States
              </h3>
              <ul>
                <li>
                  <Icon id="i-phone" />
                  <a href={`tel:${SITE_CONFIG.REGIONS.us.PHONE_E164}`}>{SITE_CONFIG.REGIONS.us.PHONE_DISPLAY}</a>
                </li>
                <li>
                  <Icon id="i-mail" />
                  <a href={`mailto:${SITE_CONFIG.REGIONS.us.EMAIL}`}>{SITE_CONFIG.REGIONS.us.EMAIL}</a>
                </li>
                <li>
                  <Icon id="i-building" />
                  <span>{SITE_CONFIG.REGIONS.us.ADDRESS}</span>
                </li>
                <li>
                  <Icon id="i-clock" />
                  <span>{SITE_CONFIG.REGIONS.us.HOURS}</span>
                </li>
              </ul>
            </article>

            <article className="rcard reveal">
              <h3>
                <Icon id="i-pin" /> Ghana
              </h3>
              <ul>
                <li>
                  <Icon id="i-phone" />
                  <a href={`tel:${SITE_CONFIG.REGIONS.gh.PHONE_E164}`}>{SITE_CONFIG.REGIONS.gh.PHONE_DISPLAY}</a>
                </li>
                <li>
                  <Icon id="i-mail" />
                  <a href={`mailto:${SITE_CONFIG.REGIONS.gh.EMAIL}`}>{SITE_CONFIG.REGIONS.gh.EMAIL}</a>
                </li>
                <li>
                  <Icon id="i-building" />
                  <span>{SITE_CONFIG.REGIONS.gh.ADDRESS}</span>
                </li>
                <li>
                  <Icon id="i-clock" />
                  <span>{SITE_CONFIG.REGIONS.gh.HOURS}</span>
                </li>
              </ul>
            </article>

            <article className="rcard reveal">
              <h3>
                <Icon id="i-pin" /> United Kingdom
              </h3>
              <ul>
                <li>
                  <Icon id="i-phone" />
                  <a href={`tel:${SITE_CONFIG.REGIONS.uk.PHONE_E164}`}>{SITE_CONFIG.REGIONS.uk.PHONE_DISPLAY}</a>
                </li>
                <li>
                  <Icon id="i-mail" />
                  <a href={`mailto:${SITE_CONFIG.REGIONS.uk.EMAIL}`}>{SITE_CONFIG.REGIONS.uk.EMAIL}</a>
                </li>
                <li>
                  <Icon id="i-building" />
                  <span>{SITE_CONFIG.REGIONS.uk.ADDRESS}</span>
                </li>
                <li>
                  <Icon id="i-clock" />
                  <span>{SITE_CONFIG.REGIONS.uk.HOURS}</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
