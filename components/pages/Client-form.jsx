'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, Save, User, Calendar as CalendarIcon } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// USE THE CORRECT SHEET COMPONENT
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from '@/components/ui/SheetCart';

import { usePantry } from '@/components/providers/PantryProvider';

export function ClientFormDrawer({ isOpen, onOpenChange, client, onClientUpdated }) {
  const { pantryId } = usePantry();

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
  const [isDeleting, setIsDeleting] = useState(false);
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

    if (!pantryId) {
      setMessage({ type: 'error', text: 'Pantry ID missing. Refresh page.' });
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

      // If creating new via this form, default values for required fields
      if (!isEditing) {
        payload = {
          ...payload,
          itemName: 'General Visit', // Default generic item
          category: 'Other',
          quantityDistributed: 1,
          unit: 'units',
          reason: 'distribution-individual',
        };
      } else {
        payload = {
          ...client, // Keep existing item details
          ...formData, // Overwrite client details
        };
      }

      const response = await fetch(url, {
        method: method,
        headers: { 
            'Content-Type': 'application/json',
            'x-pantry-id': pantryId
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save record');
      }

      setMessage({ type: 'success', text: `Record ${isEditing ? 'updated' : 'created'} successfully!` });

      setTimeout(() => {
        onClientUpdated();
        onOpenChange(false); // Close drawer
      }, 800);

    } catch (error) {
      console.error('Error saving record:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this record completely?')) return;
    if (!pantryId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/client-distributions?id=${client._id}`, {
        method: 'DELETE',
        headers: {
            'x-pantry-id': pantryId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      setMessage({ type: 'success', text: 'Record deleted successfully' });
      
      setTimeout(() => {
        onClientUpdated();
        onOpenChange(false);
      }, 800);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full p-0 bg-white">
        
        {/* HEADER */}
        <SheetHeader className="px-6 py-5 border-b">
          <SheetTitle className="text-xl font-bold text-gray-900">
            {client ? 'Edit Record' : 'Quick Add Client'}
          </SheetTitle>
          {message.text && (
             <div className={`text-sm font-medium px-3 py-2 rounded-md mt-2 w-full ${
                 message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
             }`}>
                 {message.text}
             </div>
          )}
        </SheetHeader>

        {/* FORM BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            
            {/* Client Name */}
            <div className="space-y-2">
                <Label htmlFor="clientName" className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <User className="h-3 w-3" /> Client Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleChange('clientName', e.target.value)}
                    placeholder="e.g. Maria Lopez"
                    className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-[#d97757]"
                    autoFocus 
                />
            </div>

            {/* Client ID */}
            <div className="space-y-2">
                <Label htmlFor="clientId" className="text-xs font-bold text-gray-500 uppercase">Client ID (Optional)</Label>
                <Input
                    id="clientId"
                    value={formData.clientId}
                    onChange={(e) => handleChange('clientId', e.target.value)}
                    placeholder="e.g. User123"
                    className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-[#d97757]"
                />
            </div>

            {/* Date */}
            <div className="space-y-2">
                <Label htmlFor="distributionDate" className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3" /> Date & Time
                </Label>
                <Input
                    id="distributionDate"
                    type="datetime-local"
                    value={formData.distributionDate}
                    onChange={(e) => handleChange('distributionDate', e.target.value)}
                    className="h-11 bg-gray-50 border-gray-200 focus-visible:ring-[#d97757]"
                />
            </div>
        </div>

        {/* FOOTER */}
        <SheetFooter className="p-6 border-t bg-gray-50 flex flex-row justify-between items-center gap-3">
            
            {/* DELETE (Only if editing) */}
            {client ? (
                <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon"
                    className="h-11 w-11 shrink-0 bg-red-100 text-red-600 hover:bg-red-200 border border-red-200 shadow-none"
                    onClick={handleDelete}
                    disabled={isSubmitting || isDeleting}
                >
                   {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                </Button>
            ) : <div />}

            <div className="flex gap-3 flex-1 justify-end">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="h-11 border-gray-200 hover:bg-white hover:text-gray-900"
                    disabled={isSubmitting || isDeleting}
                >
                    Cancel
                </Button>
                <Button 
                    type="button" 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || isDeleting}
                    className="h-11 bg-[#d97757] hover:bg-[#c06245] text-white min-w-[120px] shadow-md shadow-[#d97757]/20"
                >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {isSubmitting ? 'Saving...' : (client ? 'Update' : 'Add')}
                </Button>
            </div>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  );
}