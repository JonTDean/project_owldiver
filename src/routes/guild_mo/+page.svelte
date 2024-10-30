<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">Guild Mission Objectives</h1>
  <div class="space-y-4">
    <!-- Active Missions -->
    <div class="p-6 rounded-lg border bg-card">
      <h2 class="text-2xl font-semibold mb-4">Active Missions</h2>
      <div class="space-y-4">
        <div class="p-4 rounded bg-accent">
          <h3 class="font-semibold">Defend Super Earth</h3>
          <p class="text-sm text-muted-foreground mt-2">Status: In Progress</p>
          <p class="text-sm mt-1">Participants: 12/20</p>
          <Button class="mt-4" variant="secondary">Join Mission</Button>
        </div>
      </div>
    </div>
  </div>
</div>
