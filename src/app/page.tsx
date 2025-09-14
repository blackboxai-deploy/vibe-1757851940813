'use client';

// Landing/Home page for AI Video Generation App

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const features = [
    {
      title: 'AI-Powered Generation',
      description: 'Create stunning videos using advanced AI models like Google Veo-3',
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cd323088-cee7-467d-8792-50e31289efc3.png'
    },
    {
      title: 'Real-time Progress',
      description: 'Track your video generation with live progress updates and status monitoring',
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3eebfefd-47ec-4407-9077-e88086d394c6.png'
    },
    {
      title: 'Video Gallery',
      description: 'Organize and manage all your generated videos in one beautiful gallery',
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0c13401f-a651-4305-ad11-a5efe9c1e2fb.png'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Create Videos with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into stunning videos using cutting-edge AI technology. 
            Generate professional-quality content in minutes, not hours.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
          <img 
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a020421a-8f2f-44ba-9f7f-c87636a17fc9.png" 
            alt="AI video generation hero showcase with cinematic quality and modern interface"
            className="w-full h-auto"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/generate">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Start Generating
            </Button>
          </Link>
          <Link href="/gallery">
            <Button variant="outline" size="lg">
              View Gallery
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create amazing AI-generated videos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video">
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-accent/5 rounded-xl p-8 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">Simple steps to create your AI videos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold">Describe Your Video</h3>
            <p className="text-muted-foreground">
              Enter a detailed prompt describing the video you want to create
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold">AI Generation</h3>
            <p className="text-muted-foreground">
              Our AI models process your request and generate your video
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold">Download & Share</h3>
            <p className="text-muted-foreground">
              Preview your video and download it in high quality
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Ready to Create?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of creators using AI to produce amazing video content
          </p>
        </div>
        
        <Link href="/generate">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Get Started Now
          </Button>
        </Link>
      </section>
    </div>
  );
}