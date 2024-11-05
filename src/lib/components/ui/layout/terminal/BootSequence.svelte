<script lang="ts">
  export let lines: string[] = [];
  export let show: boolean = true;
  export let currentLine: number = 0;
</script>

{#if show}
  <div class="fixed inset-0 bg-black z-50 flex items-center justify-center">
    <div class="font-mono text-primary/80 space-y-2">
      {#each lines.slice(0, currentLine + 1) as line}
        <div class="flex items-center gap-2 boot-line">
          <span class="w-2 h-2 bg-primary/80 animate-pulse"></span>
          <p>{line}</p>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .boot-line {
    opacity: 0;
    animation: bootLine 0.5s ease forwards;
  }

  @keyframes bootLine {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style> 