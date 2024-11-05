<script lang="ts">
  import { enhance } from '$app/forms';
  import AuthLayout from '$lib/components/ui/layout/AuthLayout.svelte';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import type { ActionData } from './$types';
  import toast from 'svelte-french-toast';
  import { DiscordIcon, GoogleIcon } from '$lib/components/icons';

  export let form: ActionData;

  let loading = false;
  let identifier = '';
  let password = '';

  function handleSubmit() {
    loading = true;
    return async ({ result }) => {
      loading = false;
      if (result.type === 'failure') {
        toast.error(result.data?.message || 'Authentication failed');
      }
    };
  }
</script>

<AuthLayout 
  title="Access Terminal"
  subtitle="SECURITY CLEARANCE REQUIRED"
>
  <form 
    method="POST" 
    action="?/login"
    class="space-y-6 font-mono"
    use:enhance={handleSubmit}
  >
    <div class="space-y-4">
      <Input
        name="identifier"
        placeholder="CODENAME OR EMAIL"
        bind:value={identifier}
        required
      />
      
      <Input
        name="password"
        type="password"
        placeholder="SECURITY KEY"
        bind:value={password}
        required
      />
    </div>

    <Button 
      type="submit"
      disabled={loading}
      class="w-full"
    >
      {loading ? 'AUTHENTICATING...' : 'LOGIN'}
    </Button>

    <!-- OAuth buttons -->
    <div class="space-y-4">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t border-white/20"></span>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-black px-2 text-white/60">Or continue with</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <Button variant="outline" asChild>
          <a href="/auth/discord/login" class="flex items-center gap-2">
            <span class="h-5 w-5">{@html DiscordIcon}</span>
            Discord
          </a>
        </Button>
        
        <Button variant="outline" asChild>
          <a href="/auth/google/login" class="flex items-center gap-2">
            <span class="h-5 w-5">{@html GoogleIcon}</span>
            Google
          </a>
        </Button>
      </div>
    </div>

    <div class="text-sm text-center text-gray-400">
      <a href="/auth/register" class="hover:text-red-500 transition-colors">
        Not a Helldiver? Enlist Here
      </a>
    </div>
  </form>
</AuthLayout>
