/**
 * Calculates the new streak based on the current activity.
 * 
 * @param {Object} profile - User profile containing current streak and last activity
 * @param {Array} submissions - List of user submissions
 * @param {Array} assignments - List of all assignments to determine due dates
 * @returns {Object} Updated streak information
 */
export function calculateStreak(profile, submissions, assignments) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Get all unique days that had assignments due up to today
  const dueDates = assignments
    .map(a => new Date(a.due_at))
    .filter(d => d <= now)
    .map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());
  
  const uniqueDueDays = [...new Set(dueDates)].sort((a, b) => b - a); // Newest first

  // Get all unique days user submitted something
  const submissionDates = submissions
    .filter(s => s.submitted_at)
    .map(s => new Date(s.submitted_at))
    .map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());
  
  const uniqueSubmissionDays = [...new Set(submissionDates)].sort((a, b) => b - a);

  let currentStreak = 0;
  
  // A streak is defined by consecutive "due days" that were met with a submission
  // Or simply consecutive days of submission if we want to be generous.
  // The requirement says: "non-assignment days do not break active streaks"
  
  // Let's iterate through uniqueDueDays. If the user submitted on or before that due day, streak continues.
  for (let i = 0; i < uniqueDueDays.length; i++) {
    const dueDay = uniqueDueDays[i];
    
    // Check if there's a submission for an assignment due on this day
    const assignmentsDueThisDay = assignments.filter(a => {
      const d = new Date(a.due_at);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() === dueDay;
    });

    const metAllDueThisDay = assignmentsDueThisDay.every(a => {
      const sub = submissions.find(s => s.assignment_id === a.id && s.submitted_at && !s.late);
      return !!sub;
    });

    if (metAllDueThisDay) {
      currentStreak++;
    } else {
      // If today is a due day and it's not over yet, don't break the streak yet?
      // For simplicity, let's say if a past due day was missed, streak breaks.
      if (dueDay < today.getTime()) {
        break;
      }
    }
  }

  // Milestone bonuses
  let bonusXP = 0;
  if (currentStreak === 3) bonusXP = 50;
  if (currentStreak === 7) bonusXP = 150;
  if (currentStreak === 14) bonusXP = 500;

  return {
    currentStreak,
    bonusXP,
    milestoneReached: [3, 7, 14].includes(currentStreak)
  };
}
