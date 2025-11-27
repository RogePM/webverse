'use client';

import React, { useState, useEffect } from 'react';
import { 
  Copy, Building, Users, Shield, Download, 
  FileSpreadsheet, Check, ArrowRight, LayoutGrid,
  CreditCard, Lock, DollarSign, User, Zap, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBrowserClient } from '@supabase/ssr';
import { usePantry } from '@/components/providers/PantryProvider';

export function SettingsView() {
  const { pantryId, userRole, pantryDetails } = usePantry();
  
  // Use Context Details as default, only fetch if context is null
  const [details, setDetails] = useState(pantryDetails);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]); // State for fetched members

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // --- DERIVED STATE & LOGIC ---
  const isAdmin = userRole === 'admin';
  const currentTier = details?.subscription_tier || 'basic';
  const isProOrEnterprise = currentTier !== 'basic';
  const maxLimit = details?.max_items_limit || 150;

  // --- 1. FETCH PANTRY DETAILS (If not loaded by Context) ---
  useEffect(() => {
    const fetchSettings = async () => {
      if (pantryDetails) {
        setDetails(pantryDetails);
        setLoading(false);
        return;
      }
      if (!pantryId) return;
      
      const { data, error } = await supabase
        .from('food_pantries')
        .select('*')
        .eq('pantry_id', pantryId)
        .single();

      if (!error && data) setDetails(data);
      setLoading(false);
    };
    fetchSettings();
  }, [pantryId, pantryDetails, supabase]);
  
  // --- 2. FETCH MEMBER LIST (ADMIN ONLY) ---
  useEffect(() => {
      const fetchMembers = async () => {
          if (!isAdmin || !pantryId) return;
          const { data } = await supabase
              .from('pantry_members')
              .select(`
                user_id,
                role,
                user:user_profiles (name, phone)
              `)
              .eq('pantry_id', pantryId);
          setMembers(data || []);
      };
      fetchMembers();
  }, [pantryId, isAdmin, supabase]);


  // --- 3. COPY & EXPORT LOGIC (Kept as is) ---
  const copyToClipboard = () => {
    if (details?.join_code) {
      navigator.clipboard.writeText(details.join_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = async (type) => {
    if (!pantryId || !isProOrEnterprise) return; // Block Basic users at the UI level
    setIsExporting(true);
    // ... (rest of export logic remains the same) ...
    try {
      const endpoint = type === 'inventory' ? '/api/foods' : '/api/client-distributions';
      const response = await fetch(endpoint, { headers: { 'x-pantry-id': pantryId } });

      if (!response.ok) throw new Error('Failed to fetch data');

      const json = await response.json();
      const data = json.data || [];

      if (data.length === 0) {
        alert('No data available to export.');
        return;
      }

      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => 
        Object.values(row).map(value => {
            const stringValue = String(value ?? '');
            return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
      );
      
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${details?.name || 'pantry'}_${type}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data.');
    } finally {
      setIsExporting(false);
    }
  };
  
  if (loading) {
      return (
        <div className="flex h-[50vh] items-center justify-center">
             <div className="animate-pulse flex flex-col items-center">
                <div className="h-10 w-10 bg-gray-100 rounded-full mb-2"></div>
                <div className="h-4 w-32 bg-gray-100 rounded"></div>
             </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* --- HEADER (Serif Typography) --- */}
        <div className="pt-4 pb-2">
           <h1 className="text-3xl font-serif font-medium text-gray-900 tracking-tight">Organization Settings</h1>
           <p className="text-gray-500 mt-1 text-sm">Manage access, billing, and data exports.</p>
        </div>
        
        {/* --- SECTION 1: SUBSCRIPTION & BILLING (The Sales Block) --- */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-white to-orange-50/50 border-b">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[#d97757]" /> Your Plan Status
                </h3>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold text-gray-900 capitalize">
                        {currentTier} Tier
                    </span>
                    <Button 
                        variant="default"
                        className="bg-gray-900 text-white h-9 text-sm px-4 hover:bg-black/90 transition-colors"
                        onClick={() => alert("Redirect to Stripe Checkout")}
                    >
                        {isProOrEnterprise ? 'Manage Billing' : 'Upgrade Now'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
            
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Item Capacity:</span>
                    <span className="font-semibold text-gray-800">
                        {currentTier === 'enterprise' ? 'Unlimited' : `${maxLimit.toLocaleString()} items`}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Current Rate:</span>
                    <span className="font-semibold text-gray-800">
                        {currentTier === 'basic' ? '$15 / month' : currentTier === 'pro' ? '$30 / month' : 'Custom'}
                    </span>
                </div>
                
                {/* Billing/Payment Placeholder */}
                <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" /> Payment Information (Stripe)
                    </h4>
                    <p className="text-xs text-gray-500">
                        Your payment system is not yet configured. This section will link directly to the secure Stripe Customer Portal once enabled.
                    </p>
                </div>
            </div>
        </section>


        {/* --- SECTION 2: ORGANIZATION & ACCESS (The Trust Block) --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2 border-b border-gray-200 pb-2">
                <Building className="h-4 w-4 text-[#d97757]" />
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Pantry Profile & Access</h3>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500 uppercase">Pantry Name</Label>
                        <Input value={details?.name || ''} disabled className="bg-gray-50/50 border-gray-200 h-11 font-medium text-gray-900" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500 uppercase">Location</Label>
                        <Input value={details?.address || 'No address set'} disabled className="bg-gray-50/50 border-gray-200 h-11 text-gray-700" />
                    </div>
                </div>

                {/* Invite Code - Prominent and Copiable */}
                <div className="pt-2 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Team Invite Code</h4>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={copyToClipboard}
                            className="group flex-1 relative flex items-center gap-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-2 transition-all active:scale-[0.98] justify-center"
                        >
                            <code className="text-lg font-mono font-bold tracking-widest text-gray-800 group-hover:text-[#d97757]">
                                {details?.join_code || '....'}
                            </code>
                            {copied 
                                ? <Check className="h-4 w-4 text-green-600 absolute right-4" /> 
                                : <Copy className="h-4 w-4 text-gray-400 absolute right-4" />
                            }
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Use this code to invite staff to your {details?.name || 'pantry'}.</p>
                </div>
            </div>
        </section>
        
        {/* --- SECTION 3: TEAM MEMBERS (ADMIN ONLY) --- */}
        {isAdmin && (
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2 border-b border-gray-200 pb-2">
                <Users className="h-4 w-4 text-[#d97757]" />
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Team Members ({members.length})</h3>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button 
                    onClick={() => setShowMembers(!showMembers)} 
                    className="p-4 w-full text-left flex items-center justify-between hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                    View Roster
                    {showMembers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {/* Member Roster (Accordion Style) */}
                {showMembers && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50 max-h-60 overflow-y-auto">
                        {members.map(member => (
                            <div key={member.user_id} className="p-4 flex items-center justify-between text-sm">
                                <div>
                                    <span className="font-semibold text-gray-900">{member.user.name || 'N/A'}</span>
                                    <p className="text-xs text-gray-400">{member.user.phone || 'No Phone'}</p>
                                </div>
                                <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded ${member.role === 'admin' ? 'bg-orange-100 text-[#d97757]' : 'bg-gray-100 text-gray-600'}`}>
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
        )}

        {/* --- SECTION 4: DATA EXPORT (Feature Gating Psychology) --- */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2 border-b border-gray-200 pb-2">
                <FileSpreadsheet className="h-4 w-4 text-[#d97757]" />
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Data Exports (Pro Feature)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* --- INVENTORY EXPORT --- */}
                <button
                    onClick={() => isProOrEnterprise ? handleExport('inventory') : alert("Upgrade to Pro to export data.")}
                    disabled={!isProOrEnterprise || isExporting}
                    className={`flex flex-col items-start p-6 rounded-2xl shadow-sm transition-all text-left h-full ${
                        isProOrEnterprise 
                            ? 'bg-white border border-gray-200 hover:shadow-md hover:border-[#d97757]/30' 
                            : 'bg-gray-100 border border-gray-100 opacity-60 cursor-not-allowed'
                    }`}
                >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-3 ${isProOrEnterprise ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                        {isProOrEnterprise ? <LayoutGrid className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                    </div>
                    <span className="font-bold text-gray-900">{isProOrEnterprise ? 'Export Inventory' : 'Inventory Export Locked'}</span>
                    <span className="text-xs text-gray-500 mt-1">
                        Snapshot of current stock levels. (Pro Feature)
                    </span>
                </button>

                {/* --- DISTRIBUTION EXPORT --- */}
                <button
                    onClick={() => isProOrEnterprise ? handleExport('distributions') : alert("Upgrade to Pro to export data.")}
                    disabled={!isProOrEnterprise || isExporting}
                    className={`flex flex-col items-start p-6 rounded-2xl shadow-sm transition-all text-left h-full ${
                        isProOrEnterprise 
                            ? 'bg-white border border-gray-200 hover:shadow-md hover:border-[#d97757]/30' 
                            : 'bg-gray-100 border border-gray-100 opacity-60 cursor-not-allowed'
                    }`}
                >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-3 ${isProOrEnterprise ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                        {isProOrEnterprise ? <Download className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                    </div>
                    <span className="font-bold text-gray-900">{isProOrEnterprise ? 'Export Distributions' : 'Distributions Export Locked'}</span>
                    <span className="text-xs text-gray-500 mt-1">
                        Full history of client visits. (Pro Feature)
                    </span>
                </button>
            </div>
        </section>
      </div>
    </div>
  );
}