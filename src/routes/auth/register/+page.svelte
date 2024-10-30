<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import toast from 'svelte-french-toast';
  
  let username = '';
  let email = '';
  let password = '';
  let confirmPassword = '';

  async function handleSubmit() {
    try {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      // Add registration logic here
      console.log('Registration attempt:', { username, email });
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    }
  }
</script>

<div class="container mx-auto p-4 max-w-md">
  <h1 class="text-3xl font-bold mb-6">Register</h1>
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
      <label for="email" class="block text-sm font-medium mb-1">Email</label>
      <input
        type="email"
        id="email"
        bind:value={email}
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
    <div>
      <label for="confirmPassword" class="block text-sm font-medium mb-1">Confirm Password</label>
      <input
        type="password"
        id="confirmPassword"
        bind:value={confirmPassword}
        class="w-full p-2 rounded-md border"
        required
      />
    </div>
    <Button type="submit" class="w-full">Register</Button>
  </form>
</div>
