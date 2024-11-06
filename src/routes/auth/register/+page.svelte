<script lang="ts">
  import AuthLayout from '$lib/components/ui/layout/AuthLayout.svelte';
  import RegisterForm from '$lib/components/auth/RegisterForm.svelte';
  import { onMount } from 'svelte';
  import { formAnimation } from '$lib/stores/formAnimation';
  import { bootState } from '$lib/stores/bootSequence';
  import { Toaster } from 'svelte-french-toast';

  onMount(() => {
    formAnimation.reset();
    bootState.set({
      terminalComplete: false,
      formVisible: false
    });
  });
</script>

<Toaster />

<AuthLayout 
  title="ENLISTMENT TERMINAL" 
  subtitle="AWAITING NEW RECRUIT DATA"
  mode="register"
>
  <RegisterForm />
</AuthLayout>
