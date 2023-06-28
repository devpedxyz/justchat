<script lang="ts">
	import { afterUpdate } from 'svelte';
	import type { ChatMessageWithDate } from '../../../types';

	export let messagesWithDate: ChatMessageWithDate[] = [];
	export let userId: string;

	let chatBox: HTMLUListElement | null = null;

	afterUpdate(() => {
		if (chatBox) {
			chatBox.scrollTop = chatBox.scrollHeight;
		}
	});
</script>

<ul bind:this={chatBox} class="flex flex-col gap-2 flex-grow overflow-y-auto px-4 pt-4">
	{#each messagesWithDate as message, idx}
		{#if messagesWithDate[idx - 1] && message.date && messagesWithDate[idx - 1].date && message.date.getDay() !== messagesWithDate[idx - 1].date?.getDay()}
			<li class="text-center text-x-300">{message.date.toDateString()}</li>
		{/if}
		<li class="flex gap-2 items-end {message.author_id === userId ? ' flex-row-reverse' : ''}">
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
				<span class="text-x-300" title={message.date?.toLocaleString()}>{message.created_at}</span>
			{/if}
		</li>
	{/each}
</ul>
