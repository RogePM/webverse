'use client';

import React, { useState, useEffect, useRef } from 'react';
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
// 1. Import the hook
import { usePantry } from '@/components/providers/PantryProvider';

export function AddItemModal({ isOpen, onOpenChange, initialCategory = '' }) {
  // 2. Get Pantry ID
  const { pantryId } = usePantry();

  // Form state
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  const [unit, setUnit] = useState('units');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUpBarcode, setIsLookingUpBarcode] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const barcodeTimeoutRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setBarcode('');
      setCategory(initialCategory || categories[0].value);
      setItemName('');
      setQuantity('');
      setExpirationDate('');
      setStorageLocation('');
      setUnit('units');
      setMessage({ type: '', text: '' });
    }
  }, [isOpen, initialCategory]);

  const handleBarcodeLookup = async (barcodeValue) => {
    if (!barcodeValue || barcodeValue.trim().length === 0) return;
    if (!pantryId) return; // Safety check

    setIsLookingUpBarcode(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/barcode/${encodeURIComponent(barcodeValue.trim())}`, {
        headers: {
          // 3. Pass Header for Lookup
          'x-pantry-id': pantryId
        }
      });
      
      if (!response.ok) throw new Error('Failed to lookup barcode');

      const result = await response.json();

      if (result.found && result.data) {
        setItemName(result.data.name || '');
        setCategory(result.data.category || category);
        setStorageLocation(result.data.storageLocation || '');
        
        setMessage({ type: 'success', text: 'Item information loaded from cache!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'info', text: 'Barcode not found in cache. Fill details manually.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error looking up barcode:', error);
      setMessage({ type: 'error', text: 'Failed to lookup barcode.' });
    } finally {
      setIsLookingUpBarcode(false);
    }
  };

  const handleBarcodeChange = (e) => {
    const value = e.target.value;
    setBarcode(value);
    setMessage({ type: '', text: '' });
    
    if (barcodeTimeoutRef.current) clearTimeout(barcodeTimeoutRef.current);
    
    if (value.trim().length > 0) {
      barcodeTimeoutRef.current = setTimeout(() => {
        handleBarcodeLookup(value);
      }, 1000);
    }
  };
  
  useEffect(() => {
    return () => {
      if (barcodeTimeoutRef.current) clearTimeout(barcodeTimeoutRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!itemName || !quantity || !expirationDate || !category) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid quantity' });
      return;
    }

    if (!pantryId) {
      setMessage({ type: 'error', text: 'Organization ID missing. Refresh the page.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        barcode: barcode.trim() || null,
        name: itemName.trim(),
        category: category,
        quantity: quantityNum,
        expirationDate: expirationDate,
        storageLocation: storageLocation.trim() || 'N/A',
      };

      const response = await fetch('/api/foods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 4. Pass Header for Creation
          'x-pantry-id': pantryId
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to add item' }));
        throw new Error(errorData.message || 'Failed to add item');
      }

      setMessage({ type: 'success', text: 'Item added successfully!' });
      
      setBarcode('');
      setItemName('');
      setQuantity('');
      setExpirationDate('');
      setStorageLocation('');
      setCategory(initialCategory || categories[0].value);
      setUnit('units');

      setTimeout(() => {
        setMessage({ type: '', text: '' });
        onOpenChange(false);
      }, 1500);

    } catch (error) {
      console.error('Error adding item:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to add item.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <DialogOverlay onClick={() => onOpenChange(false)} />
          <DialogContent onClose={() => onOpenChange(false)} className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-3">
              <DialogTitle className="text-lg">Add New Item</DialogTitle>
              <DialogDescription className="text-sm">
                Enter item details below. Scan a barcode (optional)
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-2">
                
                {/* Barcode Input */}
                <div className="space-y-1">
                  <Label htmlFor="barcode" className="text-xs font-medium">
                    Barcode <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <ScanBarcode className={`h-4 w-4 flex-shrink-0 ${
                      isLookingUpBarcode ? 'text-primary animate-pulse' : 'text-muted-foreground'
                    }`} />
                    <Input 
                      id="barcode" 
                      name="barcode" 
                      placeholder="Scan or enter code"
                      className="flex-1 h-9 text-sm"
                      value={barcode}
                      onChange={handleBarcodeChange}
                      disabled={isLookingUpBarcode}
                    />
                  </div>
                  {isLookingUpBarcode && (
                    <p className="text-xs text-muted-foreground">Looking up barcode...</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <Label htmlFor="category" className="text-xs font-medium">Category</Label>
                  {/* Use standard Select here if needed, or replace with your custom one */}
                  <div className="relative">
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        required
                    >
                        {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.name}
                        </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Item Name */}
                <div className="space-y-1">
                  <Label htmlFor="item-name" className="text-xs font-medium">Item Name</Label>
                  <Input 
                    id="item-name" 
                    name="item-name" 
                    placeholder="e.g., Canned Corn"
                    className="h-9 text-sm"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required 
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <Label htmlFor="quantity" className="text-xs font-medium">Quantity</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="quantity" 
                      name="quantity" 
                      type="number" 
                      placeholder="e.g., 24"
                      className="flex-1 h-9 text-sm"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="0"
                      step="0.01"
                      required 
                    />
                    <div className="flex rounded-md border border-input overflow-hidden h-9">
                      <Toggle
                        pressed={unit === 'units'}
                        onClick={() => setUnit('units')}
                        type="button"
                        className="rounded-r-none border-r border-input data-[state=on]:bg-accent h-9 px-3 text-xs"
                        size="sm"
                      >
                        Units
                      </Toggle>
                      <Toggle
                        pressed={unit === 'pounds'}
                        onClick={() => setUnit('pounds')}
                        type="button"
                        className="rounded-l-none data-[state=on]:bg-accent h-9 px-3 text-xs"
                        size="sm"
                      >
                        <Weight className="mr-1 h-3.5 w-3.5" />
                        Lbs
                      </Toggle>
                    </div>
                  </div>
                </div>

                {/* Expiration Date */}
                <div className="space-y-1">
                  <Label htmlFor="expiration" className="text-xs font-medium">Exp. Date</Label>
                  <Input 
                    id="expiration" 
                    name="expiration" 
                    type="date"
                    className="h-9 text-sm"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <Label htmlFor="location" className="text-xs font-medium">
                    Location <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Input 
                    id="location" 
                    name="location" 
                    placeholder="e.g., Shelf A-1"
                    className="h-9 text-sm"
                    value={storageLocation}
                    onChange={(e) => setStorageLocation(e.target.value)}
                  />
                </div>

                {/* Messages */}
                {message.text && (
                  <div className={`text-sm p-2 rounded-md ${
                    message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                    message.type === 'info' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}
              </div>
              
              <DialogFooter className="pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => onOpenChange(false)} 
                  className="h-9"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-9"
                  disabled={isSubmitting || !pantryId} // Disable if no pantry ID
                >
                  {isSubmitting ? 'Adding...' : 'Add Item'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </>
      )}
    </AnimatePresence>
  );
}