<script lang="ts">
	import '../app.postcss';
	import { Toaster } from 'svelte-french-toast';
	import Navbar from '$lib/components/Navbar.svelte';
	import { page } from '$app/stores';
	let { children } = $props();
  </script>
  
  <Toaster />
  <div class="min-h-screen w-full">
	<Navbar />
	{#if $page.url.pathname === '/'}
	  {@render children?.()}
	{:else}
	  <main class="w-full">
		{@render children?.()}
	  </main>
	{/if}
  </div>