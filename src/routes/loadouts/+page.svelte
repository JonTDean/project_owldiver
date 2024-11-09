<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import MilitaryHeader from "$lib/components/ui/header/MilitaryHeader.svelte";
  import { ThumbsUp, ThumbsDown, Star } from 'lucide-svelte';
  
  // Mock data for now
  const loadout = {
    id: '1',
    name: 'Anti-Tank Specialist',
    description: 'Specialized loadout for heavy armor elimination',
    equipment: {
      primary: 'R-63 Diligence Counter-Sniper',
      secondary: 'P-4 Senator Handgun',
      accessory: 'Guard Dog Rover',
      stratagems: [
        'Eagle Rearm Pack',
        'Eagle Smoke Strike',
        'Eagle Napalm Strike',
        'Eagle Strafing Run',
        'Orbital Precision Strike'
      ],
      armor: {
        helmet: 'MK-3 Combat Helmet',
        body: 'MK-3 Combat Armor',
        cape: 'Super Earth Cape'
      }
    },
    suitability: {
      enemies: ['Automatons', 'Terminids'],
      planets: ['Desert', 'Snow']
    },
    stats: {
      upvotes: 150,
      downvotes: 23,
      rating: 8.5,
      total_ratings: 89
    }
  };
</script>

<div class="container max-w-7xl mx-auto px-4 py-8">
  <MilitaryHeader 
    title="TACTICAL LOADOUT DATABASE" 
    subtitle="SUPER EARTH MILITARY COMMAND" 
    securityLevel="LEVEL 3 - RESTRICTED"
  />

  <div class="grid gap-8 mt-8">
    <!-- Loadout Card -->
    <div class="military-panel">
      <!-- Header Section -->
      <div class="panel-header">
        <div class="header-accent"></div>
        <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">{loadout.name}</h2>
        <div class="header-accent"></div>
      </div>

      <div class="grid md:grid-cols-2 gap-6 p-6">
        <!-- Left Column: 3D Preview -->
        <div class="military-panel bg-black/40 aspect-square flex items-center justify-center">
          <div class="text-6xl text-[#FFD700]/30">?</div>
          <div class="absolute bottom-2 left-2 text-[10px] font-mono text-[#FFD700]/50">
            3D MODEL PREVIEW UNAVAILABLE
          </div>
        </div>

        <!-- Right Column: Equipment Details -->
        <div class="space-y-4 font-mono">
          <!-- Weapons -->
          <div class="space-y-2">
            <h3 class="text-xs tracking-[0.2em] text-[#FFD700]/70">ARMAMENT</h3>
            <div class="space-y-1 text-sm pl-4">
              <p>PRIMARY: {loadout.equipment.primary}</p>
              <p>SECONDARY: {loadout.equipment.secondary}</p>
              <p>ACCESSORY: {loadout.equipment.accessory}</p>
            </div>
          </div>

          <!-- Armor -->
          <div class="space-y-2">
            <h3 class="text-xs tracking-[0.2em] text-[#FFD700]/70">ARMOR</h3>
            <div class="space-y-1 text-sm pl-4">
              <p>HELMET: {loadout.equipment.armor.helmet}</p>
              <p>BODY: {loadout.equipment.armor.body}</p>
              <p>CAPE: {loadout.equipment.armor.cape}</p>
            </div>
          </div>

          <!-- Stratagems -->
          <div class="space-y-2">
            <h3 class="text-xs tracking-[0.2em] text-[#FFD700]/70">STRATAGEMS</h3>
            <ul class="space-y-1 text-sm pl-4">
              {#each loadout.equipment.stratagems as stratagem}
                <li>• {stratagem}</li>
              {/each}
            </ul>
          </div>

          <!-- Suitability -->
          <div class="space-y-2">
            <h3 class="text-xs tracking-[0.2em] text-[#FFD700]/70">TACTICAL SUITABILITY</h3>
            <div class="grid grid-cols-2 gap-4 pl-4">
              <div>
                <p class="text-[10px] text-[#FFD700]/50">ENEMY TYPES</p>
                <ul class="text-sm">
                  {#each loadout.suitability.enemies as enemy}
                    <li>• {enemy}</li>
                  {/each}
                </ul>
              </div>
              <div>
                <p class="text-[10px] text-[#FFD700]/50">PLANET TYPES</p>
                <ul class="text-sm">
                  {#each loadout.suitability.planets as planet}
                    <li>• {planet}</li>
                  {/each}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Voting Section -->
      <div class="border-t border-[#FFD700]/20 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <!-- Upvote/Downvote -->
            <div class="flex items-center gap-4">
              <button class="flex items-center gap-2 text-[#FFD700]/70 hover:text-[#FFD700]">
                <ThumbsUp size={16} />
                <span class="text-sm">{loadout.stats.upvotes}</span>
              </button>
              <button class="flex items-center gap-2 text-[#FFD700]/70 hover:text-[#FFD700]">
                <ThumbsDown size={16} />
                <span class="text-sm">{loadout.stats.downvotes}</span>
              </button>
            </div>
            
            <!-- Rating -->
            <div class="flex items-center gap-2">
              <Star size={16} class="text-[#FFD700]" />
              <span class="text-sm">{loadout.stats.rating}/10</span>
              <span class="text-xs text-[#FFD700]/50">({loadout.stats.total_ratings} ratings)</span>
            </div>
          </div>

          <Button class="bg-[#FFD700]/10 hover:bg-[#FFD700]/20">
            RATE & COMMENT
          </Button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .military-panel {
    @apply border border-[#FFD700]/30 bg-black/60 relative overflow-hidden;
  }

  .panel-header {
    @apply flex items-center justify-between p-3 bg-black/40 border-b border-[#FFD700]/30;
  }

  .header-accent {
    @apply h-px w-12 bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent;
  }
</style>
