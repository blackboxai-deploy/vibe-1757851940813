'use client';

// Gallery item component for video display

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { GeneratedVideo } from '@/lib/types';

interface VideoCardProps {
  video: GeneratedVideo;
  onPlay?: (video: GeneratedVideo) => void;
  onDelete?: (videoId: string) => void;
  onDownload?: (video: GeneratedVideo) => void;
}

export function VideoCard({ video, onPlay, onDelete, onDownload }: VideoCardProps) {
  const [imageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleDownload = async () => {
    if (onDownload) {
      onDownload(video);
      return;
    }

    try {
      const response = await fetch(video.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getThumbnailUrl = () => {
    if (video.thumbnailUrl && !imageError) {
      return video.thumbnailUrl;
    }
    // Generate a placeholder thumbnail based on video content
    return `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/26b0cc4e-8ffe-4d9a-90db-6e8cc7c68f90.png 20))}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-accent/10 overflow-hidden">
        {!videoError ? (
          <video
            src={video.videoUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            muted
            preload="metadata"
            onError={() => setVideoError(true)}
            poster={getThumbnailUrl()}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-sm"></div>
              </div>
              <p className="text-sm text-muted-foreground">Video preview</p>
            </div>
          </div>
        )}

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onPlay && onPlay(video)}
            className="bg-white/90 hover:bg-white text-black border-0 shadow-lg"
          >
            ▶️ Play
          </Button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={video.status === 'completed' ? 'default' : 'secondary'}
            className="shadow-lg"
          >
            {video.status}
          </Badge>
        </div>

        {/* Duration Badge (if available) */}
        {video.duration && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="bg-black/50 text-white border-white/20">
              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Video Info */}
        <div className="space-y-2">
          <p className="text-sm font-medium line-clamp-2 leading-snug">
            {video.prompt}
          </p>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {video.model.includes('/') ? video.model.split('/').pop() : video.model}
            </Badge>
            {video.metadata?.resolution && (
              <Badge variant="outline" className="text-xs">
                {video.metadata.resolution}
              </Badge>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>
          {video.metadata?.fileSize && (
            <div className="flex justify-between">
              <span>Size:</span>
              <span>{formatFileSize(video.metadata.fileSize)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPlay && onPlay(video)}
            disabled={video.status !== 'completed'}
            className="flex-1"
          >
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={video.status !== 'completed'}
          >
            Download
          </Button>
          
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Video</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this video? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(video.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}