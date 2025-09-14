import { NextResponse } from 'next/server';
import { AIModel } from '@/lib/types';

// Available AI models API endpoint

const availableModels: AIModel[] = [
  {
    id: 'replicate/google/veo-3',
    name: 'Google Veo-3',
    description: 'Latest Google video generation model with superior quality and cinematic output',
    maxDuration: 300,
    isAvailable: true,
    capabilities: [
      'High Quality',
      'Cinematic Style',
      'Text-to-Video',
      'Long Duration',
      'Professional Grade'
    ]
  },
  {
    id: 'replicate/black-forest-labs/flux-schnell',
    name: 'Flux Schnell',
    description: 'Fast video generation with good quality, optimized for quick results',
    maxDuration: 180,
    isAvailable: true,
    capabilities: [
      'Fast Generation',
      'Good Quality',
      'Efficient Processing',
      'Text-to-Video',
      'Quick Results'
    ]
  },
  {
    id: 'custom/video-model-pro',
    name: 'Video Model Pro',
    description: 'Professional-grade video generation with advanced controls and customization',
    maxDuration: 600,
    isAvailable: true,
    capabilities: [
      'Professional Quality',
      'Long Duration',
      'Advanced Controls',
      'Custom Styling',
      'High Resolution'
    ]
  },
  {
    id: 'custom/experimental-model',
    name: 'Experimental Model',
    description: 'Cutting-edge experimental model with latest features (beta)',
    maxDuration: 120,
    isAvailable: false,
    capabilities: [
      'Experimental',
      'Beta Features',
      'Innovation Testing',
      'Limited Access'
    ]
  }
];

export async function GET(): Promise<NextResponse> {
  try {
    // Filter to only return available models
    const activeModels = availableModels.filter(model => model.isAvailable);
    
    return NextResponse.json(activeModels);
  } catch (error) {
    console.error('Models API error:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch available models'
    }, { status: 500 });
  }
}