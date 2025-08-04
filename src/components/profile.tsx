import { useState } from "react";
import { SoulPrint } from "@/components/ui/soul-print";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Waves, 
  TrendingUp, 
  Heart, 
  Zap, 
  Clock,
  BarChart3,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileProps {
  userSoulPrints?: any[];
}

export const Profile = ({ userSoulPrints = [] }: ProfileProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'intensity' | 'resonance' | 'complexity'>('intensity');

  // Simulated user profile data
  const userProfile = {
    resonanceName: "Cosmic Wanderer",
    joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    totalPrints: userSoulPrints.length || 12,
    avgIntensity: 0.73,
    avgResonance: 0.68,
    avgComplexity: 0.81,
    harmonicAffinities: 847,
    collectiveContribution: 0.92,
    resonanceEvolution: [0.45, 0.52, 0.61, 0.68, 0.73, 0.81, 0.78, 0.85],
    topAffinities: [
      { name: "Ethereal Drifter", affinity: 0.94 },
      { name: "Quantum Pulse", affinity: 0.89 },
      { name: "Celestial Echo", affinity: 0.87 }
    ]
  };

  const getEvolutionData = () => {
    const metric = selectedMetric;
    return userProfile.resonanceEvolution.map((value, index) => ({
      period: `W${index + 1}`,
      value: metric === 'intensity' ? value : 
             metric === 'resonance' ? value * 0.9 : 
             value * 1.1
    }));
  };

  const formatDuration = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days of resonance`;
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <SoulPrint
              intensity={userProfile.avgIntensity}
              harmonics={[0.8, 0.6, 0.9, 0.7, 0.5]}
              className="scale-125"
              isActive={true}
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-thin text-foreground tracking-wider">
              {userProfile.resonanceName}
            </h1>
            <p className="text-muted-foreground">
              {formatDuration(userProfile.joinedDate)}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { 
                label: 'Soul Prints', 
                value: userProfile.totalPrints, 
                icon: Zap, 
                color: 'text-primary' 
              },
              { 
                label: 'Avg Intensity', 
                value: `${(userProfile.avgIntensity * 100).toFixed(0)}%`, 
                icon: TrendingUp, 
                color: 'text-secondary' 
              },
              { 
                label: 'Harmonic Affinities', 
                value: userProfile.harmonicAffinities, 
                icon: Heart, 
                color: 'text-accent' 
              },
              { 
                label: 'Collective Impact', 
                value: `${(userProfile.collectiveContribution * 100).toFixed(0)}%`, 
                icon: Globe, 
                color: 'text-primary' 
              }
            ].map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="p-6 text-center bg-card/40 backdrop-blur-md border-border/20">
                <Icon className={cn("w-8 h-8 mx-auto mb-3", color)} />
                <div className="text-2xl font-light text-foreground mb-1">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="evolution" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-card/40 backdrop-blur-md">
            <TabsTrigger value="evolution">Resonance Evolution</TabsTrigger>
            <TabsTrigger value="affinities">Harmonic Affinities</TabsTrigger>
            <TabsTrigger value="collection">Soul Collection</TabsTrigger>
          </TabsList>

          <TabsContent value="evolution" className="space-y-6">
            <Card className="p-8 bg-card/40 backdrop-blur-md border-border/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-light text-foreground">
                    Biometric Evolution
                  </h3>
                  <div className="flex gap-2">
                    {[
                      { key: 'intensity' as const, label: 'Intensity' },
                      { key: 'resonance' as const, label: 'Resonance' },
                      { key: 'complexity' as const, label: 'Complexity' }
                    ].map(({ key, label }) => (
                      <Button
                        key={key}
                        variant={selectedMetric === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMetric(key)}
                        className={cn(
                          "transition-all duration-300",
                          selectedMetric === key && "shadow-glow-primary"
                        )}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Evolution Chart Simulation */}
                <div className="space-y-4">
                  {getEvolutionData().map(({ period, value }, index) => (
                    <div key={period} className="flex items-center gap-4">
                      <div className="w-12 text-sm text-muted-foreground font-mono">
                        {period}
                      </div>
                      <div className="flex-1">
                        <Progress 
                          value={value * 100} 
                          className="h-3"
                        />
                      </div>
                      <div className="w-16 text-sm text-foreground font-mono">
                        {(value * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* Insights */}
                <div className="pt-6 border-t border-border/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center space-y-2">
                      <div className="text-lg font-medium text-primary">
                        +{((userProfile.avgIntensity - 0.45) * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Intensity Growth
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-lg font-medium text-secondary">
                        {userProfile.resonanceEvolution.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Weeks Tracked
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-lg font-medium text-accent">
                        Ascending
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current Trend
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="affinities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userProfile.topAffinities.map((affinity, index) => (
                <Card key={affinity.name} className="p-6 bg-card/40 backdrop-blur-md border-border/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-harmonic rounded-full animate-soul-pulse" />
                      <h4 className="font-medium text-foreground">{affinity.name}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Harmonic Affinity</span>
                        <span className="text-foreground font-mono">
                          {(affinity.affinity * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={affinity.affinity * 100} className="h-2" />
                    </div>

                    <Badge 
                      variant="outline" 
                      className="w-full justify-center bg-primary/10 text-primary border-primary/20"
                    >
                      <Waves className="w-3 h-3 mr-1" />
                      Resonance Match
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collection" className="space-y-6">
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-cosmic rounded-full flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-light text-foreground">
                Soul Print Collection
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your personal Soul Prints will appear here as you capture more biometric resonance data.
              </p>
              <Button className="bg-gradient-soul hover:shadow-glow-primary">
                <Zap className="w-4 h-4 mr-2" />
                Create New Soul Print
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Background Cosmic Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-secondary/20 rounded-full animate-cosmic-drift"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${12 + Math.random() * 8}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};