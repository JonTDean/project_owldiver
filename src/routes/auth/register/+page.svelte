<script lang="ts">
  import { TerminalPanel, TerminalForm, BootSequence } from "$lib/components/ui/layout/terminal";
  import { EtherealBackground } from "$lib/components/ui/effects";
  import type { ActionData } from './$types';
  import toast from "svelte-french-toast";
  import { onMount } from 'svelte';
  
  export let form: ActionData;

  let loading = false;
  let formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Form validation
  $: isValid = formData.password === formData.confirmPassword && 
               formData.password.length >= 8 &&
               formData.email.includes('@');

  const fields = ['username', 'email', 'password', 'confirmPassword'];
  const bootSequenceLines = [
    "INITIALIZING SUPER EARTH DEFENSE NETWORK...",
    "ESTABLISHING SECURE CONNECTION...",
    "LOADING REGISTRATION PROTOCOLS...",
    "STANDING BY FOR NEW RECRUIT DATA..."
  ];

  let currentBootLine = 0;
  let showBootSequence = true;

  function handleSubmit() {
    if (!isValid) {
      toast.error('Please check your form inputs');
      return;
    }
    loading = true;
  }

  onMount(() => {
    const interval = setInterval(() => {
      currentBootLine++;
      if (currentBootLine >= bootSequenceLines.length) {
        showBootSequence = false;
        clearInterval(interval);
      }
    }, 800);
  });
</script>

<BootSequence 
  lines={bootSequenceLines}
  show={showBootSequence}
  currentLine={currentBootLine}
/>

<div class="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-black">
  <EtherealBackground />

  <div class="w-full max-w-md space-y-8 relative z-10">
    <TerminalPanel 
      title="ENLISTMENT TERMINAL"
      securityLevel="ALPHA"
      statusMessage="AWAITING CREDENTIALS"
    />

    <TerminalForm
      {fields}
      {formData}
      {loading}
      error={form?.message}
      onSubmit={handleSubmit}
    />
  </div>
</div>
