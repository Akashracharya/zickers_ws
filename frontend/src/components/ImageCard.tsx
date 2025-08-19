import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Heart, HeartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCardProps {
  image: {
    id: string;
    url: string;
    title: string;
    category: 'wallpaper' | 'sticker' | 'poster';
    width: number;
    height: number;
  };
  onSave: (imageId: string) => void;
  onDownload: (imageUrl: string) => void;
  isSaved?: boolean;
}

export const ImageCard = ({ image, onSave, onDownload, isSaved = false }: ImageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wallpaper': return 'bg-blue-500/20 text-blue-300';
      case 'sticker': return 'bg-pink-500/20 text-pink-300';
      case 'poster': return 'bg-green-500/20 text-green-300';
      default: return 'bg-accent/20 text-accent-foreground';
    }
  };

  const handleDownload = () => {
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-card shadow-lg"
      style={{ aspectRatio: `${image.width}/${image.height}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Image */}
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onLoad={() => setImageLoaded(true)}
      />

      {/* Category Tag */}
      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full glass text-xs font-medium ${getCategoryColor(image.category)}`}>
        {image.category}
      </div>

      {/* Hover Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Action Buttons */}
      <motion.div
        className="absolute top-3 right-3 flex gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          size="sm"
          variant="secondary"
          className="glass-hover rounded-xl h-8 w-8 p-0"
          onClick={() => onSave(image.id)}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </Button>
        <Button
          size="sm"
          className="glass-hover rounded-xl h-8 w-8 p-0"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Title on Hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="text-white font-medium text-sm">{image.title}</h3>
      </motion.div>
    </motion.div>
  );
};