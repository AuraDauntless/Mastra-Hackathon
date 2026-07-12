"use client";
import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { ShieldAlert, CheckCircle, Activity, Play } from 'lucide-react';

export default function Dashboard() {
    const { logs, proposedPlan, status, addLog, setProposedPlan, setStatus } = useStore();
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
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
                // If it's a raw string log from our ingest
                addLog(event.data);
            }
        };

        return () => ws.close();
    }, [addLog, setProposedPlan, setStatus]);

    const handleApprove = async () => {
        setStatus('RESOLVED');
        try {
            await fetch('http://localhost:4000/api/approve', {
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
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <ShieldAlert className="text-red-500" /> Dauntless Ops HITL Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Telemetry Stream */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Activity className="text-blue-400" /> Live Telemetry
                    </h2>
                    <div className="h-96 bg-black rounded p-4 overflow-y-auto font-mono text-sm text-green-400">
                        {logs.length === 0 ? "Listening on wss://localhost:4000..." : logs.map((l, i) => <div key={i}>{l}</div>)}
                    </div>
                </div>

                {/* AI Proposed Plan */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-xl">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="text-purple-400" /> Enkrypt-Validated Plan
                    </h2>
                    
                    {status === 'PENDING_APPROVAL' && proposedPlan ? (
                        <div className="space-y-4">
                            <div className="bg-gray-700 p-4 rounded">
                                <h3 className="text-gray-400 text-sm uppercase tracking-wide">Root Cause Analysis</h3>
                                <p className="font-semibold text-lg mt-1">{proposedPlan.rootCause}</p>
                            </div>
                            
                            <div className="bg-gray-700 p-4 rounded border border-gray-600">
                                <h3 className="text-gray-400 text-sm uppercase tracking-wide">Proposed Remediation Command</h3>
                                <code className="block mt-2 bg-black p-3 text-red-400 rounded border border-red-900/50">
                                    &gt; {proposedPlan.remediationCommand}
                                </code>
                            </div>

                            <div className="flex items-center gap-2 mt-4 p-3 bg-green-900/30 text-green-400 rounded border border-green-900/50">
                                <ShieldAlert size={18} /> Safety Check: {proposedPlan.safe ? "PASSED (No destructive commands detected)" : "FAILED"}
                            </div>

                            <button onClick={handleApprove} className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded flex justify-center items-center gap-2 transition-all">
                                <Play size={18} /> Approve & Execute
                            </button>
                        </div>
                    ) : status === 'RESOLVED' ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <CheckCircle size={64} className="text-green-500 mb-4" />
                            <p className="text-xl text-white">Incident Resolved</p>
                            <p>Post-Mortem auto-generated and stored in Qdrant.</p>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                            Waiting for anomalies...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
