<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">Recommended Builds</h1>
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <!-- Build Cards -->
    <div class="p-6 rounded-lg border bg-card text-card-foreground shadow">
      <h2 class="text-2xl font-semibold mb-4">Anti-Tank Specialist</h2>
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Primary: Railgun</p>
        <p class="text-sm text-muted-foreground">Secondary: P-4 Senator</p>
        <p class="text-sm text-muted-foreground">Stratagems: Eagle Rearm, Eagle Smoke</p>
      </div>
      <Button class="mt-4">View Details</Button>
    </div>
    <!-- Add more build cards as needed -->
  </div>
</div>
