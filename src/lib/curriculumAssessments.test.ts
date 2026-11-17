import test from "node:test";
import assert from "node:assert/strict";
import { getAcademyStore } from "./academyStore";
import {
  getCategoryRoadmapMilestones,
  getModuleCheckpointQuestions,
  recommendTrackPathway,
} from "./curriculumAssessments";
import {
  buildLinkedInCertificationUrl,
  buildOpenBadgeAssertion,
  computeEnrollmentMilestoneBadges,
} from "./credentialUtils";

test("recommendTrackPathway aligns role, background, and self-paced constraints", () => {
  const store = getAcademyStore();

  const cloudRec = recommendTrackPathway(
    { background: "sysadmin", targetRole: "cloud_sre", pace: "Instructor-Led" },
    store.courses
  );
  assert.equal(cloudRec.primaryCourseId, "course-cloud-devops");
  assert.equal(cloudRec.secondaryCourseId, "course-k8s-sre");
  assert.ok(cloudRec.estimatedWeeks > 0);

  const selfPacedData = recommendTrackPathway(
    { background: "analyst", targetRole: "data_eng", pace: "Self-Paced" },
    store.courses
  );
  assert.equal(selfPacedData.primaryCourseId, "course-python-etl");
});

test("getModuleCheckpointQuestions and getCategoryRoadmapMilestones cover all Academy categories", () => {
  const categories = [
    "Data & BI",
    "Cloud & DevOps",
    "Cybersecurity",
    "Data & Automation",
  ] as const;

  for (const cat of categories) {
    const qs = getModuleCheckpointQuestions(cat, 1);
    assert.equal(qs.length, 3);
    assert.ok(qs.every((q) => q.options.length === 3 && q.correctIndex >= 0 && q.correctIndex < 3));

    const stages = getCategoryRoadmapMilestones(cat, `Sample ${cat}`, 2, 6);
    assert.equal(stages.length, 3);
    assert.ok(stages[1].recommendedSlug);
  }
});

test("credentialUtils builds LinkedIn deep links, Open Badges v2 JSON, and micro-badges", () => {
  const store = getAcademyStore();
  const cert = store.certificates[0];
  assert.ok(cert);

  const linkedinUrl = buildLinkedInCertificationUrl(cert);
  assert.ok(linkedinUrl.startsWith("https://www.linkedin.com/profile/add?"));
  assert.ok(linkedinUrl.includes(encodeURIComponent(cert.code)));

  const assertion = buildOpenBadgeAssertion(cert, "https://www.elitestechsolutions.com");
  assert.equal(assertion["@context"], "https://w3id.org/openbadges/v2");
  assert.equal(assertion.type, "Assertion");
  assert.ok(assertion.id.includes(cert.code));

  const course = store.courses.find((c) => c.id === "course-data-bi")!;
  const badges = computeEnrollmentMilestoneBadges(course, {
    completedModuleIds: ["mod-da-1", "mod-da-2", "mod-da-3"],
    capstoneUrl: "",
  });
  assert.equal(badges.length, 3);
  assert.equal(badges[0].earned, true);
  assert.equal(badges[1].earned, true);
  assert.equal(badges[2].earned, false);
});
