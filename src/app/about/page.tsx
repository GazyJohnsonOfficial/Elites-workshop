import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Sprite";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `About Us · Cloud Innovation & Track Record | ${SITE_CONFIG.COMPANY}`,
  description:
    "Elites Tech Solutions LLC delivers cutting-edge cloud, infrastructure, cybersecurity, and digital transformation solutions with a 20-year track record across the US, Ghana and UK.",
};

export default function AboutPage() {
  return (
    <main id="main">
      {/* ============ PHERO ============ */}
      <section className="phero">
        <div className="container">
          <ol className="crumbs" aria-label="Breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>About</li>
          </ol>
          <p className="eyebrow">About us</p>
          <h1>A single partner for IT, data and talent</h1>
          <p>
            {SITE_CONFIG.COMPANY} helps organisations and individuals solve IT problems and build the
            skills to run their technology with confidence.
          </p>
        </div>
      </section>

      {/* ============ WHO WE ARE / PROVEN EXPERTISE ============ */}
      <section className="section">
        <div className="container split">
          <div className="reveal">
            <p className="eyebrow">Who we are</p>
            <h2>Cloud Innovation Advanced by EliteTech</h2>
            <p>
              Founded on a passion for technical innovation, EliteTech Solutions LLC has been at the forefront
              of delivering cutting-edge cloud, infrastructure, and digital transformation solutions for over 20
              years.
            </p>
            <p>
              We specialize in crafting tailored, high-performance technology strategies that allow enterprise
              clients and growing businesses to thrive in an increasingly digital world. Our expert team is
              dedicated to providing seamless, ironclad, and highly scalable cloud services committed to your
              long-term success.
            </p>
          </div>
          <div className="reveal">
            <p className="eyebrow">Why Choose Us</p>
            <h2>Tailored Solutions &amp; Proven Expertise</h2>
            <ul className="check-list check-list-spaced">
              <li>
                <strong>Tailored Solutions:</strong> Customized strategies engineered to align directly with your
                unique business requirements and accelerate sustainable growth.
              </li>
              <li>
                <strong>20-Year Track Record:</strong> Trusted technical expertise in enterprise cloud architecture,
                DevOps automation, and cost optimization.
              </li>
              <li>
                <strong>Client-Centric Philosophy:</strong> Dedicated personal support, clear communication, and
                ongoing partnership with your internal engineering team.
              </li>
            </ul>
            <p className="mt-16">
              <Link className="more-link" href="/contact#locations">
                Connect with our regional offices (US · Ghana · UK) <Icon id="i-arrow-right" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ============ 4 IMPACT PILLARS ============ */}
      <section className="section section-tint">
        <div className="container">
          <div className="sec-head center reveal">
            <p className="eyebrow">Our Core Standards</p>
            <h2>Built on Four Pillars of Excellence</h2>
          </div>
          <div className="impact-grid reveal">
            <div className="impact-card">
              <span className="impact-icon">
                <Icon id="i-check" />
              </span>
              <h3>Customer Satisfaction</h3>
              <p>We exceed client expectations through reliable execution and measurable business outcomes.</p>
            </div>
            <div className="impact-card">
              <span className="impact-icon">
                <Icon id="i-chart" />
              </span>
              <h3>Cost Savings</h3>
              <p>Optimize infrastructure spending while improving throughput, resilience, and operational speed.</p>
            </div>
            <div className="impact-card">
              <span className="impact-icon">
                <Icon id="i-repeat" />
              </span>
              <h3>Continuous Optimization</h3>
              <p>Ongoing architectural audits and fine-tuning to ensure maximum ROI across all cloud environments.</p>
            </div>
            <div className="impact-card">
              <span className="impact-icon">
                <Icon id="i-shield" />
              </span>
              <h3>Security &amp; Compliance</h3>
              <p>Rigorous security controls and governance adhering to HIPAA, SOC 2, ISO 27001, and GDPR.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW WE OPERATE ============ */}
      <section className="section">
        <div className="container">
          <div className="sec-head reveal">
            <p className="eyebrow">How we operate</p>
            <h2>What you can expect from us</h2>
          </div>
          <div className="values">
            <article className="value reveal">
              <Icon id="i-target" />
              <h3>Practical first</h3>
              <p>We recommend what works for your situation and explain it in plain language.</p>
            </article>
            <article className="value reveal">
              <Icon id="i-users" />
              <h3>Our own people</h3>
              <p>Staffing is supplied by our own staffing team, so there is one accountable point of contact.</p>
            </article>
            <article className="value reveal">
              <Icon id="i-lock" />
              <h3>Careful with information</h3>
              <p>We handle client information with care, as described in our Privacy Policy.</p>
            </article>
            <article className="value reveal">
              <Icon id="i-grad" />
              <h3>Skills that stay</h3>
              <p>Training is part of how we work, so your team can keep improving after we leave.</p>
            </article>
            <article className="value reveal">
              <Icon id="i-headset" />
              <h3>Responsive support</h3>
              <p>Every enquiry is read by a person and answered by email.</p>
            </article>
            <article className="value reveal">
              <Icon id="i-layers" />
              <h3>Works together or alone</h3>
              <p>Use one service or combine several as your needs grow.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ============ CLIENT TESTIMONIALS ============ */}
      <section className="section section-tint" id="testimonials">
        <div className="container">
          <div className="sec-head center reveal">
            <p className="eyebrow">Client Feedback</p>
            <h2>What Our Clients Are Saying</h2>
            <p>Trusted by engineering leaders, IT directors, and executives across the US, Ghana, and the UK.</p>
          </div>

          <div className="testimonials-grid">
            <article className="tcard reveal">
              <div className="tcard-stars">★★★★★</div>
              <p className="tcard-quote">
                &ldquo;We were facing challenges with data security and scalability. Elitetech provided a
                comprehensive cloud security solution that protected our sensitive data and allowed us to
                scale our operations efficiently. Their expertise and energetic approach have given us complete
                peace of mind.&rdquo;
              </p>
              <div className="tcard-author">
                <div className="tcard-avatar">DK</div>
                <div>
                  <p className="tcard-name">David Kim</p>
                  <p className="tcard-role">IT Director</p>
                </div>
              </div>
            </article>

            <article className="tcard reveal">
              <div className="tcard-stars">★★★★★</div>
              <p className="tcard-quote">
                &ldquo;This team helped us implement a robust cloud-based e-commerce platform that has driven
                significant growth for our business. The excellent support throughout the project continues to
                this day and helped in ongoing success. We&apos;ve seen a noticeable increase in sales and
                customer satisfaction.&rdquo;
              </p>
              <div className="tcard-author">
                <div className="tcard-avatar">AT</div>
                <div>
                  <p className="tcard-name">Alex Turner</p>
                  <p className="tcard-role">IT Manager</p>
                </div>
              </div>
            </article>

            <article className="tcard reveal">
              <div className="tcard-stars">★★★★★</div>
              <p className="tcard-quote">
                &ldquo;Elitetech&apos;s cloud consulting services helped us optimize our cloud infrastructure
                cost-effectively. Their in-depth analysis and recommendations resulted in substantial savings
                without compromising performance. We&apos;re impressed with their ability to understand our
                complex needs and deliver solutions.&rdquo;
              </p>
              <div className="tcard-author">
                <div className="tcard-avatar">MB</div>
                <div>
                  <p className="tcard-name">Michael Brown</p>
                  <p className="tcard-role">Chief Information Officer (CIO)</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="cta">
        <div className="container reveal">
          <h2>Let&apos;s talk about your goals</h2>
          <p>A short message is enough to start. We will reply with next steps.</p>
          <div className="ahero-actions">
            <Link href="/contact#enquiry" className="btn btn-gold btn-lg">
              Request a consultation
            </Link>
            <a href={`mailto:${SITE_CONFIG.CONTACT.EMAIL}`} className="btn btn-outline btn-lg">
              Email us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
