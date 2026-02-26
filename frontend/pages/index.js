import { useState } from 'react';
import ReactMarkdown from 'react-markdown'

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [brief, setBrief] = useState(null)
  const [article, setArticle] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setBrief(null)
    setArticle(null)

    try {
      const res = await fetch('http://localhost:8000/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setBrief(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateArticle() {
    setGenerating(true)
    setError(null)
    setArticle(null)

    try {
      const res = await fetch('http://localhost:8000/api/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, brief }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setArticle(data.article)
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-3xl space-y-4">

          {/* Title */}
          <div className="mb-4">
            <h1 className="text-xl font-mono font-semibold text-gray-900 tracking-tighter">Content Brief Generator</h1>
            <p className="text-xs font-mono text-gray-500 mt-0.5 tracking-tight">Enter keywords to generate SEO strategy in seconds</p>
          </div>

          {/* Input */}
          {/* <div className="bg-white rounded border border-gray-200 p-4 shadow-sm"> */}
            <form onSubmit={handleSubmit}>
              {/* <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase font-sans tracking-wide">Keywords</label> */}
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent font-mono"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., best running shoes for flat feet"
                  required
                />
                <button
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded text-xs font-medium disabled:opacity-50 transition-colors font-mono"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="h-3 w-3 text-white" />
                      Generating…
                    </span>
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
            </form>
          {/* </div> */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-xs font-mono">
            {error}
          </div>
          )}

          {/* Brief Output */}
          {brief && (
            <div className="bg-white rounded border border-gray-200 shadow-sm  relative">
              <CopyButton text={JSON.stringify(brief, null, 2)} />
              {/* Top meta row */}
              <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100">
                {brief.search_intent && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-mono px-2 py-1 rounded">
                    Intent: {brief.search_intent}
                  </span>
                )}
                {brief.word_count && (
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-mono px-2 py-1 rounded">
                    ~{brief.word_count} words
                  </span>
                )}
                {brief.tone && (
                  <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-mono px-2 py-1 rounded">
                    {brief.tone}
                  </span>
                )}
              </div>

              <div className="space-y-3 p-4 font-mono">
                {/* Title & Meta */}
                <Field label="Page Title">
                  <p className="text-gray-800 text-sm font-medium font-sans">{brief.title}</p>
                </Field>

                <Divider />

                <Field label="Meta Description">
                  <p className="text-gray-700 text-sm font-sans">{brief.meta_description}</p>
                </Field>

                <Divider />

                {/* Audience & Angle */}
                <Field label="Target Audience">
                  <p className="text-gray-700 text-sm font-sans">{brief.target_audience}</p>
                </Field>

                <Field label="Unique Angle">
                  <p className="text-gray-700 text-sm font-sans">{brief.unique_angle}</p>
                </Field>

                <Divider />

                {/* H2s */}
                <Field label="H2 Headings">
                  <ul className="space-y-1">
                    {Array.isArray(brief.h2_headings) && brief.h2_headings.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm font-sans">
                        <span className="text-blue-400 font-mono text-xs mt-0.5 flex-shrink-0">H2</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </Field>

                <Divider />

                {/* Content Gaps */}
                {Array.isArray(brief.content_gaps) && brief.content_gaps.length > 0 && (
                  <>
                    <Field label="Content Gaps">
                      <ul className="space-y-1">
                        {brief.content_gaps.map((gap, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700 text-sm font-sans">
                            <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </Field>
                    <Divider />
                  </>
                )}

                {/* Internal Linking */}
                {Array.isArray(brief.internal_linking_suggestions) && brief.internal_linking_suggestions.length > 0 && (
                  <>
                    <Field label="Internal Links">
                      <ul className="space-y-1">
                        {brief.internal_linking_suggestions.map((link, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700 text-sm font-sans">
                            <span className="text-gray-400 mt-0.5 flex-shrink-0">↗</span>
                            <span>{link}</span>
                          </li>
                        ))}
                      </ul>
                    </Field>
                    <Divider />
                  </>
                )}

                {/* CTA */}
                {brief.cta_suggestion && (
                  <Field label="CTA">
                    <p className="text-gray-700 text-sm italic font-sans">"{brief.cta_suggestion}"</p>
                  </Field>
                )}

                {/* Generate Article Button */}
                <div className="pt-2">
                  <button
                    onClick={handleGenerateArticle}
                    disabled={generating}
                    className="w-full font-mono bg-gray-900 hover:bg-gray-800 text-white py-2 rounded text-sm font-medium disabled:opacity-50 transition-colors"
                  >
                    {generating ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Spinner className="h-3 w-3 text-white" />
                        Generating article…
                      </span>
                    ) : (
                      'Generate Full Article'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Article Output */}
          {article && (
            <div className="bg-white rounded border border-gray-200 shadow-sm p-4 relative">
              <CopyButton text={article} />
              <h2 className="text-sm font-medium text-gray-900 mb-3 font-mono tracking-tight">Publish-ready SEO article:</h2>
              <div className="prose prose-sm max-w-none text-gray-700 [&_p]:text-sm [&_p]:leading-6 [&_p]:mb-3 
                [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 [&_h1]:mt-4 [&_h2]:text-lg 
                [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-md [&_h3]:font-medium [&_h3]:mt-4 
                [&_h3]:mb-3 [&_ul]:text-sm [&_ul]:pl-8 [&_ul]:mb-3 [&_li]:mb-2 [&_li]:text-sm [&_li]:leading-6">
                <ReactMarkdown>{article}</ReactMarkdown>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

function Header() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2  py-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-lg font-mono font-bold text-gray-900 tracking-tighter">⌨</div>
          <span className="text-sm font-mono font-bold text-gray-900 tracking-tight">microgen</span>
        </div>
        {/* <p className="text-xs text-gray-500">SEO Brief Generator</p> */}
      </div>
    </header>
  )
}

// Small reusable components
function Field({ label, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wider">{label}</h3>
      {children}
    </div>
  )
}

function Divider() {
  return <hr className="border-gray-100 my-2" />
}

function Spinner({ className = 'h-3 w-3 text-white' }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-1 right-1 p-2 bg-white rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}