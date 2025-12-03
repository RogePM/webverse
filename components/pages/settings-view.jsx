'use client';

import React, { useState, useEffect } from 'react';
import { 
  Copy, Building, Users, Shield, Download, 
  FileSpreadsheet, Check, ArrowRight, LayoutGrid,
  CreditCard, Lock, DollarSign, User, Zap, ChevronDown, ChevronUp,
  Settings2, Star, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createBrowserClient } from '@supabase/ssr';
import { usePantry } from '@/components/providers/PantryProvider';

export function SettingsView() {
  const { pantryId, userRole, pantryDetails, refreshPantry } = usePantry();
  
  // Use Context Details as default, only fetch if context is null
  const [details, setDetails] = useState(pantryDetails);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]); 

  // --- NEW STATE FOR TRACKING ---
  const [clientTrackingEnabled, setClientTrackingEnabled] = useState(true);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // --- DERIVED STATE & LOGIC ---
  const isAdmin = userRole === 'admin';
  const currentTier = details?.subscription_tier || 'basic';
  const isProOrEnterprise = currentTier !== 'basic';
  const maxLimit = details?.max_items_limit || 150;

  // --- 1. FETCH PANTRY DETAILS ---
  useEffect(() => {
    const fetchSettings = async () => {
      if (pantryDetails) {
        setDetails(pantryDetails);
        setClientTrackingEnabled(pantryDetails.settings?.enable_client_tracking ?? true);
        setLoading(false);
        return;
      }
      if (!pantryId) return;
      
      const { data, error } = await supabase
        .from('food_pantries')
        .select('*')
        .eq('pantry_id', pantryId)
        .single();

      if (!error && data) {
        setDetails(data);
        setClientTrackingEnabled(data.settings?.enable_client_tracking ?? true);
      }
      setLoading(false);
    };
    fetchSettings();
  }, [pantryId, pantryDetails, supabase]);
  
  // --- 2. FETCH MEMBER LIST ---
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


  // --- 3. TOGGLE TRACKING HANDLER ---
  const handleToggleTracking = async (newValue) => {
    if (!isAdmin) return;
    
    setClientTrackingEnabled(newValue);
    setIsUpdatingSettings(true);

    try {
        const currentSettings = details?.settings || {};
        const updatedSettings = { ...currentSettings, enable_client_tracking: newValue };

        const { error } = await supabase
            .from('food_pantries')
            .update({ settings: updatedSettings })
            .eq('pantry_id', pantryId);

        if (error) throw error;
       // 1. Update local settings state so the UI stays snappy
        setDetails(prev => ({ ...prev, settings: updatedSettings }));
        
        // 2. Force the Global Provider to re-fetch the new settings
        // This ensures DistributionCart sees the change immediately
        await refreshPantry();

    } catch (error) {
        console.error("Failed to update settings:", error);
        setClientTrackingEnabled(!newValue);
        alert("Failed to save setting.");
    } finally {
        setIsUpdatingSettings(false);
    }
  };


  // --- 4. EXPORT LOGIC ---
  const copyToClipboard = () => {
    if (details?.join_code) {
      navigator.clipboard.writeText(details.join_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = async (type) => {
    if (!pantryId || !isProOrEnterprise) return; 
    setIsExporting(true);
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

  // Helper for Section Headers
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-3 pb-1 border-b border-gray-100">
        <Icon className="h-4 w-4 text-[#d97757]" />
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-10">
        
        {/* --- PAGE HEADER --- */}
        <div className="pt-4">
           <h1 className="text-3xl font-serif font-medium text-gray-900 tracking-tight">Organization Settings</h1>
           <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-lg">
             Manage your pantry profile, configure workflows, and export data for reporting.
           </p>
        </div>
        
        {/* --- 1. SUBSCRIPTION CARD --- */}
        <section>
             <SectionHeader icon={CreditCard} title="Plan & Billing" />
             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white via-white to-gray-50/50">
                    <div className="flex gap-5 items-start">
                        <div className={`shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm ${isProOrEnterprise ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <Star className="h-7 w-7 fill-current" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl font-bold text-gray-900 capitalize tracking-tight">{currentTier} Plan</span>
                                {isProOrEnterprise && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">Active</span>}
                            </div>
                            <p className="text-sm text-gray-500">
                                {isProOrEnterprise ? 'Your organization has full access to all features.' : 'You are currently on the basic tier.'}
                            </p>
                        </div>
                    </div>
                    
                    <Button 
                        size="sm"
                        className={`${isProOrEnterprise ? 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50' : 'bg-gray-900 text-white hover:bg-black'} transition-all`}
                        onClick={() => alert("Redirect to Stripe Checkout")}
                    >
                        {isProOrEnterprise ? 'Manage Billing' : 'Upgrade to Pro'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 border-t border-gray-100 divide-x divide-gray-100">
                    <div className="p-4 text-center">
                        <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Item Limit</span>
                        <span className="block text-lg font-bold text-gray-900">{currentTier === 'enterprise' ? 'Unlimited' : maxLimit.toLocaleString()}</span>
                    </div>
                    <div className="p-4 text-center">
                        <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Monthly Cost</span>
                        <span className="block text-lg font-bold text-gray-900">{currentTier === 'basic' ? '$15' : currentTier === 'pro' ? '$30' : 'Custom'}</span>
                    </div>
                </div>
             </div>
        </section>

        {/* --- 2. WORKFLOW CONFIGURATION (High-Polish) --- */}
        <section>
            <SectionHeader icon={Settings2} title="Workflow Configuration" />
            <div className={`
                relative overflow-hidden rounded-2xl border transition-all duration-300
                ${clientTrackingEnabled 
                    ? 'bg-white border-gray-200 shadow-sm hover:shadow-md' 
                    : 'bg-gradient-to-br from-blue-50/50 to-white border-blue-200 shadow-md'
                }
            `}>
                <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                        
                        <div className="flex gap-5">
                            <div className={`
                                shrink-0 h-12 w-12 rounded-xl flex items-center justify-center transition-colors shadow-sm
                                ${clientTrackingEnabled 
                                    ? 'bg-gray-100 text-gray-600' 
                                    : 'bg-blue-600 text-white'
                                }
                            `}>
                                {clientTrackingEnabled ? <Users className="h-6 w-6" /> : <Zap className="h-6 w-6 fill-current" />}
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <Label className="text-base font-semibold text-gray-900">
                                        Client Database & Tracking
                                    </Label>
                                    {!clientTrackingEnabled && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">
                                            Speed Mode
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 max-w-md leading-relaxed">
                                    {clientTrackingEnabled 
                                        ? "The system will require a Client Name and allow ID logging for every distribution. Best for reporting and case management."
                                        : "Optimized for speed. Distributions are anonymous and inventory-focused. No client names required."
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <Switch
                                checked={clientTrackingEnabled}
                                onCheckedChange={handleToggleTracking}
                                disabled={!isAdmin || isUpdatingSettings}
                                className="data-[state=checked]:bg-[#d97757]"
                            />
                        </div>
                    </div>
                </div>

                {!clientTrackingEnabled && (
                    <div className="bg-blue-50/50 border-t border-blue-100 p-3 px-8 flex items-center gap-2 text-xs text-blue-700 font-medium">
                        <Zap className="h-3.5 w-3.5 fill-blue-700" />
                        Currently running in high-volume inventory mode.
                    </div>
                )}
                
                {!isAdmin && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                         <div className="bg-white border border-gray-200 shadow-lg px-4 py-2 rounded-full text-xs font-semibold text-gray-500 flex items-center gap-2">
                            <Lock className="h-3 w-3" /> Admin Access Required
                         </div>
                    </div>
                )}
            </div>
        </section>

        {/* --- 3. PANTRY PROFILE --- */}
        <section>
            <SectionHeader icon={Building} title="Organization Profile" />
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-gray-500 uppercase">Pantry Name</Label>
                        <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input value={details?.name || ''} disabled className="pl-9 bg-gray-50 border-gray-200 h-10 font-medium text-gray-900" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-gray-500 uppercase">Location</Label>
                        <Input value={details?.address || 'No address set'} disabled className="bg-gray-50 border-gray-200 h-10 text-gray-700" />
                    </div>
                </div>

                {/* Invite Code Card */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">Invite Team Members</h4>
                            <p className="text-xs text-gray-500">Share this code to grant access.</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={copyToClipboard}
                        className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-white border border-dashed border-gray-300 hover:border-[#d97757] rounded-lg px-6 py-2.5 transition-all active:scale-[0.98]"
                    >
                        <code className="text-base font-mono font-bold tracking-widest text-gray-800 group-hover:text-[#d97757]">
                            {details?.join_code || '....'}
                        </code>
                        {copied 
                            ? <Check className="h-4 w-4 text-green-600 animate-in zoom-in" /> 
                            : <Copy className="h-4 w-4 text-gray-400 group-hover:text-[#d97757]" />
                        }
                    </button>
                </div>
            </div>
        </section>

        {/* --- 4. TEAM MEMBERS (Admin Only) --- */}
        {isAdmin && (
        <section>
            <SectionHeader icon={Users} title={`Team Members (${members.length})`} />
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <button 
                    onClick={() => setShowMembers(!showMembers)} 
                    className="p-5 w-full flex items-center justify-between hover:bg-gray-50 transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                            <Users className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Manage Roster</span>
                    </div>
                    {showMembers ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </button>
                
                {showMembers && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50 max-h-80 overflow-y-auto">
                        {members.map(member => (
                            <div key={member.user_id} className="p-4 px-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-[#d97757]/10 text-[#d97757] flex items-center justify-center text-xs font-bold">
                                        {member.user.name ? member.user.name.charAt(0) : 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{member.user.name || 'Unknown User'}</p>
                                        <p className="text-xs text-gray-400">{member.user.phone || 'No Contact Info'}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${member.role === 'admin' ? 'bg-orange-50 text-[#d97757]' : 'bg-gray-100 text-gray-600'}`}>
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
        )}

        {/* --- 5. DATA EXPORTS --- */}
        <section>
            <SectionHeader icon={FileSpreadsheet} title="Data Management" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Inventory Export Card */}
                <button
                    onClick={() => isProOrEnterprise ? handleExport('inventory') : alert("Upgrade to Pro to export data.")}
                    disabled={!isProOrEnterprise || isExporting}
                    className={`
                        relative group flex flex-col items-start p-6 rounded-2xl border transition-all duration-200 text-left h-full
                        ${isProOrEnterprise 
                            ? 'bg-white border-gray-200 hover:border-[#d97757]/50 hover:shadow-md cursor-pointer' 
                            : 'bg-gray-50 border-gray-100 opacity-70 cursor-not-allowed'
                        }
                    `}
                >
                    <div className="flex w-full items-start justify-between mb-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isProOrEnterprise ? 'bg-blue-50 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
                            {isProOrEnterprise ? <LayoutGrid className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                        </div>
                        {isProOrEnterprise && <Download className="h-4 w-4 text-gray-300 group-hover:text-[#d97757] transition-colors" />}
                    </div>
                    
                    <span className="text-base font-bold text-gray-900 mb-1 block">Export Inventory</span>
                    <span className="text-sm text-gray-500 leading-snug">
                        Download a CSV snapshot of current stock levels and batch details.
                    </span>
                </button>

                {/* Distributions Export Card */}
                <button
                    onClick={() => isProOrEnterprise ? handleExport('distributions') : alert("Upgrade to Pro to export data.")}
                    disabled={!isProOrEnterprise || isExporting}
                    className={`
                        relative group flex flex-col items-start p-6 rounded-2xl border transition-all duration-200 text-left h-full
                        ${isProOrEnterprise 
                            ? 'bg-white border-gray-200 hover:border-green-500/50 hover:shadow-md cursor-pointer' 
                            : 'bg-gray-50 border-gray-100 opacity-70 cursor-not-allowed'
                        }
                    `}
                >
                    <div className="flex w-full items-start justify-between mb-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isProOrEnterprise ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                            {isProOrEnterprise ? <FileSpreadsheet className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                        </div>
                        {isProOrEnterprise && <Download className="h-4 w-4 text-gray-300 group-hover:text-green-600 transition-colors" />}
                    </div>
                    
                    <span className="text-base font-bold text-gray-900 mb-1 block">Export History</span>
                    <span className="text-sm text-gray-500 leading-snug">
                        Full history of client visits, timestamps, and distributed items.
                    </span>
                </button>
            </div>
        </section>

      </div>
    </div>
  );
}