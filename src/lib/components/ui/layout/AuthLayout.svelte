<script lang="ts">
  import EtherealBackground from '../effects/EtherealBackground.svelte';
  import TerminalText from '../effects/TerminalText.svelte';
  import { bootState, bootComplete, resetBoot, shouldShowBoot, clearHistory } from '$lib/stores/bootSequence';
  import { quintOut } from 'svelte/easing';
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  
  export let title: string;
  export let subtitle: string;
  export let mode: 'login' | 'register';

  let showTerminal = false;
  let initialized = false;

  // Determine if we're entering or exiting based on the path
  $: isExiting = $page.url.pathname === '/auth/logout' || 
                 $page.url.pathname === '/dashboard';

  // Form transitions
  const formTransitionIn = (node: HTMLElement) => {
    return {
      duration: 400,
      css: (t: number) => {
        const eased = quintOut(t);
        return `
          opacity: ${t};
          transform: 
            perspective(1000px)
            rotateX(${(1 - eased) * 20}deg)
            scale(${0.9 + (eased * 0.1)});
        `;
      }
    };
  };

  const formTransitionOut = (node: HTMLElement) => {
    return {
      duration: 300,
      css: (t: number) => {
        const eased = quintOut(t);
        return `
          opacity: ${t};
          transform: 
            perspective(1000px)
            rotateX(${(1 - eased) * -20}deg)
            scale(${0.9 + (t * 0.1)});
        `;
      }
    };
  };

  // Debug logs
  $: console.log('Current path:', $page.url.pathname);
  $: console.log('Show Terminal:', showTerminal);

  // Check navigation on route changes
  $: if (browser && initialized) {
    const shouldShow = shouldShowBoot($page.url.pathname);
    console.log('Route change - should show boot:', shouldShow);
    
    if (shouldShow) {
      console.log('Showing terminal');
      showTerminal = true;
      resetBoot();
    }
  }

  onMount(() => {
    if (browser) {
      const shouldShow = shouldShowBoot($page.url.pathname);
      console.log('Initial mount - should show boot:', shouldShow);
      
      if (shouldShow) {
        showTerminal = true;
        resetBoot();
      }
      
      initialized = true;
    }
  });

  onDestroy(() => {
    // Clear history when leaving auth pages
    if (!$page.url.pathname.includes('/auth/')) {
      clearHistory();
    }
  });

  const handleTerminalComplete = () => {
    console.log('Terminal sequence completed');
    setTimeout(() => {
      showTerminal = false;
      bootComplete.set(true);
      bootState.set({ terminalComplete: true, formVisible: true });
    }, 1500);
  };

  function typewriter(node: HTMLElement, { speed = 50, delay = 0 } = {}) {
    const text = node.textContent || '';
    const duration = text.length * speed;

    return {
      delay,
      duration,
      tick: (t: number) => {
        const i = Math.trunc(text.length * t);
        node.textContent = text.slice(0, i);
      }
    };
  }
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-black relative">
  <EtherealBackground />
  
  <main class="w-full max-w-md space-y-8 relative z-10">
    {#if showTerminal}
      <div class="terminal-overlay">
        <TerminalText 
          onComplete={handleTerminalComplete} 
          mode={isExiting ? 'exit' : 'enter'}
        />
      </div>
    {:else}
      {#key mode}
        <div 
          class="form-container"
          in:formTransitionIn
          out:formTransitionOut
        >
          <div class="retro-type-effect">
            <div class="text-center mb-6">
              {#key title}
                <h2 
                  class="text-2xl font-bold tracking-wider"
                  in:typewriter={{ speed: 50 }}
                >
                  {title}
                </h2>
              {/key}
              {#key subtitle}
                <p 
                  class="text-sm opacity-70 mt-2"
                  in:typewriter={{ speed: 30, delay: 500 }}
                >
                  {subtitle}
                </p>
              {/key}
            </div>
          </div>
          <div class="form-content">
            <slot />
          </div>
          <div class="corner-decorations"></div>
        </div>
      {/key}
    {/if}
  </main>
</div>

<style>
  .terminal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }

  .form-container {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 215, 0, 0.3);
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .corner-decorations::before,
  .corner-decorations::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 1px solid rgba(255, 215, 0, 0.5);
  }

  .corner-decorations::before {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }

  .corner-decorations::after {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }

  .retro-type-effect :global(*) {
    font-family: monospace;
  }

  .form-content {
    position: relative;
    z-index: 1;
  }
</style>