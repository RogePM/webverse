'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useZxing } from "react-zxing";

// --- INTERNAL HELPER: The Camera Feed ---
function EnhancedScannerWrapper({ onScan, onError }) {
  const constraints = useMemo(() => ({
    video: {
      facingMode: "environment", // Uses back camera on mobile
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

// --- MAIN COMPONENT ---
export function BarcodeScannerOverlay({ onScan, onClose }) {
  return (
    // FIXED POSITIONING: This breaks it out of any parent container to cover the whole screen
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      
      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 pt-safe-top flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <span className="text-white font-medium drop-shadow-md">Scan Barcode</span>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0" 
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* MAIN CAMERA AREA */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
        
        {/* 1. The Video Feed (Background) */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm z-0">
            <Loader2 className="animate-spin h-6 w-6 mr-2" /> Starting Camera...
          </div>
          <EnhancedScannerWrapper
            onScan={onScan}
            onError={(error) => {
              console.error("Scanner Error:", error);
              if (error.name === 'NotAllowedError') alert("Camera access denied.");
            }}
          />
        </div>

        {/* 2. THE SCANNING WINDOW (The "Hole in the Wall" Effect) */}
        <div className="relative z-10 flex flex-col items-center">
            
            {/* The Box with the giant shadow */}
            <div className="relative w-80 h-52 rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.85)] border-2 border-white/20 overflow-hidden">
                
                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#d97757] rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#d97757] rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#d97757] rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#d97757] rounded-br-2xl"></div>

                {/* Laser Animation */}
                <motion.div
                    initial={{ top: 0, opacity: 0.4 }}
                    animate={{ top: "100%", opacity: 0.4 }}
                    transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "linear",
                        repeatType: "loop"
                    }}
                    className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                />
                
                {/* Center Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Plus className="h-8 w-8 text-white" strokeWidth={0.5} />
                </div>
            </div>

            <p className="mt-8 text-white/90 text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                Place barcode inside the frame
            </p>
        </div>

        {/* Manual Close Button (Bottom) */}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={onClose}
          className="absolute bottom-10 z-50 rounded-full h-14 w-14 shadow-lg bg-white text-black hover:bg-gray-200"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}