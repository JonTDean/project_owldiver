<script lang="ts">
  export let title: string;
  export let subtitle: string;
  export let securityLevel: string = "LEVEL 5";
</script>

<div class="military-header-container">
  <div class="security-classification">
    <div class="classification-line">
      <span class="bracket">[</span>
      <span class="blink">●</span>
      <span class="security-text">SECURITY CLEARANCE: {securityLevel}</span>
      <span class="blink">●</span>
      <span class="bracket">]</span>
    </div>
  </div>

  <h1 class="title">{title}</h1>
  <p class="subtitle">{subtitle}</p>

  <div class="decorative-lines">
    <div class="line left"></div>
    <div class="center-diamond"></div>
    <div class="line right"></div>
  </div>
</div>

<style>
  .military-header-container {
    text-align: center;
    margin-bottom: 2rem;
    position: relative;
    font-family: monospace;
  }

  .security-classification {
    margin-bottom: 1rem;
  }

  .classification-line {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #FFD700;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
  }

  .bracket {
    opacity: 0.5;
  }

  .blink {
    animation: blink 2s infinite;
    color: #FFD700;
    font-size: 0.5rem;
  }

  .security-text {
    color: #FFD700;
    opacity: 0.8;
  }

  .title {
    font-size: 1.75rem;
    font-weight: bold;
    color: #FFD700;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    letter-spacing: 0.1em;
  }

  .subtitle {
    font-size: 0.875rem;
    color: #FFD700;
    opacity: 0.7;
    letter-spacing: 0.15em;
    margin-bottom: 1rem;
  }

  .decorative-lines {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .line {
    height: 1px;
    width: 100px;
    background: linear-gradient(
      90deg,
      transparent,
      #FFD700 50%,
      transparent
    );
  }

  .center-diamond {
    width: 8px;
    height: 8px;
    background: #000;
    border: 1px solid #FFD700;
    transform: rotate(45deg);
    position: relative;
  }

  .center-diamond::after {
    content: '';
    position: absolute;
    inset: 1px;
    background: #000;
    box-shadow: 0 0 5px #FFD700;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  /* Scanline effect */
  .military-header-container::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(255, 215, 0, 0.03) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    animation: scan 10s linear infinite;
  }

  @keyframes scan {
    from { background-position: 0 0; }
    to { background-position: 0 100%; }
  }
</style> 