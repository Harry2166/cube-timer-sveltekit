
<script lang="ts">
    let {timerStart, time, spacebarPressed} = $props();
</script>
<div class="flex items-center justify-center">
    {#if !timerStart && !spacebarPressed}
        {#if time.value.minutes == 0}
            <p class="text-[256px] dark:text-white text-center">{time.value.seconds}.{time.value.miliseconds}</p>
        {:else}
            <p class="text-[256px] dark:text-white text-center">{time.value.minutes}:{time.value.seconds}.{time.value.miliseconds}</p>
        {/if}
    {:else if !timerStart && spacebarPressed}
        {#if time.value.minutes == 0}
            <p class="text-[256px] dark:text-red-500 text-center">{time.value.seconds}.{time.value.miliseconds}</p>
        {:else}
            <p class="text-[256px] dark:text-red-500 text-center">{time.value.minutes}:{time.value.seconds}.{time.value.miliseconds}</p>
        {/if}
    {:else}
        <p class="text-[256px] dark:text-white text-center">Solving</p>
    {/if}
</div>