<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Menu, User } from "lucide-svelte";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
  } from "$lib/components/ui/dropdown-menu";

  const navItems = [
    { title: 'RECOMMENDED LOADOUTS', href: '/loadouts' },
    { title: 'ACTIVE OPERATIONS', href: '/active_operations' },
    { title: 'MISSION HISTORY', href: '/mission_history' },
    { title: 'COMMENDATIONS & DEMERITS', href: '/commendations' },
    { title: 'ACTIVE PERSONNEL', href: '/personnel' }
  ];

  function handleLogin() {
    window.location.href = '/auth/login';
  }

  function handleRegister() {
    window.location.href = '/auth/register';
  }

  function handleLogout() {
    fetch('/auth/logout', { method: 'POST' })
      .then(() => {
        window.location.href = '/';
      });
  }

  let isOpen = false;
  let userMenuOpen = false;
  export let user: { username: string } | null = null;
</script>

<div class="w-full border-b border-red-600/20 bg-black/80 backdrop-blur-sm">
  <nav class="w-full">
    <div class="w-full flex h-16 items-center justify-between px-4">
      <div class="flex items-center gap-4">
        <DropdownMenu bind:open={isOpen}>
          <div class="relative">
            <DropdownMenuTrigger class="inline-flex items-center justify-center rounded-md text-sm font-mono transition-colors hover:bg-red-900/20 text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 cursor-pointer p-2">
              <Menu class="h-6 w-6" />
              <span class="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent 
            class="w-72 mt-2 bg-black/90 border border-red-500/20 shadow-lg rounded-md font-mono"
          >
            {#each navItems as item}
              <DropdownMenuItem class="focus:bg-red-900/20">
                <a
                  href={item.href}
                  class="w-full px-4 py-2 text-sm text-gray-300 hover:text-red-500 transition-colors rounded-sm"
                >
                  {item.title}
                </a>
              </DropdownMenuItem>
            {/each}
          </DropdownMenuContent>
        </DropdownMenu>

        <a href="/" class="text-xl font-mono font-bold text-red-500 hover:text-red-400 transition-colors tracking-wider">
          OWLDIVERS
        </a>
      </div>

      <div class="flex items-center gap-2">
        {#if user}
          <DropdownMenu bind:open={userMenuOpen}>
            <DropdownMenuTrigger class="inline-flex items-center justify-center rounded-full w-10 h-10 bg-red-900/50 hover:bg-red-800/50 border border-red-500/50 transition-colors">
              <User class="h-5 w-5 text-red-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56 mt-2 bg-black/90 border border-red-500/20 font-mono">
              <div class="px-4 py-2 text-sm font-semibold border-b border-red-500/20 text-red-500">
                OPERATIVE: {user.username}
              </div>
              <DropdownMenuItem class="focus:bg-red-900/20">
                <a href="/auth/account-settings" class="w-full text-gray-300 hover:text-red-500 transition-colors">
                  SECURITY SETTINGS
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator class="bg-red-500/20" />
              <DropdownMenuItem class="focus:bg-red-900/20">
                <button class="w-full text-left text-red-500 hover:text-red-400 transition-colors" on:click={handleLogout}>
                  TERMINATE SESSION
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        {:else}
          <Button 
            variant="ghost" 
            size="sm" 
            class="hidden sm:inline-flex font-mono text-red-500 hover:bg-red-900/20 hover:text-red-400"
            on:click={handleLogin}
          >
            LOGIN
          </Button>
          <Button 
            size="sm"
            class="font-mono bg-red-900/50 hover:bg-red-800/50 text-red-500 border border-red-500/50"
            on:click={handleRegister}
          >
            ENLIST NOW
          </Button>
        {/if}
      </div>
    </div>
  </nav>
</div>

<style>
  :global(.dropdown-menu-content) {
    position: absolute;
    z-index: 999;
  }
</style>
