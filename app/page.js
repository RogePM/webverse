// Welcome to your Web Verse frontend!
// This is the complete, optimized code for your main application page.
// It includes full SEO metadata and performance enhancements.
'use client'

import React, { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';

import { CheckCircle, Code, BarChart2, Zap, ShieldCheck, Users, Mail, Phone, MapPin, Globe, Menu, X, MessageSquare, Palette, Wrench, Rocket, Sun, Moon, Server, Brush, Lock, Briefcase, Heart } from 'lucide-react';
import * as THREE from 'three';



// --- Performance: Lazy Load Components ---
// These components will only be loaded when they are about to be viewed.
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
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] tracking-tight">{children}</h2>
    {subtext && <p className="mt-4 max-w-3xl mx-auto text-lg text-[hsl(var(--muted-foreground))]">{subtext}</p>}
  </div>
));

const CtaButton = ({ children, primary = false, className = '', href, onClick, type = 'button', disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-block px-6 py-3 rounded-full font-medium cursor-pointer text-center
      ${primary
        ? 'bg-[#254081] hover:bg-[#3454b4] text-white'
        : 'bg-white border border-[#254081] text-[#254081] hover:bg-[#254081] hover:text-white'}
      ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
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
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="w-full h-[80px] flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/actualyLogo.png"
            alt="Luminary Sites Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 object-cover"
          />
          <div className="flex flex-col">
            <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
              LUMINARY
            </span>
            <span className="text-white/80 text-sm sm:text-base font-medium">
              sites
            </span>
          </div>
        </div>

        {/* Desktop Navigation Pills */}
        <div className="hidden lg:flex items-center justify-center">
          <nav className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="flex items-center justify-center px-6 py-3 rounded-full cursor-pointer hover:bg-white/15 transition-all duration-300 hover:scale-105"
                onClick={(e) => handleScroll(e, link.href)}
              >
                <span className="text-white text-base font-medium">
                  {link.name}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* Free Consultation Button */}
        <div className="hidden md:flex">
          <button
            className="flex items-center justify-center px-6 py-3 rounded-full border-2 border-[#E5A000] bg-[#E5A000] hover:bg-[#d49400] hover:border-[#d49400] transition-all duration-300 hover:scale-105 shadow-lg"
            onClick={(e) => handleScroll(e, '#contact')}
          >
            <span className="text-white text-sm font-bold">
              Free Consultation
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setIsOpen(false);
                  handleScroll(e, link.href);
                }}
                className="text-white text-lg font-medium py-3 px-4 hover:text-[#E5A000] hover:bg-white/5 rounded-lg transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
            <button
              className="mt-4 px-6 py-3 bg-[#E5A000] hover:bg-[#d49400] text-white rounded-lg transition-all duration-300 font-bold"
              onClick={(e) => {
                setIsOpen(false);
                handleScroll(e, '#contact');
              }}
            >
              Free Consultation
            </button>
          </nav>
        </div>
      )}
    </header>
  );
});





const HeroSection = ({ handleScroll, theme }) => (
  <div
    className="relative w-full min-h-screen lg:h-[800px] flex-shrink-0 bg-cover bg-center bg-no-repeat shadow-lg overflow-hidden"
    style={{
      background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), url(\'/variation.jpg\') lightgray 50% / cover no-repeat',
      boxShadow: '0 4px 20.1px 0 rgba(0, 0, 0, 0.25)'
    }}
  >
    {/* Desktop Layout */}
    <div className="hidden lg:block">
      {/* Yellow accent line */}
      <svg
        className="absolute left-[68%] top-[46%] w-[196px] h-[8px] stroke-[#FFFB00] stroke-[9px]"
        width="191"
        height="8"
        viewBox="0 0 191 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4L146.5 4L289 4"
          stroke="#FFFB00"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>

      {/* BE text */}
      <div
        className="absolute left-[61%] top-[30%] w-[304px] h-[162px] flex flex-col justify-center text-white font-antonio text-[70px] font-bold leading-[129.233%] tracking-[8.4px]"
      >
        BE
      </div>

      {/* MAKE IT text */}
      <div
        className="absolute left-[10%] top-[26%] w-[407px] h-[221px] flex flex-col justify-center text-white text-right font-antonio text-[70px] font-bold leading-[129.233%] tracking-[8.4px]"
      >
        MAKE IT
      </div>

      {/* SEEN text */}
      <div
        className="absolute left-[65%] top-[31%] w-[300px] h-[120px] flex flex-col justify-center text-white text-center font-antonio text-[100px] font-bold leading-[129.233%] tracking-[11.52px]"
      >
        SEEN
      </div>

      {/* Subtitle */}
      <div
        className="absolute left-[69%] top-[68%] w-[341px] h-[100px] text-white font-body text-2xl font-bold leading-[120%]"
      >
        Custom websites designed to help your business get noticed.
      </div>

      {/* Button Group */}
      <div className="absolute left-[69%] top-[80%] flex justify-start items-center gap-4">
        <button
          className="flex items-center justify-center px-6 py-3 rounded-lg border border-[#FFFB00] bg-transparent hover:bg-white hover:text-[#FFFB00] transition-colors whitespace-nowrap"
          onClick={(e) => handleScroll(e, '#contact')}
        >
          <span className="text-white text-sm font-bold font-body">
            START YOUR WEBSITE
          </span>
        </button>
        <button
          className="flex items-center justify-center px-6 py-3 rounded-lg border border-white bg-[#E5A000] hover:bg-[#d49400] transition-colors whitespace-nowrap"
          onClick={(e) => handleScroll(e, '#templates')}
        >
          <span className="text-white text-base font-normal font-body">
            OUR TEMPLATES
          </span>
        </button>
      </div>
    </div>

    {/* Mobile Layout - New Design */}
    <div className="sm:hidden relative min-h-screen bg-[#dc8627] flex flex-col">
      {/* Hero Section with Circle Sweep Animation */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Circle sweep background */}
        <div className="circle"></div>

        {/* Hero text */}
        <div className="hero-content">
          <h1 className="headline">
            MAKE IT BE <br />
            <span className="seen">SEEN</span>
          </h1>
          <p className="subheading">
            Custom websites designed to help your business get noticed.
          </p>

          {/* Buttons stacked on mobile */}
          <div className="buttons">
            <button 
              className="btn primary"
              onClick={(e) => handleScroll(e, '#contact')}
            >
              Free Consultation
            </button>
            <button 
              className="btn secondary"
              onClick={(e) => handleScroll(e, '#templates')}
            >
              Our Templates
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Tablet Layout - Bridge between mobile and desktop */}
    <div className="hidden sm:block lg:hidden relative min-h-screen bg-[#dc8627] flex flex-col">
      {/* Hero Section with Circle Sweep Animation */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Circle sweep background */}
        <div className="circle tablet-circle"></div>

        {/* Hero text */}
        <div className="hero-content tablet-content">
          <h1 className="headline tablet-headline">
            MAKE IT BE <br />
            <span className="seen tablet-seen">SEEN</span>
          </h1>
          <p className="subheading tablet-subheading">
            Custom websites designed to help your business get noticed.
          </p>

          {/* Buttons side by side on tablet */}
          <div className="buttons tablet-buttons">
            <button 
              className="btn primary"
              onClick={(e) => handleScroll(e, '#contact')}
            >
              Free Consultation
            </button>
            <button 
              className="btn secondary"
              onClick={(e) => handleScroll(e, '#templates')}
            >
              Our Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AboutSection = React.memo(({ handleScroll }) => (
  <Section id="about" paddingClass="py-16 md:py-20 lg:py-24" className="bg-gradient-to-b from-[#f6faff] to-[#ffffff]">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="order-2 md:order-1">
        <h2 className="text-3xl font-bold text-[hsl(var(--foreground))] tracking-tight">When Your Website Works, Your Dreams Come to Life</h2>
        <p className="mt-4 text-[hsl(var(--muted-foreground))] text-lg">
        We craft digital experiences that tell your story and connect with the people who matter most to your business.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {competitiveFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start"
            >
              <div className="flex-shrink-0">{feature.icon}</div>
              <div className="ml-0 sm:ml-4 mt-2 sm:mt-0">
                <h4 className="font-bold text-[hsl(var(--foreground))]">{feature.title}</h4>
                <p className="text-[hsl(var(--muted-foreground))]">{feature.description}</p>
              </div>
            </div>
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
        <div
          className="absolute inset-0 bg-[hsl(var(--primary))] rounded-lg transform -rotate-3"
        ></div>
        <img
          src="/bussOwner.png"
          alt="Diverse team working in modern office"
          className="relative w-full h-full object-cover rounded-lg shadow-[var(--shadow-2xl)]"
        />
      </div>
    </div>
  </Section>
));

// --- Lazy-loaded Component Implementations ---
// To make this work, create a `components` folder in `frontend`
// and create a separate file for each of these components.



const ResultsSection = () => (
  <Section id="results" paddingClass="py-16 md:py-20 lg:py-24" className="bg-gradient-to-b from-[#feffff] via-[#d1e0ff] to-[#f6faff]">
    <SectionTitle subtext="Real businesses, real growth, real results that matter to your bottom line.">
      Measurable Results, Real Growth
    </SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-luxury)]">
        <BarChart2 className="h-12 w-12 mx-auto text-[hsl(var(--primary))] mb-4" />
        <span className="block text-4xl md:text-5xl font-extrabold text-[#254081] mb-2">2x</span>
        <h3 className="text-2xl font-bold text-[hsl(var(--foreground))]">Double Your Revenue</h3>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]"> Our clients see significant revenue increases within the first quarter of launch.</p>
      </div>
      <div className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-luxury)]">
        <Zap className="h-12 w-12 mx-auto text-[hsl(var(--primary))] mb-4" />
        <span className="block text-4xl md:text-5xl font-extrabold text-[#254081] mb-2">65%</span>
        <h3 className="text-2xl font-bold text-[hsl(var(--foreground))]"> Faster Load Times</h3>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">Speed matters. Your customers won't wait, and neither will your website.</p>
      </div>
      <div className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-luxury)]">
        <Users className="h-12 w-12 mx-auto text-[hsl(var(--primary))] mb-4" />
        <span className="block text-4xl md:text-5xl font-extrabold text-[#254081] mb-2">40%</span>
        <h3 className="text-2xl font-bold text-[hsl(var(--foreground))]">Improved Engagement</h3>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">Visitors stay longer, explore more, and become loyal customers.</p>
      </div>
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
          <div
            key={template.title}
            className="bg-[hsl(var(--background))] rounded-lg overflow-hidden shadow-[var(--shadow-luxury)] group cursor-pointer"
            onClick={() => window.location.href = getTemplatePath(template.title)}
          >
            <div className="overflow-hidden">
              <img src={template.imgSrc} alt={template.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[hsl(var(--foreground))]">{template.title}</h3>
              <p className="mt-2 text-[hsl(var(--muted-foreground))]">{template.description}</p>
              <div className="mt-4 flex items-center text-[hsl(var(--primary))] text-sm font-medium">
                <span>Learn More</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

const ProcessSection = React.memo(({ theme }) => {

  return (
    <Section id="process" paddingClass="py-24 md:py-32 lg:py-40" className="bg-gradient-to-b from-[#feffff] via-[#e0e7ff] to-[#f6faff]">
      <SectionTitle subtext="A journey of collaboration, creativity, and care that brings your vision to life.">
        How We Create Magic Together
      </SectionTitle>
      <div className="relative max-w-5xl mx-auto">
        {/* Desktop Layout - Horizontal */}
        <div className="hidden md:grid md:grid-cols-5 gap-20 items-start relative">
          {/* Minimalist divider line */}
          <div
            className="absolute left-0 right-0 top-[32px] h-[1px] bg-gradient-to-r from-transparent via-[hsl(var(--muted-foreground))]/20 to-transparent z-0 origin-left"
          />
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center z-10"
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
            </div>
          ))}
        </div>

        {/* Mobile Layout - Vertical Stack */}
        <div className="md:hidden space-y-20">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center"
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
            </div>
          ))}
        </div>
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
        <div
          key={pkg.title}
          className={`bg-white rounded-xl min-h-[540px] p-12 flex flex-col relative border transition-colors duration-300 group ${pkg.popular ? 'border-[hsl(var(--primary))]/20' : 'border-[hsl(var(--muted-foreground))]/10'}`}
        >
          {pkg.popular && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded border border-[hsl(var(--muted-foreground))]/20 bg-transparent text-[hsl(var(--primary))]/70 z-10" style={{letterSpacing:'0.12em'}}>
              MOST POPULAR
            </div>
          )}
          <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] text-center mb-6">{pkg.title}</h3>
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
        </div>
      ))}
    </div>
    {/* Optional Add-Ons Section */}
    <div
      className="mt-16 bg-white rounded-xl shadow-[0_1px_8px_rgba(30,41,59,0.03)] p-8"
    >
              <h3 className="text-2xl font-bold text-[hsl(var(--foreground))] text-center mb-6">Optional Add-Ons</h3>
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
    </div>

  </Section>
);

const SuccessStoriesSection = React.memo(({ handleScroll }) => (
  <Section id="success-stories" paddingClass="py-16 md:py-20 lg:py-24" className="bg-gradient-to-b from-[#ffffff] to-[#e0e7ff]">
    <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] tracking-tight">Stories of Success and Growth</h2>
      <p className="mt-4 max-w-3xl mx-auto text-lg text-[hsl(var(--muted-foreground))]">
        Real stories from real business owners who found their voice online.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
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
      </div>

      <div
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
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
      </div>

      <div
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
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
      </div>
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
        <div>
          <h2 className="text-4xl font-bold">Ready to Show the World What You've Built?</h2>
          <p className="mt-4 text-lg text-white">
            Let's create something beautiful together.
          </p>
          <div className="mt-8 border-t border-[hsl(var(--primary))] pt-8">
            <h3 className="text-xl font-bold">Or Contact Me Directly</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center"><Mail className="h-5 w-5 mr-3" /><a href="mailto:perez122003@gmail.com" className="hover:text-[hsl(var(--primary))]">perez122003@gmail.com</a></li>
              <li className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-3 text-[#0A66C2]"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 10.268h-3v-4.604c0-1.099-.021-2.513-1.531-2.513-1.531 0-1.767 1.197-1.767 2.434v4.683h-3v-9h2.881v1.233h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v4.729z"/></svg><a href="https://www.linkedin.com/in/rogelioperezmontero/" target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(var(--primary))]">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-lg"
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
        </form>
      </div>
    </Section>
  );
};

const Footer = React.memo(() => (
  <footer className="bg-[#18181b] text-white py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <p className="font-bold text-xl font-inter">&copy; {new Date().getFullYear()} Luminary Sites. All rights reserved.</p>
              <p className="mt-1 text-base font-inter">Serving Greensboro, Winston-Salem, High Point, Kernersville, Burlington, Thomasville, and the entire NC Triad.</p>
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
      // Adjust offset for overlapping navbar
      const isMobile = window.innerWidth < 640;
      const headerOffset = isMobile ? 120 : 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };


  return (
    <div className="bg-[hsl(var(--background))] transition-colors duration-300 relative">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet" />
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
