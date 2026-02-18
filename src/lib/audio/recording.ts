// Buffer construction and latency measurement for recordings.
// Handles latency trimming and punch-in/overdub merging.

// Measure round-trip audio latency from stream and context properties.
// Capped at 200ms; falls back to 30ms if nothing is reported.
export function measureRecordLatency(stream: MediaStream, ctx: AudioContext): number {
  let inputLatency = 0;
  const audioTrack = stream.getAudioTracks()[0];
  if (audioTrack) {
    const s = audioTrack.getSettings() as MediaTrackSettings & { latency?: number };
    if (typeof s.latency === 'number' && s.latency > 0) inputLatency = s.latency;
  }

  let outputLatency = 0;
  if (typeof (ctx as any).outputLatency === 'number') {
    outputLatency = (ctx as any).outputLatency;
  } else if (typeof ctx.baseLatency === 'number') {
    outputLatency = ctx.baseLatency;
  }

  const total = inputLatency + outputLatency;
  return total > 0 ? Math.min(total, 0.2) : 0.03;
}

// Concatenate PCM chunks into a single Float32Array, skipping
// the first `trimSamples` to compensate for round-trip latency.
function trimAndConcat(chunks: Float32Array[], trimSamples: number): Float32Array | null {
  const totalSamples = chunks.reduce((sum, c) => sum + c.length, 0);
  const length = Math.max(0, totalSamples - trimSamples);
  if (length === 0) return null;

  const result = new Float32Array(length);
  let offset = 0;
  let skip = trimSamples;

  for (const c of chunks) {
    if (skip > 0) {
      const take = Math.min(c.length, skip);
      skip -= take;
      if (skip === 0 && take < c.length) {
        result.set(c.subarray(take), offset);
        offset += c.length - take;
      }
    } else {
      result.set(c, offset);
      offset += c.length;
    }
  }

  return result;
}

// Merge a new recording into a track's existing buffer at a punch-in point.
// Preserves audio before and after the recorded region (A-B-C splice).
// If no existing buffer, creates a fresh one at the punch-in offset.
export function mergeRecordingIntoBuffer(
  ctx: AudioContext,
  chunks: Float32Array[],
  trimSamples: number,
  existingBuffer: AudioBuffer | null,
  existingTrimStart: number,
  punchInSeconds: number,
): AudioBuffer | null {
  const newPCM = trimAndConcat(chunks, trimSamples);
  if (!newPCM) return null;

  const punchInSample = Math.max(
    0,
    Math.round((punchInSeconds + (existingBuffer ? existingTrimStart : 0)) * ctx.sampleRate),
  );

  const existingLength = existingBuffer ? existingBuffer.length : 0;
  const resultLength = Math.max(existingLength, punchInSample + newPCM.length);
  const resultBuffer = ctx.createBuffer(1, resultLength, ctx.sampleRate);
  const resultChannel = resultBuffer.getChannelData(0);

  if (existingBuffer) {
    const existingData = existingBuffer.getChannelData(0);

    // Region A: existing audio before the punch-in point
    const regionAEnd = Math.min(punchInSample, existingLength);
    if (regionAEnd > 0) {
      resultChannel.set(existingData.subarray(0, regionAEnd));
    }

    // Region B: the new recording
    resultChannel.set(newPCM, punchInSample);

    // Region C: existing audio after the new recording ends
    const regionCStart = punchInSample + newPCM.length;
    if (regionCStart < existingLength) {
      resultChannel.set(existingData.subarray(regionCStart), regionCStart);
    }
  } else {
    resultChannel.set(newPCM, punchInSample);
  }

  return resultBuffer;
}
