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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src="/lovable-uploads/a2be87f6-26ad-4604-9ed1-d1c5f2ffe2fe.png" 
              alt="Aethel Logo" 
              className="w-8 h-10 sm:w-10 sm:h-12 object-cover rounded-md shadow-glow-primary"
            />
            <span className="text-xl sm:text-2xl font-thin tracking-wider text-foreground">
              Aethel
            </span>
          </div>

          {/* Mobile Navigation Items */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant={currentView === id ? "default" : "ghost"}
                onClick={() => onNavigate(id)}
                size="sm"
                className={cn(
                  "px-3 sm:px-6 py-2 transition-all duration-500 text-sm sm:text-base",
                  currentView === id && "shadow-glow-primary bg-gradient-soul"
                )}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>

          {/* Settings - Hidden on very small screens */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};