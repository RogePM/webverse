'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusSquare, Loader2 } from 'lucide-react'; // Added Loader2
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// 1. Import the Modal (ensure path matches your file structure)
import { AddItemModal } from './add-item-modal'; 
import { categories } from '@/lib/constants';
// 2. Import Context
import { usePantry } from '@/components/providers/PantryProvider';

function CategoryCard({ item, onClick }) {
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
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">{item.name}</CardTitle>
          <item.icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {/* Empty content to match dashboard card structure */}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AddItemView() {
  // 3. Get Loading State
  const { isLoading: isPantryLoading } = usePantry();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const openModal = (categoryValue = '') => {
    setSelectedCategory(categoryValue);
    setIsModalOpen(true);
  };

  // 4. Loading State (Prevents interaction before Pantry ID is ready)
  if (isPantryLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Loading organization data...</p>
      </div>
    );
  }

  return (
    <>
      <AddItemModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialCategory={selectedCategory}
      />
      
      <div className="flex items-center justify-between pb-6">
        <p className="text-lg text-muted-foreground">Quickly add new items by category.</p>
        <Button onClick={() => openModal()}>
          <PlusSquare className="mr-2 h-4 w-4" />
          Quick Add Item
        </Button>
      </div>
      
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-3"
      >
        {categories.map((item) => (
          <CategoryCard
            key={item.value}
            item={item}
            onClick={() => openModal(item.value)}
          />
        ))}
      </motion.div>
    </>
  );
}