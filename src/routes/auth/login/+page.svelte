<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionResult } from '@sveltejs/kit';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import toast from 'svelte-french-toast';
  import { DiscordIcon, GoogleIcon } from '$lib/components/icons';

  let loading = false;
  let identifier = '';
  let password = '';

  const handleSubmit = () => {
    loading = true;
    return async ({ result, update }: { result: ActionResult, update: () => Promise<void> }) => {
      if (result.type === 'failure') {
        loading = false;
        toast.error(result.data?.message || 'AUTHENTICATION FAILED - CHECK YOUR CREDENTIALS SOLDIER');
      }
      // Make sure we call update() to handle the redirect
      await update();
    };
  };
</script>

<div class="fixed inset-0" style="background-color: #0a0a0a;">
  <!-- Content Overlay -->
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
    <div class="space-y-6 p-8 rounded-lg bg-black/40 backdrop-blur-sm max-w-md mx-auto border border-red-500/20">
      <!-- Military-style header -->
      <div class="border-b-2 border-red-600 pb-4">
        <h2 class="text-sm font-mono tracking-widest text-red-500 mb-2">SUPER EARTH MILITARY COMMAND</h2>
        <h1 class="text-3xl font-bold mb-2 uppercase tracking-wider">Access Terminal</h1>
        <p class="text-gray-400 font-mono">SECURITY CLEARANCE REQUIRED</p>
      </div>

      <form 
        class="space-y-6 font-mono" 
        method="POST" 
        action="?/login"
        use:enhance={handleSubmit}
      >
        <div class="space-y-2 text-left">
          <Label class="text-white/90 uppercase tracking-wider" for="identifier">Codename or Email</Label>
          <Input
            id="identifier"
            name="identifier"
            type="text"
            bind:value={identifier}
            class="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
            placeholder="ENTER CODENAME OR EMAIL"
            required
          />
        </div>

        <div class="space-y-2 text-left">
          <Label class="text-white/90 uppercase tracking-wider" for="password">Security Key</Label>
          <Input
            id="password"
            name="password"
            type="password"
            bind:value={password}
            class="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
            placeholder="ENTER SECURITY KEY"
            required
          />
        </div>

        <Button 
          type="submit"
          disabled={loading}
          class="relative group w-full bg-red-900/50 hover:bg-red-800/50 text-red-500 font-mono border border-red-500/50 
          transform transition-all duration-200 hover:scale-105 px-8 py-4 uppercase tracking-wider"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            <span class="text-red-300">&gt;</span>
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            <span class="text-red-300">&lt;</span>
          </span>
        </Button>

        <div class="text-sm text-gray-400">
          <a href="/auth/register" class="hover:text-red-500 transition-colors">
            Not a Helldiver? Enlist Here
          </a>
        </div>
      </form>

      <div class="space-y-4 mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-white/20"></span>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-black px-2 text-white/60">Or continue with</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <a 
            href="/auth/discord/login"
            class="flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
          >
            {@html `<div class="h-5 w-5">${DiscordIcon}</div>`}
            Discord
          </a>
          <a 
            href="/auth/google/login"
            class="flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
          >
            {@html `<div class="h-5 w-5">${GoogleIcon}</div>`}
            Google
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
