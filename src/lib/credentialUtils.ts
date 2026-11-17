import { SITE_CONFIG } from "./config";
import type { Certificate, Course, Enrollment } from "./academyStore";

export interface MilestoneBadge {
  id: string;
  tier: "foundations" | "core" | "capstone";
  title: string;
  criteria: string;
  earned: boolean;
  progressPct: number;
}

export function buildLinkedInCertificationUrl(cert: {
  code: string;
  courseTitle: string;
  issuedAt: string;
}): string {
  const issued = new Date(cert.issuedAt);
  const issueYear = Number.isNaN(issued.getTime())
    ? new Date().getUTCFullYear()
    : issued.getUTCFullYear();
  const issueMonth = Number.isNaN(issued.getTime())
    ? new Date().getUTCMonth() + 1
    : issued.getUTCMonth() + 1;

  const baseUrl = SITE_CONFIG.CONTACT.WEBSITE_URL.replace(/\/$/, "");
  const verifyUrl = `${baseUrl}/academy/verify/${encodeURIComponent(cert.code)}`;

  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: cert.courseTitle,
    organizationName: "Elites Tech Academy",
    issueYear: String(issueYear),
    issueMonth: String(issueMonth),
    certUrl: verifyUrl,
    certId: cert.code,
  });

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

export function buildOpenBadgeAssertion(cert: Certificate, originUrl: string) {
  const cleanOrigin = originUrl.replace(/\/$/, "");
  const badgeSlug = cert.code.toLowerCase();
  const verificationUrl = `${cleanOrigin}/academy/verify/${encodeURIComponent(cert.code)}`;
  const assertionUrl = `${cleanOrigin}/api/academy/badges/${encodeURIComponent(cert.code)}`;

  return {
    "@context": "https://w3id.org/openbadges/v2",
    type: "Assertion",
    id: assertionUrl,
    recipient: {
      type: "email",
      hashed: false,
      identity: cert.learnerName,
    },
    issuedOn: cert.issuedAt,
    verification: {
      type: "HostedBadge",
      verificationProperty: "id",
      allowedOrigins: [cleanOrigin],
    },
    evidence: [
      {
        id: verificationUrl,
        narrative: `Completed ${cert.durationWeeks}-week practitioner program in ${cert.category} including hands-on architecture laboratories and capstone review.`,
      },
    ],
    badge: {
      type: "BadgeClass",
      id: `${cleanOrigin}/academy/verify/${badgeSlug}#badgeclass`,
      name: `${cert.courseTitle} · Verified Practitioner`,
      description: `Awarded by ${SITE_CONFIG.COMPANY} to ${cert.learnerName} upon completing curriculum milestones and defending the capstone deliverable.`,
      criteria: {
        id: verificationUrl,
        narrative:
          "Complete 100% of curriculum modules, achieve passing knowledge checkpoint scores, and pass capstone architecture review.",
      },
      issuer: {
        type: "Profile",
        id: cleanOrigin,
        name: "Elites Tech Solutions Academy",
        url: `${cleanOrigin}/academy`,
        email: SITE_CONFIG.CONTACT.EMAIL_ACADEMY,
      },
      tags: [cert.category, "Cloud Engineering", "Verified Capstone"],
    },
  };
}

export function computeEnrollmentMilestoneBadges(
  course: Course,
  enrollment: Pick<Enrollment, "completedModuleIds" | "capstoneUrl" | "certificateCode">
): MilestoneBadge[] {
  const total = Math.max(1, course.modules.length);
  const completedCount = enrollment.completedModuleIds.length;
  const pct = Math.min(100, Math.round((completedCount / total) * 100));
  const halfTarget = Math.max(1, Math.ceil(total / 2));

  return [
    {
      id: `${course.id}-badge-foundations`,
      tier: "foundations",
      title: `${course.category}: Foundations`,
      criteria: "Complete Module 01 engineering lab",
      earned: completedCount >= 1,
      progressPct: completedCount >= 1 ? 100 : 0,
    },
    {
      id: `${course.id}-badge-core`,
      tier: "core",
      title: `${course.category}: Core Practitioner`,
      criteria: `Complete ${halfTarget} of ${total} modules`,
      earned: completedCount >= halfTarget,
      progressPct: Math.min(100, Math.round((completedCount / halfTarget) * 100)),
    },
    {
      id: `${course.id}-badge-capstone`,
      tier: "capstone",
      title: `${course.title}: Graduate Credential`,
      criteria: "Complete all modules & submit capstone",
      earned: Boolean(enrollment.certificateCode) || (completedCount >= total && enrollment.capstoneUrl.trim().length >= 5),
      progressPct: pct,
    },
  ];
}
