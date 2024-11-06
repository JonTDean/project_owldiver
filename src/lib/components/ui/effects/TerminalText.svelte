<script lang="ts">
  import { onMount } from 'svelte';
  import { bootState } from '$lib/stores/bootSequence';
  import { fade } from 'svelte/transition';

  const bootMessages = [
    '>> INITIATING QUANTUM ENCRYPTION PROTOCOLS',
    '>> ESTABLISHING SECURE NEURAL LINK',
    '[!] BIOMETRIC SCAN REQUIRED',
    '>> VERIFYING GENETIC SIGNATURE',
    '[!] CLASSIFIED ACCESS POINT DETECTED',
    '>> BYPASSING CYBER-DEFENSE MATRIX',
    '>> ACCESSING RESTRICTED DATABASE',
    '[!] SECURITY CLEARANCE: ULTRAVIOLET',
    '>> NEURAL HANDSHAKE COMPLETE'
  ];

  let currentMessageIndex = 0;
  let messages: string[] = [];
  let progress = 0;
  let visible = false;

  async function typeMessage(message: string) {
    let typed = '';
    for (const char of message) {
      typed += char;
      messages[currentMessageIndex] = typed;
      messages = messages;
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    await new Promise(resolve => setTimeout(resolve, 50));
    currentMessageIndex++;
    progress = (currentMessageIndex / bootMessages.length) * 100;
  }

  onMount(async () => {
    bootState.set({ terminalComplete: false, formVisible: false });
    visible = true;
    
    for (const message of bootMessages) {
      messages.push('');
      await typeMessage(message);
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    visible = false;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    bootState.update(state => ({ ...state, terminalComplete: true }));
    await new Promise(resolve => setTimeout(resolve, 150));
    bootState.update(state => ({ ...state, formVisible: true }));
  });
</script>

{#if visible}
  <div 
    class="font-mono text-sm space-y-1 terminal-container"
    transition:fade={{ duration: 500 }}
  >
    <div class="mb-6 text-center">
      <div class="text-xs tracking-[0.3em] mb-2 text-[#FFD700]/70">TOP SECRET</div>
      <div class="text-xl font-bold mb-2">QUANTUM DEFENSE NETWORK</div>
      <div class="text-[10px] tracking-[0.2em] opacity-70">
        CLASSIFIED TERMINAL - LEVEL 5 CLEARANCE REQUIRED
      </div>
    </div>

    <div class="space-y-2">
      {#each messages as message, i}
        <div 
          class="flex items-start message-line" 
          class:warning={message.includes('[!')}
          style="animation-delay: {i * 0.1}s"
        >
          <span class="mr-2 opacity-50 min-w-[40px] text-right">
            {(i + 1).toString().padStart(2, '0')}
          </span>
          <span>{message}</span>
          {#if i === currentMessageIndex && !$bootState.terminalComplete}
            <span class="ml-1 animate-blink">_</span>
          {/if}
        </div>
      {/each}
    </div>

    <div class="mt-6">
      <div class="flex justify-between text-xs mb-2">
        <span>NEURAL INTERFACE SYNC</span>
        <span class="font-bold">{Math.floor(progress)}%</span>
      </div>
      <div class="w-full bg-[#FFD700]/10 h-1">
        <div 
          class="h-full bg-[#FFD700] transition-all duration-300 ease-linear"
          style="width: {progress}%"
        />
      </div>
    </div>
  </div>
{/if}

<style>
  .terminal-container {
    position: relative;
    color: #FFD700;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
    padding: 1rem;
  }

  .message-line {
    opacity: 0;
    animation: fadeIn 0.3s ease forwards;
  }

  .warning {
    color: #ff3e3e;
    text-shadow: 0 0 5px rgba(255, 62, 62, 0.5);
  }

  .animate-blink {
    animation: blink 1s step-end infinite;
  }

  /* Clean scanline effect */
  .terminal-container::after {
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
    background-size: 100% 4px;
    pointer-events: none;
    animation: scan 10s linear infinite;
  }

  @keyframes scan {
    from { background-position: 0 0; }
    to { background-position: 0 100%; }
  }

  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style> 