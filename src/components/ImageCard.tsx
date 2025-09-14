"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "./LoadingSpinner";

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

interface ImageCardProps {
  image: GeneratedImage;
  onFullScreenView?: (image: GeneratedImage) => void;
}

export default function ImageCard({ image, onFullScreenView }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async () => {
    if (!image.url || isDownloading) return;

    setIsDownloading(true);
    try {
      const response = await fetch(image.url);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-generated-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Could show toast notification here
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-200 group">
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="lg" className="text-purple-400" />
          </div>
        )}
        
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400 text-sm">Failed to load image</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              className="mt-2 border-red-400/30 text-red-400 hover:bg-red-500/10"
            >
              Retry
            </Button>
          </div>
        ) : (
          <img
            src={image.url}
            alt={image.prompt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex space-x-2">
            {onFullScreenView && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onFullScreenView(image)}
                className="bg-white/90 text-black hover:bg-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                View
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading || hasError}
              className="bg-white/90 text-black hover:bg-white"
            >
              {isDownloading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Prompt */}
        <p className="text-white text-sm line-clamp-2 leading-relaxed">
          {image.prompt}
        </p>

        {/* Settings & Timestamp */}
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center space-x-1 flex-wrap">
            {image.settings.style && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                {image.settings.style}
              </Badge>
            )}
            {image.settings.quality === 'high' && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                HD
              </Badge>
            )}
          </div>
          <span className="text-gray-400">
            {formatDate(image.timestamp)}
          </span>
        </div>
        
        {/* Model Badge */}
        {image.settings.model && (
          <div className="text-xs">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-400/30 text-xs">
              {image.settings.model.includes('dall-e') ? 'OpenAI' :
               image.settings.model.includes('google') ? 'Google' :
               image.settings.model.includes('flux') ? 'FLUX' :
               image.settings.model.includes('stability') ? 'Stability AI' : 'AI Model'}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}