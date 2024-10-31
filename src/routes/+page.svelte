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
      <HeroScene.default />
    </Canvas>
  </div>

  <!-- Content Overlay -->
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white pointer-events-none">
    <h1 class="text-6xl font-bold mb-4">[Redacted]</h1>
    <p class="text-2xl mb-8 max-w-2xl px-4">
      You've been invited to join Super Earths Special Mission Helldiver Unit (SESMHU): Owldiver
    </p>
    <div class="pointer-events-auto">
      <Button 
        size="lg" 
        class="bg-red-600 hover:bg-red-700 text-white font-bold transform transition hover:scale-105"
        on:click={handleJoinClick}
      >
        Join Now to Spread Democracy
      </Button>
    </div>
  </div>
</div>