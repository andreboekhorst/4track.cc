<script lang="ts">
    import { fade, fly } from 'svelte/transition';
	
    let { desc, done = $bindable(), ondelete} = $props();
</script>

<main>
    <li class:completed={done} transition:fade>
    <input type="checkbox" bind:checked={ done }> 
        { desc } - <em onclick={ () => ondelete() }>del</em>
    </li>
</main>

<style>
  .completed{
    opacity: .5;
    text-decoration: line-through;
  }
</style>
