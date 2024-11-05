<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  
  export let onSubmit: () => void;
  export let loading: boolean = false;
  export let formData: Record<string, string>;
  export let fields: string[];
  export let error: string | null = null;
</script>

<form 
  method="POST" 
  class="space-y-4" 
  on:submit|preventDefault={onSubmit}
>
  <div class="space-y-3">
    {#each fields as field}
      <div class="terminal-input-group">
        <Input
          type={field.includes('password') ? 'password' : 'text'}
          name={field}
          placeholder={field.toUpperCase()}
          class="terminal-input"
          bind:value={formData[field]}
          required
        />
        <div class="input-focus-indicator"></div>
      </div>
    {/each}
  </div>

  {#if error}
    <div class="terminal-error">
      <p class="text-sm font-mono text-red-500">ERROR: {error}</p>
    </div>
  {/if}

  <Button
    type="submit"
    class="terminal-submit-button"
    disabled={loading}
  >
    {loading ? 'PROCESSING...' : 'SUBMIT'}
  </Button>
</form>

<style>
  /* Terminal input styles */
</style> 