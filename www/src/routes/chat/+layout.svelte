<script lang="ts">
	import type { ChatRoomListResponse } from './+layout.server';

	export let data: ChatRoomListResponse | null = null;
</script>

<div class="h-screen w-screen flex flex-col">
	<header class="p-4">
		<h1>JustChat</h1>
	</header>
	<div class="flex overflow-y-auto flex-grow">
		<aside class="w-0 sm:flex-[0_1_20%] overflow-y-auto">
			<div class="p-4">
				<p class="mb-8">Chats</p>
				<ul class="chat-room-list flex flex-col gap-2">
					{#if data && data.chatRooms}
						{#each data.chatRooms as chatRoom}
							<li class="p-2 hover:bg-slate-700 rounded-md">
								<a href="/chat/{chatRoom.id}" class="block">{chatRoom.name}</a>
							</li>
						{/each}
					{/if}
				</ul>
			</div>
		</aside>
		<main class="p-4 flex flex-[1_1_80%] overflow-y-auto bg-base-200">
			<slot />
		</main>
	</div>
</div>
