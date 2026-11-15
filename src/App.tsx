import { useEffect, useRef, useState } from 'react'
import heroArtwork from './assets/mentis-hero-v2.png'
import libraryArtwork from './assets/inner-library-detailed.png'
import neuroVideoArtwork from './assets/watch-neuroplasticity.png'
import reflectionVideoArtwork from './assets/watch-reflection.png'
import Article from './pages/Article'
import Terms from './pages/Terms'
import AdultNeuroplasticityAnswer from './pages/AdultNeuroplasticityAnswer'
import HabitsAnswer from './pages/HabitsAnswer'
import AttentionAnswer from './pages/AttentionAnswer'
import SkillPracticeReading from './pages/SkillPracticeReading'
import AttentionReading from './pages/AttentionReading'
import SleepReading from './pages/SleepReading'
import neuroplasticityText from './content/neuroplasticity.md?raw'
import attentionText from './content/attention-learning.md?raw'
import meaningText from './content/self-meaning.md?raw'
import bodyText from './content/body-vitality.md?raw'
import mindBrainText from './content/mind-brain.md?raw'
import selfMasteryText from './content/self-mastery.md?raw'
import growthChangeText from './content/growth-change.md?raw'
import deeperLibraryText from './content/deeper-library.md?raw'
import './App.css'

const articleRoutes = {
  DeeperLibrary: { path: '/pathways/deeper-library/', category: 'The Deeper Library', text: deeperLibraryText },
  GrowthChange: { path: '/pathways/growth-change/', category: 'Growth & Change', text: growthChangeText },
  SelfMastery: { path: '/pathways/self-mastery/', category: 'Self-Mastery', text: selfMasteryText },
  MindBrain: { path: '/pathways/mind-brain/', category: 'The Mind & Brain', text: mindBrainText },
  Body: { path: '/topics/body-vitality/', category: 'Body & Vitality', text: bodyText },
  Meaning: { path: '/topics/self-meaning/', category: 'Self & Meaning', text: meaningText },
  Neuroplasticity: { path: '/topics/neuroplasticity/', category: 'Neuroplasticity', text: neuroplasticityText },
  Attention: { path: '/topics/attention-learning/', category: 'Attention & Learning', text: attentionText },
}
const currentPath = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '')
const currentArticle = Object.values(articleRoutes).find(article => article.path.slice(0, -1) === currentPath)
const isTerms = currentPath === '/terms'
const isArticle = Boolean(currentArticle) || isTerms

const information = {
  Contact: { title: 'Contact', text: 'Contact details are not available yet. Please check back for a direct way to reach Mentis Forge.' },
  Privacy: { title: 'Privacy', text: 'The privacy notice is not available yet. This placeholder is not a published privacy policy.' },
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => { try { return localStorage.getItem('mentis-theme') === 'dark' ? 'dark' : 'light' } catch { return 'light' } })
  const [menuOpen, setMenuOpen] = useState(false)
  const [topic, setTopic] = useState<Topic | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.page = isArticle ? 'article' : 'home'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#fbf5e7' : isArticle ? '#091c1b' : '#121615')
    try { localStorage.setItem('mentis-theme', theme) } catch { /* Optional storage. */ }
  }, [theme])
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus() }
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [menuOpen])
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1101px)')
    const closeMenu = () => { if (desktop.matches) setMenuOpen(false) }
    desktop.addEventListener('change', closeMenu)
    return () => desktop.removeEventListener('change', closeMenu)
  }, [])
  function showTopic(value: Topic) {
    setTopic(value)
    dialog.current?.showModal()
  }
  const navigation = <>
    <a className="nav-link" href="/#topics" onClick={() => setMenuOpen(false)}>Topics</a>
    <a className="nav-link" href="/#reading" onClick={() => setMenuOpen(false)}>Reading</a>
    <a className="nav-link" href="/#about" onClick={() => setMenuOpen(false)}>About</a>
    <a className="nav-link" href="/#community" onClick={() => setMenuOpen(false)}>Community</a>
  </>
  return <div className={`landing-shell${isArticle ? ' article-shell' : ''}`}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <div className="header-content">
        <a className="brand" href="/" aria-label="Mentis Forge home"><Emblem/><span className="brand-copy"><span className="brand-name">Mentis Forge</span><span className="tagline">The science of a more capable mind</span></span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{navigation}</nav>
        <button className="theme-toggle" role="switch" aria-checked={theme === 'dark'} aria-label="Dark mode" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><span className={theme === 'light' ? 'theme-option active' : 'theme-option'}><Sun/></span><span className={theme === 'dark' ? 'theme-option active' : 'theme-option'}><Moon/></span></button>
        <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="header-menu" onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
      </div>
      {menuOpen && <nav id="header-menu" className="header-menu" aria-label="Mobile navigation">{navigation}</nav>}
    </header>
    <main id="main-content" tabIndex={-1}>
      {isTerms ? <Terms/> : currentArticle ? <Article text={currentArticle.text} category={currentArticle.category} pathway={currentArticle === articleRoutes.MindBrain ? '01' : currentArticle === articleRoutes.SelfMastery ? '02' : currentArticle === articleRoutes.GrowthChange ? '03' : currentArticle === articleRoutes.DeeperLibrary ? '04' : undefined}/> : <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="eyebrow">Neuroscience · Psychology · Possibility</p>
          <h1 id="hero-heading">Understand your mind.<br/>Build your next chapter.</h1>
          <p className="hero-description">Evidence-based insights from neuroscience and psychology on how the brain learns, adapts, and finds meaning in everyday life.</p>
          <a className="hero-cta" href="/#topics">Explore the research <span aria-hidden="true">&rarr;</span></a>
        </div>
        <div className="hero-art"><img src={heroArtwork} width="1619" height="971" fetchPriority="high" alt="Ivory anatomical brain beneath a classical gold arch, with branching golden neurons on either side."/></div>
      </section>
      <section id="learning" className="learning-section" aria-labelledby="learning-heading">
        <p className="eyebrow">The four learning pillars</p>
        <h2 id="learning-heading">Core pathways for a more capable mind</h2>
        <div className="learning-grid">
          {[
            { title: 'The Mind & Brain', text: 'Neuroscience for a deeper understanding of how you think, feel and learn.', href: articleRoutes.MindBrain.path, icon: 'M24 8v32M24 12C13 2 5 15 9 21 2 28 10 40 18 37c2 6 6 3 6-1m0-24c11-10 19 3 15 9 7 7-1 19-9 16-2 6-6 3-6-1M15 14c-4 5 5 7 2 12m-7 4c5-4 9 0 8 5m15-21c4 5-5 7-2 12m7 4c-5-4-9 0-8 5' },
            { title: 'Self-Mastery', text: 'Evidence-based tools to build focus, resilience, and mental clarity.', href: articleRoutes.SelfMastery.path, icon: 'm4 15 20-10 20 10-20 10Zm0 10 20 10 20-10M4 35l20 10 20-10' },
            { title: 'Growth & Change', text: 'Psychology and habit science for lasting, meaningful transformation.', href: articleRoutes.GrowthChange.path, icon: 'M24 43V24M24 31C23 11 34 6 44 7c0 14-9 22-20 22M24 25C23 10 14 6 4 8c0 12 8 19 20 17m0 5 13-15M24 25 12 14' },
            { title: 'The Deeper Library', text: 'Foundational ideas, enduring texts and cross-disciplinary perspectives on the mind.', href: articleRoutes.DeeperLibrary.path, icon: 'M24 12C17 7 9 7 4 9v29c7-2 14-1 20 4 6-5 13-6 20-4V9c-5-2-13-2-20 3Zm0 0v30' },
          ].map(pillar => <a className="learning-card" key={pillar.title} href={pillar.href}><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d={pillar.icon}/></svg><div><h3>{pillar.title}</h3><p>{pillar.text}</p></div></a>)}
        </div>
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
            <h3><a href={articleRoutes[key].path}>{title}</a></h3>
            <p>{description}</p>
          </article>)}
        </div>
      </section>
      <section id="questions" className="questions-section" aria-labelledby="questions-heading">
        <h2 id="questions-heading">Common questions</h2>
        <p className="section-intro">Quick answers, grounded in research.</p>
        <div className="faq-list">
          {([
            ['Neuroplasticity', 'Neuroplasticity', 'What does neuroplasticity mean in adulthood?', null],
            ['Attention', 'Habits', 'How does the brain form a new habit?', null],
            ['Attention', 'Attention', 'Can focused attention change what we learn?', null],
          ] as const).map(([key, category, question, answer]) => <details className="faq-item" name="common-questions" key={question}>
            <summary><span className="category-label">{category}</span><span className="faq-question">{question}</span><span className="faq-symbol" aria-hidden="true"/></summary>
            <div className="faq-answer">{key === 'Neuroplasticity' ? <AdultNeuroplasticityAnswer/> : category === 'Habits' ? <HabitsAnswer/> : category === 'Attention' ? <AttentionAnswer/> : <p>{answer}</p>}{(key === 'Neuroplasticity' || key === 'Attention') ? <a className="text-link" href={articleRoutes[key].path}>Explore the topic <span aria-hidden="true">&rarr;</span></a> : <button className="text-link" onClick={() => showTopic(key)}>Explore the topic <span aria-hidden="true">&rarr;</span></button>}</div>
          </details>)}
        </div>
      </section>
      <section id="reading" className="reading-section" aria-labelledby="reading-heading">
        <h2 id="reading-heading">Latest reading</h2>
        <div className="reading-list">
          {[
            { category: 'Neuroplasticity', title: 'What changes in the brain when we repeat a skill?', summary: 'Practicing a skill can change how neural networks communicate and how brain networks work together.', body: null },
            { category: 'Attention', title: 'Why is attention easier to lose than regain?', summary: 'A distraction can interrupt us in a moment; returning means recovering our place.', body: null },
            { category: 'Sleep & Recovery', title: 'How does sleep support learning?', summary: 'Sleep helps the brain consolidate new memories and prepare for future learning.', body: null },
          ].map(article => <details className="reading-item" key={article.title}>
            <summary><span className="category-label">{article.category}</span><span className="reading-copy"><span className="reading-title">{article.title}</span><span className="reading-summary">{article.summary}</span></span><span className="reading-time">3 min read <span aria-hidden="true">&#8599;</span></span></summary>
            <div className="reading-body">{article.category === 'Neuroplasticity' ? <SkillPracticeReading/> : article.category === 'Attention' ? <AttentionReading/> : <SleepReading/>}</div>
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
            <p className="study-description">Start with evidence. Ask how a finding was studied and what its limits are.</p>
          </article>
          <article className="study-pillar">
            <svg className="study-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 15C24 9 14 8 6 11v39c9-3 18-2 26 4 8-6 17-7 26-4V11c-8-3-18-2-26 4Zm0 0v39M11 15v30c7-1 13 0 17 3M53 15v30c-7-1-13 0-17 3"/></svg>
            <h3>Interpretation</h3>
            <p className="study-description">Explore meaning with care. Distinguish evidence from perspective and tradition.</p>
          </article>
          <article className="study-pillar">
            <svg className="study-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 57V33M32 42C32 20 44 10 58 10c0 16-8 28-26 28M32 33C30 14 19 8 6 10c0 15 9 25 26 23M32 38l17-19M31 33 15 18"/></svg>
            <h3>Practice</h3>
            <p className="study-description">Bring ideas into daily life. Observe, reflect, and adjust with curiosity.</p>
          </article>
        </div>
      </section>
      <section id="about" className="about-section" aria-labelledby="about-heading">
        <p className="eyebrow">Curiosity, shared</p>
        <h2 id="about-heading">Meet the guides</h2>
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
      </section>
      <section id="community" className="community-section" aria-labelledby="community-heading">
        <div className="community-copy"><p className="eyebrow">Keep the conversation growing</p><h2 id="community-heading">Join the Mentis Forge community</h2>
          <p>Thoughtful reading, new research highlights, and conversations about the science of a more capable mind.</p></div>
        <div className="about-community">
          <nav aria-label="Join the Mentis Forge community">
            <a href="https://discord.gg/K9RKgcu7UC" target="_blank" rel="noreferrer">Join us on Discord <span aria-hidden="true">&#8599;</span></a>
            <a href="https://www.skool.com/" target="_blank" rel="noreferrer">Skool <span aria-hidden="true">&#8599;</span></a>
          </nav>
        </div>
      </section>
      </>}
    </main>
    <footer className="site-footer" aria-label="Site footer">
      <a className="brand footer-brand" href="/" aria-label="Mentis Forge home"><Emblem/><span className="brand-copy"><span className="brand-name">Mentis Forge</span><span className="tagline">Neuroscience + Psychology</span></span></a>
      <nav className="footer-column" aria-labelledby="footer-explore">
        <h2 id="footer-explore">Explore</h2>
        <a href="/#topics">Topics</a>
        <a href="/#questions">Common questions</a>
        <a href="/#reading">Latest reading</a>
        <a href="/#about">Who we are</a>
      </nav>
      <nav className="footer-column" aria-labelledby="footer-community">
        <h2 id="footer-community">Community</h2>
        <a href="https://discord.gg/K9RKgcu7UC" target="_blank" rel="noreferrer">Discord <span className="sr-only">(opens in a new tab)</span></a>
        <a href="https://www.skool.com/" target="_blank" rel="noreferrer">Skool <span className="sr-only">(opens in a new tab)</span></a>
        <a href="/#library">The Inner Library</a>
      </nav>
      <nav className="footer-column" aria-labelledby="footer-information">
        <h2 id="footer-information">Information</h2>
        {(['Contact', 'Privacy', 'Terms', 'Accessibility'] as const).map(item => item === 'Terms' ? <a key={item} href="/terms/" aria-current={isTerms ? 'page' : undefined}>Terms</a> : <button key={item} onClick={() => showTopic(item)} aria-haspopup="dialog">{item}</button>)}
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
