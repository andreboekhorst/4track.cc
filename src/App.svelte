<script lang="ts">
  import FourTrack from "$lib/components/FourTrack.svelte"
</script>

<div class="align">
  <FourTrack />
</div>

<style>
  :global(*) {
    box-sizing: border-box;
    outline: none;
    -webkit-user-select: none;
    user-select: none;
  }

  :global(html) {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
    overscroll-behavior: none;
  }

  :global(body) {
    font-family: system-ui, sans-serif;
    margin: 0;
    min-height: 100dvh;
    background: radial-gradient(ellipse at top left, #f2f5f7, #b2b6bc);
    overflow: hidden;
    overscroll-behavior: none;
    touch-action: none;
    height: 100%;
    padding: env(safe-area-inset-top) env(safe-area-inset-right)
      env(safe-area-inset-bottom) env(safe-area-inset-left);
    &:before {
      content: " ";
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      background: url("/noise_50.jpg");
      background-size: 125px;
      mix-blend-mode: multiply;
      opacity: 0.5;
      z-index: -1;
    }
  }

  .align {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100dvh;
  }
</style>
