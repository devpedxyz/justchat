<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { themeChange } from 'theme-change';

	onMount(() => {
		themeChange(false);
	});
</script>

<slot />
