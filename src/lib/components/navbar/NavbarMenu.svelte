<script lang="ts">
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';
  import HamburgerIcon from '../icons/HamburgerIcon.svelte';
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

{#if user}
  <div class="relative z-[1000]">
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
  <div class="flex items-center gap-4">
    <a href="/about" class="font-mono text-xs tracking-[0.1em] text-[#FFD700]/50 hover:text-[#FFD700] 
                          transition-colors">
      ABOUT
    </a>
  </div>
{/if}

{#if menuOpen}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
    on:click={toggleMenu}
    role="button"
    tabindex="0"
    aria-label="Close menu"
  ></div>
{/if} 