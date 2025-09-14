'use client';

// Navigation component for AI Video Generation App

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  {
    name: 'Home',
    href: '/',
    description: 'Welcome to AI Video Generator'
  },
  {
    name: 'Generate',
    href: '/generate',
    description: 'Create new AI videos'
  },
  {
    name: 'Gallery',
    href: '/gallery', 
    description: 'View your video collection'
  },
  {
    name: 'Settings',
    href: '/settings',
    description: 'Configure AI models and preferences'
  }
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="h-4 w-4 bg-white rounded-sm"></div>
            </div>
            <span className="font-bold text-xl">AI Video Generator</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 text-muted-foreground hover:text-foreground">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm mb-1"></span>
                <span className="bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm mb-1"></span>
                <span className="bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t py-4">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors rounded-md',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}