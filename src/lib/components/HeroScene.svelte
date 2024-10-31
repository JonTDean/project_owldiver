<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import { OrbitControls, Stars } from '@threlte/extras'
    import * as THREE from 'three'
    import { onMount } from 'svelte'
    import { writable, derived } from 'svelte/store'

    // Load textures
    const textureLoader = new THREE.TextureLoader()
    const dayTexture = textureLoader.load('/textures/2k_earth_daymap.jpg')
    const nightTexture = textureLoader.load('/textures/2k_earth_nightmap.jpg')
    const cloudsTexture = textureLoader.load('/textures/2k_earth_clouds.jpg')
    const normalTexture = textureLoader.load('/textures/2k_earth_normal_map.png')
    const specularTexture = textureLoader.load('/textures/2k_earth_specular_map.png')

    // Scene setup with dark space
    const threlteContext = useThrelte()
    const rendererStore = writable(threlteContext.renderer)
    const sceneStore = writable(threlteContext.scene)
    
    $: if ($rendererStore) {
        $rendererStore.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        $rendererStore.toneMapping = THREE.ACESFilmicToneMapping
        $rendererStore.toneMappingExposure = 1
        $rendererStore.shadowMap.enabled = true
        $rendererStore.shadowMap.type = THREE.PCFSoftShadowMap
    }

    $: if ($sceneStore) {
        $sceneStore.background = new THREE.Color('#000000')
    }

    // Stars configuration
    const starsConfig = {
        radius: 100,
        depth: 50,
        count: 5000,
        factor: 4,
        saturation: 0,
        fade: true,
        speed: 1
    }

    // Earth rotation
    const rotation = writable({ earth: 0, sun: 0 })
    const EARTH_ROTATION_SPEED = 0.0005
    const SUN_ORBIT_SPEED = 0.0002
    const SUN_DISTANCE = 300

    onMount(() => {
        const animate = () => {
            rotation.update(r => ({
                earth: r.earth + EARTH_ROTATION_SPEED,
                sun: r.sun + SUN_ORBIT_SPEED
            }))
            requestAnimationFrame(animate)
        }
        animate()
    })

    $: sunPosition = {
        x: Math.cos($rotation.sun) * SUN_DISTANCE,
        y: 30,
        z: Math.sin($rotation.sun) * SUN_DISTANCE
    }

    // Sun material with opacity
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: '#fffceb',
        transparent: true,
        opacity: 0,
        toneMapped: false
    })

    // Add fade state for sun
    const sunOpacity = writable(0)

    // Update sun opacity based on position
    $: {
        const sunAngle = Math.atan2(sunPosition.z, sunPosition.x)
        const isSunVisible = sunAngle > -Math.PI/2 && sunAngle < Math.PI/2
        
        // Fade sun in/out
        const targetOpacity = isSunVisible ? 1 : 0
        const duration = 1000 // ms
        
        if ($sunOpacity !== targetOpacity) {
            const start = $sunOpacity
            const startTime = Date.now()
            
            const animate = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)
                
                // Smooth transition using easing
                const eased = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2
                    
                sunOpacity.set(start + (targetOpacity - start) * eased)
                sunMaterial.opacity = $sunOpacity
                
                if (progress < 1) requestAnimationFrame(animate)
            }
            
            animate()
        }
    }

    // Update sun light intensity based on visibility
    $: sunLightIntensity = $sunOpacity * 2

    // Earth material with custom shader for day/night cycle
    const earthMaterial = new THREE.ShaderMaterial({
        uniforms: {
            dayMap: { value: dayTexture },
            nightMap: { value: nightTexture },
            sunPosition: { value: new THREE.Vector3() }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            varying vec3 vWorldPosition;
            
            void main() {
                vUv = uv;
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                vWorldNormal = normalize(mat3(modelMatrix) * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D dayMap;
            uniform sampler2D nightMap;
            uniform vec3 sunPosition;
            
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            varying vec3 vWorldPosition;
            
            void main() {
                vec3 worldNormal = normalize(vWorldNormal);
                vec3 sunDir = normalize(sunPosition - vWorldPosition);
                
                float intensity = dot(worldNormal, sunDir);
                
                // Adjusted transition values for smoother blend
                float dayStrength = smoothstep(-0.1, 0.25, intensity);
                
                vec4 dayColor = texture2D(dayMap, vUv);
                vec4 nightColor = texture2D(nightMap, vUv);
                
                // Simple linear interpolation between day and night textures
                gl_FragColor = mix(nightColor, dayColor, dayStrength);
            }
        `
    })

    // Update sun position in shader
    $: if (sunPosition) {
        earthMaterial.uniforms.sunPosition.value.set(
            sunPosition.x,
            sunPosition.y,
            sunPosition.z
        )
    }
</script>

<!-- High quality stars -->
<Stars {...starsConfig} />

<T.PerspectiveCamera 
    position={[0, 40, 150]} 
    fov={45}
    near={0.1}
    far={1000}
    makeDefault
>
    <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        minDistance={50}
        maxDistance={200}
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
        target.y={-30}
    />
</T.PerspectiveCamera>

<!-- Sun with proper shadow casting -->
<T.Group position={[sunPosition.x, sunPosition.y, sunPosition.z]}>
    <!-- Visible sun sphere -->
    <T.Mesh material={sunMaterial}>
        <T.SphereGeometry args={[15, 32, 32]} />
    </T.Mesh>
    
    <!-- Sun light with shadows -->
    <T.DirectionalLight 
        intensity={sunLightIntensity}
        color="#fffceb"
        castShadow
        shadow.mapSize.width={2048}
        shadow.mapSize.height={2048}
        shadow.camera.near={1}
        shadow.camera.far={1000}
        shadow.camera.left={-200}
        shadow.camera.right={200}
        shadow.camera.top={200}
        shadow.camera.bottom={-200}
        shadow.bias={-0.001}
    />
</T.Group>

<!-- Earth with shadow reception -->
<T.Group rotation.y={$rotation.earth}>
    <!-- Earth sphere with improved shadow settings -->
    <T.Mesh 
        material={earthMaterial}
        castShadow
        receiveShadow
        scale={15}
    >
        <T.SphereGeometry args={[1, 64, 32]} />
    </T.Mesh>

    <!-- Cloud layer with improved shadow settings -->
    <T.Mesh 
        scale={15.1}
        castShadow
        receiveShadow
    >
        <T.SphereGeometry args={[1, 64, 32]} />
        <T.MeshPhysicalMaterial
            map={cloudsTexture}
            transparent={true}
            opacity={0.4}
            depthWrite={false}
            roughness={1}
            metalness={0}
            clearcoat={0.1}
            clearcoatRoughness={0.4}
            alphaTest={0.1}
        />
    </T.Mesh>
</T.Group>

<!-- Reduced ambient light for better shadow contrast -->
<T.AmbientLight intensity={0.01} />