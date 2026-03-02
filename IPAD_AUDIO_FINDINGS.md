# iPad Safari Web Audio Findings

Investigation into why recording on iPad produces very soft audio and no monitoring,
while native apps (Voice Memos) work fine with the same headset.

## Issues Reported

1. **Very low recording volume on iPad** — recordings are nearly silent
2. **No self-monitoring on iPad** — can't hear yourself through headset while recording
3. **Both work fine on MacBook Pro** with the same headset and same app code

## Root Causes Found

### 1. iOS Safari "Raw" Audio Mode Delivers ~40dB Less Signal

When `getUserMedia` is called with `echoCancellation: false` and `noiseSuppression: false`,
iOS Safari switches to a "raw" audio input mode that provides an extremely weak signal.

**Diagnostic measurements (raw mic peak levels):**

| Constraints                          | iPad Signal Level | Result          |
|--------------------------------------|-------------------|-----------------|
| `echoCancellation: false, noiseSuppression: false` | -57 to -73 dB | Unusable (silence) |
| `echoCancellation: true, noiseSuppression: true`   | -25 to -33 dB | Usable volume      |
| `echoCancellation: true, noiseSuppression: false`   | ~-25 to -33 dB | Usable volume, bad quality |
| `echoCancellation: false, noiseSuppression: true`   | -57 to -73 dB | Still unusable     |

**Conclusion:** `echoCancellation: true` is the specific constraint that triggers iOS Safari's
high-gain "voice processing" audio mode. Without it, the signal is 40-50 dB too low.
`noiseSuppression` and `autoGainControl` alone do NOT trigger the gain boost.

Native apps (Voice Memos etc.) use iOS's AVAudioSession voice processing mode by default,
which is why they get proper gain levels.

### 2. Echo Cancellation Degrades Audio Quality and Adds Latency

Enabling `echoCancellation: true` fixes the volume but:
- Adds significant processing latency (unsuitable for music recording)
- Degrades audio quality (tuned for voice, destroys music)
- `noiseSuppression: true` further degrades quality with no volume benefit

### 3. AudioWorklet Output Routing Unreliable on iOS Safari

The original monitoring path relied on the AudioWorklet's pass-through
(`worklet.connect(ctx.destination)`). iOS Safari has known issues with
AudioWorklet output routing — the worklet captures PCM correctly but its
audio output may not reach the speakers/headphones.

### 4. Default Gain Chain Was Too Aggressive

The original signal chain attenuated the mic signal to 15% before recording:
- Trim default (-1) → `gainMin: 0.2` (80% reduction)
- Recording volume → `0.75` (25% reduction)
- Combined: `0.2 x 0.75 = 0.15` (85% total reduction)

On Mac this was tolerable (strong hardware input), on iPad it was devastating.

### 5. All iOS Browsers Use WebKit

Chrome, Firefox, Edge on iPad are all WebKit under the hood (Apple requirement).
They all share the same Web Audio API limitations as Safari. There is no
browser-level workaround on iOS.

## Changes Made

### Confirmed fixes (implemented):

1. **Removed forced `sampleRate: 48000`** from AudioContext and getUserMedia
   - iPad natively runs at 44100 Hz; forcing 48000 caused silent failures
   - Recording/merge code already used `ctx.sampleRate` (actual rate)
   - Project export now saves actual `ctx.sampleRate` instead of config value

2. **Added parallel monitoring path** bypassing AudioWorklet
   - Signal now splits: `recVolNode → worklet` (recording) AND `recVolNode → monitorGainNode → destination` (monitoring)
   - Uses standard GainNode → destination path that iOS handles reliably
   - Worklet still captures PCM correctly, just doesn't route to speakers

3. **Raised `gainMin` from 0.2 to 0.5** in trim configuration
   - Default combined gain: 0.375 (was 0.15)
   - Less aggressive attenuation on all platforms

4. **iOS-specific 100x input gain boost**
   - Detects iOS via user agent + `maxTouchPoints > 1`
   - Sets `inputGainNode.gain.value = 100` on iOS (vs 1.0 on desktop)
   - Compensates for the ~40dB deficit in raw audio mode
   - Preserves clean audio quality (no echo cancellation artifacts)
   - Preserves low latency (no voice processing overhead)

5. **Wired the volume Slider** to `engine.setRecordingVolume()`
   - Was previously a bare `<Slider />` with no binding
   - Now controls recording volume in real time (0-100 mapped to 0.0-1.0)

6. **Audio constraints set to raw mode** (`echoCancellation: false, noiseSuppression: false, autoGainControl: false`)
   - Best audio quality for music recording
   - Combined with iOS gain boost to compensate for low signal

## Known Remaining Limitations

### Latency for Multi-Track Overdubbing on iPad

Even with low-latency raw mode, iOS Web Audio has inherent round-trip latency
(typically 20-50ms). This causes timing drift when overdubbing tracks:

- The current `measureRecordLatency()` falls back to 30ms on iOS (API properties
  `outputLatency` and `audioTrack.getSettings().latency` are likely unavailable)
- Actual latency may differ, causing tracks to be slightly out of sync

### Recommendations for Future Work

1. **Latency calibration** — Implement an audio loopback test that plays a click
   and measures when it arrives back through the mic. This gives the true
   round-trip latency for accurate compensation.

2. **Manual latency offset** — Add a user-adjustable latency compensation slider
   so users can fine-tune track alignment by ear.

3. **Optional monitoring toggle** — If the headset has hardware direct monitoring,
   the software monitoring path just adds a delayed copy. Let users disable it.

4. **Platform-specific constraint profiles** — If iOS ever improves its raw audio
   mode gain levels, the 100x boost could be reduced. Consider making the boost
   factor configurable or auto-calibrating based on measured input levels.

5. **Native app consideration** — For truly low-latency multi-track recording on
   iPad, a native iOS app using AVAudioEngine would bypass all WebKit limitations.
   The web app works well for single-track recording and playback on iPad, and
   for full multi-track workflows on desktop.

## Diagnostic Code

A temporary diagnostic was added to `engine.svelte.ts` that logs raw mic peak
levels during recording (first 10 seconds). This should be removed before
production deployment:

```typescript
// Diagnostic: measure raw mic level before any gain processing
const diagAnalyser = ctx.createAnalyser()
// ... logs [audio-diag] raw mic peak: X.XXXX (Y.Y dB) | ctx.sampleRate: Z | ctx.state: S
```
