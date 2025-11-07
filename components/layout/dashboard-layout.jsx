'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';

export function DashboardLayout({ activeView, setActiveView, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex flex-col flex-1 md:pl-64">
        <TopBar
          activeView={activeView}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
