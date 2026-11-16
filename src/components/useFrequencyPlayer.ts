import { useEffect, useRef, useState } from 'react'

export const frequencies = [
  { hz: 174, name: 'Foundation' }, { hz: 285, name: 'Restoration' },
  { hz: 396, name: 'Release' }, { hz: 417, name: 'Change' },
  { hz: 528, name: 'Transformation' }, { hz: 639, name: 'Harmony' },
  { hz: 741, name: 'Awareness' }, { hz: 852, name: 'Intuition' },
  { hz: 963, name: 'Higher Self' },
]
export function useFrequencyPlayer(enabled = true) {
  const [hz, setHz] = useState(() => {
    const requested = Number(new URLSearchParams(window.location.search).get('hz'))
    return frequencies.some(f => f.hz === requested) ? requested : 528
  })
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(900)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [volume, setVolume] = useState(20)
  const [error, setError] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const volumeRef = useRef(.2)
  const pending = useRef(false)
  const initialHz = useRef(hz)
  const selectedHz = useRef(hz)
  const sequence = useRef(false)
  const [playingAll, setPlayingAll] = useState(false)


  async function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused || pending.current) { audio.pause(); pending.current = false; setLoading(false); return }
    pending.current = true
    setLoading(true)
    setError('')
    try {
      if (audio.error) audio.load()
      if (audio.ended) audio.currentTime = 0
      document.querySelectorAll('video, audio').forEach(media => (media as HTMLMediaElement).pause())
      await audio.play()
    } catch (failure) {
      if (audioRef.current === audio && !(failure instanceof DOMException && failure.name === 'AbortError')) {
        setError('Playback could not start. Please press play to try again.')
        setLoading(false)
      }
    } finally { if (audioRef.current === audio) pending.current = false }
  }
  function select(value: number, continueSequence = false, restart = false) {
    if (!frequencies.some(f => f.hz === value)) return
    const audio = audioRef.current
    if (!audio) return
    if (!continueSequence) { sequence.current = false; setPlayingAll(false) }
    if (value === selectedHz.current && !restart) {
      if (audio.paused && !pending.current) void toggle()
      return
    }
    audio.pause()
    pending.current = false
    setPlaying(false)
    setLoading(false)
    setPosition(0)
    setDuration(900)
    setReady(false)
    setError('')
    setHz(value)
    selectedHz.current = value
    audio.src = `/audio/solfeggio-${value}-hz.mp3`
    audio.volume = volumeRef.current
    // Start directly from the user's click, including on mobile browsers.
    void toggle()
  }
  function playAll() {
    if (sequence.current) { void toggle(); return }
    sequence.current = true
    setPlayingAll(true)
    select(frequencies[0].hz, true, true)
  }
  function seek(value: number) {
    if (audioRef.current && ready) {
      audioRef.current.currentTime = Math.max(0, Math.min(value, duration))
      setPosition(audioRef.current.currentTime)
    }
  }
  function changeVolume(value: number) {
    setVolume(value)
    volumeRef.current = value / 100
    if (audioRef.current) audioRef.current.volume = volumeRef.current
  }
  useEffect(() => {
    if (!enabled) return
    const audio = new Audio(`/audio/solfeggio-${initialHz.current}-hz.mp3`)
    audio.preload = 'metadata'
    audio.volume = volumeRef.current
    audioRef.current = audio
    const updateTime = () => setPosition(audio.currentTime)
    const metadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
        setReady(true)
      }
    }
    const started = () => { setPlaying(true); setLoading(false) }
    const paused = () => { setPlaying(false); setLoading(false); pending.current = false }
    const waiting = () => { if (!audio.paused) setLoading(true) }
    const failed = () => { paused(); setError('This recording could not be loaded. Press play to try again.') }
    const ended = () => {
      paused()
      const next = frequencies[frequencies.findIndex(f => f.hz === selectedHz.current) + 1]
      if (sequence.current && next) select(next.hz, true)
      else { sequence.current = false; setPlayingAll(false) }
    }
    audio.addEventListener('loadedmetadata', metadata)
    audio.addEventListener('durationchange', metadata)
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('playing', started)
    audio.addEventListener('pause', paused)
    audio.addEventListener('ended', ended)
    audio.addEventListener('waiting', waiting)
    audio.addEventListener('error', failed)
    const stopForMedia = (event: Event) => { if (event.target instanceof HTMLMediaElement && event.target !== audio) audio.pause() }
    const stopOnLeave = () => audio.pause()
    document.addEventListener('play', stopForMedia, true)
    window.addEventListener('pagehide', stopOnLeave)
    return () => {
      audio.removeEventListener('loadedmetadata', metadata)
      audio.removeEventListener('durationchange', metadata)
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('playing', started)
      audio.removeEventListener('pause', paused)
      audio.removeEventListener('ended', ended)
      audio.removeEventListener('waiting', waiting)
      audio.removeEventListener('error', failed)
      document.removeEventListener('play', stopForMedia, true)
      window.removeEventListener('pagehide', stopOnLeave)
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      audioRef.current = null
      pending.current = false
    }
  }, [enabled])

  return { hz, playing, playingAll, playAll, loading, position, duration, ready, volume, error, toggle, select, seek, changeVolume }
}
