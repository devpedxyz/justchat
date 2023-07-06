<script lang="ts">
	import Button from '$lib/common/components/button.svelte';
	import { PanelLeftClose, PanelLeftOpen } from 'lucide-svelte';
	import { isChatSidebarOpen } from './store';
</script>

<Button preset="secondary" on:click={() => isChatSidebarOpen.set(!$isChatSidebarOpen)}>
	{#if $isChatSidebarOpen}
		<PanelLeftClose />
	{:else}
		<PanelLeftOpen />
	{/if}
</Button>
