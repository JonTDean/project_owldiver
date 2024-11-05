<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { enhance } from "$app/forms";
  import toast from "svelte-french-toast";
  import type { ActionData } from './$types';
  import type { CustomToastOptions } from '$lib/types/toast';

  const toastOptions: CustomToastOptions = {
    duration: 3000,
    position: 'top-center'
  };

  const form: ActionData | undefined = undefined;

  let loading = false;
  let step = 1;
  const totalSteps = 3;

  let formData = {
    codename: '',
    nationality: '',
    motivation: '',
  };

  $: isValid = formData.codename.length >= 3 && 
               formData.nationality.length > 0 && 
               formData.motivation.length > 0;

  function nextStep() {
    if (step < totalSteps) step++;
  }

  function prevStep() {
    if (step > 1) step--;
  }

  // Progress indicator data
  const steps = [
    { number: 1, title: 'CODENAME', description: 'FIELD IDENTIFIER' },
    { number: 2, title: 'ORIGIN', description: 'SECTOR ASSIGNMENT' },
    { number: 3, title: 'MOTIVATION', description: 'SERVICE RECORD' }
  ];
</script>

<div class="min-h-screen flex items-center justify-center px-4">
  <div class="w-full max-w-2xl space-y-8">
    <!-- Header -->
    <div class="text-center space-y-2">
      <div class="flex items-center justify-center gap-2">
        <div class="w-2 h-2 bg-primary animate-pulse rounded-full"></div>
        <h2 class="text-sm font-mono tracking-widest text-primary">SUPER EARTH MILITARY COMMAND</h2>
      </div>
      <h1 class="text-3xl font-bold text-foreground uppercase tracking-wider">Profile Setup</h1>
      <p class="text-[10px] text-muted font-mono tracking-[0.2em]">
        STEP {step} OF {totalSteps}
      </p>
    </div>

    <div class="relative mb-12">
      <!-- Progress Bar -->
      <div class="absolute top-1/2 left-0 w-full h-0.5 bg-muted/30">
        <div 
          class="h-full bg-primary transition-all duration-300"
          style="width: {((step - 1) / (totalSteps - 1)) * 100}%"
        ></div>
      </div>

      <!-- Step Indicators -->
      <div class="relative z-10 flex justify-between">
        {#each steps as { number, title, description }}
          <div class="flex flex-col items-center">
            <div 
              class="w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-sm
                     {number < step ? 'bg-primary border-primary text-background' : 
                      number === step ? 'border-primary text-primary' : 
                      'border-muted text-muted'}"
            >
              {number < step ? '✓' : number}
            </div>
            <div class="mt-2 text-center">
              <p class="text-xs font-mono tracking-wider 
                        {number <= step ? 'text-primary' : 'text-muted'}">
                {title}
              </p>
              <p class="text-[10px] font-mono text-muted mt-0.5">
                {description}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <form 
      method="POST" 
      class="space-y-8"
      use:enhance={() => {
        loading = true;
        return async ({ result }) => {
          loading = false;
          if (result.type === 'success') {
            toast.success('Welcome to the Owl Enforcers!', toastOptions);
            window.location.href = '/dashboard';
          } else if (result.type === 'failure') {
            toast.error(result.data?.message || 'Profile setup failed', toastOptions);
          }
        };
      }}
    >
      <!-- Step 1: Codename -->
      {#if step === 1}
        <div class="space-y-4">
          <div class="text-center space-y-2">
            <h3 class="text-lg font-bold">Choose Your Codename</h3>
            <p class="text-sm text-muted">This will be your identifier in the field</p>
          </div>
          
          <Input
            type="text"
            name="codename"
            placeholder="ENTER CODENAME"
            class="font-mono text-center text-xl uppercase"
            bind:value={formData.codename}
            required
          />
        </div>
      {/if}

      <!-- Step 2: Nationality -->
      {#if step === 2}
        <div class="space-y-4">
          <div class="text-center space-y-2">
            <h3 class="text-lg font-bold">Your Origin</h3>
            <p class="text-sm text-muted">Which sector of Super Earth do you represent?</p>
          </div>
          
          <Input
            type="text"
            name="nationality"
            placeholder="ENTER NATIONALITY"
            class="font-mono text-center"
            bind:value={formData.nationality}
            required
          />
        </div>
      {/if}

      <!-- Step 3: Motivation -->
      {#if step === 3}
        <div class="space-y-4">
          <div class="text-center space-y-2">
            <h3 class="text-lg font-bold">Your Calling</h3>
            <p class="text-sm text-muted">Why did you join the Helldivers?</p>
          </div>
          
          <Textarea
            name="motivation"
            placeholder="SHARE YOUR STORY"
            class="font-mono min-h-[150px]"
            bind:value={formData.motivation}
            required
          />
        </div>
      {/if}

      <!-- Navigation Buttons -->
      <div class="flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          class="flex-1 font-mono"
          on:click={prevStep}
          disabled={step === 1}
        >
          PREVIOUS
        </Button>
        
        {#if step === totalSteps}
          <Button
            type="submit"
            class="flex-1 font-mono"
            disabled={!isValid || loading}
          >
            {loading ? 'PROCESSING...' : 'COMPLETE SETUP'}
          </Button>
        {:else}
          <Button
            type="button"
            class="flex-1 font-mono"
            on:click={nextStep}
          >
            NEXT
          </Button>
        {/if}
      </div>
    </form>
  </div>
</div>

<style>
  /* Scan line effect */
  :global(.military-panel) {
    position: relative;
    overflow: hidden;
  }

  :global(.military-panel::before) {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(220, 38, 38, 0.03) 0px,
      rgba(220, 38, 38, 0.03) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
  }

  /* Glowing border effect */
  :global(.glow-border) {
    box-shadow: 0 0 15px rgba(220, 38, 38, 0.1),
                inset 0 0 15px rgba(220, 38, 38, 0.1);
  }
</style> 