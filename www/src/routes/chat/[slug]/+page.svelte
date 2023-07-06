<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Info, XCircle } from 'lucide-svelte';
	import type { ChatMessage, Conversation, ChatMessageWithDate } from '$lib/chat/types';
	import MessageInput from './message-input.svelte';
	import MessagesBox from './messages-box.svelte';
	import { goto } from '$app/navigation';
	import { header, isConversationInfoSidebarOpen } from '../store';
	import { addMessageToConversation, getOneConversation } from '$lib/chat/api-client';
	import { currentUser } from '$lib/user/store';
	import Main from '../main.svelte';
	import Header from '../header.svelte';
	import Button from '$lib/common/components/button.svelte';
	import ConversationInfoSidebar from './conversation-info-sidebar.svelte';

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

<div class="flex flex-col flex-[1_1_70%] flex-grow">
	<Header heading={conversation?.name || '...'}>
		<div class="flex justify-end">
			<Button
				preset="secondary"
				on:click={() => isConversationInfoSidebarOpen.set(!$isConversationInfoSidebarOpen)}
				><Info /></Button
			>
		</div>
	</Header>
	<Main>
		{#if isLoadingConversation}
			<div class="flex items-center justify-center flex-grow">
				<span class="loading loading-ring loading-lg">Loading...</span>
			</div>
		{:else if errorLoadingConversation}
			<div class="flex items-start justify-around flex-grow p-4">
				<div class="flex flex-col items-center justify-center gap-4 max-w-[50%] my-8">
					<XCircle color="red" />
					<span>{errorLoadingConversation.message}</span>
				</div>
			</div>
		{:else if conversation}
			<div class="flex flex-col w-full h-full bg-chat-chatbox">
				<div class="flex flex-col w-full flex-grow min-h-0">
					<div class="chat-room flex min-h-0 flex-grow bg-chat-chatbox">
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
	</Main>
</div>
<ConversationInfoSidebar {conversation} isLoading={isLoadingConversation} />
