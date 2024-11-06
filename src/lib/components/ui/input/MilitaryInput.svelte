<script lang="ts">
  export let id: string;
  export let name: string = id;
  export let label: string;
  export let value: string = '';
  export let type: string = 'text';
  export let error: string = '';
  export let required: boolean = false;
  export let className: string = '';
  export let placeholder: string = '';
</script>

<div class="space-y-2">
  <label 
    for={id} 
    class="block text-xs text-[#FFD700]/70 tracking-wider"
  >
    {label}
  </label>
  
  <input
    {id}
    {name}
    {type}
    {required}
    {placeholder}
    bind:value
    class="military-input w-full bg-black/50 border border-[#FFD700]/30 
           text-[#FFD700] px-4 py-2 focus:outline-none focus:border-[#FFD700]/50 
           transition-all duration-300 {className}"
  />
  
  {#if error}
    <p class="text-xs text-red-500 mt-1">{error}</p>
  {/if}
</div>

<style>
  .military-input {
    font-family: monospace;
    letter-spacing: 0.1em;
    background: rgba(0, 0, 0, 0.7);
  }

  .military-input:focus {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
  }
</style> 