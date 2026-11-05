import { useEffect, useState } from 'react'
import './App.css'

function Emblem() {
  return <svg className="emblem" viewBox="0 0 100 100" aria-hidden="true">
    <defs><linearGradient id="gold"><stop stopColor="#b78932"/><stop offset=".5" stopColor="#ffe3a0"/><stop offset="1" stopColor="#bd913d"/></linearGradient></defs>
    <g fill="none" stroke="url(#gold)"><circle cx="50" cy="50" r="47"/><circle cx="50" cy="50" r="44.5" strokeWidth=".5"/><path d="M50 12v76M25 70l11-36 14 18 15-18 10 36M31 65l7-24 12 17 12-17 7 24M25 70l12-7m38 7-12-7M40 29l10 9 10-9M40 76l10 6 10-6" strokeWidth="1.7"/><path d="M40 61q10-10 20 0-10 10-20 0Z"/><circle cx="50" cy="61" r="2"/></g><path d="m50 16 2 9 8 2-8 2-2 9-2-9-8-2 8-2Z" fill="url(#gold)"/>
  </svg>
}
function Sun() { return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="6"/><path d="M16 2v5m0 18v5M2 16h5m18 0h5M6 6l4 4m12 12 4 4M6 26l4-4M22 10l4-4"/></svg> }
function Moon() { return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M21 3A13 13 0 1 0 29 23 11 11 0 0 1 21 3Z" fill="currentColor" stroke="none"/></svg> }
function Corner({right = false}: {right?: boolean}) { return <svg className={'corner ' + (right ? 'right' : '')} viewBox="0 0 72 72" aria-hidden="true"><path d="M3 69V3h66M3 49C3 22 22 3 49 3M18 3q3 9-7 15"/><path fill="currentColor" stroke="none" d="m8 0 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/></svg> }

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => { try { return localStorage.getItem('mentis-theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' } })
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('mentis-theme', theme) } catch { /* Optional storage. */ } }, [theme])
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [])
  return <header className="site-header">
    <Corner/><Corner right/>
    <div className="header-content">
      <a className="brand" href="/" aria-label="Mentis Forge home"><Emblem/><span className="divider" aria-hidden="true">✦</span><span className="brand-copy"><span className="brand-name">Mentis Forge</span><span className="tagline">Neuroscience • Esoteric Psychology</span></span></a>
      <div className="theme-switch" role="group" aria-label="Color theme">
        <button aria-label="Light theme" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}><Sun/><span>Light</span></button>
        <button aria-label="Dark theme" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}><Moon/><span>Dark</span></button>
      </div>
      <nav className="communities" aria-label="Communities"><a href="https://discord.com/" target="_blank" rel="noreferrer"><span>Discord</span><small>Free for now</small></a><a href="https://www.skool.com/" target="_blank" rel="noreferrer"><span>Skool</span><small>Free access</small></a></nav>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="header-menu" onClick={() => setMenuOpen(!menuOpen)}><span/><span/><span/></button>
    </div>
    <div className="greek-key" aria-hidden="true"/>
    {menuOpen && <nav id="header-menu" className="header-menu" aria-label="Main navigation"><a href="/" onClick={() => setMenuOpen(false)}>Home</a><a href="https://discord.com/" target="_blank" rel="noreferrer">Discord ↗</a><a href="https://www.skool.com/" target="_blank" rel="noreferrer">Skool ↗</a></nav>}
  </header>
}
export default App
