<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import { Stars } from '@threlte/extras'
    import * as THREE from 'three'
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'

    // Scene setup with dark space
    const threlteContext = useThrelte()
    const renderer = writable(threlteContext.renderer)
    const scene = writable(threlteContext.scene)
    
    // Performance optimizations for renderer
    $: if ($renderer) {
        const r = $renderer;
        r.setPixelRatio(window.devicePixelRatio);
        r.toneMapping = THREE.ACESFilmicToneMapping;
        r.toneMappingExposure = 1.5;
    }

    $: if ($scene) {
        const s = $scene;
        s.background = new THREE.Color('#000000');
    }

    // Adjust camera position and rotation values
    const CAMERA_POSITION: [number, number, number] = [0, 10, 50] // Explicitly type as tuple
    const ROTATION_SPEED = 0.0002 // Slowed down rotation

    // Enhanced materials for better visibility
    const earthMaterial = new THREE.MeshStandardMaterial({
        color: '#1a4a7a',
        metalness: 0.2,
        roughness: 0.7,
        emissive: '#102a4a',
        emissiveIntensity: 0.3
    })

    const cloudsMaterial = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.3,
        metalness: 0,
        roughness: 1,
        blending: THREE.AdditiveBlending
    })

    // Adjust stars configuration
    const starsConfig = {
        radius: 100,
        depth: 50,
        count: 5000,
        factor: 4,
        saturation: 0,
        fade: true,
        speed: 0.2
    }

    // Simple animation loop
    onMount(() => {
        let animationFrame: number;
        
        const animate = () => {
            rotation.update(r => r + ROTATION_SPEED)
            animationFrame = requestAnimationFrame(animate)
        }
        
        animate()

        return () => {
            cancelAnimationFrame(animationFrame)
        }
    })

    // Earth rotation
    const rotation = writable(0)
</script>

<!-- Update Camera position -->
<T.PerspectiveCamera
    position={CAMERA_POSITION}
    fov={45}
    near={0.1}
    far={1000}
    lookAt={[0, 0, 0]}
>
    <!-- Adjusted lighting -->
    <T.DirectionalLight 
        position={[50, 50, 50]} 
        intensity={3}
        castShadow
    />
    
    <T.AmbientLight intensity={0.8} />

    <T.DirectionalLight 
        position={[-50, -20, -20]} 
        intensity={0.7}
        color="#4444ff"
    />
</T.PerspectiveCamera>

<!-- Simplified stars -->
<Stars {...starsConfig} />

<!-- Earth Group -->
<T.Group position={[0, 0, 0]} rotation.y={$rotation}>
    <!-- Earth -->
    <T.Mesh 
        material={earthMaterial}
        receiveShadow
        castShadow
    >
        <T.SphereGeometry args={[20, 64, 64]} />
    </T.Mesh>

    <!-- Clouds layer -->
    <T.Mesh
        material={cloudsMaterial}
        scale={1.02}
        receiveShadow
        castShadow
    >
        <T.SphereGeometry args={[20, 64, 64]} />
    </T.Mesh>
</T.Group>