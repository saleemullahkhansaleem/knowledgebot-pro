
import React from 'react';
import { MessageSquare, Database, Settings, BrainCircuit } from 'lucide-react';
import { ViewMode } from '../types.ts';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: ViewMode.CHAT, icon: MessageSquare, label: 'Chatbot' },
    { id: ViewMode.KNOWLEDGE, icon: Database, label: 'Knowledge Base' },
    { id: ViewMode.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 glass h-screen flex flex-col border-r border-slate-700/50">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">KB Pro</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-300">AI Engine Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
