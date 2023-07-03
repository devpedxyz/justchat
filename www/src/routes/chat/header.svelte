<script lang="ts">
	import Button from '$lib/common/components/button.svelte';
	import { onMount } from 'svelte';
	import SidebarToggler from './sidebar-toggler.svelte';
	import { isChatSidebarOpen } from './store';
	import { themeChange } from 'theme-change';

	export let heading = '';

	onMount(() => {
		themeChange(false);
	});
</script>

<header class="flex items-center gap-4 p-4 header basis-1/12 bg-chat-header-bg">
	{#if !$isChatSidebarOpen}
		<SidebarToggler />
	{/if}
	<h1 class="text-xl font-bold text-chat-header-heading">{heading}</h1>
	<div class="flex-grow flex justify-end gap-4">
		<span data-set-theme="night"><Button preset="secondary">Night</Button></span>
		<span data-set-theme="light"><Button preset="secondary">Light</Button></span>
		<slot />
	</div>
</header>
