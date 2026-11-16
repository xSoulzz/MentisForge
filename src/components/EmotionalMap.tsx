import type { CSSProperties } from 'react'
import './EmotionalMap.css'

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
      <svg className="map-portrait" viewBox="0 0 280 500" fill="none" aria-hidden="true">
        <circle cx="140" cy="130" r="108" stroke="currentColor" strokeWidth=".8"/>
        <path className="portrait-wash" d="M145 60C77 53 38 113 57 177c8 26 35 53 28 85-8 39-49 59-43 104 5 44 50 89 85 120-9-62 49-107 39-153-8-36-39-49-25-85 9-24 51-39 68-65 12-17 22-45 12-59-8-12-34-14-43-34-6-14-19-26-33-30Z"/>
        <path className="portrait-line" d="M145 60c-41 5-43 49-63 66-13 11-25 20-22 41 2 19 16 31 31 40m54-147c26 1 38 16 47 35 8 17 24 23 40 29 7 3 9 10 5 14l-16 8 7 10-4 8 3 9c-2 7-14 10-16 15-8 14-16 16-38 17-10 26-20 43-17 64 3 23 35 46 45 75 14 42-6 87-35 132M90 150c-22-14-32 18-15 32l16 8m6-34-9 16m59-112c-4 51-63 59-57 101 5 30 13 46 5 77-10 34-46 46-55 77-17 58 39 120 84 171M169 120c12-9 25-6 35 2m-32 6 20 3m27 35-13 1"/>
        <path className="portrait-ribbon" d="M145 61C116 140 6 102 12 208c3 52 122 64 134 133 9 49-25 94-22 145M142 64C229 159 25 174 32 272c5 62 162 76 180 133 9 29-10 50-25 72M65 373c8-82 104-106 99-168"/>
      </svg>
      <ol className="emotional-scale" aria-label="Reflective emotional states and symbolic values">
        {states.map(([name, value, color], index) => <li key={name} style={{ '--band-color': color, '--band-width': `${100 - index * 4.7}%` } as CSSProperties}>
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
