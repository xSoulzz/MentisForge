import { useEffect, useRef, useState } from 'react'
import heroArtwork from './assets/mentis-hero-v2.png'
import './App.css'

const information = {
  Topics: { title: 'Explore the mind', text: 'Neuroscience, psychology, and contemplative traditions. Explore how we learn, what shapes attention, and how we make meaning.' },
  Questions: { title: 'A curious place to begin', text: 'What changes when we learn? How do habits form? How can attention be practiced? These are the questions that guide our exploration.' },
  About: { title: 'About Mentis Forge', text: 'A space to study neuroscience, psychology, and contemplative traditions with curiosity and care. Study the mind. Explore meaning. Practice change.' },
}
type Topic = keyof typeof information

function Emblem() {
  return <svg className="emblem" viewBox="0 0 60 48" aria-hidden="true"><path d="M3 41h12M44 41h13M9 41 20 7 31 36 42 7 52 41M18 14 29 41 40 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter"/></svg>
}
function Sun() { return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="6"/><path d="M16 2v5m0 18v5M2 16h5m18 0h5M6 6l4 4m12 12 4 4M6 26l4-4M22 10l4-4"/></svg> }
function Moon() { return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M21 3A13 13 0 1 0 29 23 11 11 0 0 1 21 3Z"/></svg> }

function App() {
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
    {(Object.keys(information) as Topic[]).map(value => <button key={value} onClick={() => showTopic(value)}>{value}</button>)}
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
          <button className="hero-cta" onClick={() => showTopic('About')}>Learn more <span aria-hidden="true">&rarr;</span></button>
        </div>
        <div className="hero-art"><img src={heroArtwork} width="1619" height="971" fetchPriority="high" alt="Ivory anatomical brain beneath a classical gold arch, with branching golden neurons on either side."/></div>
      </section>
    </main>
    <dialog ref={dialog} className="header-dialog" aria-labelledby="dialog-title" onClose={() => setTopic(null)}>
      <form method="dialog"><button className="dialog-close" aria-label="Close information">&times;</button></form>
      <h2 id="dialog-title">{topic && information[topic].title}</h2>
      <p>{topic && information[topic].text}</p>
    </dialog>
  </div>
}
export default App
