# mikaeldev — Mikael Chan portfolio

A one-page portfolio for a full-stack product engineer who also operates the
business. Warm editorial "creative-developer" aesthetic: near-black + taupe +
burnt-orange + gold, Jost / Nunito Sans / JetBrains Mono, a live WebGL aurora
hero, branded preloader, Lenis + GSAP scroll choreography, and an "honest mode"
copy toggle.

Built as **vanilla HTML/CSS/JS bundled with [Vite](https://vite.dev)** — no
framework. Dependencies are installed locally (no runtime CDN), so it works
offline and ships a minified build.

## Quick start

```bash
npm install      # install deps
npm run dev      # local dev server with HMR → http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

Requires Node 18+ (developed on Node 22).

## Project structure

```
mikaeldev/
├─ index.html               # markup + inlined brand/social SVGs
├─ src/
│  ├─ portfolio.js          # entry: imports CSS + libs + aurora, runs motion
│  ├─ aurora-warm.js        # WebGL hero shader (CSS fallback)
│  └─ styles/portfolio.css  # full design system
├─ public/                  # copied verbatim into the build root
│  ├─ favicon.svg
│  ├─ img/                  # your screenshots, portrait, edu logos (see public/img/README.md)
│  └─ Mikael-Chan-Resume.pdf  # ← add this (see below)
├─ scripts/gen-stack-icons.mjs  # regenerates the Stack brand badges
├─ netlify.toml                 # Netlify build config (build/publish/redirects/headers)
└─ vite.config.js
```

## Make it yours

1. **Add screenshots & portrait** — drop files into `public/img/` (filenames in
   [`public/img/README.md`](public/img/README.md)). Until then, tasteful
   placeholders show — nothing looks broken.
2. **Add your résumé** — put the PDF at `public/Mikael-Chan-Resume.pdf` (the
   "Résumé (PDF)" link points there).
3. **Education logos** — `public/img/edu/` ships favicon-grade logos; swap in
   official crests for sharper marks (see `public/img/README.md`).
4. **Stack badges** — edit the list in `scripts/gen-stack-icons.mjs`, then
   `npm run gen:icons` and paste the output into the Stack section of
   `index.html`. Brand logos come from the `simple-icons` package (inlined, no
   CDN); skills without a usable mark get the accent-diamond glyph.
5. **Palette / type** — CSS custom properties at the top of
   `src/styles/portfolio.css` (`--primary`, `--gold`, `--bg`, …).

## Deploy (Netlify)

Build settings live in `netlify.toml` (`npm run build` → publish `dist`, Node 22).

**Continuous deploy (recommended — push = publish):** in the Netlify UI, *Add new
site → Import an existing project → GitHub → `mikaelchan95/mikaeldev`*. Netlify
reads `netlify.toml`, so build/publish are auto-detected. Every push to `main`
then builds and deploys automatically. (Or run `netlify init` once the repo is on
GitHub to wire the same thing from the CLI.)

**Manual deploy from the CLI:**

```bash
npm run build
npx netlify deploy --prod   # uploads dist/ to the linked site
```

- **Custom domain** (e.g. `mikael.dev`) — add it under *Site configuration →
  Domain management*; no code change needed (`base: './'` works at any root).
- Source is hosted on GitHub at `github.com/mikaelchan95/mikaeldev`.

## Social previews (optional)

For rich link cards, add `public/og-image.png` (~1200×630) and set absolute
`og:image` and `og:url` in `index.html` once your domain is fixed.

## Notes

- Respects `prefers-reduced-motion`: aurora, reveals, count-ups, typing and the
  marquee all degrade to a static, readable page.
- The prototype's drag-and-drop image component (a Claude Design tool feature)
  was replaced with plain `<img>` + placeholders, since it can't persist on a
  deployed site.
- Sensitive details (revenue, trading performance, named landmark client) are
  intentionally omitted — proof uses only safe metrics.
