'use client';

// Real-time progress tracking component for video generation

import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GenerationProgress as GenerationProgressType } from '@/lib/types';

interface GenerationProgressProps {
  progress: GenerationProgressType;
  onCancel?: () => void;
  showCancel?: boolean;
}

export function GenerationProgress({ progress, onCancel, showCancel = true }: GenerationProgressProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (progress.status === 'generating' || progress.status === 'processing') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [progress.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: GenerationProgressType['status']) => {
    switch (status) {
      case 'idle':
        return 'secondary';
      case 'preparing':
        return 'secondary';
      case 'generating':
        return 'default';
      case 'processing':
        return 'default';
      case 'completed':
        return 'success';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: GenerationProgressType['status']) => {
    switch (status) {
      case 'idle':
        return 'Ready';
      case 'preparing':
        return 'Preparing';
      case 'generating':
        return 'Generating';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  if (progress.status === 'idle') {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Video Generation</CardTitle>
            <CardDescription>Creating your AI-generated video</CardDescription>
          </div>
          <Badge variant={getStatusColor(progress.status) as any}>
            {getStatusText(progress.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress.progress)}%</span>
          </div>
          <Progress 
            value={progress.progress} 
            className="w-full" 
            max={100}
          />
        </div>

        {/* Status Message */}
        <div className="space-y-2">
          <p className="text-sm font-medium">{progress.message}</p>
          
          {progress.status === 'generating' && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Elapsed: {formatTime(elapsedTime)}</span>
              {progress.estimatedTimeRemaining && (
                <span>
                  Est. remaining: {formatTime(Math.max(0, progress.estimatedTimeRemaining - elapsedTime))}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Generation Steps Indicator */}
        {(progress.status === 'generating' || progress.status === 'processing') && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">Generation Steps:</div>
            <div className="grid grid-cols-4 gap-2">
              <div className={`text-center p-2 rounded text-xs ${progress.progress > 0 ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}>
                <div className="font-medium">Analyze</div>
                <div className="text-[10px] opacity-75 mt-1">Prompt</div>
              </div>
              <div className={`text-center p-2 rounded text-xs ${progress.progress > 25 ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}>
                <div className="font-medium">Generate</div>
                <div className="text-[10px] opacity-75 mt-1">Frames</div>
              </div>
              <div className={`text-center p-2 rounded text-xs ${progress.progress > 50 ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}>
                <div className="font-medium">Render</div>
                <div className="text-[10px] opacity-75 mt-1">Video</div>
              </div>
              <div className={`text-center p-2 rounded text-xs ${progress.progress > 75 ? 'bg-primary text-primary-foreground' : 'bg-accent'}`}>
                <div className="font-medium">Finalize</div>
                <div className="text-[10px] opacity-75 mt-1">Output</div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Button */}
        {showCancel && onCancel && (progress.status === 'generating' || progress.status === 'processing') && (
          <div className="flex justify-end pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCancel}
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              Cancel Generation
            </Button>
          </div>
        )}

        {/* Completion Message */}
        {progress.status === 'completed' && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="text-green-800 dark:text-green-200 text-sm font-medium">
              🎉 Video generated successfully!
            </div>
            <div className="text-green-600 dark:text-green-400 text-xs mt-1">
              Your video is ready for preview and download.
            </div>
          </div>
        )}

        {/* Error Message */}
        {progress.status === 'failed' && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="text-red-800 dark:text-red-200 text-sm font-medium">
              ❌ Generation failed
            </div>
            <div className="text-red-600 dark:text-red-400 text-xs mt-1">
              {progress.message || 'Please try again or contact support if the issue persists.'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}