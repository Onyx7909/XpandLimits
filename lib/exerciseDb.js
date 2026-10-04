/**
 * exerciseDb.js — fetch + filter layer over the free-exercise-db dataset.
 *
 * Data source: https://github.com/yuhonas/free-exercise-db (Unlicense / public
 * domain, 800+ exercises). The full dataset ships as one JSON file; we load it
 * once and cache it in memory. Images are NOT bundled — they lazy-load from
 * GitHub raw to keep the APK small.
 *
 * Data notes (see free-exercise-db README): `force`, `mechanic` and
 * `equipment` are sometimes null, so filters must tolerate null.
 */

const EXERCISES_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';

const IMAGE_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

let cache = null; // null = not loaded, array = loaded

/** Load the dataset once and cache it. Returns an array of exercise objects. */
export async function loadExercises() {
  if (cache) return cache;
  const res = await fetch(EXERCISES_URL);
  if (!res.ok) throw new Error(`exercise-db load failed: HTTP ${res.status}`);
  cache = await res.json();
  return cache;
}

/** Resolve a relative image path from the dataset to a full URL. */
export function imageUrl(exercise) {
  if (!exercise.images || exercise.images.length === 0) return null;
  return IMAGE_BASE + exercise.images[0];
}

/**
 * Filter exercises by any combination of criteria.
 * All criteria are optional; pass null/undefined to skip a filter.
 * `primaryMuscles` and `equipment` tolerate null fields in the data.
 *
 * @param {Object} criteria
 * @param {string|string[]} [criteria.muscle]   primary muscle(s) to include
 * @param {string}             [criteria.equipment] exact equipment name
 * @param {boolean}            [criteria.equipmentOnly] if true, exclude exercises with null equipment
 * @param {string}             [criteria.level]   'beginner' | 'intermediate' | 'expert'
 * @param {string}             [criteria.force]   'pull' | 'push' | null-tolerant
 * @param {string}             [criteria.search]  free-text search on name
 */
export function filterExercises(exercises, criteria = {}) {
  const muscles = criteria.muscle
    ? [].concat(criteria.muscle).map((m) => m.toLowerCase())
    : null;
  const search = criteria.search?.trim().toLowerCase();

  return exercises.filter((ex) => {
    if (muscles && !(ex.primaryMuscles || []).some((m) => muscles.includes(m.toLowerCase()))) return false;
    if (criteria.level && ex.level !== criteria.level) return false;
    if (criteria.force && ex.force !== criteria.force) return false;
    if (criteria.equipment && ex.equipment !== criteria.equipment) return false;
    if (criteria.equipmentOnly && ex.equipment == null) return false;
    if (search && !ex.name.toLowerCase().includes(search)) return false;
    return true;
  });
}

/** The set of primary muscle names used by the dataset (for pickers/filters). */
export function allPrimaryMuscles(exercises) {
  const set = new Set();
  for (const ex of exercises) for (const m of ex.primaryMuscles || []) set.add(m);
  return [...set].sort();
}
