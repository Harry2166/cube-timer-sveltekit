
<script lang="ts">
	import { createTimer } from "./state.svelte"
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	import { onMount } from "svelte";
	import Navbar from './Navbar.svelte'
	const time = createTimer();
	let timerStart: boolean = $state(false)
	let timeAtStart: number = 0
	let timeAtEnd: number = 0
	let scramble: string = $state("")
	let eventString: string = $state("333")
	
	$effect(() => {
		if (timerStart) {
			timeAtStart = new Date().getTime()
		} 
	})

	async function handleKeyUp(event: KeyboardEvent) {
		if (event.key == " ") {
			if (!timerStart) {
				time.reset()
			}
			timerStart = !timerStart
		}
	}
	
	async function handleKeyDown(event: KeyboardEvent) {
		if (event.key == " ") {
			if (timerStart) {
				timeAtEnd = new Date().getTime()
				await time.updateScrambleDB(timeAtStart, timeAtEnd, data.user.id, scramble, eventString)
				await fetchScrambleForEvent(eventString)
			}
		}
	}

    async function fetchScrambleForEvent(event: string): Promise<void> {
        const { randomScrambleForEvent } = await import('https://cdn.cubing.net/v0/js/cubing/scramble');
        const result = await randomScrambleForEvent(event);
        scramble = result.toString(); 
    }

	const changeEvent = (eventChosen: string) => {
		eventString = eventChosen
	}

    onMount(async () => {
        await fetchScrambleForEvent(eventString);
    });

</script>
<Navbar name={data.user.username} user_id={data.user.id} {scramble}></Navbar>
<h1>Cube Timer Made With SvelteKit</h1>
<h2>Welcome {data.user.username}!</h2>
<button onclick={() => changeEvent("333")}>3x3</button>
<button onclick={() => changeEvent("444")}>4x4</button>
<!-- <div>Scramble: {scramble} </div> -->
<form>
	<button onclick={async () => {await fetchScrambleForEvent(eventString)}}>New Scramble</button>
</form>
<div>The timer has started: {timerStart}</div>
{#if !timerStart}
	<div>Time: {time.value.minutes}:{time.value.seconds}:{time.value.miliseconds}</div>
{:else}
	<div>You are solving...</div>
{/if}
<form method="post" action="?/logout">
	<button>Sign out</button>
</form>
<svelte:window onkeyup={handleKeyUp} onkeydown={handleKeyDown} />