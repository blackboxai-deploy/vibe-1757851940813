'use client';

// Global state management for AI Video Generation App

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, GeneratedVideo, GenerationProgress, AppSettings } from '@/lib/types';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addVideo: (video: GeneratedVideo) => void;
  updateGenerationProgress: (progress: GenerationProgress) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  selectModel: (modelId: string) => void;
}

type AppAction =
  | { type: 'SET_VIDEOS'; payload: GeneratedVideo[] }
  | { type: 'ADD_VIDEO'; payload: GeneratedVideo }
  | { type: 'REMOVE_VIDEO'; payload: string }
  | { type: 'UPDATE_PROGRESS'; payload: GenerationProgress }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SELECT_MODEL'; payload: string }
  | { type: 'CLEAR_PROGRESS' };

const initialState: AppState = {
  videos: [],
  currentGeneration: null,
  settings: {
    defaultModel: 'replicate/google/veo-3',
    systemPrompt: 'Generate a high-quality video based on the following description. Focus on cinematic quality, smooth motion, and visual appeal.',
    autoSave: true,
    videoQuality: 'high'
  },
  selectedModel: 'replicate/google/veo-3'
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIDEOS':
      return { ...state, videos: action.payload };
    
    case 'ADD_VIDEO':
      return { 
        ...state, 
        videos: [action.payload, ...state.videos] 
      };
    
    case 'REMOVE_VIDEO':
      return {
        ...state,
        videos: state.videos.filter(video => video.id !== action.payload)
      };
    
    case 'UPDATE_PROGRESS':
      return { ...state, currentGeneration: action.payload };
    
    case 'CLEAR_PROGRESS':
      return { ...state, currentGeneration: null };
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    
    case 'SELECT_MODEL':
      return { ...state, selectedModel: action.payload };
    
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load videos from localStorage on mount
  useEffect(() => {
    const savedVideos = localStorage.getItem('generated-videos');
    if (savedVideos) {
      try {
        const videos = JSON.parse(savedVideos);
        dispatch({ type: 'SET_VIDEOS', payload: videos });
      } catch (error) {
        console.error('Failed to load saved videos:', error);
      }
    }

    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
  }, []);

  // Save videos to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('generated-videos', JSON.stringify(state.videos));
  }, [state.videos]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  const addVideo = (video: GeneratedVideo) => {
    dispatch({ type: 'ADD_VIDEO', payload: video });
  };

  const updateGenerationProgress = (progress: GenerationProgress) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const selectModel = (modelId: string) => {
    dispatch({ type: 'SELECT_MODEL', payload: modelId });
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      addVideo,
      updateGenerationProgress,
      updateSettings,
      selectModel
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}