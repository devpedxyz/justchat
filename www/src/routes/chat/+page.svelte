<script lang="ts">
	import Header from './header.svelte';
	import Main from './main.svelte';
	import { isChatSidebarOpen } from './store';
</script>

<Header showSidebarToggler={!$isChatSidebarOpen} heading="Select a chat room" />
<Main>
	<p class="text-center flex-grow text-2xl my-16 px-4">Select a chat room</p>
</Main>
