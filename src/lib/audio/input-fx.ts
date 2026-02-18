// Input effects chain: trim gain and waveshaper saturation.
// Built fresh for each recording session, torn down on stop.

import type { TrimFxConfig } from '../types.js';

// Generate a tanh-based saturation curve for the WaveShaper node.
// Higher intensity = more harmonic coloring / warmth.
function makeSaturationCurve(intensity: number, curveBase: number, curveRange: number): Float32Array {
  const n = 8192;
  const curve = new Float32Array(n);
  const k = curveBase + intensity * curveRange;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = x + (Math.tanh(k * x) - x) * intensity;
  }
  return curve;
}

export interface InputFxChainResult {
  nodes: AudioNode[];
  trimGainNode: GainNode | null;
  waveShaperNode: WaveShaperNode | null;
}

// Build the audio node chain for all enabled input effects.
// Returns the nodes in signal-flow order plus handles to the
// trim/saturation nodes for later parameter updates.
export function buildInputFxChain(
  ctx: AudioContext,
  config: TrimFxConfig[],
  trimValue: number,
): InputFxChainResult {
  let trimGainNode: GainNode | null = null;
  let waveShaperNode: WaveShaperNode | null = null;
  const nodes: AudioNode[] = [];

  for (const fx of config) {
    if (!fx.enabled) continue;
    if (fx.type === 'trim') {
      trimGainNode = ctx.createGain();
      waveShaperNode = ctx.createWaveShaper();
      waveShaperNode.oversample = '4x';
      applyTrim(trimValue, fx, trimGainNode, waveShaperNode);
      nodes.push(trimGainNode, waveShaperNode);
    }
  }

  return { nodes, trimGainNode, waveShaperNode };
}

// Update trim gain and saturation curve from a slider value (-1 to 1).
export function applyTrim(
  sliderValue: number,
  cfg: TrimFxConfig,
  trimGainNode: GainNode | null,
  waveShaperNode: WaveShaperNode | null,
): void {
  const norm = (sliderValue + 1) / 2; // -1..1 → 0..1
  if (trimGainNode) {
    trimGainNode.gain.value = cfg.gainMin + norm * cfg.gainRange;
  }
  if (waveShaperNode) {
    waveShaperNode.curve = makeSaturationCurve(norm, cfg.curveBase, cfg.curveRange);
  }
}
