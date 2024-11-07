<script lang="ts">
  import { page } from '$app/stores';
  import HamburgerIcon from './icons/HamburgerIcon.svelte';
  import { slide } from 'svelte/transition';
  import type { AuthUser } from '$lib/types';

  export let user: AuthUser | null;

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
<nav class="border-b border-[#FFD700]/20 backdrop-blur-sm bg-black/80 sticky top-0 z-[999] 
           shadow-[0_0_20px_rgba(255,215,0,0.1)]">
  <div class="container max-w-7xl mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Left: Hamburger Menu (only show if authenticated) -->
      {#if user}
        <div class="relative">
          <HamburgerIcon open={menuOpen} on:click={toggleMenu} />
          
          {#if menuOpen}
            <div 
              class="absolute top-full left-0 w-64 mt-2 bg-black/90 border border-[#FFD700]/20
                     shadow-[0_0_15px_rgba(255,215,0,0.1)]"
              transition:slide={{ duration: 200 }}
            >
              <div class="p-2 border-b border-[#FFD700]/20">
                <p class="text-[10px] font-mono tracking-[0.2em] text-[#FFD700]/70">
                  WELCOME, {user.username}
                </p>
              </div>
              <div class="py-2">
                {#each navItems as { href, label }}
                  <a
                    {href}
                    class="flex items-center gap-3 px-4 py-2 font-mono text-xs tracking-[0.1em] 
                           hover:bg-[#FFD700]/5 transition-colors
                           {$page.url.pathname === href ? 'text-[#FFD700] bg-[#FFD700]/10' : 'text-[#FFD700]/50'}"
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
      {:else}
        <!-- Show public nav items when not authenticated -->
        <div class="flex items-center gap-4">
          <a href="/about" class="font-mono text-xs tracking-[0.1em] text-[#FFD700]/50 hover:text-[#FFD700] 
                                transition-colors">
            ABOUT
          </a>
        </div>
      {/if}

      <!-- Center: Logo -->
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-[#FFD700] animate-pulse rounded-full 
                    shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
        <a href={user ? '/dashboard' : '/'} 
           class="font-mono text-[#FFD700] text-sm tracking-[0.2em] font-bold
                  drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
          OWLDIVER
        </a>
      </div>

      <!-- Right: Auth Menu -->
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
