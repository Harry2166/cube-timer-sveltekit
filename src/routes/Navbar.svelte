
<script lang="ts">
    let {user_id, scramble } = $props();
    import { page } from '$app/state';
    import { Navbar, NavLi, NavUl } from 'flowbite-svelte';
    let activeUrl = $derived(page.url.pathname);
</script>

<Navbar fluid={true} class="flex justify-between items-center">
    <div class="flex items-center">
        <NavUl {activeUrl}>
            <NavLi href="/">Home</NavLi>
        </NavUl>
    </div>

    <div class="flex items-center">
        <NavUl>
            <NavLi class="text-2xl">{scramble}</NavLi>
        </NavUl>
    </div>

    <div class="flex items-center">
        <NavUl {activeUrl}>
            <NavLi href="/profile/{user_id}">Profile</NavLi>
        </NavUl>
    </div>
</Navbar>
