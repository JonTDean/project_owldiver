<script lang="ts">
	import type { AuthUser } from "$lib/types";

  export let user: AuthUser | null;
</script>

<div class="flex items-center justify-center">
  <div class="relative">
    <!-- Military decorative elements -->
    <div class="flex items-center gap-3">
      <!-- Left decorative elements -->
      <div class="flex items-center gap-1">
        <div class="w-1 h-4 bg-[#FFD700]/30"></div>
        <div class="w-3 h-px bg-[#FFD700]/30"></div>
        <div class="w-1.5 h-1.5 rotate-45 border border-[#FFD700]/30"></div>
      </div>

      <!-- Logo content -->
      <a href={user ? '/dashboard' : '/'} 
         class="font-mono text-[#FFD700] text-sm tracking-[0.2em] font-bold
                drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] flex flex-col items-center">
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 bg-[#FFD700] animate-pulse rounded-full 
                      shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
          <span>OWLDIVER</span>
          <div class="w-1.5 h-1.5 bg-[#FFD700] animate-pulse rounded-full 
                      shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
        </div>
      </a>

      <!-- Right decorative elements -->
      <div class="flex items-center gap-1">
        <div class="w-1.5 h-1.5 rotate-45 border border-[#FFD700]/30"></div>
        <div class="w-3 h-px bg-[#FFD700]/30"></div>
        <div class="w-1 h-4 bg-[#FFD700]/30"></div>
      </div>
    </div>

    <!-- Top accent line -->
    <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r 
                from-transparent via-[#FFD700]/30 to-transparent"></div>
    
    <!-- Bottom accent line -->
    <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r 
                from-transparent via-[#FFD700]/30 to-transparent"></div>
  </div>
</div> 