'use client';

import React, { useState, useEffect } from 'react';
import {
  ScanBarcode,
  Package,
  Weight,
  Wand2,
  Loader2,
  ArrowLeft,
  Camera,
  ChevronDown
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SheetHeader, SheetTitle } from '@/components/ui/SheetCart';
import { categories } from '@/lib/constants';
import { usePantry } from '@/components/providers/PantryProvider';
import { UpgradeModal } from '@/components/modals/UpgradeModal';

// IMPORT YOUR DEDICATED COMPONENT
// Ensure this path matches where you saved the component
import { BarcodeScannerOverlay } from '@/components/ui/BarcodeScannerOverlay';

export function AddItemForm({ initialCategory, onClose }) {
  const { pantryId } = usePantry();

  // --- STATE ---
  const [barcode, setBarcode] = useState('');
  const [isInternalBarcode, setIsInternalBarcode] = useState(false);
  const [category, setCategory] = useState(initialCategory || categories[0]?.value || 'canned');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('units');
  const [expirationDate, setExpirationDate] = useState('');

  // Loading & UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);
  const [showScanner, setShowScanner] = useState(false); // Controls Camera Overlay
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // --- LOGIC: Internal Barcode ---
  const generateInternalBarcode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    setBarcode(`INT-${randomCode}`);
    setIsInternalBarcode(true);
  };

  // --- LOGIC: Barcode Lookup ---
  useEffect(() => {
    const lookup = async () => {
      if (!barcode || barcode.length < 3 || isInternalBarcode) return;
      setIsLoadingBarcode(true);
      try {
        const res = await fetch(`/api/barcode/${encodeURIComponent(barcode)}`, {
          headers: { 'x-pantry-id': pantryId },
          cache: 'no-store'
        });
        const data = await res.json();
        if (data.found && data.data) {
          setItemName(data.data.name || '');
          setCategory(data.data.category || categories[0]?.value);
        }
      } catch (e) {
        console.error("Lookup failed", e);
      } finally {
        setIsLoadingBarcode(false);
      }
    };
    const timeout = setTimeout(lookup, 800);
    return () => clearTimeout(timeout);
  }, [barcode, isInternalBarcode, pantryId]);

  // --- UPDATED SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !quantity) return;

    setIsSubmitting(true);

    try {
      const finalBarcode = barcode.trim() || `GEN-${Date.now().toString().slice(-6)}`;
      const res = await fetch('/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-pantry-id': pantryId },
        body: JSON.stringify({
          barcode: finalBarcode,
          name: itemName,
          category,
          quantity: parseFloat(quantity),
          unit,
          expirationDate,
        })
      });

      if (res.status === 403) {
        setIsSubmitting(false);
        setShowUpgradeModal(true);
        return;
      }

      if (!res.ok) throw new Error("Failed");

      onClose();
    } catch (err) {
      alert("Error adding item. Please try again.");
      setIsSubmitting(false);
    }
  };

  // --- BRAND STYLES ---
  const brandColor = "#d97757";
  const focusClass = `focus-visible:ring-[${brandColor}] focus-visible:border-[${brandColor}]`;

  return (
    <div className="flex flex-col h-full bg-gray-50/50 relative">
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      {/* --- CAMERA OVERLAY IMPLEMENTATION --- */}
      {/* This is the only code needed now. 
         It sits outside the layout flow because the component handles "fixed inset-0".
      */}
      {showScanner && (
        <BarcodeScannerOverlay 
          onScan={(scannedCode) => {
            setBarcode(scannedCode);
            setShowScanner(false);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* HEADER */}
      <SheetHeader className="px-6 py-5 bg-white border-b flex flex-row items-center gap-4 space-y-0">
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden -ml-2 text-muted-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <SheetTitle className="text-xl font-bold text-gray-900">
          Add Incoming Stock
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 pb-32">

        {/* --- SECTION 1: IDENTIFICATION --- */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <ScanBarcode className="h-3.5 w-3.5 text-[#d97757]" /> Identification
            </Label>
            {isLoadingBarcode && <span className="text-xs text-[#d97757] animate-pulse">Looking up...</span>}
          </div>

          <div className="flex gap-2">
            {/* Barcode Input */}
            <div className="relative flex-1">
              <Input
                value={barcode}
                onChange={(e) => { setBarcode(e.target.value); setIsInternalBarcode(false); }}
                placeholder="Scan or enter code..."
                className={`h-12 pl-4 pr-4 bg-white shadow-sm border-gray-200 ${focusClass}`}
              />
            </div>

            {/* CAMERA BUTTON (Primary Action) */}
            <Button
              type="button"
              onClick={() => setShowScanner(true)}
              className="h-12 w-12 shrink-0 bg-gray-900 text-white hover:bg-[#d97757] transition-colors shadow-sm"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>

          {/* GENERATE HELPER (Secondary Action) */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-gray-400">Can't find a barcode?</p>
            <button
              type="button"
              onClick={generateInternalBarcode}
              className="text-xs font-medium text-[#d97757] hover:underline flex items-center gap-1"
            >
              <Wand2 className="h-3 w-3" /> Generate Internal ID
            </button>
          </div>
        </section>

        {/* --- SECTION 2: DETAILS --- */}
        <section className="space-y-4">
          <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-400 uppercase">Product Name</Label>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Organic Black Beans"
                className={`h-11 bg-gray-50 border-gray-200 ${focusClass}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-400 uppercase">Category</Label>
                <div className="relative">
                  <select
                    className={`appearance-none w-full h-11 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-[#d97757] focus:border-[#d97757]`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-400 uppercase">Expires</Label>
                <Input
                  type="date"
                  className={`h-11 bg-gray-50 border-gray-200 text-gray-600 ${focusClass}`}
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: INVENTORY LEVEL --- */}
        <section className="space-y-3">
          <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <Package className="h-3.5 w-3.5 text-[#d97757]" /> Inventory Level
          </Label>

          <div className="flex gap-0 shadow-sm rounded-lg overflow-hidden border border-gray-200">
            {/* Quantity Input */}
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`h-14 text-xl font-bold pl-4 border-0 rounded-none focus-visible:ring-inset focus-visible:ring-[#d97757] z-10 relative`}
              />
            </div>

            {/* UNIT SELECTOR */}
            <div className="relative bg-gray-50 border-l border-gray-200 w-32 shrink-0">
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-full appearance-none bg-transparent pl-4 pr-8 text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <optgroup label="Count">
                  <option value="units">Units</option>
                </optgroup>
                <optgroup label="Weight">
                  <option value="lbs">Lbs</option>
                  <option value="kg">Kg</option>
                  <option value="oz">Oz</option>
                </optgroup>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#d97757]">
                {unit === 'units' ? <Package className="h-4 w-4" /> : <Weight className="h-4 w-4" />}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
        <Button
          size="lg"
          className="w-full h-12 text-base font-semibold bg-[#d97757] hover:bg-[#c06245] shadow-lg shadow-[#d97757]/25 transition-all active:scale-[0.98]"
          onClick={handleSubmit}
          disabled={isSubmitting || !itemName || !quantity}
        >
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
          {isSubmitting ? "Adding to Pantry..." : "Confirm Item"}
        </Button>
      </div>
    </div>
  );
}