'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';

export function DashboardLayout({ activeView, setActiveView, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex flex-col md:pl-64">
        <TopBar
          activeView={activeView}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
