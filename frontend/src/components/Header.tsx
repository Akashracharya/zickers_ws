import { motion } from 'framer-motion';
import { User, LogIn, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

interface HeaderProps {
  onAuthClick: () => void;
  user?: { name: string; email: string; role?: 'admin' | 'user' } | null;
  onProfileClick: () => void;
  onLogout: () => void;
}

export const Header = ({ onAuthClick, user, onProfileClick, onLogout }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        className="glass border-b border-border/50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/">
              <img src={logo} alt="Zickers Logo" className="h-32 md:h-36" />
            </Link>
          </motion.div>

          {/* Navigation and Auth */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* My Collection Button - Always Visible */}
            <Button
              variant="ghost"
              className="glass-hover rounded-xl h-10 px-4"
              onClick={onProfileClick} // This click is handled on the main page
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">My Collection</span>
            </Button>

            {/* Profile Dropdown or Sign In Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="glass-hover rounded-xl h-10 px-4 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  {/* The profile link is now in the main header, but we keep one here for consistency in the dropdown */}
                  <DropdownMenuItem onClick={onProfileClick}>
                    <Heart className="w-4 h-4 mr-2" />
                    <span>My Collection</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={onAuthClick}
                className="glass-hover rounded-xl h-10 px-4 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </header>
  );
};
