<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { Button } from '$lib/components/ui/button';
  import MilitaryInput from '$lib/components/ui/military/MilitaryInput.svelte';
  import toast from 'svelte-french-toast';

  let loading = false;
  let formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  $: isValid = formData.password === formData.confirmPassword && 
               formData.password.length >= 8 &&
               formData.email.includes('@');

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async ({ result }) => {
      loading = false;
      if (result.type === 'success') {
        toast.success('ENLISTMENT SUCCESSFUL');
      } else {
        toast.error('ENLISTMENT FAILED - TRY AGAIN');
      }
    };
  };
</script>

<form 
  method="POST" 
  class="space-y-6 font-mono relative scanline-effect"
  use:enhance={handleSubmit}
>
  <div class="space-y-4">
    <MilitaryInput
      id="username"
      label="CALLSIGN"
      placeholder="ENTER CALLSIGN"
      required
      bind:value={formData.username}
    />

    <MilitaryInput
      id="email"
      label="COMMUNICATION CHANNEL"
      type="email"
      placeholder="ENTER EMAIL"
      required
      bind:value={formData.email}
    />

    <MilitaryInput
      id="password"
      label="SECURITY KEY"
      type="password"
      placeholder="ENTER SECURITY KEY"
      required
      bind:value={formData.password}
    />

    <MilitaryInput
      id="confirmPassword"
      label="CONFIRM SECURITY KEY"
      type="password"
      placeholder="CONFIRM SECURITY KEY"
      required
      bind:value={formData.confirmPassword}
    />
  </div>

  <Button 
    type="submit"
    disabled={loading || !isValid}
    class="tech-button w-full relative"
  >
    <div class="flex items-center justify-center px-8">
      <span class="absolute left-2 text-[#FFD700]/50 select-none">[</span>
      {loading ? 'PROCESSING...' : 'CONFIRM ENLISTMENT'}
      <span class="absolute right-2 text-[#FFD700]/50 select-none">]</span>
    </div>
  </Button>

  <div class="text-center mt-6">
    <a 
      href="/auth/login" 
      class="text-sm text-[#FFD700]/60 hover:text-[#FFD700] transition-colors uppercase tracking-wider"
    >
      [ ALREADY A HELLDIVER? LOGIN HERE ]
    </a>
  </div>
</form>

<style>
  :global(.tech-button) {
    background: rgba(0, 0, 0, 0.8) !important;
    border: 1px solid rgba(255, 215, 0, 0.3) !important;
    color: #FFD700 !important;
    font-family: monospace !important;
    letter-spacing: 0.1em !important;
    padding: 0.75rem !important;
    position: relative;
    overflow: visible !important;
    transition: all 0.3s ease;
  }

  :global(.tech-button:hover) {
    background: rgba(255, 215, 0, 0.1) !important;
    border-color: rgba(255, 215, 0, 0.5) !important;
  }

  :global(.tech-button:disabled) {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  :global(.scanline-effect) {
    position: relative;
  }
</style> 