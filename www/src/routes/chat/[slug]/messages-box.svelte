<script lang="ts">
	import { afterUpdate } from 'svelte';
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

	let chatBox: HTMLUListElement | null = null;

	afterUpdate(() => {
		if (chatBox) {
			chatBox.scrollTop = chatBox.scrollHeight;
		}
	});
</script>

<ul bind:this={chatBox} class="flex flex-col gap-2 flex-grow overflow-y-auto px-4 pt-4">
	{#each messagesWithAuthor as message, idx}
		{#if messagesWithAuthor[idx - 1] && message.date && messagesWithAuthor[idx - 1].date && message.date.getDay() !== messagesWithAuthor[idx - 1].date?.getDay()}
			<li class="text-center text-x-300">{message.date.toDateString()}</li>
		{/if}
		<li class="flex gap-2 items-end {message.author_id === user.id ? ' flex-row-reverse' : ''}">
			<span class="contents">
				{#if message.author_id !== user.id}
					<span class="avatar placeholder">
						<div class="bg-neutral-focus text-neutral-content rounded-full w-12">
							<img src={message.author.user.profile_image_url} alt="User profile" />
						</div>
					</span>
				{/if}
				<span class="p-2 rounded bg-x-100">{message.message}</span>
			</span>
			{#if typeof message.created_at === 'string' && message.created_at.length > 0}
				<span class="text-x-300" title={message.date?.toLocaleString()}>{message.created_at}</span>
			{/if}
		</li>
	{/each}
</ul>
