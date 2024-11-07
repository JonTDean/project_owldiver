<script lang="ts">
  export let open = false;
</script>

<button
  class="relative w-8 h-8 flex items-center justify-center group"
  on:click
>
  <div
    class="flex flex-col justify-center items-center w-6 h-6 space-y-1.5 
           transition-transform duration-300 {open ? 'transform rotate-180' : ''}"
  >
    <!-- Lines that form the hamburger or X -->
    <div
      class="w-full h-0.5 bg-[#FFD700]/50 transform transition-all duration-300 
             group-hover:bg-[#FFD700] group-hover:shadow-[0_0_5px_rgba(255,215,0,0.5)]
             {open ? 'rotate-45 translate-y-2' : ''}"
    ></div>
    <div
      class="w-full h-0.5 bg-[#FFD700]/50 transition-all duration-300 
             group-hover:bg-[#FFD700] group-hover:shadow-[0_0_5px_rgba(255,215,0,0.5)]
             {open ? 'opacity-0' : ''}"
    ></div>
    <div
      class="w-full h-0.5 bg-[#FFD700]/50 transform transition-all duration-300 
             group-hover:bg-[#FFD700] group-hover:shadow-[0_0_5px_rgba(255,215,0,0.5)]
             {open ? '-rotate-45 -translate-y-2' : ''}"
    ></div>
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