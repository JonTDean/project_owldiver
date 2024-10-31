<script lang="ts">
  import { T } from '@threlte/core'
  import { OrbitControls, Grid } from '@threlte/extras'
</script>

<T.PerspectiveCamera position={[5, 5, 5]} makeDefault>
  <OrbitControls />
</T.PerspectiveCamera>

<!-- Add a grid helper to visualize the scene -->
<Grid />

<!-- Add bright lighting -->
<T.AmbientLight intensity={1} />
<T.DirectionalLight intensity={1} position={[0, 10, 0]} />

<!-- Add a large, bright red cube -->
<T.Mesh position={[0, 1, 0]} scale={2}>
  <T.BoxGeometry />
  <T.MeshStandardMaterial color="#ff0000" />
</T.Mesh>

<svelte:options accessors={true} /> 