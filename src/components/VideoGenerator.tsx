'use client';

// Main video generation interface component

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModelSelector } from './ModelSelector';
import { GenerationProgress } from './GenerationProgress';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { useAppContext } from '@/contexts/AppContext';

interface VideoGeneratorProps {
  onVideoGenerated?: (videoUrl: string) => void;
}

export function VideoGenerator({ onVideoGenerated }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState([30]);
  const [resolution, setResolution] = useState('1920x1080');
  const [style, setStyle] = useState('cinematic');

  const { state } = useAppContext();
  const { isGenerating, currentProgress, startGeneration, cancelGeneration } = useVideoGeneration();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const request = {
      prompt: prompt.trim(),
      model: state.selectedModel,
      settings: {
        duration: duration[0],
        resolution,
        style
      }
    };

    const result = await startGeneration(request);
    
    if (result && onVideoGenerated) {
      onVideoGenerated(result.videoUrl);
    }
  };

  const examplePrompts = [
    "A majestic eagle soaring through mountain valleys with cinematic lighting",
    "Waves crashing on a tropical beach at sunset with golden hour lighting",
    "A bustling cyberpunk city street at night with neon lights and rain",
    "Time-lapse of a flower blooming in a sunlit garden",
    "An astronaut floating in space with Earth visible in the background"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Video Generator</CardTitle>
          <CardDescription>
            Create stunning videos using advanced AI technology. Describe your vision and watch it come to life.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-3">
            <Label htmlFor="prompt">Video Description</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the video you want to generate in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={isGenerating}
            />
            <div className="text-xs text-muted-foreground">
              Tip: Be descriptive about lighting, camera angles, and visual style for best results.
            </div>
          </div>

          {/* Example Prompts */}
          <div className="space-y-3">
            <Label>Example Prompts</Label>
            <div className="grid grid-cols-1 gap-2">
              {examplePrompts.slice(0, 3).map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-3 text-sm bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors border border-transparent hover:border-accent"
                  disabled={isGenerating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <ModelSelector />

          {/* Generation Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Duration */}
            <div className="space-y-3">
              <Label htmlFor="duration">Duration: {duration[0]}s</Label>
              <Slider
                id="duration"
                min={10}
                max={300}
                step={10}
                value={duration}
                onValueChange={setDuration}
                className="w-full"
                disabled={isGenerating}
              />
              <div className="text-xs text-muted-foreground">
                10s - 300s (5 minutes max)
              </div>
            </div>

            {/* Resolution */}
            <div className="space-y-3">
              <Label htmlFor="resolution">Resolution</Label>
              <Select value={resolution} onValueChange={setResolution} disabled={isGenerating}>
                <SelectTrigger id="resolution">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1280x720">HD (720p)</SelectItem>
                  <SelectItem value="1920x1080">Full HD (1080p)</SelectItem>
                  <SelectItem value="2560x1440">2K (1440p)</SelectItem>
                  <SelectItem value="3840x2160">4K (2160p)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Style */}
            <div className="space-y-3">
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                <SelectTrigger id="style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                  <SelectItem value="animation">Animation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex flex-col gap-4">
            <Button 
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isGenerating ? 'Generating Video...' : 'Generate Video'}
            </Button>

            {/* System Prompt Display */}
            <div className="bg-accent/10 rounded-lg p-4 space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">System Prompt:</Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {state.settings.systemPrompt}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Display */}
      {currentProgress && currentProgress.status !== 'idle' && (
        <GenerationProgress 
          progress={currentProgress}
          onCancel={cancelGeneration}
          showCancel={true}
        />
      )}
    </div>
  );
}