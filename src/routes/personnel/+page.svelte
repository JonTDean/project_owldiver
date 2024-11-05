<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6">Guild Members</h1>
  
  <!-- Member Stats -->
  <div class="grid gap-4 mb-8 md:grid-cols-3">
    <div class="p-4 rounded-lg border bg-card text-center">
      <h3 class="font-semibold">Total Members</h3>
      <p class="text-2xl font-bold mt-2">42</p>
    </div>
    <div class="p-4 rounded-lg border bg-card text-center">
      <h3 class="font-semibold">Active Members</h3>
      <p class="text-2xl font-bold mt-2">38</p>
    </div>
    <div class="p-4 rounded-lg border bg-card text-center">
      <h3 class="font-semibold">Online Now</h3>
      <p class="text-2xl font-bold mt-2">12</p>
    </div>
  </div>

  <!-- Member List -->
  <div class="rounded-lg border bg-card">
    <div class="p-4">
      <h2 class="text-2xl font-semibold mb-4">Member List</h2>
      <div class="space-y-2">
        <div class="flex items-center justify-between p-3 rounded bg-accent">
          <div>
            <p class="font-semibold">HelldiversElite</p>
            <p class="text-sm text-muted-foreground">Rank: Commander</p>
          </div>
          <Button variant="secondary" size="sm">View Profile</Button>
        </div>
        <!-- Add more member items -->
      </div>
    </div>
  </div>
</div>
