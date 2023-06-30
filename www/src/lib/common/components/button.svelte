<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let preset: 'primary' | 'secondary' | 'accent' = 'primary';
	export let outline = false;
	export let attrs: Record<string, unknown> = {};

	const dispatch = createEventDispatcher<{ click: void }>();

	let restAttrs: Record<string, unknown> = {};
	let className = '';

	$: {
		let { className: _className, ...rest } = attrs;

		className = _className ? ` ${_className}` : '';
		restAttrs = rest;
	}

	const presets = {
		primary: outline ? 'text-primary border-2 border-primary' : 'bg-primary text-text-invert',
		secondary: outline ? 'text-secondary border-2 border-secondary' : 'bg-secondary text-text-base',
		accent: outline
			? 'text-accent border-2 border-accent'
			: 'bg-accent text-text-invert shadow-sm shadow-accent'
	};
</script>

<button
	class="rounded px-4 py-2 font-bold disabled:opacity-50 {presets[preset]}{className}"
	{...restAttrs}
	on:click={() => dispatch('click')}
>
	<slot />
</button>
