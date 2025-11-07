'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AddItemModal } from './add-item-modal';
import { categories } from '@/lib/constants';

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
        <CardHeader className="items-center pb-4">
          <item.icon className="h-10 w-10 text-primary" />
        </CardHeader>
        <CardContent className="text-center">
          <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AddItemView() {
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
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
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

