'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";

// --- ICONS ---
const IconBuilding = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>;
const IconUsers = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconCheck = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12" /></svg>;
const IconLoader = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>;
const IconArrowLeft = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>;
const IconArrowRight = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const IconSeed = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 22 12 2" /><path d="M7 20.7a1 1 0 1 1 5-1.45l-4.2-8.4" /><path d="M12 2 22 22" /></svg>;
const IconTree = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1.1-5.8V10a3 3 0 0 1 6 0Z" /><path d="M7 16v6" /><path d="M13 19v3" /><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .9-1.7l-1-1.5a1 1 0 0 0-1.7 0l-2.5 3.8Z" /></svg>;
const IconFactory = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M17 18h1" /><path d="M12 18h1" /><path d="M7 18h1" /></svg>;
const IconUserCircle = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" /></svg>;
const IconMapPin = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
const IconCopy = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>;

// --- UI COMPONENTS ---

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercentage = ((currentStep) / totalSteps) * 100;

  return (
    <div className="w-full max-w-xs mx-auto mb-8">
      <div className="flex justify-center mb-3">
        <span className="text-xs font-medium text-gray-500 tracking-wide font-sans">Step {currentStep} / {totalSteps}</span>
      </div>
      <div className="relative h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-black transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

const NotionCard = ({ icon: Icon, imageSrc, title, description, isSelected, onClick, price }) => (
  <div
    onClick={onClick}
    className={`
      relative flex flex-col items-center text-center p-5 rounded-xl border cursor-pointer transition-all duration-200 h-full bg-white group
      ${isSelected
        ? 'border-black shadow-sm ring-1 ring-black/5'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
      }
    `}
  >
    <div className={`
      absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center transition-colors z-10
      ${isSelected
        ? 'bg-black border-black'
        : 'bg-white border-gray-200'
      }
    `}>
      {isSelected && <IconCheck className="w-3 h-3 text-white" />}
    </div>

    <div className="mb-4 mt-2 h-24 w-full flex items-center justify-center">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={title}
          className={`h-full w-auto object-contain transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}

      <div
        className="hidden w-full h-full items-center justify-center"
        style={{ display: imageSrc ? 'none' : 'flex' }}
      >
        <Icon className={`w-10 h-10 ${isSelected ? 'text-black' : 'text-gray-400'}`} strokeWidth={1.5} />
      </div>
    </div>

    <h3 className="text-sm font-semibold text-black mb-1.5 tracking-tight">{title}</h3>
    <p className="text-xs text-gray-500 leading-relaxed px-2">
      {description}
    </p>

    {price && (
      <div className="mt-auto pt-4 w-full border-t border-gray-50">
        <span className="text-sm font-bold text-gray-900">{price}</span>
        <span className="text-xs text-gray-400 ml-1">/mo</span>
      </div>
    )}
  </div>
);

const Input = ({ className = '', label, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1 tracking-wider font-sans">{label}</label>}
    <input
      className={`
        flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 
        focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 
        disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 font-sans
        ${className}
      `}
      {...props}
    />
  </div>
);

const SelectBox = ({ label, options, value, onChange }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1 tracking-wider font-sans">{label}</label>
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`
                        h-11 rounded-lg border text-sm font-medium transition-all
                        ${value === opt.value
              ? 'border-black bg-black text-white'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }
                    `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const Button = ({ children, className = '', isLoading, ...props }) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-xl text-base font-bold tracking-wide transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 
        disabled:opacity-50 disabled:pointer-events-none 
        bg-black text-white hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] 
        h-14 px-10 w-full shadow-xl shadow-black/10 font-sans
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <IconLoader className="mr-2 h-5 w-5 animate-spin" />}
      {children}
    </button>
  );
};

const BackButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-2 group font-sans"
  >
    <IconArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
    Back
  </button>
);

// --- MAIN WIZARD LOGIC ---

export default function OnboardingWizard() {
  const router = useRouter();

  // State
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState(null); // 'create' | 'join'
  const [plan, setPlan] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  
  // NEW: Session Loading State
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // Session State
  const [session, setSession] = useState(null);

  // Data States
  const [createData, setCreateData] = useState({ name: '', location: '', description: '', generatedCode: '' });
  const [joinData, setJoinData] = useState({ code: '', pantryName: '', address: '', pantryId: '' });
  const [profileData, setProfileData] = useState({ fullName: '', role: 'volunteer', phone: '' });
  const [joinCode, setJoinCode] = useState('');

  // Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/'); // Kick out if not logged in
        return;
      }
      setSession(session);
      setIsSessionLoading(false);
    };
    fetchSession();
  }, [supabase, router]);

  // Navigation
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Handlers
  const handlePersonalSubmit = (e) => { e.preventDefault(); nextStep(); };
  const handleDetailsSubmit = (e) => { e.preventDefault(); nextStep(); };

  // CREATE FLOW: Finalize Creation
  const handleFinalizeCreation = async () => {
    if (!session?.user?.id) {
      alert("Error: No user session found. Please log in again.");
      return;
    }

    setIsLoading(true);

    try {
      const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // 1. Insert Pantry
      const { data: pantryData, error: pantryError } = await supabase
        .from('food_pantries')
        .insert([{
          name: createData.name,
          address: createData.location,
          description: createData.description,
          plan: plan,
          join_code: generatedCode
        }])
        .select()
        .single();

      if (pantryError) throw pantryError;

      // 2. Insert Admin Profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: session.user.id, // Use REAL ID
          name: profileData.fullName || 'Admin',
          role: 'admin',
          pantry_id: pantryData.pantry_id,
          phone: profileData.phone
        }]);

      if (profileError) throw profileError;

      setCreateData(prev => ({ ...prev, generatedCode }));
      setStep(5); // Go to Success
    } catch (err) {
      console.error(err);
      alert("Failed to create pantry: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // JOIN FLOW: Verify Code
  const handleJoinCodeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('food_pantries')
        .select('pantry_id, name, address') // Ensure we fetch ID
        .eq('join_code', joinData.code)
        .single();

      if (error || !data) {
        alert('Invalid code. Please try again.');
        setIsLoading(false);
        return;
      }

      setJoinData(prev => ({
        ...prev,
        pantryName: data.name,
        address: data.address,
        pantryId: data.pantry_id // Map snake_case to camelCase
      }));
      nextStep();
    } catch (err) {
      console.error(err);
      alert('Error verifying code.');
    } finally {
      setIsLoading(false);
    }
  };

  // JOIN FLOW: Finalize Join
  const handleFinalJoin = async (e) => {
    e.preventDefault();
    
    // 1. Session Check
    if (!session?.user?.id) {
        alert("Error: No user session found. Please log in again.");
        return;
    }

    // 2. Pantry ID Safety Check
    if (!joinData.pantryId) {
        alert("Error: Pantry ID is missing. Please go back and enter the code again.");
        return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: session.user.id, // Use REAL ID
          name: profileData.fullName,
          role: profileData.role,
          pantry_id: joinData.pantryId, // Use validated ID
          phone: profileData.phone
        }]);

      if (error) throw error;
      setStep(5); // Success
    } catch (err) {
      console.error(err);
      alert("Failed to join pantry: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER STEPS ---

  // 1. INTENT
  const renderStep1_Intent = () => (
    <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Welcome.</h1>
        <p className="text-sm text-gray-500">Select one of the following to get started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <NotionCard
          imageSrc="/images/pantry_building.svg"
          icon={IconBuilding}
          title="Create Workspace"
          description="I'm an admin setting up a new pantry."
          isSelected={intent === 'create'}
          onClick={() => setIntent('create')}
        />
        <NotionCard
          imageSrc="/images/team_join.svg"
          icon={IconUsers}
          title="Join Team"
          description="I have an invite code to join a team."
          isSelected={intent === 'join'}
          onClick={() => setIntent('join')}
        />
      </div>

      <div className="max-w-xs mx-auto">
        <Button disabled={!intent} onClick={nextStep}>Continue</Button>
      </div>
    </div>
  );

  // CREATE: Step 2 (Personal)
  const renderCreateStep2_Personal = () => (
    <div className="max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Profile</h1>
        <p className="text-sm text-gray-500">First things first. Who are you?</p>
      </div>
      <form onSubmit={handlePersonalSubmit} className="space-y-5">
        <Input label="Full Name" placeholder="Jane Doe" autoFocus required
          value={profileData.fullName}
          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
        />
        <Input label="Phone (Optional)" placeholder="(555) 000-0000"
          value={profileData.phone}
          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
        />
        <div className="pt-2 flex flex-col gap-3">
          <Button type="submit">Next Step</Button>
          <div className="flex justify-center"><BackButton onClick={prevStep} /></div>
        </div>
      </form>
    </div>
  );

  // CREATE: Step 3 (Pantry Details)
  const renderCreateStep3_Details = () => (
    <div className="max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">The Pantry</h1>
        <p className="text-sm text-gray-500">Tell us about the organization.</p>
      </div>
      <form onSubmit={handleDetailsSubmit} className="space-y-5">
        <Input
          label="Organization Name" placeholder="e.g. North Hills Food Bank"
          value={createData.name} onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
          autoFocus required
        />
        <Input
          label="Primary Location" placeholder="City, State"
          value={createData.location} onChange={(e) => setCreateData({ ...createData, location: e.target.value })}
          required
        />
        <div className="pt-2 flex flex-col gap-3">
          <Button type="submit">Select Plan</Button>
          <div className="flex justify-center"><BackButton onClick={prevStep} /></div>
        </div>
      </form>
    </div>
  );

  // CREATE: Step 4 (Pricing -> Calls Finalize)
  const renderCreateStep4_Pricing = () => (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Capacity</h1>
        <p className="text-sm text-gray-500">Choose a plan that fits your scale.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <NotionCard
          icon={IconSeed} imageSrc="/images/pricing_small.svg" title="Small" price="$10"
          description="For small teams collaborating on ideas."
          isSelected={plan === 'small'} onClick={() => setPlan('small')}
        />
        <NotionCard
          icon={IconTree} imageSrc="/images/pricing_medium.svg" title="Medium" price="$18"
          description="Maximum conversion tools for growing pantries."
          isSelected={plan === 'medium'} onClick={() => setPlan('medium')}
        />
        <NotionCard
          icon={IconFactory} imageSrc="/images/pricing_large.svg" title="Large" price="$45"
          description="Infrastructure risk coverage & security."
          isSelected={plan === 'large'} onClick={() => setPlan('large')}
        />
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="w-full max-w-xs">
          <Button onClick={handleFinalizeCreation} isLoading={isLoading}>
            Continue
          </Button>
        </div>
        <BackButton onClick={prevStep} />
      </div>
    </div>
  );

  // JOIN: Step 2 (Code)
  const renderJoinStep2_Code = () => (
    <div className="max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Enter Code</h1>
        <p className="text-sm text-gray-500">Enter the 6-digit code from your admin.</p>
      </div>
      <form onSubmit={handleJoinCodeSubmit} className="space-y-6">
        <Input
          label="Invite Code" placeholder="XXX-XXX"
          value={joinData.code} onChange={(e) => setJoinData({ ...joinData, code: e.target.value.toUpperCase() })}
          autoFocus maxLength={6} className="text-center text-lg tracking-widest font-mono font-medium uppercase"
        />
        <div className="pt-2 flex flex-col gap-3">
          <Button type="submit" isLoading={isLoading}>Find Pantry</Button>
          <div className="flex justify-center"><BackButton onClick={prevStep} /></div>
        </div>
      </form>
    </div>
  );

  // JOIN: Step 3 (Confirm)
  const renderJoinStep3_Confirm = () => (
    <div className="max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Confirm Team</h1>
        <p className="text-sm text-gray-500">Is this the organization you want to join?</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconBuilding className="w-8 h-8 text-gray-900" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{joinData.pantryName}</h3>
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
          <IconMapPin className="w-3 h-3" />
          {joinData.address}
        </div>
      </div>
      <div className="pt-2 flex flex-col gap-3">
        <Button onClick={nextStep}>Yes, Join Team</Button>
        <div className="flex justify-center"><BackButton onClick={prevStep} /></div>
      </div>
    </div>
  );

  // JOIN: Step 4 (Profile)
  const renderJoinStep4_Profile = () => (
    <div className="max-w-sm w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Your Profile</h1>
        <p className="text-sm text-gray-500">Set up your account details.</p>
      </div>
      <form onSubmit={handleFinalJoin} className="space-y-5">
        <Input label="Full Name" placeholder="Jane Doe" value={profileData.fullName} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} autoFocus required />
        <SelectBox label="Role" options={[{ label: 'Volunteer', value: 'volunteer' }, { label: 'Staff', value: 'staff' }]} value={profileData.role} onChange={(val) => setProfileData({ ...profileData, role: val })} />
        <Input label="Phone (Optional)" placeholder="(555) 000-0000" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
        <div className="pt-2 flex flex-col gap-3">
          <Button type="submit" isLoading={isLoading}>Complete Registration</Button>
          <div className="flex justify-center"><BackButton onClick={prevStep} /></div>
        </div>
      </form>
    </div>
  );

  // SUCCESS SCREEN (Shared)
  const renderSuccess = () => (
    <div className="max-w-md w-full h-full flex flex-col justify-center items-center text-center animate-in zoom-in-95 duration-500">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200">
        <IconCheck className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">You're ready.</h1>
      <p className="text-sm text-gray-500 mb-8">
        {intent === 'create'
          ? <>You have successfully created <span className="font-semibold text-gray-900">{createData.name || "Your Pantry"}</span>.</>
          : <>You have successfully joined <span className="font-semibold text-gray-900">{joinData.pantryName}</span>.</>
        }
      </p>

      {/* Only show Invite Code if User CREATED the pantry */}
      {intent === 'create' && createData.generatedCode && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10 w-full text-center shadow-inner">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Invite Code</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-mono font-bold text-black tracking-widest">{createData.generatedCode}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(createData.generatedCode); alert("Copied!") }}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="Copy Code"
            >
              <IconCopy className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Share this with your team to let them join.</p>
        </div>
      )}

      <div className="w-full">
        <Button onClick={() => router.push('/dashboard')}>
          Enter Dashboard
        </Button>
      </div>
    </div>
  );

  // --- LAYOUT ---

  if (isSessionLoading) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
            <p className="text-gray-500 animate-pulse">Verifying session...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col font-sans bg-white selection:bg-gray-900 selection:text-white overflow-y-auto">
      {/* Inject Inter Font */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
      `}} />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Progress Bar (Hidden on Success) */}
        {step < 5 && (
          <div className="w-full flex justify-center animate-in fade-in slide-in-from-top-2 duration-500">
            <ProgressBar currentStep={step} totalSteps={4} />
          </div>
        )}

        {/* Step Router */}
        {step === 1 && renderStep1_Intent()}

        {/* Create Path */}
        {intent === 'create' && step === 2 && renderCreateStep2_Personal()}
        {intent === 'create' && step === 3 && renderCreateStep3_Details()}
        {intent === 'create' && step === 4 && renderCreateStep4_Pricing()}

        {/* Join Path */}
        {intent === 'join' && step === 2 && renderJoinStep2_Code()}
        {intent === 'join' && step === 3 && renderJoinStep3_Confirm()}
        {intent === 'join' && step === 4 && renderJoinStep4_Profile()}

        {/* Shared Success */}
        {step === 5 && renderSuccess()}
      </div>
    </div>
  );
}