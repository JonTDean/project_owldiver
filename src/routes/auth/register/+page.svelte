<script lang="ts">
  import { enhance } from '$app/forms';
  import AuthLayout from '$lib/components/ui/layout/AuthLayout.svelte';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import type { ActionData } from './$types';
  import toast from 'svelte-french-toast';

  export let form: ActionData;

  let loading = false;
  let formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  $: isValid = formData.password === formData.confirmPassword && 
               formData.password.length >= 8 &&
               formData.email.includes('@');

  function handleSubmit() {
    if (!isValid) {
      toast.error('Please check your form inputs');
      return;
    }
    loading = true;
    
    return async ({ result }) => {
      loading = false;
      if (result.type === 'success') {
        window.location.href = '/auth/setup-profile';
      } else {
        toast.error(form?.message || 'Registration failed');
      }
    };
  }
</script>

<AuthLayout 
  title="Enlistment Terminal"
  subtitle="AWAITING NEW RECRUIT DATA"
>
  <form 
    method="POST" 
    class="space-y-6 font-mono"
    use:enhance={handleSubmit}
  >
    <div class="space-y-4">
      <Input
        name="username"
        placeholder="USERNAME"
        bind:value={formData.username}
        required
      />
      
      <Input
        name="email"
        type="email"
        placeholder="EMAIL"
        bind:value={formData.email}
        required
      />
      
      <Input
        name="password"
        type="password"
        placeholder="PASSWORD"
        bind:value={formData.password}
        required
      />
      
      <Input
        name="confirmPassword"
        type="password"
        placeholder="CONFIRM PASSWORD"
        bind:value={formData.confirmPassword}
        required
      />
    </div>

    <Button 
      type="submit"
      disabled={loading || !isValid}
      class="w-full"
    >
      {loading ? 'PROCESSING...' : 'ENLIST NOW'}
    </Button>

    <div class="text-sm text-center text-gray-400">
      <a href="/auth/login" class="hover:text-red-500 transition-colors">
        Already a Helldiver? Login Here
      </a>
    </div>
  </form>
</AuthLayout>
