<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

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

	const navItems = [
		{ href: '/active_operations', label: 'ACTIVE OPERATIONS' },
		{ href: '/loadouts', label: 'LOADOUTS' },
		{ href: '/personnel', label: 'PERSONNEL' },
		{ href: '/mission_history', label: 'MISSION HISTORY' },
		{ href: '/commendations', label: 'COMMENDATIONS' },
	];

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
		<!-- Navigation -->
		<nav class="border-b border-themed backdrop-blur-sm bg-background/80 sticky top-0 z-50">
			<div class="container max-w-7xl mx-auto px-4">
				<div class="flex items-center justify-between h-16">
					<!-- Logo -->
					<a href="/dashboard" class="flex items-center gap-2">
						<div class="w-2 h-2 bg-primary animate-pulse rounded-full"></div>
						<span class="font-mono text-primary text-sm tracking-[0.2em]">OWLDIVER</span>
					</a>

					<!-- Navigation Links -->
					<div class="hidden md:flex items-center gap-6">
						{#each navItems as { href, label }}
							<a
								{href}
								class="font-mono text-xs tracking-[0.1em] text-muted hover:text-primary transition-colors
									   {$page.url.pathname === href ? 'text-primary' : ''}"
							>
								{label}
							</a>
						{/each}
					</div>

					<!-- User Menu -->
					<div class="flex items-center gap-4">
						<a 
							href="/auth/account-settings"
							class="font-mono text-xs tracking-[0.1em] text-muted hover:text-primary transition-colors"
						>
							SETTINGS
						</a>
						<form action="/auth/logout" method="POST">
							<button 
								type="submit"
								class="font-mono text-xs tracking-[0.1em] text-primary hover:text-red-400 transition-colors"
							>
								LOGOUT
							</button>
						</form>
					</div>
				</div>
			</div>
		</nav>
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