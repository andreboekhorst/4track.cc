# Changelog

## Fix: Inter-track latency caused by `mergeRecordingIntoBuffer`

### Problem

After commit `e640a93` ("Allow override on timestamp"), recording on track 2 while track 1 plays back introduced an audible ~20ms delay between tracks that wasn't there before.

### Root Cause

The new `mergeRecordingIntoBuffer` function added a **silence prefix** (equal to the pipeline latency) to fresh track buffers. The old `buildBufferFromPCM` did not.

This mattered because `playOtherTracksForMonitoring` has a 20ms scheduling lookahead (`ctx.currentTime + 0.02`). The worklet starts recording ~20ms before the musician hears any monitoring audio, creating ~20ms of "dead time" at the start of every overdub recording.

- **Old buffer layout:** `[trimmed audio at position 0]` — during playback, `trimStart` skipped into actual audio (double-trim), which accidentally skipped past the 20ms dead time. Tracks sounded aligned.
- **New buffer layout:** `[silence prefix][trimmed audio]` — during playback, `trimStart` landed exactly at audio start (single-trim), preserving the 20ms dead time. Track 2 sounded late.

### Change

**File:** `app.ts`, line 294

```diff
  const punchInSample = Math.max(
    0,
-   Math.round((punchInSeconds + (existingBuffer ? existingTrim : latencySeconds)) * ctx.sampleRate)
+   Math.round((punchInSeconds + (existingBuffer ? existingTrim : 0)) * ctx.sampleRate)
  );
```

Also removed the now-unused `latencySeconds` parameter from the function signature and call site.

This restores the old buffer layout for fresh tracks (no silence prefix), so the double-trim compensation works again.
