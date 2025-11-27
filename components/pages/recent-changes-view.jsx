'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Plus, Edit, Trash2, ArrowRight, Gift, User, 
  History, AlertCircle, Search, Filter, X, 
  ChevronDown, Calendar
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { ScrollArea } from '@/components/ui/scroll-area';
import { categories as CATEGORY_OPTIONS } from '@/lib/constants';
import { usePantry } from '@/components/providers/PantryProvider';

// --- STYLES FOR HIDING SCROLLBARS ---
const scrollbarHideStyles = `
  .no-scrollbar::-webkit-scrollbar {
      display: none;
  }
  .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
  }
`;

// --- HELPERS ---
const getCategoryName = (value) => {
  const cat = CATEGORY_OPTIONS.find(c => c.value === value);
  return cat ? cat.name : value;
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });
};

const groupChangesByDate = (changes) => {
  const groups = {};
  changes.forEach(change => {
    const date = new Date(change.timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let key = date.toLocaleDateString();
    
    if (date.toDateString() === today.toDateString()) {
      key = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = 'Yesterday';
    } else {
      key = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(change);
  });
  return groups;
};

export function RecentChangesView() {
  const { pantryId } = usePantry();
  const [changes, setChanges] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // --- FETCH DATA ---
  const fetchChanges = async () => {
    if (!pantryId) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/foods/changes/recent', {
        headers: { 'x-pantry-id': pantryId }
      });
      if (response.ok) {
        const data = await response.json();
        setChanges(data);
        setFilteredChanges(data);
      }
    } catch (error) {
      console.error('Error fetching changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pantryId) {
        fetchChanges();
        const interval = setInterval(fetchChanges, 30000); 
        return () => clearInterval(interval);
    }
  }, [pantryId]);

  // --- FILTER LOGIC ---
  useEffect(() => {
    let result = changes;
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(c => 
            c.itemName.toLowerCase().includes(q) || 
            (c.clientName && c.clientName.toLowerCase().includes(q))
        );
    }
    if (dateFilter) {
        const filterDate = new Date(dateFilter).toDateString();
        result = result.filter(c => new Date(c.timestamp).toDateString() === filterDate);
    }
    if (typeFilter !== 'all') {
        result = result.filter(c => c.actionType === typeFilter);
    }
    setFilteredChanges(result);
  }, [searchQuery, dateFilter, typeFilter, changes]);

  // --- UI CONFIG ---
  const getActionConfig = (actionType) => {
    switch (actionType) {
      case 'added': return { icon: Plus, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-100', label: 'Restock' };
      case 'updated': return { icon: Edit, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100', label: 'Update' };
      case 'deleted': return { icon: Trash2, color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-100', label: 'Deleted' };
      case 'distributed': return { icon: Gift, color: 'text-[#d97757]', bg: 'bg-[#fff0eb]', ring: 'ring-orange-100', label: 'Distributed' };
      default: return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50', ring: 'ring-gray-100', label: 'Log' };
    }
  };

  const renderDetails = (change) => {
    const unit = change.unit || 'units';
    
    if (change.actionType === 'distributed') {
      return (
        <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
            <div className="font-medium text-[#d97757]">
                -{change.quantityChanged || change.removedQuantity} {unit}
            </div>
            <div className="hidden sm:block text-gray-300">•</div>
            <div className="flex items-center gap-1.5 text-gray-600">
                <User className="h-3.5 w-3.5 opacity-50" /> 
                {change.clientName || 'Anonymous'}
            </div>
            {change.distributionReason && (
                <>
                    <div className="hidden sm:block text-gray-300">•</div>
                    <div className="text-gray-400 text-xs italic">{change.distributionReason}</div>
                </>
            )}
        </div>
      );
    }
    
    if (change.actionType === 'added') {
        return (
            <div className="mt-1 font-medium text-emerald-700 text-sm">
                +{change.quantityChanged || 0} {unit} added
            </div>
        );
    }

    if (change.actionType === 'updated' && change.changes) {
        return (
            <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(change.changes).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-[10px] sm:text-xs bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                        <span className="text-gray-500 uppercase font-bold">{key}</span>
                        <span className="text-gray-400 line-through">{String(value.old)}</span>
                        <ArrowRight className="h-3 w-3 text-gray-300" />
                        <span className="text-gray-900 font-medium">{String(value.new)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
  };

  const groupedChanges = groupChangesByDate(filteredChanges);

  return (
    // FIX 1: h-[100dvh] prevents mobile URL bar issues
    <div className="flex flex-col h-[100dvh] bg-white relative">
      <style>{scrollbarHideStyles}</style>
      
      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-md z-20 sticky top-0 border-b border-gray-100">
        <div className="max-w-3xl mx-auto w-full px-4 h-16 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Activity
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-normal">
                    {filteredChanges.length}
                </span>
            </h2>
            
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className={`h-9 px-3 rounded-full transition-all ${showFilters ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Filter className="h-4 w-4 mr-1.5" /> 
                <span className="text-xs font-medium">Filter</span>
            </Button>
        </div>

        {/* ELEGANT FILTER DRAWER */}
        <AnimatePresence>
            {showFilters && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-100 bg-gray-50/50"
                >
                    <div className="max-w-3xl mx-auto p-4 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Search by item or client..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-white border-gray-200 focus-visible:ring-[#d97757]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select 
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="flex-1 h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#d97757]"
                            >
                                <option value="all">All Actions</option>
                                <option value="distributed">Distributed</option>
                                <option value="added">Restock</option>
                                <option value="updated">Updates</option>
                                <option value="deleted">Deletions</option>
                            </select>
                            <Input 
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="flex-1 bg-white border-gray-200"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-hidden relative">
        {/* FIX 2: Custom Scroll container without visible bars */}
        <div className="h-full overflow-y-auto no-scrollbar px-4 pb-24 pt-4">
             <div className="max-w-3xl mx-auto">

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                        <div className="animate-spin mb-3 h-5 w-5 border-2 border-[#d97757] border-t-transparent rounded-full"></div>
                        <p className="text-xs font-medium uppercase tracking-wide">Loading History...</p>
                    </div>
                ) : filteredChanges.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <Search className="h-5 w-5 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No activity found</p>
                        <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedChanges).map(([dateLabel, groupItems]) => (
                            <div key={dateLabel} className="relative">
                                {/* STICKY DATE LABEL */}
                                <div className="sticky top-0 z-10 py-2 mb-4 bg-gradient-to-b from-white via-white to-transparent">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                        {dateLabel}
                                    </h3>
                                </div>

                                {/* VERTICAL TIMELINE LINE */}
                                <div className="absolute left-4 top-10 bottom-0 w-px bg-gray-100 z-0 hidden sm:block"></div>

                                <div className="space-y-6 sm:pl-0">
                                    {groupItems.map((change, index) => {
                                        const config = getActionConfig(change.actionType);
                                        const Icon = config.icon;
                                        
                                        return (
                                            <motion.div
                                                key={change._id || index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="relative z-10 sm:pl-10"
                                            >
                                                {/* TIMELINE DOT (Desktop) */}
                                                <div className={`hidden sm:flex absolute left-2 top-3 h-4 w-4 rounded-full border-[3px] border-white ${config.bg} items-center justify-center shadow-sm`}></div>

                                                {/* CARD BODY */}
                                                <div className="group flex gap-3 sm:gap-4 items-start">
                                                    {/* Mobile Icon */}
                                                    <div className={`sm:hidden shrink-0 mt-0.5 h-8 w-8 rounded-full flex items-center justify-center ${config.bg} ${config.color}`}>
                                                        <Icon className="h-4 w-4" />
                                                    </div>

                                                    <div className="flex-1 min-w-0 pb-6 border-b border-gray-50 group-last:border-0">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                                                    {change.itemName}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] bg-gray-50 text-gray-500 border-0 font-normal hover:bg-gray-100">
                                                                        {getCategoryName(change.category)}
                                                                    </Badge>
                                                                    <span className="text-[10px] text-gray-300">•</span>
                                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                                        {formatTime(change.timestamp)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {/* Action Badge (Right Side) */}
                                                            <div className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color}`}>
                                                                {config.label}
                                                            </div>
                                                        </div>

                                                        {/* DYNAMIC DETAILS */}
                                                        {renderDetails(change)}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
}