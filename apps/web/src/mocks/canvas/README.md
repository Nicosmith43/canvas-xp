# Canvas API Mock Fixtures

These JSON files mirror the shapes returned by the Canvas LMS REST API so the
reward/streak logic can be developed and tested without a live Canvas account.

## Files

| File | Canvas endpoint | Shape |
|---|---|---|
| `courses.json` | `GET /api/v1/courses` | Array of course objects |
| `assignments.json` | `GET /api/v1/courses/:id/assignments` | Array of assignment objects |
| `submissions.json` | `GET /api/v1/courses/:id/students/submissions` | Array of submission objects |

## Schema notes

### Course (subset of Canvas fields we use)

- `id` (number) — Canvas course id
- `name`, `course_code` — display fields
- `workflow_state` — `available`, `completed`, etc.
- `start_at`, `end_at` — ISO 8601 timestamps

### Assignment (subset)

- `id` (number) — assignment id; join key for submissions
- `course_id` (number)
- `name`
- `points_possible` (number) — drives the XP tier in `lib/rewards.js`
- `due_at` (ISO 8601 or null) — the deadline used for early/late math
- `all_day` (boolean) — Canvas "all day" due dates
- `group_category_id` (number, optional) — present for group assignments
- `submission_types` (string array)
- `has_submitted_submissions` (boolean)
- `lock_at`, `unlock_at` — availability window

### Submission (subset)

- `id` (number)
- `assignment_id` (number) — join key back to assignments
- `user_id` (number) — Canvas user id (may be absent on pure group rows)
- `group_id` (number, optional) — set for group submissions
- `submitted_at` (ISO 8601 or null)
- `late` (boolean) — Canvas-computed lateness
- `excused` (boolean) — teacher-excused; never earns rewards
- `missing` (boolean) — no submission made
- `workflow_state` — `submitted`, `graded`, `excused`, etc.
- `submission_type` — `online_upload`, `online_quiz`, `online_text_entry`, ...

## Covered edge cases

- **Early submission** — 48h and 72h+ early (bonus tiers)
- **On-time / barely early** — under 24h early (no bonus)
- **Late submission** — `late: true`, base rewards only
- **Excused** — `excused: true`, ineligible for rewards
- **Group assignment** — `group_category_id` + `group_id`
- **All-day due date** — `all_day: true`
- **Extended deadline** — `lock_at` later than `due_at` window; `due_at` remains
  the reward cutoff
- **Missing submission** — assignment with no matching submission row

## Usage

`src/lib/canvasFixtures.js` loads these files for local development. When the
real Canvas OAuth flow is connected (post-IT meeting), swap the loader's data
source for live API responses — the object shapes are identical.
