'use client';

import React from 'react';
import { Leaf, ArrowLeft, Printer, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1917] font-sans selection:bg-[#D97757] selection:text-white">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FAFAF9]/90 backdrop-blur-md border-b border-[#E7E5E4]">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div 
            onClick={() => router.push('/')} 
            className="flex items-center gap-2 cursor-pointer text-[#57534E] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Home</span>
          </div>

          <div className="flex items-center gap-2">
            <Leaf size={20} className="text-[#D97757]" />
            <span className="text-lg font-serif font-medium tracking-tight">Food Arca</span>
          </div>

          <button 
            onClick={handlePrint}
            className="p-2 text-[#57534E] hover:text-[#1C1917] transition-colors"
            title="Print this document"
          >
            <Printer size={20} />
          </button>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="mb-16 border-b border-[#E7E5E4] pb-8">
            <div className="flex items-center gap-3 mb-4 text-[#D97757]">
                <ShieldCheck size={32} />
                <span className="uppercase tracking-widest text-xs font-bold">Legal & Privacy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#1C1917] mb-4">
              Terms of Service
            </h1>
            <p className="text-[#57534E] text-lg font-light">
              Transparent, secure, and built for trust.
            </p>
            <p className="text-sm text-[#A8A29E] mt-4">
              Last Updated: December 2, 2025
            </p>
          </div>

          {/* Legal Text */}
          <div className="space-y-12 text-[#44403C] leading-relaxed">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-serif text-[#1C1917] mb-4">1. Introduction</h2>
              <p className="mb-4">
                Welcome to <strong>Food Arca</strong> ("we," "our," or "us"). By creating an account or using our application, you agree to be bound by these Terms of Service and Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-serif text-[#1C1917] mb-4">2. Authentication & Account Security</h2>
              <div className="space-y-4">
                <div>
                    <h3 className="font-medium text-[#1C1917] mb-1">2.1 Google & Supabase Authentication</h3>
                    <p>Food Arca utilizes <strong>Google OAuth</strong> and <strong>Supabase Authentication</strong> services to secure your account. We do not store passwords directly. By signing up, you authorize us to use these third-party providers to verify your identity.</p>
                </div>
                <div>
                    <h3 className="font-medium text-[#1C1917] mb-1">2.2 Responsibility</h3>
                    <p>You are responsible for maintaining the security of your Google account. We are not liable for any loss or damage arising from your failure to protect your own authentication credentials.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-serif text-[#1C1917] mb-4">3. Data Privacy & Encryption</h2>
              <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-sm mb-6">
                 <p className="text-sm font-medium text-[#D97757] uppercase tracking-wide mb-2">The "Bank-Level" Standard</p>
                 <p className="italic text-[#57534E]">We treat your data with the highest level of confidentiality.</p>
              </div>

              <div className="space-y-6">
                <div>
                    <h3 className="font-medium text-[#1C1917] mb-1">3.1 Encryption & Storage</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-[#D97757]">
                        <li><strong>Encryption:</strong> All sensitive data is protected using industry-standard encryption (AES-256) both in transit (while moving over the internet) and at rest (while stored in our databases).</li>
                        <li><strong>Storage:</strong> Your data is securely hosted using <strong>Supabase</strong> and <strong>MongoDB</strong>. We implement strict Row-Level Security (RLS) policies to ensure data isolation.</li>
                        <li><strong>Local Storage:</strong> We <strong>do not</strong> store sensitive personal data or client lists in your browser's Local Storage.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-medium text-[#1C1917] mb-1">3.2 Data Confidentiality & Siloing</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-[#D97757]">
                        <li><strong>Your Data is Yours:</strong> The "Client Lists" (names, families, and details of the people you serve) that you input into Food Arca are strictly confidential to your specific organization.</li>
                        <li><strong>No Sharing:</strong> We will <strong>never</strong> sell, trade, or share your organization’s data or your client lists with third-party advertisers, marketing firms, or other Food Arca users/organizations.</li>
                    </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-serif text-[#1C1917] mb-4">4. Administrative Access & Debugging Consent</h2>
              <div className="space-y-4">
                 <p>To maintain the application and provide support, the application administrators (Rogelio Perez / Food Arca Development Team) retain strictly limited access.</p>
                 
                 <div>
                    <h3 className="font-medium text-[#1C1917] mb-1">4.1 Developer Access</h3>
                    <p>We can view administrator account details provided during sign-up (Name, Email, Phone Number) for account management purposes.</p>
                 </div>

                 <div>
                    <h3 className="font-medium text-[#1C1917] mb-1">4.2 Consent for Debugging</h3>
                    <p className="mb-2">By using Food Arca, you explicitly consent to the following:</p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-[#D97757]">
                        <li><strong>Bug Fixing:</strong> In the event of a software bug, administrators may access data logs strictly to identify and resolve the issue.</li>
                        <li><strong>Privacy Guarantee:</strong> While we have the technical capability to view data for debugging, we enforce a policy of <strong>non-intrusion</strong>. We will not inspect specific client records unless you explicitly ask us to (via support) or it is strictly necessary to fix a critical bug.</li>
                    </ul>
                 </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-serif text-[#1C1917] mb-4">5. Contact Information</h2>
              <p className="mb-4">
                If you have questions about these Terms or our Privacy practices, please contact us:
              </p>
              <div className="bg-[#F5F5F4] p-6 rounded-2xl border border-[#E7E5E4]">
                  <p className="font-bold text-[#1C1917]">Food Arca</p>
                  <p>Developer: Rogelio Perez</p>
                  <p>Email: <a href="mailto:rogeliopmdev@gmail.com" className="text-[#D97757] hover:underline">rogeliopmdev@gmail.com</a></p>
                  <p>Location: Greensboro, NC, USA</p>
              </div>
            </section>

          </div>

          {/* Bottom Back Button */}
          <div className="mt-16 pt-8 border-t border-[#E7E5E4]">
            <button 
                onClick={() => router.push('/')}
                className="text-[#1C1917] font-medium hover:text-[#D97757] transition-colors flex items-center gap-2"
            >
                <ArrowLeft size={20} /> Return to Home
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}