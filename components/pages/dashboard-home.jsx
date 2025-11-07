'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { dashboardActions } from '@/lib/constants';

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
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">{item.title}</CardTitle>
          <item.icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardDescription>{item.description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardHome({ setActiveView }) {
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      variants={gridVariants}
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
  );
}

