# Groove Logic: Visual Redesign Plan

Goal: turn groovelogic.io from a clean dark template into a site that *feels* like the brand: the neon cassette, the pink-to-cyan wordmark, music and late-night studio energy. Keep it fast, accessible and easy to maintain as plain HTML/CSS/JS.

Each phase below can ship on its own. The **risk** score (0–10) is how likely the phase is to break existing behaviour, with the files most likely to be affected.

---

## Creative direction: "Neon Analog"

The logo already sets the direction: a synthwave cassette with circuit traces and a glowing horizon grid. Commit to it, with restraint:

- **Deep, not flat, black.** Swap pure `#000` for a layered night palette (`#07040d` base, `#0f0a1a` surfaces, `#1a1030` raised) so glows have something to glow against.
- **Neon as light, not paint.** Pink `#FF00C1` and cyan `#00F2FF` appear as gradients, glows, borders and highlights. Never as big flat fills behind body text.
- **One signature motif:** the perspective grid and horizon glow from `groove_logic_1.png`, used in the hero and echoed faintly in section dividers.
- **Per-app accent colours**, taken from each icon: Dungeon Soundboard green `#3ddc3d`, Jsonify teal `#2de3c4`, DJ BPM Assistant violet `#8b5cf6`, WakeMate blue `#1e7bff`. Each app card and app page takes on its own accent.
- **Music as motion.** Subtle equaliser bars, waveform lines and a slow "breathing" glow. Everything respects `prefers-reduced-motion`.

### Typography
| Role | Font | Why |
|---|---|---|
| Display / headings | **Unbounded** (or Syne) | Wide, geometric and rounded, like the logo's line-drawn letters |
| Body / UI | **Inter** | Much more readable than Poppins at small sizes |
| Accents (BPM numbers, tags, labels) | **JetBrains Mono** or **Space Mono** | Techy, fits the "logic" half of the brand |

Self-host the fonts as `woff2` with `font-display: swap`, and remove the render-blocking `@import` from `styles.css`.

---

## Phase 0: Structure the site before restyling it (optional but recommended)
The header, footer and `<head>` are copy-pasted across 9 HTML files, so every visual change has to be made 9 times. Move to a tiny static site generator (**Eleventy** is the closest to what's here: the existing HTML becomes templates almost as-is) with one `base` layout, one `app-page` layout and one `legal-page` layout. App details (name, tagline, accent, screenshots, features, store URL) move into a data file, so adding app #5 means one JSON entry.

- **Risk: 6/10.** Every page is regenerated, so hosting config (GitHub Pages, custom domain, `app-ads.txt` at the root) has to be re-checked. Affects: all `*.html`, deploy settings, `app-ads.txt`.
- Skip this if you'd rather stay pure HTML; the phases below still apply.

## Phase 1: Design tokens and base styles
- Replace the palette in `:root` with a full token set: colours (base/surface/raised, text 100/70/50, the two neons, the four app accents), a spacing scale, radii, a type scale using `clamp()`, and glow shadows (`--glow-pink`, `--glow-cyan`).
- New fonts (above). Headings get tighter letter-spacing; body goes to 17–18px with a max line length of about 68ch.
- Buttons become one component in three variants: **primary** (gradient fill, dark text for contrast, glow on hover), **secondary** (gradient border, transparent fill) and **ghost**.
- Check colour contrast: muted text `#a0a0c0` on the new surfaces must stay ≥ 4.5:1.
- **Risk: 4/10.** Global CSS changes affect every page, but the change is visual only. Affects: `css/styles.css`, all pages.

## Phase 2: Header and navigation
- A glassy sticky header: transparent over the hero, then `backdrop-filter: blur()` with a hairline gradient border once you scroll.
- The current section is highlighted in the nav (IntersectionObserver), with an animated gradient underline.
- Real mobile menu: a hamburger opens a full-screen overlay with large links. This replaces today's wrapped two-row nav.
- **Risk: 4/10.** New JS for the scroll state and menu; a bug could hide the nav on mobile. Affects: `js/script.js`, header markup on every page.

## Phase 3: Hero, the "wow" moment
- Full-viewport synthwave scene built in CSS/SVG (no video): a horizon glow, a perspective grid floor slowly scrolling towards the viewer, and faint stars/noise.
- The cassette logo sits above the horizon with a soft neon "breathing" glow. The circuit-trace "drips" can be animated as an SVG line-draw on load.
- Headline in the display font with gradient text; the subline says *what* you make ("Indie iOS & web apps for music lovers, DJs, gamers and families").
- Two CTAs: **See the apps** (primary) and **Get in touch** (secondary).
- A row of equaliser bars under the CTAs that animate gently and react on hover.
- **Risk: 3/10.** Self-contained in the hero; the main risk is performance on low-end phones. Keep it CSS transforms only and pause it when off-screen. Affects: `index.html`, `css/styles.css`.

## Phase 4: Apps showcase
- Replace the uniform cards with **cassette/album-style tiles**: the icon floats above a surface tinted with the app's accent colour, glows in that colour on hover, and tilts slightly in 3D (disabled for reduced motion).
- Status badge on each tile: **Live on iOS**, **Web app** or **Coming soon**. This replaces the ambiguous "Android (Soon)" tag.
- The first tile can be a larger "featured" tile (latest release) spanning two columns on desktop.
- Official "Download on the App Store" badges where an app is live.
- **Risk: 3/10.** Only the apps section and its CSS change. Affects: `index.html` (#apps), `css/styles.css`.

## Phase 5: About / studio story
- Keep the philosophy text, but pair it with the neon cassette art (now live) or a studio photo with a duotone pink/cyan treatment.
- Add a **process strip**: Concept → Design → Build → Launch, connected by a waveform line that draws in as you scroll.
- Add a small **stats row** in the mono font (e.g. "4 apps shipped · 100% indie · iOS + Web").
- **Risk: 2/10.** Content and layout only. Affects: `index.html` (#about).

## Phase 6: App detail pages
- **App hero:** the icon and title on a background gradient in the app's accent colour, with one screenshot inside a CSS iPhone frame, angled, like the WakeMate/DJ BPM marketing shots.
- **Screenshot carousel:** a horizontal scroll-snap strip (swipeable on phones) with a lightbox on click. This replaces the static grid.
- **Features as a grid** of icon cards instead of a checklist; the icons come from the app's own UI.
- **Sticky mobile CTA:** a slim bar at the bottom with the App Store / Open Web App button.
- Legal pages get a sticky table of contents on desktop and styled tables (the DJ BPM privacy policy has a table that is currently unstyled).
- **Risk: 5/10.** Touches all 4 app pages and 4 legal pages, plus new carousel/lightbox JS. Affects: `dungeon-soundboard.html`, `dj-bpm-assistant.html`, `wakemate.html`, `jsonify-playlist.html`, `*-privacy.html`, `*-terms.html`, `js/`.

## Phase 7: Contact, feedback and footer
- Contact becomes two columns: a short personal pitch and an email link on the left, the form on the right. Floating labels, a neon focus ring, and an animated success state (the message "plays" like a cassette icon). The form logic in `js/forms.js` stays the same.
- Footer grows into a real footer: wordmark, app links, legal links, email, and social links once you have real URLs.
- **Risk: 3/10.** The form markup changes, so re-test the Formspree submissions (both endpoints). Affects: `index.html`, app pages, `js/forms.js`, `css/styles.css`.

## Phase 8: Motion and page transitions
- Scroll-reveal (fade + rise, staggered) with IntersectionObserver, which is cheap and progressive.
- **Cross-document View Transitions** (`@view-transition { navigation: auto; }`): tapping an app card morphs its icon into the icon on the app page. This is pure CSS in Chromium/Safari and does nothing in other browsers.
- A single easing curve and duration scale for all motion; everything disabled under `prefers-reduced-motion`.
- **Risk: 2/10.** Progressive enhancement; failures degrade to today's behaviour. Affects: `css/styles.css`, `js/script.js`.

## Phase 9: Polish and quality bar
- Social preview image per app (1200×630, accent-coloured), plus a custom 404 page in the neon style.
- `<picture>` with `srcset` for screenshots (1× and 2×); keep every page under 1 MB on first load.
- Target: Lighthouse ≥ 95 for Performance, Accessibility, Best Practices and SEO on mobile, and no horizontal scroll at 320px.
- **Risk: 1/10.** Additive. Affects: `img/`, `<head>` of each page.

---

## Suggested order
1. Phase 1 (tokens and fonts) + Phase 2 (header): the whole site immediately feels new.
2. Phase 3 (hero) + Phase 4 (apps): the homepage "wow".
3. Phase 6 (app pages): where App Store visitors land.
4. Phases 5, 7, 8, 9: depth and polish.

Do Phase 0 first if you expect to add more apps or change the layout often.

## Open questions for Matt
- Real Twitter/X, LinkedIn and GitHub URLs, or should those stay out of the footer?
- Is there a photo of you for the About section, or should it stay brand art only?
- Is Android still planned for Dungeon Soundboard (it currently shows an "Android (Soon)" tag)?
