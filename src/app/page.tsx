"use client";

import { useState } from "react";
import ImageGenerator from "@/components/ImageGenerator";
import ImageGallery from "@/components/ImageGallery";
import GenerationHistory from "@/components/GenerationHistory";
import FullScreenPreview from "@/components/FullScreenPreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  settings: {
    style?: string;
    aspectRatio?: string;
    quality?: string;
    model?: string;
  };
}

export default function HomePage() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<GeneratedImage | null>(null);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  const handleImageGenerated = (image: GeneratedImage) => {
    setImages(prev => [image, ...prev]);
    
    // Save to localStorage
    const savedImages = localStorage.getItem('ai-generated-images');
    const existingImages = savedImages ? JSON.parse(savedImages) : [];
    const updatedImages = [image, ...existingImages].slice(0, 50); // Keep last 50 images
    localStorage.setItem('ai-generated-images', JSON.stringify(updatedImages));
  };

  const loadHistoryImages = () => {
    const savedImages = localStorage.getItem('ai-generated-images');
    if (savedImages) {
      const historyImages = JSON.parse(savedImages);
      setImages(historyImages);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('ai-generated-images');
    setImages([]);
  };

  const handleFullScreenView = (image: GeneratedImage) => {
    setFullScreenImage(image);
    setIsFullScreenOpen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreenOpen(false);
    setTimeout(() => setFullScreenImage(null), 300); // Wait for animation
  };

  const getNextImage = () => {
    if (!fullScreenImage || images.length === 0) return;
    const currentIndex = images.findIndex(img => img.id === fullScreenImage.id);
    if (currentIndex < images.length - 1) {
      setFullScreenImage(images[currentIndex + 1]);
    }
  };

  const getPreviousImage = () => {
    if (!fullScreenImage || images.length === 0) return;
    const currentIndex = images.findIndex(img => img.id === fullScreenImage.id);
    if (currentIndex > 0) {
      setFullScreenImage(images[currentIndex - 1]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-4">
          AI Image Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your imagination into stunning visuals with cutting-edge AI technology. 
          Create professional-quality images from simple text descriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Image Generator */}
          <Card className="p-6 mb-6 backdrop-blur-sm bg-white/10 border-white/20">
            <ImageGenerator 
              onImageGenerated={handleImageGenerated}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </Card>

          {/* Image Gallery */}
          <Card className="p-6 backdrop-blur-sm bg-white/10 border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">Generated Images</h2>
              {images.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="border-white/20 hover:bg-white/10"
                >
                  Clear All
                </Button>
              )}
            </div>
            <Separator className="mb-4 bg-white/20" />
            <ImageGallery images={images} onFullScreenView={handleFullScreenView} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Card className="p-6 backdrop-blur-sm bg-white/10 border-white/20 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">History</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowHistory(!showHistory);
                  if (!showHistory) loadHistoryImages();
                }}
                className="hover:bg-white/10"
              >
                {showHistory ? 'Hide' : 'Show'}
              </Button>
            </div>
            <Separator className="mb-4 bg-white/20" />
            {showHistory && (
              <GenerationHistory 
                images={images}
                onImageSelect={(image) => {
                  // Show in full screen instead of just scrolling
                  handleFullScreenView(image);
                }}
              />
            )}
            
            {/* Usage Tips */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
              <h4 className="font-medium text-white mb-2">💡 Pro Tips</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Be specific about style, lighting, and mood</li>
                <li>• Use descriptive adjectives for better results</li>
                <li>• Try different aspect ratios for variety</li>
                <li>• Combine artistic styles for unique looks</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Full Screen Preview */}
      <FullScreenPreview
        image={fullScreenImage}
        isOpen={isFullScreenOpen}
        onClose={closeFullScreen}
        onNext={images.length > 1 ? getNextImage : undefined}
        onPrevious={images.length > 1 ? getPreviousImage : undefined}
        showNavigation={images.length > 1}
      />
    </div>
  );
}