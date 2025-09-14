"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "./LoadingSpinner";
import PromptSuggestions from "./PromptSuggestions";
import StylePresets from "./StylePresets";
import ModelSelector from "./ModelSelector";
// import { toast } from "sonner";

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

interface ImageGeneratorProps {
  onImageGenerated: (image: GeneratedImage) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export default function ImageGenerator({ onImageGenerated, isGenerating, setIsGenerating }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [aspectRatio, setAspectRatio] = useState('square');
  const [quality, setQuality] = useState('standard');
  const [selectedModel, setSelectedModel] = useState('replicate/black-forest-labs/flux-1.1-pro');
  const [error, setError] = useState<string | null>(null);

  const handlePromptSuggestion = (suggestion: string) => {
    setPrompt(prev => prev ? `${prev}, ${suggestion}` : suggestion);
  };

  const handleStyleSelect = (selectedStyle: string) => {
    setStyle(selectedStyle);
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          aspectRatio,
          quality,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.success && data.imageUrl) {
        const newImage: GeneratedImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: data.imageUrl,
          prompt: data.originalPrompt || prompt,
          timestamp: Date.now(),
          settings: {
            style,
            aspectRatio,
            quality,
            model: selectedModel
          }
        };

        onImageGenerated(newImage);
        // toast.success('Image generated successfully!');
        
        // Clear prompt for next generation
        setPrompt('');
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      // toast.error(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      generateImage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Prompt Input */}
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-white text-lg font-medium">
          Describe your image
        </Label>
        <Textarea
          id="prompt"
          placeholder="A serene mountain landscape at sunset with golden light reflecting on a calm lake..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
          className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none focus:border-purple-400 focus:ring-purple-400/20"
          disabled={isGenerating}
        />
        <p className="text-sm text-gray-400">
          Press Ctrl+Enter (⌘+Enter on Mac) to generate
        </p>
      </div>

      {/* Prompt Suggestions */}
      <PromptSuggestions onSuggestionClick={handlePromptSuggestion} disabled={isGenerating} />

      {/* AI Model Selection */}
      <ModelSelector 
        selectedModel={selectedModel} 
        onModelSelect={setSelectedModel} 
        disabled={isGenerating} 
      />

      {/* Style Presets */}
      <StylePresets onStyleSelect={handleStyleSelect} selectedStyle={style} disabled={isGenerating} />

      {/* Settings Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Aspect Ratio */}
        <div className="space-y-2">
          <Label className="text-white">Aspect Ratio</Label>
          <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isGenerating}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square (1:1)</SelectItem>
              <SelectItem value="portrait">Portrait (3:4)</SelectItem>
              <SelectItem value="landscape">Landscape (4:3)</SelectItem>
              <SelectItem value="widescreen">Widescreen (16:9)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quality */}
        <div className="space-y-2">
          <Label className="text-white">Quality</Label>
          <Select value={quality} onValueChange={setQuality} disabled={isGenerating}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="high">High Quality</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <div className="space-y-2">
          <Label className="text-white opacity-0">Generate</Label>
          <Button
            onClick={generateImage}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 h-10"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </Button>
        </div>
      </div>

      {/* Selected Style Badge */}
      {style && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Style:</span>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
            {style.charAt(0).toUpperCase() + style.slice(1)}
          </Badge>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-red-500/10 border-red-400/30">
          <p className="text-red-400 text-sm">{error}</p>
        </Card>
      )}
    </div>
  );
}