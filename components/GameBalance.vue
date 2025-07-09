<template>
  <div class="glass-card p-4 rounded-xl border border-gray-700/50 relative overflow-hidden">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm"></div>
    
    <!-- Content -->
    <div class="relative z-10">
      <!-- Balance Header -->
      <div class="text-center mb-3">
        <div class="flex items-center justify-center mb-1">
          <p class="text-gray-400 text-xs font-medium">{{ gameMode.toUpperCase() }} BALANCE</p>
          <div v-if="gameMode === 'demo'" class="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
            DEMO
          </div>
          <div v-else class="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
            WALLET
          </div>
        </div>
        <div class="flex items-center justify-center">
          <div class="w-3 h-3 rounded-full mr-2 animate-pulse" :class="gameMode === 'demo' ? 'bg-yellow-500' : 'bg-blue-500'"></div>
          <span class="text-2xl font-bold text-white">{{ formatBalance(balance) }}</span>
          <span class="text-gray-400 text-sm ml-1">{{ gameMode === 'demo' ? 'DEMO' : 'TON' }}</span>
        </div>
        
        <!-- Balance change indicator -->
        <div v-if="balanceChange !== 0" class="text-xs mt-1" :class="balanceChange > 0 ? 'text-green-400' : 'text-red-400'">
          {{ balanceChange > 0 ? '+' : '' }}{{ formatBalance(balanceChange) }}
        </div>
      </div>

      <!-- Game Mode Info -->
      <div class="text-center">
        <p v-if="gameMode === 'demo'" class="text-xs text-gray-500">
          Connect your TON wallet to play with real TON
        </p>
        <p v-else class="text-xs text-blue-400">
          Playing with real TON from your wallet
        </p>
      </div>
    </div>

    <!-- Subtle glow effect -->
    <div class="absolute inset-0 rounded-xl opacity-20" :class="gameMode === 'demo' ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10' : 'bg-gradient-to-r from-blue-500/10 to-blue-600/10'"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  balance: number
  gameMode?: string
}>()

const balanceChange = ref(0)
const previousBalance = ref(props.balance)

// Watch for balance changes to show change indicator
watch(() => props.balance, (newBalance, oldBalance) => {
  const change = newBalance - oldBalance
  if (change !== 0) {
    balanceChange.value = change
    previousBalance.value = oldBalance
    
    // Clear the change indicator after 3 seconds
    setTimeout(() => {
      balanceChange.value = 0
    }, 3000)
  }
})

function formatBalance(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount)
}

// Get game mode or default to demo
const gameMode = computed(() => props.gameMode || 'demo')
</script>

<style scoped>
.glass-card {
  background: rgba(31, 41, 55, 0.3);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(156, 163, 175, 0.2);
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}
</style> 