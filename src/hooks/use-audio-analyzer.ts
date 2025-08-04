import { useRef, useCallback } from 'react';

export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private animationId: number | null = null;

  async initialize(stream: MediaStream): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);
    } catch (error) {
      console.error('Error initializing audio analyzer:', error);
      throw error;
    }
  }

  startAnalysis(callback: (data: { intensity: number; harmonics: number[]; resonance: number }) => void): void {
    if (!this.analyser || !this.dataArray) return;

    const analyze = () => {
      this.analyser!.getByteFrequencyData(this.dataArray!);
      
      // Calculate intensity (average volume)
      const intensity = this.dataArray!.reduce((sum, value) => sum + value, 0) / (this.dataArray!.length * 255);
      
      // Calculate harmonics (different frequency bands)
      const bandSize = Math.floor(this.dataArray!.length / 5);
      const harmonics = [];
      for (let i = 0; i < 5; i++) {
        const start = i * bandSize;
        const end = start + bandSize;
        const bandData = this.dataArray!.slice(start, end);
        const bandAvg = bandData.reduce((sum, value) => sum + value, 0) / (bandData.length * 255);
        harmonics.push(bandAvg);
      }
      
      // Calculate resonance (spectral centroid approximation)
      let weightedSum = 0;
      let magnitudeSum = 0;
      for (let i = 0; i < this.dataArray!.length; i++) {
        weightedSum += i * this.dataArray![i];
        magnitudeSum += this.dataArray![i];
      }
      const resonance = magnitudeSum > 0 ? (weightedSum / magnitudeSum) / this.dataArray!.length : 0;
      
      callback({ intensity, harmonics, resonance });
      this.animationId = requestAnimationFrame(analyze);
    };

    analyze();
  }

  stopAnalysis(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  cleanup(): void {
    this.stopAnalysis();
    if (this.microphone) {
      this.microphone.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export const useAudioAnalyzer = () => {
  const analyzerRef = useRef<AudioAnalyzer | null>(null);

  const startAnalysis = useCallback(async (
    stream: MediaStream,
    callback: (data: { intensity: number; harmonics: number[]; resonance: number }) => void
  ) => {
    try {
      analyzerRef.current = new AudioAnalyzer();
      await analyzerRef.current.initialize(stream);
      analyzerRef.current.startAnalysis(callback);
    } catch (error) {
      console.error('Failed to start audio analysis:', error);
      throw error;
    }
  }, []);

  const stopAnalysis = useCallback(() => {
    if (analyzerRef.current) {
      analyzerRef.current.cleanup();
      analyzerRef.current = null;
    }
  }, []);

  return { startAnalysis, stopAnalysis };
};