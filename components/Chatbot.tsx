import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Sparkles, Clock, Hourglass } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToCapy } from '../services/geminiService';
import { STICKERS } from '../constants';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Chào bạn nhỏ! 🍊 Tớ là Capy thông thái đây. Cậu cần tớ giúp gì không? Hỏi tớ đi nào! 🌿',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Biến đếm ngược (giây)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Effect xử lý đếm ngược
  useEffect(() => {
    let interval: any;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSend = async () => {
    // Kiểm tra thêm điều kiện cooldown
    if (!inputText.trim() || isLoading || cooldown > 0) return;

    const currentText = inputText;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: currentText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Gọi hàm service (không cần truyền messages history nữa)
      const responseText = await sendMessageToCapy(currentText);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMsg]);
      
      // Sau khi nhận câu trả lời thành công, kích hoạt đếm ngược 30s
      setCooldown(30);

    } catch (error) {
       console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden flex flex-col flex-1 ring-4 ring-orange-100">
        {/* Header */}
        <div className="bg-orange-400 p-4 md:p-6 flex items-center shadow-sm z-10 relative">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4 border-4 border-orange-300 overflow-hidden relative">
             <img src={STICKERS.CHAT_BOT} alt="Capy Avatar" className="w-full h-full object-cover p-1" />
           </div>
           <div>
             <h2 className="text-white font-black text-2xl font-heading">Capy Thông Thái</h2>
             <p className="text-orange-100 text-sm font-bold opacity-90 flex items-center gap-1 font-body">
                <span className={`w-3 h-3 rounded-full border-2 border-white ${isLoading ? 'bg-yellow-400 animate-bounce' : 'bg-green-400 animate-pulse'}`}></span> 
                {isLoading ? 'Capy đang suy nghĩ...' : 'Đang trực tuyến'}
             </p>
           </div>
           <Sparkles className="text-yellow-200 ml-auto animate-spin-slow" size={32} />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-orange-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm overflow-hidden ${
                  msg.role === 'user' ? 'bg-blue-200 border-blue-300' : 'bg-orange-200 border-orange-300'
                }`}>
                  {msg.role === 'user' ? <User size={24} className="text-blue-600" /> : <img src={STICKERS.CHAT_BOT} alt="Capy" className="w-full h-full object-cover p-1" />}
                </div>

                {/* Bubble */}
                <div className={`p-5 text-lg font-bold leading-relaxed shadow-sm relative font-body ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-[2rem] rounded-br-none' 
                    : 'bg-white text-gray-700 rounded-[2rem] rounded-bl-none border-2 border-orange-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator Bubble */}
          {isLoading && (
            <div className="flex justify-start w-full">
               <div className="flex items-center space-x-2 ml-16 bg-white px-6 py-4 rounded-[2rem] rounded-bl-none shadow-sm border-2 border-orange-100">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white border-t-2 border-gray-100">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={cooldown > 0 || isLoading} // Khóa ô nhập liệu khi đang đếm ngược
              placeholder={cooldown > 0 ? "Capy đang nghỉ ngơi xíu..." : "Nhập câu hỏi cho Capy..."}
              className={`w-full pl-6 pr-20 py-4 border-2 rounded-full font-bold text-lg font-body transition-all ${
                cooldown > 0 
                  ? 'bg-gray-50 border-gray-200 text-gray-400 placeholder-gray-300 cursor-not-allowed' 
                  : 'bg-gray-100 border-transparent text-gray-600 placeholder-gray-400 focus:bg-white focus:border-orange-300 focus:outline-none'
              }`}
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {cooldown > 0 ? (
                // --- ĐỒNG HỒ ĐẾM NGƯỢC ---
                <div className="flex items-center justify-center gap-1 bg-gray-200 text-gray-500 px-4 py-2 rounded-full font-black font-heading animate-pulse select-none cursor-not-allowed h-[46px] min-w-[100px]">
                   <Hourglass size={20} className="animate-spin-slow" />
                   <span>{cooldown}s</span>
                </div>
              ) : (
                // --- NÚT GỬI ---
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputText.trim()}
                  className={`p-3 rounded-full transition-all transform h-[46px] w-[46px] flex items-center justify-center ${
                    isLoading || !inputText.trim() 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-110 shadow-md active:scale-95'
                  }`}
                >
                  <Send size={22} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
          <p className="text-center text-sm font-bold text-gray-400 mt-3 font-body flex items-center justify-center gap-1">
             {cooldown > 0 ? (
                <>⏳ Capy cần nghỉ ngơi một chút để nạp năng lượng cam! 🍊</>
             ) : (
                <>Capy cũng đang học nên đôi khi có thể nhầm lẫn xíu nhé! 🍊</>
             )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;