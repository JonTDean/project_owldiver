<script lang="ts">
  import { page } from '$app/stores';
  import HamburgerIcon from './icons/HamburgerIcon.svelte';
  import { slide } from 'svelte/transition';

  const navItems = [
    { href: '/operations', label: 'ACTIVE OPERATIONS' },
    { href: '/loadouts', label: 'LOADOUTS' },
    { href: '/personnel', label: 'PERSONNEL' },
    { href: '/history', label: 'MISSION HISTORY' },
    { href: '/commendations', label: 'COMMENDATIONS' },
  ];

  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
  }
</script>

<!-- Navigation -->
<nav class="border-b border-themed backdrop-blur-sm bg-background/80 sticky top-0 z-50">
  <div class="container max-w-7xl mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Left: Hamburger Menu -->
      <div class="relative">
        <HamburgerIcon open={menuOpen} on:click={toggleMenu} />
        
        {#if menuOpen}
          <div 
            class="absolute top-full left-0 w-64 mt-2 bg-background border border-themed"
            transition:slide={{ duration: 200 }}
          >
            <div class="p-2 border-b border-themed">
              <p class="text-[10px] font-mono tracking-[0.2em] text-primary">TACTICAL MENU</p>
            </div>
            <div class="py-2">
              {#each navItems as { href, label }}
                <a
                  {href}
                  class="flex items-center gap-3 px-4 py-2 font-mono text-xs tracking-[0.1em] 
                         hover:bg-accent/20 transition-colors
                         {$page.url.pathname === href ? 'text-primary bg-accent/10' : 'text-muted'}"
                  on:click={() => menuOpen = false}
                >
                  <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
                  {label}
                </a>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Center: Logo -->
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-primary animate-pulse rounded-full"></div>
        <a href="/dashboard" class="font-mono text-primary text-sm tracking-[0.2em] font-bold">
          OWLDIVER
        </a>
      </div>

      <!-- Right: Auth Menu -->
      <div class="flex items-center gap-4">
        <a 
          href="/auth/account-settings"
          class="font-mono text-xs tracking-[0.1em] text-muted hover:text-primary transition-colors
                 flex items-center gap-2"
        >
          <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
          SETTINGS
        </a>
        <form action="/auth/logout" method="POST">
          <button 
            type="submit"
            class="font-mono text-xs tracking-[0.1em] text-primary hover:text-red-400 transition-colors
                   flex items-center gap-2"
          >
            <div class="w-1.5 h-1.5 rounded-full bg-current"></div>
            LOGOUT
          </button>
        </form>
      </div>
    </div>
  </div>
</nav>

<!-- Menu Overlay -->
{#if menuOpen}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
    on:click={toggleMenu}
    role="button"
    tabindex="0"
    aria-label="Close menu"
  ></div>
{/if}
