<script lang="ts">
	import Button from '$lib/common/components/button.svelte';
	import { isChatSidebarOpen } from './store';
</script>

<Button preset="secondary" on:click={() => isChatSidebarOpen.set(!$isChatSidebarOpen)}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		class="inline-block w-5 h-5 stroke-current"
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 6h16M4 12h16M4 18h16"
		/></svg
	>
</Button>
