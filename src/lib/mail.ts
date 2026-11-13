import nodemailer from "nodemailer";
import { SITE_CONFIG } from "./config";
import { escapeHtml, stripHeaderNewlines } from "./security";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || "587");

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
}

export async function sendMail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const safeTo = stripHeaderNewlines(to);
  const safeSubject = stripHeaderNewlines(subject);
  const safeReplyTo = replyTo ? stripHeaderNewlines(replyTo) : undefined;
  const from = process.env.SMTP_FROM || `"${SITE_CONFIG.COMPANY}" <${SITE_CONFIG.CONTACT.EMAIL}>`;
  const transporter = getTransporter();

  if (!transporter) {
    console.log("=================================================");
    console.log("[EMAIL DISPATCH - DEV SIMULATION]");
    console.log(`To: ${safeTo}`);
    console.log(`Subject: ${safeSubject}`);
    if (safeReplyTo) console.log(`Reply-To: ${safeReplyTo}`);
    console.log(`From: ${from}`);
    console.log("-------------------------------------------------");
    console.log("Body length:", html.length, "chars");
    console.log("=================================================");
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: safeTo,
      subject: safeSubject,
      html,
      replyTo: safeReplyTo,
    });
    return { success: true, messageId: info.messageId, simulated: false };
  } catch (error) {
    console.error("Failed to send email via SMTP:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Template helpers
function fillTemplate(template: string, vars: Record<string, string>): string {
  let output = template;
  for (const [key, val] of Object.entries(vars)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    output = output.replace(regex, val ?? "");
  }
  return output;
}

export async function sendRegistrationEmails(registration: {
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  jobTitle: string;
  organisation?: string | null;
  experience: string;
  tools?: string | null;
  goals?: string | null;
  source?: string | null;
  marketingConsent: boolean;
  createdAt: Date;
}) {
  const companyEmail = process.env.COMPANY_NOTIFICATION_EMAIL || SITE_CONFIG.CONTACT.EMAIL;
  const formattedDate = registration.createdAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const safeName = escapeHtml(registration.fullName);
  const safeRef = escapeHtml(registration.reference);
  const safeEmail = escapeHtml(registration.email);
  const safePhone = escapeHtml(registration.phone);
  const safeCountry = escapeHtml(registration.country);
  const safeJobTitle = escapeHtml(registration.jobTitle);
  const safeOrg = escapeHtml(registration.organisation || "Not specified");
  const safeExp = escapeHtml(registration.experience);
  const safeTools = escapeHtml(registration.tools || "None");
  const safeGoals = escapeHtml(registration.goals || "None");

  // 1. Confirmation to Registrant
  const confirmHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Registration received</title></head>
<body style="margin:0;padding:0;background:#f4f7ff;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7ff;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dbe3f5;">
    <tr><td style="background:#0f2557;padding:26px 32px;">
      <div style="font-size:13px;letter-spacing:2px;font-weight:700;color:#f5b82e;text-transform:uppercase;">${SITE_CONFIG.COMPANY}</div>
      <div style="font-size:24px;line-height:1.25;font-weight:700;color:#ffffff;margin-top:6px;">Registration received</div>
    </td></tr>
    <tr><td style="height:4px;background:#f5b82e;line-height:4px;font-size:4px;">&nbsp;</td></tr>
    <tr><td style="padding:30px 32px 8px 32px;font-size:15px;line-height:1.65;color:#14213d;">
      <p style="margin:0 0 14px 0;">Dear ${safeName},</p>
      <p style="margin:0 0 14px 0;">Thank you for registering for the <strong>${SITE_CONFIG.PROGRAMME.NAME}</strong> offered by ${SITE_CONFIG.COMPANY}. We confirm that we have received your registration, and we are pleased that you would like to join us.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7ff;border-left:4px solid #f5b82e;border-radius:6px;margin:6px 0 22px 0;">
        <tr><td style="padding:14px 18px;">
          <div style="font-size:12px;color:#55627f;">Your reference number</div>
          <div style="font-family:Consolas,Menlo,monospace;font-size:20px;font-weight:700;letter-spacing:1px;color:#0f2557;">${safeRef}</div>
          <div style="font-size:12px;color:#55627f;margin-top:4px;">Registered on ${formattedDate}. Please quote this number when you contact us.</div>
        </td></tr>
      </table>
      <h2 style="font-size:16px;color:#0f2557;margin:26px 0 8px 0;">Programme details</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dbe3f5;border-radius:8px;font-size:14px;margin:8px 0 22px 0;">
        <tr><td style="padding:10px 14px;background:#ffffff;font-weight:700;color:#0f2557;width:38%;border-bottom:1px solid #dbe3f5;">Programme</td><td style="padding:10px 14px;background:#ffffff;border-bottom:1px solid #dbe3f5;">${SITE_CONFIG.PROGRAMME.NAME}</td></tr>
        <tr><td style="padding:10px 14px;background:#f4f7ff;font-weight:700;color:#0f2557;width:38%;border-bottom:1px solid #dbe3f5;">Start date</td><td style="padding:10px 14px;background:#f4f7ff;border-bottom:1px solid #dbe3f5;">${SITE_CONFIG.PROGRAMME.START_DATE_TEXT}</td></tr>
        <tr><td style="padding:10px 14px;background:#ffffff;font-weight:700;color:#0f2557;width:38%;border-bottom:1px solid #dbe3f5;">Duration</td><td style="padding:10px 14px;background:#ffffff;border-bottom:1px solid #dbe3f5;">${SITE_CONFIG.PROGRAMME.DURATION}</td></tr>
        <tr><td style="padding:10px 14px;background:#f4f7ff;font-weight:700;color:#0f2557;width:38%;">Tuition</td><td style="padding:10px 14px;background:#f4f7ff;">${SITE_CONFIG.PROGRAMME.TUITION}</td></tr>
      </table>
      <h2 style="font-size:16px;color:#0f2557;margin:26px 0 8px 0;">Status of your registration</h2>
      <p style="margin:0 0 14px 0;">This email acknowledges that your registration has been received. <strong>It is not yet a confirmation of a place.</strong> Your place is confirmed when our team confirms it to you in writing and payment arrangements are agreed.</p>
      <p style="margin:0 0 14px 0;">Kind regards,<br /><strong>Admissions Team</strong><br />${SITE_CONFIG.COMPANY}</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

  // 2. Notification to Company
  const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New registration</title></head>
<body style="margin:0;padding:0;background:#f4f7ff;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7ff;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dbe3f5;">
    <tr><td style="background:#0f2557;padding:26px 32px;">
      <div style="font-size:13px;letter-spacing:2px;font-weight:700;color:#f5b82e;text-transform:uppercase;">${SITE_CONFIG.COMPANY}</div>
      <div style="font-size:24px;line-height:1.25;font-weight:700;color:#ffffff;margin-top:6px;">New registration</div>
    </td></tr>
    <tr><td style="padding:30px 32px;font-size:15px;line-height:1.65;color:#14213d;">
      <p>A new registration has been received for <strong>${SITE_CONFIG.PROGRAMME.NAME}</strong>.</p>
      <p><strong>Reference:</strong> ${safeRef}<br />
      <strong>Name:</strong> ${safeName}<br />
      <strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a><br />
      <strong>Phone:</strong> ${safePhone}<br />
      <strong>Country:</strong> ${safeCountry}<br />
      <strong>Job Title:</strong> ${safeJobTitle}<br />
      <strong>Organisation:</strong> ${safeOrg}<br />
      <strong>Experience:</strong> ${safeExp}<br />
      <strong>Tools:</strong> ${safeTools}<br />
      <strong>Goals:</strong> ${safeGoals}</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

  await Promise.allSettled([
    sendMail({
      to: registration.email,
      subject: `Registration received: ${SITE_CONFIG.PROGRAMME.NAME}`,
      html: confirmHtml,
      replyTo: companyEmail,
    }),
    sendMail({
      to: companyEmail,
      subject: `New registration: ${registration.fullName} (${registration.reference})`,
      html: adminHtml,
      replyTo: registration.email,
    }),
  ]);
}

export async function sendEnquiryEmails(enquiry: {
  reference: string;
  fullName: string;
  email: string;
  phone?: string | null;
  organisation?: string | null;
  region: string;
  topic: string;
  message: string;
  createdAt: Date;
}) {
  const companyEmail = process.env.COMPANY_NOTIFICATION_EMAIL || SITE_CONFIG.CONTACT.EMAIL;
  const formattedDate = enquiry.createdAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const safeName = escapeHtml(enquiry.fullName);
  const safeRef = escapeHtml(enquiry.reference);
  const safeEmail = escapeHtml(enquiry.email);
  const safePhone = escapeHtml(enquiry.phone || "None");
  const safeOrg = escapeHtml(enquiry.organisation || "None");
  const safeRegion = escapeHtml(enquiry.region);
  const safeTopic = escapeHtml(enquiry.topic);
  const safeMessage = escapeHtml(enquiry.message);

  // 1. Acknowledgement to Sender
  const ackHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Enquiry received</title></head>
<body style="margin:0;padding:0;background:#f4f7ff;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7ff;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dbe3f5;">
    <tr><td style="background:#0f2557;padding:26px 32px;">
      <div style="font-size:13px;letter-spacing:2px;font-weight:700;color:#f5b82e;text-transform:uppercase;">${SITE_CONFIG.COMPANY}</div>
      <div style="font-size:24px;line-height:1.25;font-weight:700;color:#ffffff;margin-top:6px;">Enquiry received</div>
    </td></tr>
    <tr><td style="padding:30px 32px;font-size:15px;line-height:1.65;color:#14213d;">
      <p>Dear ${safeName},</p>
      <p>Thank you for contacting ${SITE_CONFIG.COMPANY}. We confirm that we have received your enquiry regarding <strong>${safeTopic}</strong>.</p>
      <p><strong>Reference:</strong> ${safeRef}<br />
      <strong>Date:</strong> ${formattedDate}</p>
      <p>A member of our team will review your message and reply by email shortly.</p>
      <p>Kind regards,<br /><strong>Client Services Team</strong><br />${SITE_CONFIG.COMPANY}</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

  // 2. Notification to Company
  const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New website enquiry</title></head>
<body style="margin:0;padding:0;background:#f4f7ff;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7ff;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dbe3f5;">
    <tr><td style="background:#0f2557;padding:26px 32px;">
      <div style="font-size:13px;letter-spacing:2px;font-weight:700;color:#f5b82e;text-transform:uppercase;">${SITE_CONFIG.COMPANY}</div>
      <div style="font-size:24px;line-height:1.25;font-weight:700;color:#ffffff;margin-top:6px;">New website enquiry</div>
    </td></tr>
    <tr><td style="padding:30px 32px;font-size:15px;line-height:1.65;color:#14213d;">
      <p><strong>Reference:</strong> ${safeRef}<br />
      <strong>From:</strong> ${safeName}<br />
      <strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a><br />
      <strong>Phone:</strong> ${safePhone}<br />
      <strong>Organisation:</strong> ${safeOrg}<br />
      <strong>Region:</strong> ${safeRegion}<br />
      <strong>Topic:</strong> ${safeTopic}</p>
      <h3 style="font-size:15px;color:#0f2557;">Message:</h3>
      <div style="background:#f4f7ff;padding:12px;border-radius:6px;white-space:pre-wrap;">${safeMessage}</div>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

  await Promise.allSettled([
    sendMail({
      to: enquiry.email,
      subject: `Enquiry received: ${enquiry.reference}`,
      html: ackHtml,
      replyTo: companyEmail,
    }),
    sendMail({
      to: companyEmail,
      subject: `Website enquiry: ${enquiry.topic} (${enquiry.reference})`,
      html: adminHtml,
      replyTo: enquiry.email,
    }),
  ]);
}

export async function sendNewsletterWelcomeEmail({
  email,
  reference,
}: {
  email: string;
  reference: string;
}) {
  const companyEmail = process.env.COMPANY_NOTIFICATION_EMAIL || SITE_CONFIG.CONTACT.EMAIL;
  const safeRef = escapeHtml(reference);
  const safeEmail = escapeHtml(email);

  const subscriberHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Welcome to Elites Tech Solutions Executive Briefings</title></head>
<body style="margin:0;padding:0;background:#f4f7ff;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7ff;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dbe3f5;">
    <tr><td style="background:#0b0d11;padding:26px 32px;">
      <div style="font-size:13px;letter-spacing:2px;font-weight:700;color:#fab005;text-transform:uppercase;">${SITE_CONFIG.COMPANY}</div>
      <div style="font-size:24px;line-height:1.25;font-weight:700;color:#ffffff;margin-top:6px;">Welcome to Executive Briefings</div>
    </td></tr>
    <tr><td style="padding:30px 32px;font-size:15px;line-height:1.65;color:#14213d;">
      <p>Hello,</p>
      <p>Thank you for subscribing to <strong>${SITE_CONFIG.COMPANY}</strong> technology briefings.</p>
      <p>You will receive our curated executive insights on cloud infrastructure, zero-trust security architecture, DevOps automation, and enterprise data analytics.</p>
      <p style="background:#f8fafc;padding:14px;border-radius:8px;border-left:4px solid #fab005;font-size:14px;">
        <strong>Subscriber Ref:</strong> ${safeRef}<br />
        <strong>Focus Areas:</strong> Cloud Architecture · Cybersecurity · FinOps · Data Engineering
      </p>
      <p>You can manage your preferences or unsubscribe at any time by replying directly to this email.</p>
      <p>Kind regards,<br /><strong>The Advisory &amp; Architecture Team</strong><br />${SITE_CONFIG.COMPANY}</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

  const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Newsletter Subscriber</title></head>
<body style="margin:0;padding:0;background:#f4f7ff;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7ff;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #dbe3f5;">
    <tr><td style="background:#0b0d11;padding:24px 32px;">
      <div style="font-size:13px;letter-spacing:2px;font-weight:700;color:#fab005;text-transform:uppercase;">${SITE_CONFIG.COMPANY}</div>
      <div style="font-size:22px;line-height:1.25;font-weight:700;color:#ffffff;margin-top:6px;">New Newsletter Subscriber</div>
    </td></tr>
    <tr><td style="padding:28px 32px;font-size:15px;line-height:1.6;color:#14213d;">
      <p>A new visitor has subscribed to the executive newsletter briefing:</p>
      <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a><br />
      <strong>Reference:</strong> ${safeRef}</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

  await Promise.allSettled([
    sendMail({
      to: email,
      subject: `Welcome to ${SITE_CONFIG.COMPANY} Executive Briefings`,
      html: subscriberHtml,
      replyTo: companyEmail,
    }),
    sendMail({
      to: companyEmail,
      subject: `New Newsletter Subscriber: ${email}`,
      html: adminHtml,
      replyTo: email,
    }),
  ]);
}

