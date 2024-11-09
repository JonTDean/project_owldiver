<script lang="ts">
  import type { AuthUser } from '$lib/types';
  
  export let user: AuthUser | null;
</script>

<div class="flex items-center gap-4">
  {#if user}
    <a 
      href="/auth/account-settings"
      class="font-mono text-xs tracking-[0.1em] text-[#FFD700]/50 hover:text-[#FFD700] 
             transition-colors flex items-center gap-2"
    >
      <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
      SETTINGS
    </a>
    <form action="/auth/logout" method="POST">
      <button 
        type="submit"
        class="font-mono text-xs tracking-[0.1em] text-[#FFD700] hover:text-[#FF4444] 
               transition-colors flex items-center gap-2"
      >
        <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
        LOGOUT
      </button>
    </form>
  {:else}
    <a 
      href="/auth/login"
      class="font-mono text-xs tracking-[0.1em] text-[#FFD700]/50 hover:text-[#FFD700] 
             transition-colors"
    >
      LOGIN
    </a>
    <a 
      href="/auth/register"
      class="font-mono text-xs tracking-[0.1em] text-[#FFD700] 
             drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"
    >
      REGISTER
    </a>
  {/if}
</div> 