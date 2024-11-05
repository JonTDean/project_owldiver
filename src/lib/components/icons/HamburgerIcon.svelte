<script lang="ts">
  export let open = false;
</script>

<button 
  class="relative w-8 h-8 flex flex-col justify-center items-center group"
  class:open
  on:click
>
  <div class="flex flex-col gap-[6px] items-start">
    <span class="w-6 h-[2px] bg-primary transform transition-all duration-300 
                 group-hover:bg-red-400 {open ? 'rotate-45 translate-y-2' : ''}" />
    <span class="w-4 h-[2px] bg-primary transform transition-all duration-300 
                 group-hover:bg-red-400 group-hover:w-6 {open ? 'opacity-0' : ''}" />
    <span class="w-5 h-[2px] bg-primary transform transition-all duration-300 
                 group-hover:bg-red-400 group-hover:w-6 {open ? '-rotate-45 -translate-y-2' : ''}" />
  </div>
</button>

<style>
  button::before {
    content: '';
    position: absolute;
    inset: -4px;
    border: 1px solid var(--color-border);
    opacity: 0;
    transition: all 0.3s;
  }

  button:hover::before {
    opacity: 1;
  }

  button.open::before {
    opacity: 1;
    border-color: var(--color-primary);
  }
</style> 