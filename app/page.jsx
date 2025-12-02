'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import {
  Menu, X, Check, ArrowRight, Box, ShieldCheck, Zap, Leaf, Layout,
  Users, CreditCard, Timer, ScanBarcode, RefreshCw, Smartphone,
  HelpCircle, Play, Twitter, Linkedin, Instagram, Github,
  LockIcon, Package2Icon, UserCircle, ArrowUp,
  Mail,
  MapPin
} from 'lucide-react';
import Link from 'next/link'; // <--- ADD THIS

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

  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      // Show button if scrolled down more than 500px
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fallback for env variables to prevent crash if not set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

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

  // --- REFINED ANIMATIONS ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. Lenis Setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    let ctx;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {

        // --- A. HERO SECTION ---
        // Elegant Text Reveal: Instead of fading up, we use clip-path to "wipe" the text in.
        // It looks much more expensive.
        const heroTextElements = gsap.utils.toArray('.hero-reveal');
        heroTextElements.forEach((el, i) => {
          gsap.fromTo(el,
            { y: 50, opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
            {
              y: 0,
              opacity: 1,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              duration: 1,
              delay: 0.2 + (i * 0.15),
              ease: "power3.out"
            }
          );
        });

        gsap.from('.hero-widget', {
          y: 40, opacity: 0, duration: 1, delay: 0.8, ease: "power3.out"
        });

        // Parallax Image: The image container moves at a different speed than the image inside
        gsap.to(".hero-img-inner", {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });

        // --- B. FEATURE LIST ---
        // Animate the list items simply
        const features = gsap.utils.toArray('.feature-list-item');
        features.forEach((feature, i) => {
          gsap.from(feature, {
            scrollTrigger: {
              trigger: feature,
              start: "top 90%",
            },
            opacity: 0,
            x: 20,
            duration: 0.6,
            ease: "power2.out"
          });
        });

        // --- C. EXPANDING VIDEO ---
        // This is a "stopper" animation. As you scroll, the video container grows.
        gsap.fromTo(".video-scaler",
          { scale: 0.9, borderRadius: "3rem" },
          {
            scale: 1,
            borderRadius: "2.5rem",
            scrollTrigger: {
              trigger: "#how-it-works",
              start: "top 80%",
              end: "top 40%",
              scrub: 1, // Smoothly linked to scrollbar
            }
          }
        );


        // --- D. PRICING CARDS (FIXED) ---
        const pricingCards = gsap.utils.toArray('.pricing-card');

        pricingCards.forEach((card, index) => {
          gsap.fromTo(card,
            {
              opacity: 0,
              y: 60
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: "#pricing",
                start: "top 75%",
              },
              delay: index * 0.15
            }
          );
        });

      }, mainRef); // <--- IMPORTANT: Closes gsap.context

      ScrollTrigger.refresh(); // <--- IMPORTANT: Recalculates positions

    }, 100); // <--- IMPORTANT: Closes setTimeout

    // Cleanup function
    return () => {
      lenis.destroy();
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  const toggleFAQ = (index) => setOpenFAQIndex(openFAQIndex === index ? null : index);
  const toggleFeature = (index) => setActiveFeatureIndex(activeFeatureIndex === index ? null : index);

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

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <div ref={mainRef} className="min-h-screen bg-[#FAFAF9] text-[#1C1917] font-sans selection:bg-[#D97757] selection:text-white overflow-x-hidden">

     
      {/* --- Navigation --- */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-[#E7E5E4] transition-all duration-300">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* Logo */}
          <a href="#" onClick={(e) => scrollToSection(e, 'top')} className="flex items-center gap-3 group cursor-pointer">
            <Leaf size={24} className="text-[#D97757] transition-transform group-hover:rotate-12" />
            <span className="text-xl font-serif font-medium tracking-tight text-[#1C1917]">Food Arca</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {['Features','How it Works', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={(e) => scrollToSection(e, `#${item.toLowerCase().replace(/\s+/g, '-')}`)}
                className="text-sm font-medium text-[#57534E] hover:text-[#D97757] transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D97757] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <button onClick={handleSignIn} className="bg-[#1C1917] text-[#FAFAF9] px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#292524] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 duration-200">
              Try Food Arca
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <button className="md:hidden text-[#1C1917] p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* --- THIS IS THE MISSING PART: Mobile Menu Dropdown --- */}
        <div className={`md:hidden bg-[#FAFAF9] border-b border-[#E7E5E4] overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100 shadow-xl' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-6 flex flex-col space-y-4">
             {['Features', 'How it Works', 'Pricing'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  onClick={(e) => scrollToSection(e, `#${item.toLowerCase().replace(/\s+/g, '-')}`)} 
                  className="text-lg font-serif text-[#57534E] hover:text-[#D97757] transition-colors"
                >
                  {item}
                </a>
              ))}
            <div className="h-px bg-[#E7E5E4] my-2"></div>
            <button onClick={handleSignIn} className="bg-[#1C1917] text-[#FAFAF9] w-full py-3 rounded-lg text-sm font-medium hover:bg-[#292524]">
              Try Food Arca
            </button>
          </div>
        </div>

      </nav>
      {/* --- Hero Section --- */}
      <main className="hero-section min-h-screen pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 flex flex-col justify-center overflow-hidden">
        <div className="container mx-auto max-w-7xl relative">

          {/* Background Decor Elements - Subtle floating blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D97757]/5 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-200/10 rounded-full blur-3xl -z-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-24 items-center">

            {/* Left Column */}
            <div className="hero-content max-w-xl mx-auto w-full z-10">
              {/* Wrappers for clip-path animation */}
              <div className="overflow-hidden mb-2">
                <h1 className="hero-reveal text-5xl md:text-6xl lg:text-8xl font-serif leading-[0.95] tracking-tight text-[#1C1917] text-center md:text-left origin-bottom-left">
                  Feed More.
                </h1>
              </div>
              <div className="overflow-hidden mb-6">
                <h1 className="hero-reveal text-5xl md:text-6xl lg:text-8xl font-serif leading-[0.95] tracking-tight text-center md:text-left">
                  <span className="italic opacity-90 text-[#D97757]">Count Less.</span>
                </h1>
              </div>

              <div className="overflow-hidden mb-12">
                <p className="hero-reveal text-xl text-[#57534E] font-light tracking-wide text-center md:text-left">
                  The modern inventory and client tracking tool for community food banks.
                </p>
              </div>

              {/* Login Widget */}
              <div className="hero-widget bg-white/80 backdrop-blur-sm border border-[#E7E5E4] p-8 rounded-3xl w-full shadow-2xl shadow-[#D6D3D1]/30 hover:shadow-[#D97757]/10 transition-shadow duration-500">
                <button
                  onClick={handleSignIn}
                  className="w-full bg-white hover:bg-[#F5F5F4] text-[#1C1917] font-medium py-3.5 rounded-xl border border-[#E7E5E4] flex items-center justify-center gap-3 transition-all mb-4 group"
                >
                  <div className="group-hover:scale-110 transition-transform duration-300"><GoogleIcon /></div>
                  Sign Up With Google
                </button>

                <div className="flex items-center gap-4 my-4">
                  <div className="h-px bg-[#E7E5E4] flex-1"></div>
                  <span className="text-sm text-[#A8A29E] uppercase tracking-wide">or</span>
                  <div className="h-px bg-[#E7E5E4] flex-1"></div>
                </div>
                <button
                  onClick={handleSignIn}
                  className="w-full bg-[#1C1917] hover:bg-[#34302e] text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                  <LockIcon size={20} />
                  Sign In
                </button>

                <p className="text-[10px] text-[#78716C] mt-4 text-center leading-relaxed">
                  By continuing, you acknowledge our Privacy Policy.
                </p>
              </div>
            </div>

            {/* Right Column: Parallax Image */}
            {/* Added 'overflow-hidden' to container and scale to image for parallax wiggle room */}
            <div className="hero-image hidden md:block relative w-full h-full min-h-[450px] lg:min-h-[600px] bg-[#D97757] rounded-[2.5rem] shadow-2xl shadow-[#D6D3D1]/50 p-4 lg:p-6 group will-change-transform">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-lg z-10 bg-black">
                <img
                  src="/HeroArca2.png"
                  alt="Community Volunteers"
                  className="hero-img-inner w-full h-[120%] object-cover -mt-[10%]" // Made taller for parallax movement
                />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* --- Platform Section --- */}
      <section id="features" className="min-h-screen py-24 bg-[#F5F5F4] flex flex-col justify-center">
        <div className="container mx-auto px-6">
          <div className="feature-title mb-16 text-center md:text-left max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-6">
              Total control,<br /><span className="text-[#78716C]">from any device.</span>
            </h2>
            <p className="text-xl text-[#57534E] font-light">
              From the warehouse tablet to the front-desk laptop, manage your inventory on any device without missing a beat.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left: App Demo Box */}
            <div className="lg:col-span-5 relative group sticky top-24">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D97757]/20 to-purple-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative bg-white rounded-[2rem] p-2 md:p-4 shadow-2xl shadow-[#D6D3D1]/50 overflow-hidden min-h-[500px] flex flex-col border border-[#E7E5E4] transition-transform duration-500 hover:-translate-y-2">
                <img
                  src="/PhoneMock.jpg"
                  alt="App Dashboard Mock"
                  className="w-full h-full flex-1 object-cover rounded-xl min-h-[460px]"
                />
              </div>
            </div>

            {/* Right: Feature List */}
            <div className="lg:col-span-7 flex flex-col justify-center h-full pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    onClick={() => toggleFeature(index)}
                    className={`feature-list-item group p-6 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent ${activeFeatureIndex === index
                      ? 'bg-white shadow-lg border-[#E7E5E4] scale-[1.02]'
                      : 'hover:bg-white/50 hover:border-[#E7E5E4]'
                      }`}
                  >
                    <h3 className={`text-xl font-serif mb-2 flex items-center gap-3 transition-colors ${activeFeatureIndex === index ? 'text-[#D97757]' : 'text-[#1C1917]'
                      }`}>
                      <feature.icon size={22} className={`transition-all duration-300 ${activeFeatureIndex === index ? 'text-[#D97757] scale-110' : 'text-[#A8A29E]'}`} />
                      {feature.title}
                    </h3>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFeatureIndex === index ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                      <p className="text-[#57534E] text-sm font-light leading-relaxed pl-9">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center md:justify-start">
                <button
                  onClick={(e) => scrollToSection(e, '#pricing')}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-[#1C1917] hover:text-[#D97757] transition-colors border-b border-[#1C1917] hover:border-[#D97757] pb-1"
                >
                  See Pricing Options <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- How it works --- */}
      <section id="how-it-works" className="min-h-screen py-24 bg-[#F5F5F4] border-t border-[#E7E5E4] flex flex-col justify-center overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-6">
              Run your Inventory like a pro
            </h2>
            <p className="text-xl text-[#57534E] font-light max-w-3xl mx-auto">
              Simple, fast, and built for food banks.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-32">

            {/* Video Container with SCROLL SCALE effect */}
            <div className="video-scaler relative bg-white shadow-2xl shadow-[#D6D3D1]/50 overflow-hidden aspect-video w-full border border-[#E7E5E4] mb-12 mt-12 transform-gpu">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay loop muted playsInline preload="metadata"
                poster="/Dashbaord.png"
              >
                <source src="/ArcaVideo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Package2Icon, text: "Real-time tracking" },
                { icon: ScanBarcode, text: "Easy barcoding" },
                { icon: Users, text: "Client management" },
                { icon: UserCircle, text: "Team Oriented" }
              ].map((pill, idx) => (
                <div key={idx} className="bg-white rounded-full shadow-sm hover:shadow-md border border-[#E7E5E4] px-4 py-3 flex items-center justify-center gap-2 md:gap-3 transition-all hover:-translate-y-1 duration-300">
                  <div className="text-[#D97757] shrink-0"><pill.icon size={20} /></div>
                  <span className="text-[#1C1917] font-medium text-xs md:text-base whitespace-nowrap">{pill.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* --- Pricing Section --- */}
      <section id="pricing" className="min-h-screen py-24 bg-[#FAFAF9] relative overflow-hidden flex flex-col justify-center">
        {/* Animated Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D97757]/5 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[5000ms]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-6">
              Simple, transparent <br /><span className="text-[#78716C]">pricing for all.</span>
            </h2>
            <p className="text-lg text-[#57534E] max-w-2xl mx-auto font-light">
              Start for free and scale as you serve more families. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">

            {/* Card 1: Starter */}
            <div className="pricing-card group bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 border border-[#E7E5E4] hover:border-[#D6D3D1] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-sm flex flex-col h-full">
              <div className="mb-6"><span className="bg-[#F5F5F4] text-[#57534E] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Starter</span></div>
              <h3 className="text-2xl font-serif font-medium mb-2 text-[#1C1917]">Pantry Basic</h3>
              <p className="text-[#78716C] text-sm mb-8 font-light">Everything a small food bank needs to get started.</p>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2"><span className="text-sm text-[#A8A29E] line-through">$20</span><span className="bg-[#D97757]/10 text-[#D97757] px-2 py-0.5 rounded text-[10px] font-medium">SAVE 25%</span></div>
                <div className="flex items-baseline"><span className="text-lg font-serif align-top mt-1">$</span><span className="text-5xl font-serif font-medium tracking-tight">15</span><span className="text-[#78716C] font-light text-lg ml-1">/mo</span></div>
             <p className="text-xs text-[#A8A29E] mt-3 font-light">Billed monthly. Cancel anytime.</p>
              </div>
              <button className="w-full py-3.5 rounded-xl bg-[#F5F5F4] hover:bg-[#1C1917] hover:text-white text-[#1C1917] font-medium transition-all duration-300 mb-8 border border-[#E7E5E4]">Choose Plan</button>
              <div className="space-y-4 mt-auto">
                {/* Simplified List for brevity */}
                <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]" /> 1 Location</div>
                <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Up to 500 Items & Barcodes</div>
                <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Up to 100 Registered Clients</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Manual Barcode Input</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> 2 Team Members (Admin + 1 Lead Volunteer)</div>
                <div className="text-xs text-[#A8A29E] mt-6 pt-6 border-t border-[#F5F5F4] font-light">Regular price $20/mo.</div>
              </div>
            </div>

            {/* Card 2: Pro (Highlight) - Added slight scale and sticky hover effect */}
            <div className="pricing-card relative group bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 border border-[#D97757]/30 hover:border-[#D97757] transition-all duration-300 scale-105 shadow-2xl shadow-[#D97757]/10 hover:shadow-[#D97757]/20 flex flex-col h-full z-20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D97757] text-white px-4 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest shadow-lg">Most Popular</div>
              <div className="mb-6 mt-2"><span className="bg-[#D97757]/10 text-[#D97757] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Business</span></div>
              <h3 className="text-2xl font-serif font-medium mb-2 text-[#1C1917]">Pantry Pro</h3>
              <p className="text-[#78716C] text-sm mb-8 font-light">For growing food banks needing more capacity.</p>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2"><span className="text-sm text-[#A8A29E] line-through">$40</span><span className="bg-[#D97757]/10 text-[#D97757] px-2 py-0.5 rounded text-[10px] font-medium">SAVE 25%</span></div>
                <div className="flex items-baseline"><span className="text-lg font-serif align-top mt-1">$</span><span className="text-5xl font-serif font-medium tracking-tight">30</span><span className="text-[#78716C] font-light text-lg ml-1">/mo</span></div>
                <p className="text-xs text-[#A8A29E] mt-3 font-light">Billed monthly. Cancel anytime.</p>
              </div>
              <button className="w-full py-3.5 rounded-xl bg-[#D97757] hover:bg-[#C26245] text-white font-medium transition-all shadow-lg shadow-[#D97757]/30 hover:shadow-[#D97757]/50 active:scale-[0.98] mb-8">Choose Plan</button>
              <div className="space-y-4 mt-auto">
                <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> 1 Location</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Up to 5,000 Items & Barcodes</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Unlimited Client Profiles</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Unlimited Team Members</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" /> Fast Barcode Scanning</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#1C1917]"><Check size={16} className="text-[#D97757]" />Grant Reporting (CSV/Excel Exports)</div>

                <div className="text-xs text-[#A8A29E] mt-6 pt-6 border-t border-[#D97757]/20 font-light">Regular price $40/mo.</div>  </div>
            </div>

            {/* Card 3: Network */}
            <div className="pricing-card group bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 border border-[#E7E5E4] hover:border-[#D6D3D1] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-sm flex flex-col h-full">
              <div className="mb-6"><span className="bg-[#F5F5F4] text-[#57534E] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">Enterprise</span></div>
              <h3 className="text-2xl font-serif font-medium mb-2 text-[#1C1917]">Enterprise</h3>
              <p className="text-[#78716C] text-sm mb-8 font-light">For large food bank networks or regional operations.</p>
              <div className="mb-8">
                <div className="flex items-baseline mt-7"><span className="text-5xl font-serif font-medium tracking-tight text-[#1C1917]">Custom</span></div>
              <p className="text-xs text-[#A8A29E] mt-3 font-light">Billed monthly. Cancel anytime.</p>
              </div>
              <button className="w-full py-3.5 rounded-xl bg-[#F5F5F4] hover:bg-[#1C1917] hover:text-white text-[#1C1917] font-medium transition-all duration-300 mb-8 border border-[#E7E5E4]">Contact Sales</button>
              <div className="space-y-4 mt-auto">
                <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Unlimited Locations (Multi-site management)</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Unlimited Items & Barcodes</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Unlimited Client Tracking</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Ulimted Team Members</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Fast Barcode Scanning</div>

                <div className="flex items-center gap-3 text-sm font-light text-[#57534E]"><Check size={16} className="text-[#D97757]/80" /> Grant Reporting (CSV/Excel Exports)</div>

                <div className="text-xs text-[#A8A29E] mt-6 pt-6 border-t border-[#F5F5F4] font-light">Contact Sales.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section id="FAQ" className="min-h-screen py-24 bg-[#F5F5F4] relative flex flex-col justify-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-serif text-[#1C1917] text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                onClick={() => toggleFAQ(index)}
                className={`faq-item group border border-[#E7E5E4] rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-md ${openFAQIndex === index ? 'bg-white shadow-md' : 'bg-transparent'
                  }`}
              >
                <h3 className="text-lg md:text-xl font-medium flex items-center justify-between gap-4 text-[#1C1917]">
                  <span className="flex-1">{faq.question}</span>
                  <div className={`transition-transform duration-300 shrink-0 bg-[#F5F5F4] p-1 rounded-full ${openFAQIndex === index ? 'rotate-180 text-[#D97757]' : 'text-[#A8A29E]'
                    }`}>
                    {openFAQIndex === index ? <X size={20} /> : <ArrowRight size={20} />}
                  </div>
                </h3>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFAQIndex === index ? 'max-h-96 opacity-100 pt-4' : 'max-h-0 opacity-0'
                  }`}>
                  <p className="text-[#78716C] leading-relaxed text-sm md:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* --- Footer (Updated Contact Info) --- */}
      <footer className="bg-[#FAFAF9] border-t border-[#E7E5E4] pt-24 pb-12 relative overflow-hidden">
        
        {/* Optional: Giant Background Text */}
        <div className="absolute -top-24 -right-24 text-[20rem] font-serif text-[#1C1917] opacity-[0.02] pointer-events-none select-none leading-none">
          Arca
        </div>

        <div className="container mx-auto px-6 relative z-10">
          
          {/* Top Section: Final CTA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 pb-20 border-b border-[#E7E5E4]">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-serif text-[#1C1917] mb-4">
                Ready to modernize your pantry?
              </h2>
              <p className="text-[#57534E] font-light text-lg">
                Join hundreds of food banks serving their communities with dignity and speed.
              </p>
            </div>
            <div className="mt-8 md:mt-0">
              <button onClick={handleSignIn} className="bg-[#1C1917] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#D97757] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                Get Started for Free
              </button>
            </div>
          </div>

          {/* Middle Section: Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24 mb-20">
            
            {/* Column 1: Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Leaf size={24} className="text-[#D97757]" />
                <span className="text-xl font-serif font-medium tracking-tight text-[#1C1917]">Food Arca</span>
              </div>
              <p className="text-[#78716C] text-sm leading-relaxed mb-6">
                The operating system for modern food banks. Built to help you count less and feed more.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-[#A8A29E] hover:text-[#D97757] transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-[#A8A29E] hover:text-[#D97757] transition-colors"><Linkedin size={20} /></a>
                <a href="#" className="text-[#A8A29E] hover:text-[#D97757] transition-colors"><Github size={20} /></a>
              </div>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="font-serif text-[#1C1917] mb-6 text-lg">Product</h4>
              <ul className="space-y-4 text-sm text-[#78716C]">
                <li><a href="#features" onClick={(e) => scrollToSection(e, '#features')} className="hover:text-[#D97757] transition-colors">Features</a></li>
                <li><a href="#pricing" onClick={(e) => scrollToSection(e, '#pricing')} className="hover:text-[#D97757] transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" onClick={(e) => scrollToSection(e, '#how-it-works')} className="hover:text-[#D97757] transition-colors">How it Works</a></li>
              </ul>
            </div>

            {/* Column 3: Contact (Updated) */}
            <div>
              <h4 className="font-serif text-[#1C1917] mb-6 text-lg">Contact</h4>
              <ul className="space-y-4 text-sm text-[#78716C]">
                <li className="flex items-center gap-2">
                    <Mail size={16} className="text-[#D97757] shrink-0" />
                    <a href="mailto:rogeliopmdev@gmail.com" className="hover:text-[#D97757] transition-colors break-all">rogeliopmdev@gmail.com</a>
                </li>
                <li className="flex items-start gap-2">
                    <MapPin size={16} className="text-[#D97757] shrink-0 mt-0.5" />
                    <span>Greensboro, NC, USA</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal */}
           <div>
              <h4 className="font-serif text-[#1C1917] mb-6 text-lg">Legal</h4>
              <ul className="space-y-4 text-sm text-[#78716C]">
                <li>
                  {/* Option 1: Using Next.js Link (Faster, smoother) */}
                  <Link href="/terms" className="hover:text-[#D97757] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#D97757] transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  {/* Keep as # for now if you don't have a cookie settings modal */}
                  <a href="#" className="hover:text-[#D97757] transition-colors">Cookie Settings</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section: Copyright & Credit */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#E7E5E4] text-xs text-[#A8A29E]">
            <p>&copy; 2025 Food Arca Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
                <span>Designed and made by</span>
                <span className="text-[#1C1917] font-medium">Rogelio Perez</span>
            </div>
          </div>
        </div>
      </footer>

      <button
        onClick={(e) => scrollToSection(e, 'top')}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-500 ease-out border border-[#E7E5E4] ${
          showScrollTop 
            ? 'opacity-100 translate-y-0 bg-[#1C1917] text-white hover:bg-[#D97757] hover:-translate-y-1' 
            : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
}