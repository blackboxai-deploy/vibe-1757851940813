'use client';

// Video player component with playback controls

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { GeneratedVideo } from '@/lib/types';

interface VideoPreviewProps {
  video: GeneratedVideo;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  onDownload?: (video: GeneratedVideo) => void;
}

export function VideoPreview({ 
  video, 
  autoPlay = false, 
  showControls = true, 
  className,
  onDownload 
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const updatePlayState = () => setIsPlaying(!video.paused);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', updatePlayState);
    video.addEventListener('pause', updatePlayState);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', updatePlayState);
      video.removeEventListener('pause', updatePlayState);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const time = (value[0] / 100) * duration;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = async () => {
    if (!videoRef.current) return;

    try {
      if (!isFullscreen) {
        await videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Video Preview</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{video.model}</Badge>
              {video.metadata?.resolution && (
                <Badge variant="outline">{video.metadata.resolution}</Badge>
              )}
              <Badge 
                variant={video.status === 'completed' ? 'default' : 'secondary'}
              >
                {video.status}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={video.status !== 'completed'}
          >
            Download
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Video Player */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            src={video.videoUrl}
            autoPlay={autoPlay}
            muted={isMuted}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Video playback error:', e);
            }}
          >
            Your browser does not support the video tag.
          </video>

          {/* Overlay Controls */}
          {showControls && (
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={togglePlay}
                className="bg-black/50 hover:bg-black/70 text-white border-0"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </Button>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            <span className="font-medium">Prompt:</span> {video.prompt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Created: {new Date(video.createdAt).toLocaleDateString()}</span>
            {video.metadata?.fileSize && (
              <span>Size: {(video.metadata.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        {showControls && (
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={togglePlay}>
                  {isPlaying ? '⏸️' : '▶️'}
                </Button>
                <Button variant="outline" size="sm" onClick={toggleMute}>
                  {isMuted ? '🔇' : '🔊'}
                </Button>
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-xs text-muted-foreground">Vol:</span>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    className="w-16"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                  ⛶
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}