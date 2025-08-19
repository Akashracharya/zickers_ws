import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageCard } from './ImageCard';
import { Button } from '@/components/ui/button';
import sampleWallpaper from '@/assets/sample-wallpaper-1.jpg';
import sampleSticker from '@/assets/sample-sticker-1.jpg';
import samplePoster from '@/assets/sample-poster-1.jpg';

interface Image {
  id: string;
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

// Mock data with various aspect ratios for Pinterest-style layout
const mockImages: Image[] = [
  {
    id: '1',
    url: sampleWallpaper,
    title: 'Abstract Geometric Wallpaper',
    category: 'wallpaper',
    width: 16,
    height: 9,
  },
  {
    id: '2',
    url: sampleSticker,
    title: 'Kawaii Cat Sticker',
    category: 'sticker',
    width: 1,
    height: 1,
  },
  {
    id: '3',
    url: samplePoster,
    title: 'Motivational Success Poster',
    category: 'poster',
    width: 3,
    height: 4,
  },
  // Additional mock images with different dimensions
  {
    id: '4',
    url: sampleWallpaper,
    title: 'Sunset Landscape',
    category: 'wallpaper',
    width: 16,
    height: 10,
  },
  {
    id: '5',
    url: sampleSticker,
    title: 'Happy Unicorn',
    category: 'sticker',
    width: 1,
    height: 1.2,
  },
  {
    id: '6',
    url: samplePoster,
    title: 'Vintage Art Poster',
    category: 'poster',
    width: 2,
    height: 3,
  },
  {
    id: '7',
    url: sampleWallpaper,
    title: 'Minimalist Design',
    category: 'wallpaper',
    width: 16,
    height: 9,
  },
  {
    id: '8',
    url: sampleSticker,
    title: 'Cool Robot Sticker',
    category: 'sticker',
    width: 1,
    height: 1.3,
  },
];

export const ImageGrid = ({ onSave, savedImages, user, onAuthRequired }: ImageGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'wallpaper' | 'sticker' | 'poster'>('all');
  const [filteredImages, setFilteredImages] = useState<Image[]>(mockImages);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(mockImages);
    } else {
      setFilteredImages(mockImages.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory]);

  const handleSave = (imageId: string) => {
    if (!user) {
      onAuthRequired();
      return;
    }
    onSave(imageId);
  };

  const handleDownload = (imageUrl: string) => {
    // Download doesn't require authentication
    console.log('Downloading:', imageUrl);
  };

  const categories = [
    { id: 'all', label: 'All', count: mockImages.length },
    { id: 'wallpaper', label: 'Wallpapers', count: mockImages.filter(img => img.category === 'wallpaper').length },
    { id: 'sticker', label: 'Stickers', count: mockImages.filter(img => img.category === 'sticker').length },
    { id: 'poster', label: 'Posters', count: mockImages.filter(img => img.category === 'poster').length },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Filter */}
      <motion.div 
        className="flex flex-wrap gap-3 mb-8 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "secondary"}
            onClick={() => setSelectedCategory(category.id as any)}
            className="glass-hover rounded-xl transition-all duration-200"
          >
            {category.label} ({category.count})
          </Button>
        ))}
      </motion.div>

      {/* Pinterest-style Grid */}
      <motion.div 
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            className="break-inside-avoid mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ImageCard
              image={image}
              onSave={handleSave}
              onDownload={handleDownload}
              isSaved={savedImages.includes(image.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};