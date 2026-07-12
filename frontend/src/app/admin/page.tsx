import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ShieldAlert, Users, Key, Zap } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Strictly enforce Admin RBAC
  if (!session || !session.user || session.user.email !== 'admin@dauntless.ops') {
    redirect('/login');
  }

  // Fetch all users and their API keys
  const users = await prisma.user.findMany({
    include: {
        apiKeys: true
    },
    orderBy: {
        id: 'asc'
    }
  });

  const totalKeys = users.reduce((acc, user) => acc + user.apiKeys.length, 0);

  return (
    <div className="min-h-screen bg-gray-950 p-8 pt-24 relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-900/20 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
            {/* Header */}
            <div className="bg-gray-900/80 backdrop-blur-xl border border-red-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.1)] flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                        <ShieldAlert className="text-red-500" size={36} /> Super Admin Control Panel
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Welcome back, Admin. Here are the global SaaS metrics.</p>
                </div>
                <div className="flex gap-6">
                    <div className="bg-black/50 border border-gray-800 p-4 rounded-2xl text-center min-w-[120px]">
                        <div className="text-gray-400 text-sm font-bold flex justify-center items-center gap-2 mb-1"><Users size={16}/> Total Users</div>
                        <div className="text-3xl font-black text-white">{users.length}</div>
                    </div>
                    <div className="bg-black/50 border border-gray-800 p-4 rounded-2xl text-center min-w-[120px]">
                        <div className="text-gray-400 text-sm font-bold flex justify-center items-center gap-2 mb-1"><Key size={16}/> Total Keys</div>
                        <div className="text-3xl font-black text-white">{totalKeys}</div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/40">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <Users className="text-blue-500" /> Registered Users
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-950/50 text-gray-400 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">User</th>
                                <th className="px-6 py-4 font-bold">Email</th>
                                <th className="px-6 py-4 font-bold">Plan</th>
                                <th className="px-6 py-4 font-bold">Keys Generated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                                                {u.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <span className="font-semibold text-gray-200">{u.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-gray-400">{u.email}</td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                            u.plan === 'ENTERPRISE' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                                            u.plan === 'PRO' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                            'bg-gray-800 text-gray-400 border border-gray-700'
                                        }`}>
                                            <Zap size={12} /> {u.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-2">
                                            {u.apiKeys.length > 0 ? (
                                                u.apiKeys.map(key => (
                                                    <div key={key.id} className="flex items-center gap-2">
                                                        <Key size={14} className="text-purple-500" />
                                                        <span className="font-mono bg-black px-3 py-1 rounded-lg border border-gray-800 text-gray-300 text-xs">
                                                            {key.keyHash}
                                                        </span>
                                                        <span className="text-xs text-gray-500 hidden md:inline">({key.name})</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-gray-600 text-xs italic">No keys</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No users have registered yet.
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
