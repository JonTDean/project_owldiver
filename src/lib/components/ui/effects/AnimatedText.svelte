<script lang="ts">
  import { onMount } from 'svelte';
  import { pageLoadAnimation } from '$lib/stores/pageLoadAnimation';

  export let title: string;
  export let subtitle: string;

  onMount(() => {
    pageLoadAnimation.startAnimation(title, subtitle);
  });
</script>

<div class="text-center space-y-2 mb-6 tech-frame scanline-effect">
  <h1 class="text-2xl font-bold text-[#FFD700] tracking-wider">
    {$pageLoadAnimation.titleTyped}
    {#if $pageLoadAnimation.isAnimating && $pageLoadAnimation.titleTyped.length < title.length}
      <span class="cursor">_</span>
    {/if}
  </h1>
  
  <p class="text-sm text-[#FFD700]/70 tracking-widest">
    {$pageLoadAnimation.subtitleTyped}
    {#if $pageLoadAnimation.isAnimating && $pageLoadAnimation.titleTyped === title && $pageLoadAnimation.subtitleTyped.length < subtitle.length}
      <span class="cursor">_</span>
    {/if}
  </p>
</div>

<style>
  .tech-frame {
    position: relative;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
  }

  .cursor {
    display: inline-block;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }

  :global(.scanline-effect) {
    position: relative;
  }
</style> 