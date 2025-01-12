<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<style lang="postcss">
	:global(body) {
    @apply bg-zinc-900;
	}
	:global(h1) {
		@apply text-white;
	}
	:global(h2) {
		@apply text-white;
	}
	:global(button) {
		@apply text-white;
	}
	:global(form) {
		@apply text-white;
	}
	:global(div) {
		@apply text-white;
	}
</style>

{@render children()}
