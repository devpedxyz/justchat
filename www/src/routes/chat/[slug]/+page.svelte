<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ChatRoomResponse } from './+page.server';

	export let data: ChatRoomResponse | null = null;
</script>

<div class="flex flex-col w-full">
	<div class="chat-room p-4 flex min-h-16 flex-grow overflow-y-auto">
		{#if data && data.chatRoom}
			{#if data.messages.length > 0}
				<ul>
					{#each data.messages as message}
						<li>{message.message}</li>
					{/each}
				</ul>
			{:else}
				<div class="flex items-center justify-center flex-grow">
					<p>Start chatting!</p>
				</div>
			{/if}
		{/if}
	</div>
	<form
		method="POST"
		action="?/sendMessage"
		class="text-box flex flex-shrink flex-col justify-between gap-4 sm:flex-row"
		use:enhance
	>
		<input type="hidden" name="chatRoomId" value={data?.chatRoom?.id} />
		<input
			type="text"
			id="message"
			name="message"
			class="input flex-grow bg-[rgba(255,255,255,0.1)]"
			placeholder="Enter your message here"
		/>
		<button type="submit" class="btn btn-primary" disabled={!data || !data.chatRoom}>Send</button>
	</form>
</div>
