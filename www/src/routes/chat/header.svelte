<script lang="ts">
	import SidebarToggler from './sidebar-toggler.svelte';

	export let showSidebarToggler = true;
	export let heading = '';
</script>

<header class="flex items-center gap-4 p-4 header basis-1/12 bg-chat-header-bg">
	{#if showSidebarToggler}
		<SidebarToggler />
	{/if}
	<h1 class="text-xl font-bold text-chat-header-heading">{heading}</h1>
	<div class="flex-grow">
		<slot />
	</div>
</header>
