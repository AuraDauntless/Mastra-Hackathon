import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CreditCard, Key, Activity, Settings, Zap } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function BillingDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // Fetch user from DB to get their plan and API keys
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { apiKeys: true }
  });

  if (!user) {
    redirect('/login');
  }

  const isPro = user.plan !== 'FREE';

  return (
    <div className="min-h-screen bg-gray-950 p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}</h1>
            <p className="text-gray-400">Manage your Dauntless Ops API limits and billing.</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${isPro ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}>
              <Zap size={16} /> {user.plan} PLAN
            </div>
            {!isPro && (
              <div className="mt-4">
                <Link href="/pricing" className="text-sm font-bold text-purple-400 hover:text-purple-300">Upgrade to Pro &rarr;</Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* API Usage */}
          <div className="md:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Activity className="text-blue-500" /> API Usage This Month
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Requests</span>
                <span>{user.apiRequests.toLocaleString()} / {isPro ? '50,000' : '100'}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div className={`h-3 rounded-full ${isPro ? 'bg-purple-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((user.apiRequests / (isPro ? 50000 : 100)) * 100, 100)}%` }}></div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Vector Storage (Qdrant)</span>
                <span>{(user.vectorStorageBytes / 1024 / 1024 / 1024).toFixed(2)}GB / {isPro ? '500GB' : '10GB'}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${Math.min((user.vectorStorageBytes / (isPro ? 500 * 1024 ** 3 : 10 * 1024 ** 3)) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Billing Info */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <CreditCard className="text-emerald-500" /> Payment Method
              </h2>
              
              <div className="text-gray-400 text-sm mb-6">
                No payment method on file.
              </div>
            </div>

            <button className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Settings size={18} /> Manage Subscription
            </button>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Key className="text-orange-500" /> Secret API Keys
            </h2>
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm">
              + Generate New Key
            </button>
          </div>
          
          <p className="text-gray-400 text-sm mb-6">These keys allow your servers to ingest telemetry into Dauntless Ops.</p>
          
          <div className="bg-gray-950 rounded-xl overflow-hidden border border-gray-800">
            <table className="w-full text-left">
              <thead className="bg-gray-900 text-gray-400 text-sm">
                <tr>
                  <th className="p-4 font-medium">NAME</th>
                  <th className="p-4 font-medium">SECRET KEY</th>
                  <th className="p-4 font-medium">CREATED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {user.apiKeys.length > 0 ? (
                  user.apiKeys.map(key => (
                    <tr key={key.id} className="text-gray-300">
                      <td className="p-4">{key.name}</td>
                      <td className="p-4 font-mono">••••••••••••••••</td>
                      <td className="p-4">{new Date(key.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                      No API keys generated yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
