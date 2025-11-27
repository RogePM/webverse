'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowRight, 
  Gift, 
  User, 
  History,
  AlertCircle,
  Search,
  Calendar as CalendarIcon,
  Filter,
  X
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from '@/components/ui/scroll-area';
import { categories as CATEGORY_OPTIONS } from '@/lib/constants';
import { usePantry } from '@/components/providers/PantryProvider';

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
      key = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
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

  // --- FILTER STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // YYYY-MM-DD
  const [typeFilter, setTypeFilter] = useState('all'); // all, distributed, added, etc.
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
        setFilteredChanges(data); // Initialize filtered list
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

    // 1. Text Search (Item Name or Client Name)
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(c => 
            c.itemName.toLowerCase().includes(q) || 
            (c.clientName && c.clientName.toLowerCase().includes(q)) ||
            (c.distributionReason && c.distributionReason.toLowerCase().includes(q))
        );
    }

    // 2. Date Filter
    if (dateFilter) {
        // Create date objects to compare day/month/year only (ignoring time)
        const filterDate = new Date(dateFilter).toDateString();
        result = result.filter(c => 
            new Date(c.timestamp).toDateString() === filterDate
        );
    }

    // 3. Type Filter
    if (typeFilter !== 'all') {
        result = result.filter(c => c.actionType === typeFilter);
    }

    setFilteredChanges(result);
  }, [searchQuery, dateFilter, typeFilter, changes]);

  // --- UI CONFIG ---
  const getActionConfig = (actionType) => {
    switch (actionType) {
      case 'added': 
        return { icon: Plus, color: 'text-green-600', bg: 'bg-green-100', label: 'Restock' };
      case 'updated': 
        return { icon: Edit, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Update' };
      case 'deleted': 
        return { icon: Trash2, color: 'text-red-600', bg: 'bg-red-100', label: 'Deleted' };
      case 'distributed': 
        return { icon: Gift, color: 'text-[#d97757]', bg: 'bg-[#d97757]/10', label: 'Distributed' };
      default: 
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Log' };
    }
  };

  const renderChangeDetails = (change) => {
    const unit = change.unit || 'units';
    if (change.actionType === 'distributed') {
      return (
        <div className="mt-2 bg-gray-50 rounded-lg p-2 border border-gray-100">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-900 font-medium">
             <span className="text-[#d97757] font-bold">
               -{change.quantityChanged || change.removedQuantity} {unit}
             </span>
             <span className="text-gray-300">|</span>
             <span className="flex items-center gap-1 text-gray-700">
                <User className="h-3.5 w-3.5 text-gray-400" /> 
                {change.clientName || 'Anonymous'}
             </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
             <span>Reason: {change.distributionReason || 'General Assistance'}</span>
             {change.impactMetrics?.peopleServed > 0 && (
                 <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-white border border-gray-200">
                    Served {change.impactMetrics.peopleServed}
                 </Badge>
             )}
          </div>
        </div>
      );
    }
    if (change.actionType === 'added') {
        return (
            <div className="text-sm text-gray-600 mt-1">
                Added <span className="font-bold text-green-700">+{change.quantityChanged || 0} {unit}</span> to inventory.
            </div>
        );
    }
    if (change.actionType === 'updated' && change.changes) {
        return (
            <div className="mt-2 space-y-1">
                {Object.entries(change.changes).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-xs bg-gray-50 p-1.5 rounded border border-gray-100 w-fit">
                        <span className="text-gray-500 font-medium uppercase tracking-wide text-[10px]">{key}</span>
                        <span className="text-gray-400 line-through">{String(value.old)}</span>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-900 font-bold">{String(value.new)}</span>
                    </div>
                ))}
            </div>
        );
    }
    if (change.actionType === 'deleted') {
        return (
             <div className="text-sm text-red-600/80 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> 
                Removed item permanently.
            </div>
        );
    }
    return null;
  };

  if (isLoading && changes.length === 0) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-muted-foreground">
        <div className="animate-spin mb-3 h-6 w-6 border-2 border-[#d97757] border-t-transparent rounded-full"></div>
        <p className="text-sm">Loading activity log...</p>
      </div>
    );
  }

  const groupedChanges = groupChangesByDate(filteredChanges);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white">
      
      {/* HEADER & FILTERS */}
      <div className="bg-white z-10 sticky top-0 border-b shadow-sm">
        <div className="p-4 border-b">
            <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <History className="h-5 w-5 text-[#d97757]" />
                        Activity Log
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Track inventory movements</p>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowFilters(!showFilters)}
                    className={showFilters ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}
                >
                    <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
            </div>
        </div>

        {/* EXPANDABLE FILTER BAR */}
        <AnimatePresence>
            {showFilters && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-gray-50"
                >
                    <div className="max-w-3xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Search items or clients..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 bg-white"
                            />
                        </div>

                        {/* Date Picker */}
                        <div className="relative">
                            <Input 
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="h-10 bg-white"
                            />
                        </div>

                        {/* Type Select */}
                        <div className="relative">
                            <select 
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="all">All Actions</option>
                                <option value="distributed">Distributed</option>
                                <option value="added">Restock (Added)</option>
                                <option value="updated">Updates</option>
                                <option value="deleted">Deletions</option>
                            </select>
                        </div>
                        
                        {/* Clear Filters (Only show if active) */}
                        {(searchQuery || dateFilter || typeFilter !== 'all') && (
                            <div className="col-span-full flex justify-end">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 text-xs"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setDateFilter('');
                                        setTypeFilter('all');
                                    }}
                                >
                                    <X className="h-3 w-3 mr-1" /> Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* CONTENT SCROLL AREA */}
      <div className="flex-1 bg-gray-50/50 overflow-hidden">
        <ScrollArea className="h-full p-4 md:p-6">
            <div className="max-w-3xl mx-auto pb-20">
                
                {filteredChanges.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="font-semibold text-gray-900">No activity found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                            Try adjusting your filters or date range.
                        </p>
                    </div>
                )}

                {/* Timeline Groups */}
                {Object.entries(groupedChanges).map(([dateLabel, groupItems]) => (
                    <div key={dateLabel} className="mb-8 last:mb-0">
                        <div className="sticky top-0 z-10 py-2 bg-gray-50/95 backdrop-blur-sm mb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                                {dateLabel}
                            </h3>
                        </div>

                        <div className="space-y-3 pl-2 sm:pl-0">
                            <AnimatePresence initial={false}>
                                {groupItems.map((change, index) => {
                                    const config = getActionConfig(change.actionType);
                                    const Icon = config.icon;

                                    return (
                                        <motion.div
                                            key={change._id || index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className="flex items-start gap-3 sm:gap-4 p-4 border-gray-100 hover:border-[#d97757]/30 transition-all hover:shadow-sm bg-white">
                                                <div className={`shrink-0 mt-0.5 h-9 w-9 rounded-full flex items-center justify-center ${config.bg} ${config.color}`}>
                                                    <Icon className="h-4.5 w-4.5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 text-sm truncate">
                                                                {change.itemName}
                                                            </h4>
                                                            <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground mt-0.5">
                                                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-gray-100 text-gray-500 font-normal border-0 hover:bg-gray-200">
                                                                    {getCategoryName(change.category)}
                                                                </Badge>
                                                                <span className="text-gray-300">•</span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" /> {formatTime(change.timestamp)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className={`text-[10px] capitalize border-0 font-medium ${config.bg} ${config.color}`}>
                                                            {config.label}
                                                        </Badge>
                                                    </div>
                                                    {renderChangeDetails(change)}
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}