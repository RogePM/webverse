'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, 
    Filter, 
    Plus, 
    Pencil, 
    ArrowUpDown,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    AlertCircle,
    Package,
    Layers,
    Camera,
    Loader2 // Needed for the looking up state
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InventoryFormBar } from '@/components/pages/InventoryForm.jsx';
import { BarcodeScannerOverlay } from '@/components/ui/BarcodeScannerOverlay';
import { categories as CATEGORY_OPTIONS } from '@/lib/constants';
import { usePantry } from '@/components/providers/PantryProvider';

// --- HELPERS ---
const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getExpirationStatus = (dateString) => {
    if (!dateString) return { 
        label: 'No Date', 
        badge: 'bg-gray-100 text-gray-600 border-gray-200',
        borderLeft: 'border-l-gray-300',
        text: 'text-gray-500'
    };

    const today = new Date();
    const exp = new Date(dateString);
    const diffTime = exp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { 
        label: 'Expired', 
        badge: 'bg-red-50 text-red-700 border-red-200', 
        borderLeft: 'border-l-red-500',
        text: 'text-red-700 font-bold'
    };

    if (diffDays <= 7) return { 
        label: `${diffDays} Days Left`, 
        badge: 'bg-orange-50 text-orange-800 border-orange-200', 
        borderLeft: 'border-l-orange-500',
        text: 'text-orange-700 font-semibold'
    };

    if (diffDays <= 14) return { 
        label: 'Expiring Soon', 
        badge: 'bg-yellow-50 text-yellow-800 border-yellow-200', 
        borderLeft: 'border-l-yellow-400',
        text: 'text-yellow-700 font-medium'
    };

    return { 
        label: 'Good', 
        badge: 'bg-green-50 text-green-700 border-green-200', 
        borderLeft: 'border-l-green-500',
        text: 'text-green-700'
    };
};

const getCategoryName = (value) => {
    const cat = CATEGORY_OPTIONS.find(c => c.value === value);
    return cat ? cat.name : value;
};

export function InventoryView() {
    const { pantryId } = usePantry();
    
    // Data State
    const [searchQuery, setSearchQuery] = useState('');
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Modal State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Scanner State
    const [showScanner, setShowScanner] = useState(false);
    const [isLookingUp, setIsLookingUp] = useState(false);
    
    // --- FETCH INVENTORY ---
    const fetchInventory = async () => {
        if (!pantryId) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/foods', { headers: { 'x-pantry-id': pantryId } });
            if (response.ok) {
                const data = await response.json();
                const sortedData = data.data.sort((a, b) => {
                    if (!a.expirationDate) return 1;
                    if (!b.expirationDate) return -1;
                    return new Date(a.expirationDate) - new Date(b.expirationDate);
                });
                setInventory(sortedData);
                setFilteredInventory(sortedData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { if (pantryId) fetchInventory(); }, [pantryId]);

    // --- FILTER LOGIC ---
    useEffect(() => {
        const q = searchQuery.toLowerCase();
        setFilteredInventory(inventory.filter(i => 
            i.name.toLowerCase().includes(q) || 
            i.category.toLowerCase().includes(q) ||
            (i.barcode && i.barcode.includes(q))
        ));
    }, [searchQuery, inventory]);

    // --- HANDLERS ---
    const handleModify = (item) => {
        setSelectedItem(item);
        setIsSheetOpen(true);
    };

    // --- BARCODE LOGIC ---
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
                
                // 1. Try to find in current inventory list first
                const localItem = inventory.find(item => item.barcode === barcode || item.name === data.data.name);
                
                if (localItem) {
                    // Item exists! Filter the view to show it so user can edit.
                    setSearchQuery(localItem.name);
                } else {
                    // Item is in DB but not in user's inventory. 
                    // Set search query to name so they see "No items found" but can click "Add Item" easily?
                    // Or pre-fill the form? For now, we just filter by name.
                    setSearchQuery(data.data.name);
                    alert(`Item "${data.data.name}" recognized, but not in your current list.`);
                }
            } else {
                alert('Item not found in global database.');
            }
        } catch (error) {
            console.error('❌ Barcode lookup error:', error);
            alert('Error looking up barcode');
        } finally {
            setIsLookingUp(false);
        }
    };

    // --- DESKTOP GRID LAYOUT ---
    const desktopGridClass = "md:grid md:grid-cols-[2.5fr_1fr_1.5fr_1fr_0.8fr_auto] md:gap-4 md:items-center";

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] bg-white font-sans text-sm md:text-base">
            
            {/* --- CONTROLS SECTION --- */}
            <div className="px-4 md:px-6 py-5 bg-white z-10 sticky top-0 border-b border-gray-100 shadow-sm md:shadow-none">
                
                {/* TITLE SECTION (New) */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="h-5 w-5 text-[#d97757]" />
                        Inventory
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Manage your stock and track expirations</p>
                </div>

                {/* CONTROLS ROW */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    
                    {/* SEARCH + CAMERA GROUP */}
                    <div className="flex w-full sm:max-w-md gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Search inventory..." 
                                className="pl-9 h-11 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:ring-[#d97757] focus:border-[#d97757] transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        {/* CAMERA BUTTON */}
                        <Button
                            className="h-11 w-11 shrink-0 bg-[#d97757] text-white hover:bg-[#d97757]/70 shadow-sm"
                            onClick={() => setShowScanner(true)}
                        >
                            <Camera className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2 w-full sm:w-auto">
                         <Button 
                            className="flex-1 sm:flex-none h-11 text-white border-none shadow-sm hover:opacity-90 transition-opacity font-medium"
                            style={{ backgroundColor: '#d97757' }}
                            onClick={() => handleModify(null)}
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Item
                        </Button>
                    </div>
                </div>

                {/* --- DESKTOP HEADER --- */}
                <div className={`hidden md:grid ${desktopGridClass} bg-gray-50 rounded-lg px-4 py-3 border border-gray-100`}>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-900 flex items-center">
                        Item Name <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Expiration</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide text-center">Stock</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Action</div>
                </div>
            </div>

            {/* --- LIST CONTENT --- */}
            <div className="flex-1 overflow-hidden bg-gray-50 md:bg-white">
                <ScrollArea className="h-full">
                    <div className="pb-24 px-4 md:px-6 md:pt-2 pt-4">
                        
                        {!isLoading && filteredInventory.length === 0 && (
                            <div className="py-20 text-center text-gray-400 flex flex-col items-center">
                                <Package className="h-12 w-12 opacity-10 mb-3" />
                                <p>No items found</p>
                                {searchQuery && <p className="text-xs mt-2">No match for "{searchQuery}"</p>}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 md:gap-0">
                            <AnimatePresence>
                                {filteredInventory.map((item) => {
                                    const status = getExpirationStatus(item.expirationDate);
                                    
                                    return (
                                        <motion.div
                                            key={item._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            layout
                                            className="group md:border-b md:border-gray-100 last:border-0"
                                        >
                                            <div 
                                                onClick={() => handleModify(item)}
                                                className={`
                                                cursor-pointer relative
                                                /* DESKTOP STYLES */
                                                md:grid ${desktopGridClass} md:p-4 md:hover:bg-gray-50/80 md:rounded-none md:shadow-none md:bg-white md:border-l-0
                                                
                                                /* MOBILE STYLES (Z-Pattern Card) */
                                                flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 p-5
                                                ${status.borderLeft} border-l-[6px] 
                                            `}>
                                                
                                                {/* --- TOP ROW (Mobile) --- */}
                                                <div className="flex justify-between items-start w-full md:w-auto mb-4 md:mb-0">
                                                    {/* Name & Barcode */}
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg md:text-base leading-tight">
                                                            {item.name}
                                                        </h3>
                                                        {item.barcode && (
                                                            <span className="text-xs text-gray-400 font-mono mt-1 block">
                                                                {item.barcode}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Mobile Edit Button (Top Right) */}
                                                    <div className="md:hidden -mr-2 -mt-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-gray-400 hover:text-[#d97757] hover:bg-orange-50"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleModify(item);
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* --- MIDDLE ROW (Mobile: Category & Stock) --- */}
                                                <div className="flex items-center gap-4 text-sm text-gray-600 md:text-gray-700 md:w-auto mb-4 md:mb-0">
                                                    
                                                    {/* Category */}
                                                    <div className="flex items-center gap-1.5 md:flex-1">
                                                        <Layers className="h-3.5 w-3.5 text-gray-400 md:hidden" />
                                                        <span>{getCategoryName(item.category)}</span>
                                                    </div>

                                                    {/* Stock (Shown here on Mobile) */}
                                                    <div className="md:hidden flex items-center gap-1.5 ml-auto bg-gray-50 px-2 py-1 rounded text-gray-900 font-semibold border border-gray-100">
                                                        <Package className="h-3.5 w-3.5 text-gray-400" />
                                                        {item.quantity} <span className="text-xs font-normal text-gray-500">{item.unit || 'units'}</span>
                                                    </div>
                                                </div>

                                                {/* --- BOTTOM ROW (Mobile: Date & Status) --- */}
                                                <div className="flex justify-between items-center w-full md:contents">
                                                    
                                                    {/* Expiration Date */}
                                                    <div className="flex items-center gap-2 md:w-auto">
                                                        <Calendar className="md:hidden h-4 w-4 text-gray-400" />
                                                        <span className={`text-sm font-medium ${status.text} md:text-gray-700`}>
                                                            {formatDate(item.expirationDate)}
                                                        </span>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="md:w-auto">
                                                        <span className={`
                                                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm
                                                            ${status.badge}
                                                        `}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Desktop Stock (Center Aligned) */}
                                                <div className="hidden md:flex justify-center text-sm font-semibold text-gray-900">
                                                    {item.quantity} <span className="text-gray-400 font-normal text-xs ml-1">{item.unit || 'units'}</span>
                                                </div>

                                                {/* Desktop Edit Button */}
                                                <div className="hidden md:flex justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-400 hover:text-[#d97757] hover:bg-orange-50"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleModify(item);
                                                        }}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* --- OVERLAYS --- */}
            
            {/* 1. Barcode Scanner Overlay */}
            {showScanner && (
                <BarcodeScannerOverlay
                    onScan={handleBarcodeScanned}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* 2. API Loading Overlay */}
            {isLookingUp && (
                <div className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-3">
                        <Loader2 className="animate-spin h-5 w-5 text-[#d97757]" />
                        <span className="font-medium text-gray-700">Looking up item...</span>
                    </div>
                </div>
            )}

            {/* 3. Edit Modal */}
            <InventoryFormBar
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                item={selectedItem}
                onItemUpdated={() => { setIsSheetOpen(false); fetchInventory(); }}
            />
        </div>
    );
}