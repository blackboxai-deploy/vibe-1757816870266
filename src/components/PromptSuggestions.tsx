"use client";

import { Badge } from "@/components/ui/badge";

interface PromptSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  disabled?: boolean;
}

const suggestions = [
  // Lighting & Mood
  "golden hour lighting",
  "soft natural lighting",
  "dramatic shadows",
  "neon lights",
  "cinematic lighting",
  "ethereal glow",

  // Styles & Techniques
  "hyperrealistic",
  "oil painting style",
  "watercolor effect",
  "digital art",
  "vintage aesthetic",
  "minimalist design",

  // Settings & Atmosphere
  "misty morning",
  "urban cityscape",
  "cozy interior",
  "epic landscape",
  "magical forest",
  "futuristic city",

  // Quality & Detail
  "highly detailed",
  "professional photography",
  "8k ultra HD",
  "masterpiece quality",
  "award winning",
  "trending on artstation"
];

export default function PromptSuggestions({ onSuggestionClick, disabled = false }: PromptSuggestionsProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-white font-medium text-sm">Quick Enhancements</h4>
      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <Badge
            key={index}
            variant="outline"
            className={`
              cursor-pointer transition-all duration-200 
              bg-white/5 hover:bg-white/15 border-white/20 hover:border-purple-400/50
              text-gray-300 hover:text-white text-xs px-3 py-1
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => !disabled && onSuggestionClick(suggestion)}
          >
            {suggestion}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Click on any enhancement to add it to your prompt
      </p>
    </div>
  );
}