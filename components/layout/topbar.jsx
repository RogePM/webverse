'use client';

import React, { useEffect, useState } from 'react';
import { 
  Menu, 
  ChevronDown, 
  Copy, 
  Check, 
  MapPin, 
  Building2, 
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { usePantry } from '@/components/providers/PantryProvider';
import { createBrowserClient } from '@supabase/ssr';

export function TopBar({ activeView, onMenuClick }) {
  const { pantryId, userRole } = usePantry();
  
  // Data States
  const [pantryData, setPantryData] = useState(null);
  const [userData, setUserData] = useState({ name: '', email: '', avatarUrl: '' });
  
  // UI States
  const [isCopied, setIsCopied] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchDetails = async () => {
      // 1. Get User Session & Metadata
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Google Metadata is automatically stored here
        setUserData({
            name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
            email: user.email,
            avatarUrl: user.user_metadata?.avatar_url || ''
        });
      }

      // 2. Fetch Current Pantry Details
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleCopyCode = (e) => {
    e.stopPropagation(); // Prevent dropdown close
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
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200/60 bg-white/80 px-4 backdrop-blur-md md:px-8 transition-all">
      
      {/* --- LEFT: Mobile Menu + Title --- */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-500"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Breadcrumb / Title */}
        <div className="hidden md:flex flex-col">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 leading-tight">
            {activeView}
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            Dashboard / {activeView}
          </span>
        </div>
      </div>
      
      {/* --- RIGHT: Pantry Switcher + User --- */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* 1. PANTRY SWITCHER (Dropdown) */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 py-1.5 px-2 md:px-3 rounded-lg hover:bg-gray-100/80 transition-colors group outline-none">
                    <div className="hidden md:flex h-9 w-9 rounded-lg bg-orange-50 border border-orange-100 items-center justify-center text-[#d97757]">
                        <Building2 className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Organization</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900 max-w-[120px] md:max-w-[160px] truncate">
                                {pantryData?.name || 'Select Pantry'}
                            </span>
                            <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                        </div>
                    </div>
                </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-72 p-3 rounded-xl shadow-xl border-gray-100">
                <DropdownMenuLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Current Food Bank
                </DropdownMenuLabel>
                
                {/* Active Pantry Details */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-[#d97757]" />
                        <span className="font-semibold text-sm text-gray-900">{pantryData?.name}</span>
                    </div>
                    {pantryData?.address && (
                        <div className="flex items-start gap-2 text-xs text-gray-500 mb-3 px-1">
                            <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                            {pantryData.address}
                        </div>
                    )}
                    {/* Join Code */}
                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded px-2 py-1.5">
                        <code className="text-xs font-mono font-bold text-gray-700">
                            {pantryData?.join_code || '...'}
                        </code>
                        <button onClick={handleCopyCode} className="text-gray-400 hover:text-[#d97757] transition-colors">
                            {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </button>
                    </div>
                </div>

                <DropdownMenuSeparator />
                
                {/* Placeholder for Future Multi-Pantry Logic */}
                <DropdownMenuItem disabled className="text-xs text-gray-400 justify-center py-2 cursor-not-allowed">
                    Switch Pantry (Coming Soon)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 hidden md:block" />
        
        {/* 2. USER PROFILE (Dropdown) */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent focus-visible:ring-0">
                    <Avatar className="h-9 w-9 border border-gray-200 shadow-sm hover:ring-2 hover:ring-[#d97757]/20 transition-all">
                        <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                        <AvatarFallback className="bg-[#d97757] text-white font-medium text-xs">
                            {getInitials(userData.name)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-gray-100 p-2">
                <div className="px-2 py-2">
                    <p className="text-sm font-bold text-gray-900">{userData.name}</p>
                    <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-gray-50 text-sm">
                    <User className="mr-2 h-4 w-4 text-gray-500" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="cursor-pointer rounded-lg focus:bg-red-50 text-red-600 text-sm mt-1"
                    onClick={handleSignOut}
                >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}