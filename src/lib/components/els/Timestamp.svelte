<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_missing_attribute -->
<script lang="ts">
  let { timestamp } = $props()
  import { playFx } from "$lib/fx/soundfx"
  import DigitRoller from "./DigitRoller.svelte"

  let correction = $state(0)
  function count_to_str(nr: number) {
    var cor_nr = Math.floor(nr - correction)
    if (cor_nr < 0) cor_nr += 1000

    if (cor_nr > 99) {
      return cor_nr.toString()
    } else if (cor_nr > 9) {
      return "0" + cor_nr.toString()
    } else {
      return "00" + cor_nr.toString()
    }
  }

  function get_digit(nr, i) {
    return count_to_str(nr).charAt(i)
  }

  function reset() {
    playFx("counter")
    correction = timestamp
  }
</script>

<!-- <div>{count_to_str(timestamp)}</div> -->

<div class="wrapper">
  <div class="counter">
    <a onmousedown={() => reset()}>&nbsp;</a>
    <div class="number-ticker">
      <DigitRoller digit={get_digit(timestamp, 0)} />
      <DigitRoller digit={get_digit(timestamp, 1)} />
      <DigitRoller digit={get_digit(timestamp, 2)} />
    </div>
  </div>
</div>

<style lang="scss">
  .number-ticker {
    display: flex;
    height: 17cqw;
    overflow: hidden;
    .index {
    }
  }

  .wrapper {
    container-type: size;
    height: 8cqh;
    aspect-ratio: 180 / 80;
  }
  .counter {
    padding: 15.2cqw 17cqh 13.8cqw;
    color: rgb(216, 216, 216);
    background-image: url("/counter_bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 100cqw;
    height: 100cqh;
    position: relative;
    user-select: none;

    box-sizing: border-box;
  }
  a {
    width: 11cqw;
    height: 25cqh;
    background-color: rgb(34, 34, 34);
    border-radius: 50%;
    position: absolute;
    right: 16.7cqw;
    top: 50%;
    transform: translateY(-15cqh);
    cursor: pointer;
    box-shadow:
      6cqw 15cqh 5.5cqw rgba(0, 0, 0, 0.8),
      inset 1cqw 2.5cqh 1.7cqw rgba(255, 255, 255, 0.4);

    &:active {
      box-shadow:
        5.5cqw 13.75cqh 6cqw rgba(0, 0, 0, 0.8),
        inset 1cqw 2.5cqh 1.7cqw rgba(255, 255, 255, 0.4);
    }
  }
</style>
