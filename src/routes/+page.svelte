<script lang="ts">
	import { AudioEngine } from '$lib';
	import { onMount } from 'svelte';
	import InputControls from '$lib/components/InputControls.svelte';
	import Transport from '$lib/components/Transport.svelte';
	import Mixer from '$lib/components/Mixer.svelte';

	let engine: AudioEngine | null = $state(null);
	let selectedTrack = $state(0);
	let fileInput = $state<HTMLInputElement>(undefined!);

	onMount(() => {
		engine = new AudioEngine({
			hiddenTracks: [{ url: 'casette_hiss.opus', volume: 0.08 }]
		});
		engine.initAudioContext();
		return () => engine?.dispose();
	});

	function handleSave() {
		if (!engine) return;
		const blob = engine.exportProject();
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'recording.4trk';
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleLoad() {
		fileInput?.click();
	}

	function handleFileChange() {
		const file = fileInput?.files?.[0];
		if (file && engine) {
			engine.importProject(file);
			fileInput.value = '';
		}
	}
</script>

<svelte:head>
	<title>4track – Record</title>
</svelte:head>

{#if engine}
	<div class="app">
		<div class="section"><Mixer {engine} /></div>
		<div class="section"><InputControls {engine} bind:selectedTrack /></div>
		<div class="section"><Transport {engine} {selectedTrack} /></div>
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
	.app {
		/* text-align: center; */
		background: rgb(63, 63, 63);
		/* padding: 10px; */
		border-radius: 20px;
		display: flex;
	}
	
	.section{
		flex-direction: column;
		
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
