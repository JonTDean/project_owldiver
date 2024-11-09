<script lang="ts">
  import type { AuthUser } from '$lib/types';
  import NavbarAuth from './navbar/NavbarAuth.svelte';
  import NavbarLogo from './navbar/NavbarLogo.svelte';
  import NavbarMenu from './navbar/NavbarMenu.svelte';

  export let user: AuthUser | null;
</script>

<nav class="border-b border-[#FFD700]/20 backdrop-blur-sm bg-black/80 sticky top-0 z-[999] 
           shadow-[0_0_20px_rgba(255,215,0,0.1)]">
  <div class="container max-w-7xl mx-auto px-4">
    <div class="flex items-center h-16 relative">
      <!-- Fixed width for menu -->
      <div class="w-[100px]">
        <NavbarMenu {user} />
      </div>
      
      <!-- Centered logo -->
      <div class="absolute left-1/2 -translate-x-1/2">
        <NavbarLogo {user} />
      </div>
      
      <!-- Fixed width for auth -->
      <div class="w-[100px] ml-auto">
        <NavbarAuth {user} />
      </div>
    </div>
  </div>
</nav>
