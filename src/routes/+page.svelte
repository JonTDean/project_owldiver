<script lang="ts">
import { Button } from '$lib/components/ui/button';
import toast from 'svelte-french-toast';

function showToast() {
  console.log('Toast triggered');
  toast.success('Welcome to the Owl Enforcers', {
    duration: 3000,
    position: 'top-center'
  });
}
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">Welcome to the Owl Enforcers</h1>
  <Button onclick={showToast}>Click me!</Button>
</div>
