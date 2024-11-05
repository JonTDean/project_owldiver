<script lang="ts">
  import { onMount } from 'svelte';
  import toast from 'svelte-french-toast';

  onMount(() => {
    toast.success('WELCOME BACK TO THE COMMAND CENTER, HELLDIVER');
  });
</script>

<div class="fixed inset-0" style="background-color: #0a0a0a;">
  <div class="container mx-auto p-4">
    <div class="space-y-6 p-8 rounded-lg bg-black/40 backdrop-blur-sm border border-red-500/20">
      <!-- Military-style header -->
      <div class="border-b-2 border-red-600 pb-4">
        <h2 class="text-sm font-mono tracking-widest text-red-500 mb-2">SUPER EARTH MILITARY COMMAND</h2>
        <h1 class="text-3xl font-bold mb-2 uppercase tracking-wider text-white">OWLDIVER Command Center</h1>
        <p class="text-gray-400 font-mono">CLEARANCE LEVEL: TOP SECRET</p>
      </div>

      <!-- Mission Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div class="p-4 rounded-lg bg-black/40 border border-red-500/20">
          <h3 class="text-red-500 text-sm uppercase tracking-wider">Active Operations</h3>
          <p class="text-2xl text-white mt-2">12</p>
        </div>
        <div class="p-4 rounded-lg bg-black/40 border border-red-500/20">
          <h3 class="text-red-500 text-sm uppercase tracking-wider">Successful Missions</h3>
          <p class="text-2xl text-white mt-2">487</p>
        </div>
        <div class="p-4 rounded-lg bg-black/40 border border-red-500/20">
          <h3 class="text-red-500 text-sm uppercase tracking-wider">Casualties</h3>
          <p class="text-2xl text-white mt-2">1,337</p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="space-y-4">
        <h2 class="text-xl font-mono text-red-500 uppercase tracking-wider">Recent Operations</h2>
        <div class="space-y-2">
          {#each Array(3) as _, i}
            <div class="p-4 rounded-lg bg-black/40 border border-red-500/20">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-white font-mono">Operation Deadfall</h3>
                  <p class="text-sm text-gray-400 font-mono">Sector: X-274 • Status: In Progress</p>
                </div>
                <span class="text-red-500 font-mono text-sm">2 HOURS AGO</span>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Mission Briefing -->
      <div class="p-4 rounded-lg bg-black/60 border border-red-500/20">
        <h2 class="text-red-500 font-mono uppercase tracking-wider mb-2">Current Objectives</h2>
        <ul class="space-y-2 text-gray-300 font-mono">
          <li class="flex items-center gap-2">
            <span class="text-red-500">•</span>
            Eliminate Terminid presence in Sector X-274
          </li>
          <li class="flex items-center gap-2">
            <span class="text-red-500">•</span>
            Deploy automated defense systems
          </li>
          <li class="flex items-center gap-2">
            <span class="text-red-500">•</span>
            Extract strategic resources
          </li>
        </ul>
      </div>
    </div>
  </div>
</div> 