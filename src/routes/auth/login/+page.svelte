<script lang="ts">
  import AuthLayout from '$lib/components/ui/layout/AuthLayout.svelte';
  import LoginForm from '$lib/components/auth/LoginForm.svelte';
  import { onMount } from 'svelte';
  import { formAnimation } from '$lib/stores/formAnimation';

  onMount(() => {
    formAnimation.reset();
  });
</script>

<AuthLayout 
  title="ACCESS TERMINAL" 
  subtitle="SECURITY CLEARANCE REQUIRED"
  mode="login"
>
  <LoginForm />
</AuthLayout>
