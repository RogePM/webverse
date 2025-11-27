'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Trash2, 
  Loader2, 
  Save, 
  Package, 
  Weight, 
  Calendar,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';

// 1. USE THE NEW SHEET COMPONENT (Matches your Add Item Modal)
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from '@/components/ui/SheetCart';

import { categories as CATEGORY_OPTIONS } from '@/lib/constants';
import { usePantry } from '@/components/providers/PantryProvider';

export function InventoryFormBar({ isOpen, onOpenChange, item, onItemUpdated }) {
  const { pantryId } = usePantry();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: 'units', // Added Unit to state
    expirationDate: '',
    storageLocation: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');

  // --- LOAD DATA ---
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || CATEGORY_OPTIONS[0].value,
        quantity: item.quantity?.toString() || '',
        unit: item.unit || 'units', // Load existing unit
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

  // --- UPDATE ITEM ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item?._id || !pantryId) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/foods/${item._id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'x-pantry-id': pantryId
        },
        // Parse quantity to float to ensure decimals are sent correctly
        body: JSON.stringify({
            ...formData,
            quantity: parseFloat(formData.quantity)
        }),
      });

      if (res.ok) {
        setMessage('✅ Saved');
        setTimeout(() => {
            onItemUpdated?.(); // Refresh parent list
        }, 500);
      } else {
        setMessage('Failed to update.');
      }
    } catch (error) {
      console.error('Error updating:', error);
      setMessage('Error saving.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- DELETE ITEM ---
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this item?")) return;
    
    setIsDeleting(true);
    try {
        const res = await fetch(`/api/foods/${item._id}`, {
            method: 'DELETE',
            headers: { 'x-pantry-id': pantryId }
        });

        if (res.ok) {
            onOpenChange(false);
            onItemUpdated?.();
        } else {
            alert("Failed to delete item");
        }
    } catch (error) {
        console.error("Delete failed", error);
    } finally {
        setIsDeleting(false);
    }
  };

  const brandColor = "#d97757";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full p-0 bg-white">
        
        {/* HEADER */}
        <SheetHeader className="px-6 py-5 border-b">
          <SheetTitle className="text-xl font-bold text-gray-900">Edit Item</SheetTitle>
          {message && (
             <div className={`text-sm font-medium px-3 py-1 rounded-md mt-2 w-fit ${
                 message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
             }`}>
                 {message}
             </div>
          )}
        </SheetHeader>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            
            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase">Item Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-[#d97757]"
                    required
                />
            </div>

            {/* Category */}
            <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-bold text-gray-500 uppercase">Category</Label>
                <div className="relative">
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full h-11 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#d97757]"
                    >
                        {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Quantity & Unit Row */}
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                    <Label htmlFor="quantity" className="text-xs font-bold text-gray-500 uppercase">Quantity</Label>
                    <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        // FIX: step="any" allows decimals like 23.1
                        step="any" 
                        value={formData.quantity}
                        onChange={handleChange}
                        className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-[#d97757]"
                        required
                    />
                </div>
                <div className="col-span-1 space-y-2">
                    <Label htmlFor="unit" className="text-xs font-bold text-gray-500 uppercase">Unit</Label>
                    <div className="relative">
                         <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full h-11 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#d97757]"
                        >
                            <option value="units">Units</option>
                            <option value="lbs">Lbs</option>
                            <option value="kg">Kg</option>
                            <option value="oz">Oz</option>
                        </select>
                        <div className="absolute right-2 top-3 pointer-events-none text-gray-400">
                           {formData.unit === 'units' ? <Package className="h-4 w-4"/> : <Weight className="h-4 w-4"/>} 
                        </div>
                    </div>
                </div>
            </div>

            {/* Expiration */}
            <div className="space-y-2">
                <Label htmlFor="expirationDate" className="text-xs font-bold text-gray-500 uppercase">Expiration Date</Label>
                <div className="relative">
                    <Input
                        id="expirationDate"
                        name="expirationDate"
                        type="date"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-[#d97757]"
                    />
                    <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Storage */}
            <div className="space-y-2">
                <Label htmlFor="storageLocation" className="text-xs font-bold text-gray-500 uppercase">Storage Location</Label>
                <div className="relative">
                    <Input
                        id="storageLocation"
                        name="storageLocation"
                        value={formData.storageLocation}
                        onChange={handleChange}
                        placeholder="e.g. Shelf A"
                        className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-[#d97757]"
                    />
                    <MapPin className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </form>

        {/* FOOTER */}
        <SheetFooter className="p-6 border-t bg-gray-50 flex flex-row justify-between items-center sm:justify-between gap-3">
            {/* DELETE BUTTON */}
            <Button 
                type="button" 
                variant="destructive" 
                size="icon"
                className="h-11 w-11 shrink-0 bg-red-100 text-red-600 hover:bg-red-200 border border-red-200"
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
            >
               {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
            </Button>

            <div className="flex gap-3 flex-1 justify-end">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="h-11"
                >
                    Cancel
                </Button>
                <Button 
                    type="button" 
                    onClick={handleSubmit} 
                    disabled={isSaving || isDeleting || !pantryId}
                    className="h-11 bg-[#d97757] hover:bg-[#c06245] text-white min-w-[120px]"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  );
}