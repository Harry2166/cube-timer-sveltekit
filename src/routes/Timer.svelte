
<script lang="ts">
    let {timerStart, time, spacebarPressed} = $props();
</script>
<div class="flex items-center justify-center">
    {#if !timerStart && !spacebarPressed}
        <p class="text-9xl dark:text-white text-center">{time.value.minutes}:{time.value.seconds}:{time.value.miliseconds}</p>
    {:else if !timerStart && spacebarPressed}
        <p class="text-9xl dark:text-red-500 text-center">{time.value.minutes}:{time.value.seconds}:{time.value.miliseconds}</p>
    {:else}
        <p class="text-9xl dark:text-white text-center">Solving</p>
    {/if}
</div>