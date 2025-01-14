
<script lang="ts">
	import { goto } from '$app/navigation';
    let {username, user_id, scramble } = $props();
    import { page } from '$app/state';
    import { Avatar, NavHamburger, Navbar, NavLi, NavUl, Dropdown, DropdownHeader, DropdownItem, DropdownDivider } from 'flowbite-svelte';
    let activeUrl = $derived(page.url.pathname);
    async function logout() {
		const response = await fetch('?/logout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		});

		if (!response.ok) {
			console.error('Failed logout', await response.text());
        } else {
			console.log('Logout successful');
            goto('/login');
		}
    }
</script>

<Navbar fluid={true} class="flex justify-between items-center">
    <div class="flex items-center">
        <NavUl {activeUrl}>
            <NavLi href="/">Home</NavLi>
        </NavUl>
    </div>

    <div class="flex items-center">
        <NavUl>
            {#if scramble != ""}
                <NavLi class="text-2xl">{scramble}</NavLi>
            {:else}
                <NavLi class="text-2xl opacity-0">L2 F' D R D2 R' F U2 B U' L2 B2 R2 U2 R2 U' B2 U2 F2 R2 D</NavLi>
            {/if}
        </NavUl>
    </div>

    <div class="flex items-center md:order-2">
        <NavUl {activeUrl}>
            <NavLi id="avatar-menu">Profile</NavLi>
        </NavUl>
        <!-- <Avatar id="avatar-menu" src="/images/profile-picture-3.webp" /> -->
        <!-- <NavHamburger class="w-full md:flex md:w-auto md:order-1" /> -->
        <!-- href="/profile/{user_id}" -->
    </div>
    <Dropdown placement="bottom" triggeredBy="#avatar-menu">
    <DropdownItem on:click={() => goto(`/profile/${user_id}`)}>{username}'s Dashboard</DropdownItem>
    <DropdownDivider />
    <DropdownItem on:click={async () => await logout()}>Sign out</DropdownItem>
    </Dropdown>
</Navbar>
