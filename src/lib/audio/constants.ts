// Default configuration and constraints for the audio engine.

import type { AudioEngineConfig } from '../types.js';

export const PLAYBACK_TICK_MS = 50;

export const DEFAULT_CONFIG: AudioEngineConfig = {
  sampleRate: 48000,
  bitDepth: 16,
  maxSeconds: 180,
  trackCount: 4,
  workletUrl: 'recorder-worklet.js',
  inputFx: [
    {
      type: 'trim',
      enabled: true,
      default: -1,
      gainMin: 0.2,
      gainRange: 1,
      curveBase: 0.8,
      curveRange: 8,
    },
  ],
};

export const AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: false,
  noiseSuppression: false,
  autoGainControl: false,
  latency: { ideal: 0 },
} as MediaTrackConstraints;
