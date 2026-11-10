import { calculateStreak } from './streaks.js';

const mockAssignments = [
  { id: 1, due_at: '2026-11-01T23:59:59Z' },
  { id: 2, due_at: '2026-11-02T23:59:59Z' },
  { id: 3, due_at: '2026-11-04T23:59:59Z' }, // Gap on Nov 3
];

const mockSubmissions = [
  { assignment_id: 1, submitted_at: '2026-11-01T10:00:00Z', late: false },
  { assignment_id: 2, submitted_at: '2026-11-02T10:00:00Z', late: false },
  { assignment_id: 3, submitted_at: '2026-11-04T10:00:00Z', late: false },
];

function testStreak() {
  console.log('Running Streak Tracking Tests...');
  
  // Test case 1: Perfect streak with a gap day
  const result1 = calculateStreak({}, mockSubmissions, mockAssignments);
  console.log('Test 1 (Gap day):', result1.currentStreak === 3 ? 'PASSED' : 'FAILED', `(Streak: ${result1.currentStreak})`);

  // Test case 2: Broken streak
  const brokenSubmissions = [
    { assignment_id: 1, submitted_at: '2026-11-01T10:00:00Z', late: false },
    // Missing assignment 2
    { assignment_id: 3, submitted_at: '2026-11-04T10:00:00Z', late: false },
  ];
  const result2 = calculateStreak({}, brokenSubmissions, mockAssignments);
  console.log('Test 2 (Broken streak):', result2.currentStreak === 1 ? 'PASSED' : 'FAILED', `(Streak: ${result2.currentStreak})`);

  // Test case 3: Milestone check
  const result3 = calculateStreak({}, mockSubmissions, mockAssignments);
  console.log('Test 3 (Milestone 3 days):', result3.bonusXP === 50 ? 'PASSED' : 'FAILED', `(Bonus: ${result3.bonusXP})`);
}

// Simple check to see if we are running in node
if (typeof process !== 'undefined' && process.release && process.release.name === 'node') {
  testStreak();
}
