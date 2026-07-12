"use client";
import { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { ShieldAlert, CheckCircle, Activity, Play, Zap } from 'lucide-react';

export default function Dashboard() {
    const { logs, proposedPlan, status, addLog, setProposedPlan, setStatus } = useStore();
    const [displayUrl, setDisplayUrl] = useState('');
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const isLocal = window.location.hostname === 'localhost';
        const defaultWsUrl = isLocal ? 'ws://localhost:4000' : 'wss://api.dauntless.ops/stream';
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || defaultWsUrl;
        
        setDisplayUrl(wsUrl);
        
        // Don't attempt to connect if it's our fake presentation mock URL to prevent red console errors
        if (wsUrl !== 'wss://api.dauntless.ops/stream') {
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'INCIDENT_PLAN') {
                        setProposedPlan(data.data);
                        setStatus('PENDING_APPROVAL');
                    } else if (data.type === 'ERROR') {
                        addLog('ERROR: ' + data.message);
                    }
                } catch(e) {
                    addLog(event.data);
                }
            };

            return () => ws.close();
        }
    }, [addLog, setProposedPlan, setStatus]);

    const handleApprove = async () => {
        setStatus('RESOLVED');
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            await fetch(`${apiUrl}/api/approve`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    // Fake JWT for MVP demo since we mocked the login endpoint
                    'Authorization': 'Bearer test' 
                },
                body: JSON.stringify({ runId: 'test', command: proposedPlan?.remediationCommand })
            });
            alert('Action Approved! Post-Mortem generated on Backend.');
        } catch(e) {
            console.error('Failed to approve', e);
        }
    };

    return (
        <div className="min-h-[85vh] text-white p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl font-extrabold flex items-center gap-4">
                    <div className="bg-red-500/20 p-3 rounded-2xl border border-red-500/30">
                        <ShieldAlert className="text-red-500" size={32} />
                    </div>
                    Dauntless Ops NOC
                </h1>
                <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-2 rounded-full text-sm">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    System Online
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Telemetry Stream */}
                <div className="bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    <div className="bg-black border-b border-gray-800 px-6 py-4 flex items-center gap-3">
                        <Activity className="text-blue-500 animate-pulse" size={20} /> 
                        <h2 className="text-lg font-bold text-gray-200 tracking-wide uppercase">Live Telemetry</h2>
                    </div>
                    <div className="h-[500px] bg-black p-6 overflow-y-auto font-mono text-sm text-emerald-500 terminal-scrollbar scanlines relative">
                        {logs.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-600 animate-pulse">
                                Listening on {displayUrl || '...'}
                            </div>
                        ) : (
                            <div className="space-y-1 relative z-20 opacity-90 drop-shadow-[0_0_2px_rgba(16,185,129,0.5)]">
                                {logs.map((l, i) => <div key={i} className="hover:bg-emerald-900/20 px-2 py-1 -mx-2 rounded transition-colors break-words">{l}</div>)}
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Proposed Plan */}
                <div className={`bg-gray-950/60 backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transition-all duration-1000 ${status === 'PENDING_APPROVAL' ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] border-glow-amber' : status === 'RESOLVED' ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] border-glow-emerald' : 'border-gray-800'}`}>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        {status === 'PENDING_APPROVAL' ? (
                            <><Zap className="text-amber-400 animate-pulse" size={28} /> AI Remediation Plan</>
                        ) : status === 'RESOLVED' ? (
                            <><CheckCircle className="text-emerald-400" size={28} /> Action Resolved</>
                        ) : (
                            <><CheckCircle className="text-gray-600" size={28} /> AI Orchestration</>
                        )}
                    </h2>
                    
                    {status === 'PENDING_APPROVAL' && proposedPlan ? (
                        <div className="space-y-6">
                            <div className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 shadow-inner">
                                <h3 className="text-amber-500/70 text-xs font-bold uppercase tracking-wider mb-2">Root Cause Analysis</h3>
                                <p className="font-semibold text-lg text-gray-200">{proposedPlan.rootCause}</p>
                            </div>
                            
                            <div className="bg-black p-5 rounded-2xl border border-gray-800 shadow-inner relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                <h3 className="text-red-400/70 text-xs font-bold uppercase tracking-wider mb-3 ml-2">Proposed CLI Command</h3>
                                <code className="block ml-2 text-red-400 font-mono text-sm break-all">
                                    &gt; {proposedPlan.remediationCommand}
                                </code>
                            </div>

                            <div className={`flex items-center gap-3 mt-6 p-4 rounded-xl border ${proposedPlan.safe ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' : 'bg-red-950/30 text-red-400 border-red-900/50'}`}>
                                <ShieldAlert size={20} /> 
                                <span className="font-medium tracking-wide">Security Proxy: {proposedPlan.safe ? "PASSED (No Destructive Payloads)" : "FAILED"}</span>
                            </div>

                            <button onClick={handleApprove} className="w-full mt-8 relative group overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 px-4 rounded-xl flex justify-center items-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></div>
                                <Play size={20} className="fill-white" /> Approve & Execute Runbook
                            </button>
                        </div>
                    ) : status === 'RESOLVED' ? (
                        <div className="h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle size={48} className="text-emerald-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">Incident Resolved</h3>
                            <p className="text-emerald-400 font-medium">Post-Mortem auto-generated in Qdrant.</p>
                        </div>
                    ) : (
                        <div className="h-[400px] flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
                            <Activity size={48} className="mb-4 opacity-50" />
                            <p className="font-medium">Awaiting Anomaly Detection...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
