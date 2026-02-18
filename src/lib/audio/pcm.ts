// PCM encoding for project file persistence.
// Converts between Float32 audio samples and compact integer formats.

export function quantizePCM(float32: Float32Array, bitDepth: number): ArrayBuffer {
  if (bitDepth === 32) {
    const out = new Float32Array(float32.length);
    out.set(float32);
    return out.buffer as ArrayBuffer;
  }

  if (bitDepth === 16) {
    const out = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out.buffer;
  }

  // 8-bit unsigned
  const out = new Uint8Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    out[i] = Math.round((s + 1) * 0.5 * 255);
  }
  return out.buffer;
}

export function dequantizePCM(data: ArrayBuffer, bitDepth: number): Float32Array {
  if (bitDepth === 32) return new Float32Array(data);

  if (bitDepth === 16) {
    const int16 = new Int16Array(data);
    const out = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      out[i] = int16[i] < 0 ? int16[i] / 0x8000 : int16[i] / 0x7fff;
    }
    return out;
  }

  // 8-bit unsigned
  const uint8 = new Uint8Array(data);
  const out = new Float32Array(uint8.length);
  for (let i = 0; i < uint8.length; i++) {
    out[i] = (uint8[i] / 255) * 2 - 1;
  }
  return out;
}
