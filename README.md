# Elites Tech Solutions: Data Analysis Programme website

Three things in this folder:

| Folder / file | What it is |
|---|---|
| `website/` | The finished site. Upload the **contents** of this folder to the web host. |
| `email-templates/` | Three formal HTML emails. Paste them into EmailJS (they are NOT uploaded to the website). |
| `README.md` | This guide. |

No build step, no server, no database. Plain HTML, CSS and JavaScript.

---

## 1. Email setup (about 15 minutes)

Emails are sent by [EmailJS](https://www.emailjs.com), which connects to the company Gmail with a Google sign-in. **No password is ever stored in the website.**

1. Create a free EmailJS account.
2. **Email Services > Add New Service > Gmail**, and sign in with `elitestechsolutionllc@gmail.com`. Note the **Service ID**.
3. **Email Templates > Create New Template**, three times. For each: choose the HTML/code editor, paste the file contents, and set the fields below.

| Template file | To email | Subject | Reply-To | From name |
|---|---|---|---|---|
| `1-confirmation-to-registrant.html` | `{{to_email}}` | `Registration received: {{programme}} (Ref {{reference}})` | `{{support_email}}` | `Elites Tech Solutions LLC` |
| `2-registration-notification-to-company.html` | `elitestechsolutionllc@gmail.com` | `New registration: {{full_name}} ({{reference}})` | `{{reply_to}}` | `Website registration` |
| `3-contact-message-to-company.html` | `elitestechsolutionllc@gmail.com` | `Website enquiry: {{topic}} from {{from_name}}` | `{{reply_to}}` | `Website contact form` |

4. Open `website/config.js` and paste: the **Public Key** (Account > General), the **Service ID**, and the three **Template IDs**.
5. In EmailJS **Account > Security**, restrict allowed domains to the real website domain, and consider turning on reCAPTCHA protection there. The Public Key is visible to anyone who views the site's code. That is normal and safe only if the domain restriction is on.

What happens on a registration: the **company is notified first**, then the **registrant gets the formal confirmation** with their reference number. If the confirmation fails (for example, a mistyped address), the registration is still recorded and the visitor is told to keep their reference number.

Until step 4 is done: on `localhost` / a local file the forms run in **demo mode** (everything works, nothing is sent). On the live site they show an honest "temporarily unavailable" message and never pretend to send.

## 2. Social media

In `website/config.js`, paste the full profile URL under `SOCIALS` (Facebook, Instagram, LinkedIn, X, YouTube). Empty ones are hidden. The WhatsApp button is built automatically from the phone number.

## 3. Go live

Upload the **contents** of `website/` (so `index.html` sits at the top level) to any static host (cPanel, Netlify, Cloudflare Pages, GitHub Pages...).

- **cPanel / Apache:** `.htaccess` is included. It forces HTTPS and sets the security headers.
- **Netlify / Cloudflare Pages:** `_headers` is included and does the same.
- **Other hosts:** copy the headers from `_headers` into the host's settings.
- If the site is not at `www.elitestechsolutions.com`, update the domain in `sitemap.xml`, `robots.txt` and `.well-known/security.txt`.

## 4. Things for the client to confirm or supply

- **Logo:** `website/logo.png` is used in the site header, footer and as the favicon.
- **Curriculum:** the four modules and week ranges are a draft (marked `CLIENT:` in `index.html`).
- **About section:** the company text is general. Add a real company profile and instructor details.
- **Session time:** the flyer gives a start date but no time, so the countdown counts to the start of Nov 10 and the calendar button adds an all-day entry. Add the time in `config.js` once confirmed.
- **Policies:** `privacy.html`, `terms.html` and `cookies.html` describe how this site actually works, written from the flyer details. Refund/withdrawal terms and governing law are deliberately left general. **Have a legal adviser review them** (comments marked `CLIENT / LEGAL REVIEW`).
- **Email wording:** review the confirmation email, especially the "Status of your registration" and "Payment" paragraphs.

## 5. What is built in

- **Cookie consent:** banner with Accept all / Essential only / Customise, remembered for 12 months, re-openable from the footer. No analytics or tracking runs today.
- **Security:** strict Content-Security-Policy (also set in each page), HTTPS enforcement, clickjacking and MIME protections, no third-party scripts or fonts (all self-hosted), input validation and cleaning, hidden honeypot field, time trap, 45-second cooldown, duplicate-registration guard, headless-browser blocking in EmailJS, https-only social links, no password or secret anywhere in the code.
- **Honest limit:** this is a front-end-only site. These measures stop casual spam and mistakes, not a determined attacker. The EmailJS domain restriction and reCAPTCHA (step 5) are the real backstop.
- **Animations:** hero entrance, scroll reveals, count-up numbers, progress bar, back-to-top, scroll-spy navigation. All switch off for visitors who prefer reduced motion, and nothing is ever hidden if JavaScript fails.

## 6. Tested

Automated browser tests (97 checks) covered: both forms end to end with the real EmailJS library against a simulated mail endpoint (correct order, recipients, fields and that every variable in the three templates is supplied), error and retry paths, honeypot, cooldown and duplicates, cookie consent, social links, navigation, animations, legal pages and 404, link integrity, zero CSP violations, no sideways scrolling from 320px to 1920px, and accessibility (axe: no serious issues).

**Not tested:** real email delivery (needs your EmailJS account) and rendering in real email apps (send yourself a test registration and check Gmail and a phone).

## 7. Housekeeping

- The Gmail **app password** shared earlier in chat is not used anywhere. Please revoke it: Google Account > Security > App passwords.
- Never put passwords or private keys in `config.js` or any website file.
