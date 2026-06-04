/* ============================================================
   gen-autolora-chart.mjs
   Emits the SVG for the autoloRA "ratchet" chart: best-so-far
   composite score climbing over experiments, with kept (new best)
   and reverted (worse → git revert) experiment dots. Run:
   `node scripts/gen-autolora-chart.mjs` and paste into index.html.

   Data is illustrative of a real run (baseline 0.781 → best 0.892);
   the ratchet guarantees best-so-far is monotonic.
   ============================================================ */
const exp = [
  0.781, 0.793, 0.786, 0.806, 0.799, 0.814, 0.820, 0.811, 0.833,
  0.825, 0.849, 0.841, 0.860, 0.853, 0.872, 0.866, 0.885, 0.892,
];
const n = exp.length;
const W = 480, H = 176, padX = 12, padTop = 14, padBot = 16;
const lo = 0.762, hi = 0.902;
const X = (i) => padX + (i * (W - 2 * padX)) / (n - 1);
const Y = (s) => padTop + (1 - (s - lo) / (hi - lo)) * (H - padTop - padBot);

let best = -1;
const bestArr = [], keep = [];
exp.forEach((s, i) => { const k = s > best; keep[i] = k; if (k) best = s; bestArr.push(best); });

// stepped best-so-far line
let d = `M${X(0).toFixed(1)},${Y(bestArr[0]).toFixed(1)}`;
for (let i = 1; i < n; i++) {
  d += `L${X(i).toFixed(1)},${Y(bestArr[i - 1]).toFixed(1)}L${X(i).toFixed(1)},${Y(bestArr[i]).toFixed(1)}`;
}
const area = `${d}L${X(n - 1).toFixed(1)},${(H - padBot).toFixed(1)}L${X(0).toFixed(1)},${(H - padBot).toFixed(1)}Z`;

const dots = exp.map((s, i) =>
  `<circle class="rt-dot ${keep[i] ? 'k' : 'r'}" cx="${X(i).toFixed(1)}" cy="${Y(s).toFixed(1)}" r="${keep[i] ? 3 : 2.3}" style="--d:${(0.9 + i * 0.05).toFixed(2)}s"/>`
).join('');

// baseline + best gridlines
const yBase = Y(exp[0]).toFixed(1), yBest = Y(best).toFixed(1);

const svg =
`<svg class="rt-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
  <defs><linearGradient id="rtfill" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="var(--secondary)" stop-opacity=".22"/>
    <stop offset="1" stop-color="var(--secondary)" stop-opacity="0"/>
  </linearGradient></defs>
  <line class="rt-grid" x1="${padX}" y1="${yBase}" x2="${W - padX}" y2="${yBase}"/>
  <line class="rt-grid best" x1="${padX}" y1="${yBest}" x2="${W - padX}" y2="${yBest}"/>
  <path class="rt-area" d="${area}"/>
  <path class="rt-best" pathLength="1" d="${d}"/>
  ${dots}
</svg>`;
process.stdout.write(svg + '\n');
