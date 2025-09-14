"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface StylePresetsProps {
  onStyleSelect: (style: string) => void;
  selectedStyle: string;
  disabled?: boolean;
}

const stylePresets = [
  {
    id: 'photorealistic',
    name: 'Photorealistic',
    description: 'Highly detailed, professional photography style',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative, stylized, beautiful art',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple, elegant design',
    gradient: 'from-gray-500 to-slate-500'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro, aged, nostalgic style',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon, futuristic, sci-fi aesthetic',
    gradient: 'from-green-500 to-teal-500'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Magical, ethereal, mystical',
    gradient: 'from-indigo-500 to-purple-500'
  }
];

export default function StylePresets({ onStyleSelect, selectedStyle, disabled = false }: StylePresetsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium text-sm">Style Presets</h4>
        {selectedStyle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStyleSelect('')}
            disabled={disabled}
            className="text-xs text-gray-400 hover:text-white hover:bg-white/10"
          >
            Clear Style
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stylePresets.map((preset) => (
          <Card
            key={preset.id}
            className={`
              relative overflow-hidden cursor-pointer transition-all duration-200 p-0
              ${selectedStyle === preset.id 
                ? 'ring-2 ring-purple-400 bg-white/15 border-purple-400/50' 
                : 'bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => !disabled && onStyleSelect(preset.id)}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${preset.gradient} opacity-20`} />
            
            {/* Content */}
            <div className="relative p-3 space-y-1">
              <h5 className="text-white font-medium text-sm">{preset.name}</h5>
              <p className="text-gray-400 text-xs leading-tight">{preset.description}</p>
            </div>
            
            {/* Selection Indicator */}
            {selectedStyle === preset.id && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-purple-400 rounded-full border-2 border-white" />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}