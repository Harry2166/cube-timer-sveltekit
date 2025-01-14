
<script lang="ts">
    let {scramble, eventString} = $props();
    import { TwistyPlayer } from "cubing/twisty";

    let eventMap = new Map<string, string>([
        ["222", "2x2x2"],
        ["333", "3x3x3"],
        ["444", "4x4x4"],
        ["555", "5x5x5"],
        ["666", "6x6x6"],
        ["777", "7x7x7"],
        ["megaminx", "megaminx"],
        ["pyraminx", "pyraminx"],
        ["square1", "square1"],
        ["clock", "clock"],
        ["skewb", "skewb"],
    ])
</script>

<div class="absolute bottom-20 right-0">
    <twisty-player puzzle={eventMap.get(eventString)} alg={scramble} visualization="2D"></twisty-player>
</div>