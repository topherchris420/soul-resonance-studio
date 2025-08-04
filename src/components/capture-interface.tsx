import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SoulPrint } from "@/components/ui/soul-print";
import { Mic, Camera, Square, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isCapturing) {
      // Simulate real-time biometric data updates
      const interval = setInterval(() => {
        setBiometricData(prev => ({
          intensity: Math.max(0.1, Math.min(1, prev.intensity + (Math.random() - 0.5) * 0.2)),
          harmonics: prev.harmonics.map(h => Math.max(0.1, Math.min(1, h + (Math.random() - 0.5) * 0.3))),
          resonance: Math.max(0.1, Math.min(1, prev.resonance + (Math.random() - 0.5) * 0.15))
        }));
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isCapturing]);

  const startCapture = async () => {
    try {
      let stream: MediaStream;
      
      if (captureMode === 'audio') {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        toast("Capturing biometric resonance through voice patterns...");
      } else if (captureMode === 'video') {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        toast("Analyzing facial harmonics and vocal patterns...");
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        toast("Detecting ambient rhythmic patterns...");
      }
      
      streamRef.current = stream;
      setIsCapturing(true);
    } catch (error) {
      toast.error("Unable to access biometric sensors. Using simulated resonance data.");
      setIsCapturing(true);
    }
  };

  const stopCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
    
    // Generate Soul Print from captured data
    const soulPrint = {
      id: Date.now().toString(),
      timestamp: new Date(),
      biometricData,
      visualSignature: generateVisualSignature(),
      audioSignature: generateAudioSignature()
    };
    
    onSoulPrintGenerated?.(soulPrint);
    toast.success("Soul Print captured! Your biometric resonance has been crystallized.");
  };

  const generateVisualSignature = () => {
    return {
      primaryHue: Math.floor(biometricData.intensity * 360),
      saturation: biometricData.resonance,
      complexity: biometricData.harmonics.reduce((a, b) => a + b) / biometricData.harmonics.length,
      patterns: biometricData.harmonics
    };
  };

  const generateAudioSignature = () => {
    return {
      baseFrequency: 220 + biometricData.intensity * 220,
      harmonicSeries: biometricData.harmonics.map(h => h * 880),
      resonanceDepth: biometricData.resonance,
      rhythmPattern: biometricData.harmonics
    };
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12 text-center">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-6xl font-thin text-foreground tracking-wider">
            Aethel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Breathe into the cosmic resonance. Let your biometric essence 
            become art, sound, and infinite expression.
          </p>
        </div>

        {/* Capture Mode Selection */}
        <div className="flex justify-center gap-4">
          {[
            { mode: 'audio' as const, icon: Mic, label: 'Voice Resonance' },
            { mode: 'video' as const, icon: Camera, label: 'Facial Harmonics' },
            { mode: 'ambient' as const, icon: Play, label: 'Ambient Rhythms' }
          ].map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              variant={captureMode === mode ? "default" : "outline"}
              onClick={() => setCaptureMode(mode)}
              disabled={isCapturing}
              className={cn(
                "px-8 py-6 text-lg transition-all duration-500",
                captureMode === mode && "shadow-glow-primary bg-gradient-soul"
              )}
            >
              <Icon className="w-6 h-6 mr-3" />
              {label}
            </Button>
          ))}
        </div>

        {/* Soul Print Visualization */}
        <div className="flex flex-col items-center space-y-8">
          <SoulPrint
            isActive={isCapturing}
            intensity={biometricData.intensity}
            harmonics={biometricData.harmonics}
            className="scale-150"
          />
          
          {isCapturing && (
            <div className="space-y-4 text-center">
              <div className="text-sm text-muted-foreground font-mono">
                Intensity: {(biometricData.intensity * 100).toFixed(1)}% | 
                Resonance: {(biometricData.resonance * 100).toFixed(1)}%
              </div>
              <div className="flex justify-center gap-2">
                {biometricData.harmonics.map((harmonic, index) => (
                  <div
                    key={index}
                    className="w-2 h-8 bg-gradient-soul rounded-full opacity-70"
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
          <div className="flex justify-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-96 h-72 rounded-2xl border border-border/20 shadow-cosmic"
            />
          </div>
        )}

        {/* Capture Controls */}
        <div className="flex justify-center gap-6">
          {!isCapturing ? (
            <Button
              onClick={startCapture}
              size="lg"
              className="px-12 py-6 text-xl bg-gradient-soul hover:shadow-glow-primary transition-all duration-500"
            >
              <Play className="w-8 h-8 mr-4" />
              Begin Resonance Capture
            </Button>
          ) : (
            <Button
              onClick={stopCapture}
              size="lg"
              variant="destructive"
              className="px-12 py-6 text-xl transition-all duration-500"
            >
              <Square className="w-8 h-8 mr-4" />
              Crystallize Soul Print
            </Button>
          )}
        </div>

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