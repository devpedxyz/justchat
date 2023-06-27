<script lang="ts">
	import type { ChatMessage, ChatRoom } from '../../../types';
	import type { PageData } from './$types';
	import type { GetChatRoomResponseBody, PostChatRoomMessageResponseBody } from './+server';

	export let data: PageData;

	let userId = '1';
	let isSendingMessage = false;
	let errorSendingMessage: Error | null = null;
	let chatRoom: ChatRoom | null = null;
	let messages: ChatMessage[] = [];
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
		console.log('sendMessage', inputMessage);

		if (!inputMessage) {
			return;
		}

		isSendingMessage = true;

		const message = inputMessage;

		inputMessage = '';

		messages = [...messages, { message, author_id: userId } as ChatMessage];

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

			console.log('response: ', response);

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

<div class="flex flex-col w-full">
	<div class="chat-room p-4 flex min-h-16 flex-grow overflow-y-auto">
		{#if isLoadingChatRoom}
			<div class="flex items-center justify-center flex-grow">
				<span class="loading loading-ring loading-lg" />
			</div>
		{:else if messages.length > 0}
			<ul class="flex flex-col gap-2 flex-grow">
				{#each messages as message}
					<li
						class="flex gap-2 items-end {message.author_id === userId ? ' flex-row-reverse' : ''}"
					>
						<span class="p-2 rounded bg-x-100">{message.message}</span>
						{#if typeof message.created_at === 'string' && message.created_at.length > 0}
							<span class="text-x-300"
								>{new Date(message.created_at).toLocaleTimeString('en-US', {
									hour: '2-digit',
									minute: '2-digit',
									hourCycle: 'h23'
								})}</span
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
