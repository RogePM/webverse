'use client';

import React, { useEffect, useState } from 'react';
import { Menu, ChevronDown, Copy, Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePantry } from '@/components/providers/PantryProvider';
import { createBrowserClient } from '@supabase/ssr';

export function TopBar({ activeView, onMenuClick }) {
  const { pantryId, userRole } = usePantry();
  
  // Data States
  const [pantryData, setPantryData] = useState(null);
  const [userName, setUserName] = useState(''); // Changed from userEmail
  
  // UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchDetails = async () => {
      // 1. Get User Session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 2. Fetch User Profile Name
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('name')
            .eq('user_id', user.id)
            .single();
            
        if (profile) setUserName(profile.name); // Set the real name
        else setUserName(user.email); // Fallback if name is missing
      }

      // 3. Fetch Pantry Details
      if (pantryId) {
        const { data: pantry } = await supabase
          .from('food_pantries')
          .select('name, join_code, address')
          .eq('pantry_id', pantryId)
          .single();
        
        if (pantry) setPantryData(pantry);
      }
    };
    fetchDetails();
  }, [pantryId, supabase]);

  // Click outside to close dropdown
  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    if (isMenuOpen) window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [isMenuOpen]);

  const handleCopyCode = (e) => {
    e.stopPropagation();
    if (pantryData?.join_code) {
      navigator.clipboard.writeText(pantryData.join_code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm md:px-8">
      
      {/* --- LEFT SIDE: Hamburger + Title --- */}
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold tracking-tight leading-none truncate">
                {activeView}
            </h2>
            <span className="text-xs text-muted-foreground hidden md:block mt-1">
                Overview
            </span>
        </div>
      </div>
      
      {/* --- RIGHT SIDE: Org Info + User Profile --- */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        
        {/* Organization Dropdown */}
        <div className="relative">
            <Button 
                variant="ghost" 
                className={`flex items-center gap-2 h-9 px-2 md:px-3 transition-all ${isMenuOpen ? 'bg-accent' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                }}
            >
                {/* Hide text on very small screens if needed, or truncate */}
                <span className="text-sm font-medium max-w-[100px] md:max-w-[150px] truncate">
                    {pantryData?.name || 'Loading...'}
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* The Dropdown Menu - SOLID WHITE BACKGROUND FIX */}
            {isMenuOpen && (
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-12 w-72 rounded-xl border border-gray-200 bg-white p-4 text-gray-900 shadow-xl z-50"
                >
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold text-sm leading-none text-black">{pantryData?.name}</h4>
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{pantryData?.address || 'No address set'}</span>
                            </div>
                        </div>
                        
                        <div className="h-px bg-gray-100" />
                        
                        {/* Join Code Section */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col gap-2">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                Invite Code
                            </span>
                            <div className="flex items-center justify-between">
                                <code className="font-mono text-lg font-bold tracking-widest text-black">
                                    {pantryData?.join_code || '....'}
                                </code>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-6 w-6 hover:bg-white hover:shadow-sm"
                                    onClick={handleCopyCode}
                                >
                                    {isCopied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3 text-gray-500" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Vertical Divider (Hidden on Mobile) */}
        <div className="h-6 w-px bg-border hidden md:block" />
        
        {/* User Profile Section */}
        <div className="flex items-center gap-3">
            {/* Text Info - HIDDEN ON MOBILE to prevent breaking layout */}
            <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-medium leading-none max-w-[120px] truncate text-black">
                    {userName}
                </span>
                <span className="text-[10px] text-muted-foreground capitalize bg-secondary px-1.5 rounded mt-1">
                    {userRole || 'User'}
                </span>
            </div>
            
            {/* Avatar - Visible on all screens */}
            <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-border cursor-pointer hover:ring-2 hover:ring-ring transition-all">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {getInitials(userName)}
                </AvatarFallback>
            </Avatar>
        </div>
      </div>
    </header>
  );
}