<template>
  <div 
    v-if="isVisible"
    class="game-history fixed top-0 left-0 right-0 bottom-0 z-30 transition-all duration-300"
  >
    <!-- Backdrop (Behind sidebar) -->
    <div 
      class="history-backdrop absolute top-0 left-0 right-0 bottom-0 bg-transparent transition-opacity duration-300 z-10"
      @click="$emit('close')"
    ></div>

    <!-- Mobile Bottom Sheet / Desktop Sidebar (Above backdrop) -->
    <div class="history-container absolute bg-white/5 backdrop-blur-xl border border-white/10 transform transition-all duration-300 ease-out z-20 shadow-2xl"
         :class="{ 
           'translate-y-0': isMobile,
           'translate-x-0': !isMobile
         }"
    >
      <!-- Header -->
      <div class="history-header flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <h3 class="text-lg font-bold text-white">Game History</h3>
        <button
          @click="$emit('close')"
          class="close-button p-2 text-gray-400 hover:text-white rounded-lg transition-colors hover:bg-white/10"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Stats Summary -->
      <div class="stats-summary mb-6" v-if="stats">
        <div class="grid grid-cols-2 gap-3">
          <div class="stat-card bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-200">
            <div class="stat-value text-green-400 text-xl font-bold mb-1">{{ stats.totalWins }}</div>
            <div class="stat-label text-xs text-gray-400 uppercase tracking-wider">Wins</div>
          </div>
          <div class="stat-card bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-200">
            <div class="stat-value text-red-400 text-xl font-bold mb-1">{{ stats.totalLosses }}</div>
            <div class="stat-label text-xs text-gray-400 uppercase tracking-wider">Losses</div>
          </div>
          <div class="stat-card bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-200">
            <div class="stat-value text-xl font-bold mb-1" :class="stats.winRate >= 50 ? 'text-green-400' : 'text-red-400'">
              {{ Math.round(stats.winRate) }}%
            </div>
            <div class="stat-label text-xs text-gray-400 uppercase tracking-wider">Win Rate</div>
          </div>
          <div class="stat-card bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-200">
            <div class="stat-value text-xl font-bold mb-1" :class="stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'">
              {{ formatProfit(stats.netProfit) }}
            </div>
            <div class="stat-label text-xs text-gray-400 uppercase tracking-wider">Net P&L</div>
          </div>
        </div>
      </div>

      <!-- History List -->
      <div class="history-content flex-1 overflow-hidden">
        <div v-if="history.length === 0" class="empty-state">
          <div class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-gray-300 text-sm font-medium">No games played yet</p>
            <p class="text-gray-500 text-xs mt-1">Start flipping to see your history</p>
          </div>
        </div>

        <div v-else class="history-list space-y-3 max-h-96 overflow-y-auto pr-2">
          <div
            v-for="game in history"
            :key="game.id"
            class="history-item group relative bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
          >
            <!-- Game Result Indicator -->
            <div 
              class="absolute left-0 top-4 bottom-4 w-1 rounded-r transition-all duration-200"
              :class="game.won ? 'bg-green-400' : 'bg-red-400'"
            ></div>

            <div class="flex items-center justify-between ml-4">
              <!-- Game Info -->
              <div class="flex items-center gap-3">
                <!-- Result Icon -->
                <div 
                  class="result-icon w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  :class="game.result === 'heads' 
                    ? 'bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-400/30' 
                    : 'bg-gradient-to-br from-gray-400/20 to-gray-500/20 border border-gray-400/30'"
                >
                  <svg v-if="game.result === 'heads'" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 16L3 14l5.5-5.5L10 10l1.5-1.5L16 13l-2 2M12 7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5M12 2L9 9l3-1 3 1-3-7z"/>
                  </svg>
                  <svg v-else class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                  </svg>
                </div>

                <!-- Game Details -->
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-semibold text-white">
                      {{ game.selectedSide.toUpperCase() }}
                    </span>
                    <span class="text-xs text-gray-500">•</span>
                    <span class="text-xs text-gray-400 font-medium">
                      {{ formatBetAmount(game.betAmount) }} tokens
                    </span>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatTime(game.timestamp) }}
                  </div>
                </div>
              </div>

              <!-- Result & Payout -->
              <div class="text-right">
                <div 
                  class="text-sm font-bold mb-1"
                  :class="game.won ? 'text-green-400' : 'text-red-400'"
                >
                  {{ game.won ? 'WIN' : 'LOSE' }}
                </div>
                <div 
                  class="text-xs font-semibold px-2 py-1 rounded-md"
                  :class="game.payout > 0 
                    ? 'text-green-400 bg-green-400/10' 
                    : 'text-red-400 bg-red-400/10'"
                >
                  {{ formatPayout(game.payout) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { GameResult } from '~/composables/useGameState'

const props = defineProps<{
  history: readonly GameResult[]
  isVisible: boolean
}>()

defineEmits<{
  close: []
}>()

const isMobile = ref(false)

// Check if mobile on mount
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })
})

// Computed stats
const stats = computed(() => {
  if (props.history.length === 0) return null

  const totalGames = props.history.length
  const totalWins = props.history.filter(game => game.won).length
  const totalLosses = totalGames - totalWins
  const winRate = (totalWins / totalGames) * 100
  const netProfit = props.history.reduce((sum, game) => sum + game.payout, 0)

  return {
    totalGames,
    totalWins,
    totalLosses,
    winRate,
    netProfit
  }
})

// Helper functions
function formatBetAmount(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount)
}

function formatPayout(payout: number): string {
  const sign = payout > 0 ? '+' : ''
  return `${sign}${new Intl.NumberFormat('en-US').format(payout)}`
}

function formatProfit(profit: number): string {
  const sign = profit > 0 ? '+' : ''
  return `${sign}${new Intl.NumberFormat('en-US').format(profit)}`
}

function formatTime(timestamp: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(timestamp).getTime()
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
/* Mobile: Bottom Sheet */
@media (max-width: 768px) {
  .history-container {
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 1.5rem 1.5rem 0 0;
    padding: 1.5rem;
    max-height: 75vh;
  }
}

/* Desktop: Right Sidebar */
@media (min-width: 769px) {
  .history-container {
    top: 0;
    right: 0;
    bottom: 0;
    width: 22rem;
    border-radius: 1.5rem 0 0 1.5rem;
    padding: 1.5rem;
  }
}

/* Custom scrollbar */
.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track {
  background: transparent;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .history-container {
    padding: 1rem;
    max-height: 80vh;
  }
  
  .stats-summary {
    margin-bottom: 1rem;
  }
  
  .stat-card {
    padding: 0.75rem !important;
  }
  
  .history-item {
    padding: 0.75rem !important;
  }
  
  .result-icon {
    width: 2rem !important;
    height: 2rem !important;
  }
}
</style> 