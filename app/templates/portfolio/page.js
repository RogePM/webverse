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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Portfolio Showcase
              </h1>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Portfolio Showcase
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              A visually stunning template for creatives to display their work with elegance and impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                View Live Demo
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Get Started
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
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
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Showcase Your Creative Vision with Portfolio Excellence
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Our Portfolio Showcase template is designed for creatives, designers, photographers, and artists 
                who want to present their work in the most compelling way possible. With stunning visual layouts, 
                smooth animations, and professional presentation, your portfolio will stand out from the crowd.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Features include responsive galleries, project case studies, client testimonials, and integrated 
                contact forms to help you land your next big opportunity.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full text-sm font-medium">
                  Image Galleries
                </div>
                <div className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-4 py-2 rounded-full text-sm font-medium">
                  Video Showcase
                </div>
                <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-4 py-2 rounded-full text-sm font-medium">
                  Case Studies
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8">
              <img 
                src="https://placehold.co/600x400/718096/ffffff?text=Portfolio+Demo" 
                alt="Portfolio Showcase Template Preview" 
                className="w-full rounded-lg shadow-lg"
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
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Creative Features for Portfolio Excellence
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-purple-600 dark:text-purple-400 mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
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
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
              Pricing Plans
            </h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Creative</h4>
                <div className="text-4xl font-bold text-purple-600 mb-6">$1,500</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Image gallery
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    About section
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Contact form
                  </li>
                </ul>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Choose Creative
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border-2 border-purple-500 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Professional</h4>
                <div className="text-4xl font-bold text-purple-600 mb-6">$2,800</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Everything in Creative
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Video showcase
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Project case studies
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Client testimonials
                  </li>
                </ul>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Choose Professional
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Premium</h4>
                <div className="text-4xl font-bold text-purple-600 mb-6">$4,200</div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Everything in Professional
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Blog integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    E-commerce gallery
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Custom animations
                  </li>
                </ul>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Choose Premium
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
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Live Demo Coming Soon
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              We're working on an interactive demo of the Portfolio Showcase template. 
              Check back soon to explore all the features in action!
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-gray-600 dark:text-gray-400">
                Interactive demo will be available here
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 