'use client';

import React from 'react';
import { Shield, Cloud, Send, HardDrive, Plus, Trash2 } from 'lucide-react';

export default function Destinations() {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-3xl font-black uppercase tracking-tight italic border-b border-white/5 pb-8">Backup Destinations</h1>
        <div className="grid gap-6">
          {/* Gitea */}
          <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] flex items-center justify-between group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-8">
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500">
                <Cloud size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase">Gitea (Private Git)</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Status: Connected</p>
              </div>
            </div>
            <button className="p-4 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
          </div>

          {/* Telegram */}
          <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] flex items-center justify-between group hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-8">
              <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500">
                <Send size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase">Telegram Channel</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Status: Active</p>
              </div>
            </div>
            <button className="p-4 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
          </div>

          <button className="w-full py-10 border-2 border-dashed border-white/5 rounded-[48px] text-gray-600 hover:border-white/20 hover:text-white transition-all flex flex-col items-center gap-4">
            <Plus size={32} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Register New Destination</span>
          </button>
        </div>
      </div>
    </main>
  );
}
