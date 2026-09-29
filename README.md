# groovelogic.io

The Groove Logic website: plain HTML, CSS and JavaScript with no build step. Push to deploy.

## Layout

| Path | What's there |
|---|---|
| `*.html` | One file per page: home, four app pages, legal pages and `404.html` |
| `css/styles.css` | The whole design system. Tokens (colours, type, spacing, motion) live in `:root` at the top |
| `js/script.js` | Header, mobile menu, scroll reveal, tile tilt, screenshot carousel and lightbox, legal-page contents |
| `js/forms.js` | Sends the contact and feedback forms to Formspree without leaving the page |
| `partials/` | The shared header and footer |
| `fonts/` | Self-hosted Inter, Unbounded and JetBrains Mono (SIL Open Font License) |
| `img/` | Original PNGs plus the optimized `.webp` files the pages actually use |
| `docs/visual-redesign-plan.md` | The design direction and the phase plan |

## Changing the header or footer

Edit `partials/header.html` or `partials/footer.html`, then run:

```sh
python3 scripts/sync-partials.py
```

This copies them into every page between the `<!-- partial:… -->` markers. Commit the updated pages.

## Adding an app

1. Copy an existing app page (e.g. `wakemate.html`) and change the text, images, App Store link and `data-app` on the feedback form.
2. Set its accent colour: add `--accent-<app>` to `:root` in `css/styles.css` and use it in the page's `<body style="--accent: …">`.
3. Add a tile to the `#apps` grid in `index.html`, and links in `partials/footer.html`, then run the sync script.

## Previewing locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.
