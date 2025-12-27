import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import ChatInterface from './components/ChatInterface.tsx';
import KnowledgeBase from './components/KnowledgeBase.tsx';
import { ViewMode, KnowledgeItem } from './types.ts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.CHAT);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('kb_pro_knowledge');
    if (saved) {
      try {
        setKnowledge(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse knowledge base", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kb_pro_knowledge', JSON.stringify(knowledge));
  }, [knowledge]);

  const addKnowledgeItem = (item: Omit<KnowledgeItem, 'id' | 'createdAt'>) => {
    const newItem: KnowledgeItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setKnowledge(prev => [newItem, ...prev]);
  };

  const deleteKnowledgeItem = (id: string) => {
    setKnowledge(prev => prev.filter(item => item.id !== id));
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewMode.CHAT:
        return <ChatInterface knowledge={knowledge} />;
      case ViewMode.KNOWLEDGE:
        return (
          <KnowledgeBase 
            knowledge={knowledge} 
            onAddItem={addKnowledgeItem} 
            onDeleteItem={deleteKnowledgeItem} 
          />
        );
      case ViewMode.SETTINGS:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-3xl font-bold mb-4">Settings</h2>
            <div className="glass p-8 rounded-3xl max-w-md w-full">
              <p className="text-slate-400 mb-6">Application configuration and local storage management.</p>
              <div className="space-y-4 text-left">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Database</p>
                  <p className="text-sm font-medium text-blue-400">Browser Local Storage</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Knowledge Items</p>
                  <p className="text-sm font-medium text-emerald-400">{knowledge.length} items synced</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <ChatInterface knowledge={knowledge} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 h-screen overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;