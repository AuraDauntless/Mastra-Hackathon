import { create } from 'zustand';

interface TelemetryState {
    logs: string[];
    proposedPlan: any | null;
    status: 'IDLE' | 'ANALYZING' | 'PENDING_APPROVAL' | 'RESOLVED';
    addLog: (log: string) => void;
    setProposedPlan: (plan: any) => void;
    setStatus: (status: 'IDLE' | 'ANALYZING' | 'PENDING_APPROVAL' | 'RESOLVED') => void;
}

export const useStore = create<TelemetryState>((set) => ({
    logs: [],
    proposedPlan: null,
    status: 'IDLE',
    addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
    setProposedPlan: (plan) => set({ proposedPlan: plan }),
    setStatus: (status) => set({ status })
}));
