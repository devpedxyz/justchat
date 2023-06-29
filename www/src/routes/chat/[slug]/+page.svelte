<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { ChatMessage, Conversation, ChatMessageWithDate } from '$lib/chat/types';
	import MessageInput from './message-input.svelte';
	import MessagesBox from './messages-box.svelte';
	import { goto } from '$app/navigation';
	import { header } from '../store';
	import { addMessageToConversation, getOneConversation } from '$lib/chat/api-client';
	import { currentUser } from '$lib/user/store';

	onMount(() => {
		window.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				goto('/chat');
			}
		});
	});

	let conversation: Conversation | null = null;
	let messages: ChatMessage[] = [];
	let inputMessage = '';
	let isLoadingConversation = false;
	let errorLoadingConversation: Error | null = null;

	async function getConversation(slug: string) {
		isLoadingConversation = true;

		try {
			const res = await getOneConversation(slug);

			if (res.error) {
				throw new Error(res.error.message);
			}

			if (res.data) {
				conversation = res.data.conversation;
				messages = res.data.messages;
			}
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

		const message = inputMessage;

		inputMessage = '';

		messages = [...messages, { message, author_id: $currentUser.id } as ChatMessage];

		try {
			const response = await addMessageToConversation($page.params.slug, {
				message,
				author_id: $currentUser.id
			});

			if (response.error) {
				throw new Error(response.error.message);
			}

			if (response.data?.createdMessage) {
				messages = [...messages.slice(0, messages.length - 1), response.data.createdMessage];
			}
		} catch (e) {
			if (e instanceof Error) {
				// @Todo handle error
			}
		}
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
					<MessagesBox
						{messagesWithDate}
						user={$currentUser}
						participants={conversation.participants}
					/>
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
