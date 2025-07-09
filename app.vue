<template>
  <div class="min-h-screen bg-[#1a1d2e] text-white">
    <CoinFlipGame />
  </div>
</template>

<script setup lang="ts">
// Main app component - clean and simple
</script>

<style>
/* Global styles for smooth animations */
* {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* TON Connect UI Styles */
@import url('https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.css');
</style>