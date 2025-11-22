'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Building, Users, Shield, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createBrowserClient } from '@supabase/ssr';
import { usePantry } from '@/components/providers/PantryProvider';

export function SettingsView() {
  const { pantryId, userRole } = usePantry();
  const [pantryDetails, setPantryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // New state for export loading
  const [isExporting, setIsExporting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchSettings = async () => {
      if (!pantryId) return;

      // Fetch details from Supabase (Postgres)
      const { data, error } = await supabase
        .from('food_pantries')
        .select('*')
        .eq('pantry_id', pantryId)
        .single();

      if (!error && data) {
        setPantryDetails(data);
      }
      setLoading(false);
    };

    fetchSettings();
  }, [pantryId, supabase]);

  const copyToClipboard = () => {
    if (pantryDetails?.join_code) {
      navigator.clipboard.writeText(pantryDetails.join_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- NEW: CSV Export Logic ---
  const handleExport = async (type) => {
    if (!pantryId) return;
    setIsExporting(true);

    try {
      // 1. Decide which API to call
      const endpoint = type === 'inventory' ? '/api/foods' : '/api/client-distributions';
      
      // 2. Fetch Data (using existing API)
      const response = await fetch(endpoint, {
        headers: { 'x-pantry-id': pantryId }
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const json = await response.json();
      const data = json.data || [];

      if (data.length === 0) {
        alert('No data available to export.');
        return;
      }

      // 3. Convert JSON to CSV
      // Get headers from first object
      const headers = Object.keys(data[0]).join(',');
      // Map rows
      const rows = data.map(row => 
        Object.values(row).map(value => {
            // Handle commas/newlines in data by wrapping in quotes
            const stringValue = String(value ?? '');
            return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',')
      );
      
      const csvContent = [headers, ...rows].join('\n');

      // 4. Trigger Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${pantryDetails?.name || 'pantry'}_${type}_${new Date().toISOString().split('T')[0]}.csv`);
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

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-4 sm:p-6 max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Organization Settings</h2>
        <p className="text-muted-foreground">Manage your food pantry details and team.</p>
      </div>

      {/* 1. General Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" /> General Information
          </CardTitle>
          <CardDescription>Details about your food pantry.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Pantry Name</Label>
            <Input value={pantryDetails?.name || ''} disabled />
          </div>
          <div className="grid gap-2">
            <Label>Address</Label>
            <Input value={pantryDetails?.address || ''} disabled />
          </div>
        </CardContent>
      </Card>

      {/* 2. Team & Invite Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Team Management
          </CardTitle>
          <CardDescription>Invite other volunteers to help manage inventory.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Volunteer Invite Code
            </Label>
            <div className="flex items-center gap-2 mt-2">
                <code className="flex-1 bg-background border rounded-md px-3 py-2 font-mono text-lg tracking-widest text-center select-all">
                    {pantryDetails?.join_code || 'ERROR'}
                </code>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
                {copied ? <span className="text-green-600 font-medium">Copied to clipboard!</span> : "Share this code with volunteers during sign-up."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Data Export Card (NEW) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" /> Data Export
          </CardTitle>
          <CardDescription>Download your data for reporting or backup.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
           <Button 
             variant="outline" 
             className="h-auto py-4 flex flex-col gap-2 items-start"
             onClick={() => handleExport('inventory')}
             disabled={isExporting}
           >
             <div className="flex items-center gap-2 font-semibold">
               <Download className="h-4 w-4" /> Export Inventory
             </div>
             <span className="text-xs text-muted-foreground">Current stock levels and details.</span>
           </Button>

           <Button 
             variant="outline" 
             className="h-auto py-4 flex flex-col gap-2 items-start"
             onClick={() => handleExport('distributions')}
             disabled={isExporting}
           >
             <div className="flex items-center gap-2 font-semibold">
               <Download className="h-4 w-4" /> Export Distributions
             </div>
             <span className="text-xs text-muted-foreground">History of client visits and items given.</span>
           </Button>
        </CardContent>
      </Card>

      {/* 4. User Role Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> Your Role
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">You are currently logged in as:</span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 capitalize">
                    {userRole}
                </span>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}