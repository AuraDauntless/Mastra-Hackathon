"use client";
import { useState } from 'react';
import { BookOpen, Code, Terminal, Check, Copy } from 'lucide-react';

export default function ApiDocs() {
    const [copiedCurl, setCopiedCurl] = useState(false);
    const [copiedNode, setCopiedNode] = useState(false);

    const curlSnippet = `curl -X POST https://api.dauntlessops.com/v1/telemetry \\
  -H "Authorization: Bearer dauntless_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "service": "nova-api",
    "level": "ERROR",
    "message": "Connection timeout detected",
    "timestamp": "2026-07-12T12:00:00Z"
  }'`;

    const nodeSnippet = `const axios = require('axios');

async function sendTelemetry() {
  await axios.post('https://api.dauntlessops.com/v1/telemetry', {
    service: 'nova-api',
    level: 'ERROR',
    message: 'Connection timeout detected',
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'Authorization': 'Bearer dauntless_live_YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  });
}`;

    const handleCopy = (text: string, type: 'curl' | 'node') => {
        navigator.clipboard.writeText(text);
        if (type === 'curl') {
            setCopiedCurl(true);
            setTimeout(() => setCopiedCurl(false), 2000);
        } else {
            setCopiedNode(true);
            setTimeout(() => setCopiedNode(false), 2000);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-12 px-4 relative z-10">
            
            <div className="text-center space-y-4 mb-16 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />
                <h1 className="text-5xl font-extrabold flex items-center justify-center gap-4">
                    <BookOpen className="text-blue-400" size={42} /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">API Documentation</span>
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light">Learn how to securely ingest your infrastructure logs directly into the Dauntless Ops AI engine.</p>
            </div>

            <div className="bg-gray-950/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-200 border-b border-gray-800 pb-4">
                    <Terminal className="text-purple-400" /> Endpoint Authentication
                </h2>
                <p className="text-gray-400 leading-relaxed text-lg">
                    Dauntless Ops requires a valid API key sent via the <code className="bg-gray-900 border border-gray-700 px-2 py-1 rounded text-purple-300">Authorization</code> header as a Bearer token. 
                    You can generate a new production key in the <a href="/developer" className="text-blue-400 hover:underline">Developer Hub</a>.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* cURL Example */}
                <div className="bg-gray-950/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col group">
                    <div className="bg-black/50 p-4 border-b border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Terminal className="text-gray-400" size={18} />
                            <span className="font-semibold text-gray-300">cURL Request</span>
                        </div>
                        <button 
                            onClick={() => handleCopy(curlSnippet, 'curl')}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {copiedCurl ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                        </button>
                    </div>
                    <div className="p-6 bg-black flex-1 relative">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <pre className="font-mono text-sm text-blue-300 overflow-x-auto">
                            <code>{curlSnippet}</code>
                        </pre>
                    </div>
                </div>

                {/* Node.js Example */}
                <div className="bg-gray-950/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col group">
                    <div className="bg-black/50 p-4 border-b border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code className="text-gray-400" size={18} />
                            <span className="font-semibold text-gray-300">Node.js (Axios)</span>
                        </div>
                        <button 
                            onClick={() => handleCopy(nodeSnippet, 'node')}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {copiedNode ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                        </button>
                    </div>
                    <div className="p-6 bg-black flex-1 relative">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <pre className="font-mono text-sm text-emerald-300 overflow-x-auto">
                            <code>{nodeSnippet}</code>
                        </pre>
                    </div>
                </div>
            </div>

        </div>
    );
}
