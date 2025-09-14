'use client';

// Video generation page with core interface

import React, { useState } from 'react';
import { VideoGenerator } from '@/components/VideoGenerator';
import { VideoPreview } from '@/components/VideoPreview';
import { useAppContext } from '@/contexts/AppContext';

export default function GeneratePage() {
  const [lastGeneratedVideo, setLastGeneratedVideo] = useState<string | null>(null);
  const { state } = useAppContext();

  // Find the most recent video that matches the last generated URL
  const currentVideo = lastGeneratedVideo 
    ? state.videos.find(video => video.videoUrl === lastGeneratedVideo)
    : state.videos[0]; // Show the most recent video if no specific one is set

  const handleVideoGenerated = (videoUrl: string) => {
    setLastGeneratedVideo(videoUrl);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Generate AI Videos</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create stunning videos using advanced AI technology. Describe your vision and watch it come to life with professional-quality results.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generator Panel */}
        <div className="space-y-6">
          <VideoGenerator onVideoGenerated={handleVideoGenerated} />
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {currentVideo ? (
            <VideoPreview 
              video={currentVideo}
              autoPlay={false}
              showControls={true}
            />
          ) : (
            <div className="h-full bg-accent/10 rounded-lg border-2 border-dashed border-accent flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">No video generated yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter a prompt and click "Generate Video" to see your creation here
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Generation Tips */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Tips for Better Videos</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Be specific about lighting, camera angles, and visual style</li>
              <li>• Include details about movement, pacing, and atmosphere</li>
              <li>• Mention color palettes or visual references when helpful</li>
              <li>• Keep prompts focused but descriptive (50-200 words work best)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}