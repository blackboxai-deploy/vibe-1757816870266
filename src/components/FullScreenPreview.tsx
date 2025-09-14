"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

interface FullScreenPreviewProps {
  image: GeneratedImage | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export default function FullScreenPreview({ 
  image, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious, 
  showNavigation = false 
}: FullScreenPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (image) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [image]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (onPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (onNext) onNext();
          break;
        case 'i':
        case 'I':
          setShowDetails(prev => !prev);
          break;
        case 'd':
        case 'D':
          if (image) handleDownload();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious, image]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async () => {
    if (!image?.url || isDownloading) return;

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

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-full h-full p-0 bg-black/95 border-0">
        <div className="relative w-full h-full flex flex-col">
          {/* Header Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
                {showNavigation && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onPrevious}
                      disabled={!onPrevious}
                      className="text-white hover:bg-white/10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onNext}
                      disabled={!onNext}
                      className="text-white hover:bg-white/10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-white hover:bg-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading || hasError}
                  className="text-white hover:bg-white/10"
                >
                  {isDownloading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Image Area */}
          <div className="flex-1 flex items-center justify-center p-8 pt-20">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size="lg" className="text-white" />
              </div>
            )}
            
            {hasError ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-400 text-lg mb-4">Failed to load image</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                  }}
                  className="border-red-400/30 text-red-400 hover:bg-red-500/10"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <img
                src={image.url}
                alt={image.prompt}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </div>

          {/* Details Panel */}
          {showDetails && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Prompt */}
                  <div>
                    <h3 className="text-white font-semibold mb-2">Prompt</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {image.prompt}
                    </p>
                  </div>
                  
                  {/* Right Column - Details */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Generated</span>
                        <span className="text-gray-300 text-sm">{formatDate(image.timestamp)}</span>
                      </div>
                      
                      {image.settings.style && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Style</span>
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                            {image.settings.style.charAt(0).toUpperCase() + image.settings.style.slice(1)}
                          </Badge>
                        </div>
                      )}
                      
                      {image.settings.aspectRatio && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Aspect Ratio</span>
                          <Badge variant="outline" className="bg-gray-500/20 text-gray-300 border-gray-400/30">
                            {image.settings.aspectRatio.charAt(0).toUpperCase() + image.settings.aspectRatio.slice(1)}
                          </Badge>
                        </div>
                      )}
                      
                      {image.settings.quality && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Quality</span>
                          <Badge 
                            variant="outline" 
                            className={`${
                              image.settings.quality === 'high' 
                                ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                                : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                            }`}
                          >
                            {image.settings.quality.charAt(0).toUpperCase() + image.settings.quality.slice(1)}
                          </Badge>
                        </div>
                      )}
                      
                      {image.settings.model && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">AI Model</span>
                          <Badge 
                            variant="outline" 
                            className={`${
                              image.settings.model.includes('dall-e') ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                              image.settings.model.includes('google') ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' :
                              image.settings.model.includes('flux') ? 'bg-pink-500/20 text-pink-300 border-pink-400/30' :
                              image.settings.model.includes('stability') ? 'bg-teal-500/20 text-teal-300 border-teal-400/30' :
                              'bg-gray-500/20 text-gray-300 border-gray-400/30'
                            }`}
                          >
                            {image.settings.model.includes('dall-e-3') ? 'DALL-E 3' :
                             image.settings.model.includes('dall-e-2') ? 'DALL-E 2' :
                             image.settings.model.includes('imagen-3') ? 'Imagen 3.0' :
                             image.settings.model.includes('imagen-2') ? 'Imagen 2.0' :
                             image.settings.model.includes('flux-1.1-pro') ? 'FLUX 1.1 Pro' :
                             image.settings.model.includes('flux-dev') ? 'FLUX Dev' :
                             image.settings.model.includes('flux-schnell') ? 'FLUX Schnell' :
                             image.settings.model.includes('stable-diffusion-3') ? 'SD3 Medium' :
                             image.settings.model.includes('sdxl') ? 'SDXL Base' :
                             'AI Model'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Keyboard Shortcuts Hint */}
          <div className="absolute bottom-4 right-4 text-gray-500 text-xs">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
              <p>ESC: Close • I: Info • D: Download</p>
              {showNavigation && <p>← →: Navigate</p>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}