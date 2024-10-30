<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">Wall of Fame/Shame</h1>
  
  <!-- Fame Section -->
  <div class="mb-8">
    <h2 class="text-2xl font-semibold mb-4">Wall of Fame 🏆</h2>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div class="p-4 rounded-lg border bg-card">
        <h3 class="font-semibold">Most Missions Completed</h3>
        <p class="text-sm text-muted-foreground mt-2">Player: HelldiversElite</p>
        <p class="text-sm mt-1">Missions: 150</p>
      </div>
      <!-- Add more fame cards -->
    </div>
  </div>

  <!-- Shame Section -->
  <div>
    <h2 class="text-2xl font-semibold mb-4">Wall of Shame 💀</h2>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div class="p-4 rounded-lg border bg-card">
        <h3 class="font-semibold">Most Friendly Fire</h3>
        <p class="text-sm text-muted-foreground mt-2">Player: OopsIDiedAgain</p>
        <p class="text-sm mt-1">Team Kills: 42</p>
      </div>
      <!-- Add more shame cards -->
    </div>
  </div>
</div>
