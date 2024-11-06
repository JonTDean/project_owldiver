<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { onMount, tick } from 'svelte';
  import { formAnimation } from '$lib/stores/formAnimation';

  export let id: string;
  export let label: string;
  export let type: string = "text";
  export let placeholder: string;
  export let required: boolean = false;
  export let value: string = "";

  let labelTyped = "";
  let isFocused = false;
  let typingStarted = false;
  let mounted = false;
  
  async function typeLabel() {
    if (typingStarted) return;
    typingStarted = true;
    
    labelTyped = "";
    await tick();
    
    for (let i = 0; i <= label.length; i++) {
      labelTyped = label.slice(0, i);
      await new Promise(resolve => setTimeout(resolve, 25));
    }
  }

  onMount(() => {
    mounted = true;
  });

  // Reset and start animation when the store updates
  $: if ($formAnimation.shouldAnimate && mounted) {
    typingStarted = false;
    labelTyped = "";
    typeLabel();
  }
</script>

<div 
  class="space-y-2 military-input-container" 
  class:mounted
  class:focused={isFocused}
>
  <Label 
    class="text-[#FFD700] uppercase tracking-widest text-xs flex items-center" 
    for={id}
  >
    <span class="mr-1 terminal-prompt opacity-80">> </span>
    <span class="label-text">
      {labelTyped}
      {#if labelTyped.length < label.length}
        <span class="cursor">_</span>
      {/if}
    </span>
  </Label>
  
  <div class="input-frame" class:focused={isFocused}>
    <div class="glow-effect"></div>
    <Input
      {id}
      name={id}
      {type}
      class="tech-input"
      {placeholder}
      {required}
      bind:value
      on:focus={() => isFocused = true}
      on:blur={() => isFocused = false}
    />
    <div class="corner-tl"></div>
    <div class="corner-tr"></div>
    <div class="corner-bl"></div>
    <div class="corner-br"></div>
  </div>
</div>

<style>
  .military-input-container {
    opacity: 0;
    transform: translateY(5px);
  }

  .military-input-container.mounted {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .cursor {
    display: inline-block;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }

  .input-frame {
    position: relative;
    padding: 1px;
    background: linear-gradient(90deg, 
      rgba(255, 215, 0, 0.2),
      rgba(255, 215, 0, 0.1),
      rgba(255, 215, 0, 0.2)
    );
    overflow: hidden;
  }

  /* Glowing border effect */
  .glow-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 215, 0, 0.2),
      transparent
    );
    transition: transform 0.3s ease;
    pointer-events: none;
  }

  .input-frame.focused .glow-effect {
    animation: glowMove 2s linear infinite;
  }

  @keyframes glowMove {
    0% {
      left: -100%;
    }
    100% {
      left: 200%;
    }
  }

  .corner-tl, .corner-tr, .corner-bl, .corner-br {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px solid rgba(255, 215, 0, 0.5);
    transition: border-color 0.3s ease;
  }

  .input-frame.focused .corner-tl,
  .input-frame.focused .corner-tr,
  .input-frame.focused .corner-bl,
  .input-frame.focused .corner-br {
    border-color: rgba(255, 215, 0, 0.8);
  }

  .corner-tl {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
  }

  .corner-tr {
    top: -1px;
    right: -1px;
    border-left: none;
    border-bottom: none;
  }

  .corner-bl {
    bottom: -1px;
    left: -1px;
    border-right: none;
    border-top: none;
  }

  .corner-br {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
  }

  .terminal-prompt {
    color: rgba(255, 215, 0, 0.8);
  }

  /* Override default focus styles */
  :global(.tech-input) {
    width: 100%;
    background: rgba(0, 0, 0, 0.8) !important;
    border: none !important;
    color: #FFD700 !important;
    font-family: monospace !important;
    letter-spacing: 0.1em !important;
    padding: 0.75rem !important;
  }

  :global(.tech-input::placeholder) {
    color: rgba(255, 215, 0, 0.3) !important;
  }

  :global(.tech-input:focus) {
    outline: none !important;
    box-shadow: none !important;
  }

  /* Selection style override */
  :global(.tech-input::selection) {
    background: rgba(255, 215, 0, 0.2) !important;
    color: #FFD700 !important;
  }

  :global(.tech-input::-moz-selection) {
    background: rgba(255, 215, 0, 0.2) !important;
    color: #FFD700 !important;
  }
</style> 