'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ScanBarcode, 
  Loader2, 
  ArrowDownToLine, // New icon for "Incoming"
  PackagePlus      // Alternative icon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { categories } from '@/lib/constants';
import { usePantry } from '@/components/providers/PantryProvider';
import { Sheet, SheetContent } from '@/components/ui/SheetCart';
import { AddItemForm } from './add-item-modal';

// --- UTILITY: Detect Screen Size ---
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

export function AddItemView() {
  const { isLoading } = usePantry();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Detect if screen is wider than 768px (Desktop/Tablet)
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const openQuickAdd = (cat = '') => {
    setSelectedCategory(cat);
    setIsSheetOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-[#d97757]" />
      </div>
    );
  }

  return (
    <div className="relative h-full bg-white">
      
      {/* --- HEADER --- */}
      <div className="p-4 border-b bg-white z-10 sticky top-0">
        <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <ArrowDownToLine className="h-5 w-5 text-[#d97757]" />
                        Incoming Stock
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Log new items or scan barcodes</p>
                </div>
                {/* Desktop Top Button */}
                <div className="hidden md:block">
                    <Button 
                        onClick={() => openQuickAdd()} 
                        className="bg-[#d97757] hover:bg-[#c06245] text-white shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Quick Add
                    </Button>
                </div>
            </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="p-4 md:p-8 bg-gray-50/50 h-full overflow-y-auto pb-32">
        <div className="max-w-6xl mx-auto">
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {categories.map((item) => (
                    <Card 
                        key={item.value} 
                        onClick={() => openQuickAdd(item.value)}
                        className="
                            group cursor-pointer relative flex flex-col items-center justify-center p-6 md:p-8
                            bg-white border border-gray-200 shadow-sm
                            hover:border-[#d97757]/50 hover:shadow-md hover:-translate-y-0.5
                            transition-all duration-200 active:scale-[0.98]
                        "
                    >
                        {/* Icon Circle */}
                        <div className="
                            mb-4 p-3 rounded-full bg-gray-50 text-gray-500
                            group-hover:bg-[#d97757]/10 group-hover:text-[#d97757]
                            transition-colors duration-200
                        ">
                            {/* Using strokeWidth={1.5} makes it look premium/clean */}
                            <item.icon className="h-6 w-6 md:h-8 md:w-8" strokeWidth={1.5} />
                        </div>
                        
                        {/* Text */}
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 text-center">
                            {item.name}
                        </span>
                    </Card>
                ))}
            </div>

        </div>
      </div>

      {/* --- RESPONSIVE SHEET --- */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
            side={isDesktop ? "right" : "bottom"} 
            className={`
                p-0 bg-white
                ${isDesktop 
                    ? 'h-full w-[450px] border-l shadow-2xl' 
                    : 'h-[92vh] w-full rounded-t-[20px]' // Taller on mobile for better view
                }
            `}
        >
             <AddItemForm 
                initialCategory={selectedCategory} 
                onClose={() => setIsSheetOpen(false)} 
             />
        </SheetContent>
      </Sheet>

      {/* --- MOBILE FAB (Bottom Right) --- */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
         <Button 
            onClick={() => openQuickAdd()} 
            className="h-14 w-14 rounded-full shadow-lg shadow-[#d97757]/25 bg-[#d97757] hover:bg-[#c06245] text-white"
         >
            <ScanBarcode className="h-6 w-6" strokeWidth={1.5} />
         </Button>
      </div>

    </div>
  );
}