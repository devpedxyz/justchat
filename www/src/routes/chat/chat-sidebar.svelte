<script lang="ts">
	import { page } from '$app/stores';
	import { getConversationList } from '$lib/chat/api-client';
	import type { Conversation } from '$lib/chat/types';
	import { onMount } from 'svelte';
	import ConversationList from './conversation-list.svelte';
	import Sidebar from '$lib/common/components/sidebar.svelte';
	import { isChatSidebarOpen } from './store';
	import { XCircle } from 'lucide-svelte';

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
				<span class="loading loading-ring loading-lg">Loading...</span>
			</p>
		{:else if Array.isArray(conversationList)}
			<ConversationList {conversationList} selectedConversationId={$page.params.slug} />
		{:else if errorLoadingConversationList}
			<div class="alert alert-error">
				<XCircle />
				<span>{errorLoadingConversationList.message}</span>
			</div>
		{/if}
	</div>
</Sidebar>
