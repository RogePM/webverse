'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, // Using Leaf to mimic your logo
  X, 
  Settings, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navItems } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@supabase/ssr';

export function Sidebar({ activeView, setActiveView, isSidebarOpen, setIsSidebarOpen }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const NavItem = ({ item }) => {
    const isActive = activeView === item.view;
    
    return (
      <button
        onClick={() => {
          setActiveView(item.view);
          setIsSidebarOpen(false);
        }}
        className={cn(
          'group flex items-center w-full p-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out mb-1',
          isActive 
            ? 'bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] text-gray-900' 
            : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-900'
        )}
      >
        {/* Icon Circle - The "Quick Card" Look */}
        <div className={cn(
          "mr-3 h-9 w-9 rounded-full flex items-center justify-center transition-colors duration-200",
          isActive 
            ? "bg-[#d97757]/10 text-[#d97757]" 
            : "bg-transparent group-hover:bg-gray-100 text-gray-400 group-hover:text-gray-600"
        )}>
          <item.icon className="h-4.5 w-4.5" strokeWidth={1.5} />
        </div>
        
        <span className="flex-1 text-left">{item.name}</span>
        
        {isActive && (
          <motion.div layoutId="active-pill" className="h-1.5 w-1.5 rounded-full bg-[#d97757]" />
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#fcfcfc] border-r border-gray-200/60 transition-transform duration-300 ease-out',
          'md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Header */}
        <div className="flex h-20 items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#d97757] text-white flex items-center justify-center shadow-md shadow-[#d97757]/20">
                <Leaf className="h-5 w-5" strokeWidth={2} />
            </div>
            {/* Serif Font for Brand Name */}
            <span className="text-2xl font-serif font-medium tracking-tight text-gray-900">
                Food Arca
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-5 md:hidden text-gray-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4 mt-2">
            Menu
          </div>
          {navItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Footer Settings */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30">
          <nav className="space-y-1">
            <NavItem item={{ name: 'Settings', icon: Settings, view: 'Settings' }} />
            
            <button
              onClick={handleSignOut}
              className="group flex items-center w-full p-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all mt-2"
            >
              <div className="mr-3 h-9 w-9 rounded-full flex items-center justify-center bg-transparent group-hover:bg-red-100 transition-colors">
                <LogOut className="h-4.5 w-4.5" strokeWidth={1.5} />
              </div>
              Log out
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}