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
    <div class="flex items-center justify-between h-16">
      <NavbarMenu {user} />
      <NavbarLogo {user} />
      <NavbarAuth {user} />
    </div>
  </div>
</nav>
