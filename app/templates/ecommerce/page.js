'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, CreditCard, Truck, Shield, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function EcommerceTemplate() {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    { icon: <ShoppingCart className="h-6 w-6" />, title: "Product Catalog", description: "Comprehensive product management with categories, variants, and inventory tracking" },
    { icon: <CreditCard className="h-6 w-6" />, title: "Secure Payments", description: "Multiple payment gateways with PCI compliance and fraud protection" },
    { icon: <Truck className="h-6 w-6" />, title: "Order Management", description: "Complete order lifecycle from cart to delivery with tracking" },
    { icon: <Shield className="h-6 w-6" />, title: "Customer Accounts", description: "User registration, profiles, order history, and wishlists" },
    { icon: <Star className="h-6 w-6" />, title: "Reviews & Ratings", description: "Customer feedback system to build trust and improve products" },
    { icon: <CheckCircle className="h-6 w-6" />, title: "Analytics Dashboard", description: "Sales reports, customer insights, and performance metrics" }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'demo', label: 'Live Demo' }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="bg-[hsl(var(--card))] shadow-[var(--shadow-sm)]">
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
                E-commerce Excellence
              </h1>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-[hsl(var(--primary-foreground))] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-luxury font-bold mb-6">
              E-commerce Excellence
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              A robust and scalable online store solution, designed to maximize sales and user experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/templates/ecommerce/demo" className="bg-[hsl(var(--background))] text-[hsl(var(--primary))] px-8 py-3 rounded-lg font-semibold hover:bg-[hsl(var(--muted))] transition-colors">
                View Live Demo
              </Link>
              <Link href="/" className="border-2 border-[hsl(var(--primary-foreground))] text-[hsl(var(--primary-foreground))] px-8 py-3 rounded-lg font-semibold hover:bg-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--primary))] transition-colors">
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))]">
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
                Transform Your Business with E-commerce Excellence
              </h3>
              <p className="text-lg text-[hsl(var(--muted-foreground))] mb-6">
                Our E-commerce Excellence template is built for businesses ready to dominate the digital marketplace. 
                With cutting-edge features, seamless user experience, and powerful analytics, you'll have everything 
                needed to drive sales and grow your online presence.
              </p>
              <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8">
                From product management to customer retention, every aspect is designed with conversion optimization 
                in mind. Mobile-responsive, SEO-optimized, and scalable for your business growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] px-4 py-2 rounded-full text-sm font-medium">
                  Mobile-First Design
                </div>
                <div className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded-full text-sm font-medium">
                  SEO Optimized
                </div>
                <div className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-4 py-2 rounded-full text-sm font-medium">
                  Payment Gateway Ready
                </div>
              </div>
            </div>
            <div className="bg-[hsl(var(--muted))] rounded-lg p-8">
              <img 
                src="/AetherDemo.png" 
                alt="E-commerce Template Preview" 
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
              Powerful Features for Modern E-commerce
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[hsl(var(--card))] p-6 rounded-lg shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-shadow"
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
              <div className="bg-[hsl(var(--card))] p-8 rounded-lg shadow-[var(--shadow-md)]">
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Starter</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--primary))] mb-6">$2,500</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mr-3" />
                    Basic product catalog
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mr-3" />
                    Payment integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mr-3" />
                    Mobile responsive
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--primary-hover))] transition-colors">
                  Choose Starter
                </button>
              </div>

              <div className="bg-[hsl(var(--card))] p-8 rounded-lg shadow-[var(--shadow-lg)] border-2 border-[hsl(var(--primary))] relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Professional</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--primary))] mb-6">$4,500</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mr-3" />
                    Everything in Starter
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mr-3" />
                    Customer reviews
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mr-3" />
                    Inventory management
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--primary-hover))] transition-colors">
                  Choose Professional
                </button>
              </div>

              <div className="bg-[hsl(var(--card))] p-8 rounded-lg shadow-[var(--shadow-md)]">
                <h4 className="text-2xl font-luxury font-bold text-[hsl(var(--foreground))] mb-4">Enterprise</h4>
                <div className="text-4xl font-luxury font-bold text-[hsl(var(--primary))] mb-6">$8,500</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mr-3" />
                    Everything in Professional
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mr-3" />
                    Multi-vendor support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mr-3" />
                    Advanced SEO tools
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] mr-3" />
                    Custom integrations
                  </li>
                </ul>
                <button className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 rounded-lg font-semibold hover:bg-[hsl(var(--primary-hover))] transition-colors">
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
              Live E-commerce Demo
            </h3>
            <p className="text-lg text-[hsl(var(--muted-foreground))] mb-8">
              Experience our luxury e-commerce template in action. This demo showcases a complete 
              online store with product catalog, shopping cart, and elegant design.
            </p>
            <div className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] rounded-lg p-12 max-w-2xl mx-auto text-[hsl(var(--primary-foreground))]">
              <div className="text-6xl mb-4">🛒</div>
              <h4 className="text-2xl font-bold mb-4">AETHER Luxury Store</h4>
              <p className="text-lg mb-8 text-[hsl(var(--primary-foreground))] opacity-80">
                A sophisticated e-commerce experience with luxury products, 
                smooth animations, and professional design.
              </p>
              <Link 
                href="/templates/ecommerce/demo" 
                className="inline-block bg-[hsl(var(--background))] text-[hsl(var(--primary))] px-8 py-4 rounded-lg font-semibold hover:bg-[hsl(var(--muted))] transition-colors"
              >
                Launch Live Demo
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 