import { useRef, useState } from 'react'

export default function VideoPlayer({ src, poster, title, titleId }: { src: string; poster: string; title: string; titleId: string }) {
  const video = useRef<HTMLVideoElement>(null)
  const [volume, setVolume] = useState(100)
  const [muted, setMuted] = useState(false)
  function syncVolume() {
    if (!video.current) return
    setVolume(Math.round(video.current.volume * 100))
    setMuted(video.current.muted)
  }
  function changeVolume(value: number) {
    if (!video.current) return
    video.current.volume = value / 100
    video.current.muted = value === 0
    syncVolume()
  }
  function toggleMute() {
    if (!video.current) return
    if (video.current.muted || video.current.volume === 0) {
      if (video.current.volume === 0) video.current.volume = .5
      video.current.muted = false
    } else video.current.muted = true
    syncVolume()
  }
  return <div className="video-player">
    <video ref={video} className="watch-video" controls playsInline preload="none" poster={poster} aria-labelledby={titleId} onVolumeChange={syncVolume}>
      <source src={src} type="video/mp4"/>
      Your browser does not support embedded video. <a href={src}>Open the video</a>.
    </video>
    <div className="video-volume-controls">
      <button type="button" onClick={toggleMute} aria-label={`${muted || volume === 0 ? 'Unmute' : 'Mute'} ${title}`}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3Z"/>{muted || volume === 0 ? <path d="m16 9 6 6m0-6-6 6"/> : <path d="M16 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>}</svg>
      </button>
      <label><span>Volume</span><input type="range" min="0" max="100" value={muted ? 0 : volume} aria-label={`${title} volume`} onChange={event => changeVolume(Number(event.target.value))}/></label>
      <output aria-live="polite">{muted ? 'Muted' : `${volume}%`}</output>
    </div>
  </div>
}
