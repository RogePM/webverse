'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardHome } from '@/components/pages/dashboard-home';
import { AddItemView } from '@/components/pages/add-item-view';
import { PlaceholderView } from '@/components/pages/placeholder-view';

export default function App() {
  const [activeView, setActiveView] = useState('Dashboard');

  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3,
  };

  const renderView = () => {
    switch (activeView) {
      case 'Dashboard':
        return <DashboardHome setActiveView={setActiveView} />;
      case 'Add Items':
        return <AddItemView />;
      case 'Remove Items':
        return <PlaceholderView title="Remove Items" />;
      case 'View Inventory':
        return <PlaceholderView title="View Inventory" />;
      case 'Recent Changes':
        return <PlaceholderView title="Recent Changes" />;
      case 'Calendar':
        return <PlaceholderView title="Calendar" />;
      case 'Settings':
        return <PlaceholderView title="Settings" />;
      default:
        return <DashboardHome setActiveView={setActiveView} />;
    }
  };

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}
