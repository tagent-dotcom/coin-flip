<template>
  <div class="min-h-screen bg-[#1a1d2e] text-white relative overflow-hidden">
    <!-- Animated Background Lights -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="neon-lights">
        <div class="neon-circle neon-circle-1"></div>
        <div class="neon-circle neon-circle-2"></div>
        <div class="neon-circle neon-circle-3"></div>
        <div class="neon-circle neon-circle-4"></div>
      </div>
      <div class="pulse-grid">
        <div v-for="i in 20" :key="i" class="pulse-dot" :style="pulseStyle(i)"></div>
      </div>
    </div>
    <!-- Falling Tokens Effect -->
    <div v-if="showTokens" class="tokens-container pointer-events-none">
      <div v-for="n in 40" :key="n" class="falling-token" :style="tokenStyle(n)">
        <div class="token-coin">
          <div class="token-face token-front">💰</div>
          <div class="token-face token-back">🪙</div>
        </div>
      </div>
    </div>
    <div class="max-w-2xl mx-auto px-4 py-6">
      <!-- Header with Wallet Connection -->
      <div class="mb-6">
        <WalletConnection />
      </div>



      <!-- Main Coin -->
      <div class="flex justify-center items-center mb-8">
        <div class="flex justify-center items-center w-52 h-52">
          <AnimatedCoin 
            :is-flipping="gameState.isFlipping.value"
            :result="gameState.lastResult.value"
            @flip-complete="onFlipComplete"
          />
        </div>
      </div>

      <!-- Side Selection Buttons -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <button
          @click="onSideSelected('heads')"
          :class="[
            'relative p-4 rounded-2xl font-bold text-lg transition-all duration-200 glow-button',
            gameState.selectedSide.value === 'heads'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg selected-glow'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover-glow'
          ]"
        >
          <div class="flex items-center justify-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <svg data-v-5dbf0c9a="" class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path data-v-5dbf0c9a="" d="M5 16L3 14l5.5-5.5L10 10l1.5-1.5L16 13l-2 2M12 7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5M12 2L9 9l3-1 3 1-3-7z"></path></svg>
            </div>
            <span>HEADS</span>
          </div>
        </button>
        
        <button
          @click="onSideSelected('tails')"
          :class="[
            'relative p-4 rounded-2xl font-bold text-lg transition-all duration-200 glow-button',
            gameState.selectedSide.value === 'tails'
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg selected-glow'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover-glow'
          ]"
        >
          <div class="flex items-center justify-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
              <svg data-v-5dbf0c9a="" class="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24"><path data-v-5dbf0c9a="" d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"></path></svg>
            </div>
            <span>TAILS</span>
          </div>
        </button>
      </div>



      <!-- Bet Amount Input -->
      <div class="mb-6">
        <div class="relative bg-gray-800 rounded-2xl p-4">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <text x="12" y="16" text-anchor="middle" class="text-xs font-bold">$</text>
              </svg>
            </div>
            <input
              v-model.number="betAmount"
              type="number"
              placeholder="Enter amount"
              class="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
              :min="gameState.minBet"
              :max="gameState.balance.value"
            >
          </div>
        </div>
        
        <!-- Quick Bet Buttons -->
        <div class="flex justify-between mt-4 space-x-2">
          <button
            @click="setBetAmount(gameState.minBet)"
            class="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
          >
            Min
          </button>
          <button
            @click="setBetAmount(betAmount + 10)"
            class="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
          >
            +10
          </button>
          <button
            @click="setBetAmount(betAmount + 25)"
            class="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
          >
            +25
          </button>
          <button
            @click="setBetAmount(betAmount + 50)"
            class="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
          >
            +50
          </button>
          <button
            @click="setBetAmount(gameState.balance.value)"
            class="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
          >
            Max
          </button>
        </div>
      </div>

      <!-- Play Game Button -->
      <button
        @click="flipCoin"
        :disabled="!canFlip"
        :class="[
          'w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 play-button',
          canFlip
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg play-glow'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        ]"
      >
        {{ gameState.isFlipping.value ? 'Playing...' : 'Play Game' }}
      </button>

      <!-- Betting History -->
      <div class="mt-8">
        <BettingHistory :history="gameState.history.value" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameState } from '~/composables/useGameState'
import { useSoundEffects } from '~/composables/useSoundEffects'

const gameState = useGameState()
const soundEffects = useSoundEffects()

// Local reactive state
const selectedMultiplier = ref(1.94)
const betAmount = ref(gameState.betAmount.value)

// Tokens state
const showTokens = ref(false)

// Multiplier options
const multiplierOptions = [1.94, 1.94, 1.94, 1.94, 1.94, 1.94]

// Computed properties
const currentMultiplier = computed(() => selectedMultiplier.value)

const canFlip = computed(() => 
  !gameState.isFlipping.value && 
  gameState.selectedSide.value && 
  betAmount.value > 0 && 
  betAmount.value <= gameState.balance.value
)

// Watch for changes and sync with game state
watch(betAmount, (newAmount) => {
  if (newAmount >= gameState.minBet && newAmount <= gameState.balance.value) {
    gameState.setBetAmount(newAmount)
  }
})

// Watch for a win to trigger falling tokens and sounds
watch(() => gameState.history.value[0], (lastGame) => {
  if (lastGame) {
    if (lastGame.won) {
      showTokens.value = true
      soundEffects.playWinSound()
      setTimeout(() => {
        showTokens.value = false
      }, 4000)
    } else {
      soundEffects.playLoseSound()
    }
  }
})

// Methods
const onSideSelected = (side: 'heads' | 'tails') => {
  soundEffects.playClickSound()
  gameState.selectSide(side)
}

const setBetAmount = (amount: number) => {
  const validAmount = Math.max(gameState.minBet, Math.min(amount, gameState.balance.value))
  betAmount.value = validAmount
  gameState.setBetAmount(validAmount)
}

const flipCoin = async () => {
  if (!canFlip.value) return
  soundEffects.playCoinFlipSound()
  await gameState.flipCoin()
}

const onFlipComplete = (result: 'heads' | 'tails') => {
  gameState.completeFlip(result)
}

// Generate random token styles
function tokenStyle(n: number) {
  const left = Math.random() * 100
  const delay = Math.random() * 1.5
  const rotate = Math.random() * 360
  const rotateSpeed = 3 + Math.random() * 5
  const size = 24 + Math.random() * 16
  const duration = 3 + Math.random() * 2
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    fontSize: `${size}px`,
    '--rotate-speed': `${rotateSpeed}s`,
    '--initial-rotate': `${rotate}deg`
  }
}

// Generate random pulse dot styles
function pulseStyle(n: number) {
  const left = Math.random() * 100
  const top = Math.random() * 100
  const delay = Math.random() * 3
  const duration = 2 + Math.random() * 2
  const scale = 0.5 + Math.random() * 1
  return {
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    transform: `scale(${scale})`
  }
}
</script>

<style scoped>
/* Component-specific animations */
.flip-enter-active,
.flip-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.flip-enter-from,
.flip-leave-to {
  opacity: 0;
  transform: rotateY(90deg);
}

.tokens-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 50;
}

.falling-token {
  position: absolute;
  top: -50px;
  animation: token-fall 4s cubic-bezier(0.4, 0.7, 0.5, 1) forwards;
}

.token-coin {
  position: relative;
  transform-style: preserve-3d;
  animation: token-spin var(--rotate-speed, 4s) linear infinite;
  transform: rotate(var(--initial-rotate, 0deg));
}

.token-face {
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
}

.token-front {
  transform: rotateY(0deg);
}

.token-back {
  transform: rotateY(180deg);
  position: absolute;
  top: 0;
  left: 0;
}

@keyframes token-fall {
  0% {
    top: -50px;
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  80% {
    opacity: 1;
    transform: translateY(80vh) scale(0.8);
  }
  100% {
    top: 100vh;
    opacity: 0;
    transform: translateY(100vh) scale(0.5);
  }
}

@keyframes token-spin {
  0% {
    transform: rotateY(0deg) rotateX(0deg);
  }
  25% {
    transform: rotateY(90deg) rotateX(90deg);
  }
  50% {
    transform: rotateY(180deg) rotateX(180deg);
  }
  75% {
    transform: rotateY(270deg) rotateX(270deg);
  }
  100% {
    transform: rotateY(360deg) rotateX(360deg);
  }
}

/* Neon Light Effects */
.neon-lights {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.neon-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  opacity: 0.6;
}

.neon-circle-1 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #ff0080, transparent 70%);
  top: 10%;
  left: 10%;
  animation: neonFloat 6s ease-in-out infinite;
}

.neon-circle-2 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #00ff80, transparent 70%);
  top: 60%;
  right: 15%;
  animation: neonFloat 8s ease-in-out infinite reverse;
}

.neon-circle-3 {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #8000ff, transparent 70%);
  bottom: 20%;
  left: 20%;
  animation: neonFloat 7s ease-in-out infinite;
}

.neon-circle-4 {
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #ff8000, transparent 70%);
  top: 30%;
  right: 40%;
  animation: neonFloat 5s ease-in-out infinite reverse;
}

@keyframes neonFloat {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.9;
  }
}

/* Pulse Grid */
.pulse-grid {
  position: absolute;
  inset: 0;
}

.pulse-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f39c12);
  border-radius: 50%;
  animation: pulseDot 3s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% {
    opacity: 0.3;
    box-shadow: 0 0 5px currentColor;
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
  }
}

/* Glow Button Effects */
.glow-button {
  position: relative;
  overflow: hidden;
}

.glow-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.glow-button:hover::before {
  left: 100%;
}

.selected-glow {
  box-shadow: 
    0 0 20px rgba(147, 51, 234, 0.5),
    0 0 40px rgba(147, 51, 234, 0.3),
    0 0 60px rgba(147, 51, 234, 0.1);
  animation: selectedPulse 2s ease-in-out infinite;
}

.hover-glow:hover {
  box-shadow: 
    0 0 15px rgba(59, 130, 246, 0.4),
    0 0 30px rgba(59, 130, 246, 0.2);
}

.play-glow {
  box-shadow: 
    0 0 25px rgba(59, 130, 246, 0.6),
    0 0 50px rgba(59, 130, 246, 0.4),
    0 0 75px rgba(59, 130, 246, 0.2);
  animation: playPulse 1.5s ease-in-out infinite;
}

@keyframes selectedPulse {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(147, 51, 234, 0.5),
      0 0 40px rgba(147, 51, 234, 0.3),
      0 0 60px rgba(147, 51, 234, 0.1);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(147, 51, 234, 0.8),
      0 0 60px rgba(147, 51, 234, 0.5),
      0 0 90px rgba(147, 51, 234, 0.3);
  }
}

@keyframes playPulse {
  0%, 100% {
    box-shadow: 
      0 0 25px rgba(59, 130, 246, 0.6),
      0 0 50px rgba(59, 130, 246, 0.4),
      0 0 75px rgba(59, 130, 246, 0.2);
  }
  50% {
    box-shadow: 
      0 0 35px rgba(59, 130, 246, 0.9),
      0 0 70px rgba(59, 130, 246, 0.6),
      0 0 105px rgba(59, 130, 246, 0.4);
  }
}
</style> 