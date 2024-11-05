<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';

	// Apply theme CSS variables
	$: themeStyles = `
		--color-primary: ${$theme.colors.primary};
		--color-background: ${$theme.colors.background};
		--color-foreground: ${$theme.colors.foreground};
		--color-accent: ${$theme.colors.accent};
		--color-muted: ${$theme.colors.muted};
		--color-border: ${$theme.colors.border};
		--font-mono: ${$theme.fonts.mono};
		--font-sans: ${$theme.fonts.sans};
	`;

	onMount(() => {
		// Load JetBrains Mono font
		const link = document.createElement('link');
		link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap';
		link.rel = 'stylesheet';
		document.head.appendChild(link);
	});
</script>

<div 
	class="min-h-screen bg-background text-foreground font-sans"
	style={themeStyles}
>
	{#if $page.data.user}
		<Navbar />
	{/if}

	<!-- Main Content -->
	<main class="min-h-[calc(100vh-4rem)]">
		<slot />
	</main>
</div>

<style>
	:global(:root) {
		color-scheme: dark;
	}

	:global(body) {
		background-color: var(--color-background);
		color: var(--color-foreground);
	}

	:global(.font-mono) {
		font-family: var(--font-mono);
	}

	:global(.bg-background) {
		background-color: var(--color-background);
	}

	:global(.text-foreground) {
		color: var(--color-foreground);
	}

	:global(.border-primary) {
		border-color: var(--color-primary);
	}

	:global(.text-primary) {
		color: var(--color-primary);
	}

	:global(.bg-accent) {
		background-color: var(--color-accent);
	}

	:global(.text-muted) {
		color: var(--color-muted);
	}

	:global(.border-themed) {
		border-color: var(--color-border);
	}
</style>