<script lang="ts">
  export let tracerCount: number = 6;
  export let tracerDuration: number = 12;
  export let tracerDelay: number = 3;
</script>

<div class="fixed inset-0">
  <svg width="100%" height="100%" class="absolute inset-0" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id="etherealGlow" x="-150%" y="-150%" width="400%" height="400%">
        <!-- Existing filter definitions -->
      </filter>
    </defs>

    {#each Array(tracerCount) as _, i}
      <line 
        class="light-tracer"
        x1="0" 
        y1="0" 
        x2="15" 
        y2="0"
      >
        <animate
          attributeName="opacity"
          values="0;0.3;0.3;0"
          dur="{tracerDuration}s"
          begin={`${-i * tracerDelay}s`}
          repeatCount="indefinite"
        />
        <animateMotion
          dur="{tracerDuration}s"
          begin={`${-i * tracerDelay}s`}
          repeatCount="indefinite"
          rotate="auto"
          path={[
            "M0,270 H960 V540 H1920",
            "M0,540 H480 V810 H1440 V540 H1920",
            "M0,810 H960 V540 H1920",
            "M480,0 V540 H960 V1080",
            "M960,0 V270 H1440 V1080",
            "M1440,0 V540 H960 V1080"
          ][i]}
        />
      </line>
    {/each}
  </svg>
</div>

<style>
  /* Existing light tracer styles */
</style> 