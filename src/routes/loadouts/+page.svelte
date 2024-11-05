<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div class="container max-w-7xl mx-auto px-4 py-8">
  <div class="space-y-8">
    <!-- Header -->
    <div class="border-b-2 border-primary pb-4">
      <h2 class="text-sm font-mono tracking-widest text-primary">SUPER EARTH MILITARY COMMAND</h2>
      <h1 class="text-3xl font-bold mt-2 text-foreground uppercase tracking-wider">Recommended Loadouts</h1>
      <div class="flex items-center gap-2 mt-2">
        <div class="w-2 h-2 bg-primary animate-pulse rounded-full"></div>
        <p class="text-[10px] text-muted font-mono tracking-[0.2em]">TACTICAL ANALYSIS DIVISION</p>
      </div>
    </div>

    <!-- Loadout Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Loadout Card -->
      <div class="p-6 rounded-lg bg-background/40 backdrop-blur-sm border border-themed">
        <div class="border-b border-themed pb-2 mb-4">
          <h2 class="text-xl font-bold text-foreground uppercase tracking-wider">Anti-Tank Specialist</h2>
          <p class="text-[10px] text-primary font-mono tracking-[0.2em] mt-1">HEAVY ARMOR ELIMINATION</p>
        </div>
        
        <div class="space-y-4 font-mono text-sm">
          <div>
            <p class="text-muted uppercase tracking-wider">Primary Weapon</p>
            <p class="text-foreground mt-1">R-63 Diligence Counter-Sniper</p>
          </div>
          
          <div>
            <p class="text-muted uppercase tracking-wider">Secondary Weapon</p>
            <p class="text-foreground mt-1">P-4 Senator Handgun</p>
          </div>
          
          <div>
            <p class="text-muted uppercase tracking-wider">Stratagems</p>
            <ul class="mt-1 space-y-1">
              <li>• Eagle Rearm Pack</li>
              <li>• Eagle Smoke Strike</li>
              <li>• Eagle Napalm Strike</li>
              <li>• Eagle Strafing Run</li>
            </ul>
          </div>

          <Button 
            class="w-full bg-accent/50 hover:bg-accent/60 text-primary font-mono border border-themed"
          >
            VIEW TACTICAL DETAILS
          </Button>
        </div>
      </div>

      <!-- More loadout cards with different configurations -->
      <!-- Copy the card structure and change the content -->
    </div>
  </div>
</div>
