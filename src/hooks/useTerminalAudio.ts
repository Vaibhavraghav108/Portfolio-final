import { useCallback } from 'react';

export function useTerminalAudio() {
  const playSound = useCallback((type: 'keypress' | 'enter' | 'error') => {
    try {
      const audio = new Audio(`/sounds/${type}.wav`);
      // Use low volume to make it subtle
      audio.volume = type === 'error' ? 0.4 : 0.2;
      audio.play().catch(e => {
        // Ignore auto-play blocking errors or missing file errors
        console.warn(`Audio playback failed for ${type}:`, e.message);
      });
    } catch (err) {
      // Ignore errors
    }
  }, []);

  return { playSound };
}
