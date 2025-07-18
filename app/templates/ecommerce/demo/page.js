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
        className="fixed inset-0 bg-[hsl(var(--background))] flex items-center justify-center z-[100]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, delay: 1.5, ease: 'easeInOut' }}
        onAnimationComplete={onAnimationComplete}
    >
        <motion.div layoutId="logo-aether">
            <h1 className="text-[hsl(var(--foreground))] text-6xl md:text-9xl font-serif tracking-tighter">
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
      <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[hsl(var(--background))]/80 backdrop-blur-sm shadow-[var(--shadow-md)]' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(true)} className="text-[hsl(var(--foreground))]"><Menu size={24} /></button>
            </div>
            <motion.div layoutId="logo-aether" className="flex-shrink-0">
              <Link href="/" className="text-2xl font-serif tracking-widest text-[hsl(var(--foreground))]">
                {showIntro ? '' : 'AETHER'}
              </Link>
            </motion.div>
            <nav className="hidden lg:flex lg:space-x-10">
              {navLinks.map(link => (
                <Link key={link} href="/" className="text-sm uppercase tracking-wider text-[hsl(var(--foreground))] hover:opacity-60 transition-opacity">
                  {link}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-6 text-[hsl(var(--foreground))]">
              <Link href="/" className="hover:opacity-60 transition-opacity"><Search size={20} /></Link>
              <button onClick={toggleCart} className="relative hover:opacity-60 transition-opacity">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-xs rounded-full h-5 w-5 flex items-center justify-center font-sans">
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
            className="fixed inset-0 bg-[hsl(var(--background))]/95 z-50 lg:hidden"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setIsMenuOpen(false)} className="text-[hsl(var(--foreground))]"><X size={28} /></button>
            </div>
            <nav className="flex flex-col items-center justify-center h-full -mt-16 space-y-8">
              {navLinks.map(link => (
                <Link key={link} href="/" className="text-2xl text-[hsl(var(--foreground))] uppercase tracking-widest">
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
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]">
        <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-serif tracking-tight">Redefining Modern Luxury</h2>
            <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))]">Experience design, craftsmanship, and service without compromise.</p>
        </div>
        <div className="absolute bottom-10">
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <ArrowDown size={24} className="text-[hsl(var(--muted-foreground))]" />
            </motion.div>
        </div>
    </section>
);

// 4. Collections Section
const CollectionsSection = () => (
    <section className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 text-[hsl(var(--foreground))] bg-[hsl(var(--background))]">
        <div className="relative flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-[hsl(var(--foreground))]/20"></div>
            <div className="relative text-center">
                <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-[hsl(var(--background))] mix-blend-difference">Shop The Collection</h2>
                <div className="mt-4 h-[2px] w-20 bg-[hsl(var(--background))] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
            </div>
        </div>
        <div className="relative flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-[hsl(var(--foreground))]/20"></div>
            <div className="relative text-center">
                <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-[hsl(var(--background))] mix-blend-difference">Shop Our Selection</h2>
                <div className="mt-4 h-[2px] w-20 bg-[hsl(var(--background))] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
            </div>
        </div>
    </section>
);

// 5. Featured Products Section
const FeaturedProductsSection = () => (
    <section className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Featured Pieces</h2>
                <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">Discover our curated selection of timeless pieces that define modern luxury.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {mockProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group cursor-pointer"
                    >
                        <div className="aspect-[4/5] w-full overflow-hidden bg-[hsl(var(--muted))]">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className="font-medium text-[hsl(var(--foreground))]">{product.name}</h3>
                            <p className="mt-1 text-[hsl(var(--muted-foreground))]">${product.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="text-center mt-12">
                <Link href="/" className="inline-block bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-12 py-4 text-sm uppercase tracking-widest font-semibold hover:bg-[hsl(var(--muted-foreground))] transition-colors">
                    View All Products
                </Link>
            </div>
        </div>
    </section>
);

// 6. Shop By Category Section
const ShopByCategorySection = () => {
    const categories = ['Timepieces', 'Accessories', 'Fragrance', 'Leather Goods'];
    
    return (
        <section className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] pb-24 sm:pb-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Shop By Category</h2>
                </div>
                <div className="relative h-[70vh] bg-[hsl(var(--muted))] bg-cover bg-center flex items-center justify-center" style={{backgroundImage: "url('https://placehold.co/1600x900/dcdcdc/dcdcdc')"}}>
                    <div className="text-center text-[hsl(var(--background))]">
                        <h3 className="text-3xl font-serif mb-4">Discover Your Style</h3>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {categories.map((category, index) => (
                        <Link href="/" key={category} className="group flex flex-col items-center justify-center p-6 bg-[hsl(var(--muted))] aspect-square text-center transition-colors hover:bg-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--background))]">
                            <ArrowUpRight className="w-6 h-6 mt-2 text-[hsl(var(--muted-foreground))] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            <span className="text-sm uppercase tracking-wider mt-2">{category}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

// 7. Trending Now Section
const TrendingNowSection = () => (
    <section className="bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Trending Now</h2>
                <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">The most sought-after pieces from our latest collection.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {trendingProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group cursor-pointer"
                    >
                        <div className="aspect-[4/5] w-full overflow-hidden bg-[hsl(var(--background))]">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className="font-medium text-[hsl(var(--foreground))]">{product.name}</h3>
                            <p className="mt-1 text-[hsl(var(--muted-foreground))]">${product.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

// 8. Services Section
const ServicesSection = () => (
    <section className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Our Services</h2>
                <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">Exceptional service is at the heart of everything we do.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎨</span>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Personalization</h3>
                    <p className="mt-2 text-[hsl(var(--muted-foreground))] flex-grow">Emboss select bags, luggage, belts, and leather accessories with initials to create a truly unique piece.</p>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👑</span>
                    </div>
                    <h3 className="text-xl font-medium mb-2">VIP Access</h3>
                    <p className="mt-2 text-[hsl(var(--muted-foreground))] flex-grow">Enjoy priority access to the boutique of your choice. Your Client Advisor will guide you through a hand-picked selection of pieces.</p>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🚚</span>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Click & Collect</h3>
                    <p className="mt-2 text-[hsl(var(--muted-foreground))] flex-grow">Order online and collect your order from your preferred Aether boutique.</p>
                </div>
            </div>
        </div>
    </section>
);

// 9. Shopping Cart Drawer
const CartDrawer = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[hsl(var(--foreground))]/30 backdrop-blur-sm z-50"
          onClick={toggleCart}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-[var(--shadow-2xl)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <button onClick={toggleCart} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"><X size={24} /></button>
            </div>
            
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-center text-[hsl(var(--muted-foreground))]">Your cart is a blank canvas.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6">
                  {cart.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 mb-6">
                      <div className="h-28 w-24 flex-shrink-0 bg-[hsl(var(--muted))]">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-[hsl(var(--foreground))]">{product.name}</h3>
                        <p className="text-[hsl(var(--muted-foreground))]">${product.price.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                        <div className="flex items-center mt-2">
                          <button onClick={() => updateQuantity(product.id, product.quantity - 1)} className="px-3 py-1 text-[hsl(var(--muted-foreground))]"><Minus size={16}/></button>
                          <span className="px-3 py-1">{product.quantity}</span>
                          <button onClick={() => updateQuantity(product.id, product.quantity + 1)} className="px-3 py-1 text-[hsl(var(--muted-foreground))]"><Plus size={16}/></button>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeFromCart(product.id)} className="font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[hsl(var(--border))] p-6 bg-[hsl(var(--muted))]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-[hsl(var(--foreground))]">Total:</span>
                    <span className="font-semibold text-[hsl(var(--foreground))]">{getCartTotal()}</span>
                  </div>
                  <Link href="/" className="flex items-center justify-center w-full bg-[hsl(var(--foreground))] px-6 py-4 text-[hsl(var(--background))] font-semibold hover:bg-[hsl(var(--muted-foreground))] transition-colors">
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 10. Footer
const Footer = () => (
    <footer className="bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] border-t border-[hsl(var(--border))]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-serif mb-4">AETHER</h3>
                    <p className="text-[hsl(var(--muted-foreground))]">Redefining modern luxury through exceptional design and craftsmanship.</p>
                </div>
                <div>
                    <h4 className="font-medium mb-4">Shop</h4>
                    <ul className="space-y-2 text-[hsl(var(--muted-foreground))]">
                        <li><Link href="/" className="hover:text-[hsl(var(--foreground))] transition-colors">Timepieces</Link></li>
                        <li><Link href="/" className="hover:text-[hsl(var(--foreground))] transition-colors">Accessories</Link></li>
                        <li><Link href="/" className="hover:text-[hsl(var(--foreground))] transition-colors">Fragrance</Link></li>
                        <li><Link href="/" className="hover:text-[hsl(var(--foreground))] transition-colors">Leather Goods</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium mb-4">Services</h4>
                    <ul className="space-y-2 text-[hsl(var(--muted-foreground))]">
                        <li><Link href="/" className="hover:text-[hsl(var(--foreground))] transition-colors">Personalization</Link></li>
                        <li><Link href="/" className="hover:text-[hsl(var(--foreground))] transition-colors">VIP Access</Link></li>
                        <li><Link href="/" className="hover:text-[hsl(var(--foreground))] transition-colors">Click & Collect</Link></li>
                        <li><Link href="/" className="hover:text-[hsl(var(--foreground))] transition-colors">Client Services</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium mb-4">Newsletter</h4>
                    <p className="text-[hsl(var(--muted-foreground))] mb-4">Stay updated with our latest collections and exclusive offers.</p>
                    <div className="flex">
                        <input type="email" placeholder="Email Address" className="w-full bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] px-4 py-2 focus:ring-[hsl(var(--foreground))] focus:border-[hsl(var(--foreground))]" />
                        <button type="submit" className="p-3 bg-[hsl(var(--foreground))] text-[hsl(var(--background))]"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
            <div className="mt-16 border-t border-[hsl(var(--border))] pt-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
                <p>&copy; 2024 AETHER. All rights reserved. Redefining modern luxury.</p>
            </div>
        </div>
    </footer>
);

// --- MAIN COMPONENT ---
export default function EcommerceDemo() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[hsl(var(--background))] font-sans">
      {showIntro && <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />}
      <Header showIntro={showIntro} />
      <main>
        <HeroSection />
        <CollectionsSection />
        <FeaturedProductsSection />
        <ShopByCategorySection />
        <TrendingNowSection />
        <ServicesSection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
} 