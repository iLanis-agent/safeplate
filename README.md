# SafePlate

Group dinner planning is a constraint problem: one guest is vegan, another is nut-free,
another keeps kosher. SafePlate takes each guest's restrictions, intersects them, and
shows the dishes from its built-in bank that EVERYONE at the table can eat - plus the
near-misses blocked by a single restriction (one substitution away). Copy the safe menu
as text for the group chat.

- No signup, nothing to install - pure static HTML/JS, guest list persists in `localStorage`
- Restriction logic covers vegan, vegetarian, gluten/nut/dairy/egg/sesame/soy-free,
  kosher (including the meat+dairy combo rule) and halal (including alcohol)
- `engine.js` holds the dish bank and filtering logic as pure functions, shared between
  the app and node tests

## Use it

Open `index.html`, or visit the deployed site.

## Run locally

Any static server works:

```
python3 -m http.server
```

Then open http://localhost:8000/.

## Engine tests

The node suite covers bank sanity, each restriction's tag mapping, the kosher
meat+dairy combo rule, union semantics across guests, violation lists, and near-miss
detection.
