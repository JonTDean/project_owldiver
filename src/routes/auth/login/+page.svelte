<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import toast from 'svelte-french-toast';
  
  let username = '';
  let password = '';

  async function handleSubmit() {
    try {
      // Add login logic here
      console.log('Login attempt:', { username });
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  }
</script>

<div class="container mx-auto p-4 max-w-md">
  <h1 class="text-3xl font-bold mb-6">Login</h1>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="username" class="block text-sm font-medium mb-1">Username</label>
      <input
        type="text"
        id="username"
        bind:value={username}
        class="w-full p-2 rounded-md border"
        required
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium mb-1">Password</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        class="w-full p-2 rounded-md border"
        required
      />
    </div>
    <Button type="submit" class="w-full">Login</Button>
  </form>
</div>
