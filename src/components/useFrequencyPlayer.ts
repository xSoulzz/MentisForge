import { useEffect, useRef, useState } from 'react'

export const frequencies = [
  { hz: 174, name: 'Foundation' }, { hz: 285, name: 'Restoration' },
  { hz: 396, name: 'Release' }, { hz: 417, name: 'Change' },
  { hz: 528, name: 'Transformation' }, { hz: 639, name: 'Harmony' },
  { hz: 741, name: 'Awareness' }, { hz: 852, name: 'Intuition' },
  { hz: 963, name: 'Higher Self' },
]
const duration = 15 * 60

export function useFrequencyPlayer() {
  const [hz, setHz] = useState(() => {
    const requested = Number(new URLSearchParams(window.location.search).get('hz'))
    return frequencies.some(f => f.hz === requested) ? requested : 528
  })
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [volume, setVolume] = useState(20)
  const [error, setError] = useState('')
  const engine = useRef<{ context: AudioContext; oscillator: OscillatorNode; gain: GainNode; start: number } | null>(null)
  const elapsed = useRef(0)
  const active = useRef(false)

  function pause() {
    const audio = engine.current
    if (audio && active.current) {
      elapsed.current = Math.min(duration, audio.context.currentTime - audio.start)
      audio.gain.gain.setTargetAtTime(0, audio.context.currentTime, .025)
      setPosition(elapsed.current)
    }
    active.current = false
    setPlaying(false)
  }
  async function toggle() {
    if (active.current) { pause(); return }
    try {
      if (!engine.current) {
        const context = new AudioContext()
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = 'sine'
        oscillator.frequency.value = hz
        gain.gain.value = 0
        oscillator.connect(gain).connect(context.destination)
        oscillator.start()
        engine.current = { context, oscillator, gain, start: 0 }
      }
      const audio = engine.current
      await audio.context.resume()
      document.querySelectorAll('video, audio').forEach(media => (media as HTMLMediaElement).pause())
      if (elapsed.current >= duration) elapsed.current = 0
      audio.start = audio.context.currentTime - elapsed.current
      audio.oscillator.frequency.setTargetAtTime(hz, audio.context.currentTime, .03)
      audio.gain.gain.setTargetAtTime(volume / 100 * .2, audio.context.currentTime, .08)
      active.current = true
      setPlaying(true)
      setError('')
    } catch { setError('Audio could not start. Please try again in a browser that supports Web Audio.') }
  }
  function select(value: number) {
    pause()
    elapsed.current = 0
    setPosition(0)
    setHz(value)
  }
  function seek(value: number) {
    elapsed.current = value
    setPosition(value)
    if (engine.current) engine.current.start = engine.current.context.currentTime - value
    if (value >= duration) pause()
  }
  function changeVolume(value: number) {
    setVolume(value)
    if (engine.current && active.current) engine.current.gain.gain.setTargetAtTime(value / 100 * .2, engine.current.context.currentTime, .03)
  }
  useEffect(() => {
    const timer = window.setInterval(() => {
      const audio = engine.current
      if (!audio || !active.current) return
      elapsed.current = Math.min(duration, audio.context.currentTime - audio.start)
      setPosition(elapsed.current)
      if (elapsed.current >= duration) pause()
    }, 250)
    const stopForMedia = (event: Event) => { if (event.target instanceof HTMLMediaElement) pause() }
    document.addEventListener('play', stopForMedia, true)
    const stopOnLeave = () => pause()
    window.addEventListener('pagehide', stopOnLeave)
    return () => {
      clearInterval(timer)
      document.removeEventListener('play', stopForMedia, true)
      window.removeEventListener('pagehide', stopOnLeave)
      const audio = engine.current
      engine.current = null
      if (audio) { audio.oscillator.stop(); void audio.context.close() }
    }
  }, [])
  return { hz, playing, position, volume, error, toggle, select, seek, changeVolume }
}
