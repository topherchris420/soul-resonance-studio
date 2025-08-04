import { Button } from "@/components/ui/button";
import { Camera, Eye, Zap, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  currentView: 'capture' | 'gallery' | 'profile';
  onNavigate: (view: 'capture' | 'gallery' | 'profile') => void;
}

export const Navigation = ({ currentView, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: 'capture' as const, icon: Camera, label: 'Capture' },
    { id: 'gallery' as const, icon: Eye, label: 'Gallery' },
    { id: 'profile' as const, icon: Zap, label: 'Profile' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/20">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-soul rounded-full animate-soul-pulse" />
            <span className="text-2xl font-thin tracking-wider text-foreground">
              Aethel
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {navItems.map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant={currentView === id ? "default" : "ghost"}
                onClick={() => onNavigate(id)}
                className={cn(
                  "px-6 py-2 transition-all duration-500",
                  currentView === id && "shadow-glow-primary bg-gradient-soul"
                )}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </Button>
            ))}
          </div>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};