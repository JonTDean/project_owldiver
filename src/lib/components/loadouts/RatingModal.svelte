<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Star } from 'lucide-svelte';
  
  export let show = false;
  export let onClose: () => void;
  export let onSubmit: (rating: number, comment: string) => void;
  
  let rating = 5;
  let comment = '';
</script>

{#if show}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div class="military-panel w-full max-w-md">
      <div class="panel-header">
        <div class="header-accent"></div>
        <h2 class="text-sm font-mono tracking-[0.3em] text-[#FFD700]">SUBMIT TACTICAL EVALUATION</h2>
        <div class="header-accent"></div>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- Rating Selection -->
        <div class="space-y-2">
          <label class="text-xs tracking-[0.2em] text-[#FFD700]/70">EFFECTIVENESS RATING</label>
          <div class="flex items-center gap-2">
            {#each Array(10) as _, i}
              <button 
                class="p-1"
                on:click={() => rating = i + 1}
              >
                <Star 
                  size={20} 
                  class={rating >= i + 1 ? 'text-[#FFD700]' : 'text-[#FFD700]/30'} 
                />
              </button>
            {/each}
          </div>
        </div>

        <!-- Comment -->
        <div class="space-y-2">
          <label class="text-xs tracking-[0.2em] text-[#FFD700]/70">TACTICAL ASSESSMENT</label>
          <textarea
            bind:value={comment}
            class="w-full h-32 bg-black/40 border border-[#FFD700]/30 p-3 text-sm font-mono"
            placeholder="Enter your tactical assessment..."
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-4">
          <Button 
            variant="outline" 
            on:click={onClose}
          >
            CANCEL
          </Button>
          <Button 
            on:click={() => onSubmit(rating, comment)}
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  </div>
{/if} 