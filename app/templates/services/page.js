'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users, MessageSquare, FileText, Star, CheckCircle, Clock, Award } from 'lucide-react';
import Link from 'next/link';

export default function ServicesTemplate() {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    { icon: <Calendar className="h-6 w-6" />, title: "Appointment Booking", description: "Seamless scheduling system with calendar integration and automated reminders" },
    { icon: <Users className="h-6 w-6" />, title: "Client Management", description: "Comprehensive client database with profiles, history, and communication logs" },
    { icon: <MessageSquare className="h-6 w-6" />, title: "Lead Generation", description: "Contact forms, landing pages, and lead nurturing automation" },
    { icon: <FileText className="h-6 w-6" />, title: "Service Showcase", description: "Professional service presentation with pricing and detailed descriptions" },
    { icon: <Star className="h-6 w-6" />, title: "Testimonials", description: "Client feedback system to build credibility and trust" },
    { icon: <Award className="h-6 w-6" />, title: "Portfolio Gallery", description: "Showcase your best work with before/after comparisons and case studies" }
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
      <header className="bg-[hsl(var(--background))] shadow-[var(--shadow-sm)]">
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
                Service-Based Business
              </h1>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(var(--success-green))] to-[hsl(var(--tech-cyan))] text-[hsl(var(--background))] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-luxury font-bold mb-6">
              Service-Based Business
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Showcase your services, book appointments, and generate leads with this professional template.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[hsl(var(--background))] text-[hsl(var(--success-green))] px-8 py-3 rounded-lg font-semibold hover:bg-[hsl(var(--card))] transition-colors">
                View Live Demo
              </button>
              <button className="border-2 border-[hsl(var(--background))] text-[hsl(var(--background))] px-8 py-3 rounded-lg font-semibold hover:bg-[hsl(var(--background))] hover:text-[hsl(var(--success-green))] transition-colors">
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
                    ? 'border-[hsl(var(--success-green))] text-[hsl(var(--success-green))]'
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
                Elevate Your Service Business Online
              </h3>
              <p className="text-lg text-[hsl(var(--muted-foreground))] mb-6">
                Our Service-Based Business template is designed for professionals who want to showcase their expertise, 
                streamline client interactions, and grow their business through effective online presence. 
                From consultants to contractors, this template adapts to your unique service offerings.
              </p>
              <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8">
                Built with conversion optimization in mind, featuring appointment booking, lead capture forms, 
                and professional service presentations that convert visitors into paying clients.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-[hsl(var(--success-green))]/10 text-[hsl(var(--success-green))] px-4 py-2 rounded-full text-sm font-medium">
                  Appointment Booking
                </div>
                <div className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-4 py-2 rounded-full text-sm font-medium">
                  Lead Generation
                </div>
                <div className="bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] px-4 py-2 rounded-full text-sm font-medium">
                  Client Portal
                </div>
              </div>
            </div>
            <div className="bg-[hsl(var(--card))] rounded-lg p-8">
              <img 
                src="https://placehold.co/600x400/2d3748/ffffff?text=Services+Demo" 
                alt="Service-Based Business Template Preview" 
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
              Professional Features for Service Businesses
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
                  <div className="text-[hsl(var(--success-green))] mb-4">
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
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Basic</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--success-green))] mb-6">$1,800</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Service showcase
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Contact forms
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Mobile responsive
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--success-green))] text-[hsl(var(--background))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--success-green))]/80 transition-colors">
                  Choose Basic
                </button>
              </div>

              <div className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-tech)] border-2 border-[hsl(var(--success-green))] relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--success-green))] text-[hsl(var(--background))] px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Professional</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--success-green))] mb-6">$3,200</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Everything in Basic
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Appointment booking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Client portal
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Portfolio gallery
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--success-green))] text-[hsl(var(--background))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--success-green))]/80 transition-colors">
                  Choose Professional
                </button>
              </div>

              <div className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-luxury)]">
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Enterprise</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--success-green))] mb-6">$5,500</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Everything in Professional
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    CRM integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Custom workflows
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--success-green))] text-[hsl(var(--background))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--success-green))]/80 transition-colors">
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
              We're working on an interactive demo of the Service-Based Business template. 
              Check back soon to explore all the features in action!
            </p>
            <div className="bg-[hsl(var(--card))] rounded-lg p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">💼</div>
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