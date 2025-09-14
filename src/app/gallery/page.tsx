'use client';

// Gallery page with video history and management

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { VideoCard } from '@/components/VideoCard';
import { VideoPreview } from '@/components/VideoPreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppContext } from '@/contexts/AppContext';
import { GeneratedVideo } from '@/lib/types';
import Link from 'next/link';

export default function GalleryPage() {
  const { state, dispatch } = useAppContext();
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort videos
  const filteredVideos = state.videos
    .filter(video => {
      // Text search
      const matchesSearch = searchQuery === '' || 
        video.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.model.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesFilter = filterBy === 'all' || video.status === filterBy;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'model':
          return a.model.localeCompare(b.model);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const handlePlayVideo = (video: GeneratedVideo) => {
    setSelectedVideo(video);
  };

  const handleDeleteVideo = (videoId: string) => {
    dispatch({ type: 'REMOVE_VIDEO', payload: videoId });
  };

  const handleDownloadVideo = async (video: GeneratedVideo) => {
    try {
      const response = await fetch(video.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-video-${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const clearAllVideos = () => {
    if (window.confirm('Are you sure you want to delete all videos? This action cannot be undone.')) {
      dispatch({ type: 'SET_VIDEOS', payload: [] });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Video Gallery</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          View and manage all your AI-generated videos. Download, share, or organize your creative work.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
          {/* Search */}
          <Input
            placeholder="Search videos by prompt or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="model">By model</SelectItem>
              <SelectItem value="status">By status</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter */}
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All videos</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="generating">Generating</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href="/generate">
            <Button variant="default">
              Generate New Video
            </Button>
          </Link>
          {state.videos.length > 0 && (
            <Button variant="outline" onClick={clearAllVideos} className="text-destructive">
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-accent/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{state.videos.length}</div>
          <div className="text-sm text-muted-foreground">Total Videos</div>
        </div>
        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {state.videos.filter(v => v.status === 'completed').length}
          </div>
          <div className="text-sm text-green-600">Completed</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {state.videos.filter(v => v.status === 'generating').length}
          </div>
          <div className="text-sm text-yellow-600">Generating</div>
        </div>
        <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {state.videos.filter(v => v.status === 'failed').length}
          </div>
          <div className="text-sm text-red-600">Failed</div>
        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          {state.videos.length === 0 ? (
            // No videos at all
            <>
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">No videos generated yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start creating amazing AI videos by clicking the button below
                </p>
              </div>
              <Link href="/generate">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Generate Your First Video
                </Button>
              </Link>
            </>
          ) : (
            // No results from search/filter
            <>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">No videos match your search</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setFilterBy('all');
                  setSortBy('newest');
                }}
              >
                Clear Filters
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPlay={handlePlayVideo}
              onDelete={handleDeleteVideo}
              onDownload={handleDownloadVideo}
            />
          ))}
        </div>
      )}

      {/* Video Preview Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Video Preview</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <VideoPreview
              video={selectedVideo}
              autoPlay={true}
              showControls={true}
              onDownload={handleDownloadVideo}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}