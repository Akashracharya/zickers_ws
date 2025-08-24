import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Heart } from 'lucide-react';
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
  isSaved?: boolean;
}

export const ImageCard = ({ image, onSave, isSaved = false }: ImageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wallpaper': return 'bg-blue-500/20 text-blue-300';
      case 'sticker': return 'bg-pink-500/20 text-pink-300';
      case 'poster': return 'bg-green-500/20 text-green-300';
      default: return 'bg-accent/20 text-accent-foreground';
    }
  };

  // This function forces the browser to download the image file
  const handleDownload = async () => {
    try {
      // Fetch the image data as a blob
      const response = await fetch(image.url);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${image.title.replace(/ /g, '_')}.jpg`; // Set a clean filename
      
      // Append to the document, click, and then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback for browsers that might have issues
      window.open(image.url, '_blank');
    }
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
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full glass text-xs font-medium ${getCategoryColor(image.category)}`}>
        {image.category}
      </div>

      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

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
          onClick={handleDownload} // Updated to use the new download function
        >
          <Download className="w-4 h-4" />
        </Button>
      </motion.div>

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
