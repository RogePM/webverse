'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, X, 
    Calendar,
    AlertTriangle,
    PackageOpen,
    Pencil,
    Package // Icon for header
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InventoryFormBar } from '@/components/pages/InventoryForm.jsx';
import { categories as CATEGORY_OPTIONS } from '@/lib/constants';
import { usePantry } from '@/components/providers/PantryProvider';


// --- HELPERS ---
const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getExpirationStatus = (dateString) => {
    if (!dateString) return { color: 'bg-gray-100 text-gray-600', label: 'No Date', urgent: false };
    const today = new Date();
    const exp = new Date(dateString);
    const diffTime = exp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { color: 'bg-red-100 text-red-700 border-red-200', label: 'Expired', urgent: true };
    if (diffDays <= 7) return { color: 'bg-orange-100 text-orange-800 border-orange-200', label: `${diffDays} days left`, urgent: true };
    if (diffDays <= 30) return { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Expiring soon', urgent: false };
    return { color: 'bg-green-50 text-green-700 border-green-200', label: 'Good', urgent: false };
};

const getCategoryName = (value) => {
    const cat = CATEGORY_OPTIONS.find(c => c.value === value);
    return cat ? cat.name : value;
};

export function InventoryView() {
    const { pantryId } = usePantry();
    const [isSearchActive, setIsSearchActive] = useState(false);

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Modification Sheet State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const inputRef = useRef(null);

    // --- FETCH DATA ---
    const fetchInventory = async () => {
        if (!pantryId) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/foods', {
                headers: { 'x-pantry-id': pantryId }
            });
            if (response.ok) {
                const data = await response.json();
                const sortedData = data.data
                    .map(item => ({
                        ...item,
                        expirationDateObj: item.expirationDate ? new Date(item.expirationDate) : null,
                    }))
                    .sort((a, b) => {
                        if (!a.expirationDateObj) return 1;
                        if (!b.expirationDateObj) return -1;
                        const dateDiff = a.expirationDateObj - b.expirationDateObj;
                        if (dateDiff !== 0) return dateDiff;
                        return a.name.localeCompare(b.name);
                    });
                setInventory(sortedData);
                setFilteredInventory(sortedData);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (pantryId) fetchInventory();
    }, [pantryId]);

    // --- FILTER ---
    useEffect(() => {
        const q = searchQuery.toLowerCase();
        const filtered = inventory.filter(
            (item) =>
                item.name.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q) ||
                (item.barcode && item.barcode.includes(q))
        );
        setFilteredInventory(filtered);
    }, [searchQuery, inventory]);

    // --- HANDLERS ---
    const handleModify = (item) => {
        setSelectedItem(item);
        setIsSheetOpen(true);
    };

    const handleUpdate = () => {
        setIsSheetOpen(false);
        fetchInventory();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] bg-white">

            {/* --- HEADER & SEARCH --- */}
            <div className="p-4 border-b bg-white z-10 sticky top-0">
                <div className="max-w-7xl mx-auto w-full">
                    
                    {/* Title Section (Consistent with other pages) */}
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="h-5 w-5 text-[#d97757]" />
                            Inventory
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Manage your stock and track expirations</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* SEARCH LOGIC */}
                        <div className="relative flex-1">
                            {!isSearchActive && !searchQuery ? (
                                /* STATE 1: THE BUTTON (Prevents Keyboard Popup) */
                                <Button
                                    variant="outline"
                                    className="w-full h-11 justify-start text-muted-foreground bg-gray-50 border-gray-200 hover:bg-white hover:border-[#d97757] transition-all text-base font-normal"
                                    onClick={() => {
                                        setIsSearchActive(true);
                                        setTimeout(() => inputRef.current?.focus(), 50);
                                    }}
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Search inventory...
                                </Button>
                            ) : (
                                /* STATE 2: THE REAL INPUT (Active) */
                                <div className="relative w-full animate-in fade-in zoom-in-95 duration-200">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        ref={inputRef}
                                        placeholder="Search inventory..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={() => {
                                            if (!searchQuery) setIsSearchActive(false);
                                        }}
                                        className="pl-10 pr-10 h-11 text-base bg-white border-[#d97757] ring-1 ring-[#d97757] focus:ring-[#d97757] focus:border-[#d97757] transition-colors"
                                    />
                                    {/* CLOSE BUTTON */}
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setIsSearchActive(false);
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="flex-1 bg-gray-50/50 overflow-hidden">
                <ScrollArea className="h-full p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex h-40 items-center justify-center text-muted-foreground text-sm">
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-[#d97757] border-t-transparent rounded-full"></div>
                                Loading inventory...
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && filteredInventory.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-center">
                                <div className="bg-gray-100 p-4 rounded-full mb-4">
                                    <PackageOpen className="h-8 w-8 opacity-40" />
                                </div>
                                <h3 className="font-semibold text-lg text-gray-900">No items found</h3>
                                <p className="text-sm max-w-xs mx-auto mt-1">
                                    Try adjusting your search or add a new item.
                                </p>
                            </div>
                        )}

                        {/* GRID LAYOUT */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                            <AnimatePresence mode='popLayout'>
                                {filteredInventory.map((item) => {
                                    const expStatus = getExpirationStatus(item.expirationDate);

                                    return (
                                        <motion.div
                                            key={item._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <button
                                                onClick={() => handleModify(item)}
                                                className="group relative flex flex-col w-full text-left p-0 rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-[#d97757]/50 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden"
                                            >
                                                <div className="p-4 w-full">
                                                    {/* Top Row: Category & Status */}
                                                    <div className="flex justify-between items-start mb-3">
                                                        <Badge variant="outline" className="font-normal text-[10px] text-gray-600 bg-gray-50 uppercase tracking-wide">
                                                            {getCategoryName(item.category)}
                                                        </Badge>
                                                        {item.expirationDate && (
                                                            <Badge variant="outline" className={`text-[10px] font-medium border ${expStatus.color}`}>
                                                                {expStatus.urgent && <AlertTriangle className="h-3 w-3 mr-1" />}
                                                                {expStatus.label}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Middle Row: Name & Date */}
                                                    <h3 className="font-bold text-gray-900 truncate pr-2 text-base mb-1">
                                                        {item.name}
                                                    </h3>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" /> Exp: {formatDate(item.expirationDate)}
                                                    </div>
                                                </div>

                                                {/* Bottom Row: Quantity & Edit Action */}
                                                <div className="mt-auto border-t bg-gray-50/50 p-3 flex items-center justify-between w-full">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] uppercase font-bold text-gray-400">Current Stock</span>
                                                        <span className="text-sm font-bold text-gray-700">
                                                            {item.quantity} <span className="text-[10px] font-normal text-gray-500">{item.unit || 'units'}</span>
                                                        </span>
                                                    </div>

                                                    {/* Edit Icon Circle */}
                                                    <div className="h-8 w-8 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center shadow-sm group-hover:border-[#d97757] group-hover:text-[#d97757] transition-colors">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </div>
                                                </div>
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* --- MODAL SHEET --- */}
            <InventoryFormBar
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                item={selectedItem}
                onItemUpdated={handleUpdate}
            />
        </div>
    );
}