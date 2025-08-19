import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageCard } from './ImageCard';
import sampleWallpaper from '@/assets/sample-wallpaper-1.jpg';
import sampleSticker from '@/assets/sample-sticker-1.jpg';
import samplePoster from '@/assets/sample-poster-1.jpg';

interface ProfileProps {
  user: { name: string; email: string };
  savedImages: string[];
  onBack: () => void;
  onRemoveSaved: (imageId: string) => void;
}

// Mock saved images data
const mockSavedImages = [
  {
    id: '1',
    url: sampleWallpaper,
    title: 'Abstract Geometric Wallpaper',
    category: 'wallpaper' as const,
    width: 16,
    height: 9,
  },
  {
    id: '2',
    url: sampleSticker,
    title: 'Kawaii Cat Sticker',
    category: 'sticker' as const,
    width: 1,
    height: 1,
  },
  {
    id: '3',
    url: samplePoster,
    title: 'Motivational Success Poster',
    category: 'poster' as const,
    width: 3,
    height: 4,
  },
];

export const Profile = ({ user, savedImages, onBack, onRemoveSaved }: ProfileProps) => {
  const userSavedImages = mockSavedImages.filter(img => savedImages.includes(img.id));

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

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="glass rounded-2xl p-6 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">{savedImages.length}</h3>
            <p className="text-muted-foreground">Saved Images</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <Download className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">0</h3>
            <p className="text-muted-foreground">Downloads</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-8 h-8 bg-primary rounded-full mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">Member</h3>
            <p className="text-muted-foreground">Since Today</p>
          </div>
        </motion.div>

        {/* Saved Images */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Saved Images</h2>
          
          {userSavedImages.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {userSavedImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="break-inside-avoid mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ImageCard
                    image={image}
                    onSave={onRemoveSaved}
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