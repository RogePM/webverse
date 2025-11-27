'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Minus, Plus, Trash2, Check, ArrowRight,
    User, PackageOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { usePantry } from '@/components/providers/PantryProvider';

export function DistributionCart({ cart, onUpdateQty, onRemove, onCheckoutSuccess }) {
    const { pantryId } = usePantry();

    // Checkout Form State
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [clientName, setClientName] = useState('');
    const [clientId, setClientId] = useState('');
    const [reason, setReason] = useState('distribution-individual');

    // Processing State
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutStatus, setCheckoutStatus] = useState(null);

    // Helper: Format Category text
    const formatCategory = (cat) => {
        return cat ? cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General';
    };

    // --- CHECKOUT LOGIC ---
    const handleCheckout = async () => {
        if (cart.length === 0) return;
        if (!isAnonymous && !clientName.trim()) {
            alert("Please enter a Client Name or select 'Walk-in / Anonymous'");
            return;
        }

        setIsCheckingOut(true);
        try {
            for (const line of cart) {
                const { item, quantity } = line;
                const newStock = item.quantity - quantity;

                // A. Log Distribution
                await fetch('/api/foods/log-distribution', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-pantry-id': pantryId },
                    body: JSON.stringify({
                        itemId: item._id, itemName: item.name, category: item.category,
                        quantityDistributed: quantity, unit: 'units', reason: reason,
                        clientName: isAnonymous ? 'Walk-in Client' : clientName,
                        clientId: isAnonymous ? undefined : clientId
                    })
                });

                // B. Update/Delete Item
                if (newStock <= 0) {
                    await fetch(`/api/foods/${item._id}?reason=Distributed+Full+Stock`, {
                        method: 'DELETE',
                        headers: { 'x-pantry-id': pantryId }
                    });
                } else {
                    await fetch(`/api/foods/${item._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'x-pantry-id': pantryId },
                        body: JSON.stringify({
                            name: item.name, category: item.category, quantity: newStock,
                            expirationDate: item.expirationDate, storageLocation: item.storageLocation,
                            barcode: item.barcode
                        })
                    });
                }
            }

            setCheckoutStatus('success');

            // Reset Local Form
            setClientName('');
            setClientId('');

            // Notify Parent to clear cart and refresh inventory
            setTimeout(() => {
                setCheckoutStatus(null);
                onCheckoutSuccess();
            }, 1500);

        } catch (error) {
            console.error("Checkout Error:", error);
            alert("Error processing distribution.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center space-y-3">
                <PackageOpen className="h-12 w-12 opacity-20" />
                <p>Cart is empty</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* 1. SCROLLABLE ITEMS LIST */}
            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-100">
                    {cart.map(line => (
                        <div key={line.item._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex-1 min-w-0 pr-3">
                                <p className="font-medium text-sm truncate text-gray-900">{line.item.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{formatCategory(line.item.category)}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => onUpdateQty(line.item._id, -1)}
                                    disabled={isCheckingOut}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>

                                {/* EDITED: Input replaces Span */}
                                <Input
                                    type="number"
                                    step="any"
                                    value={line.quantity}
                                    disabled={isCheckingOut}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        // Only update if it's a valid number
                                        if (!isNaN(val) && val >= 0) {
                                            const delta = val - line.quantity;
                                            if (delta !== 0) onUpdateQty(line.item._id, delta);
                                        }
                                    }}
                                    className="w-16 h-8 p-0 text-center border border-gray-200 text-base md:text-sm font-mono font-medium focus-visible:ring-[#d97757] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => onUpdateQty(line.item._id, 1)}
                                    disabled={line.quantity >= line.item.quantity || isCheckingOut}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive ml-1"
                                    onClick={() => onRemove(line.item._id)}
                                    disabled={isCheckingOut}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. FIXED BOTTOM FORM */}
            <div className="p-5 border-t bg-gray-50 pb-safe-area">
                <div className="space-y-5">
                    {/* Anonymous Toggle */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isAnonymous ? 'bg-gray-100' : 'bg-blue-50 text-blue-600'}`}>
                                <User className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Recipient</span>
                                <span className="text-sm font-medium">{isAnonymous ? 'Anonymous / Walk-in' : 'Registered Client'}</span>
                            </div>
                        </div>
                        <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} disabled={isCheckingOut} />
                    </div>

                    {/* Client Inputs (Animated) */}
                    <AnimatePresence mode="wait">
                        {!isAnonymous && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-3 overflow-hidden"
                            >
                                <Input placeholder="Client Name (Required)" value={clientName} onChange={(e) => setClientName(e.target.value)} disabled={isCheckingOut} className="bg-white" />
                                <Input placeholder="Client ID (Optional)" value={clientId} onChange={(e) => setClientId(e.target.value)} disabled={isCheckingOut} className="bg-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Reason Select */}
                    <div className="grid gap-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Reason</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm" value={reason} onChange={(e) => setReason(e.target.value)} disabled={isCheckingOut}>
                            <option value="distribution-individual">Individual Assistance</option>
                            <option value="distribution-family">Family Box</option>
                            <option value="distribution-emergency">Emergency</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <Button
                        className={`w-full h-12 text-base font-semibold shadow-lg transition-all ${checkoutStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-[#d97757] hover:bg-[#c06245]'}`}
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || isCheckingOut}
                    >
                        {isCheckingOut ? "Processing..." : checkoutStatus === 'success' ? <><Check className="mr-2 h-5 w-5" /> Done!</> : <div className="flex items-center gap-2">Complete Distribution <ArrowRight className="h-4 w-4" /></div>}
                    </Button>
                </div>
            </div>
        </div>
    );
}