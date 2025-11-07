'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScanBarcode, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import {
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { categories } from '@/lib/constants';

export function AddItemModal({ isOpen, onOpenChange, initialCategory = '' }) {
  const [mode, setMode] = useState('manual');
  const [category, setCategory] = useState(initialCategory);
  const [unit, setUnit] = useState('units');

  useEffect(() => {
    if (isOpen) {
      setCategory(initialCategory || categories[0].value);
      setMode('manual');
      setUnit('units');
    }
  }, [isOpen, initialCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted', Object.fromEntries(new FormData(e.target)));
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <DialogOverlay onClick={() => onOpenChange(false)} />
          <DialogContent onClose={() => onOpenChange(false)} className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Scan a barcode for quick entry or add item details manually.
              </DialogDescription>
            </DialogHeader>
            
            {/* Mode Toggle */}
            <div className="grid grid-cols-2 gap-2 rounded-md bg-muted p-1">
              <Button
                variant={mode === 'manual' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setMode('manual')}
                type="button"
              >
                Manual Entry
              </Button>
              <Button
                variant={mode === 'scan' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setMode('scan')}
                type="button"
              >
                <ScanBarcode className="mr-2 h-4 w-4" />
                Scan Barcode
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              {mode === 'manual' ? (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      id="category"
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="col-span-3"
                    >
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="item-name" className="text-right">
                      Item Name
                    </Label>
                    <Input id="item-name" name="item-name" className="col-span-3" placeholder="e.g., Canned Corn" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Quantity
                    </Label>
                    <Input id="quantity" name="quantity" type="number" className="col-span-2" placeholder="e.g., 24" required />
                    
                    {/* Unit Toggle */}
                    <div className="col-span-2 flex rounded-md border p-1">
                       <Toggle
                        pressed={unit === 'units'}
                        onClick={() => setUnit('units')}
                        className="flex-1 data-[state=on]:bg-muted"
                        size="sm"
                      >
                        Units
                      </Toggle>
                      <Toggle
                        pressed={unit === 'pounds'}
                        onClick={() => setUnit('pounds')}
                        className="flex-1 data-[state=on]:bg-muted"
                        size="sm"
                      >
                        <Weight className="mr-1 h-4 w-4" />
                        Lbs
                      </Toggle>
                      <input type="hidden" name="unit" value={unit} />
                    </div>
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expiration" className="text-right">
                      Expiration
                    </Label>
                    <Input id="expiration" name="expiration" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="donor" className="text-right">
                      Donor
                    </Label>
                    <Input id="donor" name="donor" className="col-span-3" placeholder="Optional" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input id="location" name="location" className="col-span-3" placeholder="e.g., Shelf A-1" />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <Label htmlFor="barcode">Scan or enter barcode number</Label>
                  <div className="flex gap-2">
                    <Input id="barcode" name="barcode" placeholder="9780321765723" />
                    <Button type="button" variant="outline">Fetch</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simulated: Entering a barcode would fetch item details.
                  </p>
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit">Add Item</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </>
      )}
    </AnimatePresence>
  );
}

