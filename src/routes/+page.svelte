
<script lang="ts">
	import { createSolvesArr, createTimer } from "./state.svelte"
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();  
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { onMount } from "svelte";
	import Scramble from './Scramble.svelte';
	import Navbar from './Navbar.svelte'
	import Footer from './Footer.svelte'
	import Timer from './Timer.svelte'
	import { randomScrambleForEvent } from "cubing/scramble";
	import Statistics from "./Statistics.svelte";
	import Sidebar from "./Sidebar.svelte";

	let eventString: string = $state("333")
	const time = createTimer();
	const solves = createSolvesArr();
	solves.setSolves(data.solves)
	let reverseSolves = $derived([...solves.solvesToShow].reverse())
	let timerStart: boolean = $state(false)
	let spacebarPressed: boolean = $state(false)
	let timeAtStart: number = 0
	let timeAtEnd: number = 0
	let scramble: string = $state("")
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
			spacebarPressed = !spacebarPressed
		}
	}
	
	async function handleKeyDown(event: KeyboardEvent) {
		if (event.key == " ") {
			if (timerStart) {
				timeAtEnd = new Date().getTime()
				await time.updateSolvesDB(timeAtStart, timeAtEnd, data.user.id, scramble, eventString)
				await solves.updateSolves(data.user.id)
				await fetchScrambleForEvent(eventString)
			}
			
			if (!spacebarPressed) {
				spacebarPressed = !spacebarPressed
			}
		}
	}

    async function fetchScrambleForEvent(event: string): Promise<void> {
        const result = await randomScrambleForEvent(event);
        scramble = result.toString(); 
    }

	const changeEvent = async (eventChosen: string) => {
		eventString = eventChosen
		solves.setEvent(eventString)
        await fetchScrambleForEvent(eventString);
	}

    onMount(async () => {
        await fetchScrambleForEvent(eventString);
    });

	$inspect(spacebarPressed)

	function roundUpto (num: number, upto: number){
		return Number(num.toFixed(upto));
	}

</script>

<div class="flex flex-col gap-4">
	<Navbar username={data.user.username} user_id={data.user.id} {scramble}></Navbar>
	<Sidebar solves={reverseSolves}></Sidebar>
	{#if !timerStart}
		<div class="flex items-center justify-center gap-4">
			<Button>Pick Event<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
			<Dropdown {activeClass}>
				<DropdownItem onclick={() => changeEvent("333")}>3x3</DropdownItem>
				<DropdownItem onclick={() => changeEvent("444")}>4x4</DropdownItem>
			</Dropdown>
			<Button onclick={async () => {await fetchScrambleForEvent(eventString)}}>New Scramble</Button>
		</div>

		<Timer {timerStart} {time} {spacebarPressed}/>
		<Statistics mo3 = {roundUpto(solves.currMo3/1000, 3)} ao5 = {roundUpto(solves.currAo5/1000, 3)} ao12 = {roundUpto(solves.currAo12/1000, 3)}></Statistics>
		<Scramble {scramble} {eventString}></Scramble>
	{:else}
		<div class="flex items-center justify-center gap-4 opacity-0">
			<Button>Pick Event<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
			<Dropdown {activeClass}>
				<DropdownItem onclick={() => changeEvent("333")}>3x3</DropdownItem>
				<DropdownItem onclick={() => changeEvent("444")}>4x4</DropdownItem>
			</Dropdown>
			<Button onclick={async () => {await fetchScrambleForEvent(eventString)}}>New Scramble</Button>
		</div>
		<Timer {timerStart} {time} {spacebarPressed}/>
	{/if}
	<Footer></Footer>
</div>
<svelte:window onkeyup={handleKeyUp} onkeydown={handleKeyDown} />