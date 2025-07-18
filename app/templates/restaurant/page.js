'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Utensils, Calendar, Phone, MapPin, Star, CheckCircle, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function RestaurantTemplate() {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    { icon: <Utensils className="h-6 w-6" />, title: "Menu Management", description: "Beautiful menu displays with categories, pricing, and dietary information" },
    { icon: <Calendar className="h-6 w-6" />, title: "Online Reservations", description: "Table booking system with real-time availability and confirmation" },
    { icon: <Phone className="h-6 w-6" />, title: "Online Ordering", description: "Food delivery and pickup ordering with payment integration" },
    { icon: <MapPin className="h-6 w-6" />, title: "Location & Hours", description: "Interactive maps, directions, and business hours display" },
    { icon: <Star className="h-6 w-6" />, title: "Customer Reviews", description: "Review system to showcase customer satisfaction and feedback" },
    { icon: <Users className="h-6 w-6" />, title: "Loyalty Program", description: "Customer rewards system to encourage repeat business" }
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
                Restaurant & Cafe
              </h1>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--primary))] text-[hsl(var(--background))] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-luxury font-bold mb-6">
              Restaurant & Cafe
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              An appetizing design with menu displays, online ordering integration, and reservation capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[hsl(var(--background))] text-[hsl(var(--accent))] px-8 py-3 rounded-lg font-semibold hover:bg-[hsl(var(--card))] transition-colors">
                View Live Demo
              </button>
              <button className="border-2 border-[hsl(var(--background))] text-[hsl(var(--background))] px-8 py-3 rounded-lg font-semibold hover:bg-[hsl(var(--background))] hover:text-[hsl(var(--accent))] transition-colors">
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
                    ? 'border-[hsl(var(--accent))] text-[hsl(var(--accent))]'
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
                Serve Up Success with Restaurant & Cafe Excellence
              </h3>
              <p className="text-lg text-[hsl(var(--muted-foreground))] mb-6">
                Our Restaurant & Cafe template is crafted for culinary businesses that want to showcase their 
                delicious offerings and streamline customer interactions. From fine dining to casual cafes, 
                this template brings your menu to life and makes ordering effortless.
              </p>
              <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8">
                Features include stunning menu displays, online reservation systems, delivery integration, 
                and customer loyalty programs designed to keep diners coming back for more.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] px-4 py-2 rounded-full text-sm font-medium">
                  Online Ordering
                </div>
                <div className="bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-4 py-2 rounded-full text-sm font-medium">
                  Table Reservations
                </div>
                <div className="bg-[hsl(var(--success-green))]/10 text-[hsl(var(--success-green))] px-4 py-2 rounded-full text-sm font-medium">
                  Menu Management
                </div>
              </div>
            </div>
            <div className="bg-[hsl(var(--card))] rounded-lg p-8">
              <img 
                src="https://placehold.co/600x400/4a5568/ffffff?text=Restaurant+Demo" 
                alt="Restaurant & Cafe Template Preview" 
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
              Delicious Features for Food Businesses
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
                  <div className="text-[hsl(var(--accent))] mb-4">
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
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Starter</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--accent))] mb-6">$2,200</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Menu display
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Contact information
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Mobile responsive
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--background))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--accent))]/80 transition-colors">
                  Choose Starter
                </button>
              </div>

              <div className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-tech)] border-2 border-[hsl(var(--accent))] relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--accent))] text-[hsl(var(--background))] px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Professional</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--accent))] mb-6">$3,800</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Everything in Starter
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Online reservations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Online ordering
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Customer reviews
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--background))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--accent))]/80 transition-colors">
                  Choose Professional
                </button>
              </div>

              <div className="bg-[hsl(var(--background))] p-8 rounded-lg shadow-[var(--shadow-luxury)]">
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Enterprise</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--accent))] mb-6">$6,200</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Everything in Professional
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Loyalty program
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Delivery integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success-green))] mr-3" />
                    Analytics dashboard
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--background))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--accent))]/80 transition-colors">
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
              We're working on an interactive demo of the Restaurant & Cafe template. 
              Check back soon to explore all the features in action!
            </p>
            <div className="bg-[hsl(var(--card))] rounded-lg p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🍽️</div>
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