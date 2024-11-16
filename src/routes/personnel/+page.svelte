<script lang="ts">
  import MilitaryHeader from "$lib/components/ui/header/MilitaryHeader.svelte";
  import MilitaryInput from "$lib/components/ui/input/MilitaryInput.svelte";
  import type { PageData } from './$types';

  // Define CareerStats type locally since it's not exported
  type CareerStats = {
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
    orbitals_used: number;
    defensive_stratagems_used: number;
    eagle_stratagems_used: number;
    supply_stratagems_used: number;
    reinforce_stratagems_used: number;
    total_stratagems_used: number;
    successful_extractions: number;
    objectives_completed: number;
    missions_played: number;
    missions_won: number;
    in_mission_time: string;
    samples_collected: number;
    total_xp_earned: number;
  };

  // Add utility functions
  function formatNumber(num: number): string {
    return num.toLocaleString();
  }

  function calculateAccuracy(shots_fired: number, shots_hit: number): string {
    if (shots_fired === 0) return "0%";
    return ((shots_hit / shots_fired) * 100).toFixed(1) + "%";
  }

  export let data: PageData;

  type Personnel = {
    id: string;
    codename: string;
    securityClearance: number;
    status: string;
    rank: string;
    specialization: string;
    background: {
      nationality: string;
      motivation: string;
      history: string;
    };
    career: CareerStats;
  };

  // Initialize personnelList
  $: personnelList = data.personnel?.map(p => ({
    id: p.profile.id,
    codename: p.rp?.codename || "UNKNOWN",
    securityClearance: p.profile.security_clearance || 1,
    status: p.profile.status || "ACTIVE",
    rank: p.profile.rank || "RECRUIT",
    specialization: p.rp?.specialization || "UNSPECIFIED",
    background: {
      nationality: p.rp?.nationality || "UNKNOWN",
      motivation: p.rp?.motivation || "CLASSIFIED",
      history: p.rp?.service_history || "NO RECORDS FOUND"
    },
    career: p.stats?.career_stats || {
      enemy_kills: 0,
      terminid_kills: 0,
      automaton_kills: 0,
      friendly_kills: 0,
      grenade_kills: 0,
      melee_kills: 0,
      eagle_kills: 0,
      deaths: 0,
      shots_fired: 0,
      shots_hit: 0,
      orbitals_used: 0,
      defensive_stratagems_used: 0,
      eagle_stratagems_used: 0,
      supply_stratagems_used: 0,
      reinforce_stratagems_used: 0,
      total_stratagems_used: 0,
      successful_extractions: 0,
      objectives_completed: 0,
      missions_played: 0,
      missions_won: 0,
      in_mission_time: "00:00:00",
      samples_collected: 0,
      total_xp_earned: 0
    }
  })) || [];

  let searchQuery = "";
  // Initialize selectedPersonnel safely
  let selectedPersonnel: Personnel | null = null;

  $: {
    // Update selectedPersonnel when personnelList changes
    if (personnelList.length > 0 && !selectedPersonnel) {
      selectedPersonnel = personnelList[0];
    }
  }

  $: filteredPersonnel = personnelList.filter(p => 
    p.codename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function selectPersonnel(personnel: Personnel) {
    selectedPersonnel = personnel;
  }
</script>

<div class="container max-w-7xl mx-auto px-4 py-8">
  <MilitaryHeader 
    title="PERSONNEL DATABASE" 
    subtitle="SUPER EARTH MILITARY INTELLIGENCE DIVISION" 
    securityLevel="LEVEL 3 - CLASSIFIED"
  />

  <div class="grid grid-cols-12 gap-6">
    <!-- Left Side: Personnel List -->
    <div class="col-span-12 md:col-span-4 lg:col-span-3 space-y-4">
      <!-- Search Bar -->
      <div class="military-panel">
        <div class="panel-header">
          <div class="header-accent"></div>
          <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">SEARCH DATABASE</h2>
          <div class="header-accent"></div>
        </div>
        <div class="p-4">
          <MilitaryInput
            id="search"
            label="SEARCH PERSONNEL"
            placeholder="ENTER CODENAME OR ID"
            bind:value={searchQuery}
          />
        </div>
      </div>

      <!-- Personnel List -->
      <div class="military-panel">
        <div class="panel-header">
          <div class="header-accent"></div>
          <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">ACTIVE PERSONNEL</h2>
          <div class="header-accent"></div>
        </div>
        
        <div class="p-4 space-y-2">
          {#if personnelList.length === 0}
            <div class="text-center py-8">
              <p class="text-muted font-mono">NO PERSONNEL RECORDS FOUND</p>
            </div>
          {:else}
            {#each filteredPersonnel as personnel}
              <button
                class="w-full p-3 rounded bg-black/40 border border-[#FFD700]/30
                       hover:border-[#FFD700] transition-colors font-mono text-left
                       {selectedPersonnel?.id === personnel.id ? 'selected-personnel' : ''}"
                on:click={() => selectPersonnel(personnel)}
              >
                <div class="flex items-center gap-3">
                  <div class="text-2xl">
                    {data.personnel.find(p => p.profile.id === personnel.id)?.profile.avatar || "👤"}
                  </div>
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
          {/if}
        </div>
      </div>
    </div>

    <!-- Right Side: Detailed Personnel View -->
    {#if selectedPersonnel}
      <div class="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
        <!-- Personnel Dossier -->
        <div class="military-panel">
          <div class="panel-header">
            <div class="header-accent"></div>
            <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">CLASSIFIED PERSONNEL DOSSIER</h2>
            <div class="header-accent"></div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-3 gap-6">
              <!-- Left Column: Avatar and Basic Info -->
              <div class="col-span-1 space-y-4">
                <div class="military-avatar-large">
                  <div class="avatar-frame">
                    {data.personnel.find(p => p.profile.id === selectedPersonnel?.id)?.profile.avatar || "👤"}
                  </div>
                  <div class="classification-stamp">TOP SECRET</div>
                </div>
                <div class="military-id-card">
                  <div class="data-row">
                    <span class="data-label">HELLDIVER ID</span>
                    <span class="data-value">#{data.personnel.find(p => p.profile.id === selectedPersonnel?.id)?.profile.steam_id}</span>
                  </div>
                  <div class="security-clearance">
                    <span class="data-label">SECURITY CLEARANCE</span>
                    <span class="data-value text-[#FFD700]">LEVEL {selectedPersonnel.securityClearance}</span>
                  </div>
                </div>
              </div>

              <!-- Middle Column: Service Details -->
              <div class="col-span-2 space-y-4">
                <div class="service-header">
                  <div class="primary-info">
                    <div class="codename">
                      <span class="data-label">CODENAME</span>
                      <span class="data-value text-[#FFD700] text-2xl">{selectedPersonnel.codename}</span>
                    </div>
                    <div class="rank-badge">
                      <span class="data-label">RANK</span>
                      <span class="data-value">{selectedPersonnel.rank}</span>
                    </div>
                  </div>
                  <div class="status-indicator">
                    <span class="data-label">STATUS</span>
                    <span class="data-value text-green-500">{selectedPersonnel.status}</span>
                  </div>
                </div>

                <div class="service-details">
                  <div class="detail-section">
                    <span class="data-label">SPECIALIZATION</span>
                    <span class="data-value">{selectedPersonnel.specialization}</span>
                  </div>
                  <div class="detail-section">
                    <span class="data-label">NATIONALITY</span>
                    <span class="data-value">{selectedPersonnel.background.nationality}</span>
                  </div>
                  <div class="detail-section">
                    <span class="data-label">MOTIVATION</span>
                    <span class="data-value">{selectedPersonnel.background.motivation}</span>
                  </div>
                </div>

                <div class="service-history">
                  <span class="data-label">SERVICE HISTORY</span>
                  <div class="history-content">
                    <span class="data-value whitespace-pre-line">{selectedPersonnel.background.history}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics Grid -->
        <div class="grid gap-6">
          <!-- Combat Overview - 2x2 Grid -->
          <div class="military-panel">
            <div class="panel-header">
              <div class="header-accent"></div>
              <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">COMBAT OVERVIEW</h2>
              <div class="header-accent"></div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="data-row highlight">
                  <span class="data-label">TOTAL ENEMY KILLS</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.enemy_kills)}</span>
                </div>
                <div class="data-row highlight">
                  <span class="data-label">ACCURACY</span>
                  <span class="data-value text-[#FFD700]">{calculateAccuracy(selectedPersonnel.career.shots_fired, selectedPersonnel.career.shots_hit)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">SHOTS FIRED</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.shots_fired)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">SHOTS HIT</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.shots_hit)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Kill Statistics - 3x2 Grid -->
          <div class="military-panel">
            <div class="panel-header">
              <div class="header-accent"></div>
              <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">KILL STATISTICS</h2>
              <div class="header-accent"></div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-3 gap-4">
                <div class="data-row">
                  <span class="data-label">TERMINID KILLS</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.terminid_kills)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">AUTOMATON KILLS</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.automaton_kills)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">EAGLE KILLS</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.eagle_kills)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">GRENADE KILLS</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.grenade_kills)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">MELEE KILLS</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.melee_kills)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">FRIENDLY KILLS</span>
                  <span class="data-value text-red-500">{formatNumber(selectedPersonnel.career.friendly_kills)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Stratagem Deployment - 3x2 Grid -->
          <div class="military-panel">
            <div class="panel-header">
              <div class="header-accent"></div>
              <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">STRATAGEM DEPLOYMENT</h2>
              <div class="header-accent"></div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-3 gap-4">
                <div class="data-row">
                  <span class="data-label">ORBITAL STRIKES</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.orbitals_used)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">DEFENSIVE</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.defensive_stratagems_used)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">EAGLE SUPPORT</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.eagle_stratagems_used)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">SUPPLY</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.supply_stratagems_used)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">REINFORCEMENT</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.reinforce_stratagems_used)}</span>
                </div>
                <div class="data-row highlight">
                  <span class="data-label">TOTAL DEPLOYED</span>
                  <span class="data-value text-[#FFD700]">{formatNumber(selectedPersonnel.career.total_stratagems_used)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mission Statistics - 2x2 Grid + Full Width -->
          <div class="military-panel">
            <div class="panel-header">
              <div class="header-accent"></div>
              <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">MISSION STATISTICS</h2>
              <div class="header-accent"></div>
            </div>
            <div class="p-6 space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="data-row">
                  <span class="data-label">MISSIONS PLAYED</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.missions_played)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">MISSIONS WON</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.missions_won)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">OBJECTIVES COMPLETED</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.objectives_completed)}</span>
                </div>
                <div class="data-row">
                  <span class="data-label">SAMPLES COLLECTED</span>
                  <span class="data-value">{formatNumber(selectedPersonnel.career.samples_collected)}</span>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="data-row highlight">
                  <span class="data-label">SUCCESS RATE</span>
                  <span class="data-value text-[#FFD700]">
                    {((selectedPersonnel.career.missions_won / selectedPersonnel.career.missions_played) * 100).toFixed(1)}%
                  </span>
                </div>
                <div class="data-row highlight">
                  <span class="data-label">TOTAL XP EARNED</span>
                  <span class="data-value text-[#FFD700]">{formatNumber(selectedPersonnel.career.total_xp_earned)}</span>
                </div>
              </div>

              <div class="data-row highlight">
                <span class="data-label">TOTAL MISSION TIME</span>
                <span class="data-value text-[#FFD700]">{selectedPersonnel.career.in_mission_time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
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

  .military-panel {
    @apply border border-[#FFD700]/30 bg-black/80 relative overflow-hidden rounded-sm;
    box-shadow: 
      0 0 20px rgba(255, 215, 0, 0.05),
      inset 0 0 30px rgba(0, 0, 0, 0.5);
  }

  .panel-header {
    @apply flex items-center justify-between p-4 bg-black/60 border-b border-[#FFD700]/30;
    background: linear-gradient(90deg, 
      rgba(0,0,0,0.8) 0%,
      rgba(255,215,0,0.1) 50%,
      rgba(0,0,0,0.8) 100%
    );
  }

  .header-accent {
    @apply h-px w-16 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent;
  }

  /* Add scanline effect */
  .military-panel::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(255, 215, 0, 0.02) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    animation: scan 10s linear infinite;
  }

  @keyframes scan {
    from { background-position: 0 0; }
    to { background-position: 0 100%; }
  }

  /* Add glowing border effect */
  .selected-personnel {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
    border-color: rgba(255, 215, 0, 0.5);
  }

  /* Replace grid.png with CSS pattern */
  .bg-grid {
    background-image: 
      linear-gradient(to right, rgba(255, 215, 0, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 215, 0, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  .military-data-group {
    @apply space-y-1;
  }

  .data-label {
    @apply text-xs text-muted font-mono tracking-wider block;
  }

  .data-value {
    @apply text-sm font-mono tracking-wide block;
  }

  .military-avatar {
    @apply p-4 border border-[#FFD700]/30 bg-black/40 rounded;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
  }

  .military-data-list {
    @apply grid gap-4 font-mono;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .data-row {
    @apply flex flex-col items-center justify-center p-4 bg-black/80 rounded-sm;
    position: relative;
    border: 1px solid rgba(255, 215, 0, 0.1);
    box-shadow: 
      0 0 15px rgba(0, 0, 0, 0.3),
      inset 0 0 20px rgba(0, 0, 0, 0.5);
    min-height: 90px;
  }

  .data-row::before {
    content: '';
    position: absolute;
    inset: 1px;
    background: linear-gradient(180deg, 
      rgba(255, 215, 0, 0.1) 0%,
      transparent 15%,
      transparent 85%,
      rgba(255, 215, 0, 0.1) 100%
    );
    pointer-events: none;
  }

  .data-row::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      rgba(255, 215, 0, 0.3),
      transparent
    );
  }

  .data-label {
    @apply text-xs text-muted font-mono tracking-wider text-center mb-2;
    color: rgba(255, 215, 0, 0.6);
  }

  .data-value {
    @apply text-lg font-mono tracking-wide text-center font-bold;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }

  .data-row.highlight {
    background: linear-gradient(180deg,
      rgba(0, 0, 0, 0.9) 0%,
      rgba(255, 215, 0, 0.1) 100%
    );
    border: 1px solid rgba(255, 215, 0, 0.3);
    box-shadow: 
      0 0 20px rgba(255, 215, 0, 0.1),
      inset 0 0 30px rgba(0, 0, 0, 0.7);
  }

  .data-row.highlight .data-value {
    @apply text-[#FFD700];
    text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  }

  /* Special styling for negative stats like deaths and friendly fire */
  .data-row .data-value.text-red-500 {
    color: #ff4444;
    text-shadow: 0 0 10px rgba(255, 68, 68, 0.3);
  }

  /* Add subtle scan line effect specific to each stat box */
  .data-row::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 2px,
      rgba(255, 215, 0, 0.02) 2px,
      rgba(255, 215, 0, 0.02) 4px
    );
    pointer-events: none;
  }

  /* Optional: Add a subtle pulse animation to highlighted stats */
  @keyframes pulse {
    0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.1); }
    50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.2); }
    100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.1); }
  }

  .data-row.highlight {
    animation: pulse 3s ease-in-out infinite;
  }

  .military-avatar-large {
    @apply relative flex items-center justify-center;
    min-height: 200px;
  }

  .avatar-frame {
    @apply text-6xl p-8 border-2 border-[#FFD700]/30 bg-black/40 rounded;
    box-shadow: 
      0 0 30px rgba(255, 215, 0, 0.1),
      inset 0 0 20px rgba(0, 0, 0, 0.7);
  }

  .classification-stamp {
    @apply absolute -rotate-12 text-red-500 font-bold text-sm border-2 border-red-500 
           px-2 py-1 rounded opacity-80 top-4 right-4;
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  }

  .military-id-card {
    @apply space-y-2 p-4 border border-[#FFD700]/30 bg-black/60 rounded;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
  }

  .service-header {
    @apply flex justify-between items-start p-4 border border-[#FFD700]/30 bg-black/60 rounded;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
  }

  .primary-info {
    @apply space-y-2;
  }

  .codename {
    @apply space-y-1;
  }

  .rank-badge {
    @apply space-y-1;
  }

  .status-indicator {
    @apply text-right;
  }

  .service-details {
    @apply grid grid-cols-2 gap-4;
  }

  .detail-section {
    @apply p-3 border border-[#FFD700]/30 bg-black/60 rounded;
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.5);
  }

  .service-history {
    @apply p-4 border border-[#FFD700]/30 bg-black/60 rounded;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
  }

  .history-content {
    @apply mt-2 p-3 bg-black/40 rounded;
    max-height: 150px;
    overflow-y: auto;
  }

  .history-content::-webkit-scrollbar {
    width: 8px;
  }

  .history-content::-webkit-scrollbar-track {
    @apply bg-black/40 rounded;
  }

  .history-content::-webkit-scrollbar-thumb {
    @apply bg-[#FFD700]/30 rounded;
    border: 1px solid rgba(255, 215, 0, 0.1);
  }

  /* Add scan line effect to sections */
  .service-header::before,
  .detail-section::before,
  .service-history::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 1px,
      rgba(255, 215, 0, 0.02) 2px,
      rgba(255, 215, 0, 0.02) 3px
    );
    pointer-events: none;
  }

  .security-clearance {
    @apply mt-2 p-2 bg-black/40 border-t border-[#FFD700]/30;
  }

  .security-clearance .data-value {
    @apply text-lg;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
</style> 