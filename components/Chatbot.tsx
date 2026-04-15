
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Sparkles, Clock, Hourglass, Mic, MicOff, Volume2, X } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToCapy } from '../services/geminiService';
import { STICKERS, AUDIO_CLIPS } from '../constants';

// Mở rộng Window interface để hỗ trợ Web Speech API trong TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

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
  const [isListening, setIsListening] = useState(false); // Trạng thái đang nghe
  const [isPlayingAvatarAudio, setIsPlayingAvatarAudio] = useState(false); // Trạng thái avatar nói (Header)
  const [isPlayingMascotAudio, setIsPlayingMascotAudio] = useState(false); // Trạng thái mascot nói (Bottom right)
  const [showTTSModal, setShowTTSModal] = useState(false); // Trạng thái hiện modal lỗi TTS
  const [ttsErrorType, setTtsErrorType] = useState<'not_supported' | 'missing_voice'>('missing_voice'); // Loại lỗi TTS
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

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

  // Khởi tạo Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Dừng sau khi nói xong 1 câu
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'vi-VN'; // Ngôn ngữ Tiếng Việt

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        
        // Xử lý các lỗi phổ biến của Web Speech API
        if (event.error === 'network') {
          alert("Lỗi mạng: Trình duyệt không thể kết nối với máy chủ nhận diện giọng nói. Vui lòng kiểm tra lại Internet hoặc thử gõ phím nhé! 🌐");
        } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          alert("Trình duyệt đang chặn Micro. Cậu hãy nhấn vào biểu tượng ổ khóa trên thanh địa chỉ và cấp quyền Micro cho trang web nhé! 🎤");
        } else if (event.error === 'no-speech') {
          // Bỏ qua lỗi không có giọng nói (chỉ là do người dùng chưa nói gì)
        } else {
          alert(`Lỗi micro (${event.error}). Cậu thử tải lại trang xem sao nhé!`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isLoading || cooldown > 0) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error("Microphone start failed:", error);
        }
      } else {
        alert("Trình duyệt của bạn chưa hỗ trợ giọng nói. Hãy thử dùng Chrome nhé! 🎤");
      }
    }
  };

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

  const handlePlayAvatarAudio = () => {
    if (isPlayingAvatarAudio) return;

    setIsPlayingAvatarAudio(true);
    const audio = new Audio(AUDIO_CLIPS.SECTION_CHATBOT);
    
    audio.onended = () => {
      setIsPlayingAvatarAudio(false);
    };

    audio.play().catch(e => {
        console.error("Play avatar audio failed", e);
        setIsPlayingAvatarAudio(false);
    });
  }

  const handlePlayMascotAudio = () => {
    if (isPlayingMascotAudio) return;

    setIsPlayingMascotAudio(true);
    const audio = new Audio(AUDIO_CLIPS.SECTION_CHATBOT);
    
    audio.onended = () => {
      setIsPlayingMascotAudio(false);
    };

    audio.play().catch(e => {
        console.error("Play mascot audio failed", e);
        setIsPlayingMascotAudio(false);
    });
  }

  const speakText = async (text: string) => {
    // 1. Nếu đang phát âm thanh, bấm lại sẽ TẮT
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 2. Lấy toàn bộ văn bản (do không còn cấu trúc --- 🇬🇧 nữa)
    const cleanText = text.trim();

    // 3. Nhận diện ngôn ngữ đơn giản (nếu có dấu tiếng Việt -> Tiếng Việt, ngược lại -> Tiếng Anh)
    const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(cleanText);
    const langCode = isVietnamese ? 'vi' : 'en';

    // Hàm chia nhỏ văn bản để không bị lỗi giới hạn ký tự của Google TTS
    const splitTextIntoChunks = (text: string, maxLength: number = 200): string[] => {
      const chunks: string[] = [];
      const sentences = text.match(/[^,.:;!?\n]+[,.:;!?\n]*/g) || [text];
      for (let sentence of sentences) {
        sentence = sentence.trim();
        if (!sentence) continue;
        if (sentence.length <= maxLength) {
          chunks.push(sentence);
        } else {
          const words = sentence.split(' ');
          let currentChunk = '';
          for (const word of words) {
            if ((currentChunk + ' ' + word).length <= maxLength) {
              currentChunk += (currentChunk ? ' ' : '') + word;
            } else {
              if (currentChunk) chunks.push(currentChunk);
              currentChunk = word;
            }
          }
          if (currentChunk) chunks.push(currentChunk);
        }
      }
      return chunks;
    };

    // 4. PHƯƠNG ÁN MỚI: Dùng Google Translate TTS API
    try {
      const chunks = splitTextIntoChunks(cleanText, 200);
      
      // Tạo 1 thẻ audio duy nhất để tránh lỗi chặn autoplay trên trình duyệt
      const audio = document.createElement('audio');
      audio.setAttribute('referrerpolicy', 'no-referrer'); // Quan trọng: Tránh bị Google chặn do CORS/Referer
      currentAudioRef.current = audio;
      
      for (const chunk of chunks) {
        if (!chunk.trim()) continue;
        if (!currentAudioRef.current) break; // Nếu user bấm tắt giữa chừng
        
        // Dùng client=tw-ob ổn định hơn gtx. Truyền đúng mã ngôn ngữ (vi hoặc en)
        const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encodeURIComponent(chunk.trim())}`;
        audio.src = url;
        
        await new Promise((resolve, reject) => {
          audio.onended = resolve;
          audio.onerror = reject;
          audio.play().catch(reject);
        });
      }
      currentAudioRef.current = null;
      return; // Thành công thì thoát
    } catch (error) {
      console.warn("Google TTS API bị lỗi, chuyển sang dùng giọng của máy tính", error);
      currentAudioRef.current = null;
    }

    // 5. PHƯƠNG ÁN DỰ PHÒNG: Dùng Web Speech API của trình duyệt
    if (!('speechSynthesis' in window)) {
      setTtsErrorType('not_supported');
      setShowTTSModal(true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isVietnamese ? 'vi-VN' : 'en-US';
    
    const playVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      let selectedVoice;
      if (isVietnamese) {
        // Lọc chính xác giọng tiếng Việt
        const viVoices = voices.filter(v => v.lang === 'vi-VN' || v.lang === 'vi_VN' || v.lang === 'vi' || v.name.includes('Vietnamese') || v.name.includes('Tiếng Việt'));
        if (viVoices.length > 0) {
          selectedVoice = viVoices.find(v => v.name.includes('Google')) || viVoices[0];
        }
      } else {
        // Lọc giọng tiếng Anh
        const enVoices = voices.filter(v => v.lang.startsWith('en'));
        if (enVoices.length > 0) {
          selectedVoice = enVoices.find(v => v.name.includes('Google')) || enVoices[0];
        }
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        window.speechSynthesis.speak(utterance);
      } else {
        // TUYỆT ĐỐI KHÔNG ĐỌC NẾU KHÔNG CÓ GIỌNG PHÙ HỢP
        setTtsErrorType('missing_voice');
        setShowTTSModal(true);
      }
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', playVoice, { once: true });
    } else {
      playVoice();
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto p-4 relative">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden flex flex-col flex-1 ring-4 ring-orange-100">
        {/* Header */}
        <div className="bg-orange-400 p-4 md:p-6 flex items-center shadow-sm z-10 relative">
           <div 
             className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4 border-4 border-orange-300 overflow-hidden relative cursor-pointer group"
             onClick={handlePlayAvatarAudio}
           >
             <img 
               src={STICKERS.CHAT_BOT} 
               alt="Capy Avatar" 
               className={`w-full h-full object-cover p-1 transition-transform duration-300 ${isPlayingAvatarAudio ? 'scale-110 animate-[bounce_0.3s_infinite]' : 'group-hover:scale-110'}`} 
             />
             
             {/* Hint Tooltip */}
             <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md whitespace-nowrap transition-opacity duration-300 pointer-events-none border border-orange-200 w-max z-20 ${isPlayingAvatarAudio ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {isPlayingAvatarAudio ? 'Đang nói... 🔊' : 'Chào cậu! 👋'}
             </div>
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
                <div className={`p-5 text-lg font-bold leading-relaxed shadow-sm relative font-body whitespace-pre-wrap group ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-[2rem] rounded-br-none' 
                    : 'bg-white text-gray-700 rounded-[2rem] rounded-bl-none border-2 border-orange-100'
                }`}>
                  {msg.text}
                  
                  {/* Nút đọc văn bản (Chỉ hiện cho tin nhắn của bot) */}
                  {msg.role === 'model' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="absolute -right-3 -bottom-3 bg-orange-100 text-orange-500 p-2 rounded-full shadow-md hover:bg-orange-200 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Đọc tin nhắn này"
                    >
                      <Volume2 size={18} strokeWidth={2.5} />
                    </button>
                  )}
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
            {/* Input Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={cooldown > 0 || isLoading || isListening} 
              placeholder={
                isListening 
                  ? "Đang nghe bé nói..." 
                  : (cooldown > 0 ? "Capy đang nghỉ ngơi xíu..." : "Nhập câu hỏi hoặc bấm micro...")
              }
              className={`w-full pl-6 pr-32 py-4 border-2 rounded-full font-bold text-lg font-body transition-all ${
                isListening
                  ? 'bg-green-50 border-green-300 text-green-700 placeholder-green-500'
                  : (cooldown > 0 
                      ? 'bg-gray-50 border-gray-200 text-gray-400 placeholder-gray-300 cursor-not-allowed' 
                      : 'bg-gray-100 border-transparent text-gray-600 placeholder-gray-400 focus:bg-white focus:border-orange-300 focus:outline-none'
                    )
              }`}
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {cooldown > 0 ? (
                // --- ĐỒNG HỒ ĐẾM NGƯỢC ---
                <div className="flex items-center justify-center gap-1 bg-gray-200 text-gray-500 px-4 py-2 rounded-full font-black font-heading animate-pulse select-none cursor-not-allowed h-[46px] min-w-[100px]">
                   <Hourglass size={20} className="animate-spin-slow" />
                   <span>{cooldown}s</span>
                </div>
              ) : (
                <>
                  {/* --- NÚT MICROPHONE (VOICE) --- */}
                  <button
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`p-3 rounded-full transition-all transform h-[46px] w-[46px] flex items-center justify-center relative ${
                      isListening
                        ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse scale-110'
                        : 'bg-blue-100 text-blue-500 hover:bg-blue-200 hover:scale-105 active:scale-95'
                    }`}
                    title="Nói chuyện với Capy"
                  >
                     {isListening ? (
                       <>
                         <span className="absolute w-full h-full rounded-full border-4 border-red-300 animate-ping opacity-75"></span>
                         <MicOff size={22} strokeWidth={2.5} />
                       </>
                     ) : (
                       <Mic size={22} strokeWidth={2.5} />
                     )}
                  </button>

                  {/* --- NÚT GỬI --- */}
                  <button
                    onClick={handleSend}
                    disabled={isLoading || (!inputText.trim() && !isListening)}
                    className={`p-3 rounded-full transition-all transform h-[46px] w-[46px] flex items-center justify-center ${
                      isLoading || (!inputText.trim() && !isListening)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-110 shadow-md active:scale-95'
                    }`}
                  >
                    <Send size={22} strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Status Text */}
          <div className="min-h-[24px] mt-3">
             <p className={`text-center text-sm font-bold font-body flex items-center justify-center gap-1 transition-colors ${isListening ? 'text-green-600 animate-pulse' : 'text-gray-400'}`}>
               {isListening ? (
                 <>🎙️ Capy đang vểnh tai nghe nè... Bé nói đi!</>
               ) : (
                 cooldown > 0 ? (
                    <>⏳ Capy cần nghỉ ngơi một chút để nạp năng lượng cam! 🍊</>
                 ) : (
                    <>Capy cũng đang học nên đôi khi có thể nhầm lẫn xíu nhé! 🍊</>
                 )
               )}
             </p>
          </div>
        </div>
      </div>

      {/* --- TALKING MASCOT (Fixed Bottom Right) --- */}
      <div 
        className="fixed bottom-6 right-6 z-40 cursor-pointer group flex flex-col items-end"
        onClick={handlePlayMascotAudio}
      >
         {/* Speech Bubble Hint */}
         <div className={`bg-white text-orange-600 px-4 py-2 rounded-2xl rounded-br-none shadow-lg border-2 border-orange-200 font-heading font-extrabold mb-2 mr-4 transition-all duration-300 transform ${isPlayingMascotAudio ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 origin-bottom-right'}`}>
            {isPlayingMascotAudio ? 'Đang nói nè... 🔊' : 'Bấm vào tớ đi! 👋'}
         </div>

         <div className="relative">
           {/* Mascot Image - Sử dụng cùng hình nhân vật như trang chủ */}
           <img 
             src={STICKERS.HOME_TALKING_MASCOT} 
             alt="Talking Mascot" 
             className={`w-28 md:w-36 drop-shadow-2xl transition-transform duration-300 ${isPlayingMascotAudio ? 'animate-[bounce_0.5s_infinite] scale-110' : 'group-hover:scale-110 group-hover:-rotate-3'}`}
           />
           
           {/* Sound Wave Animation (When Playing) */}
           {isPlayingMascotAudio && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1.5 shadow-md animate-pulse">
                 <Volume2 size={20} className="text-orange-500" />
              </div>
           )}
         </div>
      </div>

      {/* --- TTS ERROR MODAL --- */}
      {showTTSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-6 md:p-8 relative border-4 border-orange-200 animate-[bounce_0.3s_ease-out]">
            <button 
              onClick={() => setShowTTSModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-orange-500 transition-colors bg-gray-100 hover:bg-orange-100 rounded-full p-1"
            >
              <X size={24} strokeWidth={3} />
            </button>
            
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4 border-4 border-orange-200">
                <img src={STICKERS.CHAT_BOT} alt="Capy" className="w-20 h-20 object-cover grayscale opacity-80" />
              </div>
              <h3 className="text-2xl font-black text-orange-600 font-heading mb-3">Ôi không! Capy bị mất giọng 🍊💦</h3>
              
              {ttsErrorType === 'not_supported' ? (
                <p className="text-gray-600 font-body font-bold mb-4">
                  Trình duyệt của cậu quá cũ và không hỗ trợ tính năng đọc văn bản. Hãy thử dùng Google Chrome phiên bản mới nhất nhé!
                </p>
              ) : (
                <div className="text-left w-full space-y-4">
                  <p className="text-gray-600 font-body font-bold text-sm text-center">
                    Máy tính của cậu chưa có giọng Tiếng Việt. Rất tiếc là trang web <span className="text-red-500">không thể tự cài đặt</span> giúp cậu vì lý do bảo mật của trình duyệt.
                  </p>
                  <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-100">
                    <p className="font-heading font-bold text-orange-800 mb-2 text-lg">Cậu nhờ người lớn cài theo cách này nhé:</p>
                    <ul className="text-sm font-body font-bold text-gray-600 space-y-3 list-disc pl-5">
                      <li><strong className="text-blue-600">Máy tính Windows:</strong> Mở Cài đặt (Settings) &gt; Time & Language &gt; Speech &gt; Add voices &gt; Tìm và thêm "Tiếng Việt".</li>
                      <li><strong className="text-gray-800">Macbook / iPad:</strong> Mở Cài đặt (Settings) &gt; Accessibility &gt; Spoken Content &gt; System Voice &gt; Thêm "Tiếng Việt".</li>
                    </ul>
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setShowTTSModal(false)}
                className="mt-6 bg-orange-500 text-white font-heading font-black text-lg px-8 py-3 rounded-full hover:bg-orange-600 hover:scale-105 transition-all shadow-[0_4px_0_rgb(194,65,12)] active:shadow-none active:translate-y-1"
              >
                Tớ hiểu rồi!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
