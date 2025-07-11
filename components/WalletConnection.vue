<template>
  <div class="wallet-connection flex">
    <!-- Wallet Connect Button -->
    <div v-if="!tonWallet.isConnected.value" class="mb-4  flex flex-col justify-center items-center w-[100%]">
      <button
        @click="handleConnectClick"
        :disabled="tonWallet.isConnecting.value"
        class="w-[85%] py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <svg v-if="!tonWallet.isConnecting.value" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span>{{ tonWallet.isConnecting.value ? 'Connecting...' : 'Connect TON Wallet' }}</span>
      </button>
      <p class="text-xs text-gray-500 text-center mt-2">Balance: {{ formatBalance(gameState.balance.value) }} Tokens</p>
    </div>

        <!-- Connected Wallet Info -->
    <div v-else class="mb-4">
      <div class="flex items-center justify-between p-3 bg-gray-800 rounded-xl">
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          <div>
            <div class="text-sm font-medium text-white">{{ tonWallet.formattedAddress.value }}</div>
            <div class="text-xs text-gray-400">{{ tonWallet.walletType.value }}</div>
          </div>
        </div>
        <button
          @click="tonWallet.disconnectWallet"
          class="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          Disconnect
        </button>
      </div>
      <p class="text-xs text-gray-500 text-center mt-2">Balance: {{ formatBalance(gameState.balance.value) }} Tokens</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTonWallet } from '~/composables/useTonWallet'
import { useGameState } from '~/composables/useGameState'

const tonWallet = useTonWallet()
const gameState = useGameState()
const addressCopied = ref(false)

// Format balance with commas
const formatBalance = (balance: number) => {
  return balance.toLocaleString()
}

const copyAddress = async () => {
  if (!tonWallet.address.value) return
  
  try {
    await navigator.clipboard.writeText(tonWallet.address.value)
    addressCopied.value = true
    setTimeout(() => {
      addressCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy address:', error)
  }
}

// Debug function to test wallet connection
const handleConnectClick = async () => {
  console.log('WalletConnection: Connect button clicked')
  console.log('TonWallet object:', tonWallet)
  await tonWallet.connectWallet()
}
</script>

<style scoped>
/* Additional component-specific styles if needed */
</style> 