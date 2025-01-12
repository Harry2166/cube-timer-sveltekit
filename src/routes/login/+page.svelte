<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Button, Label, Input, Helper } from 'flowbite-svelte';
	let { form }: { form: ActionData } = $props();
</script>

<form method="post" action="?/login" use:enhance>
	<div class="mb-6">
		<Label for="username" class="block mb-2">Username</Label>
		<Input name="username" id="username" placeholder="Type Your Username"/>
	</div>
	<div class="mb-6">
		<Label for="password" class="block mb-2">Password</Label>
		<Input name="password" type="password" id="password" placeholder="Type Your Password"/>
		<Helper class='mt-2' color='red'><span class="font-medium">{form?.message ?? ''}</span></Helper>
	</div>
	<Button type="submit">Login</Button>
	<Button type="submit" formaction="?/register">Register</Button>
</form>