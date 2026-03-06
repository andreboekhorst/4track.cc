import { browser } from "$app/environment"

const soundPaths = {
  stop: "/fx/stop.wav",
  ffwd: "/fx/ffwd.wav",
  pause: "/fx/pause.wav",
  play: "/fx/play.wav",
  track: "/fx/track.wav",
  counter: "/fx/counter.wav",
  record: "/fx/record.wav",
}

type SoundKey = keyof typeof soundPaths

let ctx: AudioContext
const buffers: Map<SoundKey, AudioBuffer> = new Map()
const loops: Map<SoundKey, AudioBufferSourceNode> = new Map()

async function getBuffer(key: SoundKey): Promise<AudioBuffer> {
  if (!ctx) ctx = new AudioContext()
  if (buffers.has(key)) return buffers.get(key)!

  const response = await fetch(soundPaths[key])
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
  buffers.set(key, audioBuffer)
  return audioBuffer
}

export async function playFx(key: SoundKey, volume = 0.025) {
  if (!browser) return
  const buffer = await getBuffer(key)
  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  source.buffer = buffer
  gain.gain.value = volume
  source.connect(gain).connect(ctx.destination)
  source.start()
}

export async function playLoop(key: SoundKey, volume = 0.025) {
  if (!browser) return
  stopLoop(key)
  const buffer = await getBuffer(key)
  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  source.buffer = buffer
  source.loop = true
  gain.gain.value = volume
  source.connect(gain).connect(ctx.destination)
  source.start()
  loops.set(key, source)
}

export function stopLoop(key: SoundKey) {
  if (!browser) return
  const source = loops.get(key)
  if (source) {
    source.stop()
    loops.delete(key)
  }
}
