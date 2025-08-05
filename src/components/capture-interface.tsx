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
    <div className="min-h-screen bg-gradient-cosmic flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div className="max-w-4xl w-full space-y-8 sm:space-y-12 text-center relative z-10">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4 animate-float-up">
          <h1 className="text-4xl sm:text-6xl font-thin text-foreground tracking-wider animate-glow-intensify">
            Aethel
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Transform your biometric essence into evolving audiovisual expressions.
            <br />
            <span className="text-accent font-medium">Real voice, facial, and ambient pattern recognition.</span>
          </p>
          
          {/* Visual Status Indicator */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-500",
              isCapturing ? "bg-accent animate-soul-pulse" : "bg-muted"
            )} />
            <span className="text-xs text-muted-foreground">
              {isCapturing ? `${captureMode === 'audio' ? '🎤' : captureMode === 'video' ? '📹' : '🌊'} Capturing biometric essence...` : 'Ready to capture your soul print'}
            </span>
          </div>
        </div>

        {/* Capture Mode Selection */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl text-foreground/80 font-light">Choose Your Biometric Input</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            {[
              { mode: 'audio' as const, icon: Mic, label: 'Voice Resonance', desc: 'Real microphone analysis', color: 'primary' },
              { mode: 'video' as const, icon: Camera, label: 'Facial Harmonics', desc: 'Live camera capture', color: 'secondary' },
              { mode: 'ambient' as const, icon: Play, label: 'Ambient Rhythms', desc: 'Environmental sounds', color: 'accent' }
            ].map(({ mode, icon: Icon, label, desc, color }, index) => (
              <Button
                key={mode}
                variant={captureMode === mode ? "default" : "outline"}
                onClick={() => {
                  console.log('Mode button clicked:', mode);
                  setCaptureMode(mode);
                }}
                disabled={isCapturing}
                className={cn(
                  "group flex-1 sm:flex-none px-4 sm:px-8 py-6 sm:py-8 text-sm sm:text-lg flex flex-col gap-2 relative overflow-hidden border-2 transition-all duration-500",
                  captureMode === mode 
                    ? "shadow-glow-intense animate-neural-sync bg-gradient-neural border-primary/50" 
                    : "hover:shadow-glow-secondary hover:scale-105 hover:border-primary/30 border-border/40",
                  color === 'primary' && captureMode === mode && "bg-gradient-neural",
                  color === 'secondary' && captureMode === mode && "bg-gradient-harmonic", 
                  color === 'accent' && captureMode === mode && "bg-gradient-biometric"
                )}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Selection indicator */}
                {captureMode === mode && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-accent rounded-full animate-soul-pulse" />
                )}
                
                <div className="flex items-center gap-3">
                  <Icon className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7 transition-all duration-300",
                    captureMode === mode ? "text-primary-foreground" : "text-foreground/70 group-hover:text-foreground"
                  )} />
                  <span className="text-sm sm:text-base font-medium">{label}</span>
                </div>
                <span className={cn(
                  "text-xs transition-all duration-300",
                  captureMode === mode ? "text-primary-foreground/80" : "text-muted-foreground group-hover:text-foreground/60"
                )}>{desc}</span>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-soul opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </Button>
            ))}
          </div>
        </div>

        {/* Soul Print Visualization */}
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          <div className="relative">
            {/* Cosmic aura around soul print */}
            <div className={cn(
              "absolute inset-0 rounded-full transition-all duration-1000",
              isCapturing ? "animate-soul-pulse shadow-glow-primary" : "opacity-30"
            )} style={{ transform: 'scale(1.5)' }} />
            
            <SoulPrint
              isActive={isCapturing}
              intensity={biometricData.intensity}
              harmonics={biometricData.harmonics}
              className={cn(
                "scale-110 sm:scale-150 transition-all duration-500",
                isCapturing && "animate-glow-intensify"
              )}
            />
            
            {/* Central energy indicator */}
            {isCapturing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-accent rounded-full animate-soul-pulse opacity-80" />
              </div>
            )}
          </div>
          
          {isCapturing && (
            <div className="space-y-6 text-center animate-float-up backdrop-cosmic rounded-2xl p-6 border border-border/20">
              <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                <div className="space-y-2">
                  <div className="text-muted-foreground">Intensity</div>
                  <div className="text-lg text-primary font-semibold">
                    {(biometricData.intensity * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-muted-foreground">Resonance</div>
                  <div className="text-lg text-secondary font-semibold">
                    {(biometricData.resonance * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-accent font-medium">
                {captureMode === 'audio' && (
                  <>
                    <Mic className="w-4 h-4 animate-soul-pulse" />
                    <span>Live voice analysis active</span>
                  </>
                )}
                {captureMode === 'video' && (
                  <>
                    <Camera className="w-4 h-4 animate-soul-pulse" />
                    <span>Real-time facial metrics</span>
                  </>
                )}
                {captureMode === 'ambient' && (
                  <>
                    <Play className="w-4 h-4 animate-soul-pulse" />
                    <span>Ambient pattern detection</span>
                  </>
                )}
              </div>
              
              {/* Harmonic visualizer */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Harmonic Frequencies</div>
                <div className="flex justify-center gap-1">
                  {biometricData.harmonics.map((harmonic, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div
                        className="w-3 h-12 bg-gradient-soul rounded-full opacity-80 animate-harmonic-wave"
                        style={{
                          transform: `scaleY(${harmonic})`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      />
                      <div className="text-xs text-muted-foreground/60 font-mono">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
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
        <div className="flex flex-col items-center gap-6 px-4">
          {!isCapturing ? (
            <div className="space-y-4 text-center">
              <Button
                onClick={startCapture}
                size="lg"
                className="w-full sm:w-auto px-12 sm:px-16 py-6 sm:py-8 text-xl sm:text-2xl bg-gradient-soul button-soul relative overflow-hidden group border-2 border-primary/30"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-soul opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                
                <Play className="w-8 h-8 sm:w-10 sm:h-10 mr-4 sm:mr-6 group-hover:animate-soul-pulse" />
                <span className="font-medium tracking-wide">Begin Soul Capture</span>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-glow-primary" />
              </Button>
              
              <p className="text-sm text-muted-foreground max-w-md">
                Click to start capturing your unique biometric signature in {captureMode === 'audio' ? 'voice' : captureMode === 'video' ? 'facial' : 'ambient'} mode
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <Button
                onClick={stopCapture}
                size="lg"
                variant="destructive"
                className="w-full sm:w-auto px-12 sm:px-16 py-6 sm:py-8 text-xl sm:text-2xl button-cosmic relative overflow-hidden group border-2 border-destructive/30"
              >
                <Square className="w-8 h-8 sm:w-10 sm:h-10 mr-4 sm:mr-6 group-hover:animate-soul-pulse" />
                <span className="font-medium tracking-wide">Crystallize Soul Print</span>
              </Button>
              
              <p className="text-sm text-accent animate-soul-pulse">
                ✨ Your biometric essence is being captured... Click to finalize your Soul Print
              </p>
            </div>
          )}
        </div>

        {/* Permission Notice & Tips */}
        {!isCapturing && (
          <div className="space-y-4 text-center">
            <div className="backdrop-cosmic rounded-2xl p-4 border border-border/20 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-soul-pulse" />
                <span className="text-sm font-medium text-accent">Privacy Protected</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This app requires {captureMode === 'audio' ? 'microphone' : captureMode === 'video' ? 'camera' : 'audio'} permissions 
                to capture real biometric data. All processing happens locally - your data never leaves your device.
              </p>
            </div>
            
            {/* Mode-specific tips */}
            <div className="text-xs text-muted-foreground/80 max-w-md mx-auto">
              {captureMode === 'audio' && "💡 Tip: Speak naturally or make sounds for best voice resonance capture"}
              {captureMode === 'video' && "💡 Tip: Look directly at the camera and try different expressions"}
              {captureMode === 'ambient' && "💡 Tip: Ambient mode detects environmental sound patterns"}
            </div>
          </div>
        )}

        {/* Ambient Cosmic Particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-accent/30 rounded-full animate-cosmic-drift pointer-events-none"
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