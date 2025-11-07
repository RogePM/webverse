'use client';

import React from 'react';
import { Menu, Bell, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TopBar({ activeView, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b  px-4 backdrop-blur-sm md:px-8">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold tracking-tight">{activeView}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        
        {/* Mock Org Switcher */}
        <Button variant="ghost" className="text-muted-foreground">
          Main Warehouse
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        
        <Avatar>
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

