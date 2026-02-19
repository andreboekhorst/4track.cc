<script lang="ts">
	import type { AudioEngine } from '$lib';

	let { engine }: { engine: AudioEngine } = $props();
</script>

<div class="mixer">
	{#each engine.tracks as track, i}
		{#if !track.hidden}
			<div class="channel-strip">
				<span class="channel-label">Track {i + 1}</span>
				<label>
					Vol
					<input
						type="range"
						min="0"
						max="1.5"
						step="0.01"
						value={track.volume}
						oninput={(e) => engine.setTrackVolume(i, Number(e.currentTarget.value))}
					/>
				</label>
				<label>
					Pan
					<input
						type="range"
						min="-1"
						max="1"
						step="0.01"
						value={track.pan}
						oninput={(e) => engine.setTrackPan(i, Number(e.currentTarget.value))}
					/>
				</label>
				<span class="channel-level">{track.level}</span>
			</div>
		{/if}
	{/each}
</div>

<div class="master">
	<label class="master-label">
		Master Vol
		<input
			type="range"
			min="0"
			max="1.5"
			step="0.01"
			value={engine.masterVolume}
			oninput={(e) => engine.setMasterVolume(Number(e.currentTarget.value))}
		/>
	</label>
</div>

<style>
	.mixer {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid #333;
	}

	.channel-strip {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background: #222;
		border-radius: 6px;
		min-width: 80px;
	}

	.channel-label {
		font-size: 0.75rem;
		color: #aaa;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.channel-strip label {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 0.7rem;
		color: #888;
		gap: 0.2rem;
	}

	.channel-strip input[type='range'] {
		width: 70px;
		accent-color: #6cf;
	}

	.channel-level {
		font-size: 0.85rem;
		font-variant-numeric: tabular-nums;
		color: #6cf;
		min-width: 2ch;
		text-align: center;
	}

	.master {
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid #333;
		text-align: center;
	}

	.master-label {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: #aaa;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.master-label input[type='range'] {
		width: 120px;
		accent-color: #6cf;
	}
</style>
