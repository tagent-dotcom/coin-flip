import { ref, computed, onMounted, onUnmounted } from 'vue'
import { TonConnectUI, type Wallet } from '@tonconnect/ui'

export interface TonWalletState {
  isConnected: boolean
  wallet: Wallet | null
  address: string | null
  balance: string | null
  isConnecting: boolean
}

// Global singleton to prevent multiple instances
let globalTonConnectUI: any = null

export function useTonWallet() {
  // Reactive state
  const isConnected = ref(false)
  const wallet = ref<Wallet | null>(null)
  const address = ref<string | null>(null)
  const balance = ref<string | null>(null)
  const isConnecting = ref(false)
  const tonConnectUI = ref<TonConnectUI | null>(null)

  // Initialize TON Connect UI
  const initTonConnect = async () => {
    if (typeof window === 'undefined') return

    try {
      console.log('Initializing TON Connect...')
      
      // Use existing global instance if available
      if (globalTonConnectUI) {
        console.log('Using existing TON Connect UI instance')
        tonConnectUI.value = globalTonConnectUI
      } else {
        console.log('Creating new TON Connect UI instance')
        tonConnectUI.value = new TonConnectUI({
          manifestUrl: window.location.origin + '/tonconnect-manifest.json'
        })
        globalTonConnectUI = tonConnectUI.value
      }

      console.log('TON Connect UI ready:', tonConnectUI.value)

      // Set up event listeners
      const unsubscribe = tonConnectUI.value?.onStatusChange((walletData) => {
        console.log('Wallet status changed:', walletData)
        if (walletData) {
          isConnected.value = true
          wallet.value = walletData
          address.value = walletData.account.address
          console.log('Wallet connected:', walletData)
        } else {
          isConnected.value = false
          wallet.value = null
          address.value = null
          balance.value = null
          console.log('Wallet disconnected')
        }
        isConnecting.value = false
      })

      // Check if wallet is already connected
      const currentWallet = tonConnectUI.value?.wallet
      if (currentWallet) {
        isConnected.value = true
        wallet.value = currentWallet
        address.value = currentWallet.account.address
        console.log('Found existing wallet connection:', currentWallet)
      }
      
      console.log('TON Connect initialized successfully')
    } catch (error) {
      console.error('Failed to initialize TON Connect:', error)
      isConnecting.value = false
      
      // If it's a "already defined" error, try to use the existing instance
      if (error instanceof Error && error.message.includes('already been used')) {
        console.log('Custom element already defined, attempting to reuse...')
        // Try to find existing TON Connect UI in the DOM
        const existingRoot = document.querySelector('tc-root')
        if (existingRoot && globalTonConnectUI) {
          tonConnectUI.value = globalTonConnectUI
          console.log('Reused existing TON Connect UI')
        }
      }
    }
  }

  // Connect wallet
  const connectWallet = async () => {
    console.log('Connect wallet clicked')
    console.log('TON Connect UI:', tonConnectUI.value)
    console.log('Is connecting:', isConnecting.value)
    
    if (!tonConnectUI.value) {
      console.log('TON Connect UI not initialized, attempting to initialize...')
      await initTonConnect()
      if (!tonConnectUI.value) {
        console.error('Failed to initialize TON Connect UI')
        return
      }
    }

    if (isConnecting.value) {
      console.log('Already connecting, skipping...')
      return
    }

    try {
      isConnecting.value = true
      console.log('Opening TON Connect modal...')
      await tonConnectUI.value?.openModal()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      isConnecting.value = false
    }
  }

  // Disconnect wallet
  const disconnectWallet = async () => {
    if (!tonConnectUI.value) return

    try {
      await tonConnectUI.value.disconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  // Get formatted address
  const formattedAddress = computed(() => {
    if (!address.value) return null
    const addr = address.value
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`
  })

  // Get wallet type
  const walletType = computed(() => {
    return wallet.value?.device.appName || 'Unknown'
  })

  // Cleanup
  const cleanup = () => {
    // Don't destroy the global instance, just clear the local reference
    tonConnectUI.value = null
  }

  // Lifecycle hooks
  onMounted(() => {
    initTonConnect()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    // State
    isConnected,
    wallet,
    address,
    balance,
    isConnecting,
    formattedAddress,
    walletType,

    // Methods
    connectWallet,
    disconnectWallet,
    initTonConnect
  }
} 