# Design motion guideline for Next.js/TS sites (Google‑Stitch‑like)

This guideline defines how to design motion so it maps cleanly to a Next.js/TypeScript codebase.

---

## 1. Motion primitives to standardize

Define a small motion system first so devs can map them 1:1 to Framer Motion / View Transitions / GSAP.

- Page enter/exit
    - Enter: 300–400 ms, fade in + slight upward translation (16–32 px).
    - Exit: 200–250 ms, fade out + slight downward translation.
- Section reveal
    - On scroll into view: 300 ms, 40–60 px translate + fade.
    - Stagger children by 40–80 ms.
- Emphasis “lift”
    - Hover: scale 1.02–1.04, shadow elevation step + color/emphasis change.
    - Tap/press: 95% scale, then spring back.
- Microcopy/labels
    - Opacity + Y translation only, no scale.
- Easing tokens
    - `motion/ease-in-out`: `cubic-bezier(0.4, 0.0, 0.2, 1.0)`
    - `motion/decelerate`: `cubic-bezier(0.0, 0.0, 0.2, 1.0)`
    - `motion/accelerate`: `cubic-bezier(0.4, 0.0, 1.0, 1.0)`

Use only 2–3 durations: `motion/fast` 150 ms, `motion/medium` 250 ms, `motion/slow` 400 ms.

---

## 2. Design setup and naming

Goal: 1 design component ↔ 1 React component, animation spec lives on the component or frame description.

- Component structure
    - Each reusable piece is a design component: `Button`, `Card`, `FeatureRow`, `PricingPlan`, `Navbar`, `Footer`, `Testimonial`.
    - Use variants for state: `default`, `hover`, `pressed`, `loading`, `disabled`.
- Layer naming
    - Top frame name = component name in PascalCase: `HeroSection`, `FeatureGrid`, `PrimaryButton`.
    - Consistent child layer names: `bg`, `image-wrapper`, `headline`, `subheadline`, `cta-primary`, `cta-secondary`, `eyebrow`, `icon`, `badge`.
- Motion tags in names
    - Prefix frames with roles:
        - `motion-page`
        - `motion-section/<id>` (e.g. `motion-section/hero`)
        - `motion-item`
        - `motion-overlay/<id>` (e.g. `motion-overlay/nav`)
- Auto layout and constraints
    - Use auto layout for stacks and grids; devs map this to flexbox.
    - Avoid “merged” layers for items that should animate separately (e.g. shadow vs card body).

Also create a “Component API” page showing the props for each component (title, copy, variant, icon, etc.).

---

## 3. Spec’ing page transitions

Think in terms of “page shell” (persistent) and “page content” (animated per route).

- Page shell
    - Elements that persist across navigation:
        - Top navigation
        - Background / global gradients
        - Footer
    - Mark them as `persistent` in page notes.
- Page content region
    - Wrap route‑specific content in a frame named `motion-page`.
    - In the `motion-page` frame description, specify:
        - `enter: from opacity 0, y 32px`
        - `exit: to opacity 0, y -24px`
        - `duration: 0.35s`
        - `easing: motion/decelerate`
- Directional transitions
    - For linear flows (wizards/onboarding):
        - Forward: slide from right.
        - Back: slide from left.
    - For marketing routes, default to fade+lift instead of big slides.

For each route artboard, create a small annotation block, e.g.:

```text
Route: /pricing
Page transition: PageTransition.default
Shell: navbar, background, footer (persistent)
