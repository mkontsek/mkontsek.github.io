# Rem Over Px Skill

Use `rem` units instead of `px` for scalable, accessible sizing in UI styles.

## Scope

Apply when editing CSS/SCSS/style blocks, inline style objects, or utility classes that represent typography or layout sizing.

## Rules

1. Prefer `rem` over `px` for font sizes, spacing, dimensions, radii, and layout gaps.
2. Convert using a 16px root baseline: `rem = px / 16`.
3. Keep up to 4 decimal places and trim trailing zeros (`24px` -> `1.5rem`, `10px` -> `0.625rem`).
4. Keep `px` when device-pixel precision is intentional (for example: `1px` borders/hairlines, raster/canvas/image pixel mapping).
5. Keep `0` as `0` (not `0rem`).
6. In mixed expressions (`calc()`), convert only applicable `px` literals.

## Examples

| Use case     | Avoid      | Prefer       |
| ------------ | ---------- | ------------ |
| Font size    | `18px`     | `1.125rem`   |
| Spacing      | `32px`     | `2rem`       |
| Border       | `1px`      | `1px`        |
| Radius       | `12px`     | `0.75rem`    |
| Layout width | `960px`    | `60rem`      |
