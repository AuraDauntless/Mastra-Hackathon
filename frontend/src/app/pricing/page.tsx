import React from 'react';
import Link from 'next/link';
import { Check, ShieldAlert, Zap, Server } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto text-center z-10 relative">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">Simple, Usage-Based Pricing</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-20">
                Deploy an autonomous SRE agent for a fraction of the cost of downtime. Scale effortlessly with zero hidden fees.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Starter Plan */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl text-left hover:border-gray-600 transition-all flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                    <p className="text-gray-400 mb-6">Perfect for small teams exploring AI ops.</p>
                    <div className="text-4xl font-extrabold text-white mb-8">$0<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                    
                    <ul className="space-y-4 mb-10 flex-1">
                        <li className="flex items-center gap-3 text-gray-300"><Check className="text-green-500" size={20} /> 100 API Requests / day</li>
                        <li className="flex items-center gap-3 text-gray-300"><Check className="text-green-500" size={20} /> 10GB Vector Storage</li>
                        <li className="flex items-center gap-3 text-gray-300"><Check className="text-green-500" size={20} /> Standard LLM Speed</li>
                    </ul>
                    
                    <Link href="/login" className="w-full block text-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-colors">
                        Get Started Free
                    </Link>
                </div>

                {/* Pro Plan */}
                <div className="bg-gray-900/80 backdrop-blur-xl border border-purple-500/50 p-10 rounded-3xl text-left hover:border-purple-400 transition-all transform md:-translate-y-4 shadow-[0_0_40px_rgba(168,85,247,0.2)] flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">MOST POPULAR</div>
                    <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        <Zap className="text-purple-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                    <p className="text-gray-400 mb-6">For production workloads requiring fast SLAs.</p>
                    <div className="text-4xl font-extrabold text-white mb-8">$99<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                    
                    <ul className="space-y-4 mb-10 flex-1">
                        <li className="flex items-center gap-3 text-gray-300"><Check className="text-green-500" size={20} /> 50,000 API Requests / day</li>
                        <li className="flex items-center gap-3 text-gray-300"><Check className="text-green-500" size={20} /> 500GB Vector Storage</li>
                        <li className="flex items-center gap-3 text-gray-300"><Check className="text-green-500" size={20} /> Mastra Fast-Track Queue</li>
                        <li className="flex items-center gap-3 text-gray-300"><Check className="text-green-500" size={20} /> Slack/Teams Integration</li>
                    </ul>
                    
                    <Link href="/login" className="w-full block text-center bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-colors">
                        Upgrade to Pro
                    </Link>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl text-left hover:border-blue-500/50 transition-all flex flex-col">
                    <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        <ShieldAlert className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                    <p className="text-gray-400 mb-6">Custom limits and zero-trust security compliance.</p>
                    <div className="text-4xl font-extrabold text-white mb-8">Custom</div>
                    
                    <ul className="space-y-4 mb-10 flex-1">
                        <li className="flex items-center gap-3 text-gray-300"><Check className="text-green-500" size={20} /> Unlimited API Requests</li>
                        <li className="flex items-center gap-3 text-gray-300"><Check className="text-green-500" size={20} /> Dedicated Qdrant Cluster</li>
                        <li className="flex items-center gap-3 text-gray-300"><Check className="text-green-500" size={20} /> Dedicated Enkrypt Firewall</li>
                        <li className="flex items-center gap-3 text-gray-300"><Check className="text-green-500" size={20} /> 24/7 Phone Support</li>
                    </ul>
                    
                    <Link href="/login" className="w-full block text-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-colors">
                        Contact Sales
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}
