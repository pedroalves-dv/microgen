import Link from 'next/link'

const EXAMPLES = [
  {
    keyword: 'cozy modular lamps',
    title: 'The Best Modular Lamps for a Warm, Layered Home',
    meta: 'A buyer\'s guide to modular lamps that let you shape light room by room — from soft reading nooks to ambient living spaces.',
    intent: 'Commercial',
    words: 1800,
    tone: 'Warm, editorial',
    headings: [
      'Why modular lighting beats fixed fixtures',
      'The 6 modular lamps worth buying in 2025',
      'How to layer light in a small room',
      'Bulb temperature guide: 2700K vs 3000K',
      'Where to buy and what to budget',
    ],
    gaps: [
      'No guide compares clip-on vs floor-stand modular systems side by side',
      'Bulb compatibility across brands is almost never covered',
      'Rental-friendly installation is ignored in most reviews',
    ],
  },
  {
    keyword: 'home espresso setup beginner',
    title: 'Your First Home Espresso Setup: What to Buy and What to Skip',
    meta: 'Cut through the noise — a straight-talking guide to building a beginner espresso station without wasting money on gear you\'ll outgrow in a month.',
    intent: 'Informational',
    words: 2200,
    tone: 'Direct, confident',
    headings: [
      'Espresso vs drip: what actually changes at home',
      'The $300, $600 and $1200 setup tiers explained',
      'Grinder first: why the machine matters less than you think',
      'Dialing in your first shot, step by step',
      'Mistakes beginners make in the first 30 days',
      'Upgrading later: what to keep and what to sell',
    ],
    gaps: [
      'No article addresses the "grinder before machine" principle for beginners',
      'Water hardness and its effect on espresso taste is completely absent',
      'Budget guides skip the cost of consumables (pucks, filters, descaler)',
    ],
  },
  {
    keyword: 'standing desk mat benefits',
    title: 'Standing Desk Mats: Do They Actually Help? An Honest Look',
    meta: 'Anti-fatigue mats promise to make standing desks bearable — here\'s what the research says, which materials hold up, and which mats are worth the price.',
    intent: 'Informational',
    words: 1600,
    tone: 'Evidence-led, neutral',
    headings: [
      'What an anti-fatigue mat actually does to your body',
      'Foam vs gel vs cork: material breakdown',
      'Size and thickness guide by desk type',
      'Our top picks across three budgets',
      'What no mat can fix: posture and movement habits',
    ],
    gaps: [
      'No comparison between mats for hard floors vs carpet',
      'Durability data after 12+ months of use is missing from every review',
      'Chair-mat hybrids are never addressed',
    ],
  },
]

export default function Examples() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="page-main-lg">
        <div className="page-content">

          {/* Hero */}
          <div style={{ marginBottom: 72 }}>
            <div className="mono" style={{
              fontSize: 11, color: 'var(--mute)', letterSpacing: '0.1em',
              textTransform: 'uppercase', marginBottom: 20,
            }}>Example output</div>
            <h1 className="page-h1" style={{
              fontWeight: 400,
              letterSpacing: '-0.04em', color: 'var(--ink)',
            }}>
              What microgen<br/>
              <span className="serif" style={{ fontStyle: 'italic' }}>actually produces.</span>
            </h1>
            <p style={{
              marginTop: 24, fontSize: 17, color: 'var(--ink-2)',
              lineHeight: 1.55, letterSpacing: '-0.005em', maxWidth: 520,
            }}>
              Three real keywords run through the full pipeline. Every brief below
              was generated in under 10 seconds — no editing, no prompting.
            </p>
          </div>

          {/* Example cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
            {EXAMPLES.map((ex, idx) => (
              <ExampleCard key={idx} example={ex} index={idx} />
            ))}
          </div>

          {/* CTA */}
          <div style={{
            marginTop: 96, paddingTop: 48, borderTop: '1px solid var(--line)',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}>
            <h2 style={{
              margin: 0, fontSize: 32, fontWeight: 400,
              letterSpacing: '-0.03em', color: 'var(--ink)',
            }}>Try it on your own keyword</h2>
            <div>
              <Link href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--ink)', color: 'var(--bg)',
                padding: '12px 22px', borderRadius: 8,
                fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em',
              }}>
                Generate a brief →
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

function ExampleCard({ example, index }) {
  return (
    <article>
      {/* Keyword label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <span className="mono" style={{ color: 'var(--mute-2)', fontSize: 12 }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', background: 'var(--paper)',
          border: '1px solid var(--line)', borderRadius: 999,
        }}>
          <span className="mono" style={{ color: 'var(--accent)', fontSize: 14 }}>›</span>
          <span className="mono" style={{ fontSize: 13, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            {example.keyword}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 style={{
        margin: '0 0 12px', fontSize: 28, fontWeight: 400,
        letterSpacing: '-0.025em', lineHeight: 1.18, color: 'var(--ink)',
      }}>{example.title}</h2>

      {/* Meta */}
      <p style={{
        margin: '0 0 18px', fontSize: 15, color: 'var(--ink-2)',
        lineHeight: 1.55, letterSpacing: '-0.005em', maxWidth: 620,
      }}>{example.meta}</p>

      {/* Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        <Pill accent>{example.intent}</Pill>
        <Pill>~{example.words} words</Pill>
        <Pill>{example.tone}</Pill>
      </div>

      {/* Outline */}
      <div style={{ borderTop: '1px solid var(--line)' }}>
        {example.headings.map((h, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '40px 1fr',
            alignItems: 'baseline', gap: 16, padding: '14px 0',
            borderBottom: '1px solid var(--line)',
          }}>
            <span className="mono" style={{ color: 'var(--mute-2)', fontSize: 12 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.015em', lineHeight: 1.35 }}>{h}</span>
          </div>
        ))}
      </div>

      {/* Gaps */}
      <div style={{ marginTop: 28 }}>
        <div className="mono" style={{
          fontSize: 10, color: 'var(--mute)', letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: 14,
        }}>Content gaps found</div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {example.gaps.map((g, i) => (
            <li key={i} style={{
              display: 'flex', gap: 12, padding: '7px 0',
              fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5,
              letterSpacing: '-0.005em',
            }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function Pill({ children, accent }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '5px 11px',
      borderRadius: 999, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
      letterSpacing: '-0.005em',
      background: accent ? 'var(--accent-soft)' : 'var(--paper)',
      color: accent ? 'var(--accent)' : 'var(--ink-2)',
      border: accent ? '1px solid transparent' : '1px solid var(--line)',
    }}>{children}</span>
  )
}

function Header() {
  return (
    <header className="page-header" style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <Wordmark />
      <nav style={{ display: 'flex', gap: 28, fontSize: 14, color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>
        <Link href="/examples" style={{ color: 'var(--ink)', fontWeight: 500 }}>Examples</Link>
        <Link href="/pricing">Pricing</Link>
      </nav>
    </header>
  )
}

function Wordmark() {
  return (
    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <Logo />
      <span style={{ fontWeight: 500, fontSize: 15, letterSpacing: '-0.025em', color: 'var(--ink)' }}>
        microgen
      </span>
    </Link>
  )
}

function Logo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" stroke="var(--ink)" strokeWidth="1.4" />
      <rect x="5" y="7" width="3" height="2" rx="0.5" fill="var(--ink)" />
      <rect x="9" y="7" width="3" height="2" rx="0.5" fill="var(--ink)" />
      <rect x="13" y="7" width="3" height="2" rx="0.5" fill="var(--ink)" />
      <rect x="17" y="7" width="2" height="2" rx="0.5" fill="var(--accent)" />
      <rect x="5" y="10.5" width="14" height="2" rx="0.5" fill="var(--ink)" />
      <rect x="5" y="14" width="9" height="2" rx="0.5" fill="var(--ink)" />
    </svg>
  )
}
