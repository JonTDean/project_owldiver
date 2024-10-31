<script lang="ts">
    import { T } from '@threlte/core'
    import { OrbitControls } from '@threlte/extras'
    import * as THREE from 'three'
    
    // Create star field
    const starsGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(5000 * 3)
  
    for (let i = 0; i < starPositions.length; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 100
      starPositions[i + 1] = (Math.random() - 0.5) * 100
      starPositions[i + 2] = (Math.random() - 0.5) * 100
    }
  
    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starPositions, 3)
    )
  
    // Load Earth textures
    const textureLoader = new THREE.TextureLoader()
    const dayTexture = textureLoader.load('/textures/8k_earth_daymap.jpg')
    const nightTexture = textureLoader.load('/textures/8k_earth_nightmap.jpg')
    const normalTexture = textureLoader.load('/textures/8k_earth_normal_map.png')
    const specularTexture = textureLoader.load('/textures/8k_earth_specular_map.png')
    const cloudsTexture = textureLoader.load('/textures/8k_earth_clouds.jpg')
  
    // Enhanced shader for better day/night transition
    const earthShader = {
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        normalMap: { value: normalTexture },
        specularMap: { value: specularTexture },
        sunDirection: { value: new THREE.Vector3(5, 0, 5).normalize() },
        blendOffset: { value: 0.3 }, // Controls the size of the blend region
        nightBrightness: { value: 0.3 } // Controls the brightness of the night side
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D specularMap;
        uniform vec3 sunDirection;
        uniform float blendOffset;
        uniform float nightBrightness;

        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          // Calculate day/night blend factor
          float cosAngle = dot(normalize(vNormal), sunDirection);
          float dayFactor = smoothstep(-blendOffset, blendOffset, cosAngle);

          // Sample textures
          vec4 dayColor = texture2D(dayTexture, vUv);
          vec4 nightColor = texture2D(nightTexture, vUv) * nightBrightness;
          
          // Blend day and night
          vec4 color = mix(nightColor, dayColor, dayFactor);
          
          // Add specular highlights on day side
          vec4 specular = texture2D(specularMap, vUv);
          float specularIntensity = specular.r * max(0.0, cosAngle) * 0.5;
          color.rgb += specularIntensity;

          gl_FragColor = color;
        }
      `
    }

    // Create custom material with side rendering
    const earthMaterial = new THREE.ShaderMaterial({
      ...earthShader,
      side: THREE.FrontSide,
      transparent: false
    })

    // Animate both rotation and sun position
    let rotation = 0
    function animate() {
      rotation += 0.0005
      // Update sun direction for dynamic day/night cycle
      const time = Date.now() * 0.0001
      earthShader.uniforms.sunDirection.value.set(
        Math.cos(time) * 5,
        0,
        Math.sin(time) * 5
      ).normalize()
      requestAnimationFrame(animate)
    }
    animate()
  </script>
  
  <T.PerspectiveCamera position={[0, 0, 30]} makeDefault>
    <OrbitControls 
      enableZoom={false} 
      autoRotate={true} 
      autoRotateSpeed={0.25}
      enableDamping={true}
      dampingFactor={0.05}
    />
  </T.PerspectiveCamera>
  
  <!-- Lighting -->
  <T.AmbientLight intensity={0.3} />
  <T.DirectionalLight position={[5, 0, 5]} intensity={2} />
  
  <!-- Star field -->
  <T.Points geometry={starsGeometry}>
    <T.PointsMaterial
      size={0.3}
      color="#ffffff"
      sizeAttenuation={true}
    />
  </T.Points>
  
  <!-- Earth -->
  <T.Group rotation.y={rotation}>
    <!-- Main Earth sphere -->
    <T.Mesh material={earthMaterial}>
      <T.SphereGeometry args={[5, 128, 128]} />
    </T.Mesh>
  
    <!-- Cloud layer -->
    <T.Mesh>
      <T.SphereGeometry args={[5.05, 128, 128]} />
      <T.MeshPhongMaterial
        map={cloudsTexture}
        transparent={true}
        opacity={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </T.Mesh>
  
    <!-- Atmosphere glow -->
    <T.Mesh>
      <T.SphereGeometry args={[5.1, 128, 128]} />
      <T.MeshPhongMaterial
        color="#4444ff"
        transparent={true}
        opacity={0.05}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </T.Mesh>
  </T.Group>
  
  <svelte:options accessors={true} />