<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutData } from './$types';
	import { Toaster } from 'svelte-french-toast';
	import toast from 'svelte-french-toast';
	import LoadingScreen from '$lib/components/ui/loading/LoadingScreen.svelte';
	import { isLoading } from '$lib/stores/loading'; // Import the loading store

	export let data: LayoutData;

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

	// Navigation guard for client-side routing
	$: {
		const publicRoutes = ['/auth/register', '/auth/login', '/about', '/'];
		const authRoutes = ['/auth/register', '/auth/login', '/'];
		const isPublicRoute = publicRoutes.includes($page.url.pathname);
		const isAuthRoute = authRoutes.includes($page.url.pathname);

		if (data.user) {
			if (isAuthRoute) {
				goto('/dashboard');
			}
		} else if (!isPublicRoute) {
			goto('/auth/login');
		}
	}

	// Watch for flash messages in the page data
	$: if ($page.data.flash?.message) {
		const { message, type } = $page.data.flash;
		const toastOptions = {
			style: `
				border: 1px solid #FFD700;
				background: rgba(0, 0, 0, 0.95);
				color: #FFD700;
				font-family: monospace;
				padding: 16px;
				text-transform: uppercase;
				letter-spacing: 0.1em;
				box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
			`,
			icon: type === 'success' ? '⭐' : '⚠️',
			duration: 4000,
		};

		if (type === 'success') {
			toast.success(message, toastOptions);
		} else {
			toast.error(message, toastOptions);
		}
	}
</script>

<div style={themeStyles}>


	<!-- Navbar -->
	<Navbar user={data.user} />

	<!-- Loading Screen -->
	{#if $page.url.pathname === '/'}
		<!-- Navigation Loading Indicator -->
		{#if $navigating}
			<div class="loading"></div>
		{/if}
		<LoadingScreen loading={$isLoading} />
	{/if}

	<!-- Main Content -->
	<main>
		<slot />
	</main>

	<!-- Toast Notifications -->
	<Toaster />
</div>

<style>
	:global(:root) {
		color-scheme: dark;
	}

	:global(body) {
		background-color: var(--color-background);
		color: var(--color-foreground);
		margin: 0; /* Reset default margin to prevent unexpected spacing */
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

	.loading {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(to right, #4f46e5, #818cf8);
		animation: loading 1s infinite;
		z-index: 999; /* Ensure it sits below the loading screen */
	}

	@keyframes loading {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>