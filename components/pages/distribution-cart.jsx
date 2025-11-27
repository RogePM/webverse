'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Minus, Plus, Trash2, Check, ArrowRight,
    User, PackageOpen, Camera, X, Loader2, ScanBarcode
} from 'lucide-react';
import { useZxing } from "react-zxing";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { usePantry } from '@/components/providers/PantryProvider';

export function DistributionCart({ cart, onUpdateQty, onRemove, onCheckoutSuccess, onAddItemByBarcode }) {
    const { pantryId } = usePantry();

    // Checkout Form State
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [clientName, setClientName] = useState('');
    const [clientId, setClientId] = useState('');
    const [reason, setReason] = useState('distribution-individual');

    // Processing State
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutStatus, setCheckoutStatus] = useState(null);

    // Scanner State
    const [showScanner, setShowScanner] = useState(false);
    const [isLookingUp, setIsLookingUp] = useState(false);

    // Helper: Format Category text
    const formatCategory = (cat) => {
        return cat ? cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General';
    };

    // --- BARCODE SCAN HANDLER ---
    const handleBarcodeScanned = async (barcode) => {
        console.log('📷 Scanned barcode:', barcode);
        setShowScanner(false);
        setIsLookingUp(true);

        try {
            const res = await fetch(`/api/barcode/${encodeURIComponent(barcode)}`, {
                headers: { 'x-pantry-id': pantryId }
            });
            const data = await res.json();

            if (data.found && data.data) {
                console.log('✅ Found item:', data.data.name);
                // Call parent function to add item to cart
                if (onAddItemByBarcode) {
                    onAddItemByBarcode(data.data);
                }
            } else {
                alert('Item not found in inventory');
            }
        } catch (error) {
            console.error('❌ Barcode lookup error:', error);
            alert('Error looking up barcode');
        } finally {
            setIsLookingUp(false);
        }
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

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* CAMERA OVERLAY */}
            {showScanner && (
                <div className="absolute inset-0 z-50 bg-black flex flex-col">
                    <div className="flex items-center justify-between p-4 bg-black/50 absolute top-0 left-0 right-0 z-10">
                        <span className="text-white font-medium">Scan Item to Add</span>
                        <Button 
                            variant="ghost" 
                            className="text-white hover:bg-white/20" 
                            onClick={() => setShowScanner(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-black">
                        <div className="absolute text-white/50 text-sm z-0 flex items-center gap-2">
                            <Loader2 className="animate-spin h-4 w-4" /> Starting Camera...
                        </div>
                        <EnhancedScannerWrapper
                            onScan={handleBarcodeScanned}
                            onError={(error) => {
                                console.error("Scanner Error:", error);
                                if (error.name === 'NotAllowedError' || error.name === 'NotFoundError') {
                                    alert("Camera Error: Could not access camera.");
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowScanner(false)}
                            className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full h-12 w-12 backdrop-blur-md border border-white/10"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                        {/* Visual Guide Box */}
                        <div className="absolute border-2 border-[#d97757] w-64 h-40 rounded-lg opacity-50 pointer-events-none animate-pulse z-10"></div>
                    </div>
                    <div className="p-8 text-center text-white/70 text-sm">
                        Scan barcode to add item to cart
                    </div>
                </div>
            )}

            {/* LOADING OVERLAY */}
            {isLookingUp && (
                <div className="absolute inset-0 bg-black/50 z-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-3">
                        <Loader2 className="animate-spin h-5 w-5 text-[#d97757]" />
                        <span className="font-medium">Looking up item...</span>
                    </div>
                </div>
            )}

            {/* HEADER WITH SCAN BUTTON */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <PackageOpen className="h-5 w-5 text-[#d97757]" />
                    <h3 className="font-semibold text-lg">Distribution Cart</h3>
                    <span className="text-sm text-muted-foreground">({cart.length})</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowScanner(true)}
                    disabled={isCheckingOut}
                    className="gap-2"
                >
                    <Camera className="h-4 w-4" />
                    Scan
                </Button>
            </div>

            {/* CART ITEMS OR EMPTY STATE */}
            {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center space-y-4">
                    <PackageOpen className="h-16 w-16 opacity-20" />
                    <div>
                        <p className="font-medium mb-1">Cart is empty</p>
                        <p className="text-sm">Scan items or select from inventory</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowScanner(true)}
                        className="gap-2"
                    >
                        <ScanBarcode className="h-4 w-4" />
                        Start Scanning
                    </Button>
                </div>
            ) : (
                <>
                    {/* 1. SCROLLABLE ITEMS LIST */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="divide-y divide-gray-100">
                            {cart.map(line => (
                                <div 
                                    key={line.item._id} 
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0 pr-3">
                                        <p className="font-medium text-sm truncate text-gray-900">
                                            {line.item.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                            {formatCategory(line.item.category)}
                                        </p>
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

                                        <Input
                                            type="number"
                                            step="any"
                                            value={line.quantity}
                                            disabled={isCheckingOut}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
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
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Recipient
                                        </span>
                                        <span className="text-sm font-medium">
                                            {isAnonymous ? 'Anonymous / Walk-in' : 'Registered Client'}
                                        </span>
                                    </div>
                                </div>
                                <Switch 
                                    checked={isAnonymous} 
                                    onCheckedChange={setIsAnonymous} 
                                    disabled={isCheckingOut} 
                                />
                            </div>

                            {/* Client Inputs */}
                            <AnimatePresence mode="wait">
                                {!isAnonymous && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-3 overflow-hidden"
                                    >
                                        <Input 
                                            placeholder="Client Name (Required)" 
                                            value={clientName} 
                                            onChange={(e) => setClientName(e.target.value)} 
                                            disabled={isCheckingOut} 
                                            className="bg-white" 
                                        />
                                        <Input 
                                            placeholder="Client ID (Optional)" 
                                            value={clientId} 
                                            onChange={(e) => setClientId(e.target.value)} 
                                            disabled={isCheckingOut} 
                                            className="bg-white" 
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Reason Select */}
                            <div className="grid gap-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">
                                    Reason
                                </label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm" 
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

                            {/* Submit Button */}
                            <Button
                                className={`w-full h-12 text-base font-semibold shadow-lg transition-all ${
                                    checkoutStatus === 'success' 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-[#d97757] hover:bg-[#c06245]'
                                }`}
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || isCheckingOut}
                            >
                                {isCheckingOut ? (
                                    "Processing..."
                                ) : checkoutStatus === 'success' ? (
                                    <>
                                        <Check className="mr-2 h-5 w-5" /> Done!
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Complete Distribution <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ENHANCED SCANNER COMPONENT
function EnhancedScannerWrapper({ onScan, onError }) {
    const constraints = useMemo(() => ({
        video: {
            facingMode: "environment",
            width: { min: 1280, ideal: 1920 },
            height: { min: 720, ideal: 1080 },
            aspectRatio: { ideal: 1.777 },
            focusMode: "continuous"
        },
        audio: false
    }), []);

    const { ref } = useZxing({
        onDecodeResult(result) {
            onScan(result.getText());
        },
        onError(error) {
            if (onError) onError(error);
        },
        constraints: constraints,
        timeBetweenDecodingAttempts: 300,
    });

    return (
        <video
            ref={ref}
            className="w-full h-full object-cover"
            muted
            playsInline
        />
    );
}