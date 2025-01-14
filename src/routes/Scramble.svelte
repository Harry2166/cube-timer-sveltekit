
<script lang="ts">
    let {scramble} = $props();
    import { TwistyPlayer } from "cubing/twisty";
</script>

<div class="absolute bottom-20 right-0">
    <twisty-player alg={scramble} visualization="2D"></twisty-player>
</div>