
<script lang="ts">
	import { createTimer } from "./state.svelte";
	const time = createTimer();
	let timerStart: boolean = $state(false)
	let timeAtStart: number = 0
	let timeAtEnd: number = 0

	function handleKeyUp(event: KeyboardEvent) {
		if (event.key == " ") {
			if (!timerStart) {
				time.reset()
			}
            timerStart = !timerStart
		}
	}

	$effect(() => {
		if (timerStart) {
			timeAtStart = new Date().getTime()
		} else {
			timeAtEnd = new Date().getTime()
			time.setTime(timeAtStart, timeAtEnd)
		}
	})

</script>

<h1>Cube Timer Made With SvelteKit</h1>
<div>The timer has started: {timerStart}</div>
{#if !timerStart}
	<div>Time: {time.value.minutes}:{time.value.seconds}:{time.value.miliseconds}</div>
{:else}
	<div>You are solving...</div>
{/if}
<svelte:window onkeyup={handleKeyUp} />