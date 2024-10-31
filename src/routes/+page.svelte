<script lang="ts">
  import { Canvas } from '@threlte/core';
  import * as HeroScene from '$lib/components/HeroScene.svelte';
  import { Button } from '$lib/components/ui/button';
  import toast from 'svelte-french-toast';

  function handleJoinClick() {
    toast.success('Welcome to the Owl Enforcers!');
    window.location.href = '/auth/register';
  }
</script>

<div class="fixed inset-0" style="background-color: #0a0a0a;">
  <!-- 3D Canvas -->
  <div class="absolute inset-0">
    <Canvas>
      <!-- <HeroScene.default /> -->
    </Canvas>
  </div>

  <!-- Content Overlay -->
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white pointer-events-none">
    <div class="space-y-6 p-8 rounded-lg bg-black/40 backdrop-blur-sm max-w-4xl mx-auto border border-white/10">
      <!-- Military-style header -->
      <div class="border-b-2 border-red-600 pb-4">
        <h2 class="text-sm font-mono tracking-widest text-red-500 mb-2">SUPER EARTH MILITARY COMMAND</h2>
        <h2 class="text-red-500 text-6xl ">PROJECT OWLDIVER</h2>
        <p class="text-gray-400 font-mono">CLASSIFICATION LEVEL: TOP SECRET</p>
      </div>

      <!-- Mission briefing style text -->
      <p class="text-xl mb-8 font-mono leading-relaxed text-gray-200">
        ATTENTION DIVER: </p>
      <p class="text-xl mb-8 font-mono leading-relaxed text-gray-200">
        You've been selected for Super Earth's Special Mission Helldiver Unit (SESMHU): <span class="font-bold mb-2 uppercase tracking-wider">[REDACTED]</span>
      </p>


      <div class="pointer-events-auto flex flex-col items-center gap-4">
        <Button 
          size="lg" 
          class="relative group bg-red-700 hover:bg-red-800 text-white font-mono border-2 border-red-500 
          transform transition-all duration-200 hover:scale-105 px-16 py-6 uppercase tracking-widest
          before:absolute before:inset-0 before:border-2 before:border-red-500/50 before:transform before:translate-x-1 before:translate-y-1
          after:absolute after:inset-0 after:border-2 after:border-white/10 after:-translate-x-1 after:-translate-y-1
          shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
          on:click={handleJoinClick}
        >
          <span class="relative z-10 flex items-center gap-2">
            <!-- Optional: Add chevrons for military feel -->
            <span class="text-red-300">&gt;</span>
            Enlist Now
            <span class="text-red-300">&lt;</span>
          </span>
        </Button>
        <span class="text-sm text-gray-400 font-mono mt-2">FOR SUPER EARTH AND MANAGED DEMOCRACY</span>
      </div>
    </div>
  </div>
</div>