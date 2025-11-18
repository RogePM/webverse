'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

// --- Icon Components ---
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.65-3.657-11.303-8.354l-6.571,4.819C9.656,39.663,16.318,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.23-2.22,4.143-4.162,5.571l6.19,5.238C42.012,35.319,44,30.02,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const LogoIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3z" />
  </svg>
);

const ChevronDownIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const sliderImages = [
    'https://images.unsplash.com/flagged/photo-1553264751-a32acf0c1a37?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1588541550705-b37e20139fc6?q=80&w=1170&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1575467678930-c7acd65d6470?q=80&w=1170&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'For small food banks just getting started.',
      features: ['Up to 50 items', 'Basic inventory tracking', '1 user account'],
      buttonText: 'Get Started',
      buttonClass: 'w-full bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100',
    },
    {
      name: 'Pro',
      price: '$49',
      description: 'For growing organizations that need more power.',
      features: ['Unlimited items', 'Advanced inventory tracking', 'Up to 10 user accounts', 'Volunteer management'],
      buttonText: 'Try Pro Free',
      buttonClass: 'w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large-scale operations and networks.',
      features: ['Everything in Pro', 'Multiple warehouse support', 'Dedicated support', 'Custom integrations'],
      buttonText: 'Contact Sales',
      buttonClass: 'w-full bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100',
    },
  ];

  const faqs = [
    {
      question: 'What is FoodBank Admin?',
      answer: 'FoodBank Admin is a cloud-based inventory management system designed specifically for the needs of food banks and pantries. It helps you track donations, manage stock, and coordinate volunteers.',
    },
    {
      question: 'Is it hard to set up?',
      answer: 'Not at all. You can sign up and start adding items in just a few minutes. The interface is designed to be intuitive and requires minimal training.',
    },
    {
      question: 'Can I use this on my phone or tablet?',
      answer: 'Yes, the application is fully responsive and works on all modern devices, including phones and tablets. You can manage your inventory from anywhere.',
    },
    {
      question: 'What if I need help?',
      answer: 'We offer email support for all plans. Pro and Enterprise plans include priority support and dedicated account management to help you succeed.',
    },
  ];

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [supabase, router]);

  // Image slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <LogoIcon className="w-8 h-8 text-black" />
            <span className="text-xl font-bold text-black">FoodBank Admin</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-black">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-black">Pricing</a>
            <a href="#faq" className="text-gray-600 hover:text-black">FAQ</a>
            <a href="#footer" className="text-gray-600 hover:text-black">Contact</a>
          </div>
          <button onClick={handleSignIn} className="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-black">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-24 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
          {/* Left Column */}
          <div className="flex flex-col">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-black">
              Start managing.
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The all-in-one inventory solution for modern food banks.
            </p>

            {/* Sign-in Form */}
            <div className="w-full max-w-md space-y-4">
              <button onClick={handleSignIn} className="w-full bg-white text-gray-800 font-semibold py-3 rounded-lg flex items-center justify-center space-x-3 border border-gray-300 hover:bg-gray-100 transition-colors">
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center space-x-4">
                <hr className="w-full border-gray-300" />
                <span className="text-gray-500 text-sm">OR</span>
                <hr className="w-full border-gray-300" />
              </div>

              <input type="email" placeholder="Enter your email" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button className="w-full bg-gray-800 text-white font-semibold py-3 rounded-lg hover:bg-black transition-colors">
                Continue with email
              </button>

              <p className="text-xs text-gray-500 text-center pt-2">
                By continuing, you acknowledge you've read and agree to our
                <a href="#" className="underline"> Privacy Policy</a> and
                <a href="#" className="underline"> Terms of Service</a>.
              </p>
            </div>
          </div>

          {/* Right Column - Image Slider */}
          <div className="hidden md:block relative h-[70vh] max-h-[800px] shadow-xl rounded-xl">
            <div className="relative w-full h-full overflow-hidden rounded-xl">
              {sliderImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`Food bank slider image ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black">
              Meet your new dashboard
            </h2>
            <p className="text-lg text-gray-600 mt-4">
              A central hub for your entire operation. See what's in stock, manage distributions, and coordinate volunteers, all from one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-lg">
              <img src="https://placehold.co/600x400/F3F4F6/6B7280?text=App+Screenshot" alt="Dashboard screenshot" className="rounded-lg object-cover w-full" />
            </div>
            <ul className="space-y-6 text-lg">
              <li className="flex items-start space-x-3">
                <CheckIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  <span className="font-semibold text-black">Track inventory with ease.</span> Log donations and distributions in real-time.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <CheckIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  <span className="font-semibold text-black">Visualize your data.</span> Understand inventory trends with simple charts.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <CheckIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  <span className="font-semibold text-black">Coordinate volunteers.</span> Manage schedules and tasks with a shared calendar.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-black">Find the right plan</h2>
            <p className="text-lg text-gray-600 mt-4">Start for free, and scale as you grow. All plans are flexible.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`border rounded-lg p-8 flex flex-col ${plan.name === 'Pro' ? 'border-gray-800 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                <h3 className="text-2xl font-semibold text-black">{plan.name}</h3>
                <p className="text-4xl font-bold tracking-tight text-black mt-2">
                  {plan.price}
                  {plan.name !== 'Enterprise' && <span className="text-base font-normal text-gray-600">/mo</span>}
                </p>
                <p className="text-gray-600 mt-4">{plan.description}</p>
                <ul className="space-y-3 text-gray-700 mt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3">
                      <CheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={handleSignIn} className={`${plan.buttonClass} mt-auto pt-4`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl font-bold tracking-tighter text-black text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg">
                <button onClick={() => toggleFAQ(index)} className="flex justify-between items-center w-full p-6 text-left">
                  <span className="text-lg font-semibold text-black">{faq.question}</span>
                  <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform ${openFAQIndex === index ? 'rotate-180' : ''}`} />
                </button>
                {openFAQIndex === index && <div className="px-6 pb-6 text-gray-700">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2">
              <LogoIcon className="w-8 h-8 text-black" />
              <span className="text-xl font-bold text-black">FoodBank Admin</span>
            </div>
            <p className="text-gray-500 mt-2 text-sm">© 2025 All rights reserved.</p>
          </div>
          <div>
            <h4 className="font-semibold text-black mb-3">Product</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="#pricing" className="hover:underline">Pricing</a></li>
              <li><a href="#" className="hover:underline">Updates</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-black mb-3">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-black mb-3">Resources</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:underline">Support</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-black mb-3">Legal</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:underline">Privacy</a></li>
              <li><a href="#" className="hover:underline">Terms</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}