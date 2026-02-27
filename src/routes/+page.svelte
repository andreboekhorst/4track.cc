<script lang="ts">
  import { AudioEngine } from "$lib"
  import { onMount } from "svelte"
  import InputControls from "$lib/components/InputControls.svelte"
  import Transport from "$lib/components/Transport.svelte"
  import Mixer from "$lib/components/Mixer.svelte"

  let engine: AudioEngine | null = $state(null)
  let selectedTrack = $state(0)
  let fileInput = $state<HTMLInputElement>(undefined!)

  onMount(() => {
    engine = new AudioEngine({
      hiddenTracks: [{ url: "casette_hiss.opus", volume: 0.08 }],
    })
    engine.initAudioContext()
    return () => engine?.dispose()
  })

  function handleSave() {
    if (!engine) return
    const blob = engine.exportProject()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "recording.4trk"
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleLoad() {
    fileInput?.click()
  }

  function handleFileChange() {
    const file = fileInput?.files?.[0]
    if (file && engine) {
      engine.importProject(file)
      fileInput.value = ""
    }
  }
</script>

<svelte:head>
  <title>4track – Record</title>
</svelte:head>

{#if engine}
  <div class="frame">
    <div class="app">
      <div class="parent">
        <Mixer {engine} />
        <InputControls {engine} bind:selectedTrack />
        <Transport {engine} {selectedTrack} />
      </div>
    </div>
  </div>

  <div class="file-controls">
    <button onclick={handleSave} disabled={!engine.hasContent}>Save</button>
    <button onclick={handleLoad}>Load</button>
    <input
      type="file"
      accept=".4trk"
      bind:this={fileInput}
      onchange={handleFileChange}
      hidden
    />
  </div>
{/if}

<style>
  .parent {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(7, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }

  .div1 {
    grid-area: 1 / 1 / 2 / 3;
  }
  .div2 {
    grid-area: 3 / 2 / 6 / 3;
  }

  .frame {
    container-type: size; /* Container Query */
    background: linear-gradient(to bottom, #616161, #3b3b3b);
    padding: 4px;
    border-radius: 12px 12px 40px 40px;
    aspect-ratio: 1 / 0.6;
    max-height: 80vh;
    max-width: 85nvw;
    margin: 0 auto;
  }
  .app {
    background:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.6'/%3E%3C/svg%3E"),
      radial-gradient(ellipse at top left, #686b71, #383840);
    background-blend-mode: multiply;
    border-radius: 10px 10px 36px 36px;
    display: flex;
    height: 100cqh;
    box-shadow:
      inset 1px 1px 4px rgba(255, 255, 255, 0.8),
      inset -2px -2px 4px rgba(0, 0, 0, 0.3);
  }

  .section {
    flex-direction: column;
    /* padding: 40px; */

    &.mixers {
      flex: 0.31;
    }

    &.input {
      flex: 0.225;
    }

    &.transport {
      flex: 0.465;
    }
  }

  .divider {
    align-self: stretch;
    /* flex: 1; */
    flex-direction: column;

    background: rgba(46, 46, 46, 0.5);
    border-right: 2px solid rgba(0, 0, 0, 0.7);
    border-right: 1px solid rgba(210, 210, 210, 0.4);
  }

  .file-controls {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: 1px solid #444;
    border-radius: 4px;
    background: #333;
    color: #eee;
    cursor: pointer;
  }

  button:hover:not(:disabled) {
    background: #444;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
