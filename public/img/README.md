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
| `autolora.png`   | autoloRA     | web    |

Phone frames crop to a tall portrait; web frames to a landscape card
(`object-fit: cover`). Roughly: phone ≈ 9:16, web ≈ 3:2. Any size works —
they're downscaled by the browser — but match the aspect ratio for the
cleanest crop.

## Portrait — `public/img/portrait.jpg`

Shown in the About section. Portrait orientation, ~3:4.

## Education logos — `public/img/edu/`

`buffalo.png`, `mdis.png`, `acs.png` are vendored (fetched as favicons, so a bit
low-res). Replace with official crests (transparent PNG/SVG, square) for a
sharper result. If a file is missing the row shows a clean text monogram
(UB / MDIS / ACS) instead.

## Social preview (optional) — `public/og-image.png`

For rich link previews when sharing the site. ~1200×630. After adding it,
set absolute `og:image` / `og:url` in `index.html` (see README).
