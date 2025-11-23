'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus, Trash2, ShoppingCart, User, AlertCircle, Check, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // You might need to install/create this, or use a checkbox
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/seperator';
import { Badge } from '@/components/ui/badge';
import { usePantry } from '@/components/providers/PantryProvider';
import { Select, SelectItem } from '@/components/ui/select'; // Wrapper or native

export function DistributionView() {
    const { pantryId } = usePantry();

    // Data State
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const searchInputRef = useRef(null);

    // Cart State
    const [cart, setCart] = useState([]); // Array of { item, quantity }

    // Checkout Form State
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [clientName, setClientName] = useState('');
    const [clientId, setClientId] = useState('');
    const [reason, setReason] = useState('distribution-individual');

    // Processing State
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutStatus, setCheckoutStatus] = useState(null); // 'success' | 'error'

    // 1. Fetch Inventory on Load
    const fetchInventory = async () => {
        if (!pantryId) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/foods', {
                headers: { 'x-pantry-id': pantryId }
            });
            if (res.ok) {
                const data = await res.json();
                setInventory(data.data || []);
            }
        } catch (error) {
            console.error("Failed to load inventory", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (pantryId) fetchInventory();
        // Auto-focus search
        searchInputRef.current?.focus();
    }, [pantryId]);

    // 2. Filter Inventory
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredItems(inventory.slice(0, 10)); // Show top 10 by default
            return;
        }
        const lowerQ = searchQuery.toLowerCase();
        const results = inventory.filter(item =>
            item.name.toLowerCase().includes(lowerQ) ||
            item.barcode?.includes(lowerQ) ||
            item.category.toLowerCase().includes(lowerQ)
        );
        setFilteredItems(results);
    }, [searchQuery, inventory]);

    // 3. Cart Actions
    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(line => line.item._id === item._id);
            if (existing) {
                // Increment if stock allows
                if (existing.quantity < item.quantity) {
                    return prev.map(line =>
                        line.item._id === item._id
                            ? { ...line, quantity: line.quantity + 1 }
                            : line
                    );
                }
                return prev; // Max stock reached
            }
            // Add new line
            return [...prev, { item, quantity: 1 }];
        });
        // Clear search to allow rapid scanning
        setSearchQuery('');
        searchInputRef.current?.focus();
    };

    const updateCartQty = (itemId, delta) => {
        setCart(prev => prev.map(line => {
            if (line.item._id === itemId) {
                const newQty = line.quantity + delta;
                // Clamp between 1 and Max Stock
                const validQty = Math.max(1, Math.min(newQty, line.item.quantity));
                return { ...line, quantity: validQty };
            }
            return line;
        }));
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(line => line.item._id !== itemId));
    };

    // 4. Checkout Process
    const handleCheckout = async () => {
        if (cart.length === 0) return;
        if (!isAnonymous && !clientName.trim()) {
            alert("Please enter a Client Name or select 'Walk-in / Anonymous'");
            return;
        }

        setIsCheckingOut(true);

        try {
            // Process items sequentially to ensure data integrity
            for (const line of cart) {
                const { item, quantity } = line;
                const newStock = item.quantity - quantity;

                // ✅ If stock reaches 0, DELETE with proper logging
                if (newStock <= 0) {
                    const deleteParams = new URLSearchParams({
                        reason: reason,
                        clientName: isAnonymous ? 'Walk-in Client' : clientName,
                        removedQuantity: quantity.toString(),
                        unit: 'units'
                    });

                    // Add clientId only if provided
                    if (!isAnonymous && clientId.trim()) {
                        deleteParams.append('clientId', clientId);
                    }

                    const deleteRes = await fetch(`/api/foods/${item._id}?${deleteParams.toString()}`, {
                        method: 'DELETE',
                        headers: {
                            'x-pantry-id': pantryId
                        }
                    });

                    if (!deleteRes.ok) {
                        const errorData = await deleteRes.json().catch(() => ({}));
                        throw new Error(`Failed to delete ${item.name}: ${errorData.message || 'Unknown error'}`);
                    }

                    console.log(`✅ Deleted ${item.name} (stock depleted)`);

                } else {
                    // A. Update Inventory Quantity (PUT)
                    const updateRes = await fetch(`/api/foods/${item._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-pantry-id': pantryId
                        },
                        body: JSON.stringify({
                            name: item.name,
                            category: item.category,
                            quantity: newStock,
                            expirationDate: item.expirationDate,
                            storageLocation: item.storageLocation,
                            barcode: item.barcode
                        })
                    });

                    if (!updateRes.ok) {
                        const errorData = await updateRes.json().catch(() => ({}));
                        throw new Error(`Failed to update ${item.name}: ${errorData.message || 'Unknown error'}`);
                    }

                    console.log(`✅ Updated ${item.name}: ${item.quantity} → ${newStock}`);

                    // B. Log Distribution for partial distribution (POST)
                    const logRes = await fetch('/api/foods/log-distribution', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-pantry-id': pantryId
                        },
                        body: JSON.stringify({
                            itemId: item._id,
                            itemName: item.name,
                            category: item.category,
                            quantityDistributed: quantity,
                            unit: 'units',
                            reason: reason,
                            clientName: isAnonymous ? 'Walk-in Client' : clientName,
                            clientId: isAnonymous ? undefined : clientId
                        })
                    });

                    if (!logRes.ok) {
                        console.warn(`⚠️ Failed to log distribution for ${item.name}`);
                    }
                }
            }

            // Success!
            setCheckoutStatus('success');
            setCart([]);
            setClientName('');
            setClientId('');
            setIsAnonymous(false);
            setReason('distribution-individual');
            fetchInventory(); // Refresh stock data

            // Show success message
            setTimeout(() => setCheckoutStatus(null), 3000);

        } catch (error) {
            console.error("Checkout Error:", error);
            alert(`Error processing distribution: ${error.message}`);
            setCheckoutStatus('error');
            setTimeout(() => setCheckoutStatus(null), 3000);
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">

            {/* LEFT COLUMN: Search & Inventory */}
            <div className="md:col-span-2 flex flex-col gap-4 h-full">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        ref={searchInputRef}
                        placeholder="Scan barcode or type item name..."
                        className="pl-10 h-12 text-lg shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isCheckingOut}
                    />
                </div>

                <Card className="flex-1 overflow-hidden border-dashed">
                    <ScrollArea className="h-full p-4">
                        {isLoading ? (
                            <p className="text-center text-muted-foreground py-10">Loading inventory...</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filteredItems.map(item => {
                                    const inCart = cart.find(c => c.item._id === item._id);
                                    const available = item.quantity - (inCart?.quantity || 0);
                                    const isOOS = available <= 0;

                                    return (
                                        <button
                                            key={item._id}
                                            onClick={() => !isOOS && addToCart(item)}
                                            disabled={isOOS || isCheckingOut}
                                            className={`
                         flex flex-col items-start p-3 rounded-lg border text-left transition-all
                         ${isOOS
                                                    ? 'opacity-50 bg-gray-50 cursor-not-allowed'
                                                    : 'hover:border-primary hover:shadow-sm bg-white'}
                       `}
                                        >
                                            <div className="flex justify-between w-full mb-1">
                                                <span className="font-semibold truncate w-full">{item.name}</span>
                                            </div>
                                            <div className="flex justify-between w-full text-xs text-muted-foreground">
                                                <span>{item.category}</span>
                                                <span className={available < 5 ? "text-red-600 font-bold" : ""}>
                                                    {available} left
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                                {filteredItems.length === 0 && (
                                    <div className="col-span-full text-center py-10 text-muted-foreground">
                                        No items found.
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                </Card>
            </div>

            {/* RIGHT COLUMN: Cart & Checkout */}
            <div className="md:col-span-1 flex flex-col gap-4 h-full">
                <Card className="flex-1 flex flex-col shadow-lg border-l-4 border-l-primary overflow-hidden">
                    <CardHeader className="pb-3 border-b bg-muted/10">
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" /> Distribution Cart
                            </span>
                            <Badge variant="secondary">{cart.reduce((acc, curr) => acc + curr.quantity, 0)} Items</Badge>
                        </CardTitle>
                    </CardHeader>

                    <div className="flex-1 overflow-y-auto p-0">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                                <PackageOpen className="h-12 w-12 mb-3 opacity-20" />
                                <p>Cart is empty.</p>
                                <p className="text-sm">Select items from the left to add them.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {cart.map(line => (
                                    <div key={line.item._id} className="flex items-center justify-between p-4 hover:bg-muted/20">
                                        <div className="flex-1 min-w-0 pr-3">
                                            <p className="font-medium truncate">{line.item.name}</p>
                                            <p className="text-xs text-muted-foreground">Max: {line.item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                                variant="outline" size="icon" className="h-8 w-8"
                                                onClick={() => updateCartQty(line.item._id, -1)}
                                                disabled={isCheckingOut}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center font-mono">{line.quantity}</span>
                                            <Button
                                                variant="outline" size="icon" className="h-8 w-8"
                                                onClick={() => updateCartQty(line.item._id, 1)}
                                                disabled={line.quantity >= line.item.quantity || isCheckingOut}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 ml-1"
                                                onClick={() => removeFromCart(line.item._id)}
                                                disabled={isCheckingOut}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Checkout Form */}
                    <div className="p-4 bg-muted/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Recipient Details</Label>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="anon-mode" className="text-xs cursor-pointer">Walk-in / Anonymous</Label>
                                <Switch
                                    id="anon-mode"
                                    checked={isAnonymous}
                                    onCheckedChange={setIsAnonymous}
                                    disabled={isCheckingOut}
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {!isAnonymous && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-3 overflow-hidden"
                                >
                                    <Input
                                        placeholder="Client Name (e.g. Maria Lopez)"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        disabled={isCheckingOut}
                                    />
                                    <Input
                                        placeholder="Client ID (Optional)"
                                        value={clientId}
                                        onChange={(e) => setClientId(e.target.value)}
                                        disabled={isCheckingOut}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid gap-2">
                            <Label className="text-xs">Distribution Reason</Label>
                            {/* Native Select for Simplicity */}
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                disabled={isCheckingOut}
                            >
                                <option value="distribution-individual">Individual Assistance</option>
                                <option value="distribution-family">Family Box</option>
                                <option value="distribution-emergency">Emergency</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Button
                            className="w-full h-12 text-lg"
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || isCheckingOut}
                        >
                            {isCheckingOut ? (
                                "Processing..."
                            ) : checkoutStatus === 'success' ? (
                                <><Check className="mr-2 h-5 w-5" /> Done!</>
                            ) : (
                                `Distribute ${cart.reduce((acc, c) => acc + c.quantity, 0)} Items`
                            )}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}