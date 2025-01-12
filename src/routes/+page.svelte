
<script lang="ts">
	import { createTimer } from "./state.svelte"
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();  
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { onMount } from "svelte";
	import Navbar from './Navbar.svelte'
	import Footer from './Footer.svelte'
	import Timer from './Timer.svelte'
	const time = createTimer();
	let timerStart: boolean = $state(false)
	let timeAtStart: number = 0
	let timeAtEnd: number = 0
	let scramble: string = $state("")
	let eventString: string = $state("333")
	let activeClass = 'text-green-500 dark:text-green-300 hover:text-green-700 dark:hover:text-green-500';
	
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

	const changeEvent = async (eventChosen: string) => {
		console.log("event changed!")
		eventString = eventChosen
        await fetchScrambleForEvent(eventString);
	}

    onMount(async () => {
        await fetchScrambleForEvent(eventString);
    });

</script>
<Navbar username={data.user.username} user_id={data.user.id} {scramble}></Navbar>
<div class="flex items-center justify-center gap-4">
	<Button>Pick Event<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
	<Dropdown {activeClass}>
		<DropdownItem onclick={() => changeEvent("333")}>3x3</DropdownItem>
		<DropdownItem onclick={() => changeEvent("444")}>4x4</DropdownItem>
	</Dropdown>
	<Button onclick={async () => {await fetchScrambleForEvent(eventString)}}>New Scramble</Button>
</div>

<Timer {timerStart} {time} />
<svelte:window onkeyup={handleKeyUp} onkeydown={handleKeyDown} />
<Footer></Footer>