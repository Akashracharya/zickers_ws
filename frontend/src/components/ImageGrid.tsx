import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageCard } from './ImageCard';
import { Button } from '@/components/ui/button';
import * as api from '@/api';

interface Asset {
  _id: string;
  url: string;
  title: string;
  category: 'wallpaper' | 'sticker' | 'poster';
  width: number;
  height: number;
}

interface ImageGridProps {
  onSave: (imageId: string) => void;
  savedImages: string[];
  user?: { name: string; email: string } | null;
  onAuthRequired: () => void;
}

export const ImageGrid = ({ onSave, savedImages, user, onAuthRequired }: ImageGridProps) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'wallpaper' | 'sticker' | 'poster'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setIsLoading(true);
        const fetchedAssets = await api.getAllAssets();
        const formattedAssets = fetchedAssets.map(asset => ({...asset, id: asset._id}));
        setAssets(formattedAssets);
        setFilteredAssets(formattedAssets);
      } catch (error) {
        console.error("Failed to fetch assets:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredAssets(assets);
    } else {
      setFilteredAssets(assets.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory, assets]);

  const handleSave = (imageId: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }
    onSave(imageId);
  };

  const handleDownload = (imageUrl: string) => {
    console.log('Downloading:', imageUrl);
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'wallpaper', label: 'Wallpapers' },
    { id: 'sticker', label: 'Stickers' },
    { id: 'poster', label: 'Posters' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Filter - Updated UI */}
      <motion.div 
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass p-2 rounded-full inline-flex items-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              onClick={() => setSelectedCategory(category.id as any)}
              className="rounded-full h-auto px-6 py-2 text-sm transition-all duration-200"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Pinterest-style Grid */}
      <motion.div 
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isLoading ? (
          <p className="text-center col-span-full">Loading images...</p>
        ) : (
          filteredAssets.map((image, index) => (
            <motion.div
              key={image._id}
              className="break-inside-avoid mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ImageCard
                image={{...image, id: image._id}}
                onSave={handleSave}
                onDownload={handleDownload}
                isSaved={savedImages.includes(image._id)}
              />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};
