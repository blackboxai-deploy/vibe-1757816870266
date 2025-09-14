"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
  disabled?: boolean;
}

const modelCategories = [
  {
    category: "Replicate (FLUX) - Partially Available ✅",
    provider: "Replicate",
    models: [
      {
        id: 'replicate/black-forest-labs/flux-1.1-pro',
        name: 'FLUX 1.1 Pro',
        description: 'Ultra-high quality, state-of-the-art open-source model (VERIFIED WORKING)',
        badge: 'Ultra HD',
        badgeColor: 'from-pink-500 to-rose-500',
        gradient: 'from-pink-500 to-rose-600',
        available: true
      },
      {
        id: 'replicate/black-forest-labs/flux-dev',
        name: 'FLUX Dev',
        description: 'Development version with fast generation times - Integration in progress',
        badge: 'Fast',
        badgeColor: 'from-indigo-500 to-blue-500',
        gradient: 'from-indigo-500 to-blue-600',
        available: false
      },
      {
        id: 'replicate/black-forest-labs/flux-schnell',
        name: 'FLUX Schnell',
        description: 'Fastest FLUX variant for quick iterations - Integration in progress',
        badge: 'Instant',
        badgeColor: 'from-yellow-500 to-amber-500',
        gradient: 'from-yellow-500 to-amber-600',
        available: false
      }
    ]
  },
  {
    category: "OpenAI (ChatGPT) - Coming Soon 🔄",
    provider: "OpenAI",
    models: [
      {
        id: 'openai-dalle-3',
        name: 'DALL-E 3',
        description: 'Latest OpenAI model - Integration in progress',
        badge: 'Premium',
        badgeColor: 'from-green-500 to-emerald-500',
        gradient: 'from-green-500 to-emerald-600',
        available: false
      },
      {
        id: 'openai-dalle-2',
        name: 'DALL-E 2',
        description: 'Previous generation OpenAI model - Integration in progress',
        badge: 'Standard',
        badgeColor: 'from-blue-500 to-cyan-500',
        gradient: 'from-blue-500 to-cyan-600',
        available: false
      }
    ]
  },
  {
    category: "Google AI - Coming Soon 🔄",
    provider: "Google",
    models: [
      {
        id: 'google-imagen-3',
        name: 'Imagen 3.0',
        description: 'Google\'s latest image generation model - Integration in progress',
        badge: 'Latest',
        badgeColor: 'from-purple-500 to-violet-500',
        gradient: 'from-purple-500 to-violet-600',
        available: false
      },
      {
        id: 'google-imagen-2',
        name: 'Imagen 2.0',
        description: 'Advanced Google model - Integration in progress',
        badge: 'Popular',
        badgeColor: 'from-orange-500 to-red-500',
        gradient: 'from-orange-500 to-red-600',
        available: false
      }
    ]
  },
  {
    category: "Stability AI - Coming Soon 🔄",
    provider: "Stability AI",
    models: [
      {
        id: 'stability-ai/stable-diffusion-3-medium',
        name: 'Stable Diffusion 3 Medium',
        description: 'Latest Stability AI model - Integration in progress',
        badge: 'New',
        badgeColor: 'from-teal-500 to-cyan-500',
        gradient: 'from-teal-500 to-cyan-600',
        available: false
      },
      {
        id: 'stability-ai/stable-diffusion-xl-base-1.0',
        name: 'SDXL Base',
        description: 'High resolution Stable Diffusion XL model - Integration in progress',
        badge: 'HD',
        badgeColor: 'from-slate-500 to-gray-500',
        gradient: 'from-slate-500 to-gray-600',
        available: false
      }
    ]
  }
];

export default function ModelSelector({ selectedModel, onModelSelect, disabled = false }: ModelSelectorProps) {
  const getSelectedModelInfo = () => {
    for (const category of modelCategories) {
      const model = category.models.find(m => m.id === selectedModel);
      if (model) {
        return { ...model, provider: category.provider };
      }
    }
    return null;
  };

  const selectedInfo = getSelectedModelInfo();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium text-sm">AI Model Selection</h4>
        {selectedInfo && (
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={`bg-gradient-to-r ${selectedInfo.badgeColor} text-white border-0`}
            >
              {selectedInfo.provider}
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {modelCategories.map((category) => (
          <div key={category.category}>
            <h5 className="text-gray-300 font-medium text-xs mb-2 flex items-center">
              <span className="mr-2">{category.category}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent"></div>
            </h5>
            
            <div className="grid grid-cols-1 gap-2">
              {category.models.map((model) => (
                <Card
                  key={model.id}
                  className={`
                    relative overflow-hidden transition-all duration-200 p-0
                    ${selectedModel === model.id 
                      ? 'ring-2 ring-purple-400 bg-white/15 border-purple-400/50' 
                      : 'bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${!model.available ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  onClick={() => !disabled && model.available && onModelSelect(model.id)}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${model.gradient} opacity-10`} />
                  
                  {/* Content */}
                  <div className="relative p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h6 className={`font-medium text-sm ${model.available ? 'text-white' : 'text-gray-400'}`}>
                        {model.name}
                      </h6>
                      <div className="flex items-center space-x-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-1 bg-gradient-to-r ${model.badgeColor} text-white border-0`}
                        >
                          {model.badge}
                        </Badge>
                        {!model.available && (
                          <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                          >
                            Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs leading-tight ${model.available ? 'text-gray-400' : 'text-gray-500'}`}>
                      {model.description}
                    </p>
                  </div>
                  
                  {/* Selection Indicator */}
                  {selectedModel === model.id && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-purple-400 rounded-full border-2 border-white" />
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Model Info */}
      {selectedInfo && (
        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20">
          <div className="flex items-start space-x-3">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${selectedInfo.gradient} mt-1`}></div>
            <div className="flex-1">
              <h6 className="text-white font-medium text-sm mb-1">{selectedInfo.name}</h6>
              <p className="text-gray-300 text-xs">{selectedInfo.description}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Availability Notice */}
      <div className="text-xs text-gray-500 bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full mt-1 flex-shrink-0"></div>
          <div>
            <p className="text-gray-400 mb-1"><strong>Currently Available:</strong> FLUX 1.1 Pro is fully functional and verified</p>
            <p className="text-gray-500"><strong>Coming Soon:</strong> Additional FLUX models, OpenAI DALL-E, Google Imagen, and Stability AI integration in development</p>
          </div>
        </div>
      </div>
    </div>
  );
}