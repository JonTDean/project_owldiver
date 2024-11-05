<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import type { PageData } from './$types';

  export let data: PageData;

  type Personnel = {
    id: string;
    steamUsername: string;
    steamId: string;
    codename: string;
    securityClearance: number;
    status: string;
    rank: string;
    specialization: string;
    thumbnail: string;
    background: {
      fullName: string;
      nationality: string;
      motivation: string;
      history: string;
      psychProfile: string;
    };
    career: {
      // Combat Stats
      enemy_kills: number;
      terminid_kills: number;
      automaton_kills: number;
      friendly_kills: number;
      grenade_kills: number;
      melee_kills: number;
      eagle_kills: number;
      deaths: number;
      shots_fired: number;
      shots_hit: number;
      
      // Stratagem Usage
      orbitals_used: number;
      defensive_stratagems_used: number;
      eagle_stratagems_used: number;
      supply_stratagems_used: number;
      reinforce_stratagems_used: number;
      total_stratagems_used: number;
      
      // Mission Stats
      successful_extractions: number;
      objectives_completed: number;
      missions_played: number;
      missions_won: number;
      in_mission_time: string;
      samples_collected: number;
      total_xp_earned: number;
    };
  };

  // Mock data for multiple personnel
  const personnelList: Personnel[] = [
    {
      id: "1",
      steamUsername: "GHOST-1337",
      steamId: "1337",
      codename: "GHOST-1337",
      securityClearance: 4,
      status: "ACTIVE",
      rank: "COMMANDER",
      specialization: "ANTI-TANK WARFARE",
      thumbnail: "🎖️",
      background: {
        fullName: "[REDACTED]",
        nationality: "SUPER EARTH - NORTH AMERICAN SECTOR",
        motivation: `Witnessed the fall of [REDACTED] during the initial Automaton uprising. 
                    Joined the Helldivers to ensure no other city suffers the same fate.`,
        history: `Former civilian resistance fighter during the Automaton occupation of [REDACTED]. 
                 Led successful guerrilla operations against automated forces before formal military integration.
                 Distinguished service in Operation Steel Dawn.`,
        psychProfile: `Subject displays exceptional dedication to Super Earth's cause. 
                      High stress tolerance and strong team coordination abilities.
                      Notable aggressive tendencies when engaging automated forces.
                      Demonstrates unwavering loyalty to Super Earth and its principles of Managed Democracy.`
      },
      career: {
        // Combat Stats
        enemy_kills: 28713,
        terminid_kills: 17082,
        automaton_kills: 7254,
        friendly_kills: 153,
        grenade_kills: 767,
        melee_kills: 133,
        eagle_kills: 2882,
        deaths: 1144,
        shots_fired: 130952,
        shots_hit: 69164,
        
        // Stratagem Usage
        orbitals_used: 515,
        defensive_stratagems_used: 332,
        eagle_stratagems_used: 1036,
        supply_stratagems_used: 393,
        reinforce_stratagems_used: 931,
        total_stratagems_used: 3553,
        
        // Mission Stats
        successful_extractions: 149,
        objectives_completed: 906,
        missions_played: 254,
        missions_won: 195,
        in_mission_time: "80:07:11",
        samples_collected: 2386,
        total_xp_earned: 224776
      }
    }
  ];

  let searchQuery = "";
  let selectedPersonnel = personnelList[0];

  $: filteredPersonnel = personnelList.filter(p => 
    p.codename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function selectPersonnel(personnel: Personnel) {
    selectedPersonnel = personnel;
  }

  // Helper function to format numbers with commas
  function formatNumber(num: number): string {
    return num.toLocaleString();
  }

  // Helper function to calculate accuracy
  function calculateAccuracy(shots_fired: number, shots_hit: number): string {
    return ((shots_hit / shots_fired) * 100).toFixed(1) + '%';
  }
</script>

<div class="container max-w-7xl mx-auto px-4 py-8">
  <!-- Header -->
  <div class="border-b-2 border-primary pb-4 mb-8">
    <h2 class="text-sm font-mono tracking-widest text-primary">SUPER EARTH MILITARY COMMAND</h2>
    <h1 class="text-3xl font-bold mt-2 text-foreground uppercase tracking-wider">Personnel Database</h1>
    <div class="flex items-center gap-2 mt-2">
      <div class="w-2 h-2 bg-primary animate-pulse rounded-full"></div>
      <p class="text-[10px] text-muted font-mono tracking-[0.2em]">
        ACTIVE PERSONNEL: {personnelList.length}
      </p>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6">
    <!-- Left Side: Personnel List -->
    <div class="col-span-12 md:col-span-4 lg:col-span-3 space-y-4">
      <!-- Search Bar -->
      <div class="space-y-2">
        <Input
          type="search"
          placeholder="SEARCH PERSONNEL"
          class="bg-background/40 border-themed font-mono text-sm"
          bind:value={searchQuery}
        />
      </div>

      <!-- Personnel List -->
      <div class="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
        {#each filteredPersonnel as personnel}
          <button
            class="w-full p-3 rounded bg-background/40 backdrop-blur-sm border border-themed
                   hover:border-primary transition-colors font-mono text-left
                   {selectedPersonnel.id === personnel.id ? 'border-primary bg-accent/10' : ''}"
            on:click={() => selectPersonnel(personnel)}
          >
            <div class="flex items-center gap-3">
              <div class="text-2xl">{personnel.thumbnail}</div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-bold">{personnel.codename}</p>
                    <p class="text-[10px] text-muted">SEC LEVEL: {personnel.securityClearance}</p>
                  </div>
                  <p class="text-[10px] text-primary">{personnel.rank}</p>
                </div>
                <div class="flex items-center justify-between mt-1">
                  <p class="text-xs text-muted">{personnel.specialization}</p>
                  <p class="text-[10px] text-green-500">{personnel.status}</p>
                </div>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <!-- Right Side: Detailed Personnel View -->
    {#if selectedPersonnel}
      <div class="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
        <!-- Personnel Header -->
        <div class="p-6 rounded-lg bg-black/80 backdrop-blur-sm border border-primary/30 
                    shadow-[0_0_15px_rgba(220,38,38,0.1)] relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('/grid.png')] opacity-10"></div>
          <div class="relative z-10">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs text-muted font-mono">HELLDIVER ID</p>
                <h2 class="text-2xl font-bold mt-1 font-mono tracking-wider">
                  {selectedPersonnel.steamUsername} 
                  <span class="text-muted">#{selectedPersonnel.steamId}</span>
                </h2>
                <div class="mt-2 space-y-1">
                  <p class="text-sm font-mono">
                    <span class="text-muted">CODENAME:</span> 
                    <span class="text-primary">{selectedPersonnel.codename}</span>
                  </p>
                  <p class="text-sm font-mono">
                    <span class="text-muted">RANK:</span> 
                    <span class="text-foreground">{selectedPersonnel.rank}</span>
                  </p>
                  <p class="text-sm font-mono">
                    <span class="text-muted">SECURITY CLEARANCE:</span> 
                    <span class="text-primary">LEVEL {selectedPersonnel.securityClearance}</span>
                  </p>
                </div>
              </div>
              <div class="text-5xl">{selectedPersonnel.thumbnail}</div>
            </div>
          </div>
        </div>

        <!-- Background Information -->
        <div class="p-6 rounded-lg bg-black/80 backdrop-blur-sm border border-primary/30 
                    shadow-[0_0_15px_rgba(220,38,38,0.1)] relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('/grid.png')] opacity-10"></div>
          <div class="relative z-10">
            <div class="border-b border-primary/20 pb-2">
              <h3 class="text-sm font-mono tracking-[0.2em] text-primary">PERSONNEL FILE</h3>
            </div>
            <div class="mt-4 space-y-4 font-mono">
              <div>
                <p class="text-xs text-muted">NATIONALITY</p>
                <p class="text-sm mt-1">{selectedPersonnel.background.nationality}</p>
              </div>
              <div>
                <p class="text-xs text-muted">MOTIVATION</p>
                <p class="text-sm mt-1 leading-relaxed">{selectedPersonnel.background.motivation}</p>
              </div>
              <div>
                <p class="text-xs text-muted">SERVICE HISTORY</p>
                <p class="text-sm mt-1 leading-relaxed">{selectedPersonnel.background.history}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics Grid -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Kill Statistics -->
          <div class="p-6 rounded-lg bg-black/80 backdrop-blur-sm border border-primary/30 
                      shadow-[0_0_15px_rgba(220,38,38,0.1)] relative overflow-hidden">
            <div class="absolute inset-0 bg-[url('/grid.png')] opacity-10"></div>
            <div class="relative z-10">
              <div class="border-b border-primary/20 pb-2">
                <h3 class="text-sm font-mono tracking-[0.2em] text-primary">KILL STATISTICS</h3>
              </div>
              <div class="mt-4 space-y-3 font-mono text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-muted">ENEMY KILLS</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.enemy_kills)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">TERMINID KILLS</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.terminid_kills)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">AUTOMATON KILLS</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.automaton_kills)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">FRIENDLY KILLS</span>
                  <span class="text-red-500">{formatNumber(selectedPersonnel.career.friendly_kills)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">GRENADE KILLS</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.grenade_kills)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">MELEE KILLS</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.melee_kills)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">EAGLE KILLS</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.eagle_kills)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Combat Performance -->
          <div class="p-6 rounded-lg bg-black/80 backdrop-blur-sm border border-primary/30 
                      shadow-[0_0_15px_rgba(220,38,38,0.1)] relative overflow-hidden">
            <div class="absolute inset-0 bg-[url('/grid.png')] opacity-10"></div>
            <div class="relative z-10">
              <div class="border-b border-primary/20 pb-2">
                <h3 class="text-sm font-mono tracking-[0.2em] text-primary">COMBAT METRICS</h3>
              </div>
              <div class="mt-4 space-y-3 font-mono text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-muted">SHOTS FIRED</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.shots_fired)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">SHOTS HIT</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.shots_hit)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">ACCURACY</span>
                  <span class="text-primary">{calculateAccuracy(selectedPersonnel.career.shots_fired, selectedPersonnel.career.shots_hit)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">DEATHS</span>
                  <span class="text-red-500">{formatNumber(selectedPersonnel.career.deaths)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stratagem Usage -->
        <div class="p-6 rounded-lg bg-black/80 backdrop-blur-sm border border-primary/30 
                    shadow-[0_0_15px_rgba(220,38,38,0.1)] relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('/grid.png')] opacity-10"></div>
          <div class="relative z-10">
            <div class="border-b border-primary/20 pb-2">
              <h3 class="text-sm font-mono tracking-[0.2em] text-primary">STRATAGEM DEPLOYMENT</h3>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-6 font-mono text-xs">
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-muted">ORBITAL STRIKES</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.orbitals_used)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">DEFENSIVE</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.defensive_stratagems_used)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">EAGLE SUPPORT</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.eagle_stratagems_used)}</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-muted">SUPPLY</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.supply_stratagems_used)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">REINFORCEMENT</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.reinforce_stratagems_used)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">TOTAL DEPLOYED</span>
                  <span class="text-primary">{formatNumber(selectedPersonnel.career.total_stratagems_used)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mission Statistics -->
        <div class="p-6 rounded-lg bg-black/80 backdrop-blur-sm border border-primary/30 
                    shadow-[0_0_15px_rgba(220,38,38,0.1)] relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('/grid.png')] opacity-10"></div>
          <div class="relative z-10">
            <div class="border-b border-primary/20 pb-2">
              <h3 class="text-sm font-mono tracking-[0.2em] text-primary">MISSION STATISTICS</h3>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-6 font-mono text-xs">
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-muted">MISSIONS PLAYED</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.missions_played)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">MISSIONS WON</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.missions_won)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">SUCCESS RATE</span>
                  <span class="text-primary">
                    {((selectedPersonnel.career.missions_won / selectedPersonnel.career.missions_played) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-muted">OBJECTIVES COMPLETED</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.objectives_completed)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">SAMPLES COLLECTED</span>
                  <span class="text-foreground">{formatNumber(selectedPersonnel.career.samples_collected)}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-muted">TOTAL XP EARNED</span>
                  <span class="text-primary">{formatNumber(selectedPersonnel.career.total_xp_earned)}</span>
                </div>
              </div>
              <div class="col-span-2 pt-2 border-t border-primary/20">
                <div class="flex justify-between items-center">
                  <span class="text-muted">TOTAL MISSION TIME</span>
                  <span class="text-foreground">{selectedPersonnel.career.in_mission_time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* High-tech effects */
  :global(.high-tech-border) {
    box-shadow: inset 0 0 15px rgba(220, 38, 38, 0.05);
    border: 1px solid rgba(220, 38, 38, 0.3);
  }

  /* Scan line effect */
  :global(.scan-lines) {
    position: relative;
  }

  :global(.scan-lines::before) {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
  }
</style> 