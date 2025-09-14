'use client';

// Custom hook for video generation logic

import { useState, useCallback } from 'react';
import { generateVideo } from '@/lib/api';
import { useAppContext } from '@/contexts/AppContext';
import { VideoGenerationRequest, GeneratedVideo } from '@/lib/types';

export function useVideoGeneration() {
  const { state, addVideo, updateGenerationProgress } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const startGeneration = useCallback(async (request: VideoGenerationRequest) => {
    if (isGenerating) return;

    setIsGenerating(true);
    
    // Update progress to preparing state
    updateGenerationProgress({
      status: 'preparing',
      progress: 0,
      message: 'Preparing video generation request...'
    });

    try {
      // Simulate initial progress
      updateGenerationProgress({
        status: 'generating',
        progress: 10,
        message: 'Sending request to AI model...',
        estimatedTimeRemaining: 900 // 15 minutes in seconds
      });

      const response = await generateVideo(request);

      if (response.success && response.videoUrl) {
        // Final progress update
        updateGenerationProgress({
          status: 'completed',
          progress: 100,
          message: 'Video generation completed!'
        });

        // Create video object
        const newVideo: GeneratedVideo = {
          id: response.videoId,
          prompt: request.prompt,
          model: request.model,
          videoUrl: response.videoUrl,
          createdAt: new Date().toISOString(),
          status: 'completed'
        };

        // Add to state
        addVideo(newVideo);

        // Clear progress after a delay
        setTimeout(() => {
          updateGenerationProgress({
            status: 'idle',
            progress: 0,
            message: ''
          });
        }, 3000);

        return newVideo;
      } else {
        throw new Error(response.error || 'Video generation failed');
      }
    } catch (error) {
      console.error('Video generation error:', error);
      
      updateGenerationProgress({
        status: 'failed',
        progress: 0,
        message: error instanceof Error ? error.message : 'Generation failed'
      });

      // Clear error after delay
      setTimeout(() => {
        updateGenerationProgress({
          status: 'idle',
          progress: 0,
          message: ''
        });
      }, 5000);
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, updateGenerationProgress, addVideo]);

  const cancelGeneration = useCallback(() => {
    if (isGenerating) {
      updateGenerationProgress({
        status: 'failed',
        progress: 0,
        message: 'Generation cancelled by user'
      });
      setIsGenerating(false);

      setTimeout(() => {
        updateGenerationProgress({
          status: 'idle',
          progress: 0,
          message: ''
        });
      }, 2000);
    }
  }, [isGenerating, updateGenerationProgress]);

  return {
    isGenerating,
    currentProgress: state.currentGeneration,
    startGeneration,
    cancelGeneration,
    generatedVideos: state.videos
  };
}