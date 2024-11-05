<script lang="ts">
  import { EtherealBackground } from "$lib/components/ui/effects";
  
  export let title: string;
  export let subtitle: string;
</script>

<div class="fixed inset-0 bg-black">
  <EtherealBackground />
  
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md space-y-6">
      <!-- Military-style header -->
      <div class="border-b-2 border-red-600/50 pb-4 text-center">
        <div class="flex items-center justify-center gap-2 mb-2">
          <div class="w-2 h-2 bg-red-500 animate-pulse rounded-full"></div>
          <h2 class="text-sm font-mono tracking-widest text-red-500">SUPER EARTH MILITARY COMMAND</h2>
        </div>
        <h1 class="text-3xl font-bold text-white uppercase tracking-wider mb-2">{title}</h1>
        <p class="text-gray-400 font-mono text-sm">{subtitle}</p>
      </div>

      <!-- Content -->
      <div class="space-y-6 p-8 rounded-lg bg-black/40 backdrop-blur-sm border border-red-500/20 
                  military-panel glow-border">
        <slot />
      </div>
    </div>
  </div>
</div>

<style>
  .military-panel {
    position: relative;
    overflow: hidden;
  }

  .military-panel::before {
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

  .glow-border {
    box-shadow: 0 0 15px rgba(220, 38, 38, 0.1),
                inset 0 0 15px rgba(220, 38, 38, 0.1);
  }
</style> 