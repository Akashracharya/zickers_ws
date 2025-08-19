import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogIn, Image, Palette, FileImage, Info, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onAuthClick: () => void;
  user?: { name: string; email: string } | null;
  onProfileClick: () => void;
  onCategoryFilter?: (category: 'all' | 'wallpaper' | 'sticker' | 'poster') => void;
}

export const Header = ({ onAuthClick, user, onProfileClick, onCategoryFilter }: HeaderProps) => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="text-2xl font-bold text-foreground"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          ZICKERS
        </motion.div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {onCategoryFilter && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryFilter('all')}
                className="glass-hover rounded-xl h-9 px-3"
              >
                <Image className="w-4 h-4 mr-2" />
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryFilter('wallpaper')}
                className="glass-hover rounded-xl h-9 px-3"
              >
                <FileImage className="w-4 h-4 mr-2" />
                Wallpapers
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryFilter('sticker')}
                className="glass-hover rounded-xl h-9 px-3"
              >
                <Palette className="w-4 h-4 mr-2" />
                Stickers
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryFilter('poster')}
                className="glass-hover rounded-xl h-9 px-3"
              >
                <Image className="w-4 h-4 mr-2" />
                Posters
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="glass-hover rounded-xl h-9 px-3"
          >
            <Info className="w-4 h-4 mr-2" />
            About
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="glass-hover rounded-xl h-9 px-3"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button>
        </div>

        {/* Profile/Auth */}
        <div className="flex items-center gap-4">
          {user ? (
            <Button
              variant="ghost"
              onClick={onProfileClick}
              className="glass-hover rounded-xl h-10 px-4 transition-all duration-200"
            >
              <User className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{user.name}</span>
            </Button>
          ) : (
            <Button
              onClick={onAuthClick}
              className="glass-hover rounded-xl h-10 px-4 transition-all duration-200"
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};