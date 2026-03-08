'use client';

import React, { useState, useEffect } from 'react';
import { 
    Shield, Activity, Database, Download, RefreshCw, 
    HardDrive, AlertCircle, CheckCircle2, Search,
    GripVertical, Trash2, Settings, Terminal, Plus, X, Server, Link as LinkIcon, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const [databases, setDatabases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [backingUpId, setBackingUpId] = useState<string | null>(null);
    const [newDb, setNewDb] = useState({
        name: '',
        dbType: 'postgres',
        dbUser: 'postgres',
        dbName: 'postgres',
        containerId: '',
        connectionUrl: ''
    });

    useEffect(() => {
        fetchDatabases();
    }, []);

    const fetchDatabases = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/databases');
            const data = await res.json();
            setDatabases(data);
        } catch (error) {
            console.error('Fetch failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddDb = async () => {
        try {
            const res = await fetch('/api/databases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDb)
            });
            if (res.ok) {
                setIsAddModalOpen(false);
                setNewDb({ name: '', dbType: 'postgres', dbUser: 'postgres', dbName: 'postgres', containerId: '', connectionUrl: '' });
                fetchDatabases();
            }
        } catch (error) {
            console.error('Add failed');
        }
    };

    const handleDeleteDb = async (id: string) => {
        if (!confirm('Are you sure you want to delete this database?')) return;
        try {
            await fetch(`/api/databases/${id}`, { method: 'DELETE' });
            fetchDatabases();
        } catch (error) {
            console.error('Delete failed');
        }
    };

    const handleInstantBackup = async (id: string) => {
        setBackingUpId(id);
        try {
            const res = await fetch('/api/backup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Backup Successful: ${data.filename}`);
                fetchDatabases();
            } else {
                alert(`Backup Failed: ${data.error}`);
            }
        } catch (error) {
            alert('Backup Error occurred');
        } finally {
            setBackingUpId(null);
        }
    };

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
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                    >
                        <Plus size={18} /> Register Database
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Monitored DBs', value: databases.length, icon: Database, color: 'blue' },
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
                        <h2 className="text-xl font-black uppercase tracking-tight italic text-blue-500">Fleet Management</h2>
                        <button 
                            onClick={fetchDatabases}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                        >
                            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh List
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {isLoading && databases.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <RefreshCw size={40} className="text-gray-700 animate-spin mx-auto" />
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Querying Active Fleet...</p>
                            </div>
                        ) : databases.length === 0 ? (
                            <div className="p-20 bg-white/[0.02] rounded-[48px] border border-dashed border-white/10 text-center space-y-4">
                                <AlertCircle size={40} className="text-gray-700 mx-auto" />
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">No databases registered for monitoring</p>
                            </div>
                        ) : databases.map((db, i) => (
                            <div key={db.id} className="bg-white/5 border border-white/10 p-8 rounded-[48px] flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-blue-500/30 transition-all">
                                <div className="flex items-center gap-8">
                                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <Database size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black uppercase tracking-tight">{db.name}</h3>
                                            <span className="px-3 py-1 bg-black/40 rounded-lg border border-white/10 text-[8px] font-black text-gray-500 uppercase tracking-widest">{db.dbType}</span>
                                            {db.connectionUrl && <LinkIcon size={12} className="text-emerald-500" />}
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                            {db.connectionUrl ? 'Cloud/Remote Node' : `Container: ${db.containerId?.slice(0, 12)}`} <span className="w-1 h-1 bg-gray-700 rounded-full" /> {db.dbName}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => handleInstantBackup(db.id)}
                                        disabled={backingUpId === db.id}
                                        className="px-8 py-5 bg-white/5 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {backingUpId === db.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                                        Instant Backup
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteDb(db.id)}
                                        className="p-5 bg-white/5 text-gray-500 rounded-[24px] hover:text-red-500 hover:bg-red-500/10 transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Register Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[64px] p-12 lg:p-16 space-y-10 shadow-3xl my-auto"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-blue-500">Register DB</h2>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1">Initialize Monitoring Sequence</p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-gray-500 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 flex items-center gap-2"><Server size={12}/> Connection Identity</label>
                                    <input 
                                        autoFocus
                                        className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 text-base font-black placeholder:text-gray-800 focus:outline-none focus:border-blue-500 uppercase tracking-tight transition-all"
                                        placeholder="Friendly Name (e.g. MeliScribe PROD)"
                                        value={newDb.name}
                                        onChange={e => setNewDb({...newDb, name: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2 flex items-center gap-2"><LinkIcon size={12}/> Connection URL (Recommended)</label>
                                    <input 
                                        className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 text-xs font-mono text-blue-400 placeholder:text-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="postgresql://user:pass@host:port/dbname"
                                        value={newDb.connectionUrl}
                                        onChange={e => setNewDb({...newDb, connectionUrl: e.target.value})}
                                    />
                                    <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest px-2">Leave blank if using local Docker Container ID</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Engine Type</label>
                                        <select 
                                            value={newDb.dbType}
                                            onChange={e => setNewDb({...newDb, dbType: e.target.value})}
                                            className="w-full bg-white/5 border border-white/5 rounded-[24px] p-6 text-xs font-black uppercase focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                                        >
                                            <option value="postgres">PostgreSQL</option>
                                            <option value="mysql">MySQL</option>
                                            <option value="mongo">MongoDB</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Docker ID</label>
                                        <input 
                                            className="w-full bg-white/5 border border-white/5 rounded-[24px] p-6 text-xs font-black placeholder:text-gray-800 focus:outline-none focus:border-blue-500 uppercase tracking-tight"
                                            placeholder="Optional ID"
                                            value={newDb.containerId}
                                            onChange={e => setNewDb({...newDb, containerId: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">DB Username</label>
                                        <input 
                                            className="w-full bg-white/5 border border-white/5 rounded-[24px] p-6 text-xs font-black placeholder:text-gray-800 focus:outline-none focus:border-blue-500"
                                            placeholder="e.g. postgres"
                                            value={newDb.dbUser}
                                            onChange={e => setNewDb({...newDb, dbUser: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Database Name</label>
                                        <input 
                                            className="w-full bg-white/5 border border-white/5 rounded-[24px] p-6 text-xs font-black placeholder:text-gray-800 focus:outline-none focus:border-blue-500"
                                            placeholder="e.g. meliscribe_db"
                                            value={newDb.dbName}
                                            onChange={e => setNewDb({...newDb, dbName: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleAddDb}
                                className="w-full py-7 bg-blue-600 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.4em] shadow-3xl shadow-blue-600/40 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Initiate Guard
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
