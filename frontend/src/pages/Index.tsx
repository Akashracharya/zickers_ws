import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { ImageGrid } from '@/components/ImageGrid';
import { AuthDialog } from '@/components/AuthDialog';
import { Profile } from '@/components/Profile';
import { toast } from "@/components/ui/sonner";
import * as api from '@/api';

interface User {
  id: string;
  name: string;
  email: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'profile'>('home');

  // Check for a token in localStorage when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If a token exists, try to fetch the user's profile
      api.getProfile(token)
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          // If the token is invalid or expired, remove it
          localStorage.removeItem('token');
        });
    }
  }, []);


  const handleLogin = async (email, password) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success("Welcome back!", {
        description: "You have successfully signed in.",
      });
      setIsAuthDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Login Failed", {
        description: "Please check your email and password.",
      });
    }
  };

  const handleSignUp = async (name, email, password) => {
    try {
      const data = await api.signup(name, email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success("Account created!", {
        description: "Welcome to ZICKERS! Start exploring images.",
      });
      setIsAuthDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Signup Failed", {
        description: "This email may already be in use.",
      });
    }
  };

  const handleSaveImage = (imageId: string) => {
    // We will implement this logic later when the user model is updated
    toast.info("Save functionality coming soon!");
  };

  const handleAuthRequired = () => {
    setIsAuthDialogOpen(true);
    toast.error("Sign in required", {
      description: "Please sign in to save images to your collection.",
    });
  };

  const handleLogout = () => {
    setUser(null);
    setSavedImages([]);
    localStorage.removeItem('token');
    setCurrentView('home');
    toast.info("Signed out", {
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onAuthClick={() => setIsAuthDialogOpen(true)}
        onProfileClick={() => setCurrentView('profile')}
        onLogout={handleLogout}
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