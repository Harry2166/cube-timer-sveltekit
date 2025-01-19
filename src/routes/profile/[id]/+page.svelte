
<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	import Navbar from '../../Navbar.svelte'
	import Footer from '../../Footer.svelte'
	import SolvesTable from './SolvesTable.svelte'
    import { Tabs, TabItem } from 'flowbite-svelte';

    type Solve = {
        solve_id: number;
        scramble: string | null;
        userId: string;
        minutes: number;
        seconds: number;
        ms: number;
        timeRecord: Date;
        event: string | null;
        isDNF: number;
        isPlusTwo: number;
    }    
    
    let eventMap = new Map<string, string>([
        ["222", "2x2x2"],
        ["333", "3x3x3"],
        ["444", "4x4x4"],
        ["skewb", "skewb"],
    ])

    let eventString = $state("333")
    let solves = $state(data.solves)
    let eventOnlySolves = $derived(solves.filter(sameEvent).reverse())
    let rangeOfShownSolves = $state(0)
    let shownSolves = $derived(eventOnlySolves.slice(rangeOfShownSolves, rangeOfShownSolves + 5))
    let deletedSolveIds = $state([-1])
    let maxOfGivenRange = $derived(Math.min(rangeOfShownSolves + 5, eventOnlySolves.length))

    const increaseRange = () => {
        if(maxOfGivenRange != eventOnlySolves.length){
            rangeOfShownSolves += 5
        }
    }

    const decreaseRange = () => {
        if(rangeOfShownSolves != 0){
            rangeOfShownSolves -= 5
        }
    }

    function isNotDeleted(solve: Solve){
        return !deletedSolveIds.includes(solve.solve_id)
    }
    
    function sameEvent(solve: Solve){
        return eventString == solve.event
    }

    function changeEvent(str: string) {
        eventString = str
        rangeOfShownSolves = 0
    }

	async function deleteTime(solveId: number) {
		const response = await fetch('?/deleteTime', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: JSON.stringify({
                solveId: solveId 
			}),
		});

		if (!response.ok) {
			console.error('Failed to delete solve', await response.text());
        } else {
			console.log('Deleted solve successfully');
            deletedSolveIds.push(solveId)
            solves = solves.filter(isNotDeleted)
		}
    }

	function inputUpdateTime(solveId: number, isDNF: number, isPlusTwo: number) {
        for (let idx = 0; idx < solves.length; idx++) {
            if (solves[idx].solve_id == solveId) {
                solves[idx].isDNF = isDNF
                solves[idx].isPlusTwo = isPlusTwo 
            }
        }
    }
	async function updateTime(solveId: number, isDNF: number, isPlusTwo: number) {
		const response = await fetch('?/updateTime', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: JSON.stringify({
                solveId: solveId, 
                isDNF: isDNF,
                isPlusTwo: isPlusTwo 
			}),
		});

		if (!response.ok) {
			console.error('Failed to update solve', await response.text());
        } else {
			console.log('Updated solve successfully');
            inputUpdateTime(solveId, isDNF, isPlusTwo)
        }
    }

    function showTime(solve: Solve) {
        let minutes = solve.minutes
        let seconds = solve.seconds
        let ms = solve.ms

        if (solve.isPlusTwo && solve.isDNF) return "DNF (+2)"

        else if (solve.isPlusTwo) {
            if (solve.isPlusTwo && (seconds + 2 >= 60)) {
                minutes += 1
            } else {
                seconds += 2
            }
            return `${minutes}:${seconds}:${ms} (+2)`
        }

        else if (solve.isDNF) {
            return "DNF"
        }

        return `${minutes}:${seconds}:${ms}`
    }

</script>

<div class="flex flex-col gap-1">
    <Navbar username={data.navbar_stuff[0].username} user_id={data.navbar_stuff[0].id} scramble={""}></Navbar>
    <Tabs>  
        {#each eventMap as events}
            <TabItem open={events[0] === "333" ? true : false} title={events[1]} on:click={() => changeEvent(events[0])}>
                <SolvesTable
                    showTime = {(solve: Solve) => showTime(solve)} 
                    updateTime = {async (a: number, b: number, c: number) => updateTime(a,b,c)} 
                    deleteTime = {async (a: number) => deleteTime(a)} 
                    {rangeOfShownSolves} 
                    {maxOfGivenRange} 
                    {eventOnlySolves}
                    {shownSolves}
                    decreaseRange = {() => decreaseRange()} 
                    increaseRange = {() => increaseRange()}>
                </SolvesTable>
            </TabItem>
        {/each}
    </Tabs>
    <Footer></Footer>
</div>