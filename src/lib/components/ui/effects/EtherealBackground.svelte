<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let energyBars: EnergyBar[] = [];
  let animationFrame: number;
  let mounted = false;
  
  interface PathPoint {
    x: number;
    y: number;
  }
  
  interface EnergyBar {
    points: PathPoint[];
    pathProgress: number;
    width: number;
    height: number;
    speed: number;
    opacity: number;
    trail: { x: number; y: number; opacity: number }[];
    pulsePhase: number;
    pulseSpeed: number;
    energyLevel: number;
  }
  
  function generateRandomPath(): PathPoint[] {
    const points: PathPoint[] = [];
    let x = Math.random();
    let y = Math.random();
    
    points.push({ x, y });
    
    for (let i = 0; i < 3; i++) {
      const isHorizontal = Math.random() > 0.5;
      const distance = Math.random() * 0.3 + 0.1;
      
      if (isHorizontal) {
        x += (Math.random() > 0.5 ? 1 : -1) * distance;
        x = Math.max(0, Math.min(1, x));
      } else {
        y += (Math.random() > 0.5 ? 1 : -1) * distance;
        y = Math.max(0, Math.min(1, y));
      }
      
      points.push({ x, y });
    }
    
    return points;
  }
  
  function createEnergyBar(): EnergyBar {
    return {
      points: generateRandomPath(),
      pathProgress: 0,
      width: 2,
      height: 2,
      speed: Math.random() * 0.002 + 0.001,
      opacity: 0,
      trail: [],
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02,
      energyLevel: 1.0
    };
  }
  
  function initializeCanvas() {
    if (!canvas || !ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    energyBars = Array(12).fill(null).map(() => ({
      ...createEnergyBar(),
      pathProgress: Math.random()
    }));
  }
  
  function drawEnergyBar(bar: EnergyBar) {
    if (!ctx || !canvas) return;
    
    bar.pulsePhase += bar.pulseSpeed;
    const pulseIntensity = Math.sin(bar.pulsePhase) * 0.3 + 0.7;
    
    const points = bar.points;
    const progress = bar.pathProgress;
    const totalSegments = points.length - 1;
    const currentSegment = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
    const segmentProgress = (progress * totalSegments) % 1;
    
    const start = points[currentSegment];
    const end = points[currentSegment + 1];
    
    const x = canvas.width * (start.x + (end.x - start.x) * segmentProgress);
    const y = canvas.height * (start.y + (end.y - start.y) * segmentProgress);
    
    bar.trail.unshift({ x, y, opacity: bar.opacity * pulseIntensity });
    if (bar.trail.length > 15) bar.trail.pop();
    
    if (bar.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(bar.trail[0].x, bar.trail[0].y);
      
      for (let i = 1; i < bar.trail.length; i++) {
        ctx.lineTo(bar.trail[i].x, bar.trail[i].y);
      }
      
      ctx.strokeStyle = `rgba(255, 215, 0, ${bar.opacity * 0.3})`;
      ctx.lineWidth = bar.height;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.stroke();
    }
  }
  
  function animate() {
    if (!ctx || !canvas || !mounted) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.98)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    energyBars.forEach(bar => {
      bar.pathProgress += bar.speed;
      
      if (bar.pathProgress >= 1) {
        bar.points = generateRandomPath();
        bar.pathProgress = 0;
        bar.trail = [];
        bar.speed = Math.random() * 0.002 + 0.001;
      }
      
      bar.opacity = bar.pathProgress < 0.1 ? bar.pathProgress * 10 :
                    bar.pathProgress > 0.9 ? (1 - bar.pathProgress) * 10 : 1;
      
      drawEnergyBar(bar);
    });
    
    animationFrame = requestAnimationFrame(animate);
  }
  
  onMount(() => {
    if (!browser) return;
    
    console.log('Mounting EtherealBackground');
    mounted = true;
    
    ctx = canvas.getContext('2d')!;
    initializeCanvas();
    animate();
    
    const handleResize = () => {
      initializeCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 w-full h-full bg-black"
/>

<style>
  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
  }
</style>