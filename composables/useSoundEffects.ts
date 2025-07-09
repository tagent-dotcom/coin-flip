import { ref } from 'vue'

export function useSoundEffects() {
  const soundEnabled = ref(true)
  const volume = ref(0.5)

  // Create audio context for better control
  let audioContext: AudioContext | null = null

  const initAudioContext = () => {
    if (!audioContext && typeof window !== 'undefined') {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  // Generate coin flip sound using Web Audio API
  const playCoinFlipSound = () => {
    if (!soundEnabled.value) return
    initAudioContext()
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Create a metallic coin sound
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1)
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2)
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.4)
    
    gainNode.gain.setValueAtTime(volume.value * 0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  // Generate win sound
  const playWinSound = () => {
    if (!soundEnabled.value) return
    initAudioContext()
    if (!audioContext) return

    // Play multiple tones for a victory fanfare
    const frequencies = [523, 659, 784, 1047] // C, E, G, C
    
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = audioContext!.createOscillator()
        const gainNode = audioContext!.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext!.destination)
        
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(freq, audioContext!.currentTime)
        
        gainNode.gain.setValueAtTime(volume.value * 0.4, audioContext!.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext!.currentTime + 0.3)
        
        oscillator.start(audioContext!.currentTime)
        oscillator.stop(audioContext!.currentTime + 0.3)
      }, index * 100)
    })
  }

  // Generate lose sound
  const playLoseSound = () => {
    if (!soundEnabled.value) return
    initAudioContext()
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Descending tone for disappointment
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.8)
    
    gainNode.gain.setValueAtTime(volume.value * 0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.8)
  }

  // Generate button click sound
  const playClickSound = () => {
    if (!soundEnabled.value) return
    initAudioContext()
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05)
    
    gainNode.gain.setValueAtTime(volume.value * 0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  // Generate hover sound for buttons
  const playHoverSound = () => {
    if (!soundEnabled.value) return
    initAudioContext()
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(volume.value * 0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.05)
  }

  // Control functions
  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value
  }

  const setVolume = (newVolume: number) => {
    volume.value = Math.max(0, Math.min(1, newVolume))
  }

  return {
    soundEnabled,
    volume,
    playCoinFlipSound,
    playWinSound,
    playLoseSound,
    playClickSound,
    playHoverSound,
    toggleSound,
    setVolume
  }
} 