import { useCallback, useRef } from 'react';

export function useTerminalAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playSound = useCallback((type: 'keypress' | 'enter' | 'error') => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Quick clicky noise
      osc.type = 'square';
      if (type === 'enter') {
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.05);
      } else if (type === 'error') {
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
      } else {
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.03);
      }

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(type === 'error' ? 0.3 : 0.05, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (type === 'enter' ? 0.1 : 0.05));

      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.1);
    } catch (err) {
      // Ignore audio generation errors
    }
  }, [initAudio]);

  return { playSound };
}
