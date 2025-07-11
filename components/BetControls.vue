<template>
  <div class="space-y-4 z-50">
    <!-- Choose Your Side -->
    <div>
      <h3 class="text-gray-300 text-xs font-medium mb-2 text-center">CHOOSE YOUR SIDE</h3>
      <div class="grid grid-cols-2 gap-3">
        <!-- Heads Button -->
        <button
          @click="selectSide('heads')"
          :disabled="isDisabled"
          class="group relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95"
          :class="[
            selectedSide === 'heads'
              ? 'border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/25'
              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500',
            isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          ]"
        >
          <div class="flex flex-col items-center">
            <!-- Heads Coin Preview -->
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mb-1 shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16L3 14l5.5-5.5L10 10l1.5-1.5L16 13l-2 2M12 7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5M12 2L9 9l3-1 3 1-3-7z"/>
              </svg>
            </div>
            <span class="text-sm font-medium" :class="selectedSide === 'heads' ? 'text-yellow-400' : 'text-gray-300'">
              HEADS
            </span>
          </div>
          
          <!-- Selection indicator -->
          <div 
            v-if="selectedSide === 'heads'"
            class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center"
          >
            <svg class="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </button>

        <!-- Tails Button -->
        <button
          @click="selectSide('tails')"
          :disabled="isDisabled"
          class="group relative p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95"
          :class="[
            selectedSide === 'tails'
              ? 'border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/25'
              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500',
            isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          ]"
        >
          <div class="flex flex-col items-center">
            <!-- Tails Coin Preview -->
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center mb-1 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16L3 14l5.5-5.5L10 10l1.5-1.5L16 13l-2 2M12 7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5M12 2L9 9l3-1 3 1-3-7z"/>
              </svg>
            </div>
            <span class="text-sm font-medium" :class="selectedSide === 'tails' ? 'text-yellow-400' : 'text-gray-300'">
              TAILS
            </span>
          </div>
          
          <!-- Selection indicator -->
          <div 
            v-if="selectedSide === 'tails'"
            class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center"
          >
            <svg class="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- Bet Amount Input -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="text-gray-300 text-xs font-medium">BET AMOUNT</label>
        <button
          @click="setMaxBet"
          :disabled="isDisabled"
          class="text-xs text-yellow-500 hover:text-yellow-400 font-medium transition-colors duration-200"
          :class="isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
        >
          MAX
        </button>
      </div>
      
      <div class="relative">
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
          <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        </div>
        <input
          type="number"
          :value="betAmount"
          @input="updateBetAmount"
          :disabled="isDisabled"
          :min="1"
          :max="maxBet"
          class="w-full bg-gray-800/80 border border-gray-600 rounded-lg py-2 pl-8 pr-16 text-white text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all duration-200 disabled:opacity-50"
          placeholder="Enter amount"
        />
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
          <span class="text-xs text-gray-400 font-medium">TOKENS</span>
        </div>
      </div>
    </div>

    <!-- Quick Bet Buttons -->
    <!-- <div>
      <label class="text-gray-300 text-xs font-medium mb-2 block">QUICK BET</label>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="(percentage, index) in percentages"
          :key="index"
          @click="setQuickBet(percentage)"
          :disabled="isDisabled"
          class="py-1.5 px-2 text-xs font-medium rounded-lg border border-gray-600 bg-gray-800/50 text-gray-300 hover:border-yellow-500 hover:text-yellow-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ percentage === 1 ? 'MAX' : `${percentage * 100}%` }}
        </button>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  selectedSide: 'heads' | 'tails' | null
  betAmount: number
  maxBet: number
  isDisabled: boolean
}>()

const emit = defineEmits<{
  sideSelected: ['heads' | 'tails']
  betChanged: [number]
}>()

const percentages = [0.01, 0.05, 0.1, 0.25, 0.5, 1] // 1%, 5%, 10%, 25%, 50%, MAX

function selectSide(side: 'heads' | 'tails') {
  if (props.isDisabled) return
  emit('sideSelected', side)
}

function updateBetAmount(event: Event) {
  if (props.isDisabled) return
  const target = event.target as HTMLInputElement
  const amount = Math.max(1, Math.min(Number(target.value) || 1, props.maxBet))
  emit('betChanged', amount)
}

function setQuickBet(percentage: number) {
  if (props.isDisabled) return
  const amount = percentage === 1 ? props.maxBet : Math.max(1, Math.floor(props.maxBet * percentage))
  emit('betChanged', amount)
}

function setMaxBet() {
  if (props.isDisabled) return
  emit('betChanged', props.maxBet)
}
</script>

<style scoped>
/* Custom input styling */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Animation for side selection */
.side-button:not(:disabled):hover .coin-preview {
  transform: scale(1.1);
}

.side-button:not(:disabled):active .coin-preview {
  transform: scale(0.95);
}

/* Pulse animation for selected side */
.side-button.bg-gradient-to-br .coin-preview {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style> 