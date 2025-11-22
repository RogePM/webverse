'use client';

import React, { useEffect, useState } from 'react';
import { Menu, Bell, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// 1. Import hooks
import { usePantry } from '@/components/providers/PantryProvider';
import { createBrowserClient } from '@supabase/ssr';

export function TopBar({ activeView, onMenuClick }) {
  const { pantryId, userRole } = usePantry();
  const [pantryName, setPantryName] = useState('Loading...');
  const [userEmail, setUserEmail] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Fetch Pantry Name & User Email
  useEffect(() => {
    const fetchDetails = async () => {
      // Get User
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email);

      // Get Pantry Name
      if (pantryId) {
        const { data: pantry } = await supabase
          .from('food_pantries')
          .select('name')
          .eq('pantry_id', pantryId)
          .single();
        
        if (pantry) setPantryName(pantry.name);
      }
    };
    fetchDetails();
  }, [pantryId, supabase]);

  // Get initials for Avatar
  const getInitials = (email) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm md:px-8">
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
        
        {/* 2. Display Real Pantry Name */}
        <Button variant="ghost" className="text-muted-foreground hidden sm:flex">
          {pantryName}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        
        <Avatar>
          <AvatarFallback>
            {getInitials(userEmail)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}