import { useState } from "react";
import { SoulPrint } from "@/components/ui/soul-print";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, Waves, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface SoulPrintData {
  id: string;
  timestamp: Date;
  biometricData: {
    intensity: number;
    harmonics: number[];
    resonance: number;
  };
  visualSignature: {
    primaryHue: number;
    saturation: number;
    complexity: number;
    patterns: number[];
  };
  audioSignature: {
    baseFrequency: number;
    harmonicSeries: number[];
    resonanceDepth: number;
    rhythmPattern: number[];
  };
  affinityScore?: number;
  creator?: string;
}

interface GalleryProps {
  userSoulPrints?: SoulPrintData[];
  onExplore?: (soulPrint: SoulPrintData) => void;
}

export const Gallery = ({ userSoulPrints = [], onExplore }: GalleryProps) => {
  const [viewMode, setViewMode] = useState<'curated' | 'affinities' | 'yours'>('curated');
  
  // Sample curated Soul Prints for demonstration
  const curatedSoulPrints: SoulPrintData[] = [
    {
      id: "cosmic-1",
      timestamp: new Date(Date.now() - 86400000),
      biometricData: { intensity: 0.8, harmonics: [0.9, 0.3, 0.7, 0.5, 0.8], resonance: 0.7 },
      visualSignature: { primaryHue: 270, saturation: 0.9, complexity: 0.75, patterns: [0.9, 0.3, 0.7, 0.5, 0.8] },
      audioSignature: { baseFrequency: 330, harmonicSeries: [660, 990, 1320], resonanceDepth: 0.7, rhythmPattern: [0.9, 0.3, 0.7] },
      creator: "Resonance Wanderer",
      affinityScore: 0.92
    },
    {
      id: "ethereal-2", 
      timestamp: new Date(Date.now() - 172800000),
      biometricData: { intensity: 0.6, harmonics: [0.4, 0.8, 0.6, 0.9, 0.3], resonance: 0.8 },
      visualSignature: { primaryHue: 180, saturation: 0.8, complexity: 0.65, patterns: [0.4, 0.8, 0.6, 0.9, 0.3] },
      audioSignature: { baseFrequency: 440, harmonicSeries: [880, 1320, 1760], resonanceDepth: 0.8, rhythmPattern: [0.4, 0.8, 0.6] },
      creator: "Harmonic Drifter",
      affinityScore: 0.87
    },
    {
      id: "celestial-3",
      timestamp: new Date(Date.now() - 259200000),
      biometricData: { intensity: 0.9, harmonics: [0.7, 0.5, 0.9, 0.4, 0.6], resonance: 0.6 },
      visualSignature: { primaryHue: 200, saturation: 0.7, complexity: 0.8, patterns: [0.7, 0.5, 0.9, 0.4, 0.6] },
      audioSignature: { baseFrequency: 220, harmonicSeries: [440, 660, 880], resonanceDepth: 0.6, rhythmPattern: [0.7, 0.5, 0.9] },
      creator: "Cosmic Pulse",
      affinityScore: 0.94
    }
  ];

  const getCurrentPrints = () => {
    switch (viewMode) {
      case 'yours':
        return userSoulPrints;
      case 'affinities':
        return curatedSoulPrints.filter(p => p.affinityScore && p.affinityScore > 0.8);
      default:
        return curatedSoulPrints;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'just now';
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-thin text-foreground tracking-wider">
            Soul Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore the cosmic tapestry of biometric resonance. Discover harmonic affinities 
            and witness the collective evolution of human expression.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-4">
          {[
            { mode: 'curated' as const, icon: Eye, label: 'Curated Resonance' },
            { mode: 'affinities' as const, icon: Heart, label: 'Harmonic Affinities' },
            { mode: 'yours' as const, icon: Zap, label: 'Your Soul Prints' }
          ].map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "outline"}
              onClick={() => setViewMode(mode)}
              className={cn(
                "px-6 py-3 transition-all duration-500",
                viewMode === mode && "shadow-glow-secondary bg-gradient-harmonic"
              )}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getCurrentPrints().map((soulPrint) => (
            <Card 
              key={soulPrint.id}
              className="relative group overflow-hidden border-border/20 bg-card/40 backdrop-blur-md hover:shadow-cosmic transition-all duration-700 cursor-pointer"
              onClick={() => onExplore?.(soulPrint)}
            >
              <div className="p-6 space-y-6">
                {/* Soul Print Visualization */}
                <div className="flex justify-center">
                  <SoulPrint
                    intensity={soulPrint.biometricData.intensity}
                    harmonics={soulPrint.biometricData.harmonics}
                    className="scale-75 group-hover:scale-90 transition-transform duration-500"
                  />
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-foreground">
                      {soulPrint.creator || 'Anonymous Resonance'}
                    </h3>
                    <span className="text-sm text-muted-foreground font-mono">
                      {formatTimeAgo(soulPrint.timestamp)}
                    </span>
                  </div>

                  {/* Biometric Indicators */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Intensity</div>
                      <div className="text-sm font-mono text-primary">
                        {(soulPrint.biometricData.intensity * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Resonance</div>
                      <div className="text-sm font-mono text-secondary">
                        {(soulPrint.biometricData.resonance * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Complexity</div>
                      <div className="text-sm font-mono text-accent">
                        {(soulPrint.visualSignature.complexity * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Harmonic Visualization */}
                  <div className="flex justify-center gap-1">
                    {soulPrint.biometricData.harmonics.map((harmonic, index) => (
                      <div
                        key={index}
                        className="w-2 h-8 bg-gradient-biometric rounded-full opacity-70 animate-harmonic-wave"
                        style={{
                          transform: `scaleY(${harmonic})`,
                          animationDelay: `${index * 0.2}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* Affinity Score */}
                  {soulPrint.affinityScore && (
                    <div className="flex items-center justify-center gap-2">
                      <Waves className="w-4 h-4 text-primary" />
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {(soulPrint.affinityScore * 100).toFixed(0)}% Affinity
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-soul opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {getCurrentPrints().length === 0 && (
          <div className="text-center py-20 space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-cosmic flex items-center justify-center">
              <Zap className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-light text-foreground">
              {viewMode === 'yours' ? 'No Soul Prints Yet' : 'Resonance Loading...'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {viewMode === 'yours' 
                ? 'Create your first Soul Print to begin your biometric journey.'
                : 'The cosmic resonance field is calibrating. New expressions emerging soon.'}
            </p>
          </div>
        )}

        {/* Cosmic Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full animate-cosmic-drift"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 12}s`,
                animationDuration: `${10 + Math.random() * 6}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};