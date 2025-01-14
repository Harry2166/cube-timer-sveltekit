
<script>
    let {shownSolves, showTime, updateTime, deleteTime, rangeOfShownSolves, maxOfGivenRange, eventOnlySolves, decreaseRange, increaseRange} = $props();
    import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, PaginationItem } from 'flowbite-svelte';
</script>

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