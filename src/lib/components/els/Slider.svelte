<!-- svelte-ignore a11y_role_has_required_aria_props -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  let { value = $bindable(0), btnHeight = 0.15 } = $props() // value: 0–100, btnHeight: fraction of track
  let dragging = $state(false)
  let trackEl = $state()

  let topPercent = $derived((value / 100) * (1 - btnHeight) * 100)

  const start = (event) => {
    dragging = true
    event.target.setPointerCapture(event.pointerId)
  }

  const move = (event) => {
    if (!dragging) return
    const rect = trackEl.getBoundingClientRect()
    const y = event.clientY - rect.top
    const adjusted_scrollarea = 1 - btnHeight
    const scrollHeight = rect.height * adjusted_scrollarea
    const percent = Math.max(0, Math.min(y / scrollHeight, 1))
    value = Math.round(percent * 100)
  }

  const stop = (event) => {
    dragging = false
    event.target.releasePointerCapture?.(event.pointerId)
  }
</script>

<div
  bind:this={trackEl}
  class="track"
  onpointermove={move}
  onpointerup={stop}
  onpointerleave={stop}
  role="slider"
>
  <div
    class="thumb"
    class:dragging
    onpointerdown={start}
    style="top: {topPercent}%; height: {btnHeight * 100}%"
  ></div>
</div>

<style>
  .track {
    width: 10px;
    height: 300px;
    background: #272727;
    position: relative;
    border-radius: 5px;
  }

  .thumb {
    width: 20px;
    background: rgb(98, 98, 98);
    position: absolute;
    top: 0%;
    left: 5px;
    transform: translate(-50%, 0);
    cursor: grab;
  }
  .thumb.dragging {
    cursor: grabbing;
  }
</style>
