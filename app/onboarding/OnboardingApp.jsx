'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, ArrowRight, Check, Loader2,
  LogOut, Leaf, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TIER_CONFIG = {
  small: {
    dbValue: 'small',
    tier: 'basic',
    limit: 150,
    maxUsers: 3,
    maxClients: 100
  },
  medium: {
    dbValue: 'medium',
    tier: 'pro',
    limit: 5000,
    maxUsers: 10,
    maxClients: 5000
  },
  enterprise: {
    dbValue: 'large',
    tier: 'enterprise',
    limit: 1000000,
    maxUsers: 999,
    maxClients: 999999
  }
};

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState(null);
  const [plan, setPlan] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [createData, setCreateData] = useState({ name: '', location: '', description: '', generatedCode: '' });
  const [joinData, setJoinData] = useState({ code: '', pantryName: '', address: '', pantryId: '' });
  const [profileData, setProfileData] = useState({ fullName: '', role: 'volunteer', phone: '' });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/'); return; }
      setSession(session);
      setProfileData(prev => ({ ...prev, fullName: session.user?.user_metadata?.full_name || '' }));
      setIsSessionLoading(false);
    };
    fetchSession();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinalizeCreation = async () => {
    if (!session?.user?.id) {
      setErrorMsg('No user session found');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    const selectedConfig = TIER_CONFIG[plan] || TIER_CONFIG['small'];

    try {
      const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      console.log('🚀 Creating pantry with:', {
        name: createData.name,
        address: createData.location,
        join_code: generatedCode,
        subscription_tier: selectedConfig.tier,
        max_items_limit: selectedConfig.limit,
        max_users_limit: selectedConfig.maxUsers,
        max_clients_limit: selectedConfig.maxClients
      });

      // Step 1: Create Pantry
      const { data: pantry, error: pantryError } = await supabase
        .from('food_pantries')
        .insert({
          name: createData.name,
          address: createData.location,
          join_code: generatedCode,
          subscription_tier: selectedConfig.tier,
          max_items_limit: selectedConfig.limit,
          max_users_limit: selectedConfig.maxUsers,
          max_clients_limit: selectedConfig.maxClients,
          plan: selectedConfig.dbValue
        })
        .select('pantry_id')
        .single();

      if (pantryError) {
        console.error('❌ Pantry creation error:', pantryError);
        throw new Error(`Pantry creation failed: ${pantryError.message}`);
      }

      console.log('✅ Pantry created:', pantry);

      // Step 2: Create Membership
      const { error: memberError } = await supabase
        .from('pantry_members')
        .insert({ 
          user_id: session.user.id, 
          pantry_id: pantry.pantry_id, 
          role: 'admin' 
        });

      if (memberError) {
        console.error('❌ Member creation error:', memberError);
        throw new Error(`Member creation failed: ${memberError.message}`);
      }

      console.log('✅ Admin membership created');

      // Step 3: Update Profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: session.user.id,
          name: profileData.fullName || 'Admin',
          current_pantry_id: pantry.pantry_id,
          phone: profileData.phone || null
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('❌ Profile update error:', profileError);
        throw new Error(`Profile update failed: ${profileError.message}`);
      }

      console.log('✅ Profile updated');

      setCreateData(prev => ({ ...prev, generatedCode }));
      setStep(5);
    } catch (err) {
      console.error('💥 Full error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCodeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      console.log('🔍 Searching for join code:', joinData.code);
      
      const { data, error } = await supabase
        .from('food_pantries')
        .select('pantry_id, name, address')
        .eq('join_code', joinData.code.trim().toUpperCase())
        .single();

      if (error) {
        console.error('❌ Join code lookup error:', error);
        throw new Error('Invalid code or pantry not found');
      }

      if (!data) {
        throw new Error('No pantry found with that code');
      }

      console.log('✅ Found pantry:', data);

      setJoinData(prev => ({ 
        ...prev, 
        pantryName: data.name, 
        address: data.address, 
        pantryId: data.pantry_id 
      }));
      nextStep();
    } catch (err) { 
      console.error('💥 Join error:', err); 
      setErrorMsg(err.message || 'Invalid code');
    } finally {
      setIsLoading(false); 
    }
  };

  const handleFinalJoin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      console.log('🤝 Joining pantry:', joinData.pantryId);

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('pantry_members')
        .select('user_id')
        .eq('user_id', session.user.id)
        .eq('pantry_id', joinData.pantryId)
        .single();

      if (existingMember) {
        console.log('ℹ️ Already a member, skipping insert');
      } else {
        const { error: memberError } = await supabase
          .from('pantry_members')
          .insert({
            user_id: session.user.id, 
            pantry_id: joinData.pantryId, 
            role: profileData.role
          });

        if (memberError) {
          console.error('❌ Member insert error:', memberError);
          throw new Error(`Failed to join: ${memberError.message}`);
        }
        console.log('✅ Membership created');
      }

      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: session.user.id, 
          name: profileData.fullName, 
          current_pantry_id: joinData.pantryId, 
          phone: profileData.phone || null
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('❌ Profile upsert error:', profileError);
        throw new Error(`Profile update failed: ${profileError.message}`);
      }

      console.log('✅ Profile updated');
      setStep(5);
    } catch (err) { 
      console.error('💥 Final join error:', err); 
      setErrorMsg(err.message || 'Join failed. Please try again.');
    } finally { 
      setIsLoading(false); 
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-300 h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-gray-900">

      <header className="w-full h-20 px-6 md:px-12 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#d97757] text-white flex items-center justify-center shadow-sm">
            <Leaf className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-serif font-medium tracking-tight text-gray-900 hidden md:block">
            Food Arca
          </span>
        </div>
        <button onClick={handleSignOut} className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2">
          Sign Out <LogOut className="h-4 w-4" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">

        {errorMsg && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm max-w-md w-full">
            <strong>Error:</strong> {errorMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-4xl">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-serif font-medium mb-3">How do you want to start?</h1>
                <p className="text-gray-500 text-lg">Choose your path to get started with Food Arca.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => { setIntent('create'); nextStep(); }}
                  className="group flex flex-col items-start p-8 bg-white rounded-2xl border border-gray-200 hover:border-[#d97757]/50 hover:shadow-xl hover:shadow-[#d97757]/5 transition-all duration-300 text-left"
                >
                  <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center text-[#d97757] mb-6 group-hover:scale-110 transition-transform">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Create Organization</h3>
                  <p className="text-gray-500 leading-relaxed mb-6">I am a director or admin setting up a new food pantry location.</p>
                  <div className="mt-auto flex items-center text-[#d97757] font-bold text-sm">
                    Start Setup <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>

                <button
                  onClick={() => { setIntent('join'); nextStep(); }}
                  className="group flex flex-col items-start p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 text-left"
                >
                  <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Join Existing Team</h3>
                  <p className="text-gray-500 leading-relaxed mb-6">I have an invite code and want to join my team as a volunteer.</p>
                  <div className="mt-auto flex items-center text-blue-600 font-bold text-sm">
                    Join Team <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {intent === 'create' && step === 2 && (
            <WizardStep
              title="Administrator Profile"
              subtitle="Let's get your admin account set up."
              onBack={prevStep}
            >
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label>Full Name <span className="text-red-500">*</span></Label>
                  <Input value={profileData.fullName} onChange={e => setProfileData({ ...profileData, fullName: e.target.value })} required placeholder="e.g. Sarah Smith" className="h-12 text-base" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number (Optional)</Label>
                  <Input value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} placeholder="(555) 123-4567" className="h-12 text-base" />
                </div>
                <Button onClick={nextStep} className="w-full h-12 bg-[#d97757] hover:bg-[#c06245] text-base font-bold mt-4">Continue</Button>
              </div>
            </WizardStep>
          )}

          {intent === 'create' && step === 3 && (
            <WizardStep
              title="Pantry Details"
              subtitle="Tell us about the location you are managing."
              onBack={prevStep}
            >
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label>Organization Name <span className="text-red-500">*</span></Label>
                  <Input value={createData.name} onChange={e => setCreateData({ ...createData, name: e.target.value })} required placeholder="e.g. Downtown Community Fridge" className="h-12 text-base" />
                </div>
                <div className="space-y-1.5">
                  <Label>City & State <span className="text-red-500">*</span></Label>
                  <Input value={createData.location} onChange={e => setCreateData({ ...createData, location: e.target.value })} required placeholder="e.g. Austin, TX" className="h-12 text-base" />
                </div>
                <Button onClick={nextStep} className="w-full h-12 bg-[#d97757] hover:bg-[#c06245] text-base font-bold mt-4">View Plans</Button>
              </div>
            </WizardStep>
          )}

          {intent === 'create' && step === 4 && (
            <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-serif font-medium mb-2">Select your capacity</h1>
                <p className="text-gray-500">Scalable plans for every stage of growth.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <PricingCard
                  title="Pantry Basic"
                  price="$15"
                  description="Essentials for small community fridges."
                  features={['1 Location', 'Up to 150 Items', '2 Staff Members']}
                  selected={plan === 'small'}
                  onClick={() => setPlan('small')}
                />

                <PricingCard
                  title="Pantry Pro"
                  price="$30"
                  description="Power tools for growing food banks."
                  features={['1 Location', '5,000 Items', 'Unlimited Staff', 'CSV Reporting', 'Priority Support']}
                  selected={plan === 'medium'}
                  onClick={() => setPlan('medium')}
                  isPopular
                />

                <PricingCard
                  title="Network"
                  price="Custom"
                  description="For regional multi-site operations."
                  features={['Unlimited Locations', 'Unlimited Items', 'Unified Dashboard', 'Unified Client Management']}
                  selected={plan === 'enterprise'}
                  onClick={() => setPlan('enterprise')}
                />
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="ghost" onClick={prevStep} className="text-gray-500">Back</Button>
                <Button
                  onClick={handleFinalizeCreation}
                  disabled={isLoading}
                  className="h-12 px-8 bg-[#d97757] hover:bg-[#c06245] text-base font-bold shadow-lg shadow-[#d97757]/20"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : `Start with ${plan === 'medium' ? 'Pro' : plan === 'enterprise' ? 'Network' : 'Basic'}`}
                </Button>
              </div>
            </motion.div>
          )}

          {intent === 'join' && step === 2 && (
            <WizardStep title="Enter Invite Code" subtitle="Ask your admin for the 6-digit code." onBack={prevStep}>
              <div className="space-y-5">
                <Input 
                  value={joinData.code} 
                  onChange={e => setJoinData({ ...joinData, code: e.target.value.toUpperCase() })} 
                  maxLength={6} 
                  placeholder="XXXXXX" 
                  className="h-14 text-center text-2xl font-mono tracking-widest uppercase" 
                />
                <Button 
                  onClick={handleJoinCodeSubmit} 
                  disabled={isLoading || joinData.code.length < 6} 
                  className="w-full h-12 bg-[#d97757] hover:bg-[#c06245]"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Find Team'}
                </Button>
              </div>
            </WizardStep>
          )}

          {intent === 'join' && step === 3 && (
            <WizardStep title="Confirm Team" subtitle="Is this the right organization?" onBack={prevStep}>
              <div className="bg-white border border-gray-200 p-6 rounded-xl text-center mb-6">
                <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-900">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{joinData.pantryName}</h3>
                <p className="text-sm text-gray-500">{joinData.address}</p>
              </div>
              <Button onClick={nextStep} className="w-full h-12 bg-[#d97757] hover:bg-[#c06245]">Yes, Join This Team</Button>
            </WizardStep>
          )}

          {intent === 'join' && step === 4 && (
            <WizardStep title="Final Details" subtitle="Confirm your profile info." onBack={prevStep}>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input value={profileData.fullName} onChange={e => setProfileData({ ...profileData, fullName: e.target.value })} className="h-12" />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['volunteer', 'staff'].map(r => (
                      <button 
                        key={r} 
                        type="button" 
                        onClick={() => setProfileData({ ...profileData, role: r })} 
                        className={`h-12 rounded-lg border text-sm font-medium capitalize ${profileData.role === r ? 'border-black bg-black text-white' : 'bg-white border-gray-200 text-gray-600'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleFinalJoin} disabled={isLoading} className="w-full h-12 bg-[#d97757] hover:bg-[#c06245]">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Complete Setup'}
                </Button>
              </div>
            </WizardStep>
          )}

          {step === 5 && (
            <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md w-full">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <Check className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-serif font-medium mb-2">You're all set!</h1>
              <p className="text-gray-500 mb-8">Welcome to <span className="font-bold text-gray-900">{createData.name || joinData.pantryName}</span>.</p>
              {createData.generatedCode && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Your Join Code</p>
                  <p className="text-2xl font-mono font-bold text-gray-900">{createData.generatedCode}</p>
                </div>
              )}
              <Button onClick={() => router.push('/dashboard')} className="w-full h-14 bg-gray-900 text-white text-lg shadow-xl hover:bg-black">Enter Dashboard</Button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

function WizardStep({ title, subtitle, children, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-md"
    >
      <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-medium text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500">{subtitle}</p>
      </div>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        {children}
      </div>
    </motion.div>
  );
}

function PricingCard({ title, price, description, features, selected, onClick, isPopular }) {
  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col
            ${selected
          ? 'border-2 border-[#d97757] bg-white shadow-xl shadow-[#d97757]/10 scale-105 z-10'
          : 'border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 opacity-80 hover:opacity-100'
        }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d97757] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
          Most Popular
        </div>
      )}
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <div className="mt-2 mb-1">
        <span className="text-3xl font-serif font-medium text-gray-900">{price}</span>
        {price !== 'Custom' && <span className="text-gray-500 text-sm">/mo</span>}
      </div>
      <p className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">{description}</p>
      <ul className="space-y-3 mb-6 flex-1">
        {features.map((f, i) => (
          <li key={i} className="text-sm flex items-start gap-2 text-gray-700">
            <Check className={`h-4 w-4 mt-0.5 ${selected ? 'text-[#d97757]' : 'text-gray-400'}`} />
            {f}
          </li>
        ))}
      </ul>
      <div className={`w-6 h-6 rounded-full border-2 ml-auto flex items-center justify-center ${selected ? 'border-[#d97757] bg-[#d97757]' : 'border-gray-300'}`}>
        {selected && <Check className="h-3 w-3 text-white" />}
      </div>
    </div>
  );
}