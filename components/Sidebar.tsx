
import React from 'react';
import { ViewState } from '../types';
import { BookOpen, Video, MonitorPlay, FileQuestion, MessageSquareText, Home, FileText } from 'lucide-react';
import { STICKERS } from '../constants';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, toggleSidebar }) => {
  const menuItems = [
    { id: ViewState.HOME, label: 'Trang chủ', icon: <Home size={28} strokeWidth={2.5} />, color: 'text-orange-500', bg: 'bg-orange-100', hover: 'hover:bg-orange-200' },
    { id: ViewState.AI_VIDEOS, label: 'Xem Video', icon: <Video size={28} strokeWidth={2.5} />, color: 'text-blue-500', bg: 'bg-blue-100', hover: 'hover:bg-blue-200' },
    { id: ViewState.EBOOKS, label: 'Đọc Sách', icon: <BookOpen size={28} strokeWidth={2.5} />, color: 'text-green-500', bg: 'bg-green-100', hover: 'hover:bg-green-200' },
    { id: ViewState.LECTURES, label: 'Bài Giảng', icon: <MonitorPlay size={28} strokeWidth={2.5} />, color: 'text-purple-500', bg: 'bg-purple-100', hover: 'hover:bg-purple-200' },
    { id: ViewState.WORKSHEETS, label: 'Bài Tập', icon: <FileQuestion size={28} strokeWidth={2.5} />, color: 'text-red-500', bg: 'bg-red-100', hover: 'hover:bg-red-200' },
    { id: ViewState.DOCUMENTS, label: 'Tài Liệu', icon: <FileText size={28} strokeWidth={2.5} />, color: 'text-teal-600', bg: 'bg-teal-100', hover: 'hover:bg-teal-200' }, // New Item
    { id: ViewState.CHATBOT, label: 'Capy Thông Thái', icon: <MessageSquareText size={28} strokeWidth={2.5} />, color: 'text-yellow-500', bg: 'bg-yellow-100', hover: 'hover:bg-yellow-200' },
  ];

  return (
    <>
      {/* Mobile Overlay - Đổi sang tone xanh tối */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-sky-900/40 backdrop-blur-sm z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container - Viền đổi sang sky-100 (lạnh) để hòa vào nền, background vẫn trắng */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-white m-0 md:m-4 md:rounded-[2.5rem] shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col border-r-4 md:border-4 border-sky-100 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col py-6 px-4">
          <div className="flex items-center justify-center mb-8">
             {/* Logo Box - Giữ màu nóng (Cam) để nổi bật */}
             <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white mr-3 shadow-[0_6px_0_rgb(194,65,12)] transform rotate-3 border-2 border-orange-400">
                <BookOpen size={32} strokeWidth={3} />
             </div>
             {/* Tên Logo - Màu cam đậm (Tone nóng) */}
             <h1 className="text-3xl font-heading text-orange-600 tracking-tight drop-shadow-sm">SmartLib</h1>
          </div>

          <nav className="flex-1 overflow-y-auto space-y-3 px-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`w-full flex items-center px-4 py-4 rounded-3xl transition-all duration-200 font-heading group border-4 ${
                  currentView === item.id
                    ? `${item.bg} ${item.color} shadow-sm border-transparent scale-105`
                    : 'bg-transparent text-gray-400 border-transparent hover:border-sky-100 hover:bg-sky-50'
                }`}
              >
                <div className={`p-2 rounded-2xl transition-colors ${currentView === item.id ? 'bg-white/50' : 'bg-gray-100 group-hover:bg-white'}`}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { 
                    className: currentView === item.id ? item.color : 'text-gray-400 group-hover:text-gray-600'
                  })}
                </div>
                <span className={`ml-4 text-xl ${currentView === item.id ? item.color : 'text-gray-400 group-hover:text-gray-600'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-12 px-2 relative">
             {/* Sticker Peeking - Updated to Capy sticker (CHAT_BOT) and positioned higher to not overlap text */}
             <img 
               src={STICKERS.CHAT_BOT} 
               alt="Capy" 
               className="absolute -top-16 -right-2 w-28 transform drop-shadow-lg z-10 transition-transform hover:-translate-y-2 pointer-events-none" 
             />
             
            {/* Banner Chatbot - Màu nóng (Gradient cam-hồng) để nổi bật trên nền xanh */}
            <div className="bg-gradient-to-b from-orange-400 to-pink-500 rounded-3xl p-5 pt-8 text-white text-center shadow-lg relative overflow-hidden group cursor-pointer z-0 border-b-8 border-pink-700" onClick={() => setView(ViewState.CHATBOT)}>
              <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-20 rounded-full blur-xl -mr-4 -mt-4"></div>
              <p className="text-xl mb-1 relative z-10 font-heading">Cần giúp đỡ?</p>
              <p className="text-base opacity-90 mb-3 font-bold relative z-10 font-body leading-tight px-1">Capy thông thái luôn sẵn sàng!</p>
              <button 
                className="w-full bg-white text-pink-500 text-lg py-3 rounded-xl shadow-sm group-hover:scale-105 transition-transform relative z-10 font-heading"
              >
                Chat ngay đi
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
