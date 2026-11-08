import { useState, useCallback, useEffect } from 'react';
import { getIsMuted, setIsMuted as persistMuted } from '../services/storageService';

export function useSoundEffects() {
  const [muted, setMutedState] = useState<boolean>(() => getIsMuted());

  useEffect(() => {
    persistMuted(muted);
  }, [muted]);

  const toggleMute = useCallback(() => {
    setMutedState(prev => !prev);
  }, []);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    return new AudioCtx();
  }, []);

  // Cheerful Duolingo-style success chime (C5 -> E5 -> G5 -> C6)
  const playSuccess = useCallback(() => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const startTime = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime + i * 0.08);

        gain.gain.setValueAtTime(0.2, startTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + i * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime + i * 0.08);
        osc.stop(startTime + i * 0.08 + 0.3);
      });
    } catch (e) {
      // Audio autoplay policy can sometimes prevent early play
    }
  }, [muted, getAudioContext]);

  // Gentle Duolingo-style error sound (low bounce)
  const playError = useCallback(() => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.26);
    } catch (e) {}
  }, [muted, getAudioContext]);

  // Satisfying lesson complete fanfare
  const playLessonComplete = useCallback(() => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      const now = ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.9);
      });
    } catch (e) {}
  }, [muted, getAudioContext]);

  // Subtle button click pop
  const playClick = useCallback(() => {
    if (muted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  }, [muted, getAudioContext]);

  return {
    muted,
    toggleMute,
    playSuccess,
    playError,
    playLessonComplete,
    playClick,
  };
}
