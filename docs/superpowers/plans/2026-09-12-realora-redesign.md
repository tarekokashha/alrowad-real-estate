# Realora-style redesign — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the whole Arabic site in the visual language, section order and
scroll behaviour of the Realora reference, filled with الرواد's real content.

**Architecture:** One design-token file drives all seven pages. One client
component, `Motion.tsx`, reads `[data-anim]` attributes out of the server-
rendered DOM and wires GSAP ScrollTriggers, so server components opt into
motion with markup alone. The bespoke `[data-reveal]` system and the entire
canvas frame-sequence entrance are deleted.

**Tech Stack:** Next.js 16.3.4 App Router · React 19.1.1 · TypeScript · CSS
Modules · GSAP 3.15 + ScrollTrigger · Lenis 1.3 · Payload 3.88 (untouched)

**Spec:** `docs/superpowers/specs/2026-09-12-realora-redesign-design.md`

## Global Constraints

- **Additive, never gating.** No stylesheet rule may park content at
  `opacity: 0` or any transform awaiting JavaScript. Starting states are set
  by `gsap.from()` at init. With the bundle blocked, every page must render
  complete and fully opaque.
- **RTL is the default, not a variant.** Every directional value uses logical
  properties (`inset-inline-start`, `margin-inline`, `padding-inline`) or is
  mirrored explicitly. `clip-path` insets open from the inline-start edge.
- **Arabic type tokens are frozen.** `--fs-body: 19px` / `--lh-body: 1.8` under
  `:lang(ar)`, `letter-spacing: 0` always, `font-synthesis: none`. These were
  measured; this redesign does not revisit them.
- **`prefers-reduced-motion: reduce` disables all motion** via
  `gsap.matchMedia()`. Not "reduces" — disables. Final states apply instantly.
- **No invented facts.** Every number rendered comes from `lib/content.ts`,
  `lib/units.ts`, `lib/sold.ts` or `getUnits()`. No fabricated staff, ratings,
  projects or authorship. See the spec's "The one thing that is not being
  copied".
- **Touch targets ≥ 44 px**; achieved with padding plus matching negative
  margin so layout does not shift.
- **The Payload admin, the collections and storage are out of scope.** No file
  under `app/(payload)/`, `collections/` or `payload.config.ts` is modified.
- Colour pairs that must clear **4.5:1**: ink/paper, paper/void, ink/amber.
  Display type over its ground must clear **3:1**.

---

### Task 1: Verification harness

Written first so that it fails first. A CSS redesign has no unit tests worth
writing; what it has is a list of properties that must hold, and this is that
list made executable.

**Files:**
- Create: `scripts/verify-design.mjs`
- Modify: `package.json` (add `verify:design` script)

**Interfaces:**
- Consumes: nothing.
- Produces: `npm run verify:design [baseUrl]` — exits 0 on pass, 1 on any
  failure, printing one line per check. Default base `http://localhost:3100`.

- [ ] **Step 1: Write the harness with all checks failing-by-default**

Checks, in order:

1. **Routes** — every path in this list returns 200:
   `/ar`, `/ar/properties`, `/ar/sold`, `/ar/gulf`, `/ar/about`,
   `/ar/areas/hadayek-october`, and `/ar/properties/<first unit code
   lowercased>`.
2. **No-JS content** — the raw HTML of `/ar` contains the H1 text
   «نعرف كل متر», at least six unit codes matching `/HO-[A-Z0-9-]+/`, and the
   footer's registry line.
3. **No parked opacity** — the served HTML and the CSS it links contain no
   rule matching `\[data-anim[^\]]*\]\s*(?::not\([^)]*\))?\s*\{[^}]*opacity:\s*0`.
   This is the "additive, never gating" constraint, enforced.
4. **Entrance removed** — `public/entrance/` does not exist, and no source
   file references `framePath`, `ENTRANCE_TIERS` or `data-entrance`.
5. **Contrast** — parse the token block out of `app/globals.css`, compute
   WCAG contrast for the four pairs named in Global Constraints, assert the
   floors.
6. **Dead-token scan** — no source file references `--bronze`, `--action`,
   `--paper-deep`, `Amiri` or `Newsreader`.

- [ ] **Step 2: Run it against the current build — expect failures**

```bash
npm run dev &
npm run verify:design
```

Expected: checks 4, 5 and 6 FAIL (entrance still present, old palette still
present). Checks 1–3 pass, which confirms the harness reads a real site
rather than reporting success on nothing.

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-design.mjs package.json
git commit -m "Add the redesign verification harness"
```

---

### Task 2: Tokens and typography

**Files:**
- Modify: `app/globals.css:1-70` (the token block)
- Modify: `app/[locale]/layout.tsx:143` (the font stylesheet link)

**Interfaces:**
- Produces: the token names every later task consumes. Exactly these:

```css
--void --carbon --paper --paper-2 --ink --structure --hairline
--amber --amber-bright --amber-deep --paper-on-void --hairline-void
--ar-display --ar-text --la-display --mono
--arrival --settle --scrub-ease --d-micro --d-element --d-section --d-hero --stagger
```

Values are in the spec under "Design tokens". `--bronze`, `--bronze-deep`,
`--action`, `--action-on-night`, `--night`, `--paper-deep`,
`--bronze-on-night` and `--paper-on-night` are **removed**, not aliased —
Task 1 check 6 fails if any survives.

- [ ] **Step 1: Replace the token block and swap the font link**

Google Fonts URL becomes Tajawal 400;500;700;800 + IBM Plex Sans Arabic
400;500;600 + Plus Jakarta Sans 400;600;800 + IBM Plex Mono 400;500.
Amiri and Newsreader are dropped from the request.

- [ ] **Step 2: Sweep every consumer of a removed token**

```bash
grep -rn -- "--bronze\|--action\|--night\|--paper-deep\|Amiri\|Newsreader" app components --include=*.css --include=*.tsx
```

Every hit is rewritten to the new palette. Expected mapping: `--bronze` →
`--amber`, `--action` → `--amber` (the green CTA becomes the amber one),
`--night` → `--void`, `--paper-deep` → `--paper-2`,
`--paper-on-night` → `--paper-on-void`.

- [ ] **Step 3: Verify**

```bash
npm run typecheck && npm run verify:design
```

Expected: checks 5 and 6 now PASS. Check 4 still fails.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css "app/[locale]/layout.tsx" app components
git commit -m "Charcoal and amber, and drop both serifs"
```

---

### Task 3: The motion runtime

The load-bearing task. Everything after it consumes this attribute
vocabulary, so it is pinned here exactly and must not drift.

**Files:**
- Create: `components/Motion.tsx`
- Create: `components/motion.css` (imported by globals — holds only the
  handful of rules GSAP cannot express, e.g. `will-change` hints)
- Delete: `components/ScrollMotion.tsx`
- Modify: `app/globals.css` — remove the entire `[data-reveal]` block
- Modify: `app/[locale]/layout.tsx` — mount `<Motion />` in place of
  `<ScrollMotion />`

**Interfaces:**

- Consumes: tokens from Task 2.
- Produces: **the `data-anim` vocabulary.** Every later task uses only these.

| Attribute | Kind | Effect |
|---|---|---|
| `data-anim="rise"` | arrival | y 48px → 0, opacity 0 → 1, `--d-section`, `--arrival` |
| `data-anim="fade"` | arrival | opacity 0 → 1 |
| `data-anim="wipe"` | arrival | `clip-path` inset opens from inline-start |
| `data-anim="lines"` | arrival | direct children rise on `--stagger` |
| `data-anim="img"` | arrival | wrapper clip-reveals; the `img`/`canvas` inside scales 1.14 → 1 |
| `data-anim="counter"` | arrival | counts 0 → `data-to`, Eastern digits, once |
| `data-anim="fill"` | **scrub** | children gain `--f` 0 → 1 in sequence; CSS paints the fill |
| `data-anim="parallax"` | **scrub** | inner element y by `data-depth` × height |
| `data-anim="hero"` | **scrub** | the hero timeline — see Task 4 |
| `data-anim="grow"` | **scrub** | scale `data-from` → `data-to` |
| `data-anim="wash"` | **scrub** | amber overlay 0 → 1 → 0 across its own height |

Modifiers, valid on any of the above: `data-stagger`, `data-delay="1|2|3"`,
`data-depth="<number>"`, `data-to="<number>"`, `data-from="<number>"`.

Contract notes an implementer must honour:

- Arrivals use `gsap.from()` with `scrollTrigger.once: true`, start
  `top 82%`. Scrubs use `scrub: 0.6`.
- **Rebuild on DOM change.** The catalogue re-renders its grid on every
  filter change. A `MutationObserver` on `document.body` calls a debounced
  re-scan that wires triggers for `[data-anim]:not([data-anim-ready])` and
  stamps them. This exact failure — filtered-in cards staying invisible —
  is why the observer exists.
- `ScrollTrigger.refresh()` on Lenis's `scroll` event and on `resize`.
- Lenis: `lerp: 0.09`, `wheelMultiplier: 1`, `autoRaf: false`, driven from
  `gsap.ticker` so there is one rAF loop for the page.
- `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` wrapping
  **every** animation. Under `reduce`, Lenis is not constructed at all and no
  trigger is created, so the page is ordinary.

- [ ] **Step 1: Write `Motion.tsx` implementing the table above**

- [ ] **Step 2: Delete the old system**

```bash
git rm components/ScrollMotion.tsx
```
Remove the `[data-reveal]` block from `app/globals.css` in full.

- [ ] **Step 3: Temporarily mark the old attributes**

`data-reveal` still appears on ~26 elements. Rename them all to the nearest
`data-anim` equivalent now (`rise`→`rise`, `image`→`img`, `line`→`lines`,
`wipe`→`wipe`) so the site never sits in a state where markup references a
system that no longer exists.

```bash
grep -rln 'data-reveal' app components | xargs sed -i 's/data-reveal="image"/data-anim="img"/g; s/data-reveal="line"/data-anim="lines"/g; s/data-reveal=/data-anim=/g'
```

- [ ] **Step 4: Verify in a browser**

Start the dev server, load `/ar`, and confirm numerically — not by
screenshot:
- `document.querySelectorAll('[data-anim]').length` > 20
- after `window.scrollTo(0, document.body.scrollHeight)`, the count of
  elements with computed `opacity < 1` is **0**
- with reduced motion emulated, no element has a non-identity transform

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Replace the bespoke reveal system with GSAP ScrollTrigger"
```

---

### Task 4: The hero

**Files:**
- Create: `components/Hero.tsx`, `components/Hero.module.css`
- Delete: `components/Entrance.tsx`, `components/Entrance.module.css`,
  `components/EntranceGate.tsx`, `lib/motion.ts`, `public/entrance/` (all
  three tiers, 7.5 MB)
- Modify: `app/[locale]/page.tsx` — `<Entrance>` → `<Hero>`
- Modify: `app/[locale]/layout.tsx` — drop the `<EntranceGate />` mount and
  its pre-paint script

**Interfaces:**
- Consumes: `data-anim="hero"`, `data-anim="wash"` from Task 3.
- Produces: `<Hero locale={string}>{children}</Hero>` — children are the
  server-rendered H1 and facts, exactly as `<Entrance>` took them. The
  no-JS guarantee rides on this signature, so it does not change.

Scrub values (from the spec): image scale 1 → 1.18, blur 0 → 8px, overlay
0.45 → 0.92, headline y 0 → −80px and opacity 1 → 0, across 140vh.

- [ ] **Step 1: Build `Hero.tsx` against `public/img/gate-night.webp`**

`next/image` with `priority`, `sizes="100vw"`, `quality={85}`. The dark
overlay is a pseudo-element whose opacity is the scrubbed property, so the
image itself is never re-rasterised.

- [ ] **Step 2: Delete the entrance, all of it**

```bash
git rm -r public/entrance components/Entrance.tsx components/Entrance.module.css components/EntranceGate.tsx lib/motion.ts
```

- [ ] **Step 3: Verify**

```bash
npm run typecheck && npm run build && npm run verify:design
```
Expected: **all six checks PASS.** Check 4 was failing since Task 1; this is
the step that closes it.

- [ ] **Step 4: Confirm the weight actually left**

```bash
du -sh public
```
Expected: under 1 MB, down from 8.2 MB.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Replace the frame sequence with a scrubbed still"
```

---

### Task 5: Statement and counters

**Files:**
- Modify: `app/[locale]/page.tsx` — replace the `s.trust` section
- Modify: `app/[locale]/page.module.css`

**Interfaces:** consumes `data-anim="counter"` with `data-to`.

Four counts, each captioned with where it can be checked:

| Value | Caption | Source |
|---|---|---|
| 148 | وحدة مدرجة | `TOTAL_LISTED` |
| 41 | مسجلة بالشهر العقاري | `LEGAL_STATUSES[0].count` |
| 31 | عملية بيع موثقة في المؤشر | `PRICE_INDEX.sampleAr` |
| 6 | مناطق في المؤشر | `PRICE_INDEX.rows.length` |

The values are **read from those exports**, never retyped as literals — if
the data changes the counters follow.

The existing prose sentence («خمسة عشر عامًا … ٥٠٠+ وحدة») stays as prose
below the counters, unanimated. The spec explains why.

- [ ] **Step 1: Build the section**
- [ ] **Step 2: Verify each counter's final value equals its source export**
- [ ] **Step 3: Commit** — `git commit -m "Counters, on numbers that can be checked"`

---

### Task 6: Full-bleed band and the unit grid

**The client's explicitly named deliverable.** Three layers, per the spec.

**Files:**
- Modify: `components/PropertyCard.tsx`, `components/PropertyCard.module.css`
- Modify: `app/[locale]/page.tsx` — the gallery section becomes the
  full-bleed band plus the grid
- Modify: `app/[locale]/page.module.css`
- Modify: `components/Catalogue.tsx` — grid markup only

**Interfaces:** consumes `data-anim="img"`, `data-anim="parallax"` +
`data-depth`, `data-stagger`.

- [ ] **Step 1: Full-bleed band** — one unit photograph at 100vw, `img`
  wrapped in `data-anim="parallax" data-depth="0.14"`, blur 12px → 0 on the
  same scrub.

- [ ] **Step 2: Card arrival** — `clip-path` wipe from the inline-start
  (right, in RTL), 60 ms stagger, inner image 1.14 → 1.

- [ ] **Step 3: Card parallax** — image 118% of frame height, `data-depth`
  alternating 0.10 / 0.16 / 0.12 by column so a row does not move as a slab.

- [ ] **Step 4: Pointer state** — under `@media (hover: hover) and
  (pointer: fine)` only: scale 1.02, shadow lift, price translates up from
  under the title.

- [ ] **Step 5: Verify the filter case**

Load `/ar/properties`, apply an area filter, and assert in the browser that
every card in the filtered grid has computed `opacity === 1`. This is the
regression Task 3's MutationObserver exists for; it gets its own check.

- [ ] **Step 6: Commit** — `git commit -m "Unit cards: arrival, parallax, pointer"`

---

### Task 7: The giant word

**Files:** modify `app/[locale]/page.tsx`, `app/[locale]/page.module.css`

«مُوثّق» on `--amber`, Tajawal 800, `font-size: clamp(84px, 18vw, 300px)`,
`data-anim="grow" data-from="0.86" data-to="1"`. A single line of prose
beneath it states what the word refers to — the legal-status breakdown —
and links to it.

Contrast: `--ink` on `--amber` must clear 3:1 at this size; assert it.

- [ ] **Step 1: Build** · [ ] **Step 2: Verify contrast** · [ ] **Step 3: Commit**

---

### Task 8: The filling service list

The reference's signature effect, and the hardest thing in this plan.

**Files:**
- Modify: `app/[locale]/page.tsx` — replaces the `s.pillars` section
- Modify: `app/[locale]/page.module.css`

**Interfaces:** consumes `data-anim="fill"`. Each child receives `--f` from
0 to 1 in sequence as the section is scrubbed.

Five items: بيع · شراء · تقسيط · توثيق قانوني · مصريون في الخليج.

Set in Tajawal 800 at `clamp(40px, 7vw, 96px)`. The unfilled state is
`-webkit-text-stroke: 1px var(--structure)` with `color: transparent`; the
filled state is a `background-image: linear-gradient()` hard stop at `--f`,
clipped to the text. **`-webkit-text-stroke` has no standard equivalent** —
in a browser without it the items must render as solid `--ink` text, not as
invisible text. Verify that fallback explicitly by disabling the property.

- [ ] **Step 1: Build the fill mechanism**
- [ ] **Step 2: Verify the no-`text-stroke` fallback renders solid, legible text**
- [ ] **Step 3: Verify each item reaches `--f: 1` and stays there past the section**
- [ ] **Step 4: Commit** — `git commit -m "The service list fills as you pass it"`

---

### Task 9: Area band, testimonials, and who we are

**Files:** modify `app/[locale]/page.tsx`, `app/[locale]/page.module.css`

- [ ] **Step 1: B&W area band** — `area-aerial.webp` full-bleed,
  `filter: grayscale(1)` easing to `grayscale(0)` on scrub, the area name
  over it. No play button: there is no video, and a control that does
  nothing is worse than no control.

- [ ] **Step 2: Testimonials** — renders the two entries in `TESTIMONIALS`.
  **No aggregate rating.** The reference's "4.9/5.0" has no basis here and
  inventing one is the exact failure this site is built against. If the
  array is empty the section does not render.

- [ ] **Step 3: «مين إحنا»** — replaces the six-person team grid. One
  company, the real registry numbers from `COMPANY`, and the Ministerial
  Decision 578/2025 reference verbatim. Keeps the reference's grid rhythm
  with one large cell and the amber card beside it.

- [ ] **Step 4: Commit** — `git commit -m "Area band, testimonials, and who we are"`

---

### Task 10: The numbered process accordion

**Files:**
- Create: `components/Process.tsx`, `components/Process.module.css`
- Modify: `app/[locale]/page.tsx`

Four steps: ٠١ معاينة · ٠٢ حجز · ٠٣ تعاقد · ٠٤ تسجيل بالشهر العقاري. Each
opens to reveal copy and an image, exactly as beat 11 does.

**Accessibility is not optional here.** It is a disclosure widget: a
`<button aria-expanded>` per row controlling a panel by `id`, arrow-key
navigation between headers, and the open panel reachable in tab order.
One panel open at a time; the first is open on load so the section is never
a column of closed bars.

- [ ] **Step 1: Build with the button/panel semantics from the start**
- [ ] **Step 2: Verify by keyboard alone — Tab to each header, Enter opens,
      `aria-expanded` flips, panel content is reachable**
- [ ] **Step 3: Commit** — `git commit -m "The buying process, as a disclosure widget"`

---

### Task 11: Index, archive, contact, footer

**Files:** modify `app/[locale]/page.tsx`, `app/[locale]/page.module.css`,
`components/Footer.tsx`, `components/Footer.module.css`

- [ ] **Step 1: Price index and sold archive** restyled to the new tokens,
  taking beat 12's card rhythm. The table stays a table.
- [ ] **Step 2: Contact section** on `--void`.
- [ ] **Step 3: Footer** — the giant outlined «الرواد» across the bottom
  edge, `-webkit-text-stroke` on `--hairline-void`, `aria-hidden`, clipped so
  it cannot cause horizontal overflow at any width. Same stroke fallback
  check as Task 8.
- [ ] **Step 4: Verify no horizontal overflow at 390px, 768px, 1440px**
- [ ] **Step 5: Commit** — `git commit -m "Index, archive, contact, and the footer wordmark"`

---

### Task 12: The other six pages

Independent of one another; may run in parallel. Each takes the dark
full-bleed page header at a third of the hero's height, the `data-anim`
vocabulary on its sections, and the new tokens.

- [ ] `/ar/properties` — including the affordability block and filter rail
- [ ] `/ar/properties/[code]` — gallery, spec table, instalment calculator
- [ ] `/ar/sold`
- [ ] `/ar/gulf`
- [ ] `/ar/about`
- [ ] `/ar/areas/hadayek-october`

Per page: **Step 1** restyle · **Step 2** verify 200, no overflow at 390px,
zero elements below opacity 1 after a jump to the bottom · **Step 3** commit.

---

### Task 13: Whole-site verification

- [ ] **Step 1:** `npm run typecheck && npm run build && npm run verify:design`
- [ ] **Step 2:** JavaScript disabled — every page renders complete and opaque
- [ ] **Step 3:** `prefers-reduced-motion: reduce` — no transforms, no Lenis
- [ ] **Step 4:** 390 px — no horizontal overflow, all targets ≥ 44 px
- [ ] **Step 5:** instant jump to the bottom of every page — zero hidden elements
- [ ] **Step 6:** keyboard pass — the accordion, the filters, the calculator
- [ ] **Step 7:** LCP on `/ar` against the current production build
- [ ] **Step 8:** push the branch and confirm the Vercel preview is READY

---

## Self-review

**Spec coverage.** All twelve beats are claimed: 1 and 2 by Task 4, 3 by
Task 5, 4 and 5 by Task 6, 6 by Task 7, 7 by Task 8, 8–10 by Task 9, 11 by
Task 10, 12 by Task 11. Tokens → Task 2. Motion system → Task 3. Other
pages → Task 12. Verification list → Tasks 1 and 13.

**Placeholders.** None. Every step names a file, a command or an assertion.

**Type consistency.** The `data-anim` vocabulary is defined once, in Task 3,
and every later task cites only names from that table. `Hero` keeps
`Entrance`'s exact props so Task 4 is a substitution, not a rewrite.

**Known gap, deliberate.** The two dead footer links stay broken; the spec
records why. Task 13 does not assert them.
