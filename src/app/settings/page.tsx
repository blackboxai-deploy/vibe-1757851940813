'use client';

// Settings page for AI model and app configuration

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModelSelector } from '@/components/ModelSelector';
import { useAppContext } from '@/contexts/AppContext';

export default function SettingsPage() {
  const { state, updateSettings } = useAppContext();
  const [systemPrompt, setSystemPrompt] = useState(state.settings.systemPrompt);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSystemPromptChange = (value: string) => {
    setSystemPrompt(value);
    setHasUnsavedChanges(value !== state.settings.systemPrompt);
  };

  const handleSaveSettings = () => {
    updateSettings({
      systemPrompt: systemPrompt
    });
    setHasUnsavedChanges(false);
  };

  const handleResetPrompt = () => {
    const defaultPrompt = 'Generate a high-quality video based on the following description. Focus on cinematic quality, smooth motion, and visual appeal.';
    setSystemPrompt(defaultPrompt);
    setHasUnsavedChanges(defaultPrompt !== state.settings.systemPrompt);
  };

  const handleVideoQualityChange = (quality: 'standard' | 'high' | 'ultra') => {
    updateSettings({ videoQuality: quality });
  };

  const handleAutoSaveChange = (enabled: boolean) => {
    updateSettings({ autoSave: enabled });
  };

  const apiConfig = {
    endpoint: 'https://oi-server.onrender.com/chat/completions',
    headers: {
      'customerId': 'cus_T3KyPvWsMIRaBz',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer xxx'
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure AI models, customize generation behavior, and manage your preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Model Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>
                Choose your preferred video generation model and customize its behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ModelSelector />
              
              {/* System Prompt Customization */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Button variant="outline" size="sm" onClick={handleResetPrompt}>
                    Reset to Default
                  </Button>
                </div>
                <Textarea
                  id="system-prompt"
                  placeholder="Enter custom system prompt for AI video generation..."
                  value={systemPrompt}
                  onChange={(e) => handleSystemPromptChange(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="text-xs text-muted-foreground">
                  This prompt guides how the AI interprets and generates your videos. Be specific about style, quality, and visual preferences.
                </div>
              </div>

              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="text-yellow-800 dark:text-yellow-200 text-sm">
                    You have unsaved changes to your system prompt.
                  </div>
                  <Button size="sm" onClick={handleSaveSettings}>
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* App Preferences */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customize your video generation experience and output quality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Quality */}
              <div className="space-y-3">
                <Label>Default Video Quality</Label>
                <Select 
                  value={state.settings.videoQuality} 
                  onValueChange={handleVideoQualityChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      <div className="space-y-1">
                        <div className="font-medium">Standard</div>
                        <div className="text-xs text-muted-foreground">720p, faster generation</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="space-y-1">
                        <div className="font-medium">High</div>
                        <div className="text-xs text-muted-foreground">1080p, balanced quality</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="ultra">
                      <div className="space-y-1">
                        <div className="font-medium">Ultra</div>
                        <div className="text-xs text-muted-foreground">4K, maximum quality</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-save generated videos</Label>
                  <div className="text-xs text-muted-foreground">
                    Automatically save videos to your gallery when generation completes
                  </div>
                </div>
                <Switch
                  checked={state.settings.autoSave}
                  onCheckedChange={handleAutoSaveChange}
                />
              </div>

              {/* Storage Info */}
              <div className="bg-accent/10 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Storage Information</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-muted-foreground">Total Videos</div>
                    <div className="font-medium">{state.videos.length}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Completed</div>
                    <div className="font-medium text-green-600">
                      {state.videos.filter(v => v.status === 'completed').length}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            API Configuration
            <Badge variant="secondary">No API Keys Required</Badge>
          </CardTitle>
          <CardDescription>
            Current AI API endpoint configuration for video generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-accent/5 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Endpoint</Label>
                <div className="font-mono text-xs bg-background rounded p-2 mt-1">
                  {apiConfig.endpoint}
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Customer ID</Label>
                <div className="font-mono text-xs bg-background rounded p-2 mt-1">
                  {apiConfig.headers.customerId}
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              ✅ This configuration uses a secure custom endpoint that requires no API keys from you. 
              All video generation requests are processed through our managed AI gateway.
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Available Models</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="text-blue-800 dark:text-blue-200">
                • Google Veo-3 (Recommended)
              </div>
              <div className="text-blue-800 dark:text-blue-200">
                • Flux Schnell (Fast)
              </div>
              <div className="text-blue-800 dark:text-blue-200">
                • Video Model Pro
              </div>
              <div className="text-blue-800 dark:text-blue-200">
                • Custom Models
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Section */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Reset & Data Management</CardTitle>
          <CardDescription>
            Clear your data or reset settings to defaults. These actions cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => {
                const confirmed = window.confirm('Reset all settings to default values?');
                if (confirmed) {
                  updateSettings({
                    defaultModel: 'replicate/google/veo-3',
                    systemPrompt: 'Generate a high-quality video based on the following description. Focus on cinematic quality, smooth motion, and visual appeal.',
                    autoSave: true,
                    videoQuality: 'high'
                  });
                  setSystemPrompt('Generate a high-quality video based on the following description. Focus on cinematic quality, smooth motion, and visual appeal.');
                  setHasUnsavedChanges(false);
                }
              }}
            >
              Reset Settings
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                const confirmed = window.confirm('Delete all generated videos? This cannot be undone.');
                if (confirmed) {
                  localStorage.removeItem('generated-videos');
                  window.location.reload();
                }
              }}
            >
              Clear All Videos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}