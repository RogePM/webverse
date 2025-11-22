'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Package, Plus, Edit, Trash2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { categories as CATEGORY_OPTIONS } from '@/lib/constants';
// 1. Import Hook
import { usePantry } from '@/components/providers/PantryProvider';

export function RecentChangesView() {
  // 2. Get Pantry ID
  const { pantryId } = usePantry();

  const [changes, setChanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCategoryName = (value) => {
    const cat = CATEGORY_OPTIONS.find(c => c.value === value);
    return cat ? cat.name : value;
  };

  // Fetch recent changes from API
  const fetchChanges = async () => {
    if (!pantryId) return; // Safety check

    setIsLoading(true);
    try {
      const response = await fetch('/api/foods/changes/recent', { // Assuming route name is 'recent-changes'
        headers: {
            // 3. Pass Header
            'x-pantry-id': pantryId
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChanges(data);
      }
    } catch (error) {
      console.error('Error fetching changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 4. Only fetch if ID exists
    if (pantryId) {
        fetchChanges();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchChanges, 60000);
        return () => clearInterval(interval);
    }
  }, [pantryId]);

  // ... (Rest of your UI rendering logic stays exactly the same) ...

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'added': return <Plus className="h-4 w-4" />;
      case 'updated': return <Edit className="h-4 w-4" />;
      case 'deleted': return <Trash2 className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'added': return 'bg-green-100 text-green-800 border-green-200';
      case 'updated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deleted': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const renderChangeDetails = (change) => {
    if (change.actionType === 'added') {
      return (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Added</span> to {getCategoryName(change.category)}
          {change.previousQuantity && ` • Qty: ${change.previousQuantity}`}
        </div>
      );
    }
    if (change.actionType === 'deleted') {
      return (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Removed</span> from {getCategoryName(change.category)}
          {change.previousQuantity && ` • Had qty: ${change.previousQuantity}`}
        </div>
      );
    }
    if (change.actionType === 'updated' && change.changes) {
      return (
        <div className="text-sm text-gray-600 space-y-1">
          <div className="font-medium mb-1">Updated in {getCategoryName(change.category)}</div>
          {Object.entries(change.changes).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-mono">{key}:</span>
              <span className="text-gray-400">{String(value.old)}</span>
              <ArrowRight className="h-3 w-3 text-gray-400" />
              <span className="text-gray-700 font-medium">{String(value.new)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-2 text-sm text-gray-600">Loading recent changes...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="h-6 w-6" />
          Recent Changes
        </h2>
        <p className="text-sm text-gray-600 mt-1">Track inventory modifications and updates</p>
      </div>

      {changes.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground border-dashed">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No changes recorded yet.</p>
          <p className="text-sm mt-1">Start adding or modifying items to see activity here.</p>
        </Card>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {changes.map((change, index) => (
            <motion.div
              key={change._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full ${getActionColor(change.actionType)}`}>
                      {getActionIcon(change.actionType)}
                    </div>
                    {index < changes.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{change.itemName}</h3>
                      <Badge variant="outline" className={`${getActionColor(change.actionType)} text-xs whitespace-nowrap`}>
                        {change.actionType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(change.timestamp)}
                    </div>
                    {renderChangeDetails(change)}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {changes.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {changes.length} recent change{changes.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}