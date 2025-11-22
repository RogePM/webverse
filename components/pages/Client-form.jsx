'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';

export function ClientFormDrawer({ isOpen, onOpenChange, client, onClientUpdated }) {
  const formatDateForInput = (isoString) => {
    if (!isoString) return new Date().toISOString().slice(0, 16);
    return new Date(isoString).toISOString().slice(0, 16);
  };

  const initialData = {
    clientName: '',
    clientId: '',
    distributionDate: new Date().toISOString().slice(0, 16), 
  };

  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isOpen) {
      setMessage({ type: '', text: '' });
      if (client) {
        setFormData({
          clientName: client.clientName || '',
          clientId: client.clientId || '',
          distributionDate: formatDateForInput(client.distributionDate),
        });
      } else {
        setFormData({
          clientName: '',
          clientId: '',
          distributionDate: new Date().toISOString().slice(0, 16),
        });
      }
    }
  }, [isOpen, client]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });

    if (!formData.clientName) {
      setMessage({ type: 'error', text: 'Client Name is required.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const isEditing = !!client;
      const method = isEditing ? 'PUT' : 'POST';
      
      const url = isEditing 
        ? `/api/client-distributions?id=${client._id}` 
        : '/api/client-distributions';

      let payload = { ...formData };

      if (!isEditing) {
        payload = {
          ...payload,
          itemName: 'General Visit',
          category: 'Other',
          quantityDistributed: 1,
          unit: 'units',
          reason: 'distribution-individual',
        };
      } else {
        payload = {
          ...client, 
          ...formData,
        };
      }

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save record');
      }

      setMessage({ type: 'success', text: `Record ${isEditing ? 'updated' : 'created'} successfully!` });

      setTimeout(() => {
        onClientUpdated();
        onOpenChange(false);
      }, 1000);

    } catch (error) {
      console.error('Error saving record:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this record completely?')) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/client-distributions?id=${client._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      setMessage({ type: 'success', text: 'Record deleted successfully' });
      
      setTimeout(() => {
        onClientUpdated();
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <SheetOverlay onClick={() => onOpenChange(false)} />
          <SheetContent onClose={() => onOpenChange(false)} className="flex flex-col w-full sm:max-w-md">
            
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <SheetHeader className="pr-6">
              <SheetTitle>{client ? 'Edit Record' : 'Quick Add Client'}</SheetTitle>
              <SheetDescription>
                {client 
                  ? 'Update client details or date.' 
                  : 'Register a client visit (defaults to "General Visit").'}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 py-6 overflow-y-auto px-1">
              <div className="grid gap-5">
                
                <div className="grid gap-2">
                    <Label htmlFor="clientName">Client Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => handleChange('clientName', e.target.value)}
                        placeholder="e.g. Maria Lopez"
                        autoFocus 
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="clientId">Client ID (Optional)</Label>
                    <Input
                        id="clientId"
                        value={formData.clientId}
                        onChange={(e) => handleChange('clientId', e.target.value)}
                        placeholder="e.g. User1"
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="distributionDate">Date & Time</Label>
                    <Input
                        id="distributionDate"
                        type="datetime-local"
                        value={formData.distributionDate}
                        onChange={(e) => handleChange('distributionDate', e.target.value)}
                    />
                </div>

                {message.text && (
                  <div className={`text-sm p-2 rounded-md ${
                    message.type === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}
              </div>
            </div>

            {/* UPDATED FOOTER: 
               - Uses justify-between to separate Delete (left) from Actions (right) on Desktop.
               - On Mobile (flex-col-reverse), Delete sits at the bottom, Actions on top.
            */}
            <SheetFooter className="gap-3 sm:justify-between">
               
               {/* Delete Button */}
               {client ? (
                <Button 
                    variant="destructive" 
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto" 
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </Button>
              ) : (
                <div /> /* Spacer to keep "Save" on the right if no delete button */
              )}

              {/* Action Buttons (Side-by-side on mobile) */}
              <div className="flex gap-3 w-full sm:w-auto">
                <Button 
                    variant="ghost" 
                    onClick={() => onOpenChange(false)} 
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none" // flex-1 makes them equal width on mobile
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none" // flex-1 makes them equal width on mobile
                >
                    {isSubmitting ? 'Saving...' : (client ? 'Update' : 'Add')}
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </>
      )}
    </AnimatePresence>
  );
}