'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, Activity, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboardActions } from '@/lib/constants';
// 1. Import Context
import { usePantry } from '@/components/providers/PantryProvider';

// Simple Stats Card Component
function StatsCard({ title, value, icon: Icon, loading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? '...' : value}
        </div>
      </CardContent>
    </Card>
  );
}

function ActionCard({ item, onClick }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        y: -6, 
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)" 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="h-full border-l-4 border-l-transparent hover:border-l-primary transition-all">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">{item.title}</CardTitle>
            <item.icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardDescription className="pt-2">{item.description}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

export function DashboardHome({ setActiveView }) {
  const { pantryId } = usePantry();
  const [stats, setStats] = useState({ items: 0, distributions: 0 });
  const [loading, setLoading] = useState(true);

  // 2. Fetch Live Stats on Load
  useEffect(() => {
    const fetchStats = async () => {
      if (!pantryId) return;

      try {
        // Run both fetches in parallel
        const [foodsRes, distRes] = await Promise.all([
          fetch('/api/foods', { headers: { 'x-pantry-id': pantryId } }),
          fetch('/api/client-distributions', { headers: { 'x-pantry-id': pantryId } })
        ]);

        const foods = await foodsRes.json();
        const dists = await distRes.json();

        setStats({
          items: foods.count || 0,
          distributions: dists.count || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [pantryId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Top Section: Live Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Food Items" 
          value={stats.items} 
          icon={Package} 
          loading={loading} 
        />
        <StatsCard 
          title="Distributions Logged" 
          value={stats.distributions} 
          icon={Users} 
          loading={loading} 
        />
        {/* Placeholders for future stats */}
        <StatsCard 
          title="Low Stock Alerts" 
          value="0" 
          icon={Activity} 
          loading={false} 
        />
      </div>

      <div className="border-t my-6" />

      {/* Bottom Section: Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 tracking-tight">Quick Actions</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {dashboardActions.map((item) => (
            <ActionCard
              key={item.title}
              item={item}
              onClick={() => setActiveView(item.view)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}