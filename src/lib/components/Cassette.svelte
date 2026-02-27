<script lang="ts">
  let { speed, time, max, onchange, isRecording } = $props()
  let containerEl = $state()
  let dragging = $state(false)
  let startPos = $state()
  let _dragPercentage = $state(0)
  let xPos = $state()

  // should be disabled whern ffwding...

  function startDrag(e) {
    dragging = true
    _dragPercentage = 0
    xPos = e.clientX
    startPos = time
    // needed to keep tracking pointermove, even if it is outside
    e.target.setPointerCapture(e.pointerId)
  }

  const drag = (e) => {
    // trigggered continously
    if (!dragging) return
    if (isRecording) return
    if (speed > 1 || speed < 0) return //disable when ffwd

    const rect = containerEl.getBoundingClientRect()
    const xMove = e.clientX - xPos // it should be the difference from where it initially started.

    // never drag more than 1, altought we later also need to
    let _dragPercentage = xMove / rect.width / 8

    let _time = Math.max(0, Math.min(startPos + _dragPercentage * max, max))
    onchange?.(_time)
  }

  const stopDrag = (e) => {
    dragging = false
    e.target.releasePointerCapture?.(e.pointerId)
  }
</script>

<div class="casette">
  <div class="casette_1">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="casette_2"
      onpointerdown={startDrag}
      onpointermove={drag}
      onpointerup={stopDrag}
      onpointerleave={stopDrag}
      bind:this={containerEl}
    >
      <div class="inset">
        <div class="shadow"></div>
        <div class="rotaters">
          <div
            class="rotater rot1"
            style:transform={"rotate(" + (time * 270) / 10 + "deg)"}
          ></div>
          <div
            class="rotater rot2"
            style:transform={"rotate(" + (time * 180) / 10 + "deg)"}
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .casette_2 {
    background-color: #212124;
    border-radius: 4px;
    width: 85%;
    margin: 100px auto;
    padding: 10px 0;
    position: relative;
    cursor: ew-resize;

    &:active {
      cursor: col-resize;
    }

    &:before {
      position: absolute;
      content: " ";
      display: block;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: linear-gradient(-45deg, #000000 60%, #ffffff 61%);
      z-index: 100;
      opacity: 0.1;
      mix-blend-mode: screen;
      border-radius: 5px;
    }
  }

  .casette {
    height: auto;
    width: calc(100% - 20px);
    border: 3px solid #1c1c1f;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-left: 20px;
    box-shadow: inset 1px 1px 0px 0px rgb(136 132 132);

    .inset {
      background: url("/tape.jpg");
      background-size: 125%;
      background-position: -40px -115px;
      border-radius: 10px;
      width: 340px;
      height: 60px;
      position: relative;
      margin: 0 auto;
    }

    .shadow {
      position: absolute;
      width: 100%;
      height: 100%;
      box-shadow:
        inset 1px 1px 0px 0px rgb(0 0 0),
        inset 40px 20px 20px rgb(0 0 0 / 95%),
        inset -5px -10px 10px rgb(0 0 0 / 25%),
        inset -1px -1px 1px 0px rgba(255, 255, 255, 0.25);
      border: 1px solid #171718;
      z-index: 1;
      border-radius: 5px;
    }
    .rotaters {
      display: flex;
      gap: 80px;
      overflow: hidden;
      height: 60px;
      justify-content: center;
    }
    .rotater {
      background-color: red;
      width: 80px;
      height: 80px;
      background: url("/rotator.png");
      background-size: contain;
      background-repeat: no-repeat;
      margin-top: -10px;
    }
    /* .rot1 {
      animation: spin 4s linear infinite;
    }
    .rot2 {
      animation: spin 12s linear infinite;
    } */
    /* .paused {
      animation-play-state: paused !important;
    } */
  }

  /* @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  } */
</style>
