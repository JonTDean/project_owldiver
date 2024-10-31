<script lang="ts">
  import { Canvas } from '@threlte/core';
  import * as HeroScene from '$lib/components/HeroScene.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import toast from 'svelte-french-toast';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let username = '';

  function handleRegister() {
    // Your registration logic here
    toast.success('Welcome to Super Earth, Helldiver!');
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
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
    <div class="space-y-6 p-8 rounded-lg bg-black/40 backdrop-blur-sm max-w-md mx-auto border border-white/10">
      <!-- Military-style header -->
      <div class="border-b-2 border-red-600 pb-4">
        <h2 class="text-sm font-mono tracking-widest text-red-500 mb-2">SUPER EARTH MILITARY COMMAND</h2>
        <h1 class="text-3xl font-bold mb-2 uppercase tracking-wider">New Recruit Registration</h1>
        <p class="text-gray-400 font-mono">CLEARANCE ASSIGNMENT PROTOCOL</p>
      </div>

      <form class="space-y-6 font-mono" on:submit|preventDefault={handleRegister}>
        <div class="space-y-2 text-left">
          <Label class="text-white/90 uppercase tracking-wider" for="username">Codename</Label>
          <Input
            id="username"
            type="text"
            bind:value={username}
            class="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
            placeholder="ENTER CODENAME"
          />
        </div>

        <div class="space-y-2 text-left">
          <Label class="text-white/90 uppercase tracking-wider" for="email">Communication Channel</Label>
          <Input
            id="email"
            type="email"
            bind:value={email}
            class="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
            placeholder="ENTER EMAIL"
          />
        </div>

        <div class="space-y-2 text-left">
          <Label class="text-white/90 uppercase tracking-wider" for="password">Security Key</Label>
          <Input
            id="password"
            type="password"
            bind:value={password}
            class="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
            placeholder="ENTER PASSWORD"
          />
        </div>

        <div class="space-y-2 text-left">
          <Label class="text-white/90 uppercase tracking-wider" for="confirm-password">Confirm Security Key</Label>
          <Input
            id="confirm-password"
            type="password"
            bind:value={confirmPassword}
            class="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
            placeholder="CONFIRM PASSWORD"
          />
        </div>

        <Button 
          type="submit"
          class="relative group w-full bg-red-700 hover:bg-red-800 text-white font-mono border-2 border-red-500 
          transform transition-all duration-200 hover:scale-105 px-8 py-4 uppercase tracking-widest
          before:absolute before:inset-0 before:border-2 before:border-red-500/50 before:transform before:translate-x-1 before:translate-y-1
          after:absolute after:inset-0 after:border-2 after:border-white/10 after:-translate-x-1 after:-translate-y-1
          shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            <span class="text-red-300">&gt;</span>
            Register
            <span class="text-red-300">&lt;</span>
          </span>
        </Button>

        <div class="text-sm text-gray-400">
          <a href="/auth/login" class="hover:text-red-500 transition-colors">
            Already a Helldiver? Login Here
          </a>
        </div>
      </form>
    </div>
  </div>
</div>
