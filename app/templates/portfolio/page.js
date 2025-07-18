'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Image, Video, FileText, Star, CheckCircle, Eye, Download, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function PortfolioTemplate() {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    { icon: <Image className="h-6 w-6" />, title: "Gallery Showcase", description: "Stunning image galleries with lightbox effects and filtering options" },
    { icon: <Video className="h-6 w-6" />, title: "Video Portfolio", description: "Video project showcases with embedded players and descriptions" },
    { icon: <FileText className="h-6 w-6" />, title: "Project Details", description: "Detailed project pages with case studies and process breakdowns" },
    { icon: <Star className="h-6 w-6" />, title: "Client Testimonials", description: "Professional testimonial system to build credibility" },
    { icon: <Eye className="h-6 w-6" />, title: "Analytics Tracking", description: "Track visitor engagement and portfolio performance metrics" },
    { icon: <Download className="h-6 w-6" />, title: "Resume Download", description: "Professional resume/CV download with contact information" }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'demo', label: 'Live Demo' }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--card))]">
      {/* Header */}
      <header className="bg-[hsl(var(--background))] shadow-[var(--shadow-luxury)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))]">
                Portfolio Showcase
              </h1>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-[hsl(var(--background))] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-luxury font-bold mb-6">
              Portfolio Showcase
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              A visually stunning template for creatives to display their work with elegance and impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[hsl(var(--background))] text-[hsl(var(--primary))] px-8 py-3 rounded-lg font-semibold hover:bg-[hsl(var(--card))] transition-colors">
                View Live Demo
              </button>
              <button className="border-2 border-[hsl(var(--background))] text-[hsl(var(--background))] px-8 py-3 rounded-lg font-semibold hover:bg-[hsl(var(--background))] hover:text-[hsl(var(--primary))] transition-colors">
                Get Started
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-[hsl(var(--background))] border-b border-[hsl(var(--muted-foreground))]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                    : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h3 className="text-3xl font-luxury font-bold text-[hsl(var(--foreground))] mb-6">
                Showcase Your Creative Vision with Portfolio Excellence
              </h3>
              <p className="text-lg text-[hsl(var(--muted-foreground))] mb-6">
                Our Portfolio Showcase template is designed for creatives, designers, photographers, and artists 
                who want to present their work in the most compelling way possible. With stunning visual layouts, 
                smooth animations, and professional presentation, your portfolio will stand out from the crowd.
              </p>
              <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8">
                Features include responsive galleries, project case studies, client testimonials, and integrated 
                contact forms to help you land your next big opportunity.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-4 py-2 rounded-full text-sm font-medium">
                  Image Galleries
                </div>
                <div className="bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] px-4 py-2 rounded-full text-sm font-medium">
                  Video Showcase
                </div>
                <div className="bg-[hsl(var(--tech-cyan))]/10 text-[hsl(var(--tech-cyan))] px-4 py-2 rounded-full text-sm font-medium">
                  Case Studies
                </div>
              </div>
            </div>
            <div className="bg-[hsl(var(--card))] rounded-lg p-8">
              <img 
                src="https://placehold.co/600x400/718096/ffffff?text=Portfolio+Demo" 
                alt="Portfolio Showcase Template Preview" 
                className="w-full rounded-lg shadow-[var(--shadow-lg)]"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'features' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-luxury font-bold text-[hsl(var(--foreground))] mb-12 text-center">
              Creative Features for Portfolio Excellence
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[hsl(var(--background))] p-6 rounded-lg shadow-[var(--shadow-luxury)] hover:shadow-[var(--shadow-tech)] transition-shadow"
                >
                  <div className="text-[hsl(var(--primary))] mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-[hsl(var(--muted-foreground))]">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'pricing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h3 className="text-3xl font-luxury font-bold text-[hsl(var(--foreground))] mb-12">
              Pricing Plans
            </h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-luxury)]">
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Creative</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--primary))] mb-6">$1,500</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Image gallery
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    About section
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Contact form
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--background))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--primary))]/80 transition-colors">
                  Choose Creative
                </button>
              </div>

              <div className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-tech)] border-2 border-[hsl(var(--primary))] relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--primary))] text-[hsl(var(--background))] px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Professional</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--primary))] mb-6">$2,800</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Everything in Creative
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Video showcase
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Project case studies
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Client testimonials
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--background))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--primary))]/80 transition-colors">
                  Choose Professional
                </button>
              </div>

              <div className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-luxury)]">
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Enterprise</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--primary))] mb-6">$4,200</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Everything in Professional
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Blog integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    E-commerce gallery
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Custom animations
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--background))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--primary))]/80 transition-colors">
                  Choose Enterprise
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'demo' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h3 className="text-3xl font-luxury font-bold text-[hsl(var(--foreground))] mb-8">
              Live Demo Coming Soon
            </h3>
            <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8">
              We're working on an interactive demo of the Portfolio Showcase template. 
              Check back soon to explore all the features in action!
            </p>
            <div className="bg-[hsl(var(--card))] rounded-lg p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-[hsl(var(--muted-foreground))">
                Interactive demo will be available here
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 