import * as Tone from 'tone';
import { useRef, useCallback } from 'react';

export class SoundSynthesizer {
  private synths: Tone.Synth[] = [];
  private reverb: Tone.Reverb | null = null;
  private filter: Tone.Filter | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Tone.start();
      
      // Create reverb effect
      this.reverb = new Tone.Reverb({
        decay: 8,
        wet: 0.3
      });
      
      // Create filter
      this.filter = new Tone.Filter({
        frequency: 800,
        type: "lowpass",
        rolloff: -24
      });
      
      // Create multiple synths for harmony
      for (let i = 0; i < 5; i++) {
        const synth = new Tone.Synth({
          oscillator: {
            type: "sine"
          },
          envelope: {
            attack: 0.1,
            decay: 0.3,
            sustain: 0.7,
            release: 1.2
          }
        });
        
        synth.chain(this.filter, this.reverb, Tone.Destination);
        this.synths.push(synth);
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing sound synthesizer:', error);
      throw error;
    }
  }

  playBiometricSounds(biometricData: {
    intensity: number;
    harmonics: number[];
    resonance: number;
  }): void {
    if (!this.isInitialized || this.synths.length === 0) return;

    try {
      // Base frequency based on intensity
      const baseFreq = 220 + (biometricData.intensity * 220);
      
      // Update filter based on resonance
      if (this.filter) {
        this.filter.frequency.value = 400 + (biometricData.resonance * 1200);
      }
      
      // Play harmonic series based on biometric data
      biometricData.harmonics.forEach((harmonic, index) => {
        if (harmonic > 0.1 && index < this.synths.length) {
          const frequency = baseFreq * (index + 1) * 0.5;
          const volume = (harmonic * biometricData.intensity) - 60; // Convert to dB
          
          this.synths[index].volume.value = Math.max(-40, volume);
          
          // Trigger note with slight delay for organic feel
          setTimeout(() => {
            this.synths[index].triggerAttackRelease(frequency, "8n");
          }, index * 50);
        }
      });
    } catch (error) {
      console.error('Error playing biometric sounds:', error);
    }
  }

  playAmbientSounds(): void {
    if (!this.isInitialized) return;

    try {
      // Create ambient drone
      const ambientSynth = new Tone.Synth({
        oscillator: { type: "sawtooth" },
        envelope: { attack: 2, decay: 0, sustain: 1, release: 2 }
      });
      
      ambientSynth.chain(this.reverb, Tone.Destination);
      ambientSynth.volume.value = -20;
      
      // Play atmospheric chord
      const chord = ["C3", "E3", "G3", "B3"];
      chord.forEach((note, index) => {
        setTimeout(() => {
          ambientSynth.triggerAttackRelease(note, "4n");
        }, index * 200);
      });
      
      // Clean up after playing
      setTimeout(() => {
        ambientSynth.dispose();
      }, 5000);
    } catch (error) {
      console.error('Error playing ambient sounds:', error);
    }
  }

  generateSoulPrintAudio(soulPrint: any): void {
    if (!this.isInitialized) return;

    try {
      const { biometricData } = soulPrint;
      
      // Create a sequence based on the soul print
      const sequence = new Tone.Sequence((time, note) => {
        if (this.synths[0]) {
          this.synths[0].triggerAttackRelease(note, "8n", time);
        }
      }, ["C4", "E4", "G4", "C5"], "4n");
      
      // Modulate the sequence based on biometric data
      sequence.start(0);
      Tone.Transport.start();
      
      // Stop after 3 seconds
      setTimeout(() => {
        sequence.stop();
        sequence.dispose();
        Tone.Transport.stop();
      }, 3000);
    } catch (error) {
      console.error('Error generating soul print audio:', error);
    }
  }

  cleanup(): void {
    try {
      this.synths.forEach(synth => synth.dispose());
      this.reverb?.dispose();
      this.filter?.dispose();
      this.synths = [];
      this.reverb = null;
      this.filter = null;
      this.isInitialized = false;
    } catch (error) {
      console.error('Error cleaning up synthesizer:', error);
    }
  }
}

export const useSoundSynthesizer = () => {
  const synthRef = useRef<SoundSynthesizer | null>(null);

  const initializeSynth = useCallback(async () => {
    if (!synthRef.current) {
      synthRef.current = new SoundSynthesizer();
      await synthRef.current.initialize();
    }
    return synthRef.current;
  }, []);

  const playBiometricSounds = useCallback((biometricData: any) => {
    synthRef.current?.playBiometricSounds(biometricData);
  }, []);

  const playAmbientSounds = useCallback(() => {
    synthRef.current?.playAmbientSounds();
  }, []);

  const generateSoulPrintAudio = useCallback((soulPrint: any) => {
    synthRef.current?.generateSoulPrintAudio(soulPrint);
  }, []);

  const cleanup = useCallback(() => {
    synthRef.current?.cleanup();
    synthRef.current = null;
  }, []);

  return {
    initializeSynth,
    playBiometricSounds,
    playAmbientSounds,
    generateSoulPrintAudio,
    cleanup
  };
};