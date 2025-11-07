import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Toggle = React.forwardRef(({ className, variant, size, pressed, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-state={pressed ? 'on' : 'off'}
    className={cn(toggleVariants({ variant, size, className }), pressed && 'bg-accent text-accent-foreground')}
    {...props}
  />
));
Toggle.displayName = 'Toggle';

export { Toggle, toggleVariants };

