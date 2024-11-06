<script lang="ts">
  import AuthLayout from '$lib/components/ui/layout/AuthLayout.svelte';
  import RegisterForm from '$lib/components/auth/RegisterPage/RegisterForm.svelte';
  import { onMount } from 'svelte';
  import { formAnimation } from '$lib/stores/formAnimation';
  import { bootState } from '$lib/stores/bootSequence';

  onMount(() => {
    formAnimation.reset();
    // Reset boot state when page loads
    bootState.set({
      terminalComplete: false,
      formVisible: false
    });
  });
</script>

<AuthLayout 
  title="ENLISTMENT TERMINAL" 
  subtitle="AWAITING NEW RECRUIT DATA"
  mode="register"
>
  <RegisterForm />
</AuthLayout>
