<script lang="ts">
  let count: number = $state(0)
  const increment = () => {
    count += 1
  }
</script>

<div class="counter">
  xx
  <button onclick={increment}>
    count is {count}
  </button>
</div>

<style>
  .counter {
    background-image: url("/btn_normal.png");
  }
</style>
