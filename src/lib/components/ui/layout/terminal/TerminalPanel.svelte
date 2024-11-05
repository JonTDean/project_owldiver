<script lang="ts">
  export let title: string = "";
  export let securityLevel: string = "ALPHA";
  export let statusMessage: string = "AWAITING INPUT";
</script>

<div class="cyber-terminal p-6 border-l-2 border-r-2 border-primary/30 bg-black/90 relative">
  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
  <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
  
  <h1 class="text-3xl font-bold tracking-wider mb-2 cyber-glitch" data-text={title}>
    {title}
  </h1>
  
  <div class="cyber-status">
    <span class="text-xs tracking-[0.3em] text-primary/60">SECURITY LEVEL: {securityLevel}</span>
    <div class="flex items-center justify-center gap-2 mt-2">
      <div class="h-1 w-1 bg-primary animate-pulse"></div>
      <span class="text-xs tracking-[0.2em] text-primary/80">{statusMessage}</span>
      <div class="h-1 w-1 bg-primary animate-pulse"></div>
    </div>
  </div>
</div>

<style>
  .cyber-glitch {
    position: relative;
    text-shadow: 0 0 5px var(--color-primary);
  }

  .cyber-glitch::before,
  .cyber-glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip: rect(0, 900px, 0, 0);
  }

  .cyber-glitch::before {
    left: 2px;
    text-shadow: -1px 0 var(--color-red-500);
    animation: glitch-1 2s infinite linear alternate-reverse;
  }

  .cyber-glitch::after {
    left: -2px;
    text-shadow: 1px 0 var(--color-blue-500);
    animation: glitch-2 3s infinite linear alternate-reverse;
  }

  @keyframes glitch-1 {
    0% { clip: rect(20px, 900px, 21px, 0); }
    100% { clip: rect(42px, 900px, 43px, 0); }
  }

  @keyframes glitch-2 {
    0% { clip: rect(12px, 900px, 13px, 0); }
    100% { clip: rect(54px, 900px, 55px, 0); }
  }
</style> 