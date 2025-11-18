'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageSearch, X, Settings, LogOut } from 'lucide-react';
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
      <Button
        variant="ghost"
        onClick={() => {
          setActiveView(item.view);
          setIsSidebarOpen(false);
        }}
        className={cn(
          'w-full justify-start',
          isActive && 'bg-primary/10 text-primary'
        )}
      >
        <item.icon className="mr-3 h-5 w-5" />
        {item.name}
      </Button>
    );
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-card transition-transform duration-300 ease-in-out',
          'md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <PackageSearch className="h-7 w-7 text-primary" />
          <h1 className="ml-3 text-xl font-bold">FoodBank Admin</h1>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        <div className="mt-auto border-t p-4">
          <nav className="space-y-2">
            <NavItem item={{ name: 'Settings', icon: Settings, view: 'Settings' }} />
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:bg-red-50 hover:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log out
            </Button>
          </nav>
        </div>
      </motion.aside>
    </>
  );
}

