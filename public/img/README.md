# Images

Drop real files here and they replace the on-brand placeholders automatically
(each `<img>` falls back to a styled placeholder if its file is missing, so the
site never looks broken before you add them).

## Work screenshots — `public/img/work/`

| File             | Shown in     | Frame  |
| ---------------- | ------------ | ------ |
| `easi.png`       | EASI case    | phone  |
| `orb.png`        | ORB case     | web    |
| `chefvault.png`  | ChefVault    | phone  |

(autoloRA is a CLI tool — its case renders a live-typed terminal in
`index.html`, no image needed.)

Phone screenshots are wrapped in a CSS iPhone device (`.frame.phone`), so
drop in the **raw app screen** at phone aspect (≈9:19.5). Web frames crop to
a landscape card (`object-fit: cover`, ≈3:2). Any size works — they're scaled
by the browser — but match the aspect for the cleanest result.

## Portrait — `public/img/portrait.jpg`

Shown in the About section. Portrait orientation, ~3:4.

## Education logos — `public/img/edu/`

`buffalo.svg` (official UB logo, vector), `mdis.png`, `acs.png` are the real
institution logos. They sit on a light plate (`.edu-logo`) so the colored marks
read against the dark page. If a file is ever missing the row falls back to a
clean text monogram (UB / MDIS / ACS).

## Social preview (optional) — `public/og-image.png`

For rich link previews when sharing the site. ~1200×630. After adding it,
set absolute `og:image` / `og:url` in `index.html` (see README).
