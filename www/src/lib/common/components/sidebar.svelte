<script lang="ts">
	import { PanelLeftClose, PanelLeftOpen } from 'lucide-svelte';
	import Button from './button.svelte';

	export let isSidebarOpen = false;
</script>

<aside
	class="{isSidebarOpen
		? 'flex-[1_1_20%]'
		: 'w-0 basis-0'} bg-chat-sidebar-bg h-full flex flex-col relative overflow-hidden"
>
	<div class="flex justify-between items-center p-4 flex-[0_1_10%]">
		<slot name="header" />
		<slot name="toggler" toggler={() => (isSidebarOpen = !isSidebarOpen)}>
			<Button preset="secondary" on:click={() => (isSidebarOpen = !isSidebarOpen)}>
				{#if isSidebarOpen}
					<PanelLeftClose />
				{:else}
					<PanelLeftOpen />
				{/if}
				<!-- <svg
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
				> -->
			</Button>
		</slot>
	</div>
	<div class="min-h-0 flex-[1_1_80%]">
		<div class="p-4 h-full overflow-y-auto no-scrollbar">
			<slot name="body" />
		</div>
	</div>
	{#if $$slots.footer}
		<div class="flex-[1_1_10%] p-4">
			<slot name="footer" />
		</div>
	{/if}
</aside>
