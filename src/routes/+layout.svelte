<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		font-family: system-ui, sans-serif;
		margin: 0;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #1d1d1d;
		color: #eee;
	}
</style>
