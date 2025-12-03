'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SheetOverlay = React.forwardRef((props, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2, ease: 'easeInOut' }}
    className="fixed inset-0 z-50 bg-black/60"
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

// --- FIX IS IN THIS COMPONENT ---
const SheetContent = React.forwardRef(({ className, children, onClose, side = 'right', open, ...props }, ref) => {
  const sideClasses = {
    right: 'right-0 top-0 h-full w-full sm:w-[400px]',
    left: 'left-0 top-0 h-full w-full sm:w-[400px]',
    top: 'top-0 left-0 w-full h-auto',
    bottom: 'bottom-0 left-0 w-full h-auto',
  };

  const sideAnimations = {
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
    top: { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
    bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'fixed z-50 flex flex-col border bg-background shadow-lg',
        sideClasses[side],
        className
      )}
      initial={sideAnimations[side].initial}
      animate={sideAnimations[side].animate}
      exit={sideAnimations[side].exit}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...props}
    >
      <div className="flex h-full flex-col">
        {children}
        
        {/* --- FIX HERE: Used 'onClose' instead of 'onOpenChange' --- */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-12 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
        
      </div>
    </motion.div>
  );
});
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-2 p-6 pb-4', className)} {...props} />
);

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
SheetDescription.displayName = 'SheetDescription';

const SheetFooter = ({ className, ...props }) => (
  <div className={cn('flex flex-col-reverse gap-2 p-6 pt-4 sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);

const Sheet = ({ open, onOpenChange, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <SheetOverlay onClick={() => onOpenChange(false)} />
          {children}
        </>
      )}
    </AnimatePresence>
  );
};

export {
  Sheet,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
};