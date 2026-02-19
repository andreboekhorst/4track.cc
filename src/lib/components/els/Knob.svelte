<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
    let rotating = $state(false);
    // let rotation = $state(0);
    let rotationStart = $state(0)
    let rotationDelta = $state(0)
    let containerEl = $state();
    let yStart = $state()

    let { rotation = $bindable() } = $props();
    
    const startRotate = (e) => {
        rotating = true;
        rotationStart = rotation // is this copying the value or becoming a reference?
        rotationDelta = 0;
        yStart = e.clientY;
        e.target.setPointerCapture(e.pointerId);
    }

    const rotate = (e) => {
        if (!rotating) return;

        const rect = containerEl.getBoundingClientRect();
        const yMove = yStart - e.clientY; // it should be the difference from where it initially started.

        rotationDelta = yMove / rect.height / 4;
        rotation = Math.max(0, Math.min(rotationStart + rotationDelta, 0.75))
        console.log('the rotate', rotation)
    }

    const stopRotate = (e) => {
        rotating = false;
        e.target.releasePointerCapture?.(e.pointerId);
    }

</script>

<div>
    <div class="knobcontainer" 
        bind:this={containerEl}
        onpointermove={ rotate }
        onpointerup={stopRotate}
        onpointerleave={stopRotate}
        >
        <div class="knob"
            onpointerdown={startRotate}
            style="rotate: {rotation - 0.4}turn"
        >X</div>
    </div>
</div>

<style>
    .knobcontainer{
        width: 100px;
        height: 100px;
        display: block;
    }
    .knob{
        width: 100%;
        height: 100%;
        border-radius: 100%;
        background-color: red;
        /* rotate: 0.4turn; */
    }
</style>