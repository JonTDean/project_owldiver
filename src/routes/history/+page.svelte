<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">Guild History</h1>
  <div class="space-y-6">
    <!-- Timeline -->
    <div class="border-l-2 border-primary pl-4 space-y-6">
      <div class="relative">
        <div class="absolute -left-[41px] bg-background p-2">
          <div class="w-4 h-4 rounded-full bg-primary"></div>
        </div>
        <div class="p-4 rounded-lg border bg-card">
          <h3 class="font-semibold">Guild Formation</h3>
          <p class="text-sm text-muted-foreground mt-2">March 8, 2024</p>
          <p class="mt-2">The Owl Enforcers were formed to defend Super Earth.</p>
        </div>
      </div>
      <!-- Add more timeline items as needed -->
    </div>
  </div>
</div>
