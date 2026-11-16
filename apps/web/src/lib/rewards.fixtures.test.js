import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { calculateSubmissionReward } from './rewards.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixtureDir = join(here, '..', 'mocks', 'canvas');

const assignments = JSON.parse(
  readFileSync(join(fixtureDir, 'assignments.json'), 'utf8')
).assignments;
const submissions = JSON.parse(
  readFileSync(join(fixtureDir, 'submissions.json'), 'utf8')
).submissions;

const byAssignment = Object.fromEntries(assignments.map((a) => [a.id, a]));
const bySubmissionAssignment = Object.fromEntries(submissions.map((s) => [s.assignment_id, s]));

function rewardFor(assignmentId) {
  const assignment = byAssignment[assignmentId];
  const submission = bySubmissionAssignment[assignmentId];
  assert.ok(assignment, `assignment ${assignmentId} exists`);
  assert.ok(submission, `submission for assignment ${assignmentId} exists`);
  return calculateSubmissionReward(assignment, submission);
}

test('48h-early submission earns mid-tier early bonuses', () => {
  // Problem Set 1: 20 pts -> 75 base XP; ~48h early -> +75 XP, +25 tokens
  const r = rewardFor(1001);
  assert.equal(r.eligible, true);
  assert.equal(r.xpAwarded, 150);
  assert.equal(r.tokensAwarded, 75);
});

test('72h+ early submission earns top-tier early bonuses', () => {
  // Lab Report: 100 pts -> 200 base XP; ~72h early -> +100 XP, +25 tokens
  const r = rewardFor(1002);
  assert.equal(r.eligible, true);
  assert.equal(r.xpAwarded, 300);
  assert.equal(r.tokensAwarded, 75);
});

test('late group submission earns base rewards only', () => {
  // Group Project: 150 pts -> 200 base XP; late -> no early bonuses
  const r = rewardFor(1003);
  assert.equal(r.eligible, true);
  assert.equal(r.xpAwarded, 200);
  assert.equal(r.tokensAwarded, 50);
});

test('under-24h early submission earns no bonus', () => {
  // Reading Quiz: 10 pts -> 50 base XP; ~1h early -> no bonuses
  const r = rewardFor(1004);
  assert.equal(r.eligible, true);
  assert.equal(r.xpAwarded, 50);
  assert.equal(r.tokensAwarded, 50);
});

test('very early submission on high-point assignment', () => {
  // Final Paper: 200 pts -> 200 base XP; ~120h early -> +100 XP, +25 tokens
  const r = rewardFor(1005);
  assert.equal(r.eligible, true);
  assert.equal(r.xpAwarded, 300);
  assert.equal(r.tokensAwarded, 75);
});

test('excused submission is ineligible', () => {
  const r = rewardFor(1006);
  assert.equal(r.eligible, false);
  assert.equal(r.reason, 'Excused assignment');
});

test('assignment without submission cannot be rewarded', () => {
  // Bonus Quiz has no submission row — nothing to pair.
  assert.equal(bySubmissionAssignment[1007], undefined);
});

test('missing dates make a submission ineligible', () => {
  const r = calculateSubmissionReward(
    { id: 1, points_possible: 10 },
    { submitted_at: null, user_id: 42 }
  );
  assert.equal(r.eligible, false);
});
