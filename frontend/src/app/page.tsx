import Link from 'next/link';
import InteractiveArchitecture from '@/components/InteractiveArchitecture';
import { ShieldAlert, Zap, Lock, Database, ArrowRight, Terminal } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-16 py-12 px-4 max-w-7xl mx-auto relative z-10">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/20 blur-[100px] rounded-full pointer-events-none animate-float -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none animate-float-delayed -z-10" />



            {/* Hero Section */}
            <div className="space-y-6 max-w-5xl mx-auto mt-16 relative">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-purple-900/20 text-purple-300 border border-purple-500/30 text-sm font-semibold mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    <Zap size={16} className="text-yellow-400" /> Welcome to the Future of Incident Response
                </div>
                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight drop-shadow-2xl">
                    AI That Fixes Your <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 animate-pulse">Servers, Safely</span>.
                </h1>
                <p className="text-2xl text-gray-300 max-w-3xl mx-auto pt-6 leading-relaxed font-light">
                    When your website goes down, our AI figures out exactly what went wrong and suggests the perfect command to fix it. Best of all, it never runs anything without your explicit approval.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
                    <Link href="/dashboard" className="w-full sm:w-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white font-bold py-5 px-10 rounded-lg transition-all border border-gray-800">
                            <Terminal size={22} className="text-purple-400" /> Launch NOC Dashboard
                        </div>
                    </Link>
                    <Link href="/developer" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-5 px-10 rounded-lg border border-white/10 backdrop-blur-md transition-all">
                        Get API Keys <ArrowRight size={20} className="text-gray-400" />
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-32 text-left relative z-10">
                <div className="bg-gray-950/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl hover:border-blue-500/50 transition-all duration-300 shadow-2xl hover:-translate-y-2 group">
                    <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-blue-500/20">
                        <Database className="text-blue-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Learns From Past Mistakes</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">It remembers every problem you've ever had. Instead of guessing, it looks at how you fixed things in the past to give you the perfect solution.</p>
                </div>
                <div className="bg-gray-950/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl hover:border-red-500/50 transition-all duration-300 shadow-2xl hover:-translate-y-2 group relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-red-600/20 blur-3xl rounded-full"></div>
                    <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-red-500/20">
                        <Lock className="text-red-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Bulletproof Security</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">Our security layer blocks the AI from making any dangerous mistakes. If it tries to delete something important, we stop it instantly.</p>
                </div>
                <div className="bg-gray-950/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl hover:border-green-500/50 transition-all duration-300 shadow-2xl hover:-translate-y-2 group">
                    <div className="bg-green-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-green-500/20">
                        <ShieldAlert className="text-green-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">You're Always The Boss</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">The AI pauses exactly when it needs to. It prepares the solution, but waits patiently for you to click "Approve" before touching your servers.</p>
                </div>
            </div>
            
            {/* 3D Interactive Architecture Section */}
            <div className="w-full mt-32 z-10 relative">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Explore How It Works</h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Interact with our visual map. See exactly how the AI takes error reports, checks past memory, and safely prepares a fix for you to approve.
                    </p>
                </div>
                <InteractiveArchitecture />
            </div>

        </div>
    );
}
