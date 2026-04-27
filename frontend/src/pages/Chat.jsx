import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Send, User } from 'lucide-react';
import io from 'socket.io-client';

export default function Chat() {
  const { swapId } = useParams();
  const [messages, setMessages] = useState([
    { id: 1, senderId: 2, text: "Hey! I saw we matched. I'd love to learn React from you.", time: "10:00 AM" },
    { id: 2, senderId: 1, text: "Hi! That sounds great. I'm looking for Python help.", time: "10:05 AM" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // In a real implementation, we would connect socket.io here
  // const socket = io(import.meta.env.VITE_API_URL);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      senderId: 1, // Assume 1 is our ID for this demo
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-4rem)]">
        <div className="bg-white flex-grow rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center border border-primary-200">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Alice Smith</h2>
              <p className="text-xs text-emerald-600 font-medium">● Online</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            <div className="text-center">
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Today</span>
            </div>
            
            {messages.map((msg) => {
              const isMe = msg.senderId === 1;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-sm'}`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-200' : 'text-slate-400'}`}>{msg.time}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
              />
              <button 
                type="submit" 
                className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
