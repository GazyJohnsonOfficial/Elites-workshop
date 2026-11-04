# Elites Tech Solutions LLC: website

Static front-end site (HTML, CSS, vanilla JavaScript). No server, no database, no build step.
Upload the contents of this `website` folder to your host.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: headline, regions, services, audiences, upcoming programme, approach, locations |
| `services.html` | Seven service areas, each with an enquiry button |
| `training.html` | Corporate training, individual training, career sessions, featured programme |
| `data-analysis.html` | The Data Analysis Programme page and registration (no tuition shown) |
| `tuition.html` | Tuition and Fees page |
| `about.html` | Who we are, how we operate |
| `contact.html` | Enquiry form and regional contacts |
| `privacy.html`, `terms.html`, `cookies.html`, `404.html` | Legal and error pages |

`client-preview/credentials-preview.html` (a sibling folder, **not** inside `website`) shows how a credentials
section would look using sample badges. It is marked "client preview only" and must never be uploaded.

## Configuration & Setup: `config.js`

1. **Email keys** (see below).
2. **Regional contacts** under `REGIONS`. Ghana uses the real number. The **United States and United Kingdom
   numbers are placeholders** (`MOCK: true`). Replace them in `config.js`, and also update the static occurrences in
   `index.html` and `contact.html` (search for `+1 (202) 555-0147` and `+44 7700 900147`).
   Every office address currently reads "Office address to be announced".
3. **Social links** under `SOCIALS`. Empty ones display clean placeholders; configured URLs link directly to your profiles.
4. **Logo**: `website/logo.png` is integrated across all header, footer and favicon references.

## Email setup (EmailJS)

The site sends email through EmailJS using the company Gmail. **Never put the Gmail password or app password in
any file on this site.** Anyone can read website files. The password goes only into the EmailJS dashboard.

1. Create an account at emailjs.com.
2. **Email Services > Add new service > Gmail**, and sign in with `elitestechsolutionllc@gmail.com`.
   (Alternative: add a custom SMTP service and enter the Gmail app password there, in the dashboard.)
3. **Email Templates**: create four templates. For each, paste the HTML from the `email-templates` folder.
   Set the "To" field and subject as shown.

   | Template | File | To | Suggested subject |
   | --- | --- | --- | --- |
   | Confirmation to registrant | `1-confirmation-to-registrant.html` | `{{to_email}}` | Registration received: {{programme}} |
   | Registration notice to company | `2-registration-notification-to-company.html` | company Gmail | New registration: {{full_name}} |
   | Enquiry notice to company | `3-enquiry-message-to-company.html` | company Gmail | Website enquiry: {{topic}} |
   | Enquiry acknowledgement | `4-enquiry-acknowledgement-to-sender.html` | `{{to_email}}` | Enquiry received: {{reference}} |

   On templates 2 and 3, set "Reply To" to `{{reply_to}}` (template 2: `{{email}}`).
4. In `config.js` paste the Public Key, Service ID and the template IDs.
   Template 3 is `TEMPLATE_CONTACT`; template 4 is `TEMPLATE_ENQUIRY_ACK` under `EMAILJS_EXTRA`.
5. In EmailJS, restrict the account to your domain (Account > Security) so others cannot use your key.
6. Do not turn on EmailJS "rate limit": each submission sends two emails, and the second would be blocked.

If template 4 is not set, enquiries still reach the company and the visitor sees a message that the team will reply.
Until the keys are set, forms work in demo mode on your own computer only. On the live site they say the
form is temporarily unavailable and never pretend to send.

## Content rules followed

No prices on service pages, no payments, no testimonials, reviews, statistics or client names. The only fee is the
Data Analysis Programme tuition, which lives on `tuition.html`. Credentials are hidden until real ones exist.

## Hosting

Netlify or Cloudflare Pages: `_headers` is used automatically. Apache or cPanel: `.htaccess` is used.
Both force HTTPS and set a strict Content Security Policy, HSTS and other security headers.

## Before launch checklist

- [ ] EmailJS keys and templates set; send a real test of each of the four emails
- [ ] Replace US and UK placeholder phone numbers and the "to be announced" addresses
- [x] Add `logo.png` and wire brand assets across all pages (Completed)
- [ ] Add social profile links in `config.js`
- [ ] Have the Privacy Policy, Terms and Cookie Policy reviewed by a legal adviser (UK GDPR, US state laws, Ghana DPA 2012)
- [ ] Confirm refund and withdrawal terms for the programme
- [ ] Update `sitemap.xml` and submit it to Google Search Console

## Tested

Automated browser tests cover every page: loading without errors, no Content Security Policy violations,
working internal links and anchors, navigation on desktop and phone, both forms (validation, spam protection,
email order and variables, failure handling), no horizontal scrolling from 320 to 1920 px, and accessibility
(axe-core, WCAG 2.1 AA). Real emails and the live host are **not** tested here, because they need your EmailJS keys.
