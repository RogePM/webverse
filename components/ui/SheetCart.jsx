'use client';

import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Context to manage state between Trigger and Content ---
const SheetContext = React.createContext({
  open: false,
  onOpenChange: () => {},
});

const Sheet = ({ open, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  
  const currentOpen = isControlled ? open : internalOpen;
  const handleOpenChange = isControlled ? onOpenChange : setInternalOpen;

  return (
    <SheetContext.Provider value={{ open: currentOpen, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

const SheetTrigger = ({ asChild, children, className, ...props }) => {
  const { onOpenChange } = useContext(SheetContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        onOpenChange(true);
      },
      ...props
    });
  }

  return (
    <button onClick={() => onOpenChange(true)} className={className} {...props}>
      {children}
    </button>
  );
};

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { onOpenChange } = useContext(SheetContext);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("fixed inset-0 z-50 bg-black/60", className)}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
});
SheetOverlay.displayName = 'SheetOverlay';

const SheetContent = React.forwardRef(({ className, children, side = 'right', ...props }, ref) => {
  const { open, onOpenChange } = useContext(SheetContext);

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
    <AnimatePresence>
      {open && (
        <>
          <SheetOverlay />
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
              <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-2 p-6 pb-4', className)} {...props} />
);

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

const SheetFooter = ({ className, ...props }) => (
  <div className={cn('flex flex-col-reverse gap-2 p-6 pt-4 sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
};