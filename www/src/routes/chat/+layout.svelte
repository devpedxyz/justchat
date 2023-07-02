<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/user/store';
	import { onMount } from 'svelte';
	import { isSidebarOpen } from './store';
	import { getCurrentUser } from '$lib/user/api-client';
	import Sidebar from './sidebar.svelte';

	onMount(async () => {
		const res = await getCurrentUser();

		if (res.error) {
			throw new Error(res.error.message);
		}

		if (!res.data) {
			return goto('/login');
		}

		currentUser.set(res.data.user);
	});
</script>

<!-- <div data-set-theme="night" class="btn">Night</div>
<div data-set-theme="light" class="btn">Light</div> -->

<div class="h-screen w-screen flex flex-col">
	<div class="flex overflow-y-auto flex-grow">
		<Sidebar isSidebarOpen={$isSidebarOpen} />
		<div class="flex flex-col flex-[1_1_80%]">
			<slot />
		</div>
	</div>
</div>
