'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { RemoveItemDrawer } from './remove-item-drawer';

// Animation variants
const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};
const MotionTableBody = motion(TableBody);


export function RemoveItemView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus search bar on page load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Fetch inventory from backend
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/foods');
        if (response.ok) {
          const data = await response.json();
          setInventory(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Effect to filter inventory based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = inventory.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barcode?.includes(searchQuery)
    );

    setSearchResults(filtered);
  }, [searchQuery, inventory]);

  const openDrawer = (item = null) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleItemRemoved = () => {
    // Refresh inventory after removal
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/foods');
        if (response.ok) {
          const data = await response.json();
          setInventory(data.data || []);
          setSearchQuery(''); // Clear search
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      {/* Drawer */}
      <RemoveItemDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        item={selectedItem}
        onItemRemoved={handleItemRemoved}
      />

      {/* Header */}
      <div className="mb-6 flex flex-col items-center gap-4 md:flex-row">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search or Scan Barcode..."
            className="w-full pl-10 text-base md:w-[400px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Quick Remove Button */}
        <Button
          size="lg"
          variant="outline"
          onClick={() => openDrawer(null)}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Quick Remove
        </Button>
      </div>

      {/* Dynamic Table Area */}
      <div className="relative min-h-[300px]">
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                 
                   
                    <MotionTableBody
                      variants={tableContainerVariants}
                      initial="hidden"
                      animate="visible"
                      className="divide-y divide-muted/50"
                    >
                      {searchResults.map((item) => (
                        <motion.tr
                          key={item._id}
                          variants={tableRowVariants}
                          className="transition-colors hover:bg-muted/50"
                        >
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatDate(item.expirationDate)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            className="rounded-xl px-3 py-1 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => openDrawer(item)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                        </motion.tr>
                      ))}
                    </MotionTableBody>
                  {/* </TableBody> */}
                </Table>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint Text */}
        {searchResults.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <p className="text-center text-muted-foreground">
              {searchQuery.trim() === ''
                ? 'Start by searching for an item or scanning its barcode to view matching inventory.'
                : 'No items found for your search.'}
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-center text-muted-foreground">Loading inventory...</p>
          </div>
        )}
      </div>
    </>
  );
}

