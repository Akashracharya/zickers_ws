import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageCard } from './ImageCard';
import { Button } from '@/components/ui/button';
import * as api from '@/api';
import { Filter } from 'lucide-react'; // Import Filter icon
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Import Sheet components

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
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);


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

  const handleCategorySelect = (category: 'all' | 'wallpaper' | 'sticker' | 'poster') => {
    setSelectedCategory(category);
    setIsFilterSheetOpen(false); // Close sheet on selection
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* --- Category Filter --- */}

      {/* Desktop Filter */}
      <motion.div 
        className="hidden md:flex justify-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass p-2 rounded-full inline-flex items-center gap-2 border border-primary">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              onClick={() => handleCategorySelect(category.id as any)}
              className="rounded-full h-auto px-6 py-2 text-sm transition-all duration-200"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Mobile Filter */}
      <div className="flex justify-end mb-4 md:hidden">
         <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Categories</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-2 mt-4">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "secondary"}
                    onClick={() => handleCategorySelect(category.id as any)}
                    className="w-full justify-start"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
      </div>


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
