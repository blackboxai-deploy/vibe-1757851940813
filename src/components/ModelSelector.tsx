'use client';

// AI model selection component

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';

const availableModels = [
  {
    id: 'replicate/google/veo-3',
    name: 'Google Veo-3',
    description: 'Latest Google video generation model with superior quality',
    maxDuration: 300,
    capabilities: ['High Quality', 'Cinematic', 'Text-to-Video'],
    isRecommended: true
  },
  {
    id: 'replicate/black-forest-labs/flux-schnell',
    name: 'Flux Schnell',
    description: 'Fast video generation with good quality',
    maxDuration: 180,
    capabilities: ['Fast Generation', 'Good Quality', 'Efficient'],
    isRecommended: false
  },
  {
    id: 'custom/video-model-pro',
    name: 'Video Model Pro',
    description: 'Professional-grade video generation',
    maxDuration: 600,
    capabilities: ['Professional Quality', 'Long Duration', 'Advanced'],
    isRecommended: false
  }
];

interface ModelSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function ModelSelector({ value, onValueChange, className }: ModelSelectorProps) {
  const { state, selectModel } = useAppContext();
  
  const selectedModel = value || state.selectedModel;
  const currentModel = availableModels.find(model => model.id === selectedModel);

  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      selectModel(newValue);
    }
  };

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <div className="space-y-2">
        <Label htmlFor="model-select">AI Video Model</Label>
        <Select value={selectedModel} onValueChange={handleValueChange}>
          <SelectTrigger id="model-select">
            <SelectValue placeholder="Choose a video generation model" />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((model) => (
              <SelectItem key={model.id} value={model.id} className="py-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    {model.isRecommended && (
                      <Badge variant="secondary" className="text-xs">Recommended</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{model.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {model.capabilities.slice(0, 2).map((capability, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model Details */}
      {currentModel && (
        <div className="bg-accent/10 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{currentModel.name}</h4>
            {currentModel.isRecommended && (
              <Badge variant="default">Recommended</Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            {currentModel.description}
          </p>
          
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Max Duration:</span>{' '}
              <span className="text-muted-foreground">{currentModel.maxDuration}s</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentModel.capabilities.map((capability, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {capability}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}