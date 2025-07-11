<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
    <!-- Enhanced Casino Background -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Golden Spotlights -->
      <div class="spotlight-container">
        <div class="spotlight spotlight-1"></div>
        <div class="spotlight spotlight-2"></div>
        <div class="spotlight spotlight-3"></div>
      </div>
      
      <!-- Neon Casino Lights -->
      <div class="neon-lights">
        <div class="neon-circle neon-circle-1"></div>
        <div class="neon-circle neon-circle-2"></div>
        <div class="neon-circle neon-circle-3"></div>
        <div class="neon-circle neon-circle-4"></div>
      </div>
      
      <!-- Gold Particles -->
      <div class="gold-particles">
        <div v-for="i in 30" :key="i" class="gold-particle" :style="goldParticleStyle(i)"></div>
      </div>
      
      <!-- Pulse Grid -->
      <div class="pulse-grid">
        <div v-for="i in 25" :key="i" class="pulse-dot" :style="pulseStyle(i)"></div>
      </div>
    </div>

    <!-- Golden Finger Header -->
    <div class="relative z-10 text-center py-6">
      <div class="casino-header">
        <div class="header-stars">
          <div class="star star-1">⭐</div>
          <div class="star star-2">⭐</div>
          <div class="star star-3">⭐</div>
        </div>
        <h1 class="casino-title">
          <span class="golden-text"></span>
        </h1>
         
      </div>
    </div>

    <!-- Falling Tokens Effect -->
    <div v-if="showTokens" class="tokens-container pointer-events-none">
      <div v-for="n in 50" :key="n" class="falling-token" :style="tokenStyle(n)">
        <div class="token-coin">
          <div class="token-face token-front">
            <NuxtImg 
              :src="lastGameWon ? '/happy-pepe.png' : '/sad-pepe.png'"
              :alt="lastGameWon ? 'Happy Pepe' : 'Sad Pepe'"
              class="token-pepe-image"
              width="30"
              height="30"
              loading="lazy"
            />
          </div>
          <div class="token-face token-back">
            <div class="token-symbol">{{ lastGameWon ? '🏆' : '💰' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-3 py-2">
      <!-- Header with Wallet Connection -->
      <div class="mb-4">
        <WalletConnection />
      </div>

      <!-- Game Stats Bar -->
      <div class="casino-stats-bar mb-4">
        <div class="stat-item">
          <div class="stat-label">BALANCE</div>
          <div class="stat-value">{{ formatBalance(gameState.balance.value) }}</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-label">ROUND</div>
          <div class="stat-value">{{ gameState.history.value.length + 1 }}</div>
        </div>
      </div>

      <!-- Main Coin Container -->
      <div class="casino-coin-container mb-6">
        <div class="coin-stage">
          <div class="stage-lights">
            <div class="stage-light stage-light-left"></div>
            <div class="stage-light stage-light-right"></div>
          </div>
          <div class="coin-wrapper">
            <AnimatedCoin 
              ref="coinRef"
              :is-flipping="gameState.isFlipping.value"
              :result="gameState.lastResult.value"
              @flip-complete="onFlipComplete"
            />
          </div>
        </div>
      </div>

      <!-- Casino Side Selection -->
      <div class="casino-betting-section mb-4">
        <div class="betting-header">
          <h3 class="betting-title">HEADS OR TAILS</h3>
          <div class="betting-subtitle">Choose Your Side</div>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="onSideSelected('heads')"
            :class="[
              'casino-side-button heads-button',
              gameState.selectedSide.value === 'heads' ? 'selected' : ''
            ]"
          >
            <div class="button-glow"></div>
            <div class="button-content">
               
              <div class="button-label">HEADS</div>
              
            </div>
          </button>
          
          <button
            @click="onSideSelected('tails')"
            :class="[
              'casino-side-button tails-button',
              gameState.selectedSide.value === 'tails' ? 'selected' : ''
            ]"
          >
            <div class="button-glow"></div>
            <div class="button-content">
               
              <div class="button-label">TAILS</div>
               
            </div>
          </button>
        </div>
      </div>

      <!-- Enhanced Bet Amount Section -->
      <div class="casino-bet-section mb-4">
        <div class="bet-container">
          <div class="bet-header">
            <div class="bet-title">PLACE YOUR BET</div>
            <div class="bet-balance">Balance: {{ formatBalance(gameState.balance.value) }}</div>
          </div>
          
          <div class="bet-input-container">
            <div class="bet-input-wrapper">
              <div class="bet-icon">
                <div class="golden-coin">💰</div>
              </div>
              <input
                v-model.number="betAmount"
                type="number"
                placeholder="Enter amount"
                class="bet-input"
                :min="gameState.minBet"
                :max="gameState.balance.value"
              >
              <div class="bet-currency">TON</div>
            </div>
          </div>
          
          <!-- Quick Bet Buttons -->
          <div class="quick-bet-buttons">
            <button
              @click="setBetAmount(gameState.minBet)"
              class="quick-bet-btn"
            >
              MIN
            </button>
            <button
              @click="setBetAmount(betAmount * 2)"
              class="quick-bet-btn"
            >
              2X
            </button>
            <button
              @click="setBetAmount(betAmount + 50)"
              class="quick-bet-btn"
            >
              +50
            </button>
            <button
              @click="setBetAmount(betAmount + 100)"
              class="quick-bet-btn"
            >
              +100
            </button>
            <button
              @click="setBetAmount(gameState.balance.value)"
              class="quick-bet-btn max-bet"
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Play Button -->
      <div class="casino-play-section mb-6">
        <button
          @click="flipCoin"
          :disabled="!canFlip"
          :class="[
            'casino-play-button',
            canFlip ? 'active' : 'disabled'
          ]"
        >
          <div class="play-button-glow"></div>
          <div class="play-button-content">
            <div class="play-icon">🎰</div>
            <div class="play-text">
              {{ gameState.isFlipping.value ? 'SPINNING...' : 'PLAY NOW!' }}
            </div>
            <div class="play-subtext">
              {{ gameState.isFlipping.value ? 'Good Luck!' : 'Win Big!' }}
            </div>
          </div>
        </button>
      </div>

      <!-- Betting History -->
      <div class="casino-history-section">
        <div class="history-header">
          <h3 class="history-title">🏆 RECENT GAMES</h3>
        </div>
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
const lastGameWon = ref(false)

// Coin ref for triggering overlays
const coinRef = ref(null)

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
    lastGameWon.value = lastGame.won
    
    if (lastGame.won) {
      showTokens.value = true
      soundEffects.playWinSound()
      
      // Trigger win overlay on coin
      if (coinRef.value && coinRef.value.showResult) {
        coinRef.value.showResult(true)
      }
      
      setTimeout(() => {
        showTokens.value = false
      }, 5000)
    } else {
      soundEffects.playLoseSound()
      
      // Trigger lose overlay on coin
      if (coinRef.value && coinRef.value.showResult) {
        coinRef.value.showResult(false)
      }
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

const formatBalance = (amount: number) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

// Generate random token styles
function tokenStyle(n: number) {
  const left = Math.random() * 100
  const delay = Math.random() * 2
  const rotate = Math.random() * 360
  const rotateSpeed = 2 + Math.random() * 4
  const size = 20 + Math.random() * 20
  const duration = 4 + Math.random() * 3
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

// Generate gold particle styles
function goldParticleStyle(n: number) {
  const left = Math.random() * 100
  const top = Math.random() * 100
  const delay = Math.random() * 5
  const duration = 3 + Math.random() * 4
  const size = 2 + Math.random() * 4
  return {
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`
  }
}
</script>

<style scoped>
/* Casino Header */
.casino-header {
  position: relative;
  margin-bottom: 2rem;
}

.header-stars {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
}

.star {
  font-size: 24px;
  animation: starTwinkle 2s ease-in-out infinite;
}

.star-1 { animation-delay: 0s; }
.star-2 { animation-delay: 0.7s; }
.star-3 { animation-delay: 1.4s; }

@keyframes starTwinkle {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.casino-title {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  text-align: center;
}

.golden-text {
  background: linear-gradient(45deg, #FFD700, #FFA500, #FF8C00, #FFD700);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: goldenShine 3s ease-in-out infinite;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

@keyframes goldenShine {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.casino-subtitle {
  font-size: 1.2rem;
  text-align: center;
}

.subtitle-text {
  color: #FFD700;
  font-weight: 600;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
}

/* Enhanced Background Effects */
.spotlight-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.spotlight {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  animation: spotlightMove 8s ease-in-out infinite;
}

.spotlight-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2), transparent 70%);
  top: -50px;
  left: -50px;
}

.spotlight-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 165, 0, 0.15), transparent 70%);
  top: 50%;
  right: -100px;
  animation-delay: -3s;
}

.spotlight-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(255, 140, 0, 0.2), transparent 70%);
  bottom: -50px;
  left: 50%;
  animation-delay: -6s;
}

@keyframes spotlightMove {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(50px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 50px) scale(0.9); }
}

/* Gold Particles */
.gold-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gold-particle {
  position: absolute;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border-radius: 50%;
  animation: goldFloat 6s ease-in-out infinite;
}

@keyframes goldFloat {
  0%, 100% { 
    opacity: 0.3;
    transform: translateY(0px) scale(1);
  }
  50% { 
    opacity: 0.8;
    transform: translateY(-20px) scale(1.2);
  }
}

/* Casino Stats Bar */
.casino-stats-bar {
  display: flex;
  justify-content: space-around;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  color: #FFD700;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
}

.multiplier-glow {
  color: #FFD700;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
  animation: multiplierPulse 2s ease-in-out infinite;
}

@keyframes multiplierPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Casino Coin Stage */
.casino-coin-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.coin-stage {
  position: relative;
  background: radial-gradient(circle at center, rgba(255, 215, 0, 0.1), transparent 70%);
  border-radius: 50%;
  padding: 2rem;
  border: 3px solid rgba(255, 215, 0, 0.3);
  box-shadow: 
    0 0 50px rgba(255, 215, 0, 0.2),
    inset 0 0 50px rgba(255, 215, 0, 0.1);
}

.stage-lights {
  position: absolute;
  inset: -20px;
  pointer-events: none;
}

.stage-light {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.6), transparent 70%);
  animation: stageLightRotate 4s linear infinite;
}

.stage-light-left {
  top: 20%;
  left: -10px;
}

.stage-light-right {
  top: 20%;
  right: -10px;
  animation-delay: -2s;
}

@keyframes stageLightRotate {
  0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
}

/* Casino Betting Section */
.casino-betting-section {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.betting-header {
  text-align: center;
  margin-bottom: 1rem;
}

.betting-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #FFD700;
  margin-bottom: 0.25rem;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.betting-subtitle {
  font-size: 0.8rem;
  color: #FFA500;
  font-weight: 500;
}

.casino-side-button {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.casino-side-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
}

.casino-side-button.selected {
  border-color: #FFD700;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
}

.button-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.casino-side-button:hover .button-glow {
  opacity: 1;
}

.button-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.button-icon {
  margin-bottom: 0.375rem;
}

.pepe-icon {
  font-size: 1.5rem;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.button-label {
  font-size: 1rem;
  font-weight: 800;
  color: #FFD700;
  margin-bottom: 0.125rem;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

.button-description {
  font-size: 0.7rem;
  color: #FFA500;
  font-weight: 500;
}

/* Casino Bet Section */
.casino-bet-section {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.bet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.bet-title {
  font-size: 1rem;
  font-weight: 800;
  color: #FFD700;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
}

.bet-balance {
  font-size: 0.8rem;
  color: #FFA500;
  font-weight: 600;
}

.bet-input-container {
  margin-bottom: 0.75rem;
}

.bet-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 0.6rem;
  backdrop-filter: blur(5px);
}

.bet-icon {
  margin-right: 0.5rem;
}

.golden-coin {
  font-size: 1.25rem;
  animation: coinSpin 3s linear infinite;
}

@keyframes coinSpin {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}

.bet-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1rem;
  font-weight: 600;
}

.bet-input::placeholder {
  color: rgba(255, 165, 0, 0.6);
}

.bet-currency {
  font-size: 0.8rem;
  color: #FFD700;
  font-weight: 600;
}

.quick-bet-buttons {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.quick-bet-btn {
  flex: 1;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  color: #FFD700;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-bet-btn:hover {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
  transform: translateY(-1px);
}

.max-bet {
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(255, 69, 0, 0.1));
  border-color: rgba(255, 0, 0, 0.5);
  color: #FF4500;
}

/* Casino Play Button */
.casino-play-section {
  text-align: center;
}

.casino-play-button {
  position: relative;
  background: linear-gradient(135deg, #FFD700, #FFA500, #FF8C00);
  border: none;
  border-radius: 16px;
  padding: 1rem 2rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
  width: 100%;
  max-width: 350px;
}

.casino-play-button:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(255, 215, 0, 0.5);
}

.casino-play-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.play-button-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.casino-play-button:hover:not(.disabled) .play-button-glow {
  opacity: 1;
  animation: buttonGlowMove 1.5s ease-in-out infinite;
}

@keyframes buttonGlowMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.play-button-content {
  position: relative;
  z-index: 1;
  color: black;
  text-align: center;
}

.play-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.play-text {
  font-size: 1.25rem;
  font-weight: 900;
  margin-bottom: 0.125rem;
}

.play-subtext {
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.8;
}

/* Casino History Section */
.casino-history-section {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.history-header {
  text-align: center;
  margin-bottom: 1rem;
}

.history-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #FFD700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.token-pepe-image {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 50%;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
}

.token-symbol {
  font-size: 20px;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5));
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

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  .casino-header {
    margin-bottom: 1rem;
  }
  
  .casino-title {
    font-size: 2.25rem;
  }
  
  .casino-stats-bar {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .stat-label {
    font-size: 0.7rem;
  }
  
  .stat-value {
    font-size: 1rem;
  }
  
  .casino-coin-container {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .coin-stage {
    padding: 1.5rem;
  }
  
  .casino-betting-section,
  .casino-bet-section,
  .casino-history-section {
    padding: 0.875rem;
    margin-bottom: 1rem;
  }
  
  .betting-title {
    font-size: 1.1rem;
  }
  
  .betting-subtitle {
    font-size: 0.75rem;
  }
  
  .casino-side-button {
    padding: 0.625rem;
  }
  
  .pepe-icon {
    font-size: 1.25rem;
  }
  
  .button-label {
    font-size: 0.9rem;
  }
  
  .button-description {
    font-size: 0.65rem;
  }
  
  .bet-title {
    font-size: 0.95rem;
  }
  
  .bet-balance {
    font-size: 0.75rem;
  }
  
  .bet-input-wrapper {
    padding: 0.5rem;
  }
  
  .golden-coin {
    font-size: 1.1rem;
  }
  
  .bet-input {
    font-size: 0.9rem;
  }
  
  .bet-currency {
    font-size: 0.75rem;
  }
  
  .quick-bet-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
  
  .casino-play-button {
    padding: 0.875rem 1.75rem;
    border-radius: 14px;
  }
  
  .play-icon {
    font-size: 1.25rem;
  }
  
  .play-text {
    font-size: 1.1rem;
  }
  
  .play-subtext {
    font-size: 0.75rem;
  }
  
  .history-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .casino-title {
    font-size: 2rem;
  }
  
  .casino-stats-bar {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .stat-item {
    flex: 1;
    min-width: 80px;
  }
  
  .quick-bet-buttons {
    gap: 0.25rem;
  }
  
  .quick-bet-btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
  }
}
</style> 