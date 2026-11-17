import type { CSSProperties } from 'react'
import './EmotionalMap.css'
import reflectivePortrait from '../assets/reflective-portrait.webp'

const states = [
  ['Enlightenment', '700+', '#175650'], ['Peace', '600', '#1c6359'],
  ['Joy', '540', '#286e60'], ['Love', '500', '#337967'],
  ['Reason', '400', '#40816b'], ['Acceptance', '350', '#53896e'],
  ['Willingness', '310', '#638c70'], ['Neutrality', '250', '#758f70'],
  ['Courage', '200', '#83916a'], ['Pride', '175', '#92915f'],
  ['Anger', '150', '#9d8f52'], ['Desire', '125', '#ac8844'],
  ['Fear', '100', '#b78037'], ['Grief', '75', '#b67430'],
  ['Apathy', '50', '#ad6529'], ['Guilt', '30', '#a45524'],
  ['Shame', '20', '#93451f'],
] as const

export default function EmotionalMap() {
  return <section className="emotional-map" aria-labelledby="emotional-map-heading">
    <div className="map-ornament" aria-hidden="true"><span/><i/><span/></div>
    <h2 id="emotional-map-heading">A Reflective Map of Emotional States</h2>
    <div className="emotional-map-layout">
      <img className="map-portrait" src={reflectivePortrait} alt="Serene woman with closed eyes, flowing sage ribbons and a fine copper halo." width="1024" height="1536" loading="lazy" decoding="async"/>
      <ol className="emotional-scale" aria-label="Reflective emotional states and symbolic values">
        {states.map(([name, value, color], index) => <li key={name} style={{ '--band-color': color, '--band-inset-top': `${index * 2}%`, '--band-inset-bottom': `${(index + 1) * 2}%` } as CSSProperties}>
          <span className="emotion-label">{name}</span><span className="emotion-rule" aria-hidden="true"/>
          <span className="emotion-value"><span>{value}</span></span>
        </li>)}
      </ol>
      <blockquote>A contemplative map of emotional states, inviting greater self-awareness, perspective, and inner growth.</blockquote>
    </div>
    <p className="map-caption"><span/>A spiritual reflection framework<span/></p>
    <p className="map-context">The numbers are symbolic values within this framework—not audio frequencies, scientific measurements, or a ranking of personal worth.</p>
  </section>
}
