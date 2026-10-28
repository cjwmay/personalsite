# SEO Studio case study

Published path: `/seo-studio/`. The homepage's existing **Designing for Trust** disclosure contains a preview card and a **View case study** link.

## Preview

From the repository root:

```sh
python3 -m http.server 4188 --bind 127.0.0.1 --directory portfolio-watercolor/dist
```

Open `http://127.0.0.1:4188/seo-studio/`. Use a server rather than opening the HTML file directly, because the asset manifest loads over HTTP. There is no package manager, build step, lint command, or test suite in this static repository. Vercel already publishes `portfolio-watercolor/dist/`; no deployment configuration change is needed.

## Design integration

The page imports the existing `dist/style.css` and `dist/site.js`, including system typography, semantic light/dark variables, focus treatment, and the theme button. Page-specific rules are scoped in `seo-studio/case-study.css`. The full-width hero introduces the project with a large headline, short intro, company/role details and a final UI placeholder. Sections 02–07 use a numbered left rail, a pale visual board on the right, and a short caption beneath the board. The rail stacks above the board on mobile. Specific headings and short bullet lists describe the product scope, research inputs, proposed interactions, validation plan, and planned measurement. Statements about research findings or measured outcomes remain explicitly pending. `entry.css` only styles the homepage's new preview card. The independent `cjwmay/personalsite-ds` repository was inspected; it currently provides tokens and build/contrast tools, but this portfolio does not import it. This change does not migrate the site or alter that system.

## Asset checklist

The page has **seven visual slots: five design screenshots, one screen recording, and one research diagram**. Each placeholder has a visible type label, matching ID, exact subject, and export specification. The homepage cover reuses D01; it does not need an eighth asset.

| ID | Page location | Asset type | What to supply | Format / size | Priority |
| --- | --- | --- | --- | --- | --- |
| D01 | Hero | Design screenshot | Final AI Fix review screen with SEO issue, Current / Proposed, rationale, and Apply action | PNG/WebP, 2160×1215, 16:9 | Core |
| R01 | Research | Research diagram | Journey map based on liferay.com, including Discover & Prioritize → Review & Apply → Verify & Continue; annotate tasks, decisions and evidence | SVG/PNG, 2160×1215, 16:9 | Core |
| D02 | Solution 01 | Design screenshot | Review detail: current issue, visible content differences, and AI rationale; one screen or annotated composite | PNG/WebP, 2160×1350, 16:10 | Core |
| V01 | Solution 02 | Screen recording | One example showing target/scope, editing, approval, and available recovery; include only states actually designed | MP4/WebM, 20–40 seconds, 16:10; silent with on-screen labels | Core |
| D03 | Solution 03 | Design screenshot | Execution and validation states, including resolved/failed outcomes and available next actions; a composite is appropriate | PNG/WebP, 2160×1350, 16:10 | Core |
| D04 | Validation, initial column | Design screenshot | Earlier design for one specific SEO issue | PNG/WebP, 1200×900, 4:3 | When a documented iteration is available |
| D05 | Validation, iteration column | Design screenshot | Revised design for the same issue/task as D04, with the actual change annotated | PNG/WebP, 1200×900, 4:3 | When a documented iteration is available |

### Already built in the page

- The Context Before/Target workflow diagram is authored in HTML. No upload is required.
- The Execution Success / Issue Resolution comparison is also authored in HTML. No upload is required.
- Existing captions, stage labels and metric hierarchy are page content, not missing image assets.

### Optional supporting exports

These are optional additions, not extra required slots: a persona summary, a PM/SEO Expert workshop synthesis, and a Gemini/Claude comparison sheet. Add them only if they contribute evidence beyond the current journey and bullets.

### Fill the asset manifest

Add approved files inside `dist/seo-studio/images/` or `dist/seo-studio/media/`, then set the matching `src` in `assets.json`. Match the visible ID to the manifest entry:

| ID | Manifest key | Default media type |
| --- | --- | --- |
| D01 | `final-ui` | `image` |
| R01 | `journey` | `image` |
| D02 | `review-proposal` | `image` |
| V01 | `user-control` | `video` |
| D03 | `verify-outcome` | `image` |
| D04 | `initial` | `image` |
| D05 | `iteration` | `image` |

For an image, set `src` to a relative path such as `images/final-ui.webp` and write a useful `alt`. V01 accepts MP4/WebM and an optional `poster` image. Its player has controls, plays inline, and does not autoplay. If a recording is not available, V01 can use an annotated sequence image: change its `type` to `image`, update its visible type label/category to "Design screenshot", and revise its alt text. Keep the ID so the preparation checklist remains traceable. If using spoken narration, provide equivalent visible text/captions; the recommended clip is silent with on-screen labels.

The media stage reserves space, contains the full asset without cropping, and retains its labeled placeholder on a loading error. The type and ID remain visible after replacement. All seven sources are currently null. The schematic hero and empty image wells are placeholder instructions, not product screenshots.

The homepage card is a lightweight placeholder in `dist/index.html`. Once D01 is ready, reuse that export in `.seo-entry-cover`, with descriptive alt text and intrinsic width/height. Retain its existing aspect ratio.

## Replace evidence and data

These are text/data inputs rather than screenshot requests. The page labels them RESEARCH EVIDENCE NEEDED, QUOTE NEEDED, or DATA NEEDED. Edit the marked copy in `dist/seo-studio/index.html`:

- Research: the V3 narrative states that interviews and persona/journey mapping were completed. Add the approved artifacts, interview dates, and participant roles. Missing exports do not mean the research itself was not done.
- Challenge: Lack of Transparency, Limited Control, and Unclear Outcome are hypotheses developed through a PM/SEO Expert workshop and reference research of Gemini/Claude. Add supporting workshop and comparison artifacts; do not present these as established participant findings.
- Validation, initial column: observed friction, task and participant context.
- Validation, iteration column: exact change and the finding that informed it.
- Validation, quote: verbatim wording, attribution/anonymous participant ID and study context. No invented quote is present.
- Impact, Verified SEO Fixes: baseline, verified issue count, period, and criteria for a resolved issue.
- Impact, AI-assisted Fix Completion Rate: count started AI Fix workflows that both reach Apply and pass relevant issue validation; add baseline, denominator, period, and result.
- Impact, process diagnostics: definitions and results for Fix Start, Review Completion, Apply, Workflow Abandonment, Time to Resolution, and Fix Validation Pass Rate.
- Impact, Repeat AI Fix Usage: cohort definition, repeat-use window, result and date range.
- Impact, Revert rate: denominator, recovery window, result and interpretation. A low revert rate alone does not prove trust or fix quality.

Metrics are labeled planned. No measured result, uplift, participant count, or research quote has been supplied or inferred.

## Narrative alignment

The page follows the supplied SEO Studio interview script V3. Its success criterion is a verified resolution, not an Apply click. The three solution strategies are understanding the proposal (issue, Current / Proposed, rationale), control before approval, and verification after execution. Execution Success and Issue Resolution remain distinct. All effects on completion, quality, continued use, and business value are planned until supported by actual results. The page keeps seven sections and compresses the interview story rather than reproducing the full script.

`visible-changes` and `recommendation` were renamed to `review-proposal` and `verify-outcome` while all sources were still null. The first new slot combines comparison and rationale; the second restores the outcome-validation strategy.

## Checks

Before merging, preview the homepage disclosure, new route, all seven anchor links, keyboard focus, theme button, image replacement/failure, and narrow viewports. Confirm any added research evidence or screenshots are approved for a public portfolio. Existing production files outside the homepage entry are untouched.
