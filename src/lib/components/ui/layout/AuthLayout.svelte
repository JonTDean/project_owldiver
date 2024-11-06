<script lang="ts">
  import EtherealBackground from '../effects/EtherealBackground.svelte';
  import AnimatedText from '../effects/AnimatedText.svelte';
  import TerminalText from '../effects/TerminalText.svelte';
  import { bootState } from '$lib/stores/bootSequence';
  
  export let title: string;
  export let subtitle: string;
  export let mode: 'login' | 'register';
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-black relative">
  <EtherealBackground />
  
  <main class="w-full max-w-md space-y-8 relative z-10">
    
    {#if !$bootState.terminalComplete}
      <div class="tech-frame mb-6">
        <TerminalText />
      </div>
    {/if}
    
    {#if $bootState.formVisible}
      <div class="tech-frame scanline-container" class:fade-in={$bootState.formVisible}>
        <slot />
      </div>
    {/if}
  </main>
</div>

<style>
  .tech-frame {
    position: relative;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
    color: #FFD700;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
  }

  .tech-frame::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 1px solid rgba(255, 215, 0, 0.1);
    pointer-events: none;
  }

  /* Standardized scanline effect */
  :global(.scanline-effect::after) {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(0, 0, 0, 0.5) 50%
    );
    background-size: 100% 2px;
    pointer-events: none;
    animation: globalScan 8s linear infinite;
  }

  @keyframes globalScan {
    from { background-position: 0 0; }
    to { background-position: 0 100%; }
  }

  .fade-in {
    animation: fadeIn 0.5s ease forwards;
    opacity: 0;
  }

  @keyframes fadeIn {
    from { 
      opacity: 0;
      transform: translateY(10px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>