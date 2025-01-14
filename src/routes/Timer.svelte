
<script lang="ts">
    let {timerStart, time, spacebarPressed} = $props();
</script>
<div class="flex items-center justify-center">
    {#if !timerStart && !spacebarPressed}
        {#if time.value.minutes == 0}
            <p class="dark:text-white text-center" style="font-size: clamp(2rem, 10vw, 16rem)">{time.value.seconds}.{time.value.miliseconds}</p>
        {:else}
            <p class="dark:text-white text-center" style="font-size: clamp(2rem, 10vw, 16rem)">{time.value.minutes}:{time.value.seconds}.{time.value.miliseconds}</p>
        {/if}
    {:else if !timerStart && spacebarPressed}
        {#if time.value.minutes == 0}
            <p class="dark:text-red-500 text-center" style="font-size: clamp(2rem, 10vw, 16rem)">{time.value.seconds}.{time.value.miliseconds}</p>
        {:else}
            <p class="dark:text-red-500 text-center" style="font-size: clamp(2rem, 10vw, 16rem)">{time.value.minutes}:{time.value.seconds}.{time.value.miliseconds}</p>
        {/if}
    {:else}
        <p class="dark:text-white text-center" style="font-size: clamp(2rem, 10vw, 16rem)">Solving</p>
    {/if}
</div>