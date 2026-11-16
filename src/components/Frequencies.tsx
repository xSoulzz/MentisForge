import { frequencies, useFrequencyPlayer } from './useFrequencyPlayer'
import './Frequencies.css'

const timestamp = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
type Player = ReturnType<typeof useFrequencyPlayer>

function WaveIcon() {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M2 25h7l4-10 5 21 6-30 5 36 5-24 4 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
export function FrequencySelector({ player }: { player: Player }) {
  return <section className="frequency-strip" aria-labelledby="frequency-heading">
    <div className="frequency-intro"><WaveIcon/><div><h2 id="frequency-heading">Solfeggio Frequencies</h2><p>Select a frequency to listen</p></div></div>
    <div className="frequency-options" role="group" aria-label="Listening frequency">
      {frequencies.map(f => <button key={f.hz} aria-pressed={player.hz === f.hz} onClick={() => player.select(f.hz)}><strong>{f.hz} Hz</strong><span>{f.name}</span></button>)}
    </div>
  </section>
}
export function FrequencyAudio({ player, detail = false }: { player: Player; detail?: boolean }) {
  const selected = frequencies.find(f => f.hz === player.hz)!
  return <section className="frequency-audio" aria-labelledby="audio-heading">
    <div className="audio-heading"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M6 24v-5a14 14 0 0 1 28 0v5M6 21H3v12h7V21ZM34 21h3v12h-7V21Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg><h2 id="audio-heading">Healing Frequencies Audio</h2></div>
    <p>A quiet space to listen, reflect, and return to the present.</p>
    <p className="selected-frequency" aria-live="polite">{player.hz} Hz <span>· {selected.name}</span></p>
    <div className="audio-controls">
      <button className="audio-play" onClick={() => void player.toggle()} aria-label={player.playing || player.loading ? 'Pause frequency tone' : 'Play frequency tone'}>{player.playing || player.loading ? <span aria-hidden="true">Ⅱ</span> : <span aria-hidden="true">▶</span>}</button>
      <label className="audio-progress"><span className="sr-only">Playback position</span><input type="range" min="0" max={player.duration} disabled={!player.ready} step="1" value={Math.floor(player.position)} onChange={e => player.seek(Number(e.target.value))} aria-valuetext={`${timestamp(player.position)} of ${timestamp(player.duration)}`}/><span className="audio-time">{timestamp(player.position)} / {timestamp(player.duration)}</span></label>
    </div>
    <label className="audio-volume"><span>Volume</span><input type="range" min="0" max="100" value={player.volume} onChange={e => player.changeVolume(Number(e.target.value))}/><output>{player.volume}%</output></label>
    <p className="audio-note">Solfeggio recording · Start at a comfortable, low volume.</p>
    {player.loading && <p role="status">Loading recording…</p>}
    {player.error && <p role="alert">{player.error}</p>}
    {!detail && <a className="frequency-learn" href={`/frequencies/?hz=${player.hz}`}>Explore the frequencies <span aria-hidden="true">→</span></a>}
  </section>
}
export function FrequencyPage({ player }: { player: Player }) {
  return <article className="frequency-page">
    <a className="article-back" href="/">← Back to homepage</a>
    <header className="frequency-hero"><div><p className="eyebrow">Sound · Reflection · Presence</p><h1>Healing Frequencies</h1><h2>A space for sound and self-reflection</h2><p>Explore nine tones used in contemporary Solfeggio listening practices. Choose a frequency, settle into a comfortable space, and make time for attentive listening.</p></div><div className="sound-orbits" aria-hidden="true"><WaveIcon/></div></header>
    <div className="frequency-page-grid">
      <section className="frequency-directory" aria-labelledby="nine-heading"><h2 id="nine-heading">The 9 Solfeggio Frequencies</h2><p>The names below are reflective themes, not promises of a particular outcome.</p><div className="frequency-list">{frequencies.map(f => <button key={f.hz} aria-pressed={player.hz === f.hz} onClick={() => player.select(f.hz)}><span className="frequency-dot" aria-hidden="true"/><strong>{f.hz} Hz</strong><span>— {f.name}</span></button>)}</div></section>
      <div><FrequencyAudio player={player} detail/><section className="listening-guide"><h2>A simple listening practice</h2><ul><li>Choose a tone and keep the volume comfortable.</li><li>Notice the sound and your breathing without forcing a response.</li><li>Pause whenever you want. Silence can be part of the practice.</li></ul><p>These recordings accompany a reflective listening practice, not medical treatment. “Healing” describes the contemplative theme; the frequency names do not establish specific health benefits.</p><a className="text-link" href="/pathways/deeper-library/">Explore the Deeper Library →</a></section></div>
    </div>
  </article>
}
