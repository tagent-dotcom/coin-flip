<template>
  <div class="coin-container">
    <div class="scene">
      <div 
        class="coin"
        :class="{ 
          'flipping': isFlipping,
          'show-heads': !isFlipping && (result === 'heads' || result === null),
          'show-tails': !isFlipping && result === 'tails'
        }"
      >
        <!-- Heads Side (Happy Pepe) -->
        <div class="coin-face">
          <div class="pepe-coin heads-side">
            <div class="coin-border">
              <div class="coin-inner">
                <!-- Happy Pepe Image -->
                <div class="pepe-image-container">
                  <NuxtImg 
                    src="/happy-pepe.png" 
                    alt="Happy Pepe"
                    class="pepe-image happy-pepe"
                    width="120"
                    height="120"
                    loading="eager"
                  />
                </div>
                
                <!-- Heads Label -->
                <div class="coin-label">
                  <div class="label-text">HEADS</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tails Side (Sad Pepe) -->
        <div class="coin-number">
          <div class="pepe-coin tails-side">
            <div class="coin-border">
              <div class="coin-inner">
                <!-- Sad Pepe Image -->
                <div class="pepe-image-container">
                  <NuxtImg 
                    src="/sad-pepe.png" 
                    alt="Sad Pepe"
                    class="pepe-image sad-pepe"
                    width="120"
                    height="120"
                    loading="eager"
                  />
                </div>
                
                <!-- Tails Label -->
                <div class="coin-label">
                  <div class="label-text">TAILS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Shadow with golden glow -->
    <div class="coin-shadow" :class="{ 'shadow-flipping': isFlipping }"></div>

    <!-- Enhanced Glow effect -->
    <div 
      v-if="!isFlipping && result" 
      class="coin-glow"
      :class="result === 'heads' ? 'glow-gold' : 'glow-silver'"
    ></div>

    <!-- Particle effects -->
    <div class="particle-container" v-if="!isFlipping && result">
      <div v-for="i in 12" :key="i" class="particle" :style="particleStyle(i)"></div>
    </div>

    <!-- Win/Loss Overlay Animation -->
    <div v-if="showResultOverlay" class="result-overlay" :class="{ 'win-overlay': isWin, 'lose-overlay': !isWin }">
      <div class="overlay-content">
        <div class="result-pepe">
          <NuxtImg 
            :src="isWin ? '/happy-pepe.png' : '/sad-pepe.png'"
            :alt="isWin ? 'Happy Pepe' : 'Sad Pepe'"
            class="overlay-pepe-image"
            :class="{ 'happy': isWin, 'sad': !isWin }"
            width="120"
            height="120"
            loading="eager"
          />
        </div>
        <div class="result-text">
          <div class="result-main">{{ isWin ? 'WIN!' : 'LOSE!' }}</div>
          <div class="result-sub">{{ isWin ? 'Great Job!' : 'Try Again!' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'

const props = defineProps<{
  isFlipping: boolean
  result: 'heads' | 'tails' | null
}>()

const emit = defineEmits<{
  flipComplete: ['heads' | 'tails']
}>()

// Result overlay state
const showResultOverlay = ref(false)
const isWin = ref(false)

// Watch for flip completion
watch(() => props.isFlipping, (isFlipping) => {
  if (!isFlipping && props.result) {
    setTimeout(() => {
      emit('flipComplete', props.result!)
    }, 100)
  }
})

// Watch for result changes to show overlay
watch(() => props.result, (newResult, oldResult) => {
  if (newResult && newResult !== oldResult && !props.isFlipping) {
    // Show result overlay after a short delay
    setTimeout(() => {
      showResultOverlay.value = true
      // Hide overlay after 2 seconds
      setTimeout(() => {
        showResultOverlay.value = false
      }, 2000)
    }, 500)
  }
})

// Method to trigger win/loss overlay (called from parent)
const showResult = (won: boolean) => {
  isWin.value = won
  showResultOverlay.value = true
  setTimeout(() => {
    showResultOverlay.value = false
  }, 2500)
}

// Expose the method to parent component
defineExpose({
  showResult
})

// Generate particle styles
function particleStyle(index: number) {
  const angle = (index * 30) * Math.PI / 180
  const radius = 120 + Math.random() * 40
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const delay = Math.random() * 0.5
  
  return {
    '--x': `${x}px`,
    '--y': `${y}px`,
    '--delay': `${delay}s`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
.coin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  height: 220px;
  margin: 0 auto;
  position: relative;
}

.scene {
  width: 200px;
  height: 200px;
  perspective: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.coin {
  width: 190px;
  height: 190px;
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;
  transition: transform 0.3s ease-out;
}

.coin:hover:not(.flipping) {
  transform: scale(1.08);
}

.coin.flipping {
  animation: enhanced3DFlip 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

.coin.show-heads {
  transform: rotateY(0deg);
}

.coin.show-tails {
  transform: rotateY(180deg);
}

.coin-face, .coin-number {
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.coin-number {
  transform: rotateY(180deg);
}

.pepe-coin {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 50%;
}

.coin-border {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(45deg, #FFD700, #FFA500, #FF8C00);
  padding: 8px;
  position: relative;
  box-shadow: 
    0 0 30px rgba(255, 215, 0, 0.6),
    inset 0 0 20px rgba(255, 255, 255, 0.2),
    inset 0 0 40px rgba(255, 140, 0, 0.1);
}

.coin-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #228B22, #32CD32, #90EE90);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.heads-side .coin-inner {
  background: linear-gradient(135deg, #90EE90, #32CD32, #228B22);
}

.tails-side .coin-inner {
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
}

/* Pepe Image Styling */
.pepe-image-container {
  width: 120px;
  height: 120px;
  position: relative;
  margin-bottom: 10px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pepe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
}

.happy-pepe {
  animation: happyBounce 2s ease-in-out infinite;
}

.sad-pepe {
  animation: sadFloat 2s ease-in-out infinite;
}

@keyframes happyBounce {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.05) rotate(2deg); }
}

@keyframes sadFloat {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(0.98) rotate(-1deg); }
}

/* Coin Labels */
.coin-label {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
}

.label-text {
  font-size: 12px;
  font-weight: 900;
  color: #FFD700;
  text-shadow: 
    0 0 10px rgba(255, 215, 0, 0.8),
    2px 2px 0 #000,
    -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000;
  letter-spacing: 1px;
}

/* Enhanced Shadow */
.coin-shadow {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 20px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.3), transparent);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.shadow-flipping {
  animation: shadowFlip 2s ease-in-out infinite;
}

/* Enhanced Glow */
.coin-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 220px;
  border-radius: 50%;
  pointer-events: none;
  animation: pulseGlow 2s ease-in-out infinite;
}

.glow-gold {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent 70%);
  box-shadow: 0 0 60px rgba(255, 215, 0, 0.4);
}

.glow-silver {
  background: radial-gradient(circle, rgba(192, 192, 192, 0.3), transparent 70%);
  box-shadow: 0 0 60px rgba(192, 192, 192, 0.4);
}

/* Particle Effects */
.particle-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1px;
  height: 1px;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border-radius: 50%;
  animation: particleExplode 1.5s ease-out forwards;
}

/* Result Overlay */
.result-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 100;
  border-radius: 50%;
  animation: overlayAppear 0.5s ease-out;
}

.win-overlay {
  background: radial-gradient(circle, rgba(34, 197, 94, 0.8), rgba(34, 197, 94, 0.3), transparent);
  box-shadow: 0 0 100px rgba(34, 197, 94, 0.6);
}

.lose-overlay {
  background: radial-gradient(circle, rgba(239, 68, 68, 0.8), rgba(239, 68, 68, 0.3), transparent);
  box-shadow: 0 0 100px rgba(239, 68, 68, 0.6);
}

.overlay-content {
  text-align: center;
  animation: overlayContentZoom 0.5s ease-out;
}

.result-pepe {
  margin-bottom: 1rem;
}

.overlay-pepe-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.5));
}

.overlay-pepe-image.happy {
  animation: victoryDance 0.5s ease-out;
}

.overlay-pepe-image.sad {
  animation: defeatShake 0.5s ease-out;
}

.result-text {
  color: white;
}

.result-main {
  font-size: 2.5rem;
  font-weight: 900;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.8),
    2px 2px 0 #000,
    -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000;
  margin-bottom: 0.5rem;
}

.result-sub {
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* Animations */
@keyframes enhanced3DFlip {
  0% { transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg); }
  25% { transform: rotateY(90deg) rotateX(180deg) rotateZ(90deg); }
  50% { transform: rotateY(180deg) rotateX(360deg) rotateZ(180deg); }
  75% { transform: rotateY(270deg) rotateX(540deg) rotateZ(270deg); }
  100% { transform: rotateY(360deg) rotateX(720deg) rotateZ(360deg); }
}

@keyframes shadowFlip {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.3; }
  50% { transform: translateX(-50%) scale(1.3); opacity: 0.1; }
}

@keyframes pulseGlow {
  0%, 100% { 
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes particleExplode {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(var(--x), var(--y)) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translate(calc(var(--x) * 1.5), calc(var(--y) * 1.5)) scale(0);
    opacity: 0;
  }
}

@keyframes overlayAppear {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes overlayContentZoom {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes victoryDance {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(5deg); }
  50% { transform: scale(1.2) rotate(0deg); }
  75% { transform: scale(1.1) rotate(-5deg); }
}

@keyframes defeatShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
</style> 