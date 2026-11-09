/* =========================================================
   SITE CONFIGURATION: the only file you need to edit.
   ---------------------------------------------------------
   1. EMAIL (EmailJS). See README.md, section "Email setup".
      Paste the Public Key, Service ID and the three Template IDs.
      Until then the forms only work in demo mode on localhost/file://
      and show an error message on the live site (they never pretend
      that an email was sent).
   2. SOCIALS. Paste the full URL of each profile. Empty ones are
      hidden. The WhatsApp link is built from the phone number below.
   3. PROGRAMME details used in the emails and on the page.
   Nothing in this file is secret. Never put passwords in it.
   ========================================================= */
const CONFIG = Object.freeze({
  EMAILJS: Object.freeze({
    PUBLIC_KEY:        "YOUR_PUBLIC_KEY",
    SERVICE_ID:        "YOUR_SERVICE_ID",
    TEMPLATE_CONFIRM:  "YOUR_CONFIRMATION_TEMPLATE_ID",   // formal email to the registrant
    TEMPLATE_ADMIN:    "YOUR_ADMIN_TEMPLATE_ID",          // registration notice to the company
    TEMPLATE_CONTACT:  "YOUR_CONTACT_TEMPLATE_ID",        // enquiry / contact-form message to the company
  }),

  // Optional 4th template: a formal acknowledgement sent to the person who makes an enquiry.
  // Leave as is until you create it; enquiries still reach the company without it.
  EMAILJS_EXTRA: Object.freeze({ TEMPLATE_ENQUIRY_ACK: "YOUR_ENQUIRY_ACK_TEMPLATE_ID" }),

  COMPANY: "Elites Tech Solutions LLC",
  TAGLINE: "Technology that works as hard as your organisation.",

  // Regional contact details. MOCK: true means the value is a placeholder to be replaced before launch.
  // Ghana uses the number on the company flyer. US and UK numbers are reserved fictional ranges.
  // The email is the company Gmail for every region until regional mailboxes exist.
  REGIONS: Object.freeze({
    us: Object.freeze({ NAME: "United States", SHORT: "US", PHONE_DISPLAY: "+1 (202) 555-0147", PHONE_E164: "+12025550147",
                        EMAIL: "elitestechsolutionllc@gmail.com", ADDRESS: "Office address to be announced", HOURS: "Mon to Fri, 9:00 to 17:00 ET", MOCK: true }),
    gh: Object.freeze({ NAME: "Ghana", SHORT: "GH", PHONE_DISPLAY: "+233 53 353 4687", PHONE_E164: "+233533534687",
                        EMAIL: "elitestechsolutionllc@gmail.com", ADDRESS: "Office address to be announced", HOURS: "Mon to Fri, 8:00 to 17:00 GMT", MOCK: false }),
    uk: Object.freeze({ NAME: "United Kingdom", SHORT: "UK", PHONE_DISPLAY: "+44 7700 900147", PHONE_E164: "+447700900147",
                        EMAIL: "elitestechsolutionllc@gmail.com", ADDRESS: "Office address to be announced", HOURS: "Mon to Fri, 9:00 to 17:00 GMT", MOCK: true }),
  }),

  PROGRAMME: Object.freeze({
    NAME:            "Data Analysis Programme",
    START_DATE_TEXT: "November 10, 2026",
    // Countdown target: the start of the first day (UTC, same as Ghana time). The flyer gives no session time,
    // so the site counts to the date, not a clock time. Add a time here (e.g. "2026-11-10T09:00:00Z") once confirmed.
    START_DATE_ISO:  "2026-11-10T00:00:00Z",
    START_DATE_ICS:  "20261110",   // all-day calendar entry, so no wrong time is promised
    DURATION:        "3 months (12 weeks)",
    SCHEDULE:        "3 live sessions per week, 1 hour each (36 sessions in total)",
    FORMAT:          "Online, live on Zoom",
    TUITION:         "USD 1,000",
    TUITION_URL:     "https://www.elitestechsolutions.com/tuition.html",
  }),

  CONTACT: Object.freeze({
    EMAIL:           "elitestechsolutionllc@gmail.com",
    PHONE_DISPLAY:   "+233 53 353 4687",
    PHONE_E164:      "+233533534687",
    WHATSAPP_NUMBER: "233533534687",              // digits only, with country code
    WEBSITE_DISPLAY: "www.elitestechsolutions.com",
    WEBSITE_URL:     "https://www.elitestechsolutions.com",
  }),

  // Full profile URLs, for example "https://www.facebook.com/yourpage". Leave "" to hide.
  SOCIALS: Object.freeze({
    facebook:  "",
    instagram: "",
    linkedin:  "",
    x:         "",
    youtube:   "",
  }),
});
