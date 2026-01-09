
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { UserStats } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
}

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose, userStats }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Greetings, Seeker. I am your Zen Coach. Your focus is currently Level ${userStats.level}. How can I assist your journey today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are the "Zen Coach" for a productivity app called Zen Producer. 
          The user is at Level ${userStats.level} with a streak of ${userStats.streak} days.
          Your tone is calm, wise, minimalist, and encouraging. 
          Use metaphors related to nature, flow, and mastery. 
          Keep responses concise (max 2-3 paragraphs). 
          Help users prioritize tasks, overcome procrastination, or find focus. 
          If they seem overwhelmed, suggest taking a breath or simplifying their list.`,
        },
      });

      const response = await chat.sendMessageStream({ message: userMessage });
      
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of response) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            const others = prev.slice(0, -1);
            return [...others, { ...last, text: fullText }];
          });
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "I apologize, but my connection to the ether is weak. Let us try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] sm:h-[600px] animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-600 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight leading-none">Zen Coach</h3>
              <span className="text-[10px] font-medium opacity-80 uppercase tracking-widest">Mastery Mentor</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {m.text || (isLoading && i === messages.length - 1 ? <Loader2 size={16} className="animate-spin" /> : '')}
                </div>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length-1].role === 'user' && (
            <div className="flex justify-start animate-pulse">
               <div className="flex gap-3 items-center">
                 <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Sparkles size={14} className="text-gray-400" />
                 </div>
                 <div className="bg-gray-50 h-10 w-24 rounded-2xl border border-gray-100 flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-50 bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Seek guidance..."
              className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-20 disabled:scale-95 shadow-lg active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-[10px] text-center text-gray-400 mt-3 font-medium uppercase tracking-[0.2em]">
            Harmonized by Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
};
