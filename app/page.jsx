'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { 
  Menu, X, Check, ArrowRight, Box, ShieldCheck, Zap, Leaf, Layout,
  Users, CreditCard, Timer, ScanBarcode, RefreshCw, Smartphone,
  HelpCircle, Play, Twitter, Linkedin, Instagram, Github
} from 'lucide-react';

// --- Animation Imports ---
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// --- Icon Components ---
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.65-3.657-11.303-8.354l-6.571,4.819C9.656,39.663,16.318,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.23-2.22,4.143-4.162,5.571l6.19,5.238C42.012,35.319,44,30.02,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(0);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  
  const mainRef = useRef(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    checkUser();
  }, [supabase, router]);

  // --- SAFE ANIMATION SETUP ---
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Register Plugin
    gsap.registerPlugin(ScrollTrigger);

    // 1. Setup Lenis (Smooth Scroll)
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false, // Disable on mobile to prevent bugs
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Setup GSAP with a slight delay to ensure DOM is ready
    let ctx;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        
        // Hero Animations
        const heroTl = gsap.timeline();
        heroTl.from('.hero-content > *', {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all' // SAFETY: Clears styles after animation
        })
        .from('.hero-image', {
          scale: 0.98,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          clearProps: 'all'
        }, "-=0.6");

        // Platform Header
        gsap.from('.feature-title', {
          scrollTrigger: { 
            trigger: '#platform', 
            start: 'top bottom' // Triggers as soon as it enters viewport
          },
          y: 30, opacity: 0, duration: 0.8
        });
        
        // Feature List (The part that was missing)
        // We use batch here which is safer for lists
        ScrollTrigger.batch(".feature-list-item", {
          onEnter: batch => gsap.to(batch, {opacity: 1, x: 0, stagger: 0.1, overwrite: true}),
          start: "top bottom",
        });

        // Initial set for batch (sets starting state)
        gsap.set(".feature-list-item", {opacity: 0, x: 30});

        // Video Placeholder
        gsap.from('.feature-video', {
          scrollTrigger: { 
            trigger: '.feature-video', 
            start: 'top bottom' 
          },
          scale: 0.95, opacity: 0, duration: 0.8
        });

        // Pricing Cards
        ScrollTrigger.batch(".pricing-card", {
          onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.2)'}),
          start: "top 90%",
        });
        
        // Initial set for pricing
        gsap.set(".pricing-card", {opacity: 0, y: 40});

        // FAQ
        ScrollTrigger.batch(".faq-item", {
           onEnter: batch => gsap.to(batch, {opacity: 1, y: 0, stagger: 0.1}),
           start: "top 95%"
        });
        
        // Initial set for FAQ
        gsap.set(".faq-item", {opacity: 0, y: 20});

      }, mainRef);

      // Force a refresh to ensure start/end positions are correct
      ScrollTrigger.refresh();

    }, 100); // 100ms delay to let React render fully

    return () => {
      lenis.destroy();
      clearTimeout(timer);
      if (ctx) ctx.revert(); // This cleans up all GSAP styles, making elements visible again
    };
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const toggleFeature = (index) => {
    setActiveFeatureIndex(activeFeatureIndex === index ? null : index);
  };

  const features = [
    { title: "Real-Time Inventory", icon: Layout, description: "Instant updates keep your whole team synced and prevent double-counting." },
    { title: "Smart Expiration Alerts", icon: Timer, description: "See expired and expiring items first so you can reduce waste fast." },
    { title: "Fast Barcode Scanning", icon: ScanBarcode, description: "Scan once—Food Arca remembers the item forever and auto-fills next time." },
    { title: "Client Tracking", icon: Users, description: "Track households and visits, or keep clients anonymous for privacy." },
    { title: "Volunteer Sync", icon: RefreshCw, description: "Changes appear live across all devices so volunteers never work blind." },
    { title: "Works on Any Device", icon: Smartphone, description: "Use it on phones, tablets, or laptops—no apps to install." }
  ];

  const faqs = [
    { question: 'Is the platform secure for client data?', answer: 'Yes. We adhere to strict privacy standards and use bank-level encryption. You can also choose to track clients anonymously if preferred.' },
    { question: 'Can I export my data?', answer: 'Absolutely. We offer one-click exports to CSV and Excel files.' },
    { question: 'Do I need to install an app?', answer: 'No installation required. Food Arca is a web-based platform that works instantly on any phone, tablet, or computer with a browser.' },
    { question: 'Are there limits to inventory items, users, or clients?', answer: 'Yes. Limits scale by plan: Basic has smaller limits, Pro has higher limits, and Enterprise allows unlimited users, items, and clients.' },
  ];
  // --- Smooth Scroll Helper ---
  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu if open

    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(id);
      if (element) {
        // We subtract 80px to account for the fixed navbar height
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div ref={mainRef} className="min-h-screen bg-[#FAFAF9] text-[#1C1917] font-sans selection:bg-[#D97757] selection:text-white overflow-x-hidden">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-[#E7E5E4]">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* LOGO - Scrolls to Top */}
          <a 
            href="#" 
            onClick={(e) => scrollToSection(e, 'top')} 
            className="flex items-center gap-3 group cursor-pointer"
          >
            <Leaf size={24} className="text-[#D97757] transition-transform group-hover:rotate-12" />
            <span className="text-xl font-serif font-medium tracking-tight text-[#1C1917]">Food Arca</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#platform" 
              onClick={(e) => scrollToSection(e, '#platform')}
              className="text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => scrollToSection(e, '#pricing')}
              className="text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => scrollToSection(e, '#how-it-works')}
              className="text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors"
            >
              How it Works
            </a>
            
            {/* CTA Button - Keeps original Sign In function */}
            <button onClick={handleSignIn} className="bg-[#1C1917] text-[#FAFAF9] px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#292524] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Try Food Arca
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-[#1C1917]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Dropdown Menu (Optional: if you want the mobile links to work too) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAFAF9] border-b border-[#E7E5E4] px-6 py-4 flex flex-col space-y-4 shadow-xl">
            <a href="#platform" onClick={(e) => scrollToSection(e, '#platform')} className="text-base font-medium text-[#57534E]">Features</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, '#pricing')} className="text-base font-medium text-[#57534E]">Pricing</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, '#how-it-works')} className="text-base font-medium text-[#57534E]">How it Works</a>
            <button onClick={handleSignIn} className="bg-[#1C1917] text-[#FAFAF9] w-full py-3 rounded-lg text-sm font-medium">
              Try Food Arca
            </button>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <main className="min-h-screen pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 flex flex-col justify-center">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-24 items-center">
            
            {/* Left Column */}
            <div className="hero-content max-w-xl mx-auto w-full">
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif leading-[0.95] tracking-tight mb-6 text-[#1C1917] text-center">
                Inventory? <br />
                <span className="italic opacity-90 text-[#44403C]">Solved.</span>
              </h1>
              
              <p className="text-xl text-[#57534E] mb-12 font-light tracking-wide text-center">
                The modern inventory and client tracking tool for community food banks.
              </p>

              {/* Login Widget */}
              <div className="bg-white border border-[#E7E5E4] p-8 rounded-3xl w-full shadow-2xl shadow-[#D6D3D1]/50">
                <button 
                  onClick={handleSignIn}
                  className="w-full bg-[#F5F5F4] hover:bg-[#E7E5E4] text-[#1C1917] font-medium py-3.5 rounded-xl border border-[#E7E5E4] flex items-center justify-center gap-3 transition-all mb-4"
                >
                   <GoogleIcon />
                   Continue with Google
                </button>

                <div className="flex items-center gap-4 my-4">
                  <div className="h-px bg-[#E7E5E4] flex-1"></div>
                  <span className="text-xs text-[#78716C] font-medium uppercase tracking-wider">OR</span>
                  <div className="h-px bg-[#E7E5E4] flex-1"></div>
                </div>

                <input type="email" placeholder="Enter your email" className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3.5 text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#D97757]/50 mb-4 transition-all"/>

                <button className="w-full bg-[#1C1917] hover:bg-[#292524] text-[#FAFAF9] font-bold py-3.5 rounded-xl transition-all shadow-lg">
                  Continue with email
                </button>

                <p className="text-[10px] text-[#78716C] mt-4 text-center leading-relaxed">
                   By continuing, you acknowledge our Privacy Policy and agree to occasional emails about inventory updates.
                </p>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="hero-image hidden md:block relative w-full h-full min-h-[450px] lg:min-h-[600px] bg-[#D97757] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#D6D3D1]/50 p-4 lg:p-6 group">
               <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-lg z-10">
                 <img 
                   src="/foodPantry.jpg" 
                   alt="Community Volunteers" 
                   className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                 />
               </div>
            </div>

          </div>
        </div>
      </main>

      {/* --- Platform Section --- */}
      <section id="platform" className="min-h-screen py-24 bg-[#F5F5F4] flex flex-col justify-center">
        <div className="container mx-auto px-6">
          <div className="feature-title mb-16 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-6">
              See how simple <br /><span className="text-[#78716C]">food pantry management can be.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: App Demo Box */}
            <div className="feature-video lg:col-span-5 relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-[#D97757]/10 to-purple-500/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               
               <div className="relative bg-white rounded-[2rem] p-2 md:p-4 shadow-2xl shadow-[#D6D3D1]/50 overflow-hidden min-h-[500px] flex flex-col border border-[#E7E5E4]">
                  <div className="w-full h-full flex-1 bg-gray-100 rounded-xl min-h-[460px] flex items-center justify-center">
                     <span className="text-gray-400 font-medium text-sm uppercase tracking-widest">Video Placeholder</span>
                  </div>
               </div>
            </div>

            {/* Right: Feature List */}
            <div className="feature-list lg:col-span-7 flex flex-col justify-center h-full pt-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                 {features.map((feature, index) => (
                   <div 
                     key={index}
                     onClick={() => toggleFeature(index)}
                     className={`feature-list-item group border-b border-[#E7E5E4] pb-6 mb-2 cursor-pointer transition-all duration-300 ${
                       activeFeatureIndex === index ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                     }`}
                   >
                      <h3 className={`text-xl font-serif mb-2 flex items-center gap-2 transition-colors ${
                        activeFeatureIndex === index ? 'text-[#1C1917]' : 'text-[#78716C] group-hover:text-[#1C1917]'
                      }`}>
                          <feature.icon className={`transition-colors duration-300 ${activeFeatureIndex === index ? 'text-[#D97757]' : 'text-[#A8A29E] group-hover:text-[#D97757]'}`} size={20} />
                          {feature.title}
                      </h3>
                      
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFeatureIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-[#57534E] text-sm font-light leading-relaxed pl-7">
                           {feature.description}
                        </p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Pricing Section --- */}
      <section id="pricing" className="min-h-screen py-24 bg-[#FAFAF9] relative overflow-hidden flex flex-col justify-center">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D97757]/5 via-[#FAFAF9] to-[#FAFAF9] pointer-events-none"></div>

         <div className="container mx-auto px-6 relative z-10">
            <div className="mb-16 text-center">
               <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-6">
                  Simple, transparent <br /><span className="text-[#78716C]">pricing for all.</span>
               </h2>
               <p className="text-lg text-[#57534E] max-w-2xl mx-auto font-light">
                  Start for free and scale as you serve more families. No hidden fees.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               
               {/* Card 1: Starter */}
               <div className="pricing-card relative group bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 border border-[#E7E5E4] hover:border-[#D6D3D1] transition-all duration-500 shadow-xl shadow-[#E7E5E4] flex flex-col h-full overflow-hidden">
                  <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-multiply"></div>
                  <div className="mb-6 relative z-10">
                     <span className="bg-[#F5F5F4] text-[#57534E] border border-[#E7E5E4] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Starter</span>
                  </div>
                  <h3 className="text-2xl font-serif font-medium mb-2 text-[#1C1917] relative z-10">Pantry Basic</h3>
                  <p className="text-[#78716C] text-sm mb-8 relative z-10 font-light">Everything a small food bank needs to get started.</p>
                  <div className="mb-8 relative z-10">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-[#A8A29E] line-through">$20</span>
                        <span className="bg-[#D97757]/10 text-[#D97757] border border-[#D97757]/20 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide">SAVE 25%</span>
                     </div>
                     <div className="flex items-baseline">
                        <span className="text-lg font-serif align-top mt-1 text-[#1C1917]">$</span>
                        <span className="text-5xl font-serif font-medium tracking-tight text-[#1C1917]">15</span>
                        <span className="text-[#78716C] font-light text-lg ml-1">/mo</span>
                     </div>
                     <p className="text-xs text-[#A8A29E] mt-3 font-light">Billed monthly. Cancel anytime.</p>
                  </div>
                  <button className="w-full py-3.5 rounded-xl bg-[#F5F5F4] hover:bg-[#E7E5E4] text-[#1C1917] font-medium transition-colors mb-8 relative z-10 border border-[#E7E5E4]">
                     Choose Plan
                  </button>
                  <div className="space-y-4 mt-auto relative z-10">
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> 1 User Account</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Up to 500 Items & Barcodes</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Up to 100 Clients</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Real-Time Inventory</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Fast Barcode Scanning</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Client Tracking</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Volunteer Sync</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Works on Any Device</div>
                      <div className="text-xs text-[#A8A29E] mt-6 pt-6 border-t border-[#F5F5F4] font-light">Regular price $20/mo.</div>
                  </div>
               </div>

               {/* Card 2: Pro (Highlight) */}
               <div className="pricing-card relative group bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 border border-[#D97757]/30 hover:border-[#D97757]/50 transition-all duration-500 shadow-2xl shadow-[#D97757]/5 flex flex-col h-full z-20">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#D97757]/5 to-transparent opacity-50 pointer-events-none rounded-[2rem]"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D97757] text-white px-4 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest shadow-lg shadow-[#D97757]/20 z-30">
                     Most Popular
                  </div>
                  <div className="mb-6 mt-2 relative z-10">
                     <span className="bg-[#D97757]/10 text-[#D97757] border border-[#D97757]/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Business</span>
                  </div>
                  <h3 className="text-2xl font-serif font-medium mb-2 text-[#1C1917] relative z-10">Pantry Pro</h3>
                  <p className="text-[#78716C] text-sm mb-8 relative z-10 font-light">For growing food banks needing more capacity.</p>
                  <div className="mb-8 relative z-10">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-[#A8A29E] line-through">$40</span>
                        <span className="bg-[#D97757]/10 text-[#D97757] border border-[#D97757]/20 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide">SAVE 25%</span>
                     </div>
                     <div className="flex items-baseline">
                        <span className="text-lg font-serif align-top mt-1 text-[#1C1917]">$</span>
                        <span className="text-5xl font-serif font-medium tracking-tight text-[#1C1917]">30</span>
                        <span className="text-[#78716C] font-light text-lg ml-1">/mo</span>
                     </div>
                     <p className="text-xs text-[#A8A29E] mt-3 font-light">Billed monthly. Cancel anytime.</p>
                  </div>
                  <button className="w-full py-3.5 rounded-xl bg-[#D97757] hover:bg-[#C26245] text-white font-medium transition-colors mb-8 shadow-lg shadow-[#D97757]/20 relative z-10">
                     Choose Plan
                  </button>
                  <div className="space-y-4 mt-auto relative z-10">
                      <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Up to 10 Users</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Up to 5,000 Items & Barcodes</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Up to 1,000 Clients</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Real-Time Inventory</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Fast Barcode Scanning</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Client Tracking</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Volunteer Sync</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Works on Any Device</div>
                      <div className="text-xs text-[#A8A29E] mt-6 pt-6 border-t border-[#D97757]/20 font-light">Regular price $40/mo.</div>
                  </div>
               </div>

               {/* Card 3: Network */}
               <div className="pricing-card relative group bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 border border-[#E7E5E4] hover:border-[#D6D3D1] transition-all duration-500 shadow-xl shadow-[#E7E5E4] flex flex-col h-full overflow-hidden">
                  <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-multiply"></div>
                  <div className="mb-6 relative z-10">
                     <span className="bg-[#F5F5F4] text-[#57534E] border border-[#E7E5E4] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Enterprise</span>
                  </div>
                  <h3 className="text-2xl font-serif font-medium mb-2 text-[#1C1917] relative z-10">Enterprise</h3>
                  <p className="text-[#78716C] text-sm mb-8 relative z-10 font-light">For large food bank networks or regional operations.</p>
                  <div className="mb-8 relative z-10">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-[#A8A29E] line-through">$60</span>
                        <span className="bg-[#D97757]/10 text-[#D97757] border border-[#D97757]/20 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide">SAVE 25%</span>
                     </div>
                     <div className="flex items-baseline">
                        <span className="text-lg font-serif align-top mt-1 text-[#1C1917]">$</span>
                        <span className="text-5xl font-serif font-medium tracking-tight text-[#1C1917]">45</span>
                        <span className="text-[#78716C] font-light text-lg ml-1">/mo</span>
                     </div>
                     <p className="text-xs text-[#A8A29E] mt-3 font-light">Billed monthly. Cancel anytime.</p>
                  </div>
                  <button className="w-full py-3.5 rounded-xl bg-[#F5F5F4] hover:bg-[#E7E5E4] text-[#1C1917] font-medium transition-colors mb-8 relative z-10 border border-[#E7E5E4]">
                     Choose Plan
                  </button>
                  <div className="space-y-4 mt-auto relative z-10">
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Unlimited Users</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Unlimited Items & Barcodes</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Unlimited Client Tracking</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Real-Time Inventory</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Fast Barcode Scanning</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Works on Any Device</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> API Access & Dedicated Support</div>
                      <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Priority Support</div>
                      <div className="text-xs text-[#A8A29E] mt-6 pt-6 border-t border-[#F5F5F4] font-light">Regular price $60/mo.</div>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* --- How it works & FAQ Section --- */}
      <section id="how-it-works" className="min-h-screen py-24 bg-[#F5F5F4] border-t border-[#E7E5E4] flex flex-col justify-center">
         <div className="container mx-auto px-6">
             <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917] text-center">
                  How it works
               </h2>
            <div className="max-w-5xl mx-auto mb-32">
               <div className="relative bg-white rounded-[2.5rem] shadow-2xl shadow-[#D6D3D1]/50 overflow-hidden min-h-[500px] flex items-center justify-center border border-[#E7E5E4] group cursor-pointer mb-12 mt-12">
                  <div className="absolute inset-0 bg-gray-100/50"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4">
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <Play className="ml-1 text-[#1C1917]" size={32} fill="currentColor" />
                     </div>
                     <span className="text-[#78716C] font-medium tracking-widest uppercase text-sm">Watch Demo</span>
                  </div>
               </div>
            </div>

            <div className="max-w-3xl mx-auto">
               <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917] text-center mb-16">
                  Frequently asked questions
               </h2>
               <div className="space-y-4">
                  {faqs.map((faq, index) => (
                     <div 
                        key={index}
                        onClick={() => toggleFAQ(index)}
                        className={`faq-item group border-b border-[#E7E5E4] pb-6 cursor-pointer transition-all duration-300 ${
                           openFAQIndex === index ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                        }`}
                     >
                        <h3 className={`text-xl font-medium flex items-center justify-between transition-colors ${
                           openFAQIndex === index ? 'text-[#1C1917]' : 'text-[#57534E] group-hover:text-[#1C1917]'
                        }`}>
                           {faq.question}
                           <HelpCircle size={20} className={`transition-transform duration-300 ${openFAQIndex === index ? 'rotate-180 text-[#D97757]' : 'text-[#A8A29E]'}`} />
                        </h3>
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFAQIndex === index ? 'max-h-40 opacity-100 pt-4' : 'max-h-0 opacity-0'}`}>
                           <p className="text-[#78716C] leading-relaxed">
                              {faq.answer}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#FAFAF9] border-t border-[#E7E5E4] pt-20 pb-10">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
               <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-6">
                     <Leaf size={24} className="text-[#D97757]" />
                     <span className="text-xl font-serif font-medium tracking-tight text-[#1C1917]">Food Arca</span>
                  </div>
                  <p className="text-[#78716C] text-sm leading-relaxed max-w-xs mb-8">
                     The modern operating system for food banks. Empowering communities to serve with dignity and efficiency.
                  </p>
                  <div className="flex gap-4">
                     <a href="#" className="w-10 h-10 rounded-full bg-[#E7E5E4] flex items-center justify-center text-[#57534E] hover:bg-[#D97757] hover:text-white transition-all"><Twitter size={18} /></a>
                     <a href="#" className="w-10 h-10 rounded-full bg-[#E7E5E4] flex items-center justify-center text-[#57534E] hover:bg-[#D97757] hover:text-white transition-all"><Linkedin size={18} /></a>
                     <a href="#" className="w-10 h-10 rounded-full bg-[#E7E5E4] flex items-center justify-center text-[#57534E] hover:bg-[#D97757] hover:text-white transition-all"><Instagram size={18} /></a>
                     <a href="#" className="w-10 h-10 rounded-full bg-[#E7E5E4] flex items-center justify-center text-[#57534E] hover:bg-[#D97757] hover:text-white transition-all"><Github size={18} /></a>
                  </div>
               </div>
               <div>
                  <h4 className="font-serif text-[#1C1917] mb-6 text-lg">Product</h4>
                  <ul className="space-y-4 text-sm text-[#78716C]">
                     <li><a href="#platform" className="hover:text-[#D97757] transition-colors">Features</a></li>
                     <li><a href="#pricing" className="hover:text-[#D97757] transition-colors">Pricing</a></li>
                     <li><a href="#how-it-works" className="hover:text-[#D97757] transition-colors">How it Works</a></li>
                     <li><a href="#" className="hover:text-[#D97757] transition-colors">Enterprise</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="font-serif text-[#1C1917] mb-6 text-lg">Legal</h4>
                  <ul className="space-y-4 text-sm text-[#78716C]">
                     <li><a href="#" className="hover:text-[#D97757] transition-colors">Privacy Policy</a></li>
                     <li><a href="#" className="hover:text-[#D97757] transition-colors">Terms of Service</a></li>
                     <li><a href="#" className="hover:text-[#D97757] transition-colors">Cookie Settings</a></li>
                     <li><a href="#" className="hover:text-[#D97757] transition-colors">System Status</a></li>
                  </ul>
               </div>
            </div>
            <div className="border-t border-[#E7E5E4] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#A8A29E]">
               <p>&copy; 2025 Food Arca Inc. All rights reserved.</p>
            </div>
         </div>
      </footer>
    </div>
  );
}