<script lang="ts">
	import '../app.postcss';
	import { Toaster } from 'svelte-french-toast';
	import Navbar from '$lib/components/Navbar.svelte';
	let { children } = $props();
</script>

<Toaster />
<div class="min-h-screen w-full">
	<Navbar />
	<main class="w-full">
		{@render children?.()}
	</main>
</div>
