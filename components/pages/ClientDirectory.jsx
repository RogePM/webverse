'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Users } from 'lucide-react';
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

// Ensure this path matches where you saved the form file
import { ClientFormDrawer } from './Client-form'; 

const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 }
    },
};

export function ClientListView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef(null);

    // Auto-focus search input on load
    useEffect(() => {
        inputRef.current?.focus();
        fetchClients();
    }, []);

    // Fetch clients from API
    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/client-distributions');
            
            if (response.ok) {
                const data = await response.json();
                // Ensure we handle the { data: [...] } structure correctly
                const clientList = data.data || [];
                setClients(clientList);
                setFilteredClients(clientList);
            } else {
                setClients([]);
                setFilteredClients([]);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            setClients([]);
            setFilteredClients([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter clients based on search
    useEffect(() => {
        const q = searchQuery.toLowerCase();
        const filtered = clients.filter(
            (client) =>
                (client.clientName && client.clientName.toLowerCase().includes(q)) ||
                (client.clientId && client.clientId.toLowerCase().includes(q)) ||
                (client.itemName && client.itemName.toLowerCase().includes(q)) // Also search by item name!
        );
        setFilteredClients(filtered);
    }, [searchQuery, clients]);

    // Open sheet to add new client
    const handleAddClient = () => {
        setSelectedClient(null); 
        setIsSheetOpen(true);
    };

    // Open sheet to modify client
    const handleModify = (client) => {
        setSelectedClient(client);
        setIsSheetOpen(true);
    };

    // After client update/create, refresh list and close sheet
    const handleUpdate = () => {
        setIsSheetOpen(false);
        fetchClients();
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Client Directory</h2>
                    <p className="text-muted-foreground">View distribution history and logs.</p>
                </div>
                <Button onClick={handleAddClient}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New Record
                </Button>
            </div>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="relative w-full sm:w-80">
                    <Input
                        ref={inputRef}
                        placeholder="Search name, ID, or item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            {/* Empty state */}
            {!isLoading && filteredClients.length === 0 && (
                <Card className="p-12 flex flex-col items-center justify-center text-center text-muted-foreground border-dashed">
                    <Users className="h-12 w-12 mb-4 opacity-20" />
                    <p>No records found.</p>
                    {searchQuery ? (
                        <p className="text-sm">Try adjusting your search terms.</p>
                    ) : (
                        <Button variant="link" onClick={handleAddClient} className="mt-2">
                            Add your first record
                        </Button>
                    )}
                </Card>
            )}

            {/* Table (desktop/tablet) */}
            <div className="hidden md:block rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Client ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Item Distributed</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {filteredClients.map((client) => (
                                <motion.tr
                                    key={client._id}
                                    variants={tableRowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="border-b transition-colors hover:bg-muted/50"
                                >
                                    {/* 1. Client ID */}
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {client.clientId || '—'}
                                    </TableCell>
                                    
                                    {/* 2. Name */}
                                    <TableCell className="font-medium">
                                        {client.clientName}
                                    </TableCell>
                                    
                                    {/* 3. Item Distributed (New Column) */}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{client.itemName}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {client.quantityDistributed} {client.unit || 'units'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    
                                    {/* 4. Distribution Date */}
                                    <TableCell>
                                        {client.distributionDate 
                                            ? new Date(client.distributionDate).toLocaleDateString() 
                                            : 'N/A'}
                                    </TableCell>
                                    
                                    {/* 5. Actions Button */}
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:text-primary"
                                            onClick={() => handleModify(client)}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {/* Mobile view (Cards) */}
            <div className="md:hidden space-y-3">
                {filteredClients.map((client) => (
                    <Card key={client._id} className="p-4 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">{client.clientName}</p>
                                {client.clientId && (
                                    <span className="text-xs bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                                        {client.clientId}
                                    </span>
                                )}
                            </div>
                            {/* Mobile Item Display */}
                            <div className="mt-2 text-sm">
                                <p>
                                    <span className="font-medium">Received: </span>
                                    {client.quantityDistributed} {client.unit} of {client.itemName}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {client.distributionDate 
                                    ? new Date(client.distributionDate).toLocaleDateString() 
                                    : 'N/A'}
                            </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleModify(client)}>
                            Edit
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Sheet for modifying inventory */}
            <ClientFormDrawer
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                client={selectedClient} // Fixed: Changed 'item' to 'client'
                onClientUpdated={handleUpdate} // Fixed: Changed 'onItemUpdated' to 'onClientUpdated'
            />
        </div>
    );
}