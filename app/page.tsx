'use client';

import React, { useState, useEffect } from 'react';
import { 
    Shield, Activity, Database, Download, RefreshCw, 
    HardDrive, AlertCircle, CheckCircle2, Search,
    GripVertical, Trash2, Settings, Terminal
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [databases, setDatabases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/discovery')
            .then(res => res.json())
            .then(data => {
                setDatabases(data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans tracking-tight">
            {/* Background Accents */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-[1400px] mx-auto p-8 lg:p-12 space-y-12 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] flex items-center justify-center shadow-2xl shadow-blue-500/20">
                            <Shield size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight uppercase italic leading-none">AyrisVult</h1>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2">Sovereign Database Guard</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                            <Activity size={18} className="text-emerald-500 animate-pulse" />
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Node Status</p>
                                <p className="text-xs font-black text-white mt-1 uppercase">Synchronized</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Active DBs', value: databases.length, icon: Database, color: 'blue' },
                        { label: 'Storage Used', value: '4.2 GB', icon: HardDrive, color: 'emerald' },
                        { label: 'Last Sweep', value: '14m ago', icon: RefreshCw, color: 'orange' },
                        { label: 'Security Health', value: '100%', icon: Shield, color: 'purple' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] space-y-6 hover:border-white/10 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] group-hover:text-blue-400 transition-colors">{stat.label}</p>
                                <stat.icon size={20} className="text-gray-600 group-hover:scale-110 transition-transform" />
                            </div>
                            <h3 className="text-4xl font-black tracking-tighter italic">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Main Content: Database List */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-xl font-black uppercase tracking-tight italic">Detected Containers</h2>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                            <RefreshCw size={14} /> Scan Server
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {isLoading ? (
                            <div className="p-20 text-center space-y-4">
                                <RefreshCw size={40} className="text-gray-700 animate-spin mx-auto" />
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Mapping Docker Socket...</p>
                            </div>
                        ) : databases.length === 0 ? (
                            <div className="p-20 bg-white/[0.02] rounded-[48px] border border-dashed border-white/10 text-center space-y-4">
                                <AlertCircle size={40} className="text-gray-700 mx-auto" />
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">No supported databases found</p>
                            </div>
                        ) : databases.map((db, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[48px] flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-blue-500/30 transition-all">
                                <div className="flex items-center gap-8">
                                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <Database size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">{db.Names[0].replace('/', '')}</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                            {db.Image} <span className="w-1 h-1 bg-gray-700 rounded-full" /> {db.State.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="px-6 py-3 bg-black/40 rounded-2xl border border-white/5 text-right hidden xl:block">
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Memory</p>
                                        <p className="text-xs font-black text-gray-400 mt-0.5 uppercase">Low Pressure</p>
                                    </div>
                                    <button className="px-8 py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
                                        <Download size={16} /> Instant Backup
                                    </button>
                                    <button className="p-5 bg-white/5 text-gray-500 rounded-[24px] hover:text-white hover:bg-white/10 transition-all">
                                        <Settings size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">© 2026 AyrisVult Systems. All Rights Reserved.</p>
                    <div className="flex items-center gap-6">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Sovereignty Level: <span className="text-blue-500 italic">Absolute</span></p>
                    </div>
                </footer>
            </div>
        </main>
    );
}
