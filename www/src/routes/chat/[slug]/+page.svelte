<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { ChatMessage, ChatRoom, ChatMessageWithDate } from '../../../types';
	import type { GetChatRoomResponseBody, PostChatRoomMessageResponseBody } from './+server';
	import MessageInput from './message-input.svelte';
	import MessagesBox from './messages-box.svelte';
	import { goto } from '$app/navigation';
	import SidebarToggler from '../sidebar-toggler.svelte';
	import { isSidebarOpen } from '../store';

	onMount(() => {
		window.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				goto('/chat');
			}
		});
	});

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
		console.log('sendMessage()');
		if (!inputMessage) {
			return;
		}

		isSendingMessage = true;

		const message = inputMessage;

		inputMessage = '';

		messages = [...messages, { message, author_id: '2' } as ChatMessage];

		try {
			const response: PostChatRoomMessageResponseBody = await fetch(`/chat/${$page.params.slug}`, {
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

	$: getChatRoom($page.params.slug);
</script>

{#if isLoadingChatRoom}
	<div class="flex items-center justify-center flex-grow">
		<span class="loading loading-ring loading-lg" />
	</div>
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
{:else if chatRoom}
	<div class="flex flex-col w-full h-full">
		<div class="flex items-center gap-4 p-4 header bg-base-100 basis-1/12">
			{#if !$isSidebarOpen}
				<SidebarToggler />
			{/if}
			<h1 class="text-2xl font-bold">{chatRoom.name}</h1>
		</div>
		<div class="flex flex-col w-full gap-4 basis-11/12 flex-grow-0 min-h-0">
			<div class="chat-room flex min-h-16 flex-grow">
				{#if messagesWithDate.length > 0}
					<MessagesBox {messagesWithDate} {userId} />
				{:else}
					<div class="flex items-center justify-center flex-grow">
						<p>Start chatting!</p>
					</div>
				{/if}
			</div>
			<MessageInput bind:value={inputMessage} on:submit={sendMessage} />
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center">
		<p>Chat room not found</p>
	</div>
{/if}
