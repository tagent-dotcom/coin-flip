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
        <!-- Heads Side (Face) -->
        <div class="coin-face">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="200" 
            height="200" 
            viewBox="0 0 54.329 54.329">
            <g transform="translate(77.7 -97.062)">
              <circle 
                cx="-50.535" 
                cy="124.227" 
                r="25.665" 
                fill="#FFD700" 
                stroke="#000000" 
                stroke-width="2" 
                paint-order="markers stroke fill"/>
              <circle 
                r="20.902" 
                cy="124.227" 
                cx="-50.535" 
                fill="#FFD700" 
                stroke="#000000" 
                stroke-width="1.5" 
                paint-order="markers stroke fill"/>
              <text 
                style="line-height:1.25;font-family:Arial;text-align:center" 
                x="-50.535" 
                y="132" 
                font-weight="900" 
                font-size="18" 
                text-anchor="middle"
                fill="#000000">
                <tspan 
                  x="-50.535" 
                  y="132">H</tspan>
                <tspan 
                  x="-50.535" 
                  y="140" 
                  font-size="7">HEADS</tspan>
              </text>
            </g>
          </svg>
        </div>

        <!-- Tails Side (Number) -->
        <div class="coin-number">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="200" 
            height="200" 
            viewBox="0 0 54.329 54.329">
            <g transform="translate(77.7 -97.062)">
              <circle 
                r="25.665" 
                cy="124.227" 
                cx="-50.535" 
                fill="#C0C0C0" 
                stroke="#000000" 
                stroke-width="2" 
                paint-order="markers stroke fill"/>
              <circle 
                cx="-50.535" 
                cy="124.227" 
                r="20.902" 
                fill="#C0C0C0" 
                stroke="#000000" 
                stroke-width="1.5" 
                paint-order="markers stroke fill"/>
              <text 
                style="line-height:1.25;font-family:Arial;text-align:center" 
                x="-50.535" 
                y="132" 
                font-weight="900" 
                font-size="18" 
                text-anchor="middle"
                fill="#000000">
                <tspan 
                  x="-50.535" 
                  y="132">T</tspan>
                <tspan 
                  x="-50.535" 
                  y="140" 
                  font-size="7">TAILS</tspan>
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- Shadow -->
    <div class="coin-shadow" :class="{ 'shadow-flipping': isFlipping }"></div>

    <!-- Glow effect -->
    <div 
      v-if="!isFlipping && result" 
      class="coin-glow"
      :class="result === 'heads' ? 'glow-gold' : 'glow-silver'"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  isFlipping: boolean
  result: 'heads' | 'tails' | null
}>()

const emit = defineEmits<{
  flipComplete: ['heads' | 'tails']
}>()

// Watch for flip completion
watch(() => props.isFlipping, (isFlipping) => {
  if (!isFlipping && props.result) {
    setTimeout(() => {
      emit('flipComplete', props.result!)
    }, 100)
  }
})
</script>

<style scoped>
.coin-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.scene {
  width: 200px;
  height: 200px;
  perspective: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.coin {
  width: 180px;
  height: 180px;
  position: relative;
  transform-style: preserve-3d;
  cursor: pointer;
  transition: transform 0.3s ease-out;
}

.coin:hover:not(.flipping) {
  transform: scale(1.05);
}

.coin.flipping {
  animation: smoothFlip 1s linear infinite;
}

.coin.show-heads {
  transform: rotateY(0deg);
}

.coin.show-tails {
  transform: rotateY(180deg);
}

.coin-face {
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.coin-number {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotateY(180deg);
}

@keyframes smoothFlip {
  0% {
    transform: rotate3d(0, 1, 0, 0);
  }
  100% {
    transform: rotate3d(0, 1, 0, 360deg);
  }
}

/* Enhanced 3D Shadow */
.coin-shadow {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 15px;
  background: radial-gradient(ellipse, 
    rgba(0, 0, 0, 0.4) 0%, 
    rgba(0, 0, 0, 0.2) 50%, 
    transparent 100%);
  border-radius: 50%;
  filter: blur(12px);
  transition: all 0.3s ease;
}

.coin-shadow.shadow-flipping {
  width: 100px;
  height: 20px;
  background: radial-gradient(ellipse, 
    rgba(0, 0, 0, 0.6) 0%, 
    rgba(0, 0, 0, 0.3) 50%, 
    transparent 100%);
  animation: shadowFlip 0.1s ease-in-out infinite;
}

@keyframes shadowFlip {
  0%, 100% {
    width: 80px;
    opacity: 0.4;
  }
  50% {
    width: 120px;
    opacity: 0.6;
  }
}

/* Clean Glow Effects */
.coin-glow {
  position: absolute;
  inset: -15px;
  border-radius: 50%;
  pointer-events: none;
  animation: modernGlow 2s ease-in-out infinite;
}

.coin-glow.glow-gold {
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent 70%);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
}

.coin-glow.glow-silver {
  background: radial-gradient(circle, rgba(192, 192, 192, 0.3), transparent 70%);
  box-shadow: 0 0 30px rgba(192, 192, 192, 0.4);
}

@keyframes modernGlow {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.05);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .coin-container {
    width: 160px;
    height: 160px;
  }
  
  .scene {
    width: 160px;
    height: 160px;
  }
  
  .coin {
    width: 140px;
    height: 140px;
  }
}
</style> 