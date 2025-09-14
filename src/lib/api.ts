// API client functions for AI Video Generation

import { VideoGenerationRequest, VideoGenerationResponse, GeneratedVideo, AIModel } from './types';

// Custom endpoint configuration (no API keys required)
const API_CONFIG = {
  endpoint: 'https://oi-server.onrender.com/chat/completions',
  headers: {
    'customerId': 'cus_T3KyPvWsMIRaBz',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  }
};

export const DEFAULT_VIDEO_MODEL = 'replicate/google/veo-3';

export async function generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
  try {
    const response = await fetch('/api/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Video generation failed:', error);
    return {
      success: false,
      videoId: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getVideos(): Promise<GeneratedVideo[]> {
  try {
    const response = await fetch('/api/videos');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return [];
  }
}

export async function deleteVideo(videoId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/videos/${videoId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to delete video:', error);
    return false;
  }
}

export async function getAvailableModels(): Promise<AIModel[]> {
  try {
    const response = await fetch('/api/models');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return [];
  }
}

// Direct AI API call utility
export async function callAIAPI(prompt: string, model: string = DEFAULT_VIDEO_MODEL): Promise<any> {
  try {
    const response = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('AI API call failed:', error);
    throw error;
  }
}