import test from "node:test";
import assert from "node:assert/strict";
import { getAcademyStore, getCourseCompletionSummaries } from "./academyStore";

test("getCourseCompletionSummaries returns empty list when unauthenticated", () => {
  const store = getAcademyStore();
  assert.deepEqual(getCourseCompletionSummaries(store), []);
  assert.deepEqual(getCourseCompletionSummaries(store, "", "  "), []);
});

test("getCourseCompletionSummaries computes accurate module percentages for seed learner", () => {
  const store = getAcademyStore();
  const summaries = getCourseCompletionSummaries(
    store,
    "user-learner-demo",
    "learner@elitestech-demo.com"
  );

  assert.equal(summaries.length, 2);

  const dataBi = summaries.find((s) => s.courseId === "course-data-bi");
  assert.ok(dataBi, "expected course-data-bi progress summary");
  assert.equal(dataBi.completedCount, 3);
  assert.equal(dataBi.totalModules, 6);
  assert.equal(dataBi.completionPct, 50);
  assert.equal(dataBi.status, "active");
  assert.equal(dataBi.nextModuleOrder, 4);
  assert.equal(dataBi.nextModuleTitle, "Self-Service ETL Workflows in Alteryx");

  const pythonEtl = summaries.find((s) => s.courseId === "course-python-etl");
  assert.ok(pythonEtl, "expected course-python-etl progress summary");
  assert.equal(pythonEtl.completedCount, 3);
  assert.equal(pythonEtl.totalModules, 3);
  assert.equal(pythonEtl.completionPct, 100);
  assert.equal(pythonEtl.status, "completed");
  assert.equal(pythonEtl.certificateCode, "ETS-CERT-9482AX");
  assert.equal(pythonEtl.nextModuleOrder, undefined);
});

test("getCourseCompletionSummaries ignores invalid module IDs and deduplicates by course", () => {
  const base = getAcademyStore();
  const cloned = {
    ...base,
    enrollments: [
      {
        ...base.enrollments[0],
        id: "enr-test-dup-low",
        userId: "user-test-edge",
        learnerEmail: "edge@example.com",
        courseId: "course-data-bi",
        completedModuleIds: ["mod-da-1", "mod-da-1", "mod-nonexistent"],
        status: "active" as const,
        lastActiveAt: "2026-11-01T10:00:00Z",
      },
      {
        ...base.enrollments[0],
        id: "enr-test-dup-high",
        userId: "user-test-edge",
        learnerEmail: "edge@example.com",
        courseId: "course-data-bi",
        completedModuleIds: ["mod-da-1", "mod-da-2", "mod-da-3", "mod-da-4"],
        status: "active" as const,
        lastActiveAt: "2026-11-02T10:00:00Z",
      },
    ],
  };

  const summaries = getCourseCompletionSummaries(cloned, "user-test-edge", "edge@example.com");
  assert.equal(summaries.length, 1);
  assert.equal(summaries[0].enrollmentId, "enr-test-dup-high");
  assert.equal(summaries[0].completedCount, 4);
  assert.equal(summaries[0].completionPct, 67);
  assert.equal(summaries[0].nextModuleOrder, 5);
});
