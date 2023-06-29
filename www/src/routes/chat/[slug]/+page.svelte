<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { ChatMessage, Conversation, ChatMessageWithDate } from '../../../types';
	import type { GetConversationResponseBody, PostConversationMessageResponseBody } from './+server';
	import MessageInput from './message-input.svelte';
	import MessagesBox from './messages-box.svelte';
	import { goto } from '$app/navigation';
	import { header } from '../store';

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
	let conversation: Conversation | null = null;
	let messages: ChatMessage[] = [];
	let inputMessage = '';
	let isLoadingConversation = false;
	let errorLoadingConversation: Error | null = null;

	async function getConversation(slug: string) {
		isLoadingConversation = true;

		try {
			const data: GetConversationResponseBody = await fetch(`/chat/${slug}`).then((res) =>
				res.json()
			);

			conversation = data.data.conversation;
			messages = data.data.messages;
		} catch (error) {
			if (error instanceof Error) {
				errorLoadingConversation = error;
			}
		}

		isLoadingConversation = false;
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
			const response: PostConversationMessageResponseBody = await fetch(
				`/chat/${$page.params.slug}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						message
					})
				}
			).then((res) => res.json());

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

	$: getConversation($page.params.slug);
	$: {
		if (isLoadingConversation) {
			header.set({
				heading: 'Loading...'
			});
		} else if (errorLoadingConversation) {
			header.set({
				heading: 'Error'
			});
		} else if (conversation) {
			header.set({
				heading: conversation.name
			});
		} else {
			header.set({
				heading: ''
			});
		}
	}
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
</script>

{#if isLoadingConversation}
	<div class="flex items-center justify-center flex-grow">
		<span class="loading loading-ring loading-lg" />
	</div>
{:else if errorLoadingConversation}
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
		<span>{errorLoadingConversation.message}</span>
	</div>
{:else if conversation}
	<div class="flex flex-col w-full h-full">
		<div class="flex flex-col w-full gap-4 flex-grow min-h-0">
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
	<div class="flex items-center justify-center flex-grow">
		<p>Conversation not found</p>
	</div>
{/if}
