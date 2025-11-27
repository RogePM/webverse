'use client';

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

export function UpgradeModal({ isOpen, onClose }) {
  
  const handleUpgradeClick = () => {
    // 1. Set the hash to navigate to Settings
    window.location.hash = 'Settings';
    // 2. Force reload to ensure dashboard state updates
    window.location.reload(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      
      {/* 'aria-describedby' helps screen readers connect the description text */}
      <DialogContent 
        className="sm:max-w-[400px] p-0 border-0 shadow-2xl bg-white rounded-3xl overflow-hidden gap-0" 
        aria-describedby="upgrade-desc"
      >
        
        {/* --- HEADER SECTION --- */}
        <div className="bg-gradient-to-b from-orange-50/80 to-white pt-12 pb-6 px-6 flex flex-col items-center text-center relative">
            
            {/* Icon - Floating Effect */}
            <div className="h-16 w-16 bg-white rounded-2xl shadow-lg shadow-orange-500/10 flex items-center justify-center mb-6 ring-1 ring-black/5">
                <Sparkles className="h-8 w-8 text-[#d97757]" strokeWidth={1.5} />
            </div>

            {/* FIX: Used <DialogTitle> instead of <h2> */}
            <DialogTitle className="text-2xl font-serif font-medium text-gray-900 tracking-tight mb-2 text-center">
                Unlock Potential
            </DialogTitle>

            {/* FIX: Used <DialogDescription> for the subtitle */}
            <DialogDescription id="upgrade-desc" className="text-sm text-gray-500 leading-relaxed max-w-[260px] text-center">
                You have reached the limits of your current plan. Upgrade to remove all restrictions.
            </DialogDescription>
        </div>
        
        {/* --- BODY SECTION --- */}
        <div className="px-8 pb-8 space-y-8">
            
            {/* Feature List */}
            <div className="space-y-4">
                <FeatureItem text="Unlimited Inventory Items" />
                <FeatureItem text="Export Data (CSV/Excel)" />
                <FeatureItem text="Unlimited Staff Accounts" />
                <FeatureItem text="Priority Support" />
            </div>

            {/* --- CTA BUTTON --- */}
            <Button 
                className="w-full bg-[#d97757] hover:bg-[#c06245] text-white h-14 rounded-full text-base font-medium shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-[0.98]"
                onClick={handleUpgradeClick} 
            >
                Upgrade to Pro &mdash; $30
            </Button>

            {/* Micro-copy */}
            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                Cancel Anytime • Secure Payment
            </p>
        </div>

      </DialogContent>
    </Dialog>
  );
}

// Helper for consistent list items
function FeatureItem({ text }) {
    return (
        <div className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-green-100/50 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-green-700" strokeWidth={3} />
            </div>
            <span className="text-sm text-gray-600 font-medium">{text}</span>
        </div>
    );
}