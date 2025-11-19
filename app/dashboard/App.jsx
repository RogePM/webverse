'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DashboardHome } from '@/components/pages/dashboard-home';
import { AddItemView } from '@/components/pages/add-item-view';
import { RemoveItemView } from '@/components/pages/remove-item-view';
import { RecentChangesView } from '@/components/pages/recent-changes-view';
import { InventoryView } from '@/components/pages/Full-inventory';

import { createBrowserClient } from '@supabase/ssr'

export default function App({ session: initialSession }) {
  const [activeView, setActiveView] = useState('Dashboard');
  const [session, setSession] = useState(initialSession);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Listen for auth changes (important!)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Debug: log session state
  useEffect(() => {
    console.log('Session state:', session);
  }, [session]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

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
        return <RemoveItemView />;
      case 'View Inventory':
        return <InventoryView />;
      case 'Recent Changes':
        return <RecentChangesView />;
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
      {!session ? (
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
          <h2 className="text-2xl font-bold">Welcome to Dashboard</h2>
          <p className="text-gray-600">Please sign in to continue</p>
          <button
            onClick={handleSignIn}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
            <p className="text-sm text-green-600 font-medium">
              ✓ Signed in as {session?.user?.email}
            </p>
           
          </div>

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
        </>
      )}
    </DashboardLayout>
  );
}