import { Fragment } from 'react'
import articleText from '../content/neuroplasticity.md?raw'
import './Article.css'

const blocks = articleText.trim().split(/\r?\n\s*\r?\n/)
const titleLines = blocks.shift()!.split(/\r?\n/)
const title = titleLines[0].replace(/^# /, '')
const subtitle = titleLines[1].replace(/^### /, '')
const readingMinutes = Math.ceil(articleText.split(/\s+/).length / 220)
const sections = blocks.flatMap((block, index) => block.startsWith('## ') ? [{ title: block.slice(3), id: `section-${index}` }] : [])

// The supplied article uses paragraphs, headings, emphasis and strong emphasis.
// Render those as React nodes; raw HTML is never executed.
function InlineText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>
    return <Fragment key={index}>{part}</Fragment>
  })
}

export default function Article() {
  return <article className="article-page" aria-labelledby="article-title">
    <a className="article-back" href="/#topics"><span aria-hidden="true">&larr;</span> Back to homepage</a>
    <header className="article-heading">
      <p className="article-kicker">Explore topics <span aria-hidden="true">/</span> Neuroplasticity</p>
      <h1 id="article-title">{title}</h1>
      <p className="article-subtitle">{subtitle}</p>
      <p className="article-meta">Mentis Forge <span aria-hidden="true">&middot;</span> {readingMinutes} min read</p>
    </header>
    <div className="article-layout">
      <aside className="article-contents" aria-label="Article navigation">
        <details open>
          <summary>In this article</summary>
          <nav aria-label="Article sections">{sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav>
        </details>
      </aside>
      <div className="article-prose">
        {blocks.map((block, index) => block.startsWith('## ')
          ? <h2 id={`section-${index}`} key={index}>{block.slice(3)}</h2>
          : <p key={index}><InlineText text={block}/></p>)}
        <div className="article-end"><span>Continue exploring</span><a className="article-back" href="/#topics"><span aria-hidden="true">&larr;</span> Back to homepage</a></div>
      </div>
    </div>
  </article>
}
