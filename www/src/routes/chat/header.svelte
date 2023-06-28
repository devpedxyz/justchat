<script lang="ts">
	import SidebarToggler from './sidebar-toggler.svelte';
	import { header, isSidebarOpen } from './store';
</script>

<header class="flex items-center gap-4 p-4 header bg-base-100 basis-1/12">
	{#if !$isSidebarOpen}
		<SidebarToggler />
	{/if}
	<h1 class="text-2xl font-bold">{$header.heading}</h1>
</header>
