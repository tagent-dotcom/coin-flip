<template>
  <div class="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700/50 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.5h-15V5h15v14.5zm0-16.5h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">My Bets</h3>
            <p class="text-xs text-gray-400">Recent betting activity</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-semibold text-white">{{ history.length }}</div>
          <div class="text-xs text-gray-400">Total Games</div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div v-if="history.length === 0" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <h4 class="text-white font-semibold mb-2">No bets yet</h4>
        <p class="text-gray-400 text-sm">Start flipping to see your betting history</p>
      </div>
      
      <div v-else class="space-y-3 max-h-80 overflow-y-auto pr-2">
        <div
          v-for="(bet, index) in history.slice(0, 15)"
          :key="bet.id"
          class="group relative bg-gradient-to-r from-gray-800/50 to-gray-700/30 hover:from-gray-700/60 hover:to-gray-600/40 rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg border border-gray-700/30 hover:border-gray-600/50"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <!-- Win/Loss Indicator -->
          <div 
            class="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
            :class="bet.won ? 'bg-gradient-to-b from-green-400 to-green-500' : 'bg-gradient-to-b from-red-400 to-red-500'"
          ></div>

          <div class="flex items-center justify-between ml-4">
            <!-- Game Info -->
            <div class="flex items-center space-x-4">
              <!-- Result Icon with Animation -->
              <div class="relative">
                <div 
                  class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  :class="bet.result === 'heads' 
                    ? 'bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-400/40' 
                    : 'bg-gradient-to-br from-gray-400/20 to-gray-500/20 border border-gray-400/40'"
                >
                  <div 
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="bet.result === 'heads' 
                      ? 'bg-gradient-to-br from-yellow-400 to-amber-500' 
                      : 'bg-gradient-to-br from-gray-300 to-gray-500'"
                  >
                    <span class="text-black font-bold text-sm">
                      {{ bet.result === 'heads' ? 'H' : 'T' }}
                    </span>
                  </div>
                </div>
                
                <!-- Win/Loss Badge -->
                <div 
                  class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  :class="bet.won ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
                >
                  {{ bet.won ? '✓' : '✗' }}
                </div>
              </div>

              <!-- Bet Details -->
              <div>
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-white font-semibold text-sm">
                    {{ bet.selectedSide.toUpperCase() }}
                  </span>
                  <span class="text-gray-500 text-xs">•</span>
                  <span class="text-gray-300 text-sm font-medium">
                    {{ formatTime(bet.timestamp) }}
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="flex items-center space-x-1">
                    <div class="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
                    <span class="text-gray-400 text-xs">{{ bet.betAmount }} tokens</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payout with Enhanced Styling -->
            <div class="text-right">
              <div 
                class="text-lg font-bold mb-1 transition-all duration-300"
                :class="bet.won ? 'text-green-400 group-hover:text-green-300' : 'text-red-400 group-hover:text-red-300'"
              >
                {{ bet.won ? 'WIN' : 'LOSE' }}
              </div>
              <div 
                class="px-3 py-1 rounded-lg text-sm font-bold transition-all duration-300"
                :class="bet.payout > 0 
                  ? 'text-green-400 bg-green-400/10 border border-green-400/30' 
                  : 'text-red-400 bg-red-400/10 border border-red-400/30'"
              >
                {{ formatPayout(bet.payout) }}
              </div>
            </div>
          </div>

          <!-- Hover Glow Effect -->
          <div class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
               :class="bet.won 
                 ? 'bg-gradient-to-r from-green-400/5 to-transparent' 
                 : 'bg-gradient-to-r from-red-400/5 to-transparent'">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameResult } from '~/composables/useGameState'

const props = defineProps<{
  history: readonly GameResult[]
}>()

// Helper functions
const formatPayout = (payout: number): string => {
  const sign = payout > 0 ? '+' : ''
  return `${sign}${new Intl.NumberFormat('en-US').format(payout)}`
}

const formatTime = (timestamp: Date): string => {
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
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #4f46e5, #7c3aed);
}

/* Staggered Animation */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group {
  animation: slideInUp 0.4s ease-out forwards;
  opacity: 0;
}

/* Glowing effect on hover */
.group:hover .w-12 {
  box-shadow: 0 0 20px rgba(var(--color), 0.3);
}

/* Pulse animation for win indicators */
.bg-green-500 {
  animation: pulse-green 2s ease-in-out infinite;
}

.bg-red-500 {
  animation: pulse-red 2s ease-in-out infinite;
}

@keyframes pulse-green {
  0%, 100% { 
    background-color: rgb(34, 197, 94);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% { 
    background-color: rgb(22, 163, 74);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0);
  }
}

@keyframes pulse-red {
  0%, 100% { 
    background-color: rgb(239, 68, 68);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% { 
    background-color: rgb(220, 38, 38);
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
  }
}

/* Modern scrollbar for Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 rgba(55, 65, 81, 0.3);
}
</style> 