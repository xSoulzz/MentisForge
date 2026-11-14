import { useEffect, useRef, useState } from 'react'
import heroArtwork from './assets/mentis-hero-v2.png'
import libraryArtwork from './assets/inner-library-detailed.png'
import neuroVideoArtwork from './assets/watch-neuroplasticity.png'
import reflectionVideoArtwork from './assets/watch-reflection.png'
import './App.css'

const information = {
  Contact: { title: 'Contact', text: 'Contact details are not available yet. Please check back for a direct way to reach Mentis Forge.' },
  Privacy: { title: 'Privacy', text: 'The privacy notice is not available yet. This placeholder is not a published privacy policy.' },
  Terms: { title: 'Terms', text: 'Terms are not available yet. This placeholder is not a published terms of use agreement.' },
  Accessibility: { title: 'Accessibility', text: 'Use Tab to move between controls and Enter or Space to activate buttons. Escape closes information dialogs. The theme control switches between light and dark modes. A dedicated accessibility statement and contact channel are not available yet.' },
  NeuroVideo: { title: 'Neuroplasticity & intentional practice', text: 'Video coming soon. This planned exploration looks at how repetition, attention, and environment shape learning. In the meantime, explore the Neuroplasticity topic and Latest Reading above.' },
  ReflectionVideo: { title: 'Symbols, reflection & the inner life', text: 'Video coming soon. A planned guided look at contemplative traditions and personal meaning. In the meantime, explore Self & Meaning in the topics above.' },
  Discovery: { title: 'Discovery', text: 'Begin with curiosity. Explore the topics and short readings on this page to find the questions you want to pursue.' },
  Academy: { title: 'Academy', text: 'A direction for deeper study: connect ideas across neuroscience, psychology, and contemplative traditions. Structured learning in this part of the library is not yet available.' },
  Mastery: { title: 'Mastery', text: 'A direction for continued practice: revisit what you learn, reflect on experience, and refine your understanding over time. This part of the library is not yet available.' },
  Neuroplasticity: { title: 'Neuroplasticity', text: 'Explore how experience and practice shape the brain throughout life. Start with the reading on repetition below.' },
  Attention: { title: 'Attention & Learning', text: 'Explore how the brain selects, sustains, and updates information. Start with the reading on attention below.' },
  Meaning: { title: 'Self & Meaning', text: 'Explore the neuroscience and psychology of identity, values, and meaning. We approach contemplative traditions as perspectives to examine, alongside scientific inquiry.' },
  Body: { title: 'Body & Vitality', text: 'Explore how sleep, movement, nutrition, and stress relate to brain function. Start with the reading on sleep below.' },
  About: { title: 'About Mentis Forge', text: 'A space to study neuroscience, psychology, and contemplative traditions with curiosity and care. Study the mind. Explore meaning. Practice change.' },
}
type Topic = keyof typeof information

function Emblem() {
  return <svg className="emblem" viewBox="0 0 60 48" aria-hidden="true"><path d="M3 41h12M44 41h13M9 41 20 7 31 36 42 7 52 41M18 14 29 41 40 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter"/></svg>
}
function Sun() { return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="6"/><path d="M16 2v5m0 18v5M2 16h5m18 0h5M6 6l4 4m12 12 4 4M6 26l4-4M22 10l4-4"/></svg> }
function Moon() { return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M21 3A13 13 0 1 0 29 23 11 11 0 0 1 21 3Z"/></svg> }

function App() {
  const [copyrightYear] = useState(() => new Date().getFullYear())
  const [theme, setTheme] = useState<'light' | 'dark'>(() => { try { return localStorage.getItem('mentis-theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' } })
  const [menuOpen, setMenuOpen] = useState(false)
  const [topic, setTopic] = useState<Topic | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#fbf5e7' : '#121615')
    try { localStorage.setItem('mentis-theme', theme) } catch { /* Optional storage. */ }
  }, [theme])
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus() }
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [menuOpen])
  function showTopic(value: Topic) {
    setTopic(value)
    dialog.current?.showModal()
  }
  const navigation = <>
    <a className="nav-link" href="#topics" onClick={() => setMenuOpen(false)}>Topics</a>
    <a className="nav-link" href="#questions" onClick={() => setMenuOpen(false)}>Questions</a>
    <a className="nav-link" href="#about" onClick={() => setMenuOpen(false)}>About</a>
    <a className="community-link" href="https://discord.com/" target="_blank" rel="noreferrer">Join Discord</a>
  </>
  return <div className="landing-shell">
    <header className="site-header">
      <div className="header-content">
        <a className="brand" href="/" aria-label="Mentis Forge home"><Emblem/><span className="brand-copy"><span className="brand-name">Mentis Forge</span><span className="tagline">Neuroscience + Psychology</span></span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{navigation}</nav>
        <button className="theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun/> : <Moon/>}</button>
        <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="header-menu" onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
      </div>
      {menuOpen && <nav id="header-menu" className="header-menu" aria-label="Mobile navigation">{navigation}</nav>}
    </header>
    <main>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <h1 id="hero-heading">Study the mind.<br/>Explore meaning.<br/>Practice change.</h1>
          <p className="hero-description">Neuroscience, psychology, and contemplative traditions for a more intentional life.</p>
          <a className="hero-cta" href="#topics">Learn more <span aria-hidden="true">&rarr;</span></a>
        </div>
        <div className="hero-art"><img src={heroArtwork} width="1619" height="971" fetchPriority="high" alt="Ivory anatomical brain beneath a classical gold arch, with branching golden neurons on either side."/></div>
      </section>
      <section id="topics" className="topics-section" aria-labelledby="topics-heading">
        <h2 id="topics-heading">Explore topics</h2>
        <div className="topic-grid">
          {([
            ['Neuroplasticity', 'Neuroplasticity', 'How experience changes the brain.'],
            ['Attention', 'Attention & Learning', 'How the brain selects, sustains, and updates information.'],
            ['Meaning', 'Self & Meaning', 'The neuroscience and psychology of identity, values, and meaning.'],
            ['Body', 'Body & Vitality', 'How sleep, movement, nutrition, and stress shape brain function.'],
          ] as const).map(([key, title, description]) => <article className="topic-card" key={key}>
            <h3><button onClick={() => showTopic(key)}>{title}</button></h3>
            <p>{description}</p>
          </article>)}
        </div>
      </section>
      <section id="questions" className="questions-section" aria-labelledby="questions-heading">
        <h2 id="questions-heading">Common questions</h2>
        <p className="section-intro">Quick answers, grounded in research.</p>
        <div className="faq-list">
          {([
            ['Neuroplasticity', 'Neuroplasticity', 'What does neuroplasticity mean in adulthood?', 'The brain continues to adapt through experience. Learning depends on practice, context, and time, not willpower alone.'],
            ['Attention', 'Habits', 'How does the brain form a new habit?', 'Repeating a behavior in a familiar context can make it more automatic. The cues around us, the rewards that follow, and consistent repetition all play a part.'],
            ['Attention', 'Attention', 'Can focused attention change what we learn?', 'Attention helps determine which information we process and practice. Reducing competing demands can support learning, while breaks and returning to material give us opportunities to revisit it.'],
          ] as const).map(([key, category, question, answer], index) => <details className="faq-item" name="common-questions" key={question} open={index === 0}>
            <summary><span className="category-label">{category}</span><span className="faq-question">{question}</span><span className="faq-symbol" aria-hidden="true"/></summary>
            <div className="faq-answer"><p>{answer}</p><button className="text-link" onClick={() => showTopic(key)}>Explore the topic <span aria-hidden="true">&rarr;</span></button></div>
          </details>)}
        </div>
      </section>
      <section id="reading" className="reading-section" aria-labelledby="reading-heading">
        <h2 id="reading-heading">Latest reading</h2>
        <div className="reading-list">
          {[
            { category: 'Neuroplasticity', title: 'What changes in the brain when we repeat a skill?', summary: 'Repeated practice strengthens neural circuits, making skills more efficient.', body: 'Learning a skill involves more than repeating a movement or remembering a fact. With practice, the networks involved in the task can become better coordinated. Progress depends on what we practice, the feedback we receive, and the conditions around learning. Repeating an error can reinforce it too. A useful starting point is to choose one small part of a skill, practice it with attention, and use feedback to adjust the next attempt.' },
            { category: 'Attention', title: 'Why is attention easier to lose than regain?', summary: 'Focus is fragile; our attention systems are easily pulled by distraction.', body: 'Attention is selective. A sound, a notification, or an unfinished concern can draw us away from the task we intended to do. Returning means finding our place and rebuilding the context of that task. Try noticing what tends to interrupt you and making one practical change, such as silencing notifications during a short period of focused work. The aim is not perfect concentration, but an environment that makes returning easier.' },
            { category: 'Sleep & Recovery', title: 'How does sleep support learning?', summary: 'Sleep helps the brain consolidate new memories and prepare for future learning.', body: 'Learning continues beyond the moment of practice. During sleep, the brain processes information from waking experience, helping some memories become more stable. Rest also supports our ability to pay attention when we return to learning. Instead of treating sleep as time taken away from study, consider it part of the learning process. Practice and recovery work together; neither is a shortcut that replaces the other.' },
          ].map(article => <details className="reading-item" key={article.title}>
            <summary><span className="category-label">{article.category}</span><span className="reading-copy"><span className="reading-title">{article.title}</span><span className="reading-summary">{article.summary}</span></span><span className="reading-time">1 min read <span aria-hidden="true">&#8599;</span></span></summary>
            <div className="reading-body"><p>{article.body}</p></div>
          </details>)}
        </div>
      </section>
      <section id="library" className="inner-library" aria-labelledby="library-heading">
        <img className="library-artwork" src={libraryArtwork} alt="" loading="lazy" decoding="async"/>
        <div className="library-content">
          <h2 id="library-heading">The Inner Library</h2>
          <nav className="library-paths" aria-label="Inner Library learning paths">
            {(['Discovery', 'Academy', 'Mastery'] as const).map(path => <button key={path} onClick={() => showTopic(path)} aria-haspopup="dialog">{path}</button>)}
          </nav>
        </div>
      </section>
      <section id="watch" className="watch-section" aria-labelledby="watch-heading">
        <h2 id="watch-heading">Watch &amp; explore</h2>
        <div className="watch-grid">
          {([
            { key: 'NeuroVideo', image: neuroVideoArtwork, title: 'Neuroplasticity & intentional practice', description: 'How repetition, attention, and environment shape learning.' },
            { key: 'ReflectionVideo', image: reflectionVideoArtwork, title: 'Symbols, reflection & the inner life', description: 'A guided look at contemplative traditions and personal meaning.' },
          ] as const).map(video => <article className="watch-card" key={video.key}>
            <button className="watch-trigger" aria-label={`${video.title}: video coming soon, view details`} aria-haspopup="dialog" onClick={() => showTopic(video.key)}>
              <span className="watch-thumbnail">
                <img src={video.image} alt="" loading="lazy" decoding="async"/>
                <span className="play-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 5 11 7-11 7Z"/></svg></span>
              </span>
              <span className="watch-copy"><span className="watch-title">{video.title}</span><span className="watch-description">{video.description}</span><span className="watch-status">Video coming soon</span></span>
            </button>
          </article>)}
        </div>
      </section>
      <section id="approach" className="study-section" aria-labelledby="study-heading">
        <h2 id="study-heading">How we study</h2>
        <div className="study-grid">
          <article className="study-pillar">
            <svg className="study-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="m31 9 8-5 14 21-8 5ZM28 12l-5 4 9 14 5-4M34 31l-4 3M18 38h24M26 42h14M44 29c13 8 8 25-7 25H20M26 54v5M14 59h38"/><path d="M26 29c-12 1-15 14-8 21M38 10l5-3"/><circle cx="44" cy="35" r="3"/></svg>
            <h3>Research</h3>
            <p>Start with evidence. Ask how a finding was studied and what its limits are.</p>
          </article>
          <article className="study-pillar">
            <svg className="study-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 15C24 9 14 8 6 11v39c9-3 18-2 26 4 8-6 17-7 26-4V11c-8-3-18-2-26 4Zm0 0v39M11 15v30c7-1 13 0 17 3M53 15v30c-7-1-13 0-17 3"/></svg>
            <h3>Interpretation</h3>
            <p>Explore meaning with care. Distinguish evidence from perspective and tradition.</p>
          </article>
          <article className="study-pillar">
            <svg className="study-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 57V33M32 42C32 20 44 10 58 10c0 16-8 28-26 28M32 33C30 14 19 8 6 10c0 15 9 25 26 23M32 38l17-19M31 33 15 18"/></svg>
            <h3>Practice</h3>
            <p>Bring ideas into daily life. Observe, reflect, and adjust with curiosity.</p>
          </article>
        </div>
      </section>
      <section id="about" className="about-section" aria-labelledby="about-heading">
        <h2 id="about-heading">Who we are</h2>
        <div className="about-grid">
          <p className="about-introduction">We're building a space to study neuroscience, psychology, and contemplative traditions with curiosity and care.</p>
          {['Noa', 'Brandon'].map(name => <article className="person-card" key={name} aria-labelledby={`person-${name.toLowerCase()}`}>
            <div className="portrait-placeholder" role="img" aria-label={`Portrait placeholder for ${name}`}>
              <svg viewBox="0 0 80 88" fill="currentColor" aria-hidden="true"><path d="M40 9c-13 0-20 9-20 23 0 10 4 18 10 22v8C15 65 8 72 8 84h64c0-12-7-19-22-22v-8c6-4 10-12 10-22C60 18 53 9 40 9Z"/></svg>
              <span aria-hidden="true">Portrait<br/>placeholder</span>
            </div>
            <h3 id={`person-${name.toLowerCase()}`}>{name}</h3>
          </article>)}
        </div>
        <div className="about-community">
          <p>Join the community for deeper inquiry, shared practice, and ongoing conversation.</p>
          <nav aria-label="Join the Mentis Forge community">
            <a href="https://discord.com/" target="_blank" rel="noreferrer">Discord <span aria-hidden="true">&#8599;</span></a>
            <a href="https://www.skool.com/" target="_blank" rel="noreferrer">Skool <span aria-hidden="true">&#8599;</span></a>
          </nav>
        </div>
      </section>
    </main>
    <footer className="site-footer" aria-label="Site footer">
      <a className="brand footer-brand" href="/" aria-label="Mentis Forge home"><Emblem/><span className="brand-copy"><span className="brand-name">Mentis Forge</span><span className="tagline">Neuroscience + Psychology</span></span></a>
      <nav className="footer-column" aria-labelledby="footer-explore">
        <h2 id="footer-explore">Explore</h2>
        <a href="#topics">Topics</a>
        <a href="#questions">Common questions</a>
        <a href="#reading">Latest reading</a>
        <a href="#about">Who we are</a>
      </nav>
      <nav className="footer-column" aria-labelledby="footer-community">
        <h2 id="footer-community">Community</h2>
        <a href="https://discord.com/" target="_blank" rel="noreferrer">Discord <span className="sr-only">(opens in a new tab)</span></a>
        <a href="https://www.skool.com/" target="_blank" rel="noreferrer">Skool <span className="sr-only">(opens in a new tab)</span></a>
        <a href="#library">The Inner Library</a>
      </nav>
      <nav className="footer-column" aria-labelledby="footer-information">
        <h2 id="footer-information">Information</h2>
        {(['Contact', 'Privacy', 'Terms', 'Accessibility'] as const).map(item => <button key={item} onClick={() => showTopic(item)} aria-haspopup="dialog">{item}</button>)}
      </nav>
      <div className="footer-note">
        <p>Mentis Forge provides educational content and does not offer medical diagnosis or treatment.</p>
        <p className="copyright">&copy; {copyrightYear} Mentis Forge</p>
      </div>
    </footer>
    <dialog ref={dialog} className="header-dialog" aria-labelledby="dialog-title">
      <form method="dialog"><button className="dialog-close" aria-label="Close information">&times;</button></form>
      <h2 id="dialog-title">{topic && information[topic].title}</h2>
      <p>{topic && information[topic].text}</p>
    </dialog>
  </div>
}
export default App
