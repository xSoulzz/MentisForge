import { useEffect, useRef, useState } from 'react'

export const frequencies = [
  { hz: 174, name: 'Foundation' }, { hz: 285, name: 'Restoration' },
  { hz: 396, name: 'Release' }, { hz: 417, name: 'Change' },
  { hz: 528, name: 'Transformation' }, { hz: 639, name: 'Harmony' },
  { hz: 741, name: 'Awareness' }, { hz: 852, name: 'Intuition' },
  { hz: 963, name: 'Higher Self' },
]
export function useFrequencyPlayer() {
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

  useEffect(() => {
    const audio = new Audio(`/audio/solfeggio-${hz}-hz.mp3`)
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
    audio.addEventListener('loadedmetadata', metadata)
    audio.addEventListener('durationchange', metadata)
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('playing', started)
    audio.addEventListener('pause', paused)
    audio.addEventListener('ended', paused)
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
      audio.removeEventListener('ended', paused)
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
  }, [hz])

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
  function select(value: number) {
    if (value === hz || !frequencies.some(f => f.hz === value)) return
    audioRef.current?.pause()
    setPlaying(false)
    setLoading(false)
    setPosition(0)
    setDuration(900)
    setReady(false)
    setError('')
    setHz(value)
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
  return { hz, playing, loading, position, duration, ready, volume, error, toggle, select, seek, changeVolume }
}
