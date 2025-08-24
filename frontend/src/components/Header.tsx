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
import logo from '@/assets/logo.png'; // Assuming your logo is named logo.png and is in the assets folder

interface HeaderProps {
  onAuthClick: () => void;
  user?: { name: string; email: string; role?: 'admin' | 'user' } | null;
  onProfileClick: () => void;
  onLogout: () => void;
}

export const Header = ({ onAuthClick, user, onProfileClick, onLogout }: HeaderProps) => {
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
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link to="/">
            <img src={logo} alt="Zickers Logo" className="h-32 md:h-36" />
          </Link>
        </motion.div>

        {/* Profile/Auth */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="glass-hover rounded-xl h-10 px-4 transition-all duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={onProfileClick}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>My Collection</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
