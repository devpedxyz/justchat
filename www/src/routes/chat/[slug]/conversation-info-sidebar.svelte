<script lang="ts">
	import type { Conversation } from '$lib/chat/types';
	import Sidebar from '$lib/common/components/sidebar.svelte';
	import { X } from 'lucide-svelte';
	import { isConversationInfoSidebarOpen } from '../store';

	export let conversation: Conversation | null = null;
	export let isLoading = false;
</script>

<Sidebar bind:isSidebarOpen={$isConversationInfoSidebarOpen}>
	<svelte:fragment slot="toggler" let:toggler>
		<button class="rounded" on:click={toggler}><X /></button>
	</svelte:fragment>
	<p slot="header" class="text-2xl font-bold text-primary">Converstaion Info</p>
	<svelte:fragment slot="body">
		{#if isLoading}
			<p>Loading...</p>
		{:else if conversation}
			<div class="mb-8">
				<h3 class="font-bold">General</h3>
				<p class="p-4">
					Created at {new Date(conversation.created_at).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</p>
			</div>
			<div class="mb-8">
				<h3 class="font-bold">Participants</h3>
				<ul>
					{#each conversation.participants as participant}
						<li class="flex items-center gap-4 p-4">
							<img
								class="rounded-full w-10 h-10"
								src={participant.user.profile_image_url}
								alt=""
								srcset=""
							/>
							<span>{participant.user.first_name} {participant.user.last_name}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		<!-- <pre>{JSON.stringify(conversation, null, 2)}</pre> -->
	</svelte:fragment>
</Sidebar>
