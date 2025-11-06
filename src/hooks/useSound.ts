import { useCallback, useRef } from 'react';

type SoundType = 'levelUp' | 'taskComplete' | 'phaseChange';

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const playSound = useCallback((type: SoundType) => {
    try {
      // Initialize Web Audio API context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      
      switch (type) {
        case 'levelUp':
          playLevelUpSound(ctx);
          break;
        case 'taskComplete':
          playTaskCompleteSound(ctx);
          break;
        case 'phaseChange':
          playPhaseChangeSound(ctx);
          break;
      }
    } catch (error) {
      console.error('Sound playback error:', error);
    }
  }, []);
  
  return { playSound };
}

// Epic ascending arpeggio for level up (C4→E4→G4→C5)
function playLevelUpSound(ctx: AudioContext) {
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
  const now = ctx.currentTime;
  
  notes.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    
    const startTime = now + i * 0.15;
    const duration = 0.2;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  });
}

// Two-tone bell for task complete (E5→C5)
function playTaskCompleteSound(ctx: AudioContext) {
  const notes = [659.25, 523.25]; // E5, C5
  const now = ctx.currentTime;
  
  notes.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    
    const startTime = now + i * 0.12;
    const duration = 0.15;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  });
}

// Descending sweep for phase change
function playPhaseChangeSound(ctx: AudioContext) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  const now = ctx.currentTime;
  const duration = 0.5;
  
  oscillator.frequency.setValueAtTime(1000, now);
  oscillator.frequency.exponentialRampToValueAtTime(400, now + duration);
  oscillator.type = 'sawtooth';
  
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
  
  oscillator.start(now);
  oscillator.stop(now + duration);
}
