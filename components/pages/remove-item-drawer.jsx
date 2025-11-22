'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Minus, Weight, X } from 'lucide-react'; // Added X
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select'; // Ensure this is the custom wrapper or native
import { Toggle } from '@/components/ui/toggle';
import {
  Sheet,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
// 1. Import Hook
import { usePantry } from '@/components/providers/PantryProvider';

export function RemoveItemDrawer({ isOpen, onOpenChange, item, onItemRemoved }) {
  // 2. Get Pantry ID
  const { pantryId } = usePantry();

  const [removeQuantity, setRemoveQuantity] = useState(1);
  const [unit, setUnit] = useState('units');
  const [reason, setReason] = useState('distribution-individual');
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Internal Search Logic
  const [internalItem, setInternalItem] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [drawerSearchResults, setDrawerSearchResults] = useState([]);

  const currentItem = item || internalItem;

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setRemoveQuantity(1);
      setUnit('units');
      setReason('distribution-individual');
      setClientName('');
      setClientId('');
      setMessage({ type: '', text: '' });

      setInternalItem(null);
      setDrawerSearchQuery('');
      setDrawerSearchResults([]);

      // If no item passed, fetch inventory for search
      if (!item && pantryId) {
        const fetchInventory = async () => {
          setIsLoading(true);
          try {
            const response = await fetch('/api/foods', {
              headers: { 'x-pantry-id': pantryId } // 3. Pass Header
            });
            if (response.ok) {
              const data = await response.json();
              setInventory(data.data || []);
            }
          } catch (error) {
            console.error('Error fetching inventory:', error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchInventory();
      }
    }
  }, [isOpen, item, pantryId]);

  // Search Filter
  useEffect(() => {
    if (drawerSearchQuery.trim() === '') {
      setDrawerSearchResults([]);
      return;
    }
    const filtered = inventory.filter(
      (invItem) =>
        invItem.name?.toLowerCase().includes(drawerSearchQuery.toLowerCase()) ||
        invItem.barcode?.includes(drawerSearchQuery)
    );
    setDrawerSearchResults(filtered.slice(0, 5));
  }, [drawerSearchQuery, inventory]);

  const handleQuantityChange = (amount) => {
    setRemoveQuantity((prev) => Math.max(1, prev + amount));
  };

  const maxQuantity = currentItem ? currentItem.quantity : 100;

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });

    // ... (Keep validation logic the same) ...
    if (removeQuantity <= 0 || removeQuantity > maxQuantity) {
      setMessage({ type: 'error', text: `Please enter a valid quantity (1-${maxQuantity})` });
      return;
    }
    if (!currentItem) {
      setMessage({ type: 'error', text: 'Please select an item first' });
      return;
    }
    if (!pantryId) return;

    setIsSubmitting(true);

    try {
      const newQuantity = currentItem.quantity - removeQuantity;

      // Scenario 1: DELETE (Quantity goes to 0)
      if (newQuantity <= 0) {
        const params = new URLSearchParams({
          reason,
          removedQuantity: removeQuantity.toString(),
          unit,
        });
        if (clientName.trim()) params.append('clientName', clientName.trim());
        if (clientId.trim()) params.append('clientId', clientId.trim());

        const deleteResponse = await fetch(`/api/foods/${currentItem._id}?${params.toString()}`, {
          method: 'DELETE',
          headers: { 'x-pantry-id': pantryId },
        });

        if (!deleteResponse.ok) throw new Error('Failed to remove item');

      } else {
        // Scenario 2: UPDATE (Partial removal)

        // Step A: Update the Inventory Item Quantity
        const updateResponse = await fetch(`/api/foods/${currentItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-pantry-id': pantryId,
          },
          body: JSON.stringify({
            name: currentItem.name,
            category: currentItem.category,
            quantity: newQuantity, // The new lower quantity
            expirationDate: currentItem.expirationDate,
            storageLocation: currentItem.storageLocation || 'N/A',
            barcode: currentItem.barcode || undefined,
          }),
        });

        if (!updateResponse.ok) throw new Error('Failed to update item');

        // Step B: Log the Distribution manually
        // Only log if there is a client name, OR if you want to track waste/usage without a client
        if (clientName.trim() || reason) {
          await fetch('/api/foods/log-distribution', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-pantry-id': pantryId
            },
            body: JSON.stringify({
              itemId: currentItem._id,
              itemName: currentItem.name,
              category: currentItem.category,

              // ✅ FIX: Map 'removedQuantity' to 'quantityDistributed' 
              // This matches your ClientDistributionSchema!
              quantityDistributed: removeQuantity,

              unit,
              reason,
              clientName: clientName.trim() || 'Unknown', // Ensure required field isn't empty
              clientId: clientId.trim() || undefined,
            }),
          });
        }
      }

      setMessage({ type: 'success', text: 'Item removed successfully!' });

      if (onItemRemoved) {
        setTimeout(() => {
          onItemRemoved();
          onOpenChange(false);
        }, 1000);
      } else {
        setTimeout(() => {
          onOpenChange(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to remove item.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSelectSearchResult = (selectedItem) => {
    setInternalItem(selectedItem);
    setDrawerSearchQuery('');
    setDrawerSearchResults([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <SheetOverlay onClick={() => onOpenChange(false)} />
          <SheetContent onClose={() => onOpenChange(false)} className="flex flex-col" side="right" open={isOpen}>

            {/* Custom Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <SheetHeader className="pr-6">
              <SheetTitle>Remove Inventory Item</SheetTitle>
              {currentItem ? (
                <SheetDescription>
                  {currentItem.name} ({currentItem.category})
                  <br />
                  Exp: {formatDate(currentItem.expirationDate)} • Available: {currentItem.quantity}
                </SheetDescription>
              ) : (
                <SheetDescription>
                  Manually remove an item from inventory.
                </SheetDescription>
              )}
            </SheetHeader>

            <div className="flex-1 px-6 py-4 overflow-y-auto">
              <div className="grid gap-6">

                {/* Search Bar (Only if no item pre-selected) */}
                {!currentItem && (
                  <div className="grid gap-2">
                    <Label htmlFor="manual-search">Search for Item</Label>
                    <Input
                      id="manual-search"
                      placeholder="Type to search all inventory..."
                      value={drawerSearchQuery}
                      onChange={(e) => setDrawerSearchQuery(e.target.value)}
                    />
                    {isLoading && <p className="text-xs text-muted-foreground">Loading...</p>}
                    {drawerSearchResults.length > 0 && (
                      <div className="mt-2 space-y-1 rounded-md border bg-muted/50 p-2">
                        {drawerSearchResults.map((result) => (
                          <button
                            key={result._id}
                            type="button"
                            className="block w-full rounded-sm p-2 text-left text-sm hover:bg-background"
                            onClick={() => handleSelectSearchResult(result)}
                          >
                            <span className="font-medium">{result.name}</span>
                            <span className="text-muted-foreground"> (Qty: {result.quantity})</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {currentItem && (
                  <>
                    {/* Quantity Stepper */}
                    <div className="grid gap-2">
                      <Label htmlFor="remove-quantity">Quantity to Remove</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline" size="icon" type="button"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={removeQuantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id="remove-quantity" type="number"
                          value={removeQuantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setRemoveQuantity(Math.max(1, Math.min(val, maxQuantity)));
                          }}
                          className="w-20 text-center"
                          min="1" max={maxQuantity}
                        />
                        <Button
                          variant="outline" size="icon" type="button"
                          onClick={() => handleQuantityChange(1)}
                          disabled={removeQuantity >= maxQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <div className="flex rounded-md border border-input overflow-hidden h-9">
                          <Toggle pressed={unit === 'units'} onClick={() => setUnit('units')} size="sm" className="rounded-r-none border-r">Units</Toggle>
                          <Toggle pressed={unit === 'pounds'} onClick={() => setUnit('pounds')} size="sm" className="rounded-l-none"><Weight className="mr-1 h-3.5 w-3.5" /> Lbs</Toggle>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Max available: {currentItem.quantity}</p>
                    </div>

                    {/* Reason & Client Info */}
                    <div className="grid gap-2">
                      <Label htmlFor="remove-reason">Reason</Label>
                      {/* Use standard select for safety */}
                      <div className="relative">
                        <select
                          id="remove-reason"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        >
                          <option value="distribution-individual">Distributed to Individual</option>
                          <option value="distribution-family">Distributed to Family</option>
                          <option value="distribution-partner">Distributed to Partner</option>
                          <option value="expired">Expired</option>
                          <option value="damaged">Damaged</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="client-name">Client Name (optional)</Label>
                      <Input id="client-name" placeholder="e.g. Maria Lopez" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="client-id">Client ID (optional)</Label>
                      <Input id="client-id" placeholder="ID Number" value={clientId} onChange={(e) => setClientId(e.target.value)} />
                    </div>
                  </>
                )}

                {message.text && (
                  <div className={`text-sm p-2 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {message.text}
                  </div>
                )}
              </div>
            </div>

            <SheetFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting || !currentItem}>
                {isSubmitting ? 'Removing...' : 'Confirm Remove'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </>
      )}
    </AnimatePresence>
  );
}