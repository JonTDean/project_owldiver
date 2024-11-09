<script lang="ts">
  import { onMount } from 'svelte';
  import { registrationSuccess } from '$lib/stores/auth';
  import MilitaryHeader from '$lib/components/ui/header/MilitaryHeader.svelte';

  onMount(() => {
    if ($registrationSuccess) {
      registrationSuccess.set(false);
    }
  });
</script>

<div class="fixed inset-0 bg-[#0a0a0a] overflow-auto">
  <div class="container mx-auto p-4">
    <!-- Top Secret Classification Banner -->
    <div class="border border-[#FFD700]/30 bg-black/60 p-2 mb-6 relative">
      <div class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FFD700]/30"></div>
      <div class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FFD700]/30"></div>
      <div class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FFD700]/30"></div>
      <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FFD700]/30"></div>
      <div class="text-center font-mono">
        <div class="text-red-500 text-xs tracking-[0.5em] animate-pulse">TOP SECRET</div>
        <div class="text-[#FFD700]/50 text-[10px] tracking-[0.2em]">CLEARANCE LEVEL ALPHA</div>
      </div>
    </div>

    <MilitaryHeader 
      title="OWLDIVER COMMAND CENTER" 
      subtitle="SUPER EARTH MILITARY INTELLIGENCE DIVISION" 
      securityLevel="LEVEL 5 - TOP SECRET"
    />

    <div class="space-y-6">
      <!-- Mission Stats Panel -->
      <div class="military-panel">
        <div class="panel-header">
          <div class="header-accent"></div>
          <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">OPERATIONAL STATUS REPORT</h2>
          <div class="header-accent"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div class="stat-box">
            <div class="stat-header">ACTIVE OPERATIONS</div>
            <div class="stat-value">12</div>
            <div class="stat-footer">PRIORITY LEVEL: ALPHA</div>
          </div>
          <div class="stat-box">
            <div class="stat-header">SUCCESSFUL MISSIONS</div>
            <div class="stat-value">487</div>
            <div class="stat-footer">CASUALTY RATIO: 0.23</div>
          </div>
          <div class="stat-box">
            <div class="stat-header">TOTAL CASUALTIES</div>
            <div class="stat-value">1,337</div>
            <div class="stat-footer">FOR SUPER EARTH</div>
          </div>
        </div>
      </div>

      <!-- Recent Operations Panel -->
      <div class="military-panel">
        <div class="panel-header">
          <div class="header-accent"></div>
          <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">RECENT TACTICAL OPERATIONS</h2>
          <div class="header-accent"></div>
        </div>

        <div class="p-4 space-y-3">
          {#each Array(3) as _, i}
            <div class="operation-box">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-[#FFD700] font-mono text-sm tracking-wider">OPERATION DEADFALL</div>
                  <div class="text-xs text-[#FFD700]/50 font-mono mt-1">
                    <span class="mr-2">SECTOR: X-274</span>
                    <span class="mr-2">•</span>
                    <span>STATUS: IN PROGRESS</span>
                  </div>
                </div>
                <div class="text-[#FFD700]/70 font-mono text-xs">T-MINUS 2:00:00</div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Mission Objectives Panel -->
      <div class="military-panel">
        <div class="panel-header">
          <div class="header-accent"></div>
          <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">PRIORITY OBJECTIVES</h2>
          <div class="header-accent"></div>
        </div>

        <div class="p-4">
          <ul class="space-y-3">
            {#each ['ELIMINATE TERMINID PRESENCE IN SECTOR X-274', 'DEPLOY AUTOMATED DEFENSE SYSTEMS', 'EXTRACT STRATEGIC RESOURCES'] as objective}
              <li class="objective-item">
                <div class="w-1.5 h-1.5 bg-[#FFD700] animate-pulse"></div>
                <span class="font-mono text-sm tracking-wider text-[#FFD700]/80">{objective}</span>
              </li>
            {/each}
          </ul>
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

  .stat-box {
    @apply p-4 border border-[#FFD700]/20 bg-black/40 relative;
  }

  .stat-header {
    @apply text-xs font-mono tracking-[0.2em] text-[#FFD700]/70 mb-2;
  }

  .stat-value {
    @apply text-2xl font-mono text-[#FFD700] mb-2;
  }

  .stat-footer {
    @apply text-[10px] font-mono tracking-[0.1em] text-[#FFD700]/50;
  }

  .operation-box {
    @apply p-3 border border-[#FFD700]/20 bg-black/40 relative;
  }

  .objective-item {
    @apply flex items-center gap-3 p-2 border border-[#FFD700]/20 bg-black/40;
  }

  /* Scanline effect */
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
</style> 