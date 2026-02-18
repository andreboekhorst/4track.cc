// Per-track reactive state. Each track owns its audio buffer,
// mixer settings, and the Web Audio nodes for its channel strip.

export class Track {
  volume = $state(0.5);
  pan = $state(0);
  level = $state(0);
  hasContent = $state(false);

  buffer: AudioBuffer | null = null;
  trimStart = 0;
  gainNode: GainNode | null = null;
  panNode: StereoPannerNode | null = null;
  analyserNode: AnalyserNode | null = null;
}
