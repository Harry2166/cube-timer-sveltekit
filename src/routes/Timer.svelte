
<script lang="ts">
    let {timerStart, time} = $props();
</script>
<div class="flex items-center justify-center">
    {#if !timerStart}
        <p class="text-9xl dark:text-white text-center">{time.value.minutes}:{time.value.seconds}:{time.value.miliseconds}</p>
    {:else}
        <p class="text-9xl dark:text-white text-center">Solving</p>
    {/if}
</div>