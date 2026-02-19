<!-- svelte-ignore a11y_no_static_element_interactions -->
<script lang="ts">
    import Button from './Button.svelte';
    import { onDestroy } from 'svelte';

    let btns = $state([
        { type: "rec", pressed: false  },
        { type: "play", pressed: false  },
        { type: "rew", pressed: false  },
        { type: "fwd", pressed: false  },
        { type: "stop", pressed: false  },
        { type: "pause", pressed: false  },
    ])

    let counter = $state(0)
    let isPaused = $state(false) 
    let isRecording = $state(false) 
    let timer: ReturnType<typeof setInterval> | undefined;

    onDestroy(() => {
		clearInterval(timer);
	});

    function setPlayback(on: boolean, speed: number = 1){
        if( on ){
            clearInterval(timer);
            timer = setInterval(() => {
                // FFWD / RWD are not effected by pausing.
                if( isPaused && speed == 1  ) return;
                counter = Math.max(0, counter + speed);
            }, 1)
        
        } else {
            clearInterval(timer);
        }
    }

    function clicky(btnType: string) {

        function press(types: Array<string>) {
            btns.forEach(btn => {
                if (types.includes(btn.type)) btn.pressed = true;
            });
        }

        function unpress(types: Array<string>) {
            btns.forEach(btn => {
                if (types.includes(btn.type)) btn.pressed = false;
            });
        }

        function toggle(types: Array<string>) {
            btns.forEach(btn => {
                if (types.includes(btn.type)) btn.pressed = !btn.pressed;
            });
        }

        if( btnType === "rec"){
            press(["rec", "play"])
            setPlayback(true);
            isRecording = true;
        }
        
        if( btnType === "play"){
            unpress(["rew", "fwd"])
            press(["play"]);
            setPlayback(true);
        }

        if( btnType === "stop"){
            unpress(["rec", "play", "rew", "fwd"])
            setPlayback(false, 0);
            isRecording = false;
        }

        if( btnType === "rew"){
            press(["rew"])
            unpress(["rec", "play", "fwd"])
            setPlayback(true, -4);
        }

        if( btnType === "fwd"){
            press(["fwd"])
            unpress(["rec", "play", "rew"])
            setPlayback(true, 4);
        }

        if( btnType === "pause"){
            toggle(["pause"])
            isPaused = !isPaused
        }

    }

</script>

<div class="recorder">
    {counter} <br /> Paused: { isPaused } <br > Recording: {isRecording }
    {#each btns as btn}
        <Button type={ btn.type } pressed={ btn.pressed } onClick={ () => clicky(btn.type) } />
    {/each}
</div>

<style>

</style>