<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let loading: boolean = false;
  let progress = 0;
  let interval: ReturnType<typeof setInterval>;
  let hideTimeout: ReturnType<typeof setTimeout>;
  let visible = loading;

  // Function to start updating progress
  function startProgress() {
      if (interval) clearInterval(interval);

      progress = 0;

      interval = setInterval(() => {
          if (progress < 95 && loading) {
              progress += 0.5;
              console.log('Progress:', progress);
          } else {
              clearInterval(interval);
          }
      }, 100);
  }

  // Function to complete progress and hide loading screen
  function completeProgress() {
      progress = 100;
      console.log('Progress set to 100%');
      hideTimeout = setTimeout(() => {
          visible = false;
      }, 500); // Duration matches the CSS transition
  }

  onMount(() => {
      if (loading) {
          startProgress();
      }
  });

  // Reactive statement to watch for changes in `loading`
  $: if (loading) {
      visible = true;
      startProgress();
  } else if (visible && progress < 100) {
      completeProgress();
  }

  onDestroy(() => {
      if (interval) clearInterval(interval);
      if (hideTimeout) clearTimeout(hideTimeout);
  });
</script>

{#if visible}
  <div class="loading-screen">
      <div class="loading-content">
          <h1 class="loading-title">SYSTEM INITIALIZATION</h1>
          <div class="loading-bar">
              <div class="loading-progress" style="width: {progress}%;"></div>
          </div>
          <p class="loading-message">PLEASE STAND BY...</p>
      </div>
  </div>
{/if}

<style>
  .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 998;
      transition: opacity 0.5s ease, visibility 0.5s ease;
      opacity: 1;
      visibility: visible;
  }

  .loading-screen.hidden {
      opacity: 0;
      visibility: hidden;
  }

  .loading-content {
      text-align: center;
      color: #FFD700; /* Gold yellow */
      font-family: 'JetBrains Mono', monospace;
  }

  .loading-title {
      font-size: 1.5rem;
      letter-spacing: 0.2em;
      margin-bottom: 1rem;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); /* Soft glow */
  }

  .loading-bar {
      width: 80%;
      height: 10px;
      background: #333;
      border: 1px solid #FFD700;
      margin: 0 auto 1rem;
      overflow: hidden;
      position: relative;
  }

  .loading-progress {
      height: 100%;
      background: linear-gradient(90deg, #FFD700, #FF8C00);
      transition: width 0.5s ease-out; /* Smooth transition */
  }

  .loading-message {
      font-size: 0.875rem;
      letter-spacing: 0.1em;
      opacity: 0.8;
  }
</style>