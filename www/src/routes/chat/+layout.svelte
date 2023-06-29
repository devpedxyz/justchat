<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { currentUser } from '$lib/user/store';
	import { onMount } from 'svelte';
	import type { Conversation } from '../../lib/chat/types';
	import Header from './header.svelte';
	import SidebarToggler from './sidebar-toggler.svelte';
	import { isSidebarOpen } from './store';
	import { getConversationList } from '$lib/chat/api-client';
	import { getCurrentUser } from '$lib/user/api-client';

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
		const res = await getCurrentUser();

		if (res.error) {
			throw new Error(res.error.message);
		}

		if (!res.data) {
			return goto('/login');
		}

		currentUser.set(res.data.user);
		loadConversationList();
	});
</script>

<div class="h-screen w-screen flex flex-col">
	<div class="flex overflow-y-auto flex-grow">
		<aside class="{$isSidebarOpen ? 'flex-[0_1_20%]' : 'w-0 basis-0'} overflow-y-auto">
			<div class="flex justify-between items-center p-4">
				<a href="/"><p>JustChat</p></a>
				<SidebarToggler />
			</div>
			<div class="p-4">
				<div>
					{#if isLoadingConversationList}
						<p class="text-center">
							<span class="loading loading-ring loading-lg" />
						</p>
					{:else if Array.isArray(conversationList)}
						<ul class="chat-room-list flex flex-col gap-2">
							{#each conversationList as conversation}
								<li
									class="hover:bg-slate-700 rounded-md{$page.params.slug === conversation.id
										? ' bg-slate-700'
										: ''}"
								>
									<a href="/chat/{conversation.id}" class="block p-2">{conversation.name}</a>
								</li>
							{/each}
						</ul>
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
			</div>
		</aside>
		<div class="flex flex-col flex-[1_1_80%]">
			<slot />
		</div>
	</div>
</div>
