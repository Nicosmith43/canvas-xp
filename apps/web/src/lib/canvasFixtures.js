import coursesData from '../mocks/canvas/courses.json';
import assignmentsData from '../mocks/canvas/assignments.json';
import submissionsData from '../mocks/canvas/submissions.json';

/**
 * Canvas fixture loader.
 *
 * Returns data in the same shape as the Canvas REST API. When the real OAuth
 * integration ships, replace the bodies of these functions with API calls —
 * callers will not need to change.
 */

export async function getCourses() {
  // Canvas: GET /api/v1/courses?enrollment_state=active
  return coursesData.courses;
}

export async function getAssignments(courseId) {
  // Canvas: GET /api/v1/courses/:course_id/assignments
  return assignmentsData.assignments.filter((a) => a.course_id === courseId);
}

export async function getSubmissions(courseId, userId) {
  // Canvas: GET /api/v1/courses/:course_id/students/submissions?student_ids[]=:user_id
  return submissionsData.submissions.filter(
    (s) => s.course_id === courseId && (s.user_id === userId || s.group_id != null)
  );
}

export async function getAllMockData() {
  return {
    courses: coursesData.courses,
    assignments: assignmentsData.assignments,
    submissions: submissionsData.submissions,
  };
}
