import { ref, computed, watch, readonly } from 'vue'
import { useTonWallet } from './useTonWallet'

export interface GameResult {
  id: string
  timestamp: Date
  selectedSide: 'heads' | 'tails'
  result: 'heads' | 'tails'
  betAmount: number
  won: boolean
  payout: number
}

export interface GameState {
  balance: number
  betAmount: number
  selectedSide: 'heads' | 'tails' | null
  isFlipping: boolean
  lastResult: 'heads' | 'tails' | null
  history: GameResult[]
}

export function useGameState() {
  // Get TON wallet state
  const tonWallet = useTonWallet()
  
  // Reactive game state
  const balance = ref(1000) // Demo mode starting balance
  const betAmount = ref(10) // Default bet
  const selectedSide = ref<'heads' | 'tails' | null>(null)
  const isFlipping = ref(false)
  const lastResult = ref<'heads' | 'tails' | null>(null)
  const history = ref<GameResult[]>([])

  // Game settings
  const minBet = 1
  const maxBet = computed(() => balance.value)
  const payoutMultiplier = 2 // 2x payout for winning
  
  // Game mode
  const isWalletMode = computed(() => tonWallet.isConnected.value)
  const gameMode = computed(() => isWalletMode.value ? 'wallet' : 'demo')

  // Quick bet amounts (percentages of balance)
  const quickBetAmounts = computed(() => [
    Math.max(minBet, Math.floor(balance.value * 0.01)), // 1%
    Math.max(minBet, Math.floor(balance.value * 0.05)), // 5%
    Math.max(minBet, Math.floor(balance.value * 0.1)),  // 10%
    Math.max(minBet, Math.floor(balance.value * 0.25)), // 25%
    Math.max(minBet, Math.floor(balance.value * 0.5)),  // 50%
    balance.value // MAX
  ])

  // Validation
  const canPlaceBet = computed(() => 
    betAmount.value >= minBet && 
    betAmount.value <= balance.value && 
    selectedSide.value !== null &&
    !isFlipping.value
  )

  // Methods
  function selectSide(side: 'heads' | 'tails') {
    if (isFlipping.value) return
    selectedSide.value = side
  }

  function setBetAmount(amount: number) {
    if (isFlipping.value) return
    betAmount.value = Math.max(minBet, Math.min(amount, balance.value))
  }

  function setQuickBet(percentage: number) {
    const amount = Math.max(minBet, Math.floor(balance.value * percentage))
    setBetAmount(amount)
  }

  function setMaxBet() {
    setBetAmount(balance.value)
  }

  // Cryptographically secure random coin flip
  function getRandomResult(): 'heads' | 'tails' {
    // Use crypto.getRandomValues for better randomness
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] % 2 === 0 ? 'heads' : 'tails'
  }

  async function flipCoin(): Promise<void> {
    if (!canPlaceBet.value) return

    // Start flipping animation
    isFlipping.value = true
    
    // Generate random result
    const result = getRandomResult()
    
    // Simulate coin flip duration (for animation)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Complete the flip
    completeFlip(result)
  }

  function completeFlip(result: 'heads' | 'tails') {
    if (!selectedSide.value) return

    const won = result === selectedSide.value
    const payout = won ? betAmount.value * payoutMultiplier : -betAmount.value

    // Create game result
    const gameResult: GameResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      selectedSide: selectedSide.value,
      result,
      betAmount: betAmount.value,
      won,
      payout
    }

    // Update balance
    balance.value += payout

    // Add to history (keep last 50 results)
    history.value.unshift(gameResult)
    if (history.value.length > 50) {
      history.value = history.value.slice(0, 50)
    }

    // Update last result
    lastResult.value = result

    // Reset game state
    isFlipping.value = false
    selectedSide.value = null

    // Ensure bet amount doesn't exceed new balance
    if (betAmount.value > balance.value) {
      betAmount.value = Math.max(minBet, balance.value)
    }
  }

  // Statistics
  const stats = computed(() => {
    const totalGames = history.value.length
    const totalWins = history.value.filter(game => game.won).length
    const totalLosses = totalGames - totalWins
    const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0
    const totalWagered = history.value.reduce((sum, game) => sum + game.betAmount, 0)
    const totalPayout = history.value.reduce((sum, game) => sum + (game.won ? game.payout : 0), 0)
    const netProfit = history.value.reduce((sum, game) => sum + game.payout, 0)

    return {
      totalGames,
      totalWins,
      totalLosses,
      winRate,
      totalWagered,
      totalPayout,
      netProfit
    }
  })

  // Reset game (for testing or new session)
  function resetGame() {
    balance.value = 1000
    betAmount.value = 10
    selectedSide.value = null
    isFlipping.value = false
    lastResult.value = null
    history.value = []
  }

  // Auto-save to localStorage (client-side only)
  function saveGameState() {
    if (typeof window === 'undefined') return
    
    try {
      const gameState = {
        balance: balance.value,
        history: history.value
      }
      localStorage.setItem('coinFlipGameState', JSON.stringify(gameState))
    } catch (error) {
      console.warn('Failed to save game state to localStorage')
    }
  }

  function loadGameState() {
    if (typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem('coinFlipGameState')
      if (saved) {
        const gameState = JSON.parse(saved)
        balance.value = gameState.balance || 1000
        history.value = gameState.history || []
      }
    } catch (error) {
      console.warn('Failed to load game state from localStorage')
    }
  }

  // Initialize game state (client-side only)
  if (typeof window !== 'undefined') {
    loadGameState()
    
    // Auto-save on balance changes
    watch(balance, saveGameState)
    watch(history, saveGameState, { deep: true })
  }

  return {
    // State
    balance: readonly(balance),
    betAmount: readonly(betAmount),
    selectedSide: readonly(selectedSide),
    isFlipping: readonly(isFlipping),
    lastResult: readonly(lastResult),
    history: readonly(history),
    
    // Computed
    canPlaceBet,
    quickBetAmounts,
    stats,
    minBet,
    maxBet,
    isWalletMode,
    gameMode,
    
    // TON Wallet integration
    tonWallet,
    
    // Methods
    selectSide,
    setBetAmount,
    setQuickBet,
    setMaxBet,
    flipCoin,
    completeFlip,
    resetGame
  }
} 