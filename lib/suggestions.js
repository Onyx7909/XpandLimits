/**
 * suggestions.js — rule-based exercise suggestions, no AI required.
 *
 * Input: your existing workout history (stored in Supabase) mapped to muscle
 * groups, plus the free-exercise-db dataset. Output: a small ranked list of
 * exercises that fill the gaps. Every suggestion is explainable — we attach a
 * `reasons` array so the UI can show WHY it was suggested (users trust that).
 *
 * The four rules (from proposal issue #2):
 *   1. Rotation — muscles not trained in the last N days come first
 *   2. Balance  — push/pull imbalance gets corrective suggestions
 *   3. Equipment — respect what the user actually has access to
 *   4. Level    — respect the user's level, offer harder variants on demand
 */

/**
 * @param {Object} params
 * @param {Array}  params.exercises        full dataset from exerciseDb.loadExercises()
 * @param {Object} params.recentMuscles    e.g. { chest: 3, biceps: 1, back: 0 }
 *                                         — number of days since each muscle was trained
 * @param {Object} params.recentForceCount e.g. { push: 6, pull: 2 } — counts over recent workouts
 * @param {string[]} [params.equipment]    available equipment names (omit to allow all incl. null)
 * @param {string}   [params.level]        'beginner' | 'intermediate' | 'expert'
 * @param {number}   [params.limit]        max suggestions, default 5
 * @returns {Array<{exercise: Object, score: number, reasons: string[]}>}
 */
export function suggestExercises({
  exercises,
  recentMuscles = {},
  recentForceCount = {},
  equipment,
  level,
  limit = 5,
}) {
  const scored = exercises
    .map((exercise) => {
      const reasons = [];
      let score = 0;

      // Rule 1 — rotation: the longer since a muscle was trained, the higher the score.
      const primary = (exercise.primaryMuscles || [])[0];
      if (primary != null) {
        const daysAgo = recentMuscles[primary.toLowerCase()];
        if (daysAgo == null) {
          score += 30;
          reasons.push(`nog niet getraind in je recente geschiedenis`);
        } else if (daysAgo >= 4) {
          score += 20;
          reasons.push(`${primary} was ${daysAgo} dagen geleden`);
        }
      }

      // Rule 2 — push/pull balance.
      if (exercise.force === 'pull' && (recentForceCount.push || 0) > (recentForceCount.pull || 0) * 2) {
        score += 15;
        reasons.push(`balans: ${recentForceCount.push} push vs ${recentForceCount.pull} pull dit week`);
      }
      if (exercise.force === 'push' && (recentForceCount.pull || 0) > (recentForceCount.push || 0) * 2) {
        score += 15;
        reasons.push(`balans: ${recentForceCount.pull} pull vs ${recentForceCount.push} push dit week`);
      }

      // Rule 3 — equipment match.
      if (equipment) {
        if (exercise.equipment == null || equipment.includes(exercise.equipment)) {
          score += 5; // fits what the user has; null-equipment (bodyweight) always fits
        } else {
          return null; // hard filter: no access to this equipment
        }
      }

      // Rule 4 — level match (offer harder variants only via explicit UI action).
      if (level && exercise.level === level) {
        score += 10;
        reasons.push(`past bij jouw niveau (${level})`);
      }

      return { exercise, score, reasons };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

/**
 * Build the inputs for suggestExercises from your existing Supabase workout
 * log. Wire this to your own table — the shape below assumes rows with an
 * exercise name and a performed-at date. Muscle mapping comes from the
 * dataset itself: look up the logged exercise by name and take its
 * primaryMuscles/force. Keep this function next to your db access layer.
 */
export function buildSuggestionInput(workoutRows, exercisesByName) {
  const DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const recentMuscles = {};
  const recentForceCount = { push: 0, pull: 0 };

  for (const row of workoutRows) {
    const ex = exercisesByName[row.exerciseName];
    if (!ex) continue; // custom/unknown exercise — fine, just ignored
    const days = Math.floor((now - new Date(row.performedAt).getTime()) / DAY);
    for (const m of ex.primaryMuscles || []) {
      const key = m.toLowerCase();
      if (recentMuscles[key] == null || days < recentMuscles[key]) recentMuscles[key] = days;
    }
    if (ex.force in recentForceCount && days <= 7) recentForceCount[ex.force] += 1;
  }

  return { recentMuscles, recentForceCount };
}
