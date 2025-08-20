import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageCard } from './ImageCard';

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

interface ProfileProps {
  user: { name: string; email: string };
  savedImages: Asset[]; // Now expects an array of Asset objects
  onBack: () => void;
  onRemoveSaved: (imageId: string) => void;
}


export const Profile = ({ user, savedImages, onBack, onRemoveSaved }: ProfileProps) => {

  const handleDownload = (imageUrl: string) => {
    console.log('Downloading:', imageUrl);
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="glass-hover rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{user.name}'s Profile</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </motion.div>

        {/* Saved Images */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Saved Images ({savedImages.length})</h2>
          
          {savedImages.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {savedImages.map((image, index) => (
                <motion.div
                  key={image._id}
                  className="break-inside-avoid mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ImageCard
                    image={{...image, id: image._id}} // Pass the full image object
                    onSave={() => onRemoveSaved(image._id)} // Pass the id to the handler
                    onDownload={handleDownload}
                    isSaved={true}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-2xl">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No saved images yet</h3>
              <p className="text-muted-foreground mb-6">Start exploring and save your favorite images!</p>
              <Button onClick={onBack} className="rounded-xl">
                Browse Images
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};