<script lang="ts">
	import type { ChatMessage, ChatRoom, ChatMessageWithDate } from '../../../types';
	import type { PageData } from './$types';
	import type { GetChatRoomResponseBody, PostChatRoomMessageResponseBody } from './+server';

	export let data: PageData;

	let userId = '1';
	let isSendingMessage = false;
	let errorSendingMessage: Error | null = null;
	let chatRoom: ChatRoom | null = null;
	let messages: ChatMessage[] = [];
	$: messagesWithDate = messages.map<ChatMessageWithDate>((m) => {
		if (!m.created_at) {
			return { ...m, date: null };
		}

		const date = new Date(m.created_at);

		return {
			...m,
			date,
			created_at: date.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hourCycle: 'h23'
			})
		};
	});
	let inputMessage = '';
	let isLoadingChatRoom = false;
	let errorLoadingChatRoom: Error | null = null;

	async function getChatRoom(slug: string) {
		isLoadingChatRoom = true;

		try {
			const data: GetChatRoomResponseBody = await fetch(`/chat/${slug}`).then((res) => res.json());

			chatRoom = data.data.chatRoom;
			messages = data.data.messages;
		} catch (error) {
			if (error instanceof Error) {
				errorLoadingChatRoom = error;
			}
		}

		isLoadingChatRoom = false;
	}

	async function sendMessage() {
		if (!inputMessage) {
			return;
		}

		isSendingMessage = true;

		const message = inputMessage;

		inputMessage = '';

		messages = [...messages, { message, author_id: '2' } as ChatMessage];

		try {
			const response: PostChatRoomMessageResponseBody = await fetch(`/chat/${data.params.slug}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message
				})
			}).then((res) => res.json());

			if (response.data.message) {
				messages = [...messages.slice(0, messages.length - 1), response.data.message];
			}
		} catch (e) {
			if (e instanceof Error) {
				errorSendingMessage = e;
			}
		}

		isSendingMessage = false;
	}

	$: getChatRoom(data.params.slug);
</script>

<div class="flex flex-col w-full gap-4">
	<div class="chat-room flex min-h-16 flex-grow">
		{#if isLoadingChatRoom}
			<div class="flex items-center justify-center flex-grow">
				<span class="loading loading-ring loading-lg" />
			</div>
		{:else if messagesWithDate.length > 0}
			<ul class="flex flex-col gap-2 flex-grow overflow-y-auto py-8 px-4">
				{#each messagesWithDate as message, idx}
					{#if messagesWithDate[idx - 1] && message.date && messagesWithDate[idx - 1].date && message.date.getDay() !== messagesWithDate[idx - 1].date?.getDay()}
						<li class="text-center text-x-300">{message.date.toDateString()}</li>
					{/if}
					<li
						class="flex gap-2 items-end {message.author_id === userId ? ' flex-row-reverse' : ''}"
					>
						<span class="contents">
							{#if message.author_id !== userId}
								<span class="avatar placeholder">
									<div class="bg-neutral-focus text-neutral-content rounded-full w-12">
										<span class="text-xs">AAA</span>
									</div>
								</span>
							{/if}
							<span class="p-2 rounded bg-x-100">{message.message}</span>
						</span>
						{#if typeof message.created_at === 'string' && message.created_at.length > 0}
							<span class="text-x-300" title={message.date?.toLocaleString()}
								>{message.created_at}</span
							>
						{/if}
					</li>
				{/each}
			</ul>
		{:else if errorLoadingChatRoom}
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
				<span>{errorLoadingChatRoom.message}</span>
			</div>
		{:else}
			<div class="flex items-center justify-center flex-grow">
				<p>Start chatting!</p>
			</div>
		{/if}
	</div>
	<form
		class="text-box flex flex-shrink flex-col justify-between gap-4 sm:flex-row"
		on:submit|preventDefault
	>
		<input
			type="text"
			id="message"
			name="message"
			class="input flex-grow bg-[rgba(255,255,255,0.1)]"
			placeholder="Enter your message here"
			autocomplete="off"
			required
			bind:value={inputMessage}
		/>
		<button
			type="submit"
			class="btn btn-primary"
			disabled={!chatRoom || !inputMessage}
			on:click={sendMessage}>Send</button
		>
	</form>
</div>
