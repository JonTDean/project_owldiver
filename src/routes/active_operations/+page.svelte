<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div class="container max-w-7xl mx-auto px-4 py-8">
  <div class="space-y-8">
    <!-- Header -->
    <div class="border-b-2 border-red-600 pb-4">
      <h2 class="text-sm font-mono tracking-widest text-red-500">SUPER EARTH MILITARY COMMAND</h2>
      <h1 class="text-3xl font-bold mt-2 text-white uppercase tracking-wider">Active Operations</h1>
      <div class="flex items-center gap-2 mt-2">
        <div class="w-2 h-2 bg-red-500 animate-pulse rounded-full"></div>
        <p class="text-[10px] text-gray-400 font-mono tracking-[0.2em]">MISSION CONTROL CENTER</p>
      </div>
    </div>

    <!-- Mission Grid -->
    <div class="grid gap-6 md:grid-cols-2">
      <!-- Mission Card -->
      <div class="p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-red-500/20">
        <div class="border-b border-red-500/20 pb-2 mb-4">
          <h2 class="text-xl font-bold text-white uppercase tracking-wider">Operation Deadfall</h2>
          <p class="text-[10px] text-red-500 font-mono tracking-[0.2em] mt-1">PRIORITY MISSION</p>
        </div>
        
        <div class="space-y-4 font-mono text-sm">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-400 uppercase tracking-wider">Status</p>
              <p class="text-green-500 mt-1">ACTIVE</p>
            </div>
            <div>
              <p class="text-gray-400 uppercase tracking-wider">Difficulty</p>
              <p class="text-red-500 mt-1">EXTREME</p>
            </div>
            <div>
              <p class="text-gray-400 uppercase tracking-wider">Squad Size</p>
              <p class="text-white mt-1">12/16</p>
            </div>
            <div>
              <p class="text-gray-400 uppercase tracking-wider">Time Left</p>
              <p class="text-white mt-1">02:45:30</p>
            </div>
          </div>

          <div>
            <p class="text-gray-400 uppercase tracking-wider">Objectives</p>
            <ul class="mt-1 space-y-1">
              <li>• Eliminate Automaton Command Center</li>
              <li>• Secure Strategic Assets</li>
              <li>• Extract VIP</li>
            </ul>
          </div>

          <Button 
            class="w-full bg-red-900/50 hover:bg-red-800/50 text-red-500 font-mono border border-red-500/50"
          >
            JOIN OPERATION
          </Button>
        </div>
      </div>

      <!-- More mission cards -->
    </div>
  </div>
</div>
