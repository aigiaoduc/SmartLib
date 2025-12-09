import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ResourceGrid from './components/ResourceGrid';
import WorksheetView from './components/WorksheetView';
import Chatbot from './components/Chatbot';
import { ViewState, ResourceItem, Worksheet } from './types';
import { SHEET_URLS, MOCK_VIDEOS, MOCK_EBOOKS, MOCK_LECTURES, MOCK_WORKSHEETS, STICKERS, AUDIO_CLIPS } from './constants';
import { fetchSheetData, fetchWorksheetData } from './services/dataService';
import { Menu, Star, Music, BookOpen, Bot, Volume2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videos, setVideos] = useState<ResourceItem[]>(MOCK_VIDEOS);
  const [books, setBooks] = useState<ResourceItem[]>(MOCK_EBOOKS);
  const [lectures, setLectures] = useState<ResourceItem[]>(MOCK_LECTURES);
  const [worksheets, setWorksheets] = useState<Worksheet[]>(MOCK_WORKSHEETS);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const fetchedVideos = await fetchSheetData(SHEET_URLS.VIDEOS, MOCK_VIDEOS);
      const fetchedBooks = await fetchSheetData(SHEET_URLS.EBOOKS, MOCK_EBOOKS);
      const fetchedLectures = await fetchSheetData(SHEET_URLS.LECTURES, MOCK_LECTURES);
      const fetchedWorksheets = await fetchWorksheetData(SHEET_URLS.WORKSHEETS, MOCK_WORKSHEETS);
      
      setVideos(fetchedVideos);
      setBooks(fetchedBooks);
      setLectures(fetchedLectures);
      setWorksheets(fetchedWorksheets);
    };
    loadData();
  }, []);

  const handlePlayMascotAudio = () => {
    if (isPlaying) return; // Tránh spam click
    
    setIsPlaying(true);
    const audio = new Audio(AUDIO_CLIPS.HOME_WELCOME);
    
    audio.onended = () => {
      setIsPlaying(false);
    };

    audio.play().catch(error => {
      console.error("Audio playback failed:", error);
      setIsPlaying(false);
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.HOME:
        return (
          <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-4 pb-20 relative">
            {/* Hero Banner - Big Text & Balanced Capy Version */}
            {/* Giữ nguyên màu nóng (Gradient Vàng-Cam) để tương phản mạnh với nền xanh lạnh */}
            <div className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-[2rem] p-5 md:p-8 text-white shadow-[0_6px_0_rgb(234,88,12)] relative overflow-hidden border-4 border-white transform hover:scale-[1.005] transition-transform group">
               <div className="relative z-10 w-full md:w-3/4 lg:w-2/3">
                <div className="inline-block bg-white text-orange-500 px-4 py-1.5 rounded-full text-base md:text-lg font-heading font-extrabold mb-2 shadow-sm animate-bounce tracking-wide border-2 border-orange-200">
                  ✨ Xin chào bạn mới!
                </div>
                <h1 className="mb-3 leading-tight font-heading">
                  <span className="block text-2xl md:text-3xl text-white drop-shadow-md mb-1 font-extrabold">
                    Chào mừng các bạn nhỏ đến với
                  </span>
                  {/* Title increased size + whitespace-nowrap to keep on one line */}
                  <span className="block text-5xl md:text-7xl text-pink-600 drop-shadow-hard text-stroke-white py-1 font-extrabold tracking-tight leading-none whitespace-nowrap">
                    Thư viện số Capy
                  </span>
                </h1>
                <p className="text-white text-lg md:text-xl max-w-lg mb-6 font-bold font-body drop-shadow-sm leading-relaxed">
                  Cùng khám phá thế giới kỳ diệu qua những trang sách, video AI vui nhộn và trò chuyện với bạn Capybara thông minh nhé!
                </p>
                <button 
                  onClick={() => setCurrentView(ViewState.AI_VIDEOS)}
                  className="bg-white text-orange-500 px-8 py-3 rounded-full font-heading font-extrabold shadow-[0_4px_0_rgb(251,146,60)] hover:shadow-[0_6px_0_rgb(251,146,60)] hover:-translate-y-1 transition-all text-xl flex items-center gap-2 tracking-wide border-2 border-orange-100"
                >
                  <Star fill="#F59E0B" className="text-yellow-500" size={24} /> Khám phá ngay
                </button>
               </div>
               
               {/* Mascot Image - Resized to be balanced */}
               <img 
                 src={STICKERS.HERO_MASCOT} 
                 alt="Cute Capybara Mascot" 
                 className="absolute bottom-[-20px] right-[-20px] md:right-4 w-44 md:w-[28rem] object-contain drop-shadow-2xl animate-[bounce_3s_infinite]"
               />

               {/* Decor circles */}
               <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-200 opacity-30 rounded-full blur-2xl"></div>
               <div className="absolute bottom-[-50px] left-20 w-48 h-48 bg-orange-300 opacity-40 rounded-full blur-2xl"></div>
            </div>
            
            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-2">
               <div onClick={() => setCurrentView(ViewState.AI_VIDEOS)} className="group bg-blue-100 p-2 rounded-[2rem] hover:-translate-y-2 transition-transform cursor-pointer shadow-lg border-b-[6px] border-blue-300 relative">
                  <div className="bg-white p-4 md:p-5 rounded-[1.5rem] h-full flex flex-col items-center text-center border-4 border-blue-100 group-hover:border-blue-200 transition-colors relative z-10 overflow-hidden">
                      <img src={STICKERS.VIDEO_DECOR} className="absolute -top-4 -right-4 w-16 opacity-20 rotate-12" alt="decor" />
                      
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform border-4 border-blue-100">
                        <Music size={32} fill="currentColor" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-lg md:text-xl mb-1 text-blue-500 font-heading font-extrabold">Phòng Chiếu Phim</h3>
                      <p className="text-blue-400 font-bold text-sm md:text-base leading-snug">Xem video hoạt hình bài giảng siêu vui.</p>
                  </div>
               </div>
               
               <div onClick={() => setCurrentView(ViewState.WORKSHEETS)} className="group bg-green-100 p-2 rounded-[2rem] hover:-translate-y-2 transition-transform cursor-pointer shadow-lg border-b-[6px] border-green-300 relative">
                   <div className="bg-white p-4 md:p-5 rounded-[1.5rem] h-full flex flex-col items-center text-center border-4 border-green-100 group-hover:border-green-200 transition-colors relative z-10 overflow-hidden">
                      <img src={STICKERS.WORKSHEET_SUCCESS} className="absolute -bottom-6 -left-4 w-20 opacity-20 -rotate-12" alt="decor" />
                      
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-3 group-hover:scale-110 transition-transform border-4 border-green-100">
                        <BookOpen size={32} fill="currentColor" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-lg md:text-xl mb-1 text-green-500 font-heading font-extrabold">Góc Luyện Tập</h3>
                      <p className="text-green-400 font-bold text-sm md:text-base leading-snug">Làm bài tập trắc nghiệm nhận huy hiệu.</p>
                   </div>
               </div>

               <div onClick={() => setCurrentView(ViewState.CHATBOT)} className="group bg-purple-100 p-2 rounded-[2rem] hover:-translate-y-2 transition-transform cursor-pointer shadow-lg border-b-[6px] border-purple-300 relative">
                   <div className="bg-white p-4 md:p-5 rounded-[1.5rem] h-full flex flex-col items-center text-center border-4 border-purple-100 group-hover:border-purple-200 transition-colors relative z-10 overflow-hidden">
                      <img src={STICKERS.CHAT_BOT} className="absolute top-0 left-0 w-16 opacity-20" alt="decor" />
                      
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mb-3 group-hover:scale-110 transition-transform border-4 border-purple-100">
                        <Bot size={32} fill="currentColor" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-lg md:text-xl mb-1 text-purple-500 font-heading font-extrabold">Capy Thông Thái</h3>
                      <p className="text-purple-400 font-bold text-sm md:text-base leading-snug">Hỏi đáp mọi thứ trên đời cùng Capy.</p>
                   </div>
               </div>
            </div>

            {/* --- TALKING MASCOT (Fixed Bottom Right) --- */}
            <div 
              className="fixed bottom-6 right-6 z-40 cursor-pointer group flex flex-col items-end"
              onClick={handlePlayMascotAudio}
            >
               {/* Speech Bubble Hint */}
               <div className={`bg-white text-orange-600 px-4 py-2 rounded-2xl rounded-br-none shadow-lg border-2 border-orange-200 font-heading font-extrabold mb-2 mr-4 transition-all duration-300 transform ${isPlaying ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 origin-bottom-right'}`}>
                  {isPlaying ? 'Đang nói nè... 🔊' : 'Bấm vào tớ đi! 👋'}
               </div>

               <div className="relative">
                 {/* Mascot Image */}
                 <img 
                   src={STICKERS.HOME_TALKING_MASCOT} 
                   alt="Talking Mascot" 
                   className={`w-28 md:w-36 drop-shadow-2xl transition-transform duration-300 ${isPlaying ? 'animate-[bounce_0.5s_infinite] scale-110' : 'group-hover:scale-110 group-hover:-rotate-3'}`}
                 />
                 
                 {/* Sound Wave Animation (When Playing) */}
                 {isPlaying && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1.5 shadow-md animate-pulse">
                       <Volume2 size={20} className="text-orange-500" />
                    </div>
                 )}
               </div>
            </div>

          </div>
        );
      case ViewState.AI_VIDEOS:
        return <ResourceGrid title="Rạp Chiếu Phim Nhí" items={videos} type="video" />;
      case ViewState.EBOOKS:
        return <ResourceGrid title="Tủ Sách Thần Kỳ" items={books} type="book" />;
      case ViewState.LECTURES:
        return <ResourceGrid title="Lớp Học Vui Vẻ" items={lectures} type="lecture" />;
      case ViewState.WORKSHEETS:
        return <WorksheetView worksheets={worksheets} />;
      case ViewState.CHATBOT:
        return <Chatbot />;
      default:
        return <div>Not found</div>;
    }
  };

  return (
    // Đổi background thành màu xanh lạnh (sky-50)
    <div className="flex h-screen overflow-hidden bg-sky-50">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Mobile Header - Đổi border sang tone lạnh, giữ icon/text tone nóng */}
        <header className="bg-white/80 backdrop-blur-sm border-b-2 border-sky-200 h-20 flex items-center justify-between px-6 md:hidden z-10 sticky top-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-sky-100 rounded-xl text-sky-600">
            <Menu size={32} strokeWidth={3} />
          </button>
          <span className="text-3xl text-orange-500 tracking-tight font-heading font-extrabold drop-shadow-sm">SmartLib</span>
          <div className="w-10"></div> {/* Spacer */}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;