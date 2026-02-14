# 4-Track Recorder -- Trim Implementation Overview

## Goal

Implement an input **Trim** control that behaves like an analog preamp
(Line ↔ Mic), where the gain, saturation, and tonal coloration are
**printed into the recording** and cannot be adjusted afterward.

The Trim control exists at the **input stage**, not per track.

------------------------------------------------------------------------

## Signal Flow Architecture

The implemented signal chain during recording:

    MediaStreamSource
    → inputGain (clean utility gain)
    → trimGain (preamp drive)
    → waveShaper (soft saturation)
    → recorder worklet

During playback:

    trackBuffer
    → trackGain (volume fader)
    → pan
    → masterGain
    → destination

Important:

-   Trim affects **only live input**
-   Recorded audio already contains the distortion/compression
-   Changing Trim after recording does NOT affect existing tracks

------------------------------------------------------------------------

## What Trim Does

Trim is not just volume.

It controls:

1.  **Preamp Gain** (how hard the signal is pushed)
2.  **Saturation Intensity** (nonlinear soft clipping)

Conceptually:

-   Low Trim (LINE) → clean signal
-   Mid Trim → mild warmth and soft compression
-   High Trim (MIC) → audible harmonic distortion and peak rounding

This mimics how a cassette 4-track behaves when driven harder.

------------------------------------------------------------------------

## Implementation Details

### Trim Slider Range

Slider value: `-1 to 1`

Mapped to normalized range:

    norm = (sliderValue + 1) / 2  // 0 to 1

------------------------------------------------------------------------

### Trim Gain Scaling

Adjusted to a musically balanced range:

``` ts
trimGainNode.gain.value = 0.9 + norm * 4.0;
```

Effective range:

-   LINE ≈ 0.9x
-   MID ≈ 2.9x
-   MIC ≈ 4.9x

------------------------------------------------------------------------

### Saturation Curve Strength

Adjusted for realistic but controlled distortion:

``` ts
const k = 3 + intensity * 20;
curve[i] = Math.tanh(k * x);
```

Oversampling enabled:

``` ts
waveShaperNode.oversample = "4x";
```

This provides:

-   Smooth soft clipping
-   Harmonic generation
-   No harsh digital clipping
-   Reduced aliasing

------------------------------------------------------------------------

## Design Principles Followed

-   No hard digital clipping
-   No post-record trim adjustments
-   Clear separation between:
    -   Input tone shaping (Trim)
    -   Track mixing (Volume)
-   Saturation increases gradually and musically
-   Maximum Trim is gritty but usable --- not destructive

------------------------------------------------------------------------

## Result

The Trim control now behaves like a real 4-track preamp:

-   Subtle at low settings
-   Warm and compressed in the middle
-   Driven and harmonically rich at high settings

All coloration is permanently printed into the recorded track.
