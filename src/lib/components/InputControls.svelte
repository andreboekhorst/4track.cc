<script lang="ts">
  import type { AudioEngine } from "$lib"
  import SlideSelect from "./els/SlideSelect.svelte"
  import Slider from "./els/Slider.svelte"
  import Knob from "./els/Knob.svelte"
  let {
    engine,
    selectedTrack = $bindable(),
  }: { engine: AudioEngine; selectedTrack: number } = $props()
</script>

<div class="trim-knob" style="grid-area: 1 / 6 / 2 / 7">
  <Knob
    min={-1}
    max={1}
    bind:value={engine.trimValue}
    onchange={(trim) => engine.setTrim(trim)}
    labelLeft="LINE"
    labelRight="MIC"
    color="red"
  />
</div>

<div class="sliders" style="grid-area: 2 / 6 / 6 / 7">
  <Slider />
</div>

<div class="label" style="grid-area: 6 / 6 / 7 / 7">
  <span class="ui-label">Input</span>
</div>

<style>
  /* .track-label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    color: #aaa;
  }

  .track-select {
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: 1px solid #444;
    border-radius: 4px;
    background: #333;
    color: #eee;
    cursor: pointer;
  }

  .sliders {
    display: flex;
    height: 30cqw;
    justify-content: center;

    div {
      width: 50%;
      justify-content: center;
      align-items: center;
      display: flex;
    }
  } */

  /* .row {
  }
  .trim-knob {
    height: 10cqw;
  }

  .slideSelect {
    padding-top: 50%;
  }
  .label {
    text-align: center;
  } */
</style>
