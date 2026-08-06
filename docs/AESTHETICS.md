# Café Options — Aesthetic Direction

This is the reference for what this site is trying to *feel* like, so future
changes stay consistent instead of drifting toward generic SaaS defaults.
It documents what's already built, not a new proposal.

## 1. What this site is

Not a product, not a directory — a private, hand-made thing for the two of
us. Every screen should read like a page from a love letter, not a listing
app. Copy always addresses **you**, never "her"/"the user." The site knows
exactly who it's for and isn't shy about it (see `AuthGate`: "Just for us").

## 2. Visual reference: Howl's Moving Castle, not "Ghibli" in general

Early passes tried generic "warm painterly" and produced muddy, grey
volumetric clouds under real-time lighting — plausible-sounding but wrong.
The fix came from a concrete production precedent (an 80.lv case study on
recreating this film's sky in a real-time engine), and the same two rules
now govern every visual layer:

- **Depth comes from fog (distance fade), never from lighting/shadowing.**
  Nothing in the ambient scene reads scene lights — every material is
  unlit (`MeshBasicMaterial` / `SpriteMaterial` / `PointsMaterial`). There
  is no `ambientLight`/`directionalLight`/`pointLight` left in the scene at
  all; if it doesn't need to exist, it isn't there.
- **Warm-vs-cool contrast is baked into instances, not computed from
  lighting.** Near/warm elements get cream/peach/coral tints, far/cool
  elements get desaturated blue-grey — assigned per-instance at creation,
  the same way the reference technique varies color/opacity/speed per
  cloud card rather than lighting one dense volume.

Palette cues from the film: firelit warm oranges/pinks near camera, cool
blue-grey distance, a bright magic-meadow yellow-green as an accent — warm
vs. cool doing the emotional work, not a single wash.

## 3. Design tokens (`src/styles.css`)

```
--color-paper:      #faf6f0   editorial cream background
--color-paper-warm: #f5efe5
--color-ink:        #3c2a1e   primary text
--color-ink-muted:  #7a5f4f
--color-blush / -soft   #e8b4b8 / #f4d7da
--color-matcha / -soft  #8a9a5b / #c5d1a5
--color-mocha:      #6b4226
--color-gold / -soft    #d9a94e / #f0d9a8
--color-coral / -soft   #e2748a / #f6d4dc   ← the one "hearted" color
```

`coral` replaced Tailwind's stock rose/red everywhere something is
hearted — 2D heart icons and the 3D `FloatingHearts` palette both draw
from the same token, so hearts read as one consistent painted color
instead of a generic UI-library red.

Type: **Playfair Display** (display serif — headings, emotional weight),
**Caveat** (script — handwriting moments: notes, "us", card annotations),
**Inter** (body — everything that needs to just be readable).

## 4. The ambient 3D layer (`src/components/three/`)

- `CloudCards.tsx` — 8–14 individual flat `THREE.Sprite` billboards, each
  with its own randomized position/scale/tint/opacity/drift speed. Flat
  and always camera-facing by construction, so there's no volume to
  self-shadow into mud.
- `SkyBackdrop.tsx` — large inside-out sphere, unlit gradient, opacity
  tuned low (0.14) so it's a wash, not a dominant layer.
- `SunMesh.tsx` — a small unlit sphere that only exists to give `GodRays`
  something to sample.
- `FloatingHearts.tsx` — unlit flat hearts (`MeshBasicMaterial`), warm
  palette, gentle float.
- `ParticleField.tsx` — unlit points with per-particle twinkle (phase +
  speed per particle, sinusoidal glow), warm-toned.
- Scene fog (`<fog>`) does the only "depth" work — softening/desaturating
  the farthest cards and particles toward the sky color.
- Post-processing: `GodRays` + `Bloom` + `Vignette`, tuned down from the
  first pass (which read as an overpowering haze) — light-shaft glow and
  a soft frame, not a filter over everything.
- The whole canvas is `lazy()`-loaded behind `Suspense` and is
  `pointer-events: none` — always ambient, never in the way.

## 5. Motion language (framer-motion)

- Staggered section reveals on entrance (`staggerChildren`), never
  everything popping in at once.
- Cards: a hand-placed tilt that follows the pointer (`CafeCard`), plus a
  fixed per-card hash-based rotation and washi-tape color — "someone put
  this on a corkboard by hand," not a hover-shadow SaaS card.
- Heart-burst micro-animation on shortlist-toggle.
- Breathing pulse rings around the pick-ceremony heart while idle — calms
  down once an action is in flight, never during "sending."
- Ken-Burns parallax drift+scale on hero images as the sheet scrolls.
- Confetti only once, at the actual emotional climax (a pick confirmed) —
  reserved, not sprinkled everywhere.
- `usePrefersReducedMotion()` and the global reduced-motion media query
  are the escape hatch for all of the above; every keyframe animation is
  neutralized under `prefers-reduced-motion: reduce`.

## 6. Sound (`cuelume` via `useSound()`)

Every real interaction gets a small synthesized (zero-asset) sound —
press, release, success, error, chime, sparkle, whisper, tick, page,
ready, arrival. Tied to intent, not decoration: `sparkle` on hearting
something, `whisper` on un-hearting, `chime` on opening the pick ceremony,
`arrival` on unlocking the gate, `error` on a failed send. Muted state
persists to `localStorage`; toggling never surprises you mid-session.

## 7. Copy voice

Second person, warm, specific — never "the user," never generic CTA
copy. Compare what shipped vs. the generic default:

- "Just for us" (not "For her eyes only" / not "Welcome")
- "A little something I've been building for the two of us." (not
  "A curated selection of...")
- "I'll get a little ping the moment you say yes." (not "Submit")
- "Tell him this is the one ☕" (not "Confirm selection")

If a line could appear on a SaaS landing page unchanged, it's wrong for
this app.

## 8. Content presentation

Cafés are photos hand-pinned to a corkboard: washi tape strip (one of a
few on-theme tones, picked deterministically per café so it doesn't
reshuffle on re-render), slight per-card tilt, Instagram embeds and real
verified accounts only — no stock photography, no invented places.

## 9. Guardrails that protect the aesthetic (not just bugs)

These read as "just fixes" but they're aesthetic integrity, not
cosmetic afterthoughts — a beautiful screen that's unreadable or that
zooms unexpectedly under your thumb breaks the "intimate" feeling faster
than any palette mistake would:

- `color-scheme: light` — this app has exactly one theme; never let the
  OS silently reskin a form control.
- `dvh` units + `interactive-widget=resizes-content` — the keyboard
  should never cause the layout to jump or hide what you're typing into.
- Manual `scrollIntoView` on focus for fields inside the fixed-position
  drawer — iOS's own auto-scroll misfires there; don't trust it.
- Every native input/textarea at ≥16px — iOS Safari auto-zooms on focus
  below that, which would yank you out of the intimate framing right when
  you're trying to write a note.

## 10. Open ideas (not yet done, not committed to)

- Real café photography once a reliable source is found (Instagram-embed
  is the current stand-in).
- A magic-meadow yellow-green accent hasn't been used yet anywhere in the
  2D UI — could be a nice third note alongside coral/gold if a screen ever
  feels like it needs one more color, but it isn't a gap that needs filling
  on its own.
