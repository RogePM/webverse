'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';

import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, } from '@/components/ui/sheet';
import { categories as CATEGORY_OPTIONS } from '@/lib/constants';

export function InventoryFormBar({ isOpen, onOpenChange, item, onItemUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    expirationDate: '',
    storageLocation: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(''); // inline success/error message

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

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item?._id) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/foods/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Item updated successfully.');
        onItemUpdated?.();
      } else {
        setMessage(' Failed to update item.');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      setMessage(' Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent onClose={() => setIsOpen(false)}>...</SheetContent>

      <SheetContent side="right">
        
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader>
            <SheetTitle>Modify Inventory Item</SheetTitle>
            <SheetDescription>Update item details below.</SheetDescription>
          </SheetHeader>
          {/* <div className="flex-1 px-6 py-4 overflow-y-auto"> */}

          <div className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="grid gap-6">
            {/* Inline message */}
            {message && (
              <p className={`text-sm font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
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
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
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

          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
          </div>
        </form>
        
      </SheetContent>
    </Sheet>
  );
}
