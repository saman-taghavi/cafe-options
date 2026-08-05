# Café Options — Ultimate Plan

**Working title:** Café Options  
**Repo path:** `~/developer/cafe-options`  
**Status:** Plan locked for build — no implementation in this document  
**Audience:** You (curator + builder) · her (chooser) · AI agents (curation co-pilot)

---

## 0. North star

A private, gorgeous **date deck** for the two of you.

| Who | What they feel |
|-----|----------------|
| **Her** | “This is *ours*” — browsing cafés feels like flipping a scrapbook, not using a tool. Picking one feels romantic, playful, and effortless. |
| **You** | Add a café in minutes with AI. When she chooses, you know **fast**, on a channel that works **in your region** (no Telegram). |
| **Both** | Public Instagram / Maps / site presence is **composed into your chrome** — alive media, not a sad list of outbound links. |

**One sentence:**  
TanStack Start SPA on GitHub Pages · media-first café profiles · scrapbook delight for her · redundant region-proof notify for you · schema + AI skills so curation stays mechanical and fast.

---

## 1. Product definition

### 1.1 In scope (v1)

- One romantic SPA (primary route `/`) for browsing, shortlisting, and picking cafés  
- Schema-driven café content (`content/cafes/*.json`) with local images  
- **Rich detail sheet:** your private note, Instagram post embeds, map peek, website card  
- Hearts / shortlist in `localStorage`  
- Pick ceremony → multi-channel notify you  
- “Date card” success moment she can screenshot/save  
- AI + CLI curation pipeline (new / validate / skill)  
- Deploy on **GitHub Pages** via Actions  

### 1.2 Explicit non-goals (v1)

| Out | Why |
|-----|-----|
| Auth / multi-user accounts | Two people, one URL; keep it intimate and simple |
| Server-rendered app on Pages | GH Pages is static; Start runs in **SPA mode** |
| Telegram | Blocked / unreliable in your region |
| Full-site iframes of café websites | Broken mobile UX, cookie walls, kills the mood |
| Live Instagram profile grids via scrapers | Fragile, ToS-grey, CDN links rot |
| Real-time collab / shared cloud shortlist | v1 = her device `localStorage`; shared list is backlog |
| SEO / marketing site | Private love tool |
| Payload, Next.js, Mongo, Better Auth | Wrong weight class |

### 1.3 Success bar (v1 is done when)

1. Live HTTPS URL on GitHub Pages  
2. ≥ **8** real cafés with real covers + **2–4 IG post embeds each** + working maps links  
3. Filters, hearts, immersive sheet, pick flow — excellent on **mobile**  
4. A pick reaches you **without Telegram** within ~1 minute on normal mobile data  
5. If notify fails, she still gets a calm **copy/share fallback** — never stranded  
6. `pnpm cafe:new` + `pnpm cafe:validate` + agent skill make “add a café” a **&lt;10 min** ritual  
7. UI feels intentional: warm, photographic, cute — scrapbook, not SaaS dashboard  

---

## 2. Constraints → architecture locks

| Constraint | Lock |
|------------|------|
| You want **TanStack Start** | Use it in **SPA / client-only mode** (`ssr: false` or Start SPA preset). No runtime server functions on Pages. |
| **Pure client** app | Café data ships in the build. Hearts/picks in `localStorage`. UI never requires a Node host. |
| **GitHub Pages** | Static `dist` only. `404.html` ← copy of `index.html`. Correct `base` / router `basepath`. |
| **Telegram blocked** | Zero Telegram dependency. Instant path = WhatsApp bot **and/or** SMS/Bale via tiny Worker. Email always on. |
| **Public café pages exist** | Compose **fragments** (IG embeds, Maps embed, frozen OG cards) — do not iframe whole sites. |
| **AI curation speed** | Zod schema = contract. One café = one JSON file. Skill + CLI + CI validate gate. |
| **Her delight** | First-class subsystem: copy, motion, ceremony, Date Card, performance of embeds — not “polish later.” |

### 2.1 The one allowed “non-static” piece

GitHub Pages **cannot** hide SMS/Bale API secrets.

**Allowed exception:** a **tiny free Cloudflare Worker** (or equivalent) whose **only job** is `POST /notify` → SMS and/or Bale.

```text
[GitHub Pages — TanStack Start SPA]
        │
        ├─► Web3Forms / Formspree ──► Email (always, pure client)
        ├─► WhatsApp HTTP bot ──────► Chat ping (optional, pure client)
        └─► Cloudflare Worker ──────► SMS (Kavenegar) and/or Bale (secrets here)
```

The **product** stays a static SPA. The Worker is infrastructure for secrets, not an app backend.

If you refuse any Worker in v1: ship **Email + WhatsApp bot + copy fallback** (still strong).

---

## 3. Stack (locked)

| Layer | Choice | Role |
|-------|--------|------|
| Framework | **TanStack Start** (SPA mode) | App shell, file routes, type-safe routing |
| Router | **TanStack Router** | `/` primary; optional `/cafe/$id` later |
| Data fetching | **TanStack Query** (light) | Notify mutation states only — not café list |
| UI | **React + TypeScript** | Your strength |
| Style | **Tailwind CSS v4** | Design tokens, utilities |
| Motion | **Motion** (Framer) | Card → sheet, hearts, ceremony |
| Validation | **Zod** | Café schema, pick payload, AI contract |
| Forms | **RHF + Zod** | Pick note + confirm |
| Content | `content/cafes/*.json` | One file per café |
| Images | `public/images/cafes/<id>/` | Covers + gallery (self-hosted) |
| Embeds | IG official embed + Maps iframe + frozen OG | Alive detail sheet |
| Notify | Multi-adapter `notify.ts` + optional Worker | Region-proof fan-out |
| Host | **GitHub Pages + Actions** | Free static hosting |
| Package manager | **pnpm** | Consistent DX |
| Quality | typecheck + café validator in CI | Block bad content deploys |

**Not in v1:** Next.js, Payload, auth libraries, heavy CMS.

---

## 4. Experience design (her first)

### 4.1 Metaphor

Not a directory. Not an admin panel.  
A **date deck / scrapbook**: cream paper, soft blush, matcha/olive accent, chocolate ink, serif café names, big photography.

### 4.2 Emotional arc

| Moment | She should feel | Design move |
|--------|-----------------|-------------|
| Land | “This is ours” | Couple hero, intimate line, no chrome bloat |
| Browse | Appetite / curiosity | Large cards, mood chips, satisfying filter motion |
| Open | “I want to be here” | Sheet spring; **your note first**; then live IG; map whisper |
| Heart | Playful keep | Heart burst; shortlist as keepsake drawer |
| Choose | Sweet commitment | Ceremony — not a form submit |
| After | Closure + souvenir | Date Card + “he’s been told” (or calm fallback) |

### 4.3 Copy rules

- Intimate, second person to her; plural for the couple (“our rainy-day list”)  
- Ban product-speak: no Submit / Payload / Success / Error ID  
- Prefer: “Tell him this is the one”, “Saved for us”, “It’s a date”  
- Empty states are warm, never sterile  

### 4.4 Motion & sensory

- Springs 200–400ms; shared-element *feel* card → sheet  
- Honor `prefers-reduced-motion`  
- Optional UI sounds (default **off**): soft heart pop, pick chime  
- Light Vibration API on supporting Android only  
- Confetti: restrained, brand-colored, once  

### 4.5 Performance is delight

- Grid: local covers only (fast)  
- **Instagram embeds mount only when the sheet opens**  
- Max **3** visible embeds even if 4 stored  
- Brand-colored skeletons while embeds load  
- Timeout → graceful fallback (cover + Open on Instagram) — never a broken hole  

### 4.6 Pick ceremony (not a form)

1. She taps **“Tell him this is the one ☕”**  
2. Optional short note to you (“Saturday morning? window seat?”)  
3. Soft sending state  
4. Success → **Date Card** (café name, vibes, her note, couple motif) — screenshot-friendly  
5. Failure → honest line + **Copy message** / Web Share with prefilled text + links  

### 4.7 Optional v1.5 — Swipe deck

Tinder-ish Keep / Maybe / Skip over the same data. Extremely delightful; **do not block v1**. Schedule as Phase 7 if energy remains.

---

## 5. Media strategy — public pages, private chrome

Public IG / Google / websites are **sources**. We **compose** the best fragments into your UI.

| Source | In-app use | Anti-pattern |
|--------|------------|--------------|
| Instagram **posts** (public) | Official embed (`blockquote.instagram-media` + `embed.js`) | Scraping feeds; hotlinking `cdninstagram.com` as permanent cover |
| Instagram **profile** | Handle + deep link + **2–4 curated post permalinks** | Full third-party grid widgets as single point of failure |
| Google Maps | `mapsUrl` (Directions) + optional `mapsEmbedUrl` peek | Forcing desktop Maps UI in a tiny iframe as the only CTA |
| Café website | Frozen **OG card** at curate time | Live full-page iframe |
| Your photos | Required `cover` (+ gallery) | Relying only on remote CDNs |

### 5.1 Instagram (pure client)

```html
<!-- Conceptual — implemented in React -->
<blockquote class="instagram-media"
  data-instgrm-permalink="https://www.instagram.com/p/.../"
  data-instgrm-version="14"></blockquote>
<!-- load embed.js once; process() when sheet opens -->
```

- No backend required for public posts  
- Progressive enhancement: embeds enhance, covers guarantee  

### 5.2 Maps

- **Always:** `mapsUrl` — opens native Maps  
- **Optional:** `mapsEmbedUrl` — in-sheet peek  
- Mobile: Directions is the primary place CTA  

### 5.3 Website preview

At curation (human or AI + script), freeze:

```ts
websitePreview?: {
  title?: string
  description?: string
  image?: string  // prefer downloaded under public/images/cafes/<id>/
}
```

If OG fetch fails, skip — never block adding a café.

---

## 6. Data model

### 6.1 Café schema (Zod = law for humans + AI)

```ts
Cafe {
  id: string                 // kebab-case; matches folder name
  name: string
  city: string
  neighborhood: string
  country?: string

  status: 'wishlist' | 'been' | 'favorite' | 'skip'
  tags: string[]             // breakfast | brunch | coffee | date | ...
  vibes: string[]            // controlled vocabulary in content docs
  bestFor: string[]          // morning | rainy-day | long-chat | quick-coffee
  price: string              // lock one system in Phase 0 (€ / $ / local tiers)

  blurb: string              // 1–2 sentences, public tone
  ourNote?: string           // YOUR tip to her — shown first in the sheet

  instagram: string          // handle without @
  instagramPosts: string[]   // 2–4 public post permalinks
  website?: string
  websitePreview?: OgPreview

  mapsUrl: string            // required
  mapsEmbedUrl?: string

  cover: string              // /images/cafes/<id>/cover.jpg — required, local
  gallery: string[]          // 0–6 local paths

  createdAt: string          // ISO
  updatedAt: string
}
```

**Files:**

- `content/cafes/<id>.json` — one café  
- `content/_template.json` — scaffold source  
- `content/CAFÉ_SCHEMA.md` — field docs + vibe vocabulary  
- `public/images/cafes/<id>/cover.jpg` (+ gallery)

**Validation must enforce:**

- Unique `id`  
- `cover` file exists on disk  
- `instagramPosts` length 0–4; host looks like Instagram permalink  
- `mapsUrl` present and URL-shaped  
- No accidental remote-only covers in v1  

### 6.2 Pick payload

```ts
PickPayload {
  cafeId: string
  cafeName: string
  note?: string
  instagramUrl?: string
  mapsUrl?: string
  coverUrl?: string          // absolute Pages URL when possible
  vibeTags?: string[]
  pickedAt: string           // ISO
  shortlistIds?: string[]
}
```

**localStorage keys (namespaced):**

- `cafe-options:hearts` → `string[]`  
- `cafe-options:last-pick` → `PickPayload`  
- `cafe-options:prefs` → sound on/off, etc.

---

## 7. Notifications — reliable, multi-signal

### 7.1 Principles

1. **Fan-out** behind one `notifyPick(payload)`  
2. **Email always** (audit + universal reach)  
3. **One instant channel** you actually read (WA / SMS / Bale)  
4. **Her UI never depends on perfect infra** — copy/share fallback always  
5. No Telegram  

### 7.2 Channel ladder

| Priority | Channel | Client-only? | Notes |
|----------|---------|--------------|--------|
| P0 | **Email** (Web3Forms or Formspree) | Yes | Default always-on |
| P0 | **WhatsApp** via CallMeBot-style HTTP (or equivalent) | Yes | Instant if you live in WA; token semi-public |
| P1 | **SMS** (e.g. Kavenegar) | No — Worker | Extremely reliable regionally |
| P1 | **Bale bot** | No — Worker | Strong local messenger fit |
| P2 | Google Apps Script | Yes | Email + Sheet log backup |
| P2 | Discord webhook | Yes | Only if you actually use it |
| — | ntfy / Telegram | — | Assume blocked unless proven |

### 7.3 Default recommendation

| Role | Channel |
|------|---------|
| Always | Email (Web3Forms) |
| Instant | **Phase 0 pick:** WhatsApp bot **or** SMS via Worker |
| Backup log | Optional Apps Script → Sheet |
| UI fallback | Copy / Web Share prefilled message |

**Success policy (her button):**  
Resolve success if **any one** of {email, instant} succeeds — or require email only if you want stricter audit. Prefer **any-one** so delight isn’t blocked by a single provider blip. Still show partial warnings in dev only.

### 7.4 Worker contract (if enabled)

```text
POST /notify
Origin: allowlist Pages URL only
Body: PickPayload
Auth: shared header secret (VITE_NOTIFY_SECRET is semi-public — prefer Worker-side rate limit + origin check)
Side effects: SMS and/or Bale
Response: { ok: true } | { ok: false, error }
```

Keep the Worker &lt; ~50 lines. No database. No café CRUD.

### 7.5 Message shape

- **SMS:** short — `☕ She picked {name}. {note?} {maps short link}`  
- **Email:** rich — name, note, IG, maps, cover link, timestamp, vibes  
- **WA:** medium — same as SMS + links  

---

## 8. AI & human curation automation

### 8.1 Goal

You tell an agent:

> Add Café X · IG @handle · posts: … · maps: … · note: best corner table  

…and get a **valid JSON file**, image checklist, and green `cafe:validate` — without editing React.

### 8.2 Repo contracts (check in on day one)

| Path | Purpose |
|------|---------|
| `AGENTS.md` | How agents edit content; forbidden inventions |
| `.agents/skills/curate-cafe/SKILL.md` | Step-by-step curate SOP |
| `content/CAFÉ_SCHEMA.md` | Fields + vibe vocabulary |
| `content/_template.json` | Empty valid café |
| `prompts/curate-cafe.md` | Copy-paste prompt fallback |

### 8.3 CLI

| Command | Behavior |
|---------|----------|
| `pnpm cafe:new --id … --name …` | JSON from template + `public/images/cafes/<id>/` |
| `pnpm cafe:validate` | Zod all cafés; unique ids; image paths; URL shapes |
| `pnpm cafe:check-embeds` | Warn 0 posts, bad IG hosts, &gt;4 posts |
| `pnpm cafe:og --id …` | Optional website OG → preview + image download |
| `pnpm cafe:lint-images` | Missing cover, huge files, wrong formats |

**CI:** `cafe:validate` must pass before Pages deploy.

### 8.4 Standard curate SOP

1. **Intake** — handle, post permalinks, maps link, notes, optional photos  
2. **Scaffold** — `pnpm cafe:new`  
3. **Fill JSON** — AI writes; human confirms maps + posts  
4. **Images** — drop `cover.jpg` (required); gallery optional  
5. **Validate** — `pnpm cafe:validate`  
6. **Preview** — `pnpm dev`, open sheet, confirm embeds  
7. **Ship** — commit → push → Actions  

### 8.5 Agent rules (non-negotiable)

**Must:**

- Output café JSON matching Zod  
- Prefer 2–4 real post **permalinks** over handle-only  
- Write `ourNote` when a tip exists  
- List missing image files explicitly  
- Run validate  

**Must not:**

- Invent maps URLs or fake post IDs  
- Hotlink Instagram CDN as permanent `cover`  
- Embed full website iframes  
- Edit UI components to “add a café”  
- Scrape login-walled content  

### 8.6 Why this is fast

| Old way | This way |
|---------|----------|
| Hand-edit JSX cards | Append one JSON file |
| Hunt design consistency | Tokens + one `CafeCard` |
| Broken deploys from bad paths | CI validate |
| “Add café” tribal knowledge | Skill + template + CLI |

---

## 9. Application structure

```text
cafe-options/
├── PLAN.md                          # this document
├── README.md                        # short human entry
├── AGENTS.md
├── .agents/skills/curate-cafe/SKILL.md
├── content/
│   ├── CAFÉ_SCHEMA.md
│   ├── _template.json
│   └── cafes/
│       └── <id>.json
├── public/
│   └── images/cafes/<id>/
├── scripts/
│   ├── cafe-new.ts
│   ├── cafe-validate.ts
│   ├── cafe-check-embeds.ts
│   ├── cafe-og.ts
│   └── cafe-lint-images.ts
├── src/
│   ├── routes/
│   │   ├── __root.tsx
│   │   └── index.tsx
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── FilterBar.tsx
│   │   ├── CafeCard.tsx
│   │   ├── CafeSheet.tsx
│   │   ├── InstagramEmbeds.tsx
│   │   ├── MapPeek.tsx
│   │   ├── WebsiteCard.tsx
│   │   ├── HeartButton.tsx
│   │   ├── ShortlistDrawer.tsx
│   │   ├── PickCeremony.tsx
│   │   ├── DateCard.tsx
│   │   └── SuccessMoment.tsx
│   ├── lib/
│   │   ├── schema.ts
│   │   ├── cafes.ts              # import.meta.glob content
│   │   ├── notify.ts             # fan-out adapters
│   │   ├── storage.ts
│   │   └── copy.ts               # intimate strings in one place
│   └── styles.css                # Tailwind + tokens
├── .github/workflows/deploy.yml
└── package.json
```

*(Optional later: `workers/notify/` for the Cloudflare Worker source.)*

### 9.1 Routes

| Route | v1 |
|-------|----|
| `/` | Hero, filters, deck, sheet, shortlist, ceremony |
| `/cafe/$cafeId` | **Deferred** — deep links if you want shareable single-café later |

### 9.2 Sheet content order (load-bearing for delight)

1. Cover + name + vibes + price  
2. **`ourNote`** (if present) — intimate, first  
3. Blurb  
4. Instagram embeds (lazy)  
5. Map peek + Directions  
6. Website card  
7. Actions: Heart · Choose  

---

## 10. Visual system

### 10.1 Direction

Warm editorial café journal:

- Background: paper cream  
- Accent: soft blush + matcha/olive  
- Text: chocolate / ink  
- Display: serif for café names  
- UI: clean sans  
- Cards: large radius, soft shadow, photographic  
- Avoid: purple SaaS gradients, neon, dense dashboards, emoji spam  

### 10.2 Tokens (implement in Tailwind v4 theme)

Define once: `--bg-paper`, `--ink`, `--blush`, `--matcha`, `--card-radius`, `--shadow-soft`, type scale, space scale.  
Components consume tokens only — no one-off hex in feature files.

### 10.3 Responsive

Mobile-first. Her phone is the primary device.  
Breakpoints: comfortable single column → 2-col deck → 3-col on large.

---

## 11. Hosting & CI

### 11.1 GitHub Pages

1. TanStack Start **SPA mode** build  
2. Set Vite `base` + Router `basepath` for project site (`/cafe-options/`) or root/custom domain (`/`)  
3. Post-build: `cp index.html 404.html` (SPA fallback)  
4. Actions: install → `cafe:validate` → typecheck → build → upload Pages artifact  

### 11.2 Secrets / env

| Var | Where | Notes |
|-----|-------|-------|
| `VITE_WEB3FORMS_KEY` | Actions + local `.env` | Semi-public by nature |
| `VITE_WHATSAPP_NOTIFY_URL` | Optional | Bot URL pattern |
| `VITE_NOTIFY_WORKER_URL` | Optional | Worker endpoint |
| Worker: `KAVENEGAR_*` / `BALE_*` | CF only | Never in the SPA bundle |
| Worker: `ALLOW_ORIGIN` | CF only | Pages origin allowlist |

### 11.3 Privacy (honest)

| Level | Approach |
|-------|----------|
| Default v1 | Public Pages, unguessable-ish repo name, `noindex`, robots noindex |
| Stronger | Private repo + private Pages (paid GH) |
| Later | Passphrase gate (weak client-side) or Cloudflare Access |

Do not pretend client-side password = real security. For a couple tool, obscure + noindex is often enough.

---

## 12. Phased delivery

### Phase 0 — Decisions (before code)

Lock in writing (README or here):

| # | Decision | Options |
|---|----------|---------|
| 1 | Pages URL shape | project site vs user site vs custom domain |
| 2 | Default city + price symbols | e.g. Tehran + local tiers |
| 3 | UI language | FA / EN / bilingual |
| 4 | Instant notify | WA bot · SMS+Worker · Bale+Worker · email-only |
| 5 | Worker allowed? | **Yes recommended** / no |
| 6 | Swipe mode | v1.5 later (default) / in v1 |
| 7 | Success policy | any-channel vs email-required |

### Phase 1 — Skeleton

- [x] Scaffold TanStack Start SPA + pnpm + Tailwind v4 tokens  
- [x] Hero placeholder, intimate empty state  
- [x] GH Actions → Pages hello world  
- [x] Verify base path + refresh behavior  

**Exit:** branded live URL.

### Phase 2 — Content engine

- Zod schema v2 (media fields)  
- Template + 2–3 real sample cafés with real IG post URLs  
- `cafe:new` / `cafe:validate`  
- `AGENTS.md` + `curate-cafe` skill  
- Load cafés via glob  

**Exit:** add JSON → appears in app after refresh/build.

### Phase 3 — Deck + rich sheet

- [x] FilterBar (mood / neighborhood / status / price)  
- [x] CafeCard grid  
- [x] CafeSheet with ordered sections  
- [x] Lazy Instagram embeds + Map peek + Website card  
- [x] Hearts + Shortlist drawer  

**Exit:** delightful browse on mobile; no notify yet.

### Phase 4 — Ceremony + notify

- [x] PickCeremony + Zod payload  
- [x] `notify.ts` fan-out (email + chosen instant)  
- [x] Optional Worker for SMS/Bale  
- [x] Date Card + success / failure / copy fallback  
- [x] Real-network test on your phone (critical)  

**Exit:** she picks → you get ping; failure path still kind.

### Phase 5 — Delight pass

- Motion polish, reduced-motion  
- Copy audit (`lib/copy.ts`)  
- Embed skeletons + timeout fallback  
- Empty / error states  
- Optional sound toggle  
- Mobile Safari + Chrome QA  

**Exit:** feels like a love product.

### Phase 6 — Curation at scale

- AI-curate 8–12 real cafés end-to-end  
- Tighten skill from real friction  
- `cafe:check-embeds` + `cafe:lint-images`  
- Optional Apps Script pick log  

**Exit:** &lt;10 min add-café ritual is real.

### Phase 7 — Optional extras

- Swipe deck mode  
- `/cafe/$id` share links  
- “We went here” log  
- Bilingual toggle  
- Stronger privacy  

---

## 13. Testing (right-sized)

| Layer | What |
|-------|------|
| Unit | Zod café fixtures; pick payload builder; notify adapter mocks |
| Scripts | `cafe:validate` on good + broken fixtures in CI |
| Manual | iPhone Safari + Android Chrome: deck, sheet, embeds, pick |
| Manual | Notify on **mobile data** and Wi‑Fi |
| Manual | Airplane mode → failure → copy fallback |
| Visual | 375 / 768 / 1280; light theme v1 |

No Playwright required for v1; add smoke later if deploys get scary.

---

## 14. Risk register

| Risk | Mitigation |
|------|------------|
| TanStack Start SPA config churn | Pin version; isolate SPA config; follow official SPA example |
| GH Pages base path bugs | Phase 0 URL shape; set Vite `base` + router basepath together |
| IG embed.js slow/blocked | Local cover always; lazy mount; timeout fallback |
| Too many embeds = jank | Max 3 visible; process on open only |
| Instant notify blocked | Email + copy fallback; test early on real network |
| Form/WA URL abuse | Obscure site; honeypot; rate limit; Worker origin allowlist |
| AI invents places | Skill forbids; validate URLs; human confirms maps |
| Scope creep (auth, live grids, iframes) | Non-goals table; Phase 7 parking lot |
| Secrets in SPA | Only semi-public form keys in Vite; real secrets in Worker |

---

## 15. Backlog (after v1)

- Swipe mode, deep links, been/favorite journal  
- Shared cloud shortlist (requires real backend or sheet sync)  
- FA/EN full i18n  
- Dark mode  
- Calendar deep link (“add this date”)  
- Tina/Decap if a non-dev must edit without git  
- Native push via a proper push service  

---

## 16. Build order cheat sheet

```text
Phase 0 decisions
    → 1 shell on Pages
    → 2 schema + CLI + skill + samples
    → 3 gorgeous deck + embeds
    → 4 pick + notify + Date Card
    → 5 delight + mobile QA
    → 6 twelve real cafés
    → 7 optional extras
```

---

## 17. Phase 0 answer block (fill before scaffolding)

```text
Pages URL:        TBD (decide after implementation)
Default city:     Tehran
Price system:     skip for now
UI language:      EN
Instant notify:   ntfy.sh + Email (Web3Forms) + Copy/Share fallback
Worker OK:        no
Swipe in v1:      no
Success policy:   any-channel
Couple title:     TBD (decide after implementation)
Hero line:        TBD (decide after implementation)
```

---

## 18. Ultimate summary

**Café Options** is a TanStack Start **SPA** on **GitHub Pages**: a warm, media-first **date deck** where each café is a JSON file enriched with **official Instagram embeds**, **map peeks**, and **frozen site cards**, wrapped in scrapbook UI and a real **pick ceremony** for her. You get **redundant, region-proof notifications** (email always; WhatsApp and/or SMS/Bale via an optional tiny Worker — never Telegram). AI agents add cafés through a **schema + skill + validate** pipeline so the product stays easy to grow and impossible to turn into hand-edited JSX.

---

*Document version: ultimate polish · plan-only · ready for Phase 0 answers then implementation.*
