# May — quiet portfolio version

A separate, buildless portfolio inspired by https://sutharjay.com/. Existing site and prototypes are preserved. Source and publish output live in `dist/`.

Preview: `python3 -m http.server 4186 --bind 127.0.0.1 --directory dist`.

`dist/index.html` reuses May’s project names, organizations, and GitHub destinations. Side-project covers are original SVG studies. Unavailable case studies and resume content are labeled.

`dist/assets/artist-pencil.png` previews the softly colored transparent PNG supplied in this chat, with its original colors preserved in both themes. It replaces the animated portrait in the page for this visual comparison; the original `dist/portrait.html` remains available. The introduction and Projects share the left column. The 190×252px image is displayed 18% larger inside the existing 224×300px reserved area, retaining the 560px page width and 24px outer gutters. It stays anchored while projects expand, remains sticky through the section, stacks below the content on small screens, and blends into both themes.

`dist/petals.js` releases varied petals from the bottom quarter of the hair at irregular 0.8–5.8 second intervals. They start with the hair’s breeze and gather at the screen’s bottom edge just outside the content’s right margin. Landing positions spread randomly across a 120px area near the right content margin, with varied heights up to 34px and room kept inside narrow viewports. The pile remains visible while scrolling and lasts until refresh, stopping at 120 petals. Each petal has a 70% chance of falling behind the project cards and a 30% chance of falling in front, retaining that depth after settling. Decorative layers never intercept clicks. Motion stops when hidden or reduced motion is enabled.

Petals gently repel the mouse within 26px, showing a smaller 22px 🤲🏻 hand within the page, layered behind both petal layers, with an 18px maximum nudge. They settle back when the cursor moves away. Touch input does not trigger this effect.

Replace `dist/resume.html` or update its link when the real resume is available.

`dist/cursor-preview.html` compares three custom SVG cursor directions (dotted hand, pencil tip, dot ring) in both themes. These are preview options; the portfolio uses the 🤲🏻 emoji cursor near interactive petals.

`dist/cursor-lips.html` shows a static blowing-lips cursor concept, enlarged and at 32px, for review before interaction is implemented.
