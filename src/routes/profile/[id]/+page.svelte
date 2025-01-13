
<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	import Navbar from '../../Navbar.svelte'
	import Footer from '../../Footer.svelte'
    import { Button, Dropdown, DropdownItem, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, PaginationItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

    type Solve = {
        solveId: number;
        scramble: string | null;
        userId: string;
        minutes: number;
        seconds: number;
        ms: number;
        timeRecord: number;
        event: string | null;
        isDNF: number;
        isPlusTwo: number;
    }

    let eventString = $state("333")
    let solves = $state(data.solves)
    let eventOnlySolves = $derived(solves.filter(sameEvent))
    let rangeOfShownSolves = $state(0)
    let shownSolves = $derived(eventOnlySolves.slice(rangeOfShownSolves, rangeOfShownSolves + 5))
    let deletedSolveIds = $state([-1])
    let maxOfGivenRange = $derived(Math.min(rangeOfShownSolves + 5, eventOnlySolves.length))
    const plusTwoAdditional = "+2"

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
        return !deletedSolveIds.includes(solve.solveId)
    }
    
    function sameEvent(solve: Solve){
        return eventString == solve.event
    }

    function changeEvent(str: string) {
        eventString = str
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
            if (solves[idx].solveId == solveId) {
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

<div class="flex flex-col gap-4">
    <Navbar username={data.navbar_stuff[0].username} user_id={data.navbar_stuff[0].id} scramble={""}></Navbar>
    <div class="flex items-center justify-center gap-4">
        <Button>Pick Event<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
        <Dropdown>
            <DropdownItem onclick={() => changeEvent("333")}>3x3</DropdownItem>
            <DropdownItem onclick={() => changeEvent("444")}>4x4</DropdownItem>
        </Dropdown>
    </div>
    <Table hoverable={true}>
        <TableHead>
        <TableHeadCell>Time</TableHeadCell>
        <TableHeadCell>Scramble</TableHeadCell>
        <TableHeadCell>Recorded At:</TableHeadCell>
        <TableHeadCell>DNF</TableHeadCell>
        <TableHeadCell>+2</TableHeadCell>
        <TableHeadCell>
            <span class="sr-only"></span>
        </TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
            {#each shownSolves as solve}
            <TableBodyRow>
                <TableBodyCell>{showTime(solve)}</TableBodyCell>
                <TableBodyCell>{solve.scramble}</TableBodyCell>
                <TableBodyCell>{new Date(solve.timeRecord)}</TableBodyCell>
                <TableBodyCell>
                    {#if !solve.isDNF}
                        <Button onclick={async () => {updateTime(solve.solveId, 1, solve.isPlusTwo)}}>DNF</Button>
                    {:else}
                        <Button color="blue" onclick={async () => {updateTime(solve.solveId, 0, solve.isPlusTwo)}}>DNF</Button>
                    {/if}
                </TableBodyCell>
                <TableBodyCell>
                    {#if !solve.isPlusTwo}
                        <Button onclick={async () => {updateTime(solve.solveId, solve.isDNF, 1)}}>+2</Button>
                    {:else}
                        <Button color="blue" onclick={async () => {updateTime(solve.solveId, solve.isDNF, 0)}}>+2</Button>
                    {/if}
                </TableBodyCell>
                <TableBodyCell>
                    <Button onclick={async () => {deleteTime(solve.solveId)}}>Delete</Button>
                </TableBodyCell>
            </TableBodyRow>
            {/each}
            {#if shownSolves.length != 5}
                {#each {length: 5 - shownSolves.length} as _,i}
                <TableBodyRow>
                    <TableBodyCell></TableBodyCell>
                    <TableBodyCell></TableBodyCell>
                    <TableBodyCell></TableBodyCell>
                    <TableBodyCell></TableBodyCell>
                    <TableBodyCell></TableBodyCell>
                    <!-- <TableBodyCell>{solve.event}</TableBodyCell> -->
                    <TableBodyCell>
                        <Button class="opacity-0">Delete</Button>
                    </TableBodyCell>
                </TableBodyRow>
                {/each}
            {/if}
        </TableBody>
    </Table>
    <div class="flex flex-col items-center justify-center gap-2">
        <div class="text-sm text-gray-700 dark:text-gray-400">
            Showing <span class="font-semibold text-gray-900 dark:text-white">{rangeOfShownSolves + 1}</span>
            to
            <span class="font-semibold text-gray-900 dark:text-white">{maxOfGivenRange}</span>
            of
            <span class="font-semibold text-gray-900 dark:text-white">{eventOnlySolves.length}</span>
            Entries
        </div>

        <div class="flex space-x-3 rtl:space-x-reverse">
        <PaginationItem on:click={decreaseRange}>Previous</PaginationItem>
        <PaginationItem on:click={increaseRange}>Next</PaginationItem>
        </div>
    </div>
    <Footer></Footer>
</div>