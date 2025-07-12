// Welcome to your Web Verse frontend!
// This is the complete, optimized code for your main application page.
// It includes full SEO metadata and performance enhancements.
'use client'

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Code, BarChart2, Zap, ShieldCheck, Users, Mail, Phone, MapPin, Globe, Menu, X, MessageSquare, Palette, Wrench, Rocket, Sun, Moon, Server, Brush, Lock, Briefcase } from 'lucide-react';
import * as THREE from 'three';



// --- Performance: Lazy Load Components ---
// These components will only be loaded when they are about to be viewed.
// --- Lazy Load Components (in-file) ---
// Helper for viewport-based lazy loading of sections
function useInView(ref, rootMargin = '200px') {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

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
  { icon: <MessageSquare />, title: "1. Free Consultation", description: "We start with a conversation to understand your business, <strong>goals</strong>, and <strong>vision</strong>." },
  { icon: <Palette />, title: "2. Design & Prototype", description: "I create a <strong>visual blueprint</strong> and interactive prototype for your approval." },
  { icon: <Code />, title: "3. Development", description: "The approved design is brought to life with <strong>clean, efficient code</strong>." },
  { icon: <Wrench />, title: "4. Review & Revisions", description: "We'll review the site together and make any <strong>necessary tweaks</strong>." },
  { icon: <Rocket />, title: "5. Launch & Support", description: "Your site goes live! I'm here to support your site's <strong>growth and performance</strong> post-launch." },
];


const competitiveFeatures = [
  { icon: <Globe className="h-8 w-8 text-blue-500" />, title: "Trilingual Fluency", description: "Clear communication in English, Spanish, and French." },
  { icon: <ShieldCheck className="h-8 w-8 text-blue-500" />, title: "Cybersecurity Foundation", description: "Websites built with security as a priority, not an afterthought." },
  { icon: <BarChart2 className="h-8 w-8 text-blue-500" />, title: "Results-Driven", description: "Focused on features that directly contribute to your revenue." },
  { icon: <Zap className="h-8 w-8 text-blue-500" />, title: "Peak Performance", description: "Every site is fine-tuned for speed and responsiveness." },
];

const maintenancePackages = [
  {
    title: "Essential Care",
    price: "$75",
    period: "/mo",
    features: ["Core software updates", "Weekly backups", "Security monitoring", "Uptime monitoring"],
    cta: "Choose Essential",
  },
  {
    title: "Growth Partner",
    price: "$150",
    period: "/mo",
    features: ["All Essential features", "Monthly content updates (2 hours)", "Performance optimization", "Priority support"],
    cta: "Choose Growth",
    popular: true,
  },
  {
    title: "All-Inclusive",
    price: "$250",
    period: "/mo",
    features: ["All Growth features", "Unlimited small changes", "Monthly analytics report", "E-commerce support"],
    cta: "Choose All-Inclusive",
  },
];

const skills = [
  {
    category: "Programming & Frontend",
    icon: <Brush className="h-8 w-8 text-blue-500" />,
    items: ["JavaScript (ES6+)", "HTML5", "CSS3 / Tailwind", "React", "Next.js"]
  },
  {
    category: "Backend & Databases",
    icon: <Server className="h-8 w-8 text-blue-500" />,
    items: ["Node.js", "Python", "SQL", "MongoDB", "MERN Stack"]
  },
  {
    category: "Security & Networking",
    icon: <Lock className="h-8 w-8 text-blue-500" />,
    items: ["Network Security", "Kali Linux", "pfSense", "Metasploit", "Vercel Firewall"]
  },
  {
    category: "Tools & Platforms",
    icon: <Briefcase className="h-8 w-8 text-blue-500" />,
    items: ["Git / GitHub", "Vercel", "AWS / Azure", "Figma", "Tableau"]
  }
];

// --- Reusable Components ---

const Section = React.memo(({ children, className = '', id }) => (
  <section id={id} className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
));

const SectionTitle = React.memo(({ children, subtext }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">{children}</h2>
    {subtext && <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">{subtext}</p>}
  </div>
));

const CtaButton = ({ children, primary = false, className = '', href, onClick, type = 'button', disabled = false }) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    className={`inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer text-center ${primary
      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
      : 'bg-gray-700 hover:bg-gray-600 text-gray-200 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white'
      } ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" onClick={(e) => handleScroll(e, '#hero')} className="text-2xl font-bold text-gray-900 dark:text-white">
              Web <span className="text-blue-500">Verse</span>
            </a>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">

            <CtaButton href="#contact" onClick={(e) => handleScroll(e, '#contact')}>Free Consultation</CtaButton>
          </div>
          {/* Mobile Nav Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mr-2">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-100 dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
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
              className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg z-50 border-b border-gray-200 dark:border-gray-800"
            >
              <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      setIsOpen(false);
                      handleScroll(e, link.href);
                    }}
                    className="block px-6 py-4 text-lg text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="p-4">
                  <CtaButton
                    primary
                    className="w-full"
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


const HeroCanvas = React.memo(({ theme }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let animationFrameId;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 5000; // Optimized for performance
    const posArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 8;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.005,
    });

    const stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);

    camera.position.z = 2;

    const mouse = new THREE.Vector2();
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      stars.rotation.y = elapsedTime * 0.05;

      camera.position.x += (mouse.x * 0.2 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    const lightColor = new THREE.Color(0x4a5568);
    const darkColor = new THREE.Color(0xaaaaaa);
    starMaterial.color = theme === 'dark' ? darkColor : lightColor;

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      starGeo.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0" />;
});


const HeroSection = ({ handleScroll, theme }) => (
  <Section id="hero" className="relative bg-gray-100 dark:bg-gray-900 text-center !pt-24 !pb-32 overflow-hidden">
    <HeroCanvas theme={theme} />
    <div className="relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
          Websites That Don't Just Look Good—<span className="text-blue-500">They Perform.</span>
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
           I build fast, secure websites for businesses in the Triad that don’t just look great—they actually grow your business.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <CtaButton primary={true} href="#contact" onClick={(e) => handleScroll(e, '#contact')}>Get Your Free Consultation</CtaButton>
          <CtaButton href="#templates" onClick={(e) => handleScroll(e, '#templates')}>Explore Templates</CtaButton>
        </div>
      </motion.div>
    </div>
  </Section>
);

const AboutSection = React.memo(({ handleScroll }) => (
  <Section id="about" className="bg-white dark:bg-gray-800">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="order-2 md:order-1">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Tired of "Good Enough" Websites?</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
          Your website should be your hardest-working employee. I build sites that are unfair to your competition. Find another developer in NC who offers this, and I'll eat my tie.
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
                <h4 className="font-bold text-gray-800 dark:text-white">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10">
          <CtaButton href="#process" onClick={(e) => handleScroll(e, '#process')}>Discover Our Process</CtaButton>
        </div>
      </div>
      <div className="relative h-96 order-1 lg:order-2">
        <motion.div
          className="absolute inset-0 bg-blue-500 rounded-lg transform -rotate-3"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        ></motion.div>
        <motion.img
          src="https://placehold.co/500x400/1a202c/ffffff?text=Web+Verse"
          alt="Web Verse"
          className="relative w-full h-full object-cover rounded-lg shadow-2xl"
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

const ResultsSection = () => (
  <Section id="results" className="bg-gray-100 dark:bg-gray-900">
    <SectionTitle subtext="My mission is to deliver tangible results that impact your bottom line.">
      Measurable Results, Real Growth
    </SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <motion.div
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <BarChart2 className="h-12 w-12 mx-auto text-blue-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Double Your Revenue</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">My primary goal is to build a web presence that can effectively double your earnings through increased sales and lead generation.</p>
      </motion.div>
      <motion.div
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Zap className="h-12 w-12 mx-auto text-blue-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">50% Faster Load Times</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">A faster website means better user experience and improved SEO. I optimize every site for peak performance.</p>
      </motion.div>
      <motion.div
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Users className="h-12 w-12 mx-auto text-blue-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">40% Improved Engagement</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">By focusing on intuitive design and user flow, we can significantly increase how long visitors stay and interact with your site.</p>
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
    <Section id="templates" className="bg-white dark:bg-gray-800">
      <SectionTitle subtext="Explore a universe of possibilities. Each template is a starting point for your unique brand.">
        Website Templates & Protocols
      </SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {templates.map((template, index) => (
          <motion.div
            key={template.title}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg group cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px 0 rgba(0,0,0,0.15)' }}
            onClick={() => window.location.href = getTemplatePath(template.title)}
          >
            <div className="overflow-hidden">
              <img src={template.imgSrc} alt={template.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{template.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{template.description}</p>
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
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
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Section id="process" className="bg-gray-100 dark:bg-gray-900">
      <SectionTitle subtext="A clear, collaborative, and efficient path to your new website.">
        How It Works: Our Seamless Process
      </SectionTitle>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 items-start"
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
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <motion.div
              className="h-24 w-24 mb-4 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-blue-500 transition-all duration-300"
              animate={{
                borderColor: hoveredIndex === index ? '#3b82f6' : (theme === 'dark' ? '#374151' : '#e5e7eb'),
                scale: hoveredIndex === index ? 1.1 : 1,
              }}
            >
              {React.cloneElement(
                step.icon,
                {
                  className: [
                    step.icon.props.className || "",
                    "h-12 w-12"
                  ].join(" ").trim()
                }
              )}
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: step.description }}></p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
});


const MaintenanceSection = ({ handleScroll }) => (
  <Section id="services" className="bg-white dark:bg-gray-800">
    <SectionTitle subtext="Keep your website secure, fast, and up-to-date with our affordable monthly packages.">
      Maintenance & Support
    </SectionTitle>
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
      {maintenancePackages.map((pkg, index) => (
        <motion.div
          key={pkg.title}
          className={`bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg p-8 flex flex-col relative transition-transform duration-300 border-2 ${pkg.popular ? 'border-blue-500' : 'border-transparent'}`}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 40px 0 rgba(59,130,246,0.15)' }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.1 }}
        >
          {pkg.popular && (
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
          )}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{pkg.title}</h3>
          <div className="my-6 text-center">
            <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{pkg.price}</span>
            <span className="text-gray-500 dark:text-gray-400 font-medium">{pkg.period}</span>
          </div>
          <ul className="space-y-4 text-gray-600 dark:text-gray-300 flex-grow">
            {pkg.features.map(feature => (
              <li key={feature} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <CtaButton
              primary={pkg.popular}
              className="w-full"
              onClick={e => handleScroll(e, '#contact')}
            >
              {pkg.cta}
            </CtaButton>
          </div>
        </motion.div>
      ))}

    </div>
  </Section>
);


const SkillsSection = () => (
  <Section id="skills" className="bg-gray-100 dark:bg-gray-900">
    <SectionTitle subtext="The technical foundation for building powerful and secure web solutions.">
      Skills & Expertise
    </SectionTitle>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {skills.map((skillCategory, index) => (
        <motion.div
          key={skillCategory.category}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="flex items-center mb-4">
            {skillCategory.icon}
            <h3 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">{skillCategory.category}</h3>
          </div>
          <ul className="space-y-2">
            {skillCategory.items.map(item => (
              <li key={item} className="flex items-center text-gray-600 dark:text-gray-300">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  </Section>
);

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

  const exampleMessage = "Hi, I'm looking for a new website for my business, [Your Business Name]. We're in the [Your Industry] industry and want to [Your Goal, e.g., increase online sales, get more local customers]. Let's schedule a time to talk.";

  return (
    <Section id="contact" className="bg-white dark:bg-gray-800">
      <div className="bg-blue-600 rounded-lg p-8 md:p-16 grid lg:grid-cols-2 gap-12 items-center text-white">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold">Let’s Solve Your Website Challenges</h2>
          <p className="mt-4 text-lg text-blue-100">
            Ready to see how a custom website can transform your business? Fill out the form to book your free, no-obligation consultation.
          </p>
          <div className="mt-8 border-t border-blue-500 pt-8">
            <h3 className="text-xl font-bold">Or Contact Me Directly</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center"><Mail className="h-5 w-5 mr-3" /><a href="mailto:perez122003@gmail.com" className="hover:text-blue-200">perez122003@gmail.com</a></li>
              <li className="flex items-center"><Phone className="h-5 w-5 mr-3" /><a href="tel:+1-336-555-0100" className="hover:text-blue-200">(336) 555-0100</a></li>
            </ul>
          </div>
        </motion.div>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/10 p-8 rounded-lg"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input type="text" name="name" id="name" required placeholder="Your Name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border-transparent text-white placeholder-blue-100 focus:ring-2 focus:ring-white focus:bg-white/30" />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input type="email" name="email" id="email" required placeholder="Your Email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border-transparent text-white placeholder-blue-100 focus:ring-2 focus:ring-white focus:bg-white/30" />
          </div>
          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea name="message" id="message" rows="5" required placeholder={exampleMessage} value={formData.message} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border-transparent text-white placeholder-blue-100 focus:ring-2 focus:ring-white focus:bg-white/30"></textarea>
          </div>
          <div>
            <CtaButton type="submit" className="w-full bg-white text-blue-600 hover:bg-gray-100" disabled={formStatus.submitting}>
              {formStatus.submitting ? 'Sending...' : 'Book My Free Consultation'}
            </CtaButton>
          </div>
          {formStatus.message && (
            <p className={`text-center ${formStatus.error ? 'text-red-300' : 'text-green-300'}`}>
              {formStatus.message}
            </p>
          )}
        </motion.form>
      </div>
    </Section>
  );
};

const Footer = React.memo(() => (
  <footer className="bg-gray-800 dark:bg-black text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <p>&copy; {new Date().getFullYear()} Web Verse. All rights reserved.</p>
      <p className="mt-1">Serving Greensboro, Winston-Salem, High Point, and the NC Triad.</p>
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
    <div className="bg-white dark:bg-gray-900 font-sans transition-colors duration-300">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Web Verse | Custom Web Development for NC Triad Businesses</title>
        <meta name="description" content="Web Verse builds high-performance, custom websites for small businesses in Greensboro, Winston-Salem, and High Point, NC. Specializing in web development that boosts revenue and engagement." />
        <meta name="keywords" content="web design greensboro nc, web development triad, small business website north carolina, custom website development, freelance web developer nc, high point web design, winston-salem web developer" />
        <meta name="author" content="Web Verse" />
        <link rel="canonical" href="https://your-domain.com" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com/" />
        <meta property="og:title" content="Web Verse | Custom Web Development for NC Triad Businesses" />
        <meta property="og:description" content="High-performance websites for small businesses in Greensboro, Winston-Salem, and High Point." />
        <meta property="og:image" content="https://your-domain.com/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://your-domain.com/" />
        <meta property="twitter:title" content="Web Verse | Custom Web Development for NC Triad Businesses" />
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
          <SkillsSection />
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
