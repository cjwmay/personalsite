# SEO Studio case study

Published path: `/seo-studio/`. The homepage's existing **Designing for Trust** disclosure contains a preview card and a **View case study** link.

## Preview

From the repository root:

```sh
python3 -m http.server 4187 --bind 127.0.0.1 --directory portfolio-watercolor/dist
```

Open `http://127.0.0.1:4187/seo-studio/`. Use a server rather than opening the HTML file directly, because the asset manifest loads over HTTP. There is no package manager, build step, lint command, or test suite in this static repository. Vercel already publishes `portfolio-watercolor/dist/`; no deployment configuration change is needed.

## Design integration

The page imports the existing `dist/style.css` and `dist/site.js`, including system typography, semantic light/dark variables, focus treatment, and the theme button. Page-specific rules are scoped in `seo-studio/case-study.css`. The full-width hero introduces the project with a large headline, short intro, company/role details and a final UI placeholder. Sections 02–07 use a numbered left rail, a pale visual board on the right, and a short caption beneath the board. The rail stacks above the board on mobile. `entry.css` only styles the homepage's new preview card. The independent `cjwmay/personalsite-ds` repository was inspected; it currently provides tokens and build/contrast tools, but this portfolio does not import it. This change does not migrate the site or alter that system.

## Replace visual assets

Add approved exports to `dist/seo-studio/images/`, then change the matching `src` in `dist/seo-studio/assets.json` from `null` to a relative URL, for example `"images/final-ui.webp"`. Write a useful `alt` description of the real screen. Keep exports legible at the displayed size; use WebP/PNG for UI and SVG/PNG for research diagrams. The page preserves the reserved image area, contains the entire image without cropping, and retains a labeled placeholder if loading fails. Content remains readable without JavaScript.

| Manifest key | Required asset | Suggested export |
| --- | --- | --- |
| `final-ui` | Final AI Fix review & apply, including issue, recommendation, comparison and Apply action | 2160×1215, 16:9 |
| `journey` | Actual Discover → Evaluate → Apply research journey, with evidence for friction | 2160×1215, 16:9 |
| `visible-changes` | Before/after diff with the changed content highlighted | 2160×1350, 16:10 |
| `recommendation` | Recommendation with contextual SEO rationale | 2160×1350, 16:10 |
| `user-control` | Review/edit/apply/revert screens or a readable flow composite | 2160×1350, 16:10 |
| `initial` | Initial design used in validation | 1200×900, 4:3 |
| `iteration` | Revised design connected to a documented finding | 1200×900, 4:3 |

All seven manifest entries are deliberately empty. The hero uses a schematic wireframe; the remaining image wells use an image icon. All are labeled placeholders, not product screenshots. Context's Before/Target diagram is authored in HTML and is a workflow framing, not a measured result. On mobile, reserved areas become taller to preserve placeholder readability; real screenshots are contained within them.

The homepage card is a separate lightweight placeholder in `dist/index.html`. When the final export is ready, replace `.seo-entry-cover`'s content with an image, include descriptive alt text and intrinsic width/height, and retain its aspect ratio in `entry.css`.

## Replace evidence and data

Edit the clearly marked copy in `dist/seo-studio/index.html`:

- Research: add approved interview notes, dates, participant roles and journey evidence. Until then, Evaluate/Apply friction remains the focus of inquiry, not a claimed finding.
- Challenge: the three questions are explicitly working hypotheses. Update their status only when supported by evidence.
- Validation, initial column: observed friction, task and participant context.
- Validation, iteration column: exact change and the finding that informed it.
- Validation, quote: verbatim wording, attribution/anonymous participant ID and study context. No invented quote is present.
- Impact, Review → Apply: baseline, measured conversion, denominator and date range.
- Impact, Repeat AI usage: cohort definition, repeat-use window, result and date range.
- Impact, Revert rate: denominator, recovery window, result and interpretation. A low revert rate alone does not prove trust or fix quality.

Metrics are labeled planned. No measured result, uplift, participant count, or research quote has been supplied or inferred.

## Checks

Before merging, preview the homepage disclosure, new route, all seven anchor links, keyboard focus, theme button, image replacement/failure, and narrow viewports. Confirm any added research evidence or screenshots are approved for a public portfolio. Existing production files outside the homepage entry are untouched.
