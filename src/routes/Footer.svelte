<script>
    import { Footer, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
    let {scramble} = $props();
	import Scramble from './Scramble.svelte';
</script>

<div class="fixed bottom-0 right-0 flex flex-col">
    {#if scramble != ""}
    <div class="relative bottom-20 right-0">
        <Scramble {scramble}></Scramble>
    </div>
    {/if}
    <Footer class="fixed bottom-0 flex flex-col items-center justify-center text-center py-4 bg-gray-100 dark:bg-gray-800absolute bottom-0 start-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
        <FooterLinkGroup ulClass="flex flex-wrap items-center justify-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
            <FooterLink href="https://github.com/Harry2166" target="_blank" rel="noopener noreferrer">
                Made by: Harry2166
            </FooterLink>
        </FooterLinkGroup>
    </Footer>
</div>