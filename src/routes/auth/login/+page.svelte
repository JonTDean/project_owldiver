<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import toast from 'svelte-french-toast';

  let email = '';
  let password = '';
</script>

<div class="fixed inset-0 bg-black">
  <!-- Content Overlay -->
  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
    <div class="space-y-6 p-8 rounded-lg bg-black max-w-md mx-auto border-2 border-yellow-500/50">
      <!-- Military-style header -->
      <div class="border-b-2 border-red-600 pb-4">
        <h2 class="text-sm font-mono tracking-widest text-red-500 mb-2">SUPER EARTH MILITARY COMMAND</h2>
        <h1 class="text-3xl font-bold mb-2 uppercase tracking-wider">Access Terminal</h1>
        <p class="text-gray-400 font-mono">SECURITY CLEARANCE REQUIRED</p>
      </div>

      <form 
        class="space-y-6 font-mono" 
        method="POST" 
        use:enhance={() => {
          return async ({ result }) => {
            if (result.type === 'success') {
              toast.success('Welcome back, Helldiver!');
              // Redirect will be handled by the server
            } else {
              toast.error('Authentication failed. Check your credentials.');
            }
          };
        }}
      >
        <!-- Form fields remain the same but with name attributes -->
        <div class="space-y-2 text-left">
          <Label class="text-white/90 uppercase tracking-wider" for="email">Identification Code</Label>
          <Input
            id="email"
            name="email"
            type="email"
            bind:value={email}
            class="bg-black border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
            placeholder="ENTER EMAIL"
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
            class="bg-black border-white/20 text-white placeholder:text-gray-500 focus:border-red-500"
            placeholder="ENTER PASSWORD"
            required
          />
        </div>

        <!-- Button remains the same but type="submit" -->
        <Button 
          type="submit"
          class="relative group w-full bg-red-700 hover:bg-red-800 text-white font-mono border-2 border-red-500 
          transform transition-all duration-200 hover:scale-105 px-8 py-4 uppercase tracking-widest
          before:absolute before:inset-0 before:border-2 before:border-red-500/50 before:transform before:translate-x-1 before:translate-y-1
          after:absolute after:inset-0 after:border-2 after:border-white/10 after:-translate-x-1 after:-translate-y-1
          shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
        >
          <span class="relative z-10">Login</span>
        </Button>
      </form>
    </div>
  </div>
</div>
