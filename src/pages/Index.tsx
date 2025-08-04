import { useState } from "react";
import { CaptureInterface } from "@/components/capture-interface";
import { Gallery } from "@/components/gallery";
import { Profile } from "@/components/profile";
import { Navigation } from "@/components/navigation";

const Index = () => {
  const [currentView, setCurrentView] = useState<'capture' | 'gallery' | 'profile'>('capture');
  const [userSoulPrints, setUserSoulPrints] = useState<any[]>([]);

  const handleSoulPrintGenerated = (soulPrint: any) => {
    setUserSoulPrints(prev => [soulPrint, ...prev]);
    setCurrentView('gallery');
  };

  const handleExplore = (soulPrint: any) => {
    // Could navigate to detailed view or play audio
    console.log('Exploring soul print:', soulPrint);
  };

  return (
    <div className="min-h-screen">
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
      
      {currentView === 'capture' && (
        <CaptureInterface onSoulPrintGenerated={handleSoulPrintGenerated} />
      )}
      
      {currentView === 'gallery' && (
        <Gallery userSoulPrints={userSoulPrints} onExplore={handleExplore} />
      )}
      
      {currentView === 'profile' && (
        <Profile userSoulPrints={userSoulPrints} />
      )}
    </div>
  );
};

export default Index;
