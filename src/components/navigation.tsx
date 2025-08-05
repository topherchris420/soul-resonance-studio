import { Button } from "@/components/ui/button";
import { Camera, Eye, Zap, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  currentView: 'capture' | 'gallery' | 'profile';
  onNavigate: (view: 'capture' | 'gallery' | 'profile') => void;
}

export const Navigation = ({ currentView, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: 'capture' as const, icon: Camera, label: 'Capture', gradient: 'bg-gradient-neural' },
    { id: 'gallery' as const, icon: Eye, label: 'Gallery', gradient: 'bg-gradient-harmonic' },
    { id: 'profile' as const, icon: Zap, label: 'Profile', gradient: 'bg-gradient-biometric' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-ethereal backdrop-blur-xl border-b border-primary/20 shadow-cosmic">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo with enhanced styling */}
          <div className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <img 
                src="/lovable-uploads/a2be87f6-26ad-4604-9ed1-d1c5f2ffe2fe.png" 
                alt="Aethel Logo" 
                className="w-8 h-10 sm:w-10 sm:h-12 object-cover rounded-lg shadow-glow-primary transition-all duration-500 group-hover:shadow-glow-intense group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-soul opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-500"></div>
            </div>
            <span className="text-xl sm:text-2xl font-thin tracking-wider text-foreground group-hover:text-primary transition-colors duration-300 relative">
              Aethel
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-soul group-hover:w-full transition-all duration-500"></div>
            </span>
          </div>

          {/* Enhanced Navigation Items */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map(({ id, icon: Icon, label, gradient }) => (
              <Button
                key={id}
                variant={currentView === id ? "default" : "ghost"}
                onClick={() => onNavigate(id)}
                size="sm"
                className={cn(
                  "relative px-3 sm:px-6 py-2 transition-all duration-500 text-sm sm:text-base group overflow-hidden",
                  currentView === id 
                    ? `shadow-glow-primary ${gradient} border border-primary/30` 
                    : "hover:shadow-glow-secondary hover:scale-105 hover:bg-background/20"
                )}
              >
                <div className="relative z-10 flex items-center">
                  <Icon className={cn(
                    "w-4 h-4 sm:w-5 sm:h-5 sm:mr-2 transition-all duration-300",
                    currentView === id && "animate-soul-pulse"
                  )} />
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {currentView !== id && (
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300",
                    gradient
                  )}></div>
                )}
              </Button>
            ))}
          </div>

          {/* Enhanced Settings Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden sm:flex hover:shadow-glow-accent hover:scale-110 transition-all duration-300 group relative overflow-hidden"
          >
            <Settings className="w-5 h-5 relative z-10 group-hover:animate-soul-pulse" />
            <div className="absolute inset-0 bg-gradient-soul opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Button>
        </div>
      </div>
      
      {/* Subtle animated border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-soul opacity-50 animate-data-flow"></div>
    </nav>
  );
};