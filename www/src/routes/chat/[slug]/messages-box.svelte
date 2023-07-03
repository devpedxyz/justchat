<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import type { ChatMessageWithDate, ConversationParticipant } from '../../../lib/chat/types';
	import type { User } from '$lib/user/types';

	interface MessageWithAuthor extends ChatMessageWithDate {
		author: ConversationParticipant;
	}

	export let messagesWithDate: ChatMessageWithDate[] = [];
	export let user: User;
	export let participants: ConversationParticipant[];

	$: participantsByUserId = participants.reduce((acc, participant) => {
		acc[participant.user_id] = participant;
		return acc;
	}, {} as Record<string, ConversationParticipant>);

	$: messagesWithAuthor = messagesWithDate.map<MessageWithAuthor>((message) => {
		const author = participantsByUserId[message.author_id];
		return {
			...message,
			author
		};
	});

	const scroll = (element: HTMLElement) =>
		element.scroll({ top: element.scrollHeight, behavior: 'smooth' });

	let chatBox: HTMLUListElement | null = null;

	afterUpdate(() => {
		if (chatBox) {
			scroll(chatBox);
		}
	});

	onMount(() => {
		if (chatBox) {
			scroll(chatBox);
		}
	});
</script>

<ul bind:this={chatBox} class="flex flex-col gap-2 flex-grow px-4 pt-4 overflow-y-auto min-h-0">
	{#each messagesWithAuthor as message, idx}
		{#if messagesWithAuthor[idx - 1] && message.date && messagesWithAuthor[idx - 1].date && message.date.getDay() !== messagesWithAuthor[idx - 1].date?.getDay()}
			<li class="text-center text-layer/30">{message.date.toDateString()}</li>
		{/if}
		<li class="flex gap-2 items-end {message.author_id === user.id ? ' flex-row-reverse' : ''}">
			<span class="contents">
				{#if message.author_id !== user.id}
					<span class="rounded-full w-12 h-12 overflow-hidden">
						<img src={message.author.user.profile_image_url} alt="User profile" />
					</span>
				{/if}
				<span class="p-2 rounded bg-chat-msg-bg">{message.message}</span>
			</span>
			{#if typeof message.created_at === 'string' && message.created_at.length > 0}
				<span class="text-layer/30" title={message.date?.toLocaleString()}
					>{message.created_at}</span
				>
			{/if}
		</li>
	{/each}
</ul>
