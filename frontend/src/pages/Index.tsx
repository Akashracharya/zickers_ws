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

// Define the Asset interface to match our backend model
interface Asset {
    id: string;
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
  const [savedAssets, setSavedAssets] = useState<Asset[]>([]); // To store full asset objects
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'profile'>('home');

  // Function to fetch saved assets
  const fetchSavedAssets = (token) => {
    api.getSavedAssets(token)
      .then(assets => {
        setSavedAssets(assets); // Store full asset objects for the profile page
        setSavedAssetIds(assets.map(asset => asset._id)); // Store just the IDs for the home page grid
      })
      .catch(console.error);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile(token)
        .then(userData => {
          setUser(userData);
          fetchSavedAssets(token); // Fetch saved images after user is confirmed
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      fetchSavedAssets(data.token); // Fetch saved images on login
      toast.success("Welcome back!", { description: "You have successfully signed in." });
      setIsAuthDialogOpen(false);
    } catch (error) {
      toast.error("Login Failed", { description: "Please check your email and password." });
    }
  };

  const handleSignUp = async (name, email, password) => {
    try {
      const data = await api.signup(name, email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setSavedAssetIds([]); // New user has no saved images
      setSavedAssets([]);
      toast.success("Account created!", { description: "Welcome to ZICKERS!" });
      setIsAuthDialogOpen(false);
    } catch (error) {
      toast.error("Signup Failed", { description: "This email may already be in use." });
    }
  };

  const handleSaveImage = async (imageId: string) => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      handleAuthRequired();
      return;
    }

    try {
      const response = await api.toggleSaveAsset(imageId, token);
      setSavedAssetIds(response.savedAssets);
      
      // Also update the full savedAssets list for the profile page
      fetchSavedAssets(token);

      toast.success(response.message);
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleAuthRequired = () => {
    setIsAuthDialogOpen(true);
    toast.error("Sign in required", {
      description: "Please sign in to save images to your collection.",
    });
  };

  const handleLogout = () => {
    setUser(null);
    setSavedAssetIds([]);
    setSavedAssets([]);
    localStorage.removeItem('token');
    setCurrentView('home');
    toast.info("Signed out", { description: "You have been successfully signed out." });
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
        <motion.div className="pt-24" /* ... */ >
          <ImageGrid
            onSave={handleSaveImage}
            savedImages={savedAssetIds} // Use the new state here
            user={user}
            onAuthRequired={handleAuthRequired}
          />
        </motion.div>
      ) : (
        user && (
          <Profile
            user={user}
            savedImages={savedAssets} // Pass the full asset objects here
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