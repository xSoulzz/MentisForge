import { Fragment } from 'react'
import './Article.css'

// The supplied article uses paragraphs, headings, emphasis and strong emphasis.
// Render those as React nodes; raw HTML is never executed.
function InlineText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*| {2,}\n)/g).map((part, index) => {
    if (/^ {2,}\n$/.test(part)) return <br key={index}/>
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>
    return <Fragment key={index}>{part}</Fragment>
  })
}

export default function Article({ text, category, pathway }: { text: string; category: string; pathway?: string }) {
  const lines = text.trim().split(/\r?\n/)
  const title = lines.shift()!.replace(/^# /, '')
  while (lines[0]?.trim() === '') lines.shift()
  const subtitle = lines.shift()!.replace(/^### /, '')
  const blocks = lines.join('\n').trim().split(/\n\s*\n/)
  const readingMinutes = Math.ceil(text.split(/\s+/).length / 220)
  const sections = blocks.flatMap((block, index) => block.startsWith('## ') ? [{ title: block.slice(3), id: `section-${index}` }] : [])
  return <article className="article-page" aria-labelledby="article-title">
    <a className="article-back" href={pathway ? '/#learning' : '/#topics'}><span aria-hidden="true">&larr;</span> Back to homepage</a>
    <header className="article-heading">
      <p className="article-kicker">{pathway ? `Core pathway ${pathway}` : <>Explore topics <span aria-hidden="true">/</span> {category}</>}</p>
      <h1 id="article-title">{title}</h1>
      <p className="article-subtitle"><InlineText text={subtitle}/></p>
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
          : block.startsWith('### ')
          ? <h3 key={index}>{block.slice(4)}</h3>
          : block.startsWith('- ')
          ? <ul key={index}>{block.split('\n').map((item, itemIndex) => <li key={itemIndex}><InlineText text={item.replace(/^- /, '')}/></li>)}</ul>
          : <p key={index}><InlineText text={block}/></p>)}
        <div className="article-end"><span>Continue exploring</span><a className="article-back" href={pathway ? '/#learning' : '/#topics'}><span aria-hidden="true">&larr;</span> Back to homepage</a></div>
      </div>
    </div>
  </article>
}
