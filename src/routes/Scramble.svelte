
<script lang="ts">
    let {scramble} = $props();
    import { TwistyPlayer } from "cubing/twisty";
</script>

<twisty-player alg={scramble} visualization="2D"></twisty-player>
