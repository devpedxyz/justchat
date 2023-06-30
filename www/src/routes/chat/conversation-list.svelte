<script lang="ts">
	import type { Conversation } from '$lib/chat/types';

	export let conversationList: Conversation[] = [];
	export let selectecConversationId: string | null = null;
</script>

<ul class="chat-room-list flex flex-col gap-2">
	{#each conversationList as conversation}
		<li
			class="hover:bg-secondary/70 rounded-md{selectecConversationId === conversation.id
				? ' bg-secondary text-primary font-bold'
				: ''}"
		>
			<a href="/chat/{conversation.id}" class="block p-2">{conversation.name}</a>
		</li>
	{/each}
</ul>
