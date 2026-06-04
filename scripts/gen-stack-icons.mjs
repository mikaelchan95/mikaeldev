/* ============================================================
   gen-stack-icons.mjs
   Emits the Stack-section badge markup with brand logos inlined
   as SVG (from the `simple-icons` package) instead of loading them
   from cdn.simpleicons.org. Run: `npm run gen:icons`.

   Brand colours below are the *tinted* values the design uses to
   read well on the Lugia ocean-dark theme — not always the brand's own hex.
   Skills with no (usable) brand mark fall back to the accent-diamond
   glyph, exactly as the design did for OpenAI et al.
   ============================================================ */
import * as si from 'simple-icons';

const DIAMOND =
  '<span class="gi"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l10 10-10 10L2 12z"></path></svg></span>';

// Map a simple-icons slug to its named export (si + PascalCase).
function icon(slug) {
  const key = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1);
  return si[key] || null;
}

function badge(label, slug, tint) {
  if (slug) {
    const ic = icon(slug);
    if (!ic) {
      console.error(`! simple-icons has no "${slug}" — falling back to glyph for "${label}"`);
      return `<span class="badge">${DIAMOND}${label}</span>`;
    }
    return `<span class="badge"><svg viewBox="0 0 24 24" fill="#${tint}" aria-hidden="true"><path d="${ic.path}"/></svg>${label}</span>`;
  }
  return `<span class="badge">${DIAMOND}${label}</span>`;
}

// [label, slug|null, tintHex] — null slug = accent-diamond glyph.
const GROUPS = {
  'Frontend & Mobile': [
    ['React 19', 'react', '61DAFB'],
    ['Next.js', 'nextdotjs', 'D6E6F5'],
    ['React Native / Expo', 'expo', 'D6E6F5'],
    ['Vite', 'vite', '9CACE6'],
    ['Tailwind', 'tailwindcss', '38BDF8'],
    ['Three.js / R3F / WebGL', 'threedotjs', 'D6E6F5'],
    ['Zustand', null],
  ],
  'Backend & Data': [
    ['Supabase', 'supabase', '3FCF8E'],
    ['PostgreSQL', 'postgresql', '7AA6E8'],
    ['Deno edge functions', 'deno', 'D6E6F5'],
    ['.NET 4.8', 'dotnet', '9CACE6'],
    ['REST · RLS', null],
    ['Stripe', 'stripe', '9CACE6'],
    ['Power Automate', null],
  ],
  'AI & Tooling': [
    ['Claude Code · agents', 'anthropic', 'E74F41'],
    ['OpenAI · Anthropic APIs', null],
    ['Local LLMs (DeepSeek)', null],
    ['PaddleOCR / vision', null],
    ['FLUX LoRA fine-tuning', null],
    ['agent orchestration', null],
  ],
  'Languages & Practice': [
    ['TypeScript · JavaScript', 'typescript', '3178C6'],
    ['Python · C# · SQL', 'python', 'D6E6F5'],
    ['SSH · Tailscale', 'tailscale', 'D6E6F5'],
    ['CI/CD · migrations', null],
    ['i18n (EN/ZH)', null],
    ['cross-border remote ops', null],
  ],
};

let out = '';
for (const [heading, items] of Object.entries(GROUPS)) {
  out += `<!-- ${heading} -->\n`;
  out += items.map((it) => '  ' + badge(...it)).join('\n') + '\n\n';
}
process.stdout.write(out);
