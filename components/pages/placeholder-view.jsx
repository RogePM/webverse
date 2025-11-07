'use client';

export function PlaceholderView({ title }) {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
      <h2 className="text-2xl font-medium text-muted-foreground">{title} Content Area</h2>
    </div>
  );
}

