import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { ImageGrid } from '@/components/ImageGrid';
import { AuthDialog } from '@/components/AuthDialog';
import { Profile } from '@/components/Profile';
import { useToast } from '@/hooks/use-toast';

interface User {
  name: string;
  email: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'profile'>('home');
  const { toast } = useToast();

  const handleLogin = (email: string, password: string) => {
    // Mock login - In real app, this would connect to your backend
    const mockUser = {
      name: email.split('@')[0],
      email: email
    };
    setUser(mockUser);
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    // Mock signup - In real app, this would connect to your backend
    const newUser = { name, email };
    setUser(newUser);
    toast({
      title: "Account created!",
      description: "Welcome to ZICKERS! Start exploring images.",
    });
  };

  const handleSaveImage = (imageId: string) => {
    if (savedImages.includes(imageId)) {
      setSavedImages(savedImages.filter(id => id !== imageId));
      toast({
        title: "Image removed",
        description: "Image removed from your saved collection.",
      });
    } else {
      setSavedImages([...savedImages, imageId]);
      toast({
        title: "Image saved!",
        description: "Image added to your collection.",
      });
    }
  };

  const handleAuthRequired = () => {
    setIsAuthDialogOpen(true);
    toast({
      title: "Sign in required",
      description: "Please sign in to save images to your collection.",
      variant: "destructive"
    });
  };

  const handleLogout = () => {
    setUser(null);
    setSavedImages([]);
    setCurrentView('home');
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onAuthClick={() => setIsAuthDialogOpen(true)}
        onProfileClick={() => setCurrentView('profile')}
      />

      {currentView === 'home' ? (
        <motion.div 
          className="pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ImageGrid
            onSave={handleSaveImage}
            savedImages={savedImages}
            user={user}
            onAuthRequired={handleAuthRequired}
          />
        </motion.div>
      ) : (
        user && (
          <Profile
            user={user}
            savedImages={savedImages}
            onBack={() => setCurrentView('home')}
            onRemoveSaved={handleSaveImage}
          />
        )
      )}

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
    </div>
  );
};

export default Index;