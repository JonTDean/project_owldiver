<script lang="ts">
  import { onMount } from 'svelte';
  
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  
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
    let currentX = Math.random();
    let currentY = Math.random();
    
    points.push({ x: currentX, y: currentY });
    
    // Generate 2-3 segments
    const segments = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < segments; i++) {
      // Decide direction: horizontal or vertical
      const isHorizontal = Math.random() > 0.5;
      const distance = Math.random() * 0.3 + 0.1; // Random segment length
      
      if (isHorizontal) {
        currentX += (Math.random() > 0.5 ? 1 : -1) * distance;
        currentX = Math.max(0, Math.min(1, currentX));
      } else {
        currentY += (Math.random() > 0.5 ? 1 : -1) * distance;
        currentY = Math.max(0, Math.min(1, currentY));
      }
      
      points.push({ x: currentX, y: currentY });
    }
    
    return points;
  }
  
  function createEnergyBar(): EnergyBar {
    return {
      points: generateRandomPath(),
      pathProgress: 0,
      width: 25, // Fixed width
      height: 2, // Fixed height
      speed: Math.random() * 0.002 + 0.001, // Random speed
      opacity: 0,
      trail: [],
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02,
      energyLevel: 1.0
    };
  }
  
  function getPositionOnPath(bar: EnergyBar): PathPoint {
    const points = bar.points;
    const totalSegments = points.length - 1;
    const totalProgress = bar.pathProgress * totalSegments;
    const currentSegment = Math.min(Math.floor(totalProgress), totalSegments - 1);
    const segmentProgress = totalProgress - currentSegment;
    
    const start = points[currentSegment];
    const end = points[currentSegment + 1];
    
    return {
      x: canvas.width * (start.x + (end.x - start.x) * segmentProgress),
      y: canvas.height * (start.y + (end.y - start.y) * segmentProgress)
    };
  }
  
  function drawEnergyBar(bar: EnergyBar) {
    bar.pulsePhase += bar.pulseSpeed;
    const pulseIntensity = Math.sin(bar.pulsePhase) * 0.3 + 0.7;
    
    // Fade in/out
    if (bar.pathProgress < 0.1) {
      bar.opacity = bar.pathProgress * 10 * bar.energyLevel;
    } else if (bar.pathProgress > 0.9) {
      bar.opacity = (1 - bar.pathProgress) * 10 * bar.energyLevel;
    } else {
      bar.opacity = bar.energyLevel;
    }
    
    const pos = getPositionOnPath(bar);
    
    // Update trail
    bar.trail.unshift({ x: pos.x, y: pos.y, opacity: bar.opacity * pulseIntensity });
    if (bar.trail.length > 15) {
      bar.trail.pop();
    }
    
    // Draw trail with curved connections
    if (bar.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(bar.trail[0].x, bar.trail[0].y);
      
      // Create smooth curve through trail points
      for (let i = 1; i < bar.trail.length; i++) {
        const current = bar.trail[i];
        const prev = bar.trail[i - 1];
        
        // Use quadratic curves for smoother bends
        const midX = (prev.x + current.x) / 2;
        const midY = (prev.y + current.y) / 2;
        
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      
      ctx.strokeStyle = `rgba(255, 215, 0, ${bar.opacity * 0.3})`;
      ctx.lineWidth = bar.height;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(255, 200, 0, 0.8)';
      ctx.shadowBlur = 15;
      ctx.stroke();
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    energyBars.forEach(bar => {
      bar.pathProgress += bar.speed;
      bar.energyLevel = Math.max(0, bar.energyLevel - 0.001);
      
      if (bar.pathProgress >= 1) {
        // Generate completely new path
        bar.points = generateRandomPath();
        bar.pathProgress = 0;
        bar.energyLevel = 1.0;
        bar.speed = Math.random() * 0.002 + 0.001;
        bar.trail = [];
      }
      
      drawEnergyBar(bar);
    });
    
    animationFrame = requestAnimationFrame(animate);
  }
  
  let energyBars: EnergyBar[] = [];
  let animationFrame: number;
  
  function initializeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Reduced number of bars
    energyBars = Array(8).fill(null).map(() => ({
      ...createEnergyBar(),
      pathProgress: Math.random()
    }));
  }
  
  onMount(() => {
    ctx = canvas.getContext('2d')!;
    initializeCanvas();
    animate();
    
    const handleResize = () => {
      initializeCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 -z-10"
/>

<div class="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />