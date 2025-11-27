'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Users, 
  TrendingUp, 
  Leaf,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { dashboardActions } from '@/lib/constants';
import { usePantry } from '@/components/providers/PantryProvider';

// --- COMPONENT: COMPACT IMPACT CARD ---
// Designed to be 2-per-row on mobile (small square widgets)
function ImpactCard({ title, value, subtitle, icon: Icon, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay }}
      className="h-full"
    >
      <Card className="h-full p-4 md:p-6 bg-white border border-gray-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
        
        {/* Top Row: Icon & Value */}
        <div>
            <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:text-[#d97757] group-hover:bg-[#d97757]/5 transition-colors duration-300">
                    <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
                </div>
            </div>

            <div className="space-y-0.5 md:space-y-1">
                <h3 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900">
                    {value}
                </h3>
                <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
                    {title}
                </p>
            </div>
        </div>

        {/* Bottom Row: Subtitle (Hidden on very small screens if needed, visible mostly) */}
        <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-gray-50">
          <p className="text-[10px] md:text-xs text-gray-400 leading-tight line-clamp-2">
            {subtitle}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

// --- COMPONENT: ACTION CARD ---
function ActionCard({ item, onClick, index }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full h-full text-left"
    >
      <Card className="h-full p-4 md:p-6 bg-white border border-gray-200/60 hover:border-[#d97757]/40 shadow-sm hover:shadow-[0_4px_20px_-4px_rgba(217,119,87,0.15)] transition-all duration-300 group relative overflow-hidden">
        <div className="flex items-start gap-4">
            {/* Icon Circle */}
            <div className="shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#d97757] group-hover:text-white transition-all duration-300 shadow-inner">
              <item.icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 group-hover:text-[#d97757] transition-colors text-sm md:text-base">
                        {item.title}
                    </h4>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#d97757] group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                </p>
            </div>
        </div>
      </Card>
    </motion.button>
  );
}

export function DashboardHome({ setActiveView }) {
  const { pantryId } = usePantry();
  const [stats, setStats] = useState({ 
    inventoryCount: 0, 
    totalPeopleServed: 0, 
    totalValue: 0,
    totalWeight: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!pantryId) return;
      try {
        const res = await fetch('/api/dashboard/stats', { 
            headers: { 'x-pantry-id': pantryId } 
        });
        if (res.ok) {
            const data = await res.json();
            setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [pantryId]);

  return (
    <div className="max-w-7xl mx-auto pb-24 px-1 md:px-2">
      
      {/* HEADER SECTION */}
      <div className="space-y-1 py-4 md:py-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
          Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Here is what's happening in your pantry today.
        </p>
      </div>

      {/* IMPACT GRID - (2 cols on mobile, 4 on desktop) */}
      {/* This keeps the cards visually small on mobile so actions are visible */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
        <ImpactCard 
            title="Served"
            value={loading ? "-" : stats.totalPeopleServed}
            subtitle="Individuals helped"
            icon={Users}
            delay={0}
        />
        <ImpactCard 
            title="Value"
            value={loading ? "-" : `$${stats.totalValue.toLocaleString()}`}
            subtitle="Est. market value"
            icon={TrendingUp}
            delay={0.1}
        />
        <ImpactCard 
            title="Weight"
            value={loading ? "-" : `${Math.round(stats.totalWeight).toLocaleString()}`}
            subtitle="Lbs distributed"
            icon={Leaf}
            delay={0.2}
        />
        <ImpactCard 
            title="Stock"
            value={loading ? "-" : stats.inventoryCount}
            subtitle="Items on hand"
            icon={Package}
            delay={0.3}
        />
      </div>

      {/* ACTIONS SECTION */}
      <div>
        <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="h-5 w-5 text-[#d97757]" strokeWidth={1.5} />
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-3 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardActions.map((item, index) => (
            <ActionCard
              key={item.title}
              item={item}
              index={index}
              onClick={() => setActiveView(item.view)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}