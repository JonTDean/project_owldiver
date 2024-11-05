<script lang="ts">
  export let size = 24;
  export let class_name = '';
</script>

<svg 
  xmlns="http://www.w3.org/2000/svg" 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round"
  class={class_name}
>
  <circle cx="12" cy="12" r="10"/>
  <path d="M16.5 15.5 A4.5 4.5 0 0 1 12 20 A4.5 4.5 0 0 1 7.5 15.5"/>
  <path d="M7.5 8.5 A4.5 4.5 0 0 1 12 4 A4.5 4.5 0 0 1 16.5 8.5"/>
  <line x1="12" y1="4" x2="12" y2="20"/>
</svg> 