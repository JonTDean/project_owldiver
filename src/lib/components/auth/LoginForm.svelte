<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { Button } from '$lib/components/ui/button';
  import MilitaryInput from '$lib/components/ui/input/MilitaryInput.svelte';
  import militaryToast from '$lib/components/ui/toast/military-toast';
  import MilitaryHeader from '$lib/components/ui/header/MilitaryHeader.svelte';
  import { clearHistory } from '$lib/stores/bootSequence';

  let loading = false;

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async ({ result }) => {
      loading = false;
      
      if (result.type === 'success') {
        militaryToast.success('ACCESS GRANTED - WELCOME BACK HELLDIVER');
        await goto('/dashboard', { replaceState: true });
      } else if (result.type === 'failure') {
        militaryToast.error(result.data?.message || 'ACCESS DENIED - INVALID CREDENTIALS');
      } else {
        militaryToast.warning('SYSTEM MALFUNCTION - PLEASE TRY AGAIN');
      }
    };
  };

  const handleSteamLogin = () => {
    console.log('Steam login button clicked');
    window.location.href = '/auth/steam/login';
  };
</script>

<div class="relative w-full h-full">
  <MilitaryHeader
    title="SUPER EARTH TERMINAL"
    subtitle="AUTHENTICATION REQUIRED"
    securityLevel="LEVEL 5"
  />

  <div class="space-y-6 font-mono relative">
    <form 
      class="space-y-4"
      method="POST" 
      action="?/login"
      use:enhance={handleSubmit}
    >
      <MilitaryInput
        id="identifier"
        name="identifier"
        label="IDENTIFICATION CODE"
        placeholder="ENTER CREDENTIALS"
        required
      />

      <MilitaryInput
        id="password"
        name="password"
        label="SECURITY KEY"
        type="password"
        placeholder="ENTER SECURITY KEY"
        required
      />

      <Button 
        type="submit"
        class="tech-button w-full relative mt-4"
        disabled={loading}
      >
        <div class="flex items-center justify-center px-8">
          <span class="absolute left-2 text-[#FFD700]/50 select-none">[</span>
          <span class="text-center">
            {loading ? 'PROCESSING...' : 'AUTHENTICATE'}
          </span>
          <span class="absolute right-2 text-[#FFD700]/50 select-none">]</span>
        </div>
      </Button>
    </form>

    <div class="space-y-4">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t border-[#FFD700]/30" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-black px-2 text-[#FFD700]/50">Or continue with</span>
        </div>
      </div>

      <Button 
        type="button"
        class="tech-button w-full relative"
        on:click={handleSteamLogin}
      >
        <div class="flex items-center justify-center gap-2">
          <span class="absolute left-2 text-[#FFD700]/50 select-none">[</span>
          <span class="text-center">LOGIN WITH STEAM</span>
          <span class="absolute right-2 text-[#FFD700]/50 select-none">]</span>
        </div>
      </Button>

      <div class="text-center space-y-2">
        <p class="text-sm text-[#FFD700]/70">
          NEW RECRUIT?
        </p>
        <a 
          href="/auth/register" 
          class="text-sm text-[#FFD700] hover:text-[#FFD700]/80 transition-colors"
          on:click|preventDefault={() => {
            clearHistory();
            goto('/auth/register');
          }}
        >
          <span class="text-[#FFD700]/50">[</span>
          ENLIST NOW
          <span class="text-[#FFD700]/50">]</span>
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  :global(.tech-button) {
    background: rgba(0, 0, 0, 0.8) !important;
    border: 1px solid rgba(255, 215, 0, 0.3) !important;
    color: #FFD700 !important;
    font-family: monospace !important;
    letter-spacing: 0.1em !important;
    padding: 0.75rem !important;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    min-height: 2.75rem !important;
  }

  :global(.tech-button:hover) {
    background: rgba(255, 215, 0, 0.1) !important;
    border-color: rgba(255, 215, 0, 0.5) !important;
  }

  :global(.tech-button:disabled) {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  :global(.cyber-terminal) {
    background: transparent;
  }
</style> 