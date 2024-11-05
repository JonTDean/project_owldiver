<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { PageData } from './$types';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import toast from 'svelte-french-toast';

  export let data: PageData;

  let loading = {
    profile: false,
    password: false
  };

  let formData = {
    username: data.user?.username || '',
    email: data.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  const handleSubmit = (formType: 'profile' | 'password'): SubmitFunction => {
    loading[formType] = true;
    
    return async ({ result }) => {
      loading[formType] = false;

      if (result.type === 'failure') {
        toast.error(result.data?.message);
      } else if (result.data?.success) {
        toast.success(formType === 'profile' 
          ? 'PROFILE UPDATE SUCCESSFUL - NEW CREDENTIALS SAVED'
          : 'SECURITY KEY UPDATE SUCCESSFUL - NEW ACCESS PARAMETERS SAVED'
        );
        if (formType === 'password') {
          formData.currentPassword = '';
          formData.newPassword = '';
          formData.confirmPassword = '';
        }
      }
    };
  };
</script>

<div class="container max-w-4xl mx-auto px-4 py-8">
  <div class="space-y-8">
    <!-- Header -->
    <div class="border-b-2 border-primary pb-4">
      <h2 class="text-sm font-mono tracking-widest text-primary">SUPER EARTH MILITARY COMMAND</h2>
      <h1 class="text-3xl font-bold mt-2 text-foreground uppercase tracking-wider">Personnel File</h1>
      <div class="flex items-center gap-2 mt-2">
        <div class="w-2 h-2 bg-primary animate-pulse rounded-full"></div>
        <p class="text-[10px] text-muted font-mono tracking-[0.2em]">
          SECURITY CLEARANCE: LEVEL {Math.floor(Math.random() * 5) + 1}
        </p>
      </div>
    </div>

    <!-- Profile Section -->
    <div class="space-y-6 p-6 rounded-lg bg-background/40 backdrop-blur-sm border border-themed">
      <div class="border-b border-themed pb-4">
        <h2 class="text-lg font-bold text-foreground uppercase tracking-wider">Identity Parameters</h2>
        <p class="text-sm text-muted font-mono mt-1">Update your identification credentials</p>
      </div>

      <form 
        class="space-y-4" 
        method="POST" 
        action="?/updateProfile"
        use:enhance={handleSubmit('profile')}
      >
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label class="text-foreground/90 uppercase tracking-wider" for="username">Codename</Label>
            <Input
              id="username"
              name="username"
              bind:value={formData.username}
              class="bg-background/50 border-themed text-foreground placeholder:text-muted focus:border-primary"
              placeholder="ENTER CODENAME"
            />
          </div>

          <div class="space-y-2">
            <Label class="text-foreground/90 uppercase tracking-wider" for="email">Communication Channel</Label>
            <Input
              id="email"
              name="email"
              type="email"
              bind:value={formData.email}
              class="bg-background/50 border-themed text-foreground placeholder:text-muted focus:border-primary"
              placeholder="ENTER EMAIL"
            />
          </div>
        </div>

        <Button 
          type="submit"
          disabled={loading.profile}
          class="relative bg-accent/50 hover:bg-accent/60 text-primary font-mono border border-themed"
        >
          {loading.profile ? 'UPDATING...' : 'UPDATE PROFILE'}
        </Button>
      </form>
    </div>

    <!-- Security Section -->
    <div class="space-y-6 p-6 rounded-lg bg-background/40 backdrop-blur-sm border border-themed">
      <!-- ... rest of the security section remains the same but with updated theme classes ... -->
    </div>
  </div>
</div> 