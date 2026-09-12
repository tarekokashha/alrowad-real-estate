# Realora-style redesign — design

**Date:** 2026-09-12
**Branch:** `worktree-realora-redesign`
**Status:** approved in chat, implementation pending

## What the client asked for

A full visual rebuild of the Arabic site so that it matches a reference the
client supplied as a TikTok clip — a commercial real-estate template called
**Realora**. His words: «نسخة طبق الأصل من الفيديو … اعمل الموقع كله كده».

Two follow-on instructions, given after the section map was agreed:

1. **The apartments must animate** — «عايز الشقق كده وهي لتتعرض ليها انميشن
   وحتي في السكرول». Unit cards are a named deliverable, not a side effect.
2. **The entrance frame-sequence goes.** He watched it in a real browser and
   called the quality unacceptable — «الفيديو الاول جودته زبالة لو كده خليه
   صور بس بسكرول انميشن كويس». The hero becomes a still image driven by
   scroll.
3. Libraries are now permitted — «استخدم المكتبات والادوات اللي تحتاجها».

## The reference, as observed

The clip is a 22-second phone recording of a laptop screen. It was downloaded
locally, decomposed into 22 keyframes, and read frame by frame. Everything
below is from those frames, not from memory of the template.

| Beat | What it is | The motion |
|---|---|---|
| 1 | Dark hero, architectural photo, three-line headline, outlined button, phone number | static |
| 2 | Amber wash floods the viewport | scrub |
| 3 | Statement on white + a column of labelled counts | counters |
| 4 | Full-bleed white architectural render | blur resolves on scrub |
| 5 | Named project cards | staggered arrival |
| 6 | The single word **Expertise**, enormous, on amber | scales on scrub |
| 7 | Service list set in outlined type that fills in, one item at a time | scrub — the signature |
| 8 | Black-and-white video still with a play control | static |
| 9 | Testimonials with a 4.9/5.0 rating and an image collage | — |
| 10 | Six-person team grid plus a gold recruitment card | — |
| 11 | Numbered accordion 01→04, "What Is Our Main Process Of Works?" | opens with an image |
| 12 | Blog cards, then a dark footer carrying a giant outlined wordmark | — |

Palette: near-black, warm off-white, and a saturated amber. Headlines are set
in a heavy geometric grotesk, very tight.

## The one thing that is not being copied

Beats 7 and 10 belong to an **architecture practice**: the services are
Architecture / Interior / Landscape / Visualisation / Consultancy, the team is
six named architects, and "Our Projects" means buildings the firm designed.

الرواد is a **brokerage**. It does not design buildings and does not employ
those six people. Reproducing those sections literally would put fabricated
staff and fabricated authorship on a live commercial site — on a site whose
entire argument is that its numbers can be checked. The layout, the type, the
colour and the motion of those beats are copied exactly; what fills them is
real.

This was raised with the client before any work started and he chose the full
rebuild on that basis.

## Section map — homepage

| # | Realora beat | الرواد | Source of truth |
|---|---|---|---|
| 1 | Dark hero | Full-bleed still, H1 «نعرف كل متر في حدائق أكتوبر» | `public/img/gate-night.webp` |
| 2 | Amber wash | Transition into the first light section | — |
| 3 | Statement + counters | «الأرقام اللي تقدر تراجعها» + four counts | `TOTAL_LISTED`, `LEGAL_STATUSES`, `PRICE_INDEX` |
| 4 | Full-bleed render | Unit photograph, blur resolving | `lib/units.ts` |
| 5 | Project cards | The unit grid — **the client's named deliverable** | `getUnits()` |
| 6 | *Expertise* | **«مُوثّق»** at the same scale | — |
| 7 | Filling service list | بيع · شراء · تقسيط · توثيق · مصريون في الخليج | `lib/content.ts` |
| 8 | B&W video still | حدائق أكتوبر, full-bleed, desaturated | `public/img/area-aerial.webp` |
| 9 | Testimonials + rating | Testimonials **only if published**; no invented rating | `TESTIMONIALS` |
| 10 | Six-person team | «مين إحنا» — one firm, the registry numbers | `COMPANY` |
| 11 | Numbered accordion | خطوات الشراء ٠١←٠٤ | new copy, factual |
| 12 | Blog + footer | مؤشر الأسعار + أرشيف المباع, then the footer | `PRICE_INDEX`, `RECENT_SALES` |

### On the counters

There is a comment in the current homepage arguing against animated counters:
they are the most template-coded element in real-estate design, and a counter
that lands on "500+ units sold" is an unverifiable claim dressed as data.

That reasoning survives; the conclusion changes. Counters are used, but only
on numbers a reader can go and check, each captioned with where it comes
from:

- **١٤٨** وحدة مدرجة → the catalogue holds 148
- **٤١** مسجلة بالشهر العقاري → the legal-status breakdown
- **٣١** عملية بيع موثقة → the index's own stated sample
- **٦** مناطق في المؤشر → the index has six rows

"خمسة عشر عامًا" and "٥٠٠+ وحدة" stay as prose. They are not checkable, so
they do not get the treatment that makes a number look audited.

## Design tokens

### Colour — "Charcoal & Amber"

The existing "Limestone & Bronze" palette is replaced wholesale. Bronze and
amber are close enough that the change reads as a sharpening rather than a
different company; the green action colour goes.

```
--void          #0A0A0A   hero, footer, dark sections
--carbon        #141414   raised surfaces on void
--paper         #F6F4F0   warm off-white, the default ground
--paper-2       #EDEAE4   alternating bands, card fills
--ink           #14130F   text on paper
--structure     #6B675E   secondary text on paper
--hairline      #DCD7CC   rules on paper
--amber         #C89033   primary accent, buttons, the giant word
--amber-bright  #E8B54B   the wash, hover states
--amber-deep    #8A6220   pressed, text on amber where contrast demands
--paper-on-void rgba(246,244,240,.72)
--hairline-void rgba(246,244,240,.14)
```

Contrast is checked, not assumed: `--ink` on `--paper`, `--paper` on `--void`,
and `--ink` on `--amber` must each clear 4.5:1, and the giant display type
must clear 3:1.

### Type

| Role | Was | Becomes |
|---|---|---|
| Arabic display | Amiri (serif) | **Tajawal** 700/800 |
| Arabic text | IBM Plex Sans Arabic | unchanged |
| Latin display | Newsreader (serif) | **Plus Jakarta Sans** 700/800 |
| Numerals, codes | IBM Plex Mono | unchanged |

Both serifs are dropped. The reference has no serif anywhere, and Amiri in
particular reads as classical Arabic publishing, which is the opposite of the
register being aimed at.

Tajawal is the closest Arabic face to the reference's geometric grotesk and
carries a heavy weight that survives being set at 18vw. The Arabic token
switch (19px / 1.8 line height) stays exactly as it is — it was measured, and
nothing about this redesign changes how Arabic is read.

### Motion

Two curves, three durations and one stagger stay. Added:

```
--scrub-ease   none          scrub-driven motion is linear by definition
--d-hero       1200ms
```

## Architecture

### The motion system

The current system is a stylesheet of `[data-reveal]` variants plus
`ScrollMotion.tsx`, an IntersectionObserver with a requestAnimationFrame
sweep behind it. It does **arrivals** — an element becomes visible once — and
nothing else.

Six of the reference's twelve beats are **scrub-driven**: the effect is a
function of scroll position, continuously, in both directions. The existing
system cannot express that, and bolting a second bespoke system beside it
would leave two things to reason about.

So it is replaced by one system: **GSAP + ScrollTrigger**, with **Lenis** for
smooth scroll.

- `ScrollMotion.tsx` and the `[data-reveal]` CSS are deleted.
- A single client component, `Motion.tsx`, mounts in the layout, reads
  `[data-anim]` attributes out of the DOM and wires the triggers. Server
  components keep opting in with markup alone — the property that made the
  old system worth having is preserved.
- `gsap.matchMedia()` handles `prefers-reduced-motion`, which is what it is
  for.

**The rule that does not change: additive, never gating.** Nothing is parked
at `opacity: 0` in the stylesheet waiting for JavaScript to release it.
`gsap.from()` sets its starting state at init, so if the bundle fails the page
is simply static and complete. This is the property that makes the site
indexable and quotable with JavaScript off, and it is not negotiable.

Weight: gsap core ≈23 KB gzipped, ScrollTrigger ≈11 KB, Lenis ≈3 KB. Against
that, deleting `public/entrance/` removes **7.5 MB**.

### The hero

`Entrance.tsx`, `EntranceGate.tsx`, `lib/motion.ts` and all three frame tiers
in `public/entrance/` are removed.

The replacement is one still image, full-bleed, with a ScrollTrigger scrub
across roughly 140vh:

| Property | Start | End |
|---|---|---|
| image scale | 1.0 | 1.18 |
| image blur | 0 | 8px |
| overlay opacity | 0.45 | 0.92 |
| headline y / opacity | 0 / 1 | −80px / 0 |

The amber wash of beat 2 is the tail of the same timeline.

### Unit cards — the named deliverable

Three layers, because the client asked for this specifically:

1. **Arrival.** Cards enter on a 60 ms stagger with a `clip-path` wipe that
   respects RTL — the inset opens from the right edge. The image inside
   starts at 1.14 and settles to 1.0, so the picture appears to come to rest
   rather than slide in.
2. **Scrub.** Each card's image is taller than its frame and moves against the
   scroll — roughly 12% of the frame height across the full pass. Different
   depths per column, so a row does not move as one slab.
3. **Pointer.** Scale, a shadow lift, and the price sliding up from under the
   title. Pointer-only; it never fires on touch.

The catalogue re-renders its grid on every filter change, so the triggers must
be rebuilt on that change rather than only at mount — the current
MutationObserver approach carries over to the new system.

## The other six pages

`/properties`, `/properties/[code]`, `/sold`, `/gulf`, `/about` and
`/areas/hadayek-october` all take the new tokens automatically, since nothing
hard-codes a colour. Each additionally gets:

- A dark full-bleed page header, matching the hero's treatment at a third of
  the height.
- The same `[data-anim]` vocabulary on its sections.
- The footer's giant outlined «الرواد».

## Out of scope

- The Payload admin panel, the collections, and the storage configuration.
  None of it is touched.
- The data itself. Every placeholder in `lib/content.ts` remains a
  placeholder, and the pre-launch warning at the top of that file stands.
- The two dead footer links (`/ar/areas/6-october`, `/ar/areas/sheikh-zayed`).
  Raised three times, still unanswered; they are a content decision, not a
  design one. They stay broken and stay flagged.

## Verification

Nothing here is "should work". Each of these is a command whose output goes in
the commit:

1. `npm run build` compiles, and every one of the 18 routes returns 200.
2. With JavaScript disabled, the homepage H1, the unit grid and the footer are
   all present in the served HTML and none of them are transparent.
3. With `prefers-reduced-motion: reduce`, no element has a transform or an
   opacity below 1 after load.
4. At 390 px there is no horizontal overflow on any page, and every control is
   at least 44 px.
5. Scroll position 0 → bottom in one jump leaves zero elements hidden. This is
   the regression that bit the previous system twice; it gets an explicit
   check.
6. Contrast ratios for the four pairs named above.
7. Largest Contentful Paint on the homepage does not regress against the
   current build.
