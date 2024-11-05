<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionResult, PageData } from './$types';
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

  function handleSubmit(formType: 'profile' | 'password') {
    loading[formType] = true;
    
    return async ({ result }: { result: ActionResult }) => {
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
  }
</script>

<div class="container max-w-4xl mx-auto px-4 py-8">
  <div class="space-y-8">
    <!-- Header -->
    <div class="border-b-2 border-red-600 pb-4">
      <h2 class="text-sm font-mono tracking-widest text-red-500">SUPER EARTH MILITARY COMMAND</h2>
      <h1 class="text-3xl font-bold mt-2 text-white uppercase tracking-wider">Personnel File</h1>
      <div class="flex items-center gap-2 mt-2">
        <div class="w-2 h-2 bg-red-500 animate-pulse rounded-full"></div>
        <p class="text-[10px] text-gray-400 font-mono tracking-[0.2em]">
          SECURITY CLEARANCE: LEVEL {Math.floor(Math.random() * 5) + 1}
        </p>
      </div>
    </div>

    <!-- Profile Section -->
    <div class="space-y-6 p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-red-500/20">
      <div class="border-b border-red-500/20 pb-4">
        <h2 class="text-lg font-bold text-white uppercase tracking-wider">Identity Parameters</h2>
        <p class="text-sm text-gray-400 font-mono mt-1">Update your identification credentials</p>
      </div>

      <form 
        class="space-y-4" 
        method="POST" 
        action="?/updateProfile"
        use:enhance={() => handleSubmit('profile')}
      >
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label class="text-white/90 uppercase tracking-wider" for="username">Codename</Label>
            <Input
              id="username"
              name="username"
              bind:value={formData.username}
              class="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
              placeholder="ENTER CODENAME"
            />
          </div>

          <div class="space-y-2">
            <Label class="text-white/90 uppercase tracking-wider" for="email">Communication Channel</Label>
            <Input
              id="email"
              name="email"
              type="email"
              bind:value={formData.email}
              class="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
              placeholder="ENTER EMAIL"
            />
          </div>
        </div>

        <Button 
          type="submit"
          disabled={loading.profile}
          class="relative bg-red-900/50 hover:bg-red-800/50 text-red-500 font-mono border border-red-500/50"
        >
          {loading.profile ? 'UPDATING...' : 'UPDATE PROFILE'}
        </Button>
      </form>
    </div>

    <!-- Security Section -->
    <div class="space-y-6 p-6 rounded-lg bg-black/40 backdrop-blur-sm border border-red-500/20">
      <div class="border-b border-red-500/20 pb-4">
        <h2 class="text-lg font-bold text-white uppercase tracking-wider">Security Parameters</h2>
        <p class="text-sm text-gray-400 font-mono mt-1">Update your security key</p>
      </div>

      <form 
        class="space-y-4" 
        method="POST" 
        action="?/updatePassword"
        use:enhance={() => handleSubmit('password')}
      >
        <div class="space-y-4">
          <div class="space-y-2">
            <Label class="text-white/90 uppercase tracking-wider" for="currentPassword">Current Security Key</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              bind:value={formData.currentPassword}
              class="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
              placeholder="ENTER CURRENT SECURITY KEY"
            />
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label class="text-white/90 uppercase tracking-wider" for="newPassword">New Security Key</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                bind:value={formData.newPassword}
                class="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
                placeholder="ENTER NEW SECURITY KEY"
              />
            </div>

            <div class="space-y-2">
              <Label class="text-white/90 uppercase tracking-wider" for="confirmPassword">Confirm Security Key</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                bind:value={formData.confirmPassword}
                class="bg-black/50 border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
                placeholder="CONFIRM NEW SECURITY KEY"
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit"
          disabled={loading.password}
          class="relative bg-red-900/50 hover:bg-red-800/50 text-red-500 font-mono border border-red-500/50"
        >
          {loading.password ? 'UPDATING...' : 'UPDATE SECURITY KEY'}
        </Button>
      </form>
    </div>
  </div>
</div> 