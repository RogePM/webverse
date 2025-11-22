'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Using your custom Select wrapper (native select underneath)
import { Select, SelectItem } from '@/components/ui/select'; 

import { format } from 'date-fns';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter 
} from '@/components/ui/sheet';
import { categories as CATEGORY_OPTIONS } from '@/lib/constants';
// 1. Import Hook
import { usePantry } from '@/components/providers/PantryProvider';

export function InventoryFormBar({ isOpen, onOpenChange, item, onItemUpdated }) {
  // 2. Get Pantry ID
  const { pantryId } = usePantry();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    expirationDate: '',
    storageLocation: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // preload item when selected
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        quantity: item.quantity?.toString() || '',
        expirationDate: item.expirationDate
          ? format(new Date(item.expirationDate), 'yyyy-MM-dd')
          : '',
        storageLocation: item.storageLocation || '',
      });
      setMessage('');
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Note: Based on your Select component, it passes an event (e)
  const handleCategoryChange = (e) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item?._id) return;

    if (!pantryId) {
      setMessage('Error: Organization ID missing. Please refresh.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/foods/${item._id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            // 3. Pass Header for Update
            'x-pantry-id': pantryId
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('✅ Item updated successfully.');
        // Wait a moment so user sees the success message
        setTimeout(() => {
            onItemUpdated?.();
        }, 1000);
      } else {
        setMessage('Failed to update item.');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      setMessage('Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {/* Fixed: Removed the duplicate/broken SheetContent here */}
      
      <SheetContent onClose={() => onOpenChange(false)} side="right" className="w-full sm:max-w-md">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader>
            <SheetTitle>Modify Inventory Item</SheetTitle>
            <SheetDescription>Update item details below.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 py-6 overflow-y-auto px-1">
            <div className="grid gap-6">
              {/* Inline message */}
              {message && (
                <p className={`text-sm font-medium p-2 rounded ${
                    message.startsWith('✅') 
                    ? 'bg-green-50 text-green-600 border border-green-200' 
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {message}
                </p>
              )}

              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                {/* Ensure this matches your wrapper component's props */}
                <Select
                  id="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="storageLocation">Storage Location</Label>
                <Input
                  id="storageLocation"
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleChange}
                  placeholder="e.g., Shelf A2 or Freezer 1"
                />
              </div>
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !pantryId}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}