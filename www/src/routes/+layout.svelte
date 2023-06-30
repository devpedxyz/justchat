<script>
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import '../app.css';

	onMount(() => {
		themeChange(false);
	});
</script>

<div data-set-theme="night" class="btn">Night</div>
<div data-set-theme="light" class="btn">Light</div>
<slot />
