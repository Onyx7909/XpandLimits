# Exercise Suggestions — implementation sketch (proposal for issue #2)

This branch is a **working starting point** for the feature proposed in
[issue #2](https://github.com/Onyx7909/XpandLimits/issues/2):
"oefening-suggesties die kloppen". It is deliberately **additive** — nothing
in the existing app is touched; you wire these modules into `App.js` when you
are ready.

## What's here

| File | What it does |
|---|---|
| `lib/exerciseDb.js` | Loads the free-exercise-db dataset (800+ exercises, public domain, no API key), caches it, filters it by muscle/equipment/level/search, resolves image URLs (lazy-loaded from GitHub raw — keeps the APK small) |
| `lib/suggestions.js` | Rule-based suggestions over your existing workout log: rotation, push/pull balance, equipment match, level match. Every suggestion carries a `reasons` array so the UI can show why. `buildSuggestionInput()` shows how to map your Supabase workout rows into the input shape |

## Minimal usage example

```js
import { loadExercises, filterExercises } from './lib/exerciseDb';
import { suggestExercises, buildSuggestionInput } from './lib/suggestions';

// once, e.g. at app start:
const exercises = await loadExercises();

// from your existing Supabase workout history:
const input = buildSuggestionInput(recentWorkoutRows, exercisesByName(exercises));

// today's suggestions:
const picks = suggestExercises({
  exercises,
  ...input,
  equipment: ['dumbbell', 'bodyweight'], // what the user has access to
  level: 'beginner',
  limit: 5,
});

// picks[0] = { exercise, score, reasons: ['nog niet getraind in je recente geschiedenis', ...] }
```

## Data source & license

- Dataset: https://github.com/yuhonas/free-exercise-db — **Unlicense (public domain)**, safe to use in a Google Play app.
- Single-file dataset: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json`
- Caveats from the dataset README: `force`, `mechanic`, `equipment` can be `null` — all filters here tolerate null.
- Images are hosted on GitHub raw and lazy-loaded; do not bundle them into the APK (all images together are heavy).

## Suggested wiring order (v1 → v3 of the issue)

1. Exercise picker screen: search + filters (`filterExercises`) + instructions + image (`imageUrl`)
2. Store muscle involvement per workout in your Supabase log (`buildSuggestionInput` shows the mapping)
3. "Vandaag voorgesteld" panel using `suggestExercises`
4. (Optional, later) AI suggestions via a Supabase Edge Function + a free OpenRouter model
