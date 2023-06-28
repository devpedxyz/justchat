<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string;

	const dispatch = createEventDispatcher<{ submit: never }>();
</script>

<form
	class="text-box p-4 flex flex-shrink flex-col justify-between gap-4 sm:flex-row"
	on:submit|preventDefault={() => {
		console.log('submittt');
		dispatch('submit');
	}}
>
	<input
		type="text"
		id="message"
		name="message"
		class="input flex-grow bg-[rgba(255,255,255,0.1)]"
		placeholder="Enter your message here"
		autocomplete="off"
		required
		bind:value
	/>
	<button type="submit" class="btn btn-primary" disabled={!value}>Send</button>
</form>
