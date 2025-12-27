
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage, KnowledgeItem } from '../types.ts';
import { geminiService } from '../services/geminiService.ts';

interface ChatInterfaceProps {
  knowledge: KnowledgeItem[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ knowledge }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await geminiService.generateResponse(input, messages, knowledge);
      
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: aiResponse,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'model',
        content: "I encountered an error while processing your request. Please check your API configuration.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Brain Assistant</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Knowledge Context Active</span>
            </div>
          </div>
        </div>
        <div className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full text-slate-500 border border-slate-700">
          {knowledge.length} Documents Linked
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
            <Bot className="w-16 h-16 text-blue-400" />
            <div className="text-center">
              <h3 className="text-xl font-semibold">Welcome to your Personal Brain</h3>
              <p className="max-w-sm">Ask anything based on your connected knowledge base. I'll summarize, explain, or find specific details for you.</p>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-indigo-600' : 'bg-slate-700'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'glass text-slate-100 rounded-tl-none leading-relaxed'
              }`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
                <div className={`text-[10px] mt-2 opacity-60 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass rounded-2xl rounded-tl-none px-6 py-4 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-slate-400 text-sm animate-pulse">Thinking through your knowledge base...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6">
        <form onSubmit={handleSendMessage} className="relative">
          <input 
            type="text" 
            placeholder={knowledge.length > 0 ? "Ask a question about your knowledge base..." : "Please add knowledge items first..."}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl py-5 px-6 pr-20 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500/50 transition-all text-white placeholder-slate-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-widest font-bold">
          Powered by Gemini AI • Context-Aware Responses
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
