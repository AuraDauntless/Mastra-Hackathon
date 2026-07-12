"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, X, Terminal, ShieldAlert, Sparkles, Network, Database, Activity } from 'lucide-react';

interface NodeData {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  color: string;
  details: string;
}

interface Connection {
  from: string;
  to: string;
  color: string;
}

// Custom SVGs for Company Logos
const NextjsLogo = () => (
  <svg viewBox="0 0 180 180" width="32" height="32" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M90 180c49.706 0 90-40.294 90-90S139.706 0 90 0 0 40.294 0 90s40.294 90 90 90zM74.954 59.992l54.898 81.332A78.694 78.694 0 0190 168.751c-43.493 0-78.75-35.257-78.75-78.75 0-43.493 35.257-78.75 78.75-78.75 43.492 0 78.75 35.257 78.75 78.75 0 9.071-1.536 17.784-4.321 25.864l-42.503-62.115H74.954v83.751h11.25V72.235l47.787 69.832c6.236-15.006 9.759-31.547 9.759-48.817 0-38.665-31.345-70.01-70-70.01-38.655 0-70 31.345-70 70.01 0 38.666 31.345 70.01 70 70.01 5.922 0 11.673-.734 17.165-2.118l-12.71-18.571V59.992z"/>
  </svg>
);

const QdrantLogo = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8l7.5 3.7-7.5 3.7-7.5-3.7L12 4.8zm-8.5 4.8l7.5 3.7v7.2l-7.5-3.7V9.6zm9.5 10.9v-7.2l7.5-3.7v7.2l-7.5 3.7z"/>
  </svg>
);

export default function InteractiveArchitecture() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Click vs Drag detection
  const [pointerDownPos, setPointerDownPos] = useState<{x: number, y: number} | null>(null);
  
  // Animation States
  const [jumpingNode, setJumpingNode] = useState<string | null>(null);
  const [activeNode, setActiveNode] = useState<NodeData | null>(null);

  useEffect(() => {
      setIsClient(true);
  }, []);

  const [nodes, setNodes] = useState<NodeData[]>([
    { id: 'telemetry', label: 'Loghub Simulator', description: 'Live Telemetry Stream', details: 'Ingests the OpenStack log dataset and streams it over WebSockets. Custom PII-masking middleware scrubs IP addresses and emails before they ever reach the AI.', x: 50, y: 250, icon: <Activity size={32} />, color: 'emerald' },
    { id: 'dashboard', label: 'Next.js App', description: 'NOC Operator Dashboard', details: 'A React/Next.js frontend using Zustand and WebSockets to render the live stream. Displays the AI remediation plan and provides the strict Human-in-the-Loop "Approve" button.', x: 750, y: 50, icon: <NextjsLogo />, color: 'blue' },
    { id: 'mastra', label: 'Mastra.ai', description: 'Non-Linear State Machine', details: 'The core AI orchestrator. It manages the complex workflow graph, perfectly handling the suspend/resume state required to wait for human approval before executing commands.', x: 400, y: 250, icon: <Network size={32} />, color: 'purple' },
    { id: 'qdrant', label: 'Qdrant', description: 'Vector Database RAG', details: 'Stores historical server incidents as embeddings. Used to retrieve similar past incidents (RAG) so the LLM can reference proven fixes, eliminating AI hallucinations.', x: 400, y: 450, icon: <QdrantLogo />, color: 'orange' },
    { id: 'gemini', label: 'Google Gemini 1.5', description: 'LLM Reasoning Engine', details: 'The brain of the agent. Promoted via the CRISPE framework to synthesize the log error and the Qdrant history to formulate an exact CLI command to remediate the incident.', x: 400, y: 50, icon: <Sparkles size={32} />, color: 'blue' },
    { id: 'enkrypt', label: 'Enkrypt AI', description: 'Zero-Trust Security Proxy', details: 'Intercepts the LLM-generated payload and rigorously scans it for destructive commands (e.g., rm -rf) or malicious exploits. Blocks execution if validation fails.', x: 750, y: 450, icon: <ShieldAlert size={32} />, color: 'red' },
  ]);

  const connections: Connection[] = [
    { from: 'telemetry', to: 'mastra', color: '#10b981' }, 
    { from: 'mastra', to: 'qdrant', color: '#a855f7' },    
    { from: 'mastra', to: 'gemini', color: '#3b82f6' },    
    { from: 'mastra', to: 'enkrypt', color: '#ef4444' },   
    { from: 'enkrypt', to: 'dashboard', color: '#ef4444' },
    { from: 'telemetry', to: 'dashboard', color: '#10b981' }, 
  ];

  const [draggingNode, setDraggingNode] = useState<string | null>(null);

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    if (activeNode) return; // Prevent drag if a modal is open
    setPointerDownPos({ x: e.clientX, y: e.clientY });
    setDraggingNode(id);
    
    const target = e.currentTarget as HTMLElement;
    if (target.setPointerCapture) {
        target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingNode || !containerRef.current || !isFullscreen || activeNode) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 120; // Adjust for wider card
    const y = e.clientY - rect.top - 50;

    setNodes(prev => prev.map(node => node.id === draggingNode ? { ...node, x, y } : node));
  };

  const handlePointerUp = (id: string, e: React.PointerEvent) => {
    setDraggingNode(null);
    const target = e.currentTarget as HTMLElement;
    if (target.releasePointerCapture) {
        target.releasePointerCapture(e.pointerId);
    }

    if (pointerDownPos) {
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      
      // If pointer moved less than 5px, treat it as a CLICK
      if (dx < 5 && dy < 5) {
        triggerNodeClick(id);
      }
    }
    setPointerDownPos(null);
  };

  const triggerNodeClick = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return;

    // Trigger jump animation
    setJumpingNode(id);
    
    // After 1s animation, open modal and ensure we are in Fullscreen arena
    setTimeout(() => {
      setJumpingNode(null);
      setActiveNode(node);
      setIsFullscreen(true);
    }, 1000);
  };

  useEffect(() => {
    if (isFullscreen && isClient) {
        setNodes(prev => prev.map(node => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            let nx = node.x;
            let ny = node.y;
            
            if (node.id === 'telemetry') { nx = width * 0.1; ny = height * 0.5; }
            if (node.id === 'dashboard') { nx = width * 0.75; ny = height * 0.2; }
            if (node.id === 'mastra') { nx = width * 0.45; ny = height * 0.5; }
            if (node.id === 'qdrant') { nx = width * 0.45; ny = height * 0.85; }
            if (node.id === 'gemini') { nx = width * 0.45; ny = height * 0.15; }
            if (node.id === 'enkrypt') { nx = width * 0.75; ny = height * 0.85; }

            return { ...node, x: nx, y: ny };
        }));
    } else if (!isFullscreen && isClient) {
        setNodes(prev => prev.map(node => {
            let nx = node.x;
            let ny = node.y;
            
            if (node.id === 'telemetry') { nx = 20; ny = 250; }
            if (node.id === 'dashboard') { nx = 720; ny = 50; }
            if (node.id === 'mastra') { nx = 370; ny = 250; }
            if (node.id === 'qdrant') { nx = 370; ny = 450; }
            if (node.id === 'gemini') { nx = 370; ny = 50; }
            if (node.id === 'enkrypt') { nx = 720; ny = 450; }

            return { ...node, x: nx, y: ny };
        }));
    }
  }, [isFullscreen, isClient]);

  const colorMap: Record<string, { card: string, icon: string, bg: string }> = {
    emerald: { card: 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]', icon: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    blue: { card: 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]', icon: 'text-blue-400', bg: 'bg-blue-500/20' },
    purple: { card: 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]', icon: 'text-purple-400', bg: 'bg-purple-500/20' },
    orange: { card: 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)]', icon: 'text-orange-400', bg: 'bg-orange-500/20' },
    red: { card: 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]', icon: 'text-red-400', bg: 'bg-red-500/20' },
  };

  if (!isClient) return null;

  return (
    <div className={`transition-all duration-700 ease-in-out ${isFullscreen ? 'fixed inset-0 z-[9999] bg-gray-950 backdrop-blur-3xl m-0 p-0 overflow-hidden flex flex-col' : 'w-full h-[650px] relative bg-gray-900/40 rounded-3xl border border-gray-800 overflow-hidden'}`}>
      
      {/* Header Panel */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Network className="text-purple-500" />
                System Architecture
            </h2>

        </div>
        {!activeNode && (
            <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-xl transition-all border border-gray-600 shadow-xl cursor-pointer"
            >
                {isFullscreen ? <><Minimize2 size={18} /> Exit Arena</> : <><Maximize2 size={18} /> Launch Arena</>}
            </button>
        )}
      </div>

      {/* Main Interactive Canvas */}
      <div 
        ref={containerRef}
        className={`absolute inset-0 w-full h-full perspective-1000 z-10 ${activeNode ? 'opacity-30 pointer-events-none blur-sm transition-all duration-500' : 'transition-all duration-500'}`}
        onPointerMove={handlePointerMove}
      >
        {/* SVG Neon Tubes Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {connections.map((conn, idx) => {
            const startNode = nodes.find(n => n.id === conn.from);
            const endNode = nodes.find(n => n.id === conn.to);
            if (!startNode || !endNode) return null;

            // Offset to connect roughly at the card borders
            const sx = startNode.x + 120;
            const sy = startNode.y + 50;
            const ex = endNode.x + 120;
            const ey = endNode.y + 50;

            const path = `M ${sx} ${sy} C ${sx + (ex-sx)/2} ${sy}, ${sx + (ex-sx)/2} ${ey}, ${ex} ${ey}`;

            return (
              <g key={idx}>
                <path d={path} fill="none" stroke={conn.color} strokeWidth="6" opacity="0.2" filter="url(#neonGlow)" />
                <path d={path} fill="none" stroke={conn.color} strokeWidth="2" className="animate-pulse" />
                <path d={path} fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="8 24" className="animate-flow" opacity="0.8" />
              </g>
            );
          })}
        </svg>

        {/* Node Cards Layer */}
        {nodes.map(node => {
            const isJumping = jumpingNode === node.id;
            const isDragging = draggingNode === node.id;
            
            return (
                <div
                    key={node.id}
                    onPointerDown={(e) => handlePointerDown(node.id, e)}
                    onPointerUp={(e) => handlePointerUp(node.id, e)}
                    style={{ left: node.x, top: node.y }}
                    className={`
                        absolute z-20 w-[240px] p-5 bg-gray-950/80 backdrop-blur-xl border-2 rounded-2xl
                        flex flex-col items-start gap-3 select-none cursor-pointer
                        ${colorMap[node.color].card}
                        ${isJumping ? 'animate-double-roll-jump z-[999]' : ''}
                        ${!isJumping && !isDragging ? 'transition-all duration-300' : ''}
                        ${!isFullscreen && !isJumping ? 'transform-gpu rotate-y-12 rotate-x-6 hover:rotate-0' : ''}
                        ${isDragging ? 'z-[100] scale-105 shadow-[0_0_50px_rgba(255,255,255,0.2)]' : 'hover:scale-105'}
                    `}
                >
                    <div className="flex items-center gap-3 w-full">
                        <div className={`p-2 rounded-xl border border-white/10 ${colorMap[node.color].bg} ${colorMap[node.color].icon}`}>
                            {node.icon}
                        </div>
                        <span className="font-bold text-white text-lg leading-tight">{node.label}</span>
                    </div>
                    <p className="text-gray-400 text-sm font-medium leading-snug">{node.description}</p>
                </div>
            );
        })}
      </div>

      {/* Full-Screen Node Modal */}
      {activeNode && (
          <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-in fade-in zoom-in duration-300">
              <div className={`relative max-w-3xl w-full bg-gray-950 border-2 rounded-3xl p-12 shadow-2xl ${colorMap[activeNode.color].card}`}>
                  <button 
                      onClick={() => setActiveNode(null)}
                      className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                      <X size={24} />
                  </button>
                  <div className="flex flex-col items-center text-center space-y-8">
                      <div className={`p-8 rounded-full border-2 ${colorMap[activeNode.color].bg} ${colorMap[activeNode.color].icon} border-white/10`}>
                          {React.cloneElement(activeNode.icon as React.ReactElement, { size: 64, width: 64, height: 64 })}
                      </div>
                      <div>
                          <h3 className="text-5xl font-extrabold text-white mb-4">{activeNode.label}</h3>
                          <p className={`text-xl font-bold uppercase tracking-widest ${colorMap[activeNode.color].icon}`}>{activeNode.description}</p>
                      </div>
                      <p className="text-gray-300 text-2xl leading-relaxed max-w-2xl">
                          {activeNode.details}
                      </p>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}
