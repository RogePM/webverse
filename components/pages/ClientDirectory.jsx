'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    UserPlus, 
    Users, 
    Calendar,
    Pencil,
    History
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ClientFormDrawer } from './Client-form'; 
import { usePantry } from '@/components/providers/PantryProvider';

const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 }
    },
};

export function ClientListView() {
    const { pantryId } = usePantry();

    const [searchQuery, setSearchQuery] = useState('');
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Used for toggling search focus if needed
    const inputRef = useRef(null);

    useEffect(() => {
        if (pantryId) {
            fetchClients();
        }
    }, [pantryId]);

    const fetchClients = async () => {
        if (!pantryId) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/client-distributions', {
                headers: { 'x-pantry-id': pantryId }
            });
            
            if (response.ok) {
                const data = await response.json();
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

    useEffect(() => {
        const q = searchQuery.toLowerCase();
        const filtered = clients.filter(
            (client) =>
                (client.clientName && client.clientName.toLowerCase().includes(q)) ||
                (client.clientId && client.clientId.toLowerCase().includes(q)) ||
                (client.itemName && client.itemName.toLowerCase().includes(q))
        );
        setFilteredClients(filtered);
    }, [searchQuery, clients]);

    const handleAddClient = () => {
        setSelectedClient(null); 
        setIsSheetOpen(true);
    };

    const handleModify = (client) => {
        setSelectedClient(client);
        setIsSheetOpen(true);
    };

    const handleUpdate = () => {
        setIsSheetOpen(false);
        fetchClients();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] bg-white">
            
            {/* --- HEADER & ACTIONS --- */}
            <div className="p-4 border-b bg-white z-10 sticky top-0">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-0">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#d97757]" />
                                Client Directory
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">View distribution history and logs</p>
                        </div>
                        <Button 
                            onClick={handleAddClient} 
                            disabled={!pantryId}
                            className="bg-[#d97757] hover:bg-[#c06245] text-white shadow-sm"
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Record
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full mt-3 md:mt-0">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            ref={inputRef}
                            placeholder="Search by name, ID, or item..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 text-base bg-gray-50 border-gray-200 focus:bg-white focus:ring-[#d97757] focus:border-[#d97757] transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="flex-1 bg-gray-50/50 overflow-hidden">
                <ScrollArea className="h-full p-4 md:p-6">
                    <div className="max-w-7xl mx-auto pb-20">

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex h-40 items-center justify-center text-muted-foreground text-sm">
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-[#d97757] border-t-transparent rounded-full"></div>
                                Loading directory...
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && filteredClients.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-center">
                                <div className="bg-gray-100 p-4 rounded-full mb-4">
                                    <Users className="h-8 w-8 opacity-40" />
                                </div>
                                <h3 className="font-semibold text-lg text-gray-900">No records found</h3>
                                <p className="text-sm max-w-xs mx-auto mt-1">
                                    {searchQuery ? "Try adjusting your search terms." : "Add your first client record to get started."}
                                </p>
                                {!searchQuery && (
                                    <Button variant="link" onClick={handleAddClient} className="mt-2 text-[#d97757]">
                                        Add Record Now
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Desktop Table */}
                        <div className="hidden md:block rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                        <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Client ID</TableHead>
                                        <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Name</TableHead>
                                        <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Item Distributed</TableHead>
                                        <TableHead className="font-semibold text-xs uppercase tracking-wider text-gray-500">Date</TableHead>
                                        <TableHead className="text-right font-semibold text-xs uppercase tracking-wider text-gray-500">Actions</TableHead>
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
                                                className="border-b last:border-0 hover:bg-gray-50/50 transition-colors group"
                                            >
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    {client.clientId || '—'}
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900">
                                                    {client.clientName}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-gray-700">{client.itemName}</span>
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                            <span className="font-medium text-[#d97757]">{client.quantityDistributed} {client.unit || 'units'}</span>
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {client.distributionDate 
                                                        ? new Date(client.distributionDate).toLocaleDateString() 
                                                        : 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-400 hover:text-[#d97757]"
                                                        onClick={() => handleModify(client)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-3">
                            <AnimatePresence>
                                {filteredClients.map((client) => (
                                    <motion.div
                                        key={client._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <Card className="p-4 flex justify-between items-start border-gray-200 shadow-sm active:scale-[0.99] transition-transform">
                                            <div className="flex-1 min-w-0 mr-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-gray-900 truncate">{client.clientName}</h4>
                                                    {client.clientId && (
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-mono bg-gray-100 text-gray-600 border-0">
                                                            {client.clientId}
                                                        </Badge>
                                                    )}
                                                </div>
                                                
                                                <div className="text-sm text-gray-600 mb-2">
                                                    Received <span className="font-bold text-[#d97757]">{client.quantityDistributed} {client.unit || 'units'}</span> of {client.itemName}
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {client.distributionDate 
                                                        ? new Date(client.distributionDate).toLocaleDateString() 
                                                        : 'N/A'}
                                                </div>
                                            </div>
                                            
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-9 px-3 border-gray-200 hover:border-[#d97757] hover:text-[#d97757]"
                                                onClick={() => handleModify(client)}
                                            >
                                                Edit
                                            </Button>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                    </div>
                </ScrollArea>
            </div>

            {/* --- FORM DRAWER --- */}
            <ClientFormDrawer
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                client={selectedClient}
                onClientUpdated={handleUpdate}
            />
        </div>
    );
}