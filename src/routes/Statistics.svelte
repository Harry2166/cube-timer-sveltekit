
<script lang="ts">
    let {mo3, ao5, ao12} = $props();
</script>

<div class="flex items-center justify-center flex-col">
    {#if mo3 != 0}
        <div class="text-3xl">Mo3: {mo3}</div>
    {/if}
    {#if ao5 != 0}
        <div class="text-3xl">Ao5: {ao5}</div>
    {/if}
    {#if ao12 != 0}
        <div class="text-3xl">Ao12: {ao12}</div>
    {/if}
</div>