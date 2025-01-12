
<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	import Navbar from '../../Navbar.svelte'
</script>

<Navbar name={data.navbar_stuff[0].username} user_id={data.navbar_stuff[0].id}></Navbar>

{#each data.solves as solve}
    <div>{solve.scramble}: Recorded at {new Date(solve.timeRecord)}</div>
    <div>{solve.time}</div>
    <div>{solve.event}</div>
{/each}