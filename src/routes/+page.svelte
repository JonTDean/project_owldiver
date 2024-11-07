<script lang="ts">
  import { Canvas } from '@threlte/core';
  import HeroScene from '$lib/components/HeroScene.svelte';
  import { Button } from '$lib/components/ui/button';
  import toast from 'svelte-french-toast';
  import { goto } from '$app/navigation';

  async function handleJoinClick() {
    await goto('/auth/register');
  }
</script>

<div class="fixed inset-0 bg-[#0a0a0a]">
  <!-- 3D Canvas -->
  <div class="absolute inset-0 z-0">
    <Canvas>
      <HeroScene />
    </Canvas>
  </div>

  <!-- Content Overlay -->
  <div class="absolute inset-0 z-10 flex flex-col text-white justify-center gap-64 py-24">
    <!-- Top Header -->
    <div class="w-full -mt-12">
      <div class="space-y-2 p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-[#FFD700]/20 
                  max-w-xl mx-auto shadow-[0_0_20px_rgba(255,215,0,0.1)]">
        <div class="border-b-2 border-[#FFD700]/60 pb-2">
          <h2 class="text-[10px] font-jetbrains tracking-[0.3em] text-[#FFD700]/70 font-bold 
                     drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            SUPER EARTH MILITARY COMMAND
          </h2>
          <h2 class="text-[#FFD700] text-2xl mt-1 font-jetbrains tracking-wider font-bold 
                     drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
            PROJECT OWLDIVER
          </h2>
          <div class="flex items-center gap-2 mt-1">
            <div class="w-2 h-2 bg-[#FFD700] animate-pulse rounded-full"></div>
            <p class="text-[10px] text-[#FFD700]/50 font-jetbrains tracking-[0.2em]">CLASSIFICATION LEVEL: TOP SECRET</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Mission Brief -->
    <div class="w-full mt-8">
      <div class="space-y-3 p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-[#FFD700]/20 
                  max-w-lg mx-auto shadow-[0_0_20px_rgba(255,215,0,0.1)]">
        <!-- Mission briefing style text -->
        <div class="space-y-3">
          <p class="text-sm font-jetbrains leading-relaxed text-[#FFD700]/70 tracking-wide">
            ATTENTION DIVER: You've been selected for Super Earth's Special Mission Helldiver Unit (SESMHU): 
            <span class="font-bold uppercase tracking-wider text-[#FFD700]">[REDACTED]</span>
          </p>

          <div class="flex flex-col items-center gap-2">
            <Button 
              size="lg" 
              class="relative group bg-black/50 hover:bg-black/70 text-[#FFD700] font-jetbrains border-2 border-[#FFD700]/30 
              transform transition-all duration-200 hover:scale-105 px-8 py-3 uppercase tracking-[0.2em] text-sm
              before:absolute before:inset-0 before:border-2 before:border-[#FFD700]/20 before:transform before:translate-x-1 before:translate-y-1
              after:absolute after:inset-0 after:border-2 after:border-[#FFD700]/10 after:-translate-x-1 after:-translate-y-1
              shadow-[0_0_1px_rgba(255,215,0,0.2)] hover:shadow-[0_0_2px_rgba(255,215,0,0.4)]
              hover:border-[#FFD700]/50 hover:text-[#FFD700] border-none"
              on:click={handleJoinClick}
            >
              <span class="relative z-10 flex items-center gap-2">
                <span class="text-[#FFD700]/70">&gt;</span>
                Enlist Now
                <span class="text-[#FFD700]/70">&lt;</span>
              </span>
            </Button>
            <span class="text-[10px] text-[#FFD700]/50 font-jetbrains tracking-[0.2em] animate-pulse
                         drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
              FOR SUPER EARTH AND MANAGED DEMOCRACY
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
  
  :global(.font-jetbrains) {
    font-family: 'JetBrains Mono', monospace;
  }
</style>