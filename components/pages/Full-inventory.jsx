'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { InventoryFormBar } from '@/components/pages/InventoryForm.jsx';
import { categories as CATEGORY_OPTIONS } from '@/lib/constants';


export function InventoryView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef(null);

    const getCategoryName = (value) => {
        const cat = CATEGORY_OPTIONS.find(c => c.value === value);
        return cat ? cat.name : value;
    };


    // Auto-focus search input on load
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Fetch inventory from API
    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/foods');
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
                        return a.expirationDateObj - b.expirationDateObj;
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
        fetchInventory();
    }, []);

    // Filter inventory based on search
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

    // Open sheet to modify item
    const handleModify = (item) => {
        setSelectedItem(item);
        setIsSheetOpen(true);
    };

    // After item update, refresh inventory and close sheet
    const handleUpdate = () => {
        setIsSheetOpen(false);
        fetchInventory();
    };

    // Helper to check if item is expiring soon
    const isExpiringSoon = (expirationDateObj) => {
        if (!expirationDateObj) return false;
        const now = new Date();
        const diffDays = (expirationDateObj - now) / (1000 * 60 * 60 * 24);
        return diffDays <= 3; // highlight items expiring in 3 days or less
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Search bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div className="relative w-full sm:w-80">
                    <Input
                        ref={inputRef}
                        placeholder="Search by name, category, or barcode..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            {/* Empty state */}
            {!isLoading && filteredInventory.length === 0 && (
                <Card className="p-8 text-center text-muted-foreground border-dashed">
                    Start by adding your first item.
                </Card>
            )}

            {/* Table (desktop/tablet) */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Barcode</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead>Storage</TableHead>
                            <TableHead>Last Modified</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {filteredInventory.map((item) => {
                                const expSoon = isExpiringSoon(item.expirationDateObj);
                                return (
                                    <motion.tr
                                        key={item._id}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="border-b"
                                    >
                                        <TableCell>{item.barcode || '—'}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{getCategoryName(item.category)}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell className={expSoon ? 'text-red-600 font-medium' : ''}>
                                            {item.expirationDateObj
                                                ? item.expirationDateObj.toLocaleDateString()
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>{item.storageLocation || '—'}</TableCell>
                                        <TableCell>{new Date(item.lastModified).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleModify(item)}
                                            >
                                                Modify
                                            </Button>
                                        </TableCell>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {/* Mobile view */}
            <div className="md:hidden space-y-2">
                {filteredInventory.slice(0, 10).map((item) => {
                    const expSoon = isExpiringSoon(item.expirationDateObj);
                    return (
                        <Card
                            key={item._id}
                            className={`p-3 flex justify-between items-center ${expSoon ? 'border border-red-600' : ''
                                }`}
                        >
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                {getCategoryName(item.category)} • Qty: {item.quantity}{' '}
                                    {item.expirationDateObj && (
                                        <span className={expSoon ? 'text-red-600' : ''}>
                                            • {item.expirationDateObj.toLocaleDateString()}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handleModify(item)}>
                                Modify
                            </Button>
                        </Card>
                    );
                })}
            </div>

            {/* Sheet for modifying inventory */}
            <InventoryFormBar
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                item={selectedItem}
                onItemUpdated={handleUpdate}
            />
        </div>
    );
}
