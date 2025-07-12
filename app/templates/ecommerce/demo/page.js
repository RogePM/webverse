'use client'

// Welcome to your Gucci-Inspired Luxury Template!
// This version features a faster intro, new product sections, and a refined layout
// for a complete and engaging high-fashion e-commerce experience.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { ShoppingCart, Search, Menu, X, Plus, Minus, ChevronRight, ArrowDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA FOR LUXURY PRODUCTS ---
const mockProducts = [
  {
    id: 1,
    name: 'The Chronos Watch',
    price: 1850,
    category: 'Timepieces',
    image: 'https://placehold.co/600x750/1a202c/ffffff?text=Chronos',
  },
  {
    id: 2,
    name: 'Aura Silk Scarf',
    price: 420,
    category: 'Accessories',
    image: 'https://placehold.co/600x750/c2a68d/ffffff?text=Aura',
  },
  {
    id: 3,
    name: 'Noir Eau de Parfum',
    price: 275,
    category: 'Fragrance',
    image: 'https://placehold.co/600x750/333333/ffffff?text=Noir',
  },
  {
    id: 4,
    name: 'Origin Leather Tote',
    price: 1250,
    category: 'Leather Goods',
    image: 'https://placehold.co/600x750/8a7d6c/ffffff?text=Origin',
  },
];

const trendingProducts = [
    { id: 5, name: 'Speedy Soft 30 Lucky', price: 3400, image: 'https://placehold.co/600x750/e0e0e0/333' },
    { id: 6, name: 'Neverfull Inside Out MM', price: 3050, image: 'https://placehold.co/600x750/dcdcdc/333' },
    { id: 7, name: 'Pochette Camille', price: 1600, image: 'https://placehold.co/600x750/f5f5f5/333' },
    { id: 8, name: 'Side Trunk MM', price: 3950, image: 'https://placehold.co/600x750/e8e8e8/333' },
];

// --- STATE MANAGEMENT (ZUSTAND) ---
const useCartStore = create((set, get) => ({
  cart: [],
  isCartOpen: false,
  addToCart: (product) => {
    set((state) => {
      const existingProduct = state.cart.find(item => item.id === product.id);
      if (existingProduct) {
        return {
          cart: state.cart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    });
  },
  removeFromCart: (productId) => set((state) => ({ cart: state.cart.filter(item => item.id !== productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0),
    })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  getCartTotal: () => {
      const state = get();
      return state.cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  },
  getCartCount: () => {
      const state = get();
      return state.cart.reduce((total, item) => total + item.quantity, 0);
  }
}));

// --- UI COMPONENTS ---

// 1. Intro Animation
const IntroAnimation = ({ onAnimationComplete }) => (
    <motion.div
        className="fixed inset-0 bg-white flex items-center justify-center z-[100]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, delay: 1.5, ease: 'easeInOut' }}
        onAnimationComplete={onAnimationComplete}
    >
        <motion.div layoutId="logo-aether">
            <h1 className="text-black text-6xl md:text-9xl font-serif tracking-tighter">
                AETHER
            </h1>
        </motion.div>
    </motion.div>
);

// 2. Header / Navbar
const Header = ({ showIntro }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleCart, getCartCount } = useCartStore();
  const cartCount = getCartCount();
  const navLinks = ['Timepieces', 'Accessories', 'Fragrance', 'Our World'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(true)} className="text-black"><Menu size={24} /></button>
            </div>
            <motion.div layoutId="logo-aether" className="flex-shrink-0">
              <Link href="/" className="text-2xl font-serif tracking-widest text-black">
                {showIntro ? '' : 'AETHER'}
              </Link>
            </motion.div>
            <nav className="hidden lg:flex lg:space-x-10">
              {navLinks.map(link => (
                <Link key={link} href="/" className="text-sm uppercase tracking-wider text-black hover:opacity-60 transition-opacity">
                  {link}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-6 text-black">
              <Link href="/" className="hover:opacity-60 transition-opacity"><Search size={20} /></Link>
              <button onClick={toggleCart} className="relative hover:opacity-60 transition-opacity">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-sans">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/95 z-50 lg:hidden"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setIsMenuOpen(false)} className="text-black"><X size={28} /></button>
            </div>
            <nav className="flex flex-col items-center justify-center h-full -mt-16 space-y-8">
              {navLinks.map(link => (
                <Link key={link} href="/" className="text-2xl text-black uppercase tracking-widest">
                  {link}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 3. Hero Section
const HeroSection = () => (
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-[#F5F5F7] text-black">
        <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-serif tracking-tight">Redefining Modern Luxury</h2>
            <p className="mt-4 text-lg text-gray-600">Experience design, craftsmanship, and service without compromise.</p>
        </div>
        <div className="absolute bottom-10">
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <ArrowDown size={24} className="text-gray-500" />
            </motion.div>
        </div>
    </section>
);

// 4. Collections Section
const CollectionsSection = () => (
  <section className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 text-black bg-white">
    <Link href="/" className="relative group h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110" style={{backgroundImage: "url('https://placehold.co/800x1200/e2e8f0/e2e8f0')"}}></div>
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-white mix-blend-difference">Shop The Collection</h2>
            <div className="mt-4 h-[2px] w-20 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
        </div>
    </Link>
    <Link href="/" className="relative group h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110" style={{backgroundImage: "url('https://placehold.co/800x1200/d1d5db/d1d5db')"}}></div>
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-white mix-blend-difference">Shop Our Selection</h2>
            <div className="mt-4 h-[2px] w-20 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
        </div>
    </Link>
  </section>
);

// 5. Shop by Category Section
const ShopByCategorySection = () => {
    const categories = [
        "Women's Bags", "Women's Small Leather Goods", "Women's Shoes", "Women's Fashion Jewelry",
        "Men's Bags", "Men's Small Leather Goods", "Men's Shoes", "Mon Monogram"
    ];
    return (
        <section className="bg-white text-black py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif tracking-tight">Shop by Category</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {categories.map(category => (
                        <Link href="/" key={category} className="group flex flex-col items-center justify-center p-6 bg-[#F5F5F7] aspect-square text-center transition-colors hover:bg-gray-200">
                            <h3 className="text-lg font-semibold">{category}</h3>
                            <ArrowUpRight className="w-6 h-6 mt-2 text-gray-500 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 6. Trending Now Section
const TrendingNowSection = () => (
    <section className="bg-white text-black pb-24 sm:pb-32">
        <div className="relative h-[70vh] bg-gray-200 bg-cover bg-center flex items-center justify-center" style={{backgroundImage: "url('https://placehold.co/1600x900/dcdcdc/dcdcdc')"}}>
            <div className="text-center text-white">
                <p className="text-sm uppercase tracking-widest">Women</p>
                <h2 className="text-4xl md:text-6xl font-serif mt-2 mix-blend-difference">Trending Now: Monogram Dune Bags</h2>
            </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                {trendingProducts.map(product => (
                    <div key={product.id} className="group">
                        <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <h3 className="mt-4 text-base font-semibold">{product.name}</h3>
                        <p className="mt-1 text-gray-600">${product.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                    </div>
                ))}
            </div>
            <div className="text-center mt-16">
                <Link href="/" className="inline-block bg-black text-white px-12 py-4 text-sm uppercase tracking-widest font-semibold hover:bg-gray-800 transition-colors">
                    Shop Now
                </Link>
            </div>
        </div>
    </section>
);

// 7. Gucci-Inspired Services Section
const ServicesSection = () => (
    <section className="bg-[#F5F5F7] text-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-serif tracking-tight">Aether Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                {/* Personalization */}
                <div className="flex flex-col">
                    <div className="w-full aspect-[4/3] overflow-hidden">
                        <img src="https://placehold.co/600x450/e0e0e0/333" alt="An artisan applying gold colored embossing to a black leather handbag." className="w-full h-full object-cover"/>
                    </div>
                    <h3 className="text-2xl font-serif mt-6">Personalization</h3>
                    <p className="mt-2 text-gray-600 flex-grow">Emboss select bags, luggage, belts, and leather accessories with initials to create a truly unique piece.</p>
                </div>

                {/* Book an Appointment */}
                <div className="flex flex-col">
                    <div className="w-full aspect-[4/3] overflow-hidden">
                        <img src="https://placehold.co/600x450/dcdcdc/333" alt="A client advisor guiding a customer through a hand-picked selection of pieces." className="w-full h-full object-cover"/>
                    </div>
                    <h3 className="text-2xl font-serif mt-6">Book an Appointment</h3>
                    <p className="mt-2 text-gray-600 flex-grow">Enjoy priority access to the boutique of your choice. Your Client Advisor will guide you through a hand-picked selection of pieces.</p>
                </div>

                {/* Collect In Store */}
                <div className="flex flex-col">
                    <div className="w-full aspect-[4/3] overflow-hidden">
                        <img src="https://placehold.co/600x450/f5f5f5/333" alt="A client advisor handling a boutique shopping bag in a signature red color." className="w-full h-full object-cover"/>
                    </div>
                    <h3 className="text-2xl font-serif mt-6">Collect In Store</h3>
                    <p className="mt-2 text-gray-600 flex-grow">Order online and collect your order from your preferred Aether boutique.</p>
                </div>
            </div>
        </div>
    </section>
);

// 8. Cart Drawer
const CartDrawer = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          onClick={toggleCart}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white text-black shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-serif">Your Cart</h2>
              <button onClick={toggleCart} className="text-gray-500 hover:text-black transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is a blank canvas.</p>
              ) : (
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {cart.map((product) => (
                    <li key={product.id} className="flex py-6">
                      <div className="h-28 w-24 flex-shrink-0 bg-gray-100">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium">
                            <h3>{product.name}</h3>
                            <p className="ml-4">${product.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border border-gray-300">
                            <button onClick={() => updateQuantity(product.id, product.quantity - 1)} className="px-3 py-1 text-gray-500"><Minus size={16}/></button>
                            <span className="px-3">{product.quantity}</span>
                            <button onClick={() => updateQuantity(product.id, product.quantity + 1)} className="px-3 py-1 text-gray-500"><Plus size={16}/></button>
                          </div>
                          <button type="button" onClick={() => removeFromCart(product.id)} className="font-medium text-gray-600 hover:text-black transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between text-lg font-medium">
                  <p>Subtotal</p>
                  <p>{getCartTotal()}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">Shipping and duties calculated at checkout.</p>
                <div className="mt-6">
                  <Link href="/" className="flex items-center justify-center w-full bg-black px-6 py-4 text-white font-semibold hover:bg-gray-800 transition-colors">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 9. Footer
const Footer = () => (
  <footer className="bg-[#F5F5F7] text-black border-t border-gray-200">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
                <h3 className="text-2xl font-serif">AETHER</h3>
                <p className="mt-4 text-sm text-gray-600 max-w-xs">Crafting the future of luxury. Timeless design for the modern world.</p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase">Shop</h3>
                    <ul className="mt-4 space-y-3">
                        <li><Link href="/" className="text-sm text-gray-600 hover:text-black">Timepieces</Link></li>
                        <li><Link href="/" className="text-sm text-gray-600 hover:text-black">Accessories</Link></li>
                        <li><Link href="/" className="text-sm text-gray-600 hover:text-black">Fragrance</Link></li>
                        <li><Link href="/" className="text-sm text-gray-600 hover:text-black">Leather Goods</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase">Our World</h3>
                    <ul className="mt-4 space-y-3">
                        <li><Link href="/" className="text-sm text-gray-600 hover:text-black">The Journal</Link></li>
                        <li><Link href="/" className="text-sm text-gray-600 hover:text-black">Craftsmanship</Link></li>
                        <li><Link href="/" className="text-sm text-gray-600 hover:text-black">Sustainability</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase">Client Services</h3>
                    <ul className="mt-4 space-y-3">
                        <li><Link href="/" className="text-sm text-gray-600 hover:text-black">Contact Us</Link></li>
                        <li><Link href="/" className="text-sm text-gray-600 hover:text-black">FAQ</Link></li>
                        <li><Link href="/" className="text-sm text-gray-600 hover:text-black">Shipping & Returns</Link></li>
                    </ul>
                </div>
                 <div className="col-span-2 md:col-span-1">
                    <h3 className="text-sm font-semibold tracking-wider uppercase">Connect</h3>
                    <form className="mt-4 flex w-full">
                        <input type="email" placeholder="Email Address" className="w-full bg-gray-200 border-gray-300 text-black placeholder-gray-500 px-4 py-2 focus:ring-black focus:border-black" />
                        <button type="submit" className="p-3 bg-black text-white"><ChevronRight size={16} /></button>
                    </form>
                </div>
            </div>
        </div>
        <div className="mt-16 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} AETHER Global. All Rights Reserved.</p>
        </div>
    </div>
  </footer>
);

// --- MAIN APP COMPONENT ---
export default function EcommerceDemo() {
  const [showIntro, setShowIntro] = useState(true);

  // Prevent scrolling when intro is visible
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showIntro]);

  return (
    <div className="bg-white font-sans">
      <AnimatePresence>
        {showIntro && <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />}
      </AnimatePresence>
      
      <Header showIntro={showIntro} />
      
      <AnimatePresence>
      {!showIntro && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
        >
            <CartDrawer />
            <main>
                <HeroSection />
                <CollectionsSection />
                <ShopByCategorySection />
                <TrendingNowSection />
                <ServicesSection />
            </main>
            <Footer />
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
} 