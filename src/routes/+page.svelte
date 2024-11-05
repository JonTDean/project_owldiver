<script lang="ts">
  import { Canvas } from '@threlte/core';
  import HeroScene from '$lib/components/HeroScene.svelte';
  import { Button } from '$lib/components/ui/button';
  import toast from 'svelte-french-toast';
  import { goto } from '$app/navigation';

  async function handleJoinClick() {
    toast.success('Welcome to the Owl Enforcers!');
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
      <div class="space-y-2 p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-red-500/20 
                  max-w-xl mx-auto shadow-lg">
        <div class="border-b-2 border-red-600 pb-2">
          <h2 class="text-[10px] font-jetbrains tracking-[0.3em] text-red-500 font-bold">SUPER EARTH MILITARY COMMAND</h2>
          <h2 class="text-red-500 text-2xl mt-1 font-jetbrains tracking-wider font-bold">PROJECT OWLDIVER</h2>
          <div class="flex items-center gap-2 mt-1">
            <div class="w-2 h-2 bg-red-500 animate-pulse rounded-full"></div>
            <p class="text-[10px] text-gray-400 font-jetbrains tracking-[0.2em]">CLASSIFICATION LEVEL: TOP SECRET</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Mission Brief -->
    <div class="w-full mt-8">
      <div class="space-y-3 p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-red-500/20 
                  max-w-lg mx-auto shadow-lg">
        <!-- Mission briefing style text -->
        <div class="space-y-3">
          <p class="text-sm font-jetbrains leading-relaxed text-gray-200 tracking-wide">
            ATTENTION DIVER: You've been selected for Super Earth's Special Mission Helldiver Unit (SESMHU): 
            <span class="font-bold uppercase tracking-wider text-red-400">[REDACTED]</span>
          </p>

          <div class="flex flex-col items-center gap-2">
            <Button 
              size="lg" 
              class="relative group bg-red-700 hover:bg-red-800 text-white font-jetbrains border-2 border-red-500 
              transform transition-all duration-200 hover:scale-105 px-8 py-3 uppercase tracking-[0.2em] text-sm
              before:absolute before:inset-0 before:border-2 before:border-red-500/50 before:transform before:translate-x-1 before:translate-y-1
              after:absolute after:inset-0 after:border-2 after:border-white/10 after:-translate-x-1 after:-translate-y-1
              shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
              on:click={handleJoinClick}
            >
              <span class="relative z-10 flex items-center gap-2">
                <span class="text-red-300">&gt;</span>
                Enlist Now
                <span class="text-red-300">&lt;</span>
              </span>
            </Button>
            <span class="text-[10px] text-gray-400 font-jetbrains tracking-[0.2em]">FOR SUPER EARTH AND MANAGED DEMOCRACY</span>
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