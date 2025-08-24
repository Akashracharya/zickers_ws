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
  role?: 'admin' | 'user';
}

interface Asset {
    _id: string;
    url: string;
    title: string;
    category: 'wallpaper' | 'sticker' | 'poster';
    width: number;
    height: number;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [savedAssetIds, setSavedAssetIds] = useState<string[]>([]);
  const [savedAssets, setSavedAssets] = useState<Asset[]>([]);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'profile'>('home');

  const fetchSavedAssets = (token: string) => {
    api.getSavedAssets(token)
      .then(assets => {
        setSavedAssets(assets);
        setSavedAssetIds(assets.map(asset => asset._id));
      })
      .catch(console.error);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile(token)
        .then(userData => {
          setUser(userData);
          fetchSavedAssets(token);
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      fetchSavedAssets(data.token);
      toast.success("Welcome back!");
      setIsAuthDialogOpen(false);
    } catch (error) {
      toast.error("Login Failed");
    }
  };

  const handleSignUp = async (name, email, password) => {
    try {
      const data = await api.signup(name, email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setSavedAssetIds([]);
      setSavedAssets([]);
      toast.success("Account created!");
      setIsAuthDialogOpen(false);
    } catch (error) {
      toast.error("Signup Failed");
    }
  };
  
  const handleSaveImage = async (imageId: string) => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      setIsAuthDialogOpen(true);
      return;
    }
    try {
      const response = await api.toggleSaveAsset(imageId, token);
      setSavedAssetIds(response.savedAssets);
      if (token) fetchSavedAssets(token);
      toast.success(response.message);
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setCurrentView('home');
    setSavedAssetIds([]);
    setSavedAssets([]);
    toast.info("Signed out");
  };
  
  // This function handles both cases for the "My Collection" button
  const handleMyCollectionClick = () => {
    if (user) {
      // Case 1: User is logged in, show the profile
      setCurrentView('profile');
    } else {
      // Case 2: User is not logged in, open the auth dialog
      setIsAuthDialogOpen(true);
      toast.info("Please sign in", {
        description: "You need to be logged in to view your collection."
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onAuthClick={() => setIsAuthDialogOpen(true)}
        onProfileClick={handleMyCollectionClick} // This now handles both cases
        onLogout={handleLogout}
      />

      {isAuthDialogOpen && (
        <AuthDialog
          isOpen={isAuthDialogOpen}
          onClose={() => setIsAuthDialogOpen(false)}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
        />
      )}
      
      {currentView === 'home' ? (
        <motion.div className="pt-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <ImageGrid
            onSave={handleSaveImage}
            savedImages={savedAssetIds}
            user={user}
            onAuthRequired={() => setIsAuthDialogOpen(true)}
          />
        </motion.div>
      ) : (
        user && (
          <Profile
            user={user}
            savedImages={savedAssets}
            onBack={() => setCurrentView('home')}
            onRemoveSaved={handleSaveImage}
          />
        )
      )}
    </div>
  );
};

export default Index;
