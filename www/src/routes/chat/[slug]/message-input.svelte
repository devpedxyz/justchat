<script lang="ts">
	import Button from '$lib/common/components/button.svelte';
	import { createEventDispatcher } from 'svelte';

	export let value: string;

	const dispatch = createEventDispatcher<{ submit: never }>();
</script>

<form
	class="text-box p-4 flex flex-shrink flex-col justify-between gap-4 sm:flex-row bg-chat-chatbox"
	on:submit|preventDefault={() => {
		console.log('submittt');
		dispatch('submit');
	}}
>
	<input
		type="text"
		id="message"
		name="message"
		class="flex-grow p-4 rounded bg-input-gb text-input-text focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-80"
		placeholder="Enter your message here"
		autocomplete="off"
		required
		bind:value
	/>
	<Button attrs={{ type: 'submit ', disabled: !value }} preset="accent">Send</Button>
</form>
