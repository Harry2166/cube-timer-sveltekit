
<script lang="ts">
    let {mo3, ao5, ao12} = $props();
</script>

<div class="flex items-center justify-center flex-col">
    {#if mo3 != 0}
        <div class="text-3xl">Mo3: {mo3 != 1.7976931348623156e+305 ? mo3 : "DNF"}</div>
    {/if}
    {#if ao5 != 0}
        <div class="text-3xl">Ao5: {ao5 != 1.7976931348623156e+305 ? ao5 : "DNF"}</div>
    {/if}
    {#if ao12 != 0}
        <div class="text-3xl">Ao12: {ao12 != 1.7976931348623156e+305 ? ao12 : "DNF"}</div>
    {/if}
</div>