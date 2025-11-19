'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Minus, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
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

export function RemoveItemDrawer({ isOpen, onOpenChange, item, onItemRemoved }) {
  const [removeQuantity, setRemoveQuantity] = useState(1);
  const [unit, setUnit] = useState('units');
  const [reason, setReason] = useState('distribution-individual');
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- NEW LOGIC (from remove-item-view) ---
  // State to hold the item selected *inside* the drawer
  const [internalItem, setInternalItem] = useState(null);
  // State for the drawer's own search functionality
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [drawerSearchResults, setDrawerSearchResults] = useState([]);

  // Use the pre-selected item OR the internally-selected item
  const currentItem = item || internalItem;
  // --- END NEW LOGIC ---

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      // Reset all form fields
      setRemoveQuantity(1);
      setUnit('units');
      setReason('distribution-individual');
      setClientName('');
      setClientId('');
      setMessage({ type: '', text: '' });

      // --- NEW LOGIC ---
      // Reset internal search
      setInternalItem(null);
      setDrawerSearchQuery('');
      setDrawerSearchResults([]);

      // If in "Quick Remove" mode (no item prop), fetch inventory
      if (!item) {
        const fetchInventory = async () => {
          setIsLoading(true);
          try {
            const response = await fetch('/api/foods');
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
      // --- END NEW LOGIC ---
    }
  }, [isOpen, item]);

  // --- NEW LOGIC (from remove-item-view) ---
  // Effect to filter inventory based on the drawer's search query
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
    // Show top 5 results
    setDrawerSearchResults(filtered.slice(0, 5));
  }, [drawerSearchQuery, inventory]);
  // --- END NEW LOGIC ---

  const handleQuantityChange = (amount) => {
    setRemoveQuantity((prev) => Math.max(1, prev + amount));
  };

  // --- MODIFIED LOGIC ---
  // Use currentItem instead of item
  const maxQuantity = currentItem ? currentItem.quantity : 100;
  // --- END MODIFIED LOGIC ---

 const handleSubmit = async () => {
    setMessage({ type: '', text: '' });

    // Validation
    if (removeQuantity <= 0 || removeQuantity > maxQuantity) {
      setMessage({
        type: 'error',
        text: `Please enter a valid quantity (1-${maxQuantity})`,
      });
      return;
    }

    if (!currentItem) {
      setMessage({ type: 'error', text: 'Please select an item first' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate new quantity
      const newQuantity = currentItem.quantity - removeQuantity;

      // If quantity becomes 0 or negative, delete the item
      if (newQuantity <= 0) {
        // ✅ UPDATED: Include client metadata in delete request
        const params = new URLSearchParams({
          reason,
          removedQuantity: removeQuantity.toString(),
          unit,
        });
        
        // Add optional client fields if filled
        if (clientName.trim()) params.append('clientName', clientName.trim());
        if (clientId.trim()) params.append('clientId', clientId.trim());

        const deleteResponse = await fetch(`/api/foods/${currentItem._id}?${params.toString()}`, {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          throw new Error('Failed to remove item');
        }
      } else {
        // Update item quantity
        const updateResponse = await fetch(`/api/foods/${currentItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: currentItem.name,
            category: currentItem.category,
            quantity: newQuantity,
            expirationDate: currentItem.expirationDate,
            storageLocation: currentItem.storageLocation || 'N/A',
            lastModified: new Date().toISOString(),
            barcode: currentItem.barcode || undefined,
          }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update item');
        }

        // ✅ NEW: Log the partial removal with client info if provided
        if (clientName.trim()) {
          await fetch('/api/foods/log-distribution', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              itemId: currentItem._id,
              itemName: currentItem.name,
              category: currentItem.category,
              removedQuantity: removeQuantity,
              unit,
              reason,
              clientName: clientName.trim(),
              clientId: clientId.trim() || undefined,
            }),
          });
        }
      }

      setMessage({ type: 'success', text: 'Item removed successfully!' });

      // Call callback to refresh inventory
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
      setMessage({
        type: 'error',
        text: error.message || 'Failed to remove item. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // --- NEW LOGIC ---
  // When a user clicks a search result
  const handleSelectSearchResult = (selectedItem) => {
    setInternalItem(selectedItem); // Set this as the item to remove
    setDrawerSearchQuery(''); // Clear search
    setDrawerSearchResults([]); // Clear results
  };
  // --- END NEW LOGIC ---

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <SheetOverlay onClick={() => onOpenChange(false)} />
          <SheetContent
            onClose={() => onOpenChange(false)}
            className="flex flex-col"
            side="right"
            open={isOpen}
          >
            <SheetHeader>
              <SheetTitle>Remove Inventory Item</SheetTitle>
              {/* --- MODIFIED LOGIC --- */}
              {currentItem ? ( // Use currentItem
                <SheetDescription>
                  {currentItem.name} ({currentItem.category})
                  <br />
                  Exp: {formatDate(currentItem.expirationDate)} • Available:{' '}
                  {currentItem.quantity}
                </SheetDescription>
              ) : (
                <SheetDescription>
                  Manually remove an item from inventory.
                </SheetDescription>
              )}
              {/* --- END MODIFIED LOGIC --- */}
            </SheetHeader>

            {/* Form Content */}
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              <div className="grid gap-6">
                {/* --- MODIFIED LOGIC --- */}
                {/* Manual Item Search (only if no item pre-selected) */}
                {!currentItem && ( // Use currentItem
                  <div className="grid gap-2">
                    <Label htmlFor="manual-search">Search for Item</Label>
                    <Input
                      id="manual-search"
                      placeholder="Type to search all inventory..."
                      value={drawerSearchQuery} // Bind value
                      onChange={(e) => setDrawerSearchQuery(e.target.value)} // Bind onChange
                    />
                    
                    {/* --- NEW LOGIC --- */}
                    {/* Render search results */}
                    {isLoading && (
                      <p className="text-xs text-muted-foreground">Loading...</p>
                    )}
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
                            <span className="text-muted-foreground">
                              {' '}
                              (Qty: {result.quantity})
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {/* --- END NEW LOGIC --- */}
                  </div>
                )}
                {/* --- END MODIFIED LOGIC --- */}
                
                {/* --- NEW LOGIC --- */}
                {/* Show form only if an item is selected */}
                {currentItem && (
                // --- END NEW LOGIC ---
                  <>
                    {/* Quantity Stepper */}
                    <div className="grid gap-2">
                      <Label htmlFor="remove-quantity">
                        Quantity to Remove
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={removeQuantity <= 1}
                          type="button"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id="remove-quantity"
                          type="number"
                          value={removeQuantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setRemoveQuantity(
                              Math.max(1, Math.min(val, maxQuantity))
                            );
                          }}
                          className="w-20 text-center"
                          min="1"
                          max={maxQuantity}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(1)}
                          disabled={removeQuantity >= maxQuantity}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <div className="flex rounded-md border border-input overflow-hidden h-9">
                          <Toggle
                            pressed={unit === 'units'}
                            onClick={() => setUnit('units')}
                            type="button"
                            className="rounded-r-none border-r border-input data-[state=on]:bg-accent data-[state=on]:text-accent-foreground h-9 px-3 text-xs"
                            size="sm"
                          >
                            Units
                          </Toggle>
                          <Toggle
                            pressed={unit === 'pounds'}
                            onClick={() => setUnit('pounds')}
                            type="button"
                            className="rounded-l-none data-[state=on]:bg-accent data-[state=on]:text-accent-foreground h-9 px-3 text-xs"
                            size="sm"
                          >
                            <Weight className="mr-1 h-3.5 w-3.5" />
                            Lbs
                          </Toggle>
                        </div>
                      </div>
                      {/* --- MODIFIED LOGIC --- */}
                      {currentItem && ( // Use currentItem
                        <p className="text-xs text-muted-foreground">
                          Max available: {currentItem.quantity}
                        </p>
                      )}
                      {/* --- END MODIFIED LOGIC --- */}
                    </div>

                    {/* Reason Dropdown */}
                    <div className="grid gap-2">
                      <Label htmlFor="remove-reason">Reason</Label>
                      <Select
                        id="remove-reason"
                        name="remove-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      >
                        <SelectItem value="distribution-individual">
                          Distributed to Individual
                        </SelectItem>
                        <SelectItem value="distribution-family">
                          Distributed to Family
                        </SelectItem>
                        <SelectItem value="distribution-partner">
                          Distributed to Partner
                        </SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </Select>
                    </div>

                    {/* Client Name */}
                    <div className="grid gap-2">
                      <Label htmlFor="client-name">
                        Client Name (optional)
                      </Label>
                      <Input
                        id="client-name"
                        name="client-name"
                        placeholder="e.g. Maria Lopez or Family #203"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>

                    {/* Client ID */}
                    <div className="grid gap-2">
                      <Label htmlFor="client-id">Client ID (optional)</Label>
                      <Input
                        id="client-id"
                        name="client-id"
                        placeholder="For organizations using registration IDs"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                      />
                    </div>
                  </>
                // --- NEW LOGIC ---
                )}
                {/* --- END NEW LOGIC --- */}

                {/* Message Display */}
                {message.text && (
                  <div
                    className={`text-sm p-2 rounded-md ${
                      message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <SheetFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                // --- MODIFIED LOGIC ---
                disabled={isSubmitting || !currentItem} // Use currentItem
                // --- END MODIFIED LOGIC ---
              >
                {isSubmitting ? 'Removing...' : 'Confirm Remove'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </>
      )}
    </AnimatePresence>
  );
}