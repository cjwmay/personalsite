# May — quiet portfolio version

A separate, buildless portfolio inspired by https://sutharjay.com/. Existing site and prototypes are preserved. Source and publish output live in `dist/`.

Preview: `python3 -m http.server 4186 --bind 127.0.0.1 --directory dist`.

`dist/index.html` reuses May’s project names, organizations, and GitHub destinations. Side-project covers are watercolor illustrations generated with the built-in image_gen tool, using the girl as a style reference. Optimized WebP files live in `dist/assets/*-watercolor.webp`; originals and the full prompt set are preserved in `artwork/`. Unavailable case studies are labeled.

`dist/assets/artist-pencil.png` previews the softly colored transparent PNG supplied in this chat, with its original colors preserved in both themes. It replaces the animated portrait in the page for this visual comparison; the original `dist/portrait.html` remains available. The introduction and Projects share the left column. The 190×252px image is displayed 18% larger inside the existing 224×300px reserved area, retaining the 560px page width and 24px outer gutters. It stays anchored while projects expand, remains sticky through the section, stacks below the content on small screens, and blends into both themes.

`dist/petals.js` releases varied petals from the bottom quarter of the hair at irregular 0.8–5.8 second intervals. They start with the hair’s breeze and gather at the screen’s bottom edge just outside the content’s right margin. Landing positions spread randomly across a 120px area near the right content margin, with varied heights up to 34px and room kept inside narrow viewports. The pile remains visible while scrolling and lasts until refresh, stopping at 120 petals. Each petal has a 70% chance of falling behind the project cards and a 30% chance of falling in front, retaining that depth after settling. Decorative layers never intercept clicks. Motion stops when hidden or reduced motion is enabled.

Petals gently repel the mouse within 26px, showing a smaller 22px 🤲🏻 hand within the page, layered behind both petal layers, with an 18px maximum nudge. They settle back when the cursor moves away. Touch input does not trigger this effect.

`dist/resume.html` contains May Chen’s resume, including summary, experience, education, skills, and certifications. Its page-specific styling lives in `dist/resume.css`; it shares the portfolio theme toggle and supports printing. The new portfolio URL remains marked TBD.

`dist/cursor-preview.html` compares three custom SVG cursor directions (dotted hand, pencil tip, dot ring) in both themes. These are preview options; the portfolio uses the 🤲🏻 emoji cursor near interactive petals.

`dist/cursor-lips.html` shows a static blowing-lips cursor concept, enlarged and at 32px, for review before interaction is implemented.

The homepage now uses `dist/artist-motion.js` to reuse Dotted Artist’s continuous hair warp, blink pulse durations, and 28.6-second eye cycle. The original movement field is registered to the current portrait and its eye anchors are adjusted to the new face. Direct RGBA sampling preserves the supplied PNG colors and transparency. The existing image remains the layout and petal anchor and a fallback when WebGL is unavailable. Motion respects reduced-motion preferences and pauses when hidden.

The homepage portrait now uses `dist/assets/artist-watercolor.png`, restyled with built-in image_gen against the watercolor card reference. It preserves the pose, landmarks, transparent background and existing animation registration. The earlier portrait remains in `dist/assets/artist-pencil.png`; the new original and generation prompt are saved in `artwork/artist-watercolor-original.png` and `artwork/girl-watercolor-prompt.txt`.

The current portrait uses `dist/assets/artist-watercolor-cooler.png`, with yellow and red warmth reduced by approximately 50% using built-in image_gen. Original and prompt are preserved in `artwork/`.

The portrait now uses `dist/assets/artist-watercolor-muted.png`, reducing blue intensity by approximately 50% after the warm-color adjustment. The hair shader scales displacement by 1.5, increasing sway amplitude by 50% while retaining timing and reduced-motion behavior.

The skirt hem responds to mouse proximity with a localized, softly eased fabric displacement and a small flutter, then returns to rest. The interaction is disabled with reduced motion and ignores touch. Petals now land at the viewport floor first, accounting for their rotated dimensions, and acquire extra landing height only from nearby settled petals.

The skirt response uses an inset fabric boundary and protected arm/leg areas: only cloth deforms, with most central fabric interactive and a quiet buffer near skin. Petal accumulation scatters across 170px and uses varied overlap rather than a fixed pile-height ceiling.

The bichon stays lying close beside the petal pile, sleeps with subtle breathing for 20–40 seconds, then wakes and looks around for 5–7 seconds before sleeping again. It does not walk or nudge petals. Transparent sleeping and awake watercolor assets live in `dist/assets/bichon-sleep.webp` and `dist/assets/bichon-awake.webp`; originals and built-in image_gen prompts are preserved in `artwork/`. The dog never intercepts clicks and remains asleep with reduced motion.

The page reserves 128px plus the device safe-area inset below the footer. The bichon rests 8px from the bottom-right, facing left toward the petal pile, which reserves 80px for the dog. Waking and sleeping blend over 1.4 seconds; mouse hover gently wakes it and it settles after the cursor leaves. Reduced motion keeps it asleep.

The hair also responds to mouse proximity with the same gentle displacement and easing as the skirt; the existing hair field excludes face and body. Both hover responses stop with reduced motion. The bottom gap is now 96px plus the safe-area inset, retaining clearance above the bichon.

The outer-left skirt fold has a narrower inset so its fabric edge is interactive without changing limb protection. The bichon now renders one pose per frame on a canvas, aligning the head during a 1.6-second lift instead of overlaying two translucent illustrations. A single-image fallback is retained when WebGL is unavailable.

The bichon and petal pile now align with the right edge of the centered 560px page instead of the viewport edge. On narrow screens they retain the page’s 24px gutter; the pile remains beside the dog.

The companion group is offset outward by 40% of the content width (224px on desktop), still anchored to the page center and clamped to the 24px viewport gutter on smaller screens.

Dark mode uses a separate generated watercolor set for the girl and four cards. The theme toggle swaps their sources; the animated portrait updates its existing texture without resetting movement. Light-mode assets are preserved. Dark originals and prompts are in `artwork/*-dark-original.png` and `artwork/dark-artwork-prompts.json`, generated with built-in image_gen.
