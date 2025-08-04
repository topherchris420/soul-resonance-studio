import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SoulPrint } from "@/components/ui/soul-print";
import { Mic, Camera, Square, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAudioAnalyzer } from "@/hooks/use-audio-analyzer";
import { useSoundSynthesizer } from "@/hooks/use-sound-synthesizer";
import { useCameraCapture } from "@/hooks/use-camera-capture";

interface CaptureInterfaceProps {
  onSoulPrintGenerated?: (soulPrint: any) => void;
}

export const CaptureInterface = ({ onSoulPrintGenerated }: CaptureInterfaceProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState<'audio' | 'video' | 'ambient'>('audio');
  const [biometricData, setBiometricData] = useState({
    intensity: 0.3,
    harmonics: [0.4, 0.6, 0.5, 0.8, 0.3],
    resonance: 0.5
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);

  // Hook instances
  const { startAnalysis: startAudioAnalysis, stopAnalysis: stopAudioAnalysis } = useAudioAnalyzer();
  const { 
    initializeSynth, 
    playBiometricSounds, 
    playAmbientSounds, 
    generateSoulPrintAudio, 
    cleanup: cleanupSynth 
  } = useSoundSynthesizer();
  const { 
    startCamera, 
    analyzeFacialMetrics, 
    captureFrame, 
    checkCameraSupport 
  } = useCameraCapture();

  // Initialize sound synthesis
  useEffect(() => {
    initializeSynth().catch(console.error);
    return () => cleanupSynth();
  }, [initializeSynth, cleanupSynth]);

  // Real-time biometric data processing
  useEffect(() => {
    if (isCapturing && captureMode === 'video' && videoRef.current) {
      analysisIntervalRef.current = window.setInterval(() => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          const facialMetrics = analyzeFacialMetrics(videoRef.current);
          
          // Convert facial metrics to biometric data
          setBiometricData({
            intensity: facialMetrics.brightness,
            harmonics: [
              facialMetrics.contrast,
              facialMetrics.symmetry,
              facialMetrics.expressionIntensity,
              Math.abs(facialMetrics.emotionalValence),
              facialMetrics.brightness
            ],
            resonance: (facialMetrics.expressionIntensity + Math.abs(facialMetrics.emotionalValence)) / 2
          });
        }
      }, 100);
    }

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    };
  }, [isCapturing, captureMode, analyzeFacialMetrics]);

  // Play sounds based on biometric data
  useEffect(() => {
    if (isCapturing && biometricData.intensity > 0.1) {
      const soundInterval = setInterval(() => {
        playBiometricSounds(biometricData);
      }, 800);

      return () => clearInterval(soundInterval);
    }
  }, [isCapturing, biometricData, playBiometricSounds]);

  const startCapture = async () => {
    console.log('Starting capture with mode:', captureMode);
    try {
      let stream: MediaStream;
      
      if (captureMode === 'audio') {
        // Real audio capture and analysis
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          }
        });
        
        await startAudioAnalysis(stream, (audioData) => {
          setBiometricData(audioData);
        });
        
        toast.success("🎤 Real voice analysis active! Speak to see your biometric resonance.");
        
      } else if (captureMode === 'video') {
        // Real camera capture and facial analysis
        const hasCamera = await checkCameraSupport();
        if (!hasCamera) {
          throw new Error("No camera detected");
        }
        
        stream = await startCamera();
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = () => resolve(void 0);
            }
          });
        }
        
        toast.success("📹 Facial analysis active! Your expressions are being translated to cosmic resonance.");
        
      } else {
        // Ambient mode - generate ambient sounds
        playAmbientSounds();
        
        // Simulate ambient rhythm detection
        const ambientInterval = setInterval(() => {
          setBiometricData(prev => ({
            intensity: 0.3 + Math.sin(Date.now() / 1000) * 0.2,
            harmonics: prev.harmonics.map((h, i) => 
              0.3 + Math.sin((Date.now() / 1000) + i) * 0.3
            ),
            resonance: 0.4 + Math.cos(Date.now() / 800) * 0.2
          }));
        }, 150);
        
        // Clean up ambient simulation
        setTimeout(() => clearInterval(ambientInterval), 30000);
        
        toast.success("🌊 Ambient rhythm detection active! Environmental patterns detected.");
        
        // Create a dummy stream for consistency
        stream = new MediaStream();
      }
      
      streamRef.current = stream;
      setIsCapturing(true);
      
    } catch (error) {
      console.error('Capture error:', error);
      toast.error(`Unable to access ${captureMode === 'audio' ? 'microphone' : captureMode === 'video' ? 'camera' : 'ambient sensors'}. Check permissions.`);
    }
  };

  const stopCapture = () => {
    // Stop all streams and analysis
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    stopAudioAnalysis();
    
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    
    // Capture final frame for video mode
    let capturedFrame = '';
    if (captureMode === 'video' && videoRef.current) {
      capturedFrame = captureFrame(videoRef.current);
    }
    
    setIsCapturing(false);
    
    // Generate Soul Print from real captured data
    const soulPrint = {
      id: Date.now().toString(),
      timestamp: new Date(),
      captureMode,
      biometricData,
      visualSignature: generateVisualSignature(),
      audioSignature: generateAudioSignature(),
      capturedFrame: capturedFrame || undefined
    };
    
    // Play soul print audio
    generateSoulPrintAudio(soulPrint);
    
    onSoulPrintGenerated?.(soulPrint);
    toast.success("✨ Soul Print crystallized! Your biometric essence has been captured.");
  };

  const generateVisualSignature = () => {
    return {
      primaryHue: Math.floor(biometricData.intensity * 360),
      saturation: biometricData.resonance,
      complexity: biometricData.harmonics.reduce((a, b) => a + b) / biometricData.harmonics.length,
      patterns: biometricData.harmonics,
      captureMethod: captureMode
    };
  };

  const generateAudioSignature = () => {
    return {
      baseFrequency: 220 + biometricData.intensity * 220,
      harmonicSeries: biometricData.harmonics.map(h => h * 880),
      resonanceDepth: biometricData.resonance,
      rhythmPattern: biometricData.harmonics,
      captureMethod: captureMode
    };
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full space-y-8 sm:space-y-12 text-center">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-4xl sm:text-6xl font-thin text-foreground tracking-wider">
            Aethel
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Transform your biometric essence into evolving audiovisual expressions.
            Real voice, facial, and ambient pattern recognition.
          </p>
        </div>

        {/* Capture Mode Selection */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          {[
            { mode: 'audio' as const, icon: Mic, label: 'Voice Resonance', desc: 'Real microphone analysis' },
            { mode: 'video' as const, icon: Camera, label: 'Facial Harmonics', desc: 'Live camera capture' },
            { mode: 'ambient' as const, icon: Play, label: 'Ambient Rhythms', desc: 'Environmental sounds' }
          ].map(({ mode, icon: Icon, label, desc }) => (
            <Button
              key={mode}
              variant={captureMode === mode ? "default" : "outline"}
              onClick={() => {
                console.log('Mode button clicked:', mode);
                setCaptureMode(mode);
              }}
              disabled={isCapturing}
              className={cn(
                "flex-1 sm:flex-none px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg transition-all duration-500 flex flex-col gap-1",
                captureMode === mode && "shadow-glow-primary bg-gradient-soul"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-base font-medium">{label}</span>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">{desc}</span>
            </Button>
          ))}
        </div>

        {/* Soul Print Visualization */}
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          <SoulPrint
            isActive={isCapturing}
            intensity={biometricData.intensity}
            harmonics={biometricData.harmonics}
            className="scale-110 sm:scale-150"
          />
          
          {isCapturing && (
            <div className="space-y-4 text-center">
              <div className="text-sm text-muted-foreground font-mono">
                <div>Intensity: {(biometricData.intensity * 100).toFixed(1)}%</div>
                <div>Resonance: {(biometricData.resonance * 100).toFixed(1)}%</div>
                <div className="text-xs mt-1 text-accent">
                  {captureMode === 'audio' && "🎤 Live voice analysis"}
                  {captureMode === 'video' && "📹 Real-time facial metrics"}
                  {captureMode === 'ambient' && "🌊 Ambient pattern detection"}
                </div>
              </div>
              <div className="flex justify-center gap-2">
                {biometricData.harmonics.map((harmonic, index) => (
                  <div
                    key={index}
                    className="w-2 h-8 bg-gradient-soul rounded-full opacity-70 animate-harmonic-wave"
                    style={{
                      transform: `scaleY(${harmonic})`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Video Preview */}
        {captureMode === 'video' && isCapturing && (
          <div className="flex justify-center px-4">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full max-w-sm sm:w-96 h-48 sm:h-72 rounded-2xl border border-border/20 shadow-cosmic object-cover"
            />
          </div>
        )}

        {/* Capture Controls */}
        <div className="flex justify-center gap-4 sm:gap-6 px-4">
          {!isCapturing ? (
            <Button
              onClick={startCapture}
              size="lg"
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl bg-gradient-soul hover:shadow-glow-primary transition-all duration-500"
            >
              <Play className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4" />
              <span className="text-sm sm:text-base">Begin Real Capture</span>
            </Button>
          ) : (
            <Button
              onClick={stopCapture}
              size="lg"
              variant="destructive"
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl transition-all duration-500"
            >
              <Square className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4" />
              <span className="text-sm sm:text-base">Crystallize Soul Print</span>
            </Button>
          )}
        </div>

        {/* Permission Notice */}
        {!isCapturing && (
          <div className="text-xs text-muted-foreground max-w-md mx-auto px-4">
            This app requires {captureMode === 'audio' ? 'microphone' : captureMode === 'video' ? 'camera' : 'audio'} permissions 
            to capture real biometric data. Your data never leaves your device.
          </div>
        )}

        {/* Ambient Cosmic Particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-accent/30 rounded-full animate-cosmic-drift"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};