/**
 * rewardRules defines the core values for the gamification system
 * as specified in the "Token System" documentation.
 */
export const rewardRules = {
  baseTokens: 50,
  earlyTokenBonus: 25,
  earlyXPBonus: {
    hours24: 50,
    hours48: 75,
    hours72: 100,
  },
  xpByPoints: (points) => {
    if (points >= 100) return 200;
    if (points >= 51) return 150;
    if (points >= 26) return 100;
    if (points >= 11) return 75;
    return 50;
  },
};

/**
 * Calculates the XP and Token rewards for a Canvas assignment submission.
 *
 * @param {Object} assignment - The Canvas assignment object
 * @param {Object} submission - The Canvas submission object
 * @returns {Object} Result containing awarding status and calculated amounts
 */
export function calculateSubmissionReward(assignment, submission) {
  // 1. Validation: Ensure we have the necessary dates
  if (!assignment.due_at || !submission.submitted_at) {
    return { eligible: false, reason: 'Missing dates' };
  }

  // 2. Validation: Skip excused assignments
  if (submission.excused === true) {
    return { eligible: false, reason: 'Excused assignment' };
  }

  const dueTime = new Date(assignment.due_at).getTime();
  const submittedTime = new Date(submission.submitted_at).getTime();

  if (!Number.isFinite(dueTime) || !Number.isFinite(submittedTime)) {
    return { eligible: false, reason: 'Invalid dates' };
  }

  // 3. Calculate hours early
  const hoursEarly = (dueTime - submittedTime) / (1000 * 60 * 60);

  // 4. Calculate Base XP based on assignment point value
  const points = Number(assignment.points_possible ?? 0);
  let xp = rewardRules.xpByPoints(points);

  // 5. Calculate Base Tokens
  let tokens = rewardRules.baseTokens;

  // 6. Calculate Early Bonuses
  let earlyXPBonus = 0;
  let earlyTokenBonus = 0;

  // Only award early bonuses if not marked late
  if (hoursEarly > 0 && submission.late !== true) {
    if (hoursEarly >= 72) {
      earlyXPBonus = rewardRules.earlyXPBonus.hours72;
    } else if (hoursEarly >= 48) {
      earlyXPBonus = rewardRules.earlyXPBonus.hours48;
    } else if (hoursEarly >= 24) {
      earlyXPBonus = rewardRules.earlyXPBonus.hours24;
    }

    if (hoursEarly >= 24) {
      earlyTokenBonus = rewardRules.earlyTokenBonus;
    }
  }

  xp += earlyXPBonus;
  tokens += earlyTokenBonus;

  return {
    eligible: true,
    assignmentId: assignment.id,
    userId: submission.user_id,
    xpAwarded: xp,
    tokensAwarded: tokens,
    hoursEarly: Math.max(0, Math.floor(hoursEarly)),
    earlyXPBonus,
    earlyTokenBonus,
  };
}
