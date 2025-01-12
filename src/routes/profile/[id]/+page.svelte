
<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	import Navbar from '../../Navbar.svelte'

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

<Navbar name={data.navbar_stuff[0].username} user_id={data.navbar_stuff[0].id} scramble={""}></Navbar>

{#each solves as solve}
    <div>{solve.scramble}: Recorded at {new Date(solve.timeRecord)}</div>
    <div>{solve.time}</div>
    <div>{solve.event}</div>
    <button onclick={async () => {deleteTime(solve.solveId)}}>Delete Time</button>
{/each}