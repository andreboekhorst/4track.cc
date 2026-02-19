<!-- svelte-ignore a11y_role_has_required_aria_props -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
    let value = $state(0);     // 0–100
    let dragging = $state(false);
    let trackEl = $state();

    const start = (event) => {
        dragging = true;
        event.target.setPointerCapture(event.pointerId);
    }

    const move = (event) => {
        if (!dragging) return;
        const rect = trackEl.getBoundingClientRect();
        const x = event.clientY - rect.top;

        const percent = Math.max(0, Math.min(x / rect.height, 1));
        value = Math.round(percent * 100);
    }

    const stop = (event) => {
        dragging = false;
        event.target.releasePointerCapture?.(event.pointerId);
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
    onpointerdown={start}
    style="top: {value}%"
  ></div>
</div>

<p>Value: {value}</p>

<style>
  .track {
    width: 10px;
    height: 300px;
    background: #ddd;
    position: relative;
    border-radius: 5px;
  }

  .thumb {
    width: 20px;
    height: 20px;
    background: red;
    border-radius: 50%;
    position: absolute;
    top: 0%;
    left: 5px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
</style>
