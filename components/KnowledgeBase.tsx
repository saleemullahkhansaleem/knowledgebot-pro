
import React, { useState } from 'react';
import { Plus, Trash2, FileText, Search, Upload, Database } from 'lucide-react';
import { KnowledgeItem } from '../types';

interface KnowledgeBaseProps {
  knowledge: KnowledgeItem[];
  onAddItem: (item: Omit<KnowledgeItem, 'id' | 'createdAt'>) => void;
  onDeleteItem: (id: string) => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ knowledge, onAddItem, onDeleteItem }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredKnowledge = knowledge.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    onAddItem({ title: newTitle, content: newContent, type: 'text' });
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onAddItem({ title: file.name, content: content, type: 'file' });
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 h-full flex flex-col max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Knowledge Base</h2>
          <p className="text-slate-400">Manage the data your AI chatbot uses for its responses.</p>
        </div>
        <div className="flex gap-4">
           <label className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer border border-slate-700">
            <Upload className="w-5 h-5" />
            <span>Import File</span>
            <input type="file" className="hidden" accept=".txt,.md,.json" onChange={handleFileUpload} />
          </label>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Snippet</span>
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search your knowledge base..." 
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2">
        {filteredKnowledge.length === 0 ? (
          <div className="col-span-full py-20 text-center glass rounded-2xl border-dashed">
            {/* Fix: Added Database icon to the imports from lucide-react */}
            <Database className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300">No knowledge items found</h3>
            <p className="text-slate-500">Start by adding a text snippet or importing a document.</p>
          </div>
        ) : (
          filteredKnowledge.map((item) => (
            <div key={item.id} className="glass p-6 rounded-2xl group hover:border-blue-500/30 transition-all flex flex-col h-64">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-100 truncate max-w-[200px]">{item.title}</h3>
                </div>
                <button 
                  onClick={() => onDeleteItem(item.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-400 text-sm line-clamp-6 flex-1 italic">
                "{item.content}"
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700/50 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6">Add Knowledge Snippet</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Source Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none"
                    placeholder="e.g., Company Handbook v1.2"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Content Context</label>
                  <textarea 
                    required
                    rows={8}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none"
                    placeholder="Paste or type the information the AI should know..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all"
                  >
                    Save to Database
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
