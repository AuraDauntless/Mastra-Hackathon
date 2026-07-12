"use client";
import { useState } from 'react';
import { Key, Copy, Check, Terminal, Zap, Activity } from 'lucide-react';

export default function DeveloperHub() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const generateKey = async () => {
        try {
            const res = await fetch('/api/keys', { method: 'POST' });
            
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            
            const data = await res.json();
            if (data.key) {
                setApiKey(data.key);
                setCopied(false);
            }
        } catch (error) {
            console.error('Failed to generate key', error);
        }
    };

    const copyToClipboard = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-12 px-4 relative z-10">
            
            <div className="text-center space-y-4 mb-16 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />
                <h1 className="text-5xl font-extrabold flex items-center justify-center gap-4">
                    <Terminal className="text-purple-400 animate-pulse" size={42} /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Developer Hub</span>
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light">Generate your secure API keys to connect your infrastructure telemetry directly to the Dauntless Ops ingestion engine.</p>
            </div>

            <div className="bg-gray-950/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="bg-black/50 p-6 border-b border-gray-800 flex items-center gap-3">
                    <Key className="text-blue-400" /> 
                    <h2 className="text-xl font-semibold text-gray-200">API Key Management</h2>
                </div>
                
                <div className="p-10 space-y-8 bg-gradient-to-b from-transparent to-gray-950">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 bg-black border border-gray-700/50 rounded-2xl p-6 font-mono text-sm text-gray-300 w-full flex items-center justify-between shadow-inner relative group">
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                            <span className="truncate relative z-10">{apiKey ? apiKey : 'Click generate to create a new production key...'}</span>
                        </div>
                        <button 
                            onClick={copyToClipboard}
                            disabled={!apiKey}
                            className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white p-6 rounded-2xl transition-all flex items-center gap-2 w-full md:w-auto justify-center border border-gray-700 shadow-lg hover:shadow-purple-900/20"
                        >
                            {copied ? <Check size={24} className="text-emerald-400" /> : <Copy size={24} />}
                        </button>
                    </div>

                    <div className="flex justify-center pt-8 border-t border-gray-800/30">
                        <button 
                            onClick={generateKey}
                            className="relative group overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-5 px-12 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95"
                        >
                            <div className="absolute inset-0 bg-white/20 w-1/2 -translate-x-[200%] skew-x-12 group-hover:animate-[spin_2s_linear_infinite]"></div>
                            <Zap size={22} className="relative z-10" /> 
                            <span className="relative z-10 tracking-wide">Generate New Key</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="bg-gray-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl hover:border-purple-500/30 transition-colors group">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-gray-200">
                        <Activity className="text-purple-400 group-hover:animate-pulse" size={20} />
                        Enterprise Rate Limits
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">Your current tier allows for 10,000 telemetry events per minute. Contact sales to upgrade.</p>
                    <div className="w-full bg-gray-900 rounded-full h-4 border border-gray-800 p-0.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 h-full rounded-full w-1/4 relative">
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl hover:border-blue-500/30 transition-colors group">
                    <h3 className="text-xl font-bold mb-3 text-gray-200">API Documentation</h3>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">Learn how to configure your OpenTelemetry collectors to forward data to our ingest endpoint.</p>
                    <a href="/docs" className="inline-flex items-center justify-center w-full gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 py-4 rounded-xl text-purple-400 hover:text-purple-300 font-semibold transition-all">
                        Read the Docs <Zap size={16} />
                    </a>
                </div>
            </div>

        </div>
    );
}
