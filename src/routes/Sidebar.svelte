
<script lang="ts">
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

    let { solves = [] }: {
        solves?: Solve[],
    } = $props();
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
</script>

<div class="fixed left-0 top-1/2 transform -translate-y-1/2 bg-gray-100 shadow-md h-[calc(100vh-13rem)] overflow-y-auto">
    <Sidebar>
        <SidebarWrapper>
            {#each solves as solve, i}
            {#if i == 0}
            <SidebarGroup>
                    <SidebarItem label={`${solve.minutes}:${solve.seconds}.${solve.ms}`}/>
            </SidebarGroup>
            {:else}
            <SidebarGroup border>
                    <SidebarItem label={`${solve.minutes}:${solve.seconds}.${solve.ms}`}/>
            </SidebarGroup>
            {/if}
            {/each}
            {#if solves.length != 10}
                {#each {length: 10 - solves.length} as _}
                    <div class="opacity-0">
                    <SidebarGroup border>
                        <SidebarItem label={"LOL"}/>
                    </SidebarGroup>
                    </div>
                {/each}
            {/if}
        </SidebarWrapper>
    </Sidebar>
</div>
