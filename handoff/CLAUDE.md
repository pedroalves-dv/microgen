# microgen — design handoff for Claude Code

This is a redesign spec for the existing microgen Next.js app. Goal: replace the current `index.js` UI with a cleaner, editorial, more premium look while keeping all backend behavior identical.

## What does NOT change

- API endpoints (`/api/brief`, `/api/article` on `https://microgen-i6v9.onrender.com`)
- Request/response shapes (`keyword`, `brief`, `article`)
- Functionality (input → brief → article flow, copy buttons, errors, loading states)
- Project structure, deploy target, dependencies (other than what's noted below)

## What DOES change

- Visual identity: editorial, generous whitespace, big display type, paper/ink palette with one burnt-amber accent.
- Layout: simple top header → sidebar of recents → wide editorial main column. No multiple-column right rails on the brief view.
- Typography: Geist (sans) + Geist Mono + Instrument Serif (italic accent only).
- Microcopy: tighter, more confident, less "tool-y".

## Install once

```bash
npm install
# Fonts are loaded via next/font/google — no extra deps needed.
```

If you don't already use Tailwind, the new `index.js` does NOT require it — it uses inline styles + a small `globals.css`. You can keep Tailwind around for other parts of the app.

## Files to add / replace

1. **Replace** `pages/index.js` with the version in `index.js` from this handoff.
2. **Add** `styles/globals.css` (overwrite if it exists) — design tokens.
3. **Edit** `pages/_app.js` to import fonts (snippet below).

### `pages/_app.js`

```jsx
import '../styles/globals.css'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument-serif' })

export default function App({ Component, pageProps }) {
  return (
    <main className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <Component {...pageProps} />
    </main>
  )
}
```

## Design tokens (canonical)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f6f5f1` | page background (warm paper) |
| `--paper` | `#fbfaf6` | cards, raised surfaces |
| `--ink` | `#1a1a18` | primary text, primary buttons |
| `--ink-2` | `#2c2c28` | body copy |
| `--mute` | `#6b6b65` | secondary labels |
| `--mute-2` | `#a3a39c` | tertiary metadata |
| `--line` | `#e6e4dc` | borders, dividers |
| `--line-2` | `#ecebe4` | subtle inner dividers |
| `--accent` | `oklch(0.62 0.18 25)` | burnt amber (caret, pills, score bar) |
| `--accent-soft` | `oklch(0.94 0.04 60)` | accent pill background |

**Type scale:** body 17px / line-height 1.55 · h1 (article) 56px · h1 (landing) 112px · h2 30px · meta/labels 10–12px Geist Mono uppercase tracking-wide · italic accents in Instrument Serif.

## Layout rules

- Page max-width: 760px for editorial content columns.
- Outer page padding: 32px on app screens, 64px on landing.
- Header height: ~64px. Single row. No subtitle bar above it.
- Always one accent color in view, never two.
- Use `<span class="serif">` italic for ONE phrase per heading max — don't overdo it.

## Component spec — what changes vs. current `index.js`

| Old | New |
|---|---|
| Sticky top bar with ⌨ + "microgen" + sticky shadow | Simple non-sticky header, refined keyboard logo (SVG below), wordmark in Geist 500 |
| `bg-gray-50` page bg | `var(--bg)` warm paper |
| `font-mono` everywhere | Geist sans for content, mono for labels/metadata only |
| Pills in red/blue/green/purple Tailwind | Single accent (amber) + neutral pills |
| 3-color H2/gap/link bullets | Mono `01` `02` numbering, single neutral color |
| Loading spinner | Same spinner, same logic — keep |
| `CopyButton` component | Keep, restyle to match (border, rounded-8, mono label "Copy") |

The new `index.js` ships with all components inlined — `Header`, `Wordmark`, `Logo`, `Pill`, `Field`, `Outline`, `CopyButton`, `Spinner`. Tree it however you like later.

## Suggested next steps after drop-in

1. Add a `pages/[brief].js` route to persist past briefs in localStorage and render the sidebar of recents (currently the new index has placeholder space for it but loads with empty list).
2. Stream the article response token-by-token if your FastAPI endpoint supports it — the design has room for a `streaming` indicator.
3. Add an article viewer route once you have brief persistence — current flow shows article inline, which is fine for v1.

## Open questions for you

- Do you want me to spec the empty/loading/error visual states explicitly? They're hinted at but I left them minimal in the handoff.
- Want a `/pricing` and marketing-page handoff next, or stay app-only?
