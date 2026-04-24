import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

const API = "https://microgen-i6v9.onrender.com";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [brief, setBrief] = useState(null);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBrief(null);
    setArticle(null);
    try {
      const res = await fetch(`${API}/api/brief`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      if (!res.ok) throw new Error(await res.text());
      setBrief(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateArticle() {
    setGenerating(true);
    setError(null);
    setArticle(null);
    try {
      const res = await fetch(`${API}/api/article`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, brief }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setArticle(data.article);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />

      <main style={{ flex: 1, padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Prompt input */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: 14,
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                boxShadow:
                  "0 1px 0 rgba(0,0,0,0.02), 0 16px 40px -24px rgba(0,0,0,0.12)",
              }}
            >
              <span
                className="mono"
                style={{ color: "var(--accent)", fontSize: 16 }}
              >
                ›
              </span>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="cozy modular lamps"
                required
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 17,
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                  fontFamily: "inherit",
                }}
              />
              <button
                disabled={loading}
                style={{
                  background: "var(--ink)",
                  color: "var(--bg)",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: 8,
                  fontSize: 13.5,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.01em",
                  opacity: loading ? 0.5 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <Spinner /> Generating…
                  </>
                ) : (
                  "Generate →"
                )}
              </button>
            </div>
            <div
              className="mono"
              style={{
                marginTop: 12,
                fontSize: 11.5,
                color: "var(--mute)",
                display: "flex",
                gap: 22,
              }}
            >
              <span>~6s to brief</span>
              <span>~40s to draft</span>
              <span>Gemini 2.5</span>
            </div>
          </form>

          {/* Empty state — when nothing yet */}
          {!brief && !loading && !error && (
            <div style={{ marginTop: 96 }}>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--mute)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 28,
                }}
              >
                SEO content engine
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 84,
                  lineHeight: 0.94,
                  letterSpacing: "-0.05em",
                  fontWeight: 400,
                  color: "var(--ink)",
                }}
              >
                One keyword.
                <br />
                <span className="serif" style={{ fontStyle: "italic" }}>
                  A finished article.
                </span>
              </h1>
              <p
                style={{
                  marginTop: 28,
                  fontSize: 18,
                  color: "var(--ink-2)",
                  lineHeight: 1.55,
                  letterSpacing: "-0.005em",
                  maxWidth: 560,
                }}
              >
                Microgen turns a single search phrase into a publish-ready brief
                — title, meta, H2s, gaps, internal links — and writes the full
                draft on top of it.
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div
              style={{
                marginTop: 64,
                textAlign: "center",
                color: "var(--mute)",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Drafting your brief
              </div>
              <p
                className="serif"
                style={{
                  margin: "14px auto 0",
                  fontSize: 24,
                  fontStyle: "italic",
                  color: "var(--ink)",
                  maxWidth: 480,
                  lineHeight: 1.35,
                }}
              >
                Searching intent signals, mapping out an outline, and finding
                the angles other articles missed.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: 24,
                padding: "14px 16px",
                background: "var(--paper)",
                border: "1px solid var(--accent)",
                borderRadius: 10,
                color: "var(--ink)",
                fontSize: 13.5,
                lineHeight: 1.5,
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--accent)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Something went wrong
              </div>
              {error}
            </div>
          )}

          {/* Brief */}
          {brief && (
            <Brief
              brief={brief}
              onGenerate={handleGenerateArticle}
              generating={generating}
            />
          )}

          {/* Article */}
          {article && <Article article={article} />}
        </div>
      </main>
    </div>
  );
}

// ───── Brief ─────
function Brief({ brief, onGenerate, generating }) {
  return (
    <div style={{ marginTop: 56, position: "relative" }}>
      <CopyButton text={JSON.stringify(brief, null, 2)} />

      <Label>Page title</Label>
      <h2
        style={{
          margin: "6px 0 0",
          fontSize: 44,
          fontWeight: 400,
          letterSpacing: "-0.035em",
          lineHeight: 1.06,
          color: "var(--ink)",
        }}
      >
        {brief.title}
      </h2>

      {brief.meta_description && (
        <p
          style={{
            margin: "20px 0 0",
            fontSize: 17,
            color: "var(--ink-2)",
            lineHeight: 1.55,
            letterSpacing: "-0.005em",
            maxWidth: 640,
          }}
        >
          {brief.meta_description}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
        {brief.search_intent && <Pill accent>{brief.search_intent}</Pill>}
        {brief.word_count && <Pill>~{brief.word_count} words</Pill>}
        {brief.tone && <Pill>{brief.tone}</Pill>}
      </div>

      {/* Outline */}
      {Array.isArray(brief.h2_headings) && brief.h2_headings.length > 0 && (
        <section style={{ marginTop: 56 }}>
          <SectionHead
            title="Outline"
            meta={`${brief.h2_headings.length} sections`}
          />
          <div style={{ borderTop: "1px solid var(--line)" }}>
            {brief.h2_headings.map((h, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr",
                  alignItems: "baseline",
                  gap: 16,
                  padding: "18px 0",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <span
                  className="mono"
                  style={{ color: "var(--mute-2)", fontSize: 12 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: 17,
                    color: "var(--ink)",
                    letterSpacing: "-0.015em",
                    lineHeight: 1.35,
                  }}
                >
                  {h}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Audience + Angle */}
      {(brief.target_audience || brief.unique_angle) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            marginTop: 56,
          }}
        >
          {brief.target_audience && (
            <div>
              <Label>Audience</Label>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 15,
                  color: "var(--ink-2)",
                  lineHeight: 1.55,
                  letterSpacing: "-0.005em",
                }}
              >
                {brief.target_audience}
              </p>
            </div>
          )}
          {brief.unique_angle && (
            <div>
              <Label>Unique angle</Label>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 15,
                  color: "var(--ink-2)",
                  lineHeight: 1.55,
                  letterSpacing: "-0.005em",
                }}
              >
                {brief.unique_angle}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Content gaps */}
      {Array.isArray(brief.content_gaps) && brief.content_gaps.length > 0 && (
        <section style={{ marginTop: 56 }}>
          <SectionHead title="Content gaps" />
          <ul style={{ margin: "20px 0 0", padding: 0, listStyle: "none" }}>
            {brief.content_gaps.map((g, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "10px 0",
                  fontSize: 15,
                  color: "var(--ink-2)",
                  lineHeight: 1.55,
                  letterSpacing: "-0.005em",
                }}
              >
                <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Internal links */}
      {Array.isArray(brief.internal_linking_suggestions) &&
        brief.internal_linking_suggestions.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <SectionHead title="Internal links" />
            <ul
              className="mono"
              style={{ margin: "20px 0 0", padding: 0, listStyle: "none" }}
            >
              {brief.internal_linking_suggestions.map((l, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "6px 0",
                    fontSize: 13,
                    color: "var(--ink-2)",
                  }}
                >
                  <span style={{ color: "var(--mute-2)" }}>↗</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

      {/* CTA */}
      {brief.cta_suggestion && (
        <section style={{ marginTop: 56 }}>
          <Label>Suggested CTA</Label>
          <p
            className="serif"
            style={{
              margin: "12px 0 0",
              fontSize: 26,
              fontStyle: "italic",
              lineHeight: 1.3,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
              maxWidth: 640,
            }}
          >
            "{brief.cta_suggestion}"
          </p>
        </section>
      )}

      {/* Generate article */}
      <div
        style={{
          marginTop: 56,
          paddingTop: 32,
          borderTop: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "var(--ink)",
              letterSpacing: "-0.015em",
            }}
          >
            Brief looks good. Generate the article?
          </div>
          <div
            className="mono"
            style={{ fontSize: 12, color: "var(--mute)", marginTop: 4 }}
          >
            ~40s · powered by Gemini 2.5
          </div>
        </div>
        <button
          onClick={onGenerate}
          disabled={generating}
          style={{
            background: "var(--ink)",
            color: "var(--bg)",
            border: "none",
            padding: "12px 22px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            opacity: generating ? 0.5 : 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {generating ? (
            <>
              <Spinner /> Generating article…
            </>
          ) : (
            "Generate full article →"
          )}
        </button>
      </div>
    </div>
  );
}

// ───── Article ─────
function Article({ article }) {
  return (
    <section
      style={{
        marginTop: 80,
        paddingTop: 32,
        borderTop: "1px solid var(--line)",
        position: "relative",
      }}
    >
      <CopyButton text={article} />
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: "var(--mute)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Draft · ready to publish
      </div>
      <div className="article-prose" style={{ marginTop: 16 }}>
        <ReactMarkdown>{article}</ReactMarkdown>
      </div>
    </section>
  );
}

// ───── Atoms ─────
function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 32px",
      }}
    >
      <Wordmark />
      <nav
        style={{
          display: "flex",
          gap: 28,
          fontSize: 14,
          color: "var(--ink-2)",
          whiteSpace: "nowrap",
        }}
      >
        <Link href="/examples">Examples</Link>
        <Link href="/pricing">Pricing</Link>
      </nav>
    </header>
  );
}

function Wordmark() {
  return (
    <Link
      href="/"
      style={{ display: "inline-flex", alignItems: "center", gap: 9 }}
    >
      <Logo />
      <span
        style={{
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: "-0.025em",
          color: "var(--ink)",
        }}
      >
        microgen
      </span>
    </Link>
  );
}

function Logo({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="15"
        rx="2.5"
        stroke="var(--ink)"
        strokeWidth="1.4"
      />
      <rect x="5" y="7" width="3" height="2" rx="0.5" fill="var(--ink)" />
      <rect x="9" y="7" width="3" height="2" rx="0.5" fill="var(--ink)" />
      <rect x="13" y="7" width="3" height="2" rx="0.5" fill="var(--ink)" />
      <rect x="17" y="7" width="2" height="2" rx="0.5" fill="var(--accent)" />
      <rect x="5" y="10.5" width="14" height="2" rx="0.5" fill="var(--ink)" />
      <rect x="5" y="14" width="9" height="2" rx="0.5" fill="var(--ink)" />
    </svg>
  );
}

function Pill({ children, accent }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 11px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: "nowrap",
        letterSpacing: "-0.005em",
        background: accent ? "var(--accent-soft)" : "var(--paper)",
        color: accent ? "var(--accent)" : "var(--ink-2)",
        border: accent ? "1px solid transparent" : "1px solid var(--line)",
      }}
    >
      {children}
    </span>
  );
}

function Label({ children }) {
  return (
    <div
      className="mono"
      style={{
        fontSize: 10,
        color: "var(--mute)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function SectionHead({ title, meta }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 500,
          color: "var(--ink)",
          letterSpacing: "-0.015em",
        }}
      >
        {title}
      </h3>
      {meta && (
        <span className="mono" style={{ fontSize: 11, color: "var(--mute)" }}>
          {meta}
        </span>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "spin 1s linear infinite" }}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />
      <path
        d="M4 12a8 8 0 0 1 8-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </svg>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="mono"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        padding: "6px 10px",
        fontSize: 11,
        background: "var(--paper)",
        color: "var(--mute)",
        border: "1px solid var(--line)",
        borderRadius: 6,
        cursor: "pointer",
        letterSpacing: "0.02em",
      }}
      aria-label="Copy"
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}
