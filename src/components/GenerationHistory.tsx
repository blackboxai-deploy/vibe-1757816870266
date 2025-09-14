"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface GenerationHistoryProps {
  images: GeneratedImage[];
  onImageSelect: (image: GeneratedImage) => void;
}

export default function GenerationHistory({ images, onImageSelect }: GenerationHistoryProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">No history yet</p>
        <p className="text-gray-500 text-xs mt-1">Generated images will appear here</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-80 pr-2">
      <div className="space-y-3">
        {images.map((image) => (
          <Card
            key={image.id}
            className="p-3 cursor-pointer transition-all duration-200 bg-white/5 hover:bg-white/10 border-white/20 hover:border-purple-400/50"
            onClick={() => onImageSelect(image)}
          >
            {/* Image Thumbnail */}
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 flex-shrink-0">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      `;
                    }
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm line-clamp-2 leading-tight mb-2">
                  {image.prompt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {image.settings.style && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-purple-500/10 text-purple-300 border-purple-400/30">
                        {image.settings.style.substring(0, 8)}
                      </Badge>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs">
                    {formatDate(image.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}