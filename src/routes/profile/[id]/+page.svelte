
<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	import Navbar from '../../Navbar.svelte'
	import Footer from '../../Footer.svelte'
    import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';

    let solves = $state(data.solves)
    let deletedSolveIds = $state([-1])

    function isNotDeleted(solve: {
        solveId: number;
        scramble: string | null;
        userId: string;
        time: string;
        timeRecord: number;
        event: string | null;
    }){
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

<Navbar user_id={data.navbar_stuff[0].id} scramble={""}></Navbar>

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
        {#each solves as solve}
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

<Footer></Footer>