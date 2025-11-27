'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';

export function DashboardLayout({ activeView, setActiveView, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#fafafa] text-gray-900 flex">
      
      {/* Fixed Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-72 transition-all duration-300 ease-in-out">
        <TopBar
          activeView={activeView}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}