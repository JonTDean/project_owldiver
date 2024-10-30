<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Menu } from "lucide-svelte";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
  } from "$lib/components/ui/dropdown-menu";

  const navItems = [
    { title: 'Recommended Builds', href: '/recommended_builds' },
    { title: 'Guild Mission Objectives', href: '/guild_mo' },
    { title: 'Guild History', href: '/history' },
    { title: 'Wall of Fame/Shame', href: '/the_wall' },
    { title: 'Members', href: '/members' }
  ];

  function handleLogin() {
    window.location.href = '/auth/login';
  }

  function handleRegister() {
    window.location.href = '/auth/register';
  }

  let isOpen = false;

  function handleDropdownChange(value: boolean) {
    isOpen = value;
    console.log('Dropdown state:', isOpen);
  }
</script>

<div class="w-full border-b bg-background">
  <nav class="w-full">
    <div class="w-full flex h-16 items-center justify-between px-4">
      <div class="flex items-center gap-4">
        <DropdownMenu bind:open={isOpen}>
          <div class="relative">
            <DropdownMenuTrigger class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer p-2">
              <Menu class="h-6 w-6" />
              <span class="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent 
            class="w-56 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md"
          >
            {#each navItems as item}
              <DropdownMenuItem class="focus:bg-gray-100 dark:focus:bg-gray-700">
                <a
                  href={item.href}
                  class="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm"
                >
                  {item.title}
                </a>
              </DropdownMenuItem>
            {/each}
          </DropdownMenuContent>
        </DropdownMenu>

        <a href="/" class="text-xl font-bold hover:text-primary transition-colors">
          Owl Enforcers
        </a>
      </div>

      <div class="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          class="hidden sm:inline-flex"
          onclick={handleLogin}
        >
          Login
        </Button>
        <Button 
          size="sm"
          onclick={handleRegister}
        >
          Register
        </Button>
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
