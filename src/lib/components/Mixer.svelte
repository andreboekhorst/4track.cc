<script lang="ts">
	import type { AudioEngine } from '$lib';
	import Knob from './els/Knob.svelte'
	let { engine }: { engine: AudioEngine } = $props();

	let mVolume = $state(0)
</script>

<div class="mixer">
	{#each engine.tracks as track, i}
		{#if !track.hidden}
			<div class="channel-strip">
				<!-- <span class="channel-label">Track {i + 1}</span> -->
				<div class="knob-holder">
					<!-- <input
						type="range"
						min="0"
						max="1.5"
						step="0.01"
						value={track.volume}
						oninput={(e) => engine.setTrackVolume(i, Number(e.currentTarget.value))}
					/> -->
					<Knob min={ 0 } max={ 1.5 } bind:value={ track.volume } onchange={(vol) => engine.setTrackVolume(i,vol) }/>
				</div>
				<div class="knob-holder">
					<!-- <input
					type="range"
					min="-1"
					max="1"
					step="0.01"
					value={track.pan}
					oninput={(e) => engine.setTrackPan(i, Number(e.currentTarget.value))}
					/> -->
					<Knob 
						min={ -1 } 
						max={ 1 } 
						bind:value={ track.pan } 
						onchange={(pan) => engine.setTrackPan(i,pan) }
						labelLeft="L"
						labelRight="R"
					/>
				</div>
				<!-- <span class="channel-level">{track.level}</span> -->
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
		O{ Math.floor( engine.masterVolume * 100) }O
		<Knob min={ 0 } max={ 1.5 } value={ engine.masterVolume } onchange={(vol) => engine.setMasterVolume(vol)}/>
	</label>
</div>

<style>


	.channel-strip {
		display: flex;
		/* flex-direction: column; */
		align-items: center;
		gap: 20px;
		padding: 30px;
	}

	.knob-holder{
		width: 70px;
		height: 70px;
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
