// Welcome to your Web Verse frontend!
// This is the complete, optimized code for your main application page.
// It includes full SEO metadata and performance enhancements.
'use client'

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { CheckCircle, Code, BarChart2, Zap, ShieldCheck, Users, Mail, Phone, MapPin, Globe, Menu, X, MessageSquare, Palette, Wrench, Rocket, Sun, Moon, Server, Brush, Lock, Briefcase, Heart } from 'lucide-react';
import * as THREE from 'three';



// --- Performance: Lazy Load Components ---
// These components will only be loaded when they are about to be viewed.
// --- Lazy Load Components (in-file) ---
// Helper for viewport-based lazy loading of sections
function LazySection({ children }) {
  const ref = useRef();
  const inView = useInView(ref);
  return <div ref={ref}>{inView ? children : null}</div>;
}
// ContactSection is used directly, not lazy-loaded


// --- Helper Data ---

const templates = [
  {
    title: "E-commerce Excellence",
    description: "A robust and scalable online store solution, designed to maximize sales and user experience.",
    imgSrc: "/AetherDemo.png",
  },
  {
    title: "Service-Based Business",
    description: "Showcase your services, book appointments, and generate leads with this professional template.",
    imgSrc: "https://placehold.co/600x400/2d3748/ffffff?text=Services",
  },
  {
    title: "Restaurant & Cafe",
    description: "An appetizing design with menu displays, online ordering integration, and reservation capabilities.",
    imgSrc: "https://placehold.co/600x400/4a5568/ffffff?text=Restaurant",
  },
  {
    title: "Portfolio Showcase",
    description: "A visually stunning template for creatives to display their work with elegance and impact.",
    imgSrc: "https://placehold.co/600x400/718096/ffffff?text=Portfolio",
  },
];

const processSteps = [
  { icon: <MessageSquare />, title: "1. Discover", description: "We start by understanding your <strong>business aspirations</strong>." },
  { icon: <Palette />, title: "2. Envision", description: "A <strong>visual blueprint</strong> and prototype are crafted." },
  { icon: <Code />, title: "3. Craft", description: "Your vision becomes reality with <strong>precise execution</strong>." },
  { icon: <Wrench />, title: "4. Refine", description: "We polish details together for <strong>perfection</strong>." },
  { icon: <Rocket />, title: "5. Elevate", description: "The launch marks just the beginning of <strong>excellence</strong>." },
];


const competitiveFeatures = [
  { icon: <Globe className="h-8 w-8 text-[hsl(var(--primary))]" />, title: "Trilingual Fluency", description: "Clear communication in English, Spanish, and French." },
  { icon: <ShieldCheck className="h-8 w-8 text-[hsl(var(--primary))]" />, title: "Cybersecurity Foundation", description: "Websites built with security as a priority, not an afterthought." },
  { icon: <BarChart2 className="h-8 w-8 text-[hsl(var(--primary))]" />, title: "Results-Driven", description: "Focused on features that directly contribute to your revenue." },
  { icon: <Zap className="h-8 w-8 text-[hsl(var(--primary))]" />, title: "Peak Performance", description: "Every site is fine-tuned for speed and responsiveness." },
];

const maintenancePackages = [
  {
    title: "Essential Care",
    price: "$125",
    period: "/mo",
    description: "Worry-Free Website Support",
    features: [
      "I check your website every week to make sure everything works.",
      "If something stops working, I’ll fix it quickly.",
      "Your site is backed up, so you won’t lose important information.",
      "Quiet updates keep your website safe behind the scenes.",
      "Each month, you’ll get a simple summary confirming your site is in good shape."
    ],
    cta: "Contact Us",
    note: "Best for businesses that want their website professionally cared for, without lifting a finger."
  },
  {
    title: "Growth Partner",
    price: "$275",
    period: "/mo",
    description: "Popular Choice for Ambitious Businesses",
    features: [
      "Includes everything in Essential Care.",
      "Get up to 2 hours each month for website updates or changes — just send your text or photos, I'll take care of the rest.",
      "I’ll make your website run faster, so visitors have a smooth experience.",
      "You always get priority help.",
      "Each month, you’ll receive a simple report: see how many visitors you had and what’s been updated.",
      "No technical confusion — I explain all work in clear, everyday language."
    ],
    cta: "Contact Us",
    popular: true,
    note: "Perfect for service providers, local shops, or professionals who want their website always up-to-date and performing at its best."
  },
  {
    title: "All-Inclusive VIP",
    price: "$475",
    period: "/mo",
    description: "Complete Care for Your Website",
    features: [
      "Includes everything in Growth Partner.",
      "Unlimited small updates — just email your changes and I’ll handle them.",
      "Full support for your online store — products, payments, and sales pages taken care of.",
      "You receive a clear monthly report with simple suggestions to improve your site.",
      "Every three months, we’ll talk through ideas to help your business grow online.",
      "You always get the fastest help if anything needs fixing."
    ],
    cta: "Contact Us",
    note: "Best for online shops, coaches, and business owners who want all website tasks managed for them."
  },
];

const skills = [
  {
    category: "Programming & Frontend",
    icon: <Brush className="h-8 w-8 text-[hsl(var(--primary))]" />,
    items: ["JavaScript (ES6+)", "HTML5", "CSS3 / Tailwind", "React", "Next.js"]
  },
  {
    category: "Backend & Databases",
    icon: <Server className="h-8 w-8 text-[hsl(var(--primary))]" />,
    items: ["Node.js", "Python", "SQL", "MongoDB", "MERN Stack"]
  },
  {
    category: "Security & Networking",
    icon: <Lock className="h-8 w-8 text-[hsl(var(--primary))]" />,
    items: ["Network Security", "Kali Linux", "pfSense", "Metasploit", "Vercel Firewall"]
  },
  {
    category: "Tools & Platforms",
    icon: <Briefcase className="h-8 w-8 text-[hsl(var(--primary))]" />,
    items: ["Git / GitHub", "Vercel", "AWS / Azure", "Figma", "Tableau"]
  }
];

// --- Reusable Components ---

const Section = React.memo(({ children, className = '', id, paddingClass }) => (
  <section id={id} className={`${paddingClass ? paddingClass : 'py-20 md:py-28'} px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
));

const SectionTitle = React.memo(({ children, subtext }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-luxury font-bold text-[hsl(var(--foreground))] tracking-tight">{children}</h2>
    {subtext && <p className="mt-4 max-w-3xl mx-auto text-lg text-[hsl(var(--muted-foreground))]">{subtext}</p>}
  </div>
));

const CtaButton = ({ children, primary = false, className = '', href, onClick, type = 'button', disabled = false }) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    className={`inline-block px-6 py-3 rounded-full font-medium transition-all duration-300 cursor-pointer text-center
      ${primary
        ? 'bg-[#254081] hover:bg-[#3454b4] text-white'
        : 'bg-white border border-[#254081] text-[#254081] hover:bg-[#254081] hover:text-white'}
      ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </motion.button>
);

const Header = React.memo(({ handleScroll, theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Templates', href: '#templates' },
    { name: 'Process', href: '#process' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="bg-[rgba(255,255,255,0.7)] backdrop-blur-[10px] sticky top-0 z-50 transition-colors duration-300 border-b border-[rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <a href="#" onClick={(e) => handleScroll(e, '#hero')} className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-4 cursor-pointer hover:opacity-90 transition-opacity duration-200">
              {/* Logo */}
              <img 
                src="/actualyLogo.png" 
                alt="Luminary Sites Logo" 
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl shadow-lg object-cover"
              />
              <div className="flex items-end gap-1 lg:gap-2">
                <span className="text-xl lg:text-2xl xl:text-3xl font-serif text-[#1A1D29] tracking-[0.03em] font-medium">LUMINARY</span>
                <span className="hidden sm:block text-xs lg:text-sm font-light text-[#7A91B4] tracking-normal lowercase">sites</span>
              </div>
            </a>
          </div>
          
          {/* Desktop Navigation - Centered */}
          <div className="hidden xl:flex items-center justify-center flex-1">
            <nav className="flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="text-[#1A1D29] hover:text-[hsl(var(--primary))] px-2 lg:px-3 py-2 text-sm lg:text-base font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-0 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[hsl(var(--primary))] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>
          </div>
          
          {/* Medium Screen Navigation */}
          <div className="hidden lg:flex xl:hidden items-center space-x-2 lg:space-x-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="text-[#1A1D29] hover:text-[hsl(var(--primary))] px-1 lg:px-2 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-0 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[hsl(var(--primary))] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          
          {/* CTA Button - ALWAYS on the right */}
          <div className="hidden md:flex items-center ml-4 lg:ml-6">
            <CtaButton 
              primary={true}
              className="bg-[#254081] hover:bg-[#3454b4] text-white font-medium transition-all duration-300 rounded-full"
              href="#contact" 
              onClick={(e) => handleScroll(e, '#contact')}
            >
              Free Consultation
            </CtaButton>
          </div>
          
          {/* Mobile Nav Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] transition-colors mr-2">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-[hsl(var(--card))] inline-flex items-center justify-center p-2 rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-[hsl(var(--background))] shadow-[var(--shadow-luxury)] z-50 border-b border-[hsl(var(--card))]"
            >
              <div className="flex flex-col divide-y divide-[hsl(var(--card))]">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      setIsOpen(false);
                      handleScroll(e, link.href);
                    }}
                    className="block px-6 py-4 text-2xl font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] hover:underline underline-offset-4 transition-all duration-200 focus:outline-none focus:ring-0 bg-transparent border-none shadow-none"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="p-4">
                  <CtaButton
                    primary={true}
                    className="bg-[#254081] hover:bg-[#3454b4] text-white font-medium shadow-lg transition-all duration-300 w-full"
                    href="#contact"
                    onClick={(e) => {
                      setIsOpen(false);
                      handleScroll(e, '#contact');
                    }}
                  >
                    Free Consultation
                  </CtaButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


    </header>
  );
});


const HeroBackground = React.memo(() => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      {/* Main white-to-blue gradient background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white via-[#f5f7fa] to-[#e4ebff]" />
      {/* Centered, blurred blue/white blobs for depth */}
      <div className="absolute left-1/2 top-1/2 w-[40vw] h-[40vw] bg-[#dfefff] opacity-30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute left-1/2 top-1/2 w-[30vw] h-[30vw] bg-[#eaf3ff] opacity-20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute left-1/2 top-1/2 w-[20vw] h-[20vw] bg-white opacity-40 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
      {/* Subtle diagonal sunray-like effect (animated) */}
      <div
        className="absolute left-1/2 top-1/2 w-[60vw] h-[60vh] blur-3xl pointer-events-none animate-ray"
        style={{
          background: 'linear-gradient(120deg, rgba(255, 200, 0, 0.77), rgba(253, 232, 137, 0.55), transparent)',
          opacity: 0.7,
          transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
        }}
      />
      {/* Subtle shimmer/light ray, centered and moving horizontally */}
      <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center overflow-hidden">
        <div
          className="absolute left-0 top-0 w-full h-full animate-shimmer-ray blur-sm"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, transparent 20%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,1) 45%, rgba(255,255,255,1) 55%, rgba(255,255,255,0.7) 60%, transparent 80%, transparent 100%)',
            backgroundSize: '300% 100%',
            backgroundPosition: '-200% 0%',
            opacity: 1,
            pointerEvents: 'none',
          }}
        />
      </div>
      <style jsx global>{`
        @keyframes shimmer-ray {
          0% { background-position-x: -200%; }
          100% { background-position-x: 100%; }
        }
        .animate-shimmer-ray {
          animation: shimmer-ray 3s linear infinite;
        }
        @keyframes ray {
          0% { transform: translateX(-50%) translateY(-50%) rotate(45deg); }
          100% { transform: translateX(-40%) translateY(-50%) rotate(45deg); }
        }
        .animate-ray {
          animation: ray 6s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
});


const HeroSection = ({ handleScroll, theme }) => (
  <div className="relative">
    <Section id="hero" paddingClass="pt-32 pb-36 md:pt-40 md:pb-44 lg:pt-48 lg:pb-56" className="hero text-center min-h-[110vh] flex items-center justify-center relative overflow-hidden">
      <HeroBackground />
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-luxury font-medium tracking-tighter text-[#18181b] hero-heading"
            style={{
              fontOpticalSizing: 'auto',
              letterSpacing: '0.015em',
            }}
          >
            Your Business Deserves to Be <br />
            <span className="text-[hsl(var(--primary))] underline decoration-yellow-400 decoration-4 underline-offset-4">Seen</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-[#18181b]">
            Beautiful, secure websites for businesses in the Triad that don't just look great—they actually grow your business.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <CtaButton 
              primary={true}
              className="bg-[#254081] hover:bg-[#3454b4] text-white font-medium shadow-lg transition-all duration-300 hero-primary-cta"
              href="#contact" 
              onClick={(e) => handleScroll(e, '#contact')}
            >
              Get Your Free Consultation
            </CtaButton>
            <CtaButton
              className="bg-white text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--background))] border border-[hsl(var(--primary))] shadow-lg transition-all duration-300 hero-secondary-cta"
              href="#templates"
              onClick={(e) => handleScroll(e, '#templates')}
            >
              Explore Templates
            </CtaButton>
          </div>
        </motion.div>
      </div>
    </Section>
    <style jsx global>{`
  .hero-heading {
    font-variation-settings: 'wght' 500, 'opsz' 32;
  }
  @media (max-width: 640px) {
    .hero-heading {
      font-weight: 400 !important;
      font-variation-settings: 'wght' 400, 'opsz' 24;
    }
  }
  .hero-primary-cta {
    border-radius: 12px !important;
    padding: 0.85em 1.6em !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important;
  }
  .hero-secondary-cta {
    border-radius: 12px !important;
    padding: 0.85em 1.6em !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important;
    background: #fff !important;
    color: hsl(var(--primary)) !important;
    border: 1.5px solid hsl(var(--primary)) !important;
  }
  .hero-secondary-cta:hover, .hero-secondary-cta:focus {
    background: transparent !important;
    color: hsl(var(--primary)) !important;
    border: 1.5px solid hsl(var(--primary)) !important;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important;
  }
`}</style>
  </div>
);

const AboutSection = React.memo(({ handleScroll }) => (
  <Section id="about" paddingClass="py-16 md:py-20 lg:py-24" className="bg-gradient-to-b from-[#f6faff] to-[#ffffff]">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="order-2 md:order-1">
        <h2 className="text-3xl font-luxury font-bold text-[hsl(var(--foreground))] tracking-tight">When Your Website Works, Your Dreams Come to Life</h2>
        <p className="mt-4 text-[hsl(var(--muted-foreground))] text-lg">
        We craft digital experiences that tell your story and connect with the people who matter most to your business.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {competitiveFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col sm:flex-row items-start"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0">{feature.icon}</div>
              <div className="ml-0 sm:ml-4 mt-2 sm:mt-0">
                <h4 className="font-bold text-[hsl(var(--foreground))]">{feature.title}</h4>
                <p className="text-[hsl(var(--muted-foreground))]">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <CtaButton 
            primary={true}
            className="bg-[#254081] hover:bg-[#3454b4] text-white font-medium shadow-lg transition-all duration-300"
            href="#process" 
            onClick={(e) => handleScroll(e, '#process')}
          >
            Discover Our Process
          </CtaButton>
        </div>
      </div>
      <div className="relative h-96 order-1 lg:order-2">
        <motion.div
          className="absolute inset-0 bg-[hsl(var(--primary))] rounded-lg transform -rotate-3"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        ></motion.div>
        <motion.img
          src="/bussOwner.png"
          alt="Diverse team working in modern office"
          className="relative w-full h-full object-cover rounded-lg shadow-[var(--shadow-2xl)]"
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </div>
    </div>
  </Section>
));

// --- Lazy-loaded Component Implementations ---
// To make this work, create a `components` folder in `frontend`
// and create a separate file for each of these components.

const AnimatedCounter = ({ to, suffix = '', duration = 2, decimals = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (!isInView) return;
    let start = 0;
    let startTime = null;
    function animateCounter(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const current = start + (to - start) * progress;
      setValue(current);
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        setValue(to);
      }
    }
    requestAnimationFrame(animateCounter);
    // eslint-disable-next-line
  }, [isInView, to, duration]);
  return (
    <span ref={ref} className="block text-4xl md:text-5xl font-extrabold text-[#254081] mb-2">
      {value.toFixed(decimals)}{suffix}
    </span>
  );
};

const ResultsSection = () => (
  <Section id="results" paddingClass="py-16 md:py-20 lg:py-24" className="bg-gradient-to-b from-[#feffff] via-[#d1e0ff] to-[#f6faff]">
    <SectionTitle subtext="Real businesses, real growth, real results that matter to your bottom line.">
      Measurable Results, Real Growth
    </SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <motion.div
        className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-luxury)]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <BarChart2 className="h-12 w-12 mx-auto text-[hsl(var(--primary))] mb-4" />
        <AnimatedCounter to={2} suffix="x" duration={2} />
        <h3 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))]">Double Your Revenue</h3>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]"> Our clients see significant revenue increases within the first quarter of launch.</p>
      </motion.div>
      <motion.div
        className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-luxury)]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Zap className="h-12 w-12 mx-auto text-[hsl(var(--primary))] mb-4" />
        <AnimatedCounter to={65} suffix="%" duration={2} />
        <h3 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))]"> Faster Load Times</h3>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">Speed matters. Your customers won't wait, and neither will your website.</p>
      </motion.div>
      <motion.div
        className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-luxury)]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Users className="h-12 w-12 mx-auto text-[hsl(var(--primary))] mb-4" />
        <AnimatedCounter to={40} suffix="%" duration={2} />
        <h3 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))]">Improved Engagement</h3>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">Visitors stay longer, explore more, and become loyal customers.</p>
      </motion.div>
    </div>
  </Section>
);

const TemplateShowcase = () => {
  const getTemplatePath = (title) => {
    const pathMap = {
      "E-commerce Excellence": "/templates/ecommerce",
      "Service-Based Business": "/templates/services",
      "Restaurant & Cafe": "/templates/restaurant",
      "Portfolio Showcase": "/templates/portfolio"
    };
    return pathMap[title] || "/";
  };

  return (
    <Section id="templates" paddingClass="py-16 md:py-20 lg:py-24" className="bg-gradient-to-b from-[#f6faff] to-[#ffffff]">
      <SectionTitle subtext="Explore a universe of possibilities. Each template is a starting point for your unique brand.">
       Website Templates That Tell Your Story
      </SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {templates.map((template, index) => (
          <motion.div
            key={template.title}
            className="bg-[hsl(var(--background))] rounded-lg overflow-hidden shadow-[var(--shadow-luxury)] group cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px 0 hsl(var(--primary) / 0.15)' }}
            onClick={() => window.location.href = getTemplatePath(template.title)}
          >
            <div className="overflow-hidden">
              <img src={template.imgSrc} alt={template.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-luxury font-bold text-[hsl(var(--foreground))]">{template.title}</h3>
              <p className="mt-2 text-[hsl(var(--muted-foreground))]">{template.description}</p>
              <div className="mt-4 flex items-center text-[hsl(var(--primary))] text-sm font-medium">
                <span>Learn More</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

const ProcessSection = React.memo(({ theme }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
        delayChildren: 0.3,
      }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <Section id="process" paddingClass="py-24 md:py-32 lg:py-40" className="bg-gradient-to-b from-[#feffff] via-[#e0e7ff] to-[#f6faff]">
      <SectionTitle subtext="A journey of collaboration, creativity, and care that brings your vision to life.">
        How We Create Magic Together
      </SectionTitle>
      <div className="relative max-w-5xl mx-auto">
        {/* Desktop Layout - Horizontal */}
        <motion.div
          className="hidden md:grid md:grid-cols-5 gap-20 items-start relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Minimalist divider line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-[32px] h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--muted-foreground))]/20 to-transparent z-0 origin-left"
          />
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex flex-col items-center text-center z-10"
              variants={itemVariants}
            >
              {/* Single minimalist icon */}
              <div className="h-16 w-16 mb-12 rounded-full bg-white/50 border border-[hsl(var(--muted-foreground))]/10 flex items-center justify-center text-[hsl(var(--primary))] transition-colors duration-300 hover:bg-white/70 hover:border-[hsl(var(--primary))]/20">
                {React.cloneElement(
                  step.icon,
                  {
                    className: [
                      step.icon.props.className || "",
                      "h-8 w-8 transition-colors duration-300"
                    ].join(" ").trim()
                  }
                )}
              </div>
              {/* Title with subtle step number */}
              <div className="mb-6">
                <h3 className="text-2xl text-[hsl(var(--foreground))] tracking-tight font-normal group cursor-pointer">
                  <span className="text-xs text-[hsl(var(--muted-foreground))] font-normal mr-3 transition-colors duration-300 group-hover:text-[hsl(var(--primary))]/60">{(index + 1).toString().padStart(2, '0')}</span>
                  <span className="relative">
                    {step.title.replace(/^\d+\.\s*/, '')}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[hsl(var(--primary))]/30 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </h3>
              </div>
              <div className="h-24 flex items-center justify-center px-2">
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed text-lg transition-colors duration-300 text-center" dangerouslySetInnerHTML={{ __html: step.description }}></p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Layout - Vertical Stack */}
        <motion.div
          className="md:hidden space-y-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex flex-col items-center text-center"
              variants={itemVariants}
            >
              {/* Single minimalist icon */}
              <div className="h-14 w-14 mb-10 rounded-full bg-white/50 border border-[hsl(var(--muted-foreground))]/10 flex items-center justify-center text-[hsl(var(--primary))] transition-colors duration-300 hover:bg-white/70 hover:border-[hsl(var(--primary))]/20">
                {React.cloneElement(
                  step.icon,
                  {
                    className: [
                      step.icon.props.className || "",
                      "h-7 w-7 transition-colors duration-300"
                    ].join(" ").trim()
                  }
                )}
              </div>
              {/* Title with subtle step number */}
              <div className="mb-6">
                <h3 className="text-2xl text-[hsl(var(--foreground))] tracking-tight font-normal group cursor-pointer">
                  <span className="text-xs text-[hsl(var(--muted-foreground))] font-normal mr-3 transition-colors duration-300 group-hover:text-[hsl(var(--primary))]/60">{(index + 1).toString().padStart(2, '0')}</span>
                  <span className="relative">
                    {step.title.replace(/^\d+\.\s*/, '')}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[hsl(var(--primary))]/30 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </h3>
              </div>
              <div className="h-24 flex items-center justify-center px-2">
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed text-lg max-w-sm transition-colors duration-300 text-center" dangerouslySetInnerHTML={{ __html: step.description }}></p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
});


const MaintenanceSection = ({ handleScroll }) => (
  <Section id="services" paddingClass="py-16 md:py-20 lg:py-24" className="bg-gradient-to-b from-[#f6faff] to-[#ffffff]">
    <SectionTitle subtext="Keep your website secure, fast, and up-to-date with our affordable monthly packages.">
      Maintenance & Support
    </SectionTitle>
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-stretch">
      {maintenancePackages.map((pkg, index) => (
        <motion.div
          key={pkg.title}
          className={`bg-white rounded-xl min-h-[540px] p-12 flex flex-col relative border transition-colors duration-300 group ${pkg.popular ? 'border-[hsl(var(--primary))]/20' : 'border-[hsl(var(--muted-foreground))]/10'}`}
          initial={{ opacity: 0.85, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
        >
          {pkg.popular && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded border border-[hsl(var(--muted-foreground))]/20 bg-transparent text-[hsl(var(--primary))]/70 z-10" style={{letterSpacing:'0.12em'}}>
              MOST POPULAR
            </div>
          )}
          <h3 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] text-center mb-6">{pkg.title}</h3>
          {pkg.description && (
            <p className="mt-1 mb-8 text-center text-[hsl(var(--muted-foreground))] text-base">{pkg.description}</p>
          )}
          <div className="my-4 text-center mb-8">
            <span className="text-4xl font-semibold text-[#254081]">{pkg.price}</span>
            <span className="text-[hsl(var(--muted-foreground))] font-medium">{pkg.period}</span>
          </div>
          <ul className="space-y-4 text-[hsl(var(--muted-foreground))] flex-grow mb-6">
            {pkg.features.map(feature => (
              <li key={feature} className="flex items-start text-left">
                <span className="ml-2 mr-3 text-[hsl(var(--muted-foreground))]/60 select-none">&#8211;</span>
                <span className="text-base" dangerouslySetInnerHTML={{ __html: feature }}></span>
              </li>
            ))}
          </ul>
          {pkg.note && (
            <div className="mt-6 p-3 bg-[hsl(var(--card))] rounded border-l-2 border-[hsl(var(--muted-foreground))]/20">
              <p className="text-sm text-[hsl(var(--muted-foreground))] italic">{pkg.note}</p>
            </div>
          )}
          <div className="mt-10">
            <CtaButton
              primary={true}
              className="bg-[#254081] hover:bg-[#3454b4] text-white font-medium transition-all duration-300 w-full rounded-full border-none"
              onClick={e => handleScroll(e, '#contact')}
            >
              Contact Us
            </CtaButton>
          </div>
        </motion.div>
      ))}
    </div>
    {/* Optional Add-Ons Section */}
    <motion.div
      className="mt-16 bg-white rounded-xl shadow-[0_1px_8px_rgba(30,41,59,0.03)] p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] text-center mb-6">Optional Add-Ons</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-white rounded-lg shadow-[0_1px_8px_rgba(30,41,59,0.03)] min-h-[140px] flex flex-col justify-center">
          <div className="text-2xl font-bold text-[#254081] mb-2">$150</div>
          <div className="text-sm text-gray-600 mb-2">per hour</div>
          <div className="font-medium text-[hsl(var(--foreground))]">Extra design or development help</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-[0_1px_8px_rgba(30,41,59,0.03)] min-h-[140px] flex flex-col justify-center">
          <div className="text-2xl font-bold text-[#254081] mb-2">$15</div>
          <div className="text-sm text-gray-600 mb-2">per month</div>
          <div className="font-medium text-[hsl(var(--foreground))]">Hosting or domain management</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-[0_1px_8px_rgba(30,41,59,0.03)] min-h-[140px] flex flex-col justify-center">
          <div className="text-2xl font-bold text-[#254081] mb-2">$500</div>
          <div className="text-sm text-gray-600 mb-2">flat rate</div>
          <div className="font-medium text-[hsl(var(--foreground))]">One-time site cleanup, speed-up, or fix</div>
        </div>
      </div>
    </motion.div>

  </Section>
);

const SuccessStoriesSection = React.memo(({ handleScroll }) => (
  <Section id="success-stories" paddingClass="py-16 md:py-20 lg:py-24" className="bg-gradient-to-b from-[#ffffff] to-[#e0e7ff]">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-luxury font-bold text-[hsl(var(--foreground))] tracking-tight">Stories of Success and Growth</h2>
      <p className="mt-4 max-w-3xl mx-auto text-lg text-[hsl(var(--muted-foreground))]">
        Real stories from real business owners who found their voice online.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#254081] to-[#3454b4] rounded-full flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-[hsl(var(--foreground))]">Sarah Johnson</h4>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Artisan Bakery</p>
          </div>
        </div>
        <blockquote className="text-[hsl(var(--muted-foreground))] italic leading-relaxed">
          "My website doesn't just showcase my pastries—it tells the story of my passion."
        </blockquote>
      </motion.div>

      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#254081] to-[#3454b4] rounded-full flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-[hsl(var(--foreground))]">Michael Chen</h4>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Fitness Studio</p>
          </div>
        </div>
        <blockquote className="text-[hsl(var(--muted-foreground))] italic leading-relaxed">
          "Finally, a website that captures the energy of my studio. New member sign-ups have tripled since launch."
        </blockquote>
      </motion.div>

      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#254081] to-[#3454b4] rounded-full flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-[hsl(var(--foreground))]">Emily Rodriguez</h4>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Boutique Consultancy</p>
          </div>
        </div>
        <blockquote className="text-[hsl(var(--muted-foreground))] italic leading-relaxed">
          "The website reflects my professionalism and love for my business."
        </blockquote>
      </motion.div>
    </div>
    <div className="mt-12 text-center">
      <CtaButton 
        primary={true}
        className="bg-[#254081] hover:bg-[#3454b4] text-white font-medium shadow-lg transition-all duration-300"
        href="#contact" 
        onClick={(e) => handleScroll(e, '#contact')}
      >
        Start Your Success Story
      </CtaButton>
    </div>
  </Section>
));


const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ submitting: false, message: '', error: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, message: '', error: false });

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setFormStatus({ submitting: false, message: 'Message sent successfully!', error: false });
      setFormData({ name: '', email: '', message: '' });

    } catch (error) {
      setFormStatus({ submitting: false, message: error.message, error: true });
    }
  };

  const exampleMessage = "Hi, I'm Jane from Raleigh. My email is jane@email.com and I want to make a website for my business.";

  return (
    <Section id="contact" paddingClass="py-16 md:py-20 lg:py-24" className="bg-gradient-to-b from-white to-[#e0e7ff]">
      <div className="bg-[#254081] rounded-lg shadow-lg p-8 md:p-16 grid lg:grid-cols-2 gap-12 items-center text-white">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-luxury font-bold">Ready to Show the World What You've Built?</h2>
          <p className="mt-4 text-lg text-white">
            Let's create something beautiful together.
          </p>
          <div className="mt-8 border-t border-[hsl(var(--primary))] pt-8">
            <h3 className="text-xl font-luxury font-bold">Or Contact Me Directly</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center"><Mail className="h-5 w-5 mr-3" /><a href="mailto:perez122003@gmail.com" className="hover:text-[hsl(var(--primary))]">perez122003@gmail.com</a></li>
              <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-3 text-[#0A66C2]"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 10.268h-3v-4.604c0-1.099-.021-2.513-1.531-2.513-1.531 0-1.767 1.197-1.767 2.434v4.683h-3v-9h2.881v1.233h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v4.729z"/></svg><a href="https://www.linkedin.com/in/rogelioperezmontero/" target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(var(--primary))]">LinkedIn</a></li>
            </ul>
          </div>
        </motion.div>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-lg"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input type="text" name="name" id="name" required placeholder="Your Name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#254081] bg-white text-[hsl(var(--foreground))] placeholder-[hsl(var(--primary))] focus:ring-2 focus:ring-[#254081]" />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input type="email" name="email" id="email" required placeholder="Your Email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#254081] bg-white text-[hsl(var(--foreground))] placeholder-[hsl(var(--primary))] focus:ring-2 focus:ring-[#254081]" />
          </div>
          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea name="message" id="message" rows="5" required placeholder={exampleMessage} value={formData.message} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#254081] bg-white text-[hsl(var(--foreground))] placeholder-[hsl(var(--primary))] focus:ring-2 focus:ring-[#254081]"></textarea>
          </div>
          <div>
            <CtaButton
              primary={true}
              type="submit"
              className="w-full"
              disabled={formStatus.submitting}
            >
              {formStatus.submitting ? 'Sending...' : 'Send Message'}
            </CtaButton>
            <CtaButton
              primary={true}
              className="w-full mt-3 bg-[#60a5fa] hover:bg-[#3b82f6] text-white shadow-[var(--shadow-luxury)]"
              onClick={() => {
                if (window.Calendly) {
                  window.Calendly.initPopupWidget({ url: 'https://calendly.com/perez122003' });
                } else {
                  window.open('https://calendly.com/perez122003', '_blank');
                }
              }}
            >
              Schedule with Calendly
            </CtaButton>
          </div>
          {formStatus.message && (
            <p className={`text-center ${formStatus.error ? 'text-[hsl(var(--destructive))]' : 'text-[hsl(var(--success))]'}`}>
              {formStatus.message}
            </p>
          )}
        </motion.form>
      </div>
    </Section>
  );
};

const Footer = React.memo(() => (
  <footer className="bg-[#18181b] text-white py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <p className="font-bold text-xl">&copy; {new Date().getFullYear()} Luminary Sites. All rights reserved.</p>
      <p className="mt-1 text-base">Serving Greensboro, Winston-Salem, High Point, Kernersville, Burlington, Thomasville, and the entire NC Triad.</p>
    </div>
  </footer>
));


// --- Main App Component ---

export default function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Set theme on initial load
    if (localStorage.getItem('theme') === 'light') {
      setTheme('light');
    }
    // Add a listener for theme changes from other tabs/windows
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(e.newValue);
      }
    });
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    // Calendly badge widget init
    if (window.Calendly) {
      window.Calendly.initBadgeWidget({
        url: 'https://calendly.com/perez122003',
        text: 'Schedule time with me',
        color: '#0069ff',
        textColor: '#ffffff',
        branding: true
      });
    } else {
      window.onload = function() {
        if (window.Calendly) {
          window.Calendly.initBadgeWidget({
            url: 'https://calendly.com/perez122003',
            text: 'Schedule time with me',
            color: '#0069ff',
            textColor: '#ffffff',
            branding: true
          });
        }
      };
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      // Adjust offset for mobile (larger header)
      const isMobile = window.innerWidth < 640;
      const headerOffset = isMobile ? 96 : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };


  return (
    <div className="bg-[hsl(var(--background))] font-sans transition-colors duration-300 relative">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Luminary Sites | Web Designer & Freelancer NC Triad (Greensboro, Winston-Salem, High Point)</title>
        <meta name="description" content="Luminary Sites: Award-winning web designer and freelance web developer for small businesses in Greensboro, Winston-Salem, High Point, Kernersville, Burlington, Thomasville, and the NC Triad. Custom websites, SEO, branding, and digital marketing for North Carolina businesses." />
        <meta name="keywords" content="web designer NC Triad, freelance web developer Greensboro, Winston-Salem web design, High Point web designer, Kernersville web design, Burlington NC web developer, Thomasville web design, small business websites NC, custom website designer Triad, NC web freelancer, web design agency NC Triad, web development North Carolina, digital marketing NC, SEO NC, branding NC, web design reviews, best web designer NC, local web designer, web design for restaurants, web design for services, web design for portfolio, web design for ecommerce, web design for small business, web design for startups, web design for professionals, web design for local business, web design for Triad, web design for Greensboro, web design for Winston-Salem, web design for High Point, web design for Kernersville, web design for Burlington, web design for Thomasville" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Luminary Sites" />
        <link rel="canonical" href="https://your-domain.com" />
        {/* Structured Data for LocalBusiness */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Luminary Sites",
            "image": "https://your-domain.com/logo.png",
            "@id": "https://your-domain.com",
            "url": "https://your-domain.com",
            "telephone": "",
            "email": "mailto:perez122003@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Greensboro",
              "addressRegion": "NC",
              "addressCountry": "US"
            },
            "areaServed": [
              { "@type": "City", "name": "Greensboro" },
              { "@type": "City", "name": "Winston-Salem" },
              { "@type": "City", "name": "High Point" },
              { "@type": "City", "name": "Kernersville" },
              { "@type": "City", "name": "Burlington" },
              { "@type": "City", "name": "Thomasville" }
            ],
            "description": "Award-winning web designer and freelance web developer for small businesses in the NC Triad. Specializing in custom websites, SEO, branding, and digital marketing.",
            "sameAs": [
              "https://www.linkedin.com/in/rogelioperezmontero/"
            ]
          })
        }} />
        {/* Calendly badge widget begin */}
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
        <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
        {/* Calendly badge widget end */}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com/" />
        <meta property="og:title" content="Luminary Sites | Web Designer & Freelancer NC Triad (Greensboro, Winston-Salem, High Point)" />
        <meta property="og:description" content="High-performance websites for small businesses in Greensboro, Winston-Salem, and High Point." />
        <meta property="og:image" content="https://your-domain.com/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://your-domain.com/" />
        <meta property="twitter:title" content="Luminary Sites | Web Designer & Freelancer NC Triad (Greensboro, Winston-Salem, High Point)" />
        <meta property="twitter:description" content="High-performance websites for small businesses in Greensboro, Winston-Salem, and High Point." />
        <meta property="twitter:image" content="https://your-domain.com/og-image.jpg" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Web Verse",
              "image": "https://your-domain.com/logo.png",
              "@id": "",
              "url": "https://your-domain.com",
              "telephone": "(336) 555-0100",
              "email": "mailto:contact@webverse.dev",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "",
                "addressLocality": "Greensboro",
                "addressRegion": "NC",
                "postalCode": "",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 36.0726,
                "longitude": -79.7920
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Greensboro"
                },
                {
                  "@type": "City",
                  "name": "Winston-Salem"
                },
                {
                  "@type": "City",
                  "name": "High Point"
                }
              ],
              "sameAs": [
                // "https://www.facebook.com/your-profile",
                // "https://www.twitter.com/your-profile",
                // "https://www.linkedin.com/in/your-profile"
              ]
            })
          }}
        />
      </Head>
      <Header handleScroll={handleScroll} theme={theme} toggleTheme={toggleTheme} />
      <main>
        <HeroSection handleScroll={handleScroll} theme={theme} />
        <AboutSection handleScroll={handleScroll} />

        {/* Suspense provides a fallback while lazy components load */}
        <Suspense fallback={<div className="text-center p-12">Loading sections...</div>}>
          <ResultsSection />
          <TemplateShowcase />
          <ProcessSection theme={theme} />
          <MaintenanceSection handleScroll={handleScroll} />
          <SuccessStoriesSection handleScroll={handleScroll} />
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
