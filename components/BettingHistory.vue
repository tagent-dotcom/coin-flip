<template>
  <div class="casino-history-container">
    <div v-if="!history.length" class="empty-history">
      <div class="empty-icon">🎰</div>
      <p class="empty-text">No games played yet</p>
      <p class="empty-subtext">Start playing to see your history!</p>
    </div>
    
    <div v-else class="history-grid">
      <div 
        v-for="(game, index) in displayedHistory" 
        :key="index"
        class="history-item"
        :class="{
          'won': game.won,
          'lost': !game.won,
          'recent': index === 0
        }"
      >
        <div class="game-header">
          <div class="game-result">
            <div class="result-icon">
              <div v-if="game.won" class="win-icon">🏆</div>
              <div v-else class="lose-icon">💔</div>
            </div>
            <div class="result-text">
              <span class="result-label">{{ game.won ? 'WIN' : 'LOSE' }}</span>
              <span class="result-side">{{ game.selectedSide?.toUpperCase() }}</span>
            </div>
          </div>
          <div class="game-time">{{ formatTime(game.timestamp) }}</div>
        </div>
        
        <div class="game-details">
          <div class="detail-item">
            <span class="detail-label">Bet:</span>
            <span class="detail-value bet-amount">{{ formatAmount(game.betAmount) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Result:</span>
            <span class="detail-value">{{ game.result?.toUpperCase() }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Payout:</span>
            <span class="detail-value" :class="{ 'payout-win': game.won, 'payout-lose': !game.won }">
              {{ game.won ? '+' : '-' }}{{ formatAmount(game.payout) }}
            </span>
          </div>
        </div>
        
        <div class="game-footer">
          <div class="coin-visual">
            <div class="mini-coin" :class="game.result">
              <div class="coin-face">
                <NuxtImg 
                  :src="game.result === 'heads' ? '/happy-pepe.png' : '/sad-pepe.png'"
                  :alt="game.result === 'heads' ? 'Happy Pepe' : 'Sad Pepe'"
                  class="mini-pepe-image"
                  width="24"
                  height="24"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div class="multiplier">
            <span class="multiplier-text">{{ game.multiplier || 1.94 }}x</span>
          </div>
        </div>
        
        <!-- Glow effect for recent wins -->
        <div v-if="game.won && index === 0" class="win-glow"></div>
      </div>
    </div>
    
    <!-- Show more button -->
    <div v-if="history.length > displayLimit" class="show-more-container">
      <button 
        @click="showMore" 
        class="show-more-btn"
      >
        <span>Show More</span>
        <div class="btn-arrow">⬇</div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface GameHistory {
  id: string
  betAmount: number
  selectedSide: 'heads' | 'tails'
  result: 'heads' | 'tails'
  won: boolean
  payout: number
  timestamp: number
  multiplier?: number
}

const props = defineProps<{
  history: GameHistory[]
}>()

const displayLimit = ref(6)

const displayedHistory = computed(() => {
  return props.history.slice(0, displayLimit.value)
})

const showMore = () => {
  displayLimit.value += 6
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}
</script>

<style scoped>
.casino-history-container {
  position: relative;
}

.empty-history {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.02));
  border: 2px dashed rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: iconBounce 2s ease-in-out infinite;
}

.empty-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #FFD700;
  margin-bottom: 0.5rem;
}

.empty-subtext {
  font-size: 0.9rem;
  color: #FFA500;
  font-weight: 500;
}

.history-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.history-item {
  position: relative;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 1rem;
  transition: all 0.3s ease;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
}

.history-item.won {
  border-color: rgba(34, 197, 94, 0.5);
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(255, 215, 0, 0.05));
}

.history-item.lost {
  border-color: rgba(239, 68, 68, 0.5);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(255, 215, 0, 0.05));
}

.history-item.recent {
  border-color: #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.game-result {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.result-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.win-icon {
  animation: victoryPulse 2s ease-in-out infinite;
}

.lose-icon {
  animation: defeatPulse 2s ease-in-out infinite;
}

@keyframes victoryPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes defeatPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.95); opacity: 0.7; }
}

.result-text {
  display: flex;
  flex-direction: column;
}

.result-label {
  font-size: 1.1rem;
  font-weight: 800;
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

.result-side {
  font-size: 0.8rem;
  color: #FFA500;
  font-weight: 600;
}

.game-time {
  font-size: 0.8rem;
  color: #9CA3AF;
  font-weight: 500;
}

.game-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.85rem;
  color: #D1D5DB;
  font-weight: 500;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.bet-amount {
  color: #FFD700;
  font-weight: 700;
}

.payout-win {
  color: #22C55E;
  font-weight: 700;
}

.payout-lose {
  color: #EF4444;
  font-weight: 700;
}

.game-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
}

.coin-visual {
  display: flex;
  align-items: center;
}

.mini-coin {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  animation: miniCoinSpin 3s linear infinite;
  overflow: hidden;
}

.mini-coin.tails {
  background: linear-gradient(45deg, #1a1a2e, #16213e);
}

.mini-pepe-image {
  width: 24px;
  height: 24px;
  object-fit: cover;
  border-radius: 50%;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5));
}

@keyframes miniCoinSpin {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}

.multiplier {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  backdrop-filter: blur(5px);
}

.multiplier-text {
  font-size: 0.8rem;
  font-weight: 700;
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

.win-glow {
  position: absolute;
  inset: 0;
  border-radius: 15px;
  background: linear-gradient(45deg, transparent, rgba(34, 197, 94, 0.1), transparent);
  animation: winGlowMove 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes winGlowMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.show-more-container {
  text-align: center;
  margin-top: 2rem;
}

.show-more-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  color: #FFD700;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  margin: 0 auto;
}

.show-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
  border-color: #FFD700;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.show-more-btn:hover .btn-arrow {
  transform: translateY(2px);
}

@keyframes iconBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Responsive design */
@media (max-width: 768px) {
  .empty-history {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    font-size: 2.5rem;
  }
  
  .empty-text {
    font-size: 1.1rem;
  }
  
  .empty-subtext {
    font-size: 0.8rem;
  }
  
  .history-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .history-item {
    padding: 0.875rem;
    border-radius: 12px;
  }
  
  .game-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }
  
  .result-icon .win-icon,
  .result-icon .lose-icon {
    font-size: 1.25rem;
  }
  
  .result-label {
    font-size: 1rem;
  }
  
  .result-side {
    font-size: 0.75rem;
  }
  
  .game-time {
    font-size: 0.75rem;
  }
  
  .game-details {
    gap: 0.375rem;
    margin-bottom: 0.75rem;
  }
  
  .detail-label {
    font-size: 0.8rem;
  }
  
  .detail-value {
    font-size: 0.85rem;
  }
  
  .game-footer {
    padding-top: 0.75rem;
  }
  
  .mini-coin {
    width: 26px;
    height: 26px;
  }
  
  .mini-pepe-image {
    width: 20px;
    height: 20px;
  }
  
  .multiplier {
    padding: 0.25rem 0.6rem;
  }
  
  .multiplier-text {
    font-size: 0.75rem;
  }
  
  .show-more-container {
    margin-top: 1.5rem;
  }
  
  .show-more-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .history-item {
    padding: 0.75rem;
  }
  
  .result-label {
    font-size: 0.95rem;
  }
  
  .result-side {
    font-size: 0.7rem;
  }
  
  .detail-label,
  .detail-value {
    font-size: 0.75rem;
  }
  
  .mini-coin {
    width: 24px;
    height: 24px;
  }
  
  .mini-pepe-image {
    width: 18px;
    height: 18px;
  }
  
  .multiplier-text {
    font-size: 0.7rem;
  }
  
  .show-more-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}
</style> 