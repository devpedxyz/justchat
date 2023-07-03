<script lang="ts">
	import { page } from '$app/stores';
	import { getConversationList } from '$lib/chat/api-client';
	import type { Conversation } from '$lib/chat/types';
	import { onMount } from 'svelte';
	import ConversationList from './conversation-list.svelte';
	import Button from '$lib/common/components/button.svelte';
	import Sidebar from '$lib/common/components/sidebar.svelte';
	import { isChatSidebarOpen } from './store';

	async function loadConversationList() {
		isLoadingConversationList = true;

		try {
			const res = await getConversationList();

			if (res.error) {
				throw new Error(res.error.message);
			}

			if (res.data) {
				conversationList = res.data.conversationList;
			}
		} catch (e) {
			// @Todo Send log to server
			if (e instanceof Error) {
				errorLoadingConversationList = e;
			}
		}

		isLoadingConversationList = false;
	}

	let conversationList: Conversation[] | null = null;
	let isLoadingConversationList = false;
	let errorLoadingConversationList: Error | null = null;

	onMount(async () => {
		loadConversationList();
	});
</script>

<Sidebar bind:isSidebarOpen={$isChatSidebarOpen}>
	<a slot="header" href="/" class="text-2xl font-bold text-primary"><p>JustChat</p></a>
	<div slot="body" class="contents">
		{#if isLoadingConversationList}
			<p class="text-center">
				<span class="loading loading-ring loading-lg" />
			</p>
		{:else if Array.isArray(conversationList)}
			<ConversationList {conversationList} selectedConversationId={$page.params.slug} />
		{:else if errorLoadingConversationList}
			<div class="alert alert-error">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>{errorLoadingConversationList.message}</span>
			</div>
		{/if}
	</div>
	<div slot="footer" class="contents">
		<div class="flex-[1_1_10%] p-4"><Button preset="secondary">Preferences</Button></div>
		<!-- <div class="flex top-0 left-0 absolute w-full h-full p-4 bg-chat-sidebar-bg">Hello</div> -->
	</div>
</Sidebar>
