
<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	import Navbar from '../../Navbar.svelte'
	import Footer from '../../Footer.svelte'
    import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, PaginationItem } from 'flowbite-svelte';

    let solves = $state(data.solves)
    let rangeOfShownSolves = $state(0)
    let shownSolves = $derived(solves.slice(rangeOfShownSolves, rangeOfShownSolves + 5))
    let deletedSolveIds = $state([-1])
    let maxOfGivenRange = $derived(Math.min(rangeOfShownSolves + 5, solves.length))

    const increaseRange = () => {
        if(maxOfGivenRange != solves.length){
            rangeOfShownSolves += 5
        }
    }

    const decreaseRange = () => {
        if(rangeOfShownSolves != 0){
            rangeOfShownSolves -= 5
        }
    }

    type Solve = {
        solveId: number;
        scramble: string | null;
        userId: string;
        time: string;
        timeRecord: number;
        event: string | null;
    }

    function isNotDeleted(solve: Solve){
        return !deletedSolveIds.includes(solve.solveId)
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

</script>

<Navbar username={data.navbar_stuff[0].username} user_id={data.navbar_stuff[0].id} scramble={""}></Navbar>

<Table hoverable={true}>
    <TableHead>
    <TableHeadCell>Scramble</TableHeadCell>
    <TableHeadCell>Time</TableHeadCell>
    <TableHeadCell>Recorded At:</TableHeadCell>
    <!-- <TableHeadCell>Event</TableHeadCell> -->
    <TableHeadCell>
        <span class="sr-only"></span>
    </TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
        {#each shownSolves as solve}
        <TableBodyRow>
            <TableBodyCell>{solve.scramble}</TableBodyCell>
            <TableBodyCell>{solve.time}</TableBodyCell>
            <TableBodyCell>{new Date(solve.timeRecord)}</TableBodyCell>
            <!-- <TableBodyCell>{solve.event}</TableBodyCell> -->
            <TableBodyCell>
                <Button onclick={async () => {deleteTime(solve.solveId)}}>Delete</Button>
            </TableBodyCell>
        </TableBodyRow>
        {/each}
    </TableBody>
</Table>

<div class="fixed bottom-80 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2">
    <div class="text-sm text-gray-700 dark:text-gray-400">
        Showing <span class="font-semibold text-gray-900 dark:text-white">{rangeOfShownSolves + 1}</span>
        to
        <span class="font-semibold text-gray-900 dark:text-white">{maxOfGivenRange}</span>
        of
        <span class="font-semibold text-gray-900 dark:text-white">{solves.length}</span>
        Entries
    </div>

    <div class="flex space-x-3 rtl:space-x-reverse">
    <PaginationItem on:click={decreaseRange}>Previous</PaginationItem>
    <PaginationItem on:click={increaseRange}>Next</PaginationItem>
    </div>
</div>

<Footer></Footer>