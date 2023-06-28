<script lang="ts">
	import { page } from '$app/stores';
	import type { ChatRoom } from '../../types';
	import type { ChatRoomListResponseBody } from './+server';
	import SidebarToggler from './sidebar-toggler.svelte';
	import { isSidebarOpen } from './store';

	let chatRoomList: ChatRoom[] | null = null;
	let isLoadingChatRoomList = false;
	let errorLoadingChatRoomList: Error | null = null;

	async function loadChatRoomList() {
		isLoadingChatRoomList = true;

		try {
			const data: ChatRoomListResponseBody = await fetch('/chat').then((res) => res.json());

			chatRoomList = data.chatRooms;
		} catch (e) {
			// @Todo Send log to server
			if (e instanceof Error) {
				errorLoadingChatRoomList = e;
			}
		}

		isLoadingChatRoomList = false;
	}

	loadChatRoomList();
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
					{#if isLoadingChatRoomList}
						<p class="text-center">
							<span class="loading loading-ring loading-lg" />
						</p>
					{:else if Array.isArray(chatRoomList)}
						<ul class="chat-room-list flex flex-col gap-2">
							{#each chatRoomList as chatRoom}
								<li
									class="hover:bg-slate-700 rounded-md{$page.params.slug === chatRoom.id
										? ' bg-slate-700'
										: ''}"
								>
									<a href="/chat/{chatRoom.id}" class="block p-2">{chatRoom.name}</a>
								</li>
							{/each}
						</ul>
					{:else if errorLoadingChatRoomList}
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
							<span>{errorLoadingChatRoomList.message}</span>
						</div>
					{/if}
				</div>
			</div>
		</aside>
		<main class="flex flex-[1_1_80%] bg-base-300">
			<slot />
		</main>
	</div>
</div>
