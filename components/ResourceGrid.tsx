
import React, { useState } from 'react';
import { ResourceItem } from '../types';
import { Play, BookOpen, Download, ExternalLink, Smile, Star, Filter, MonitorPlay, FileText, Volume2 } from 'lucide-react';
import { STICKERS, AUDIO_CLIPS } from '../constants';

interface ResourceGridProps {
  title: string;
  items: ResourceItem[];
  type: 'video' | 'book' | 'lecture' | 'document';
}

const ResourceGrid: React.FC<ResourceGridProps> = ({ title, items, type }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'video': return <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />;
      case 'book': return <BookOpen className="w-8 h-8 text-white" />;
      case 'lecture': return <MonitorPlay className="w-8 h-8 text-white" />;
      case 'document': return <FileText className="w-8 h-8 text-white" />;
    }
  };

  const getThemeColor = () => {
    switch (type) {
      case 'video': return 'blue';
      case 'book': return 'green';
      case 'lecture': return 'purple';
      case 'document': return 'teal';
      default: return 'gray';
    }
  };

  const getHeaderSticker = () => {
    switch (type) {
      case 'video': return STICKERS.VIDEO_DECOR;
      case 'book': return STICKERS.BOOK_DECOR;
      case 'lecture': return STICKERS.LECTURE_DECOR;
      case 'document': return STICKERS.DOC_DECOR;
      default: return null;
    }
  }

  const getAudioClip = () => {
    switch (type) {
      case 'video': return AUDIO_CLIPS.SECTION_VIDEO;
      case 'book': return AUDIO_CLIPS.SECTION_BOOK;
      case 'lecture': return AUDIO_CLIPS.SECTION_LECTURE;
      case 'document': return AUDIO_CLIPS.SECTION_DOCUMENT;
      default: return null;
    }
  }

  const handlePlayAudio = () => {
    const audioUrl = getAudioClip();
    if (!audioUrl || isPlaying) return;

    setIsPlaying(true);
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      setIsPlaying(false);
    };

    audio.play().catch(err => {
      console.error("Audio play failed:", err);
      setIsPlaying(false);
    });
  }

  const theme = getThemeColor();
  const headerSticker = getHeaderSticker();

  const getButtonText = () => {
    switch (type) {
      case 'video': return 'Xem ngay';
      case 'book': return 'Đọc luôn';
      case 'lecture': return 'Xem bài giảng'; 
      case 'document': return 'Tải tài liệu';
    }
  };

  const handleItemClick = (item: ResourceItem) => {
    if (item.linkUrl && item.linkUrl !== '#') {
      let url = item.linkUrl.trim();
      
      // Quan trọng: Kiểm tra xem link có bắt đầu bằng http:// hoặc https:// không
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      
      window.open(url, '_blank');
    }
  };

  // Logic lọc item theo tab đang chọn
  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => item.grade && item.grade.trim() === activeTab);

  // Danh sách các tab lớp
  const gradeTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: '1', label: 'Lớp 1' },
    { id: '2', label: 'Lớp 2' },
    { id: '3', label: 'Lớp 3' },
    { id: '4', label: 'Lớp 4' },
    { id: '5', label: 'Lớp 5' },
  ];

  // Render ảnh thumbnail hoặc placeholder "Cute"
  const renderThumbnail = (item: ResourceItem) => {
    const hasUrl = item.thumbnailUrl && item.thumbnailUrl.trim() !== '';

    // Logic chọn màu nền cho fallback
    const getFallbackBg = () => {
        switch (type) {
            case 'book': return 'bg-[#A7F3D0]'; // Green-200
            case 'lecture': return 'bg-[#E9D5FF]'; // Purple-200
            case 'document': return 'bg-[#99F6E4]'; // Teal-200
            default: return 'bg-[#BFDBFE]'; // Blue-200
        }
    };

    // Nội dung Fallback (Hiển thị khi không có ảnh hoặc ảnh lỗi)
    const fallbackContent = (
      <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-2 text-center overflow-hidden ${getFallbackBg()} z-0`}>
        {/* Background Patterns */}
        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-white opacity-30"></div>
        <div className="absolute bottom-[-10px] left-[-10px] w-16 h-16 rounded-full bg-white opacity-30"></div>

        {type === 'book' && (
          <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
             {/* Sách hoạt hình */}
             <div className="w-16 h-24 bg-green-500 rounded-r-lg rounded-l-md shadow-lg border-l-4 border-green-700 relative flex items-center justify-center">
                <div className="absolute top-3 left-2 right-2 h-1.5 bg-green-400/50 rounded-full"></div>
                {/* Khuôn mặt */}
                <div className="flex flex-col items-center gap-0.5">
                   <div className="flex gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                   </div>
                   <div className="w-4 h-2 border-b-2 border-white rounded-full"></div>
                </div>
             </div>
             <span className="mt-2 block text-green-800 font-black text-xs uppercase tracking-wide font-heading">Sách Hay</span>
          </div>
        )}
        
        {type === 'lecture' && (
            <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
               <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-4 border-purple-300">
                  <MonitorPlay className="text-white ml-1" size={28} strokeWidth={2.5} />
               </div>
               <span className="mt-2 block text-purple-800 font-black text-xs uppercase tracking-wide font-heading">Bài giảng</span>
            </div>
        )}

        {type === 'video' && (
          <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
             <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-4 border-blue-300">
                <Play className="text-white ml-1" size={24} fill="currentColor" />
             </div>
             <span className="mt-2 block text-blue-800 font-black text-xs uppercase tracking-wide font-heading">Video</span>
          </div>
        )}

        {type === 'document' && (
          <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
             {/* File hoạt hình */}
             <div className="w-16 h-20 bg-teal-500 rounded-lg shadow-lg border-4 border-teal-200 relative flex items-center justify-center">
                 <div className="absolute top-0 right-0 w-6 h-6 bg-teal-200 rounded-bl-lg"></div>
                 <FileText className="text-white" size={32} />
             </div>
             <span className="mt-2 block text-teal-800 font-black text-xs uppercase tracking-wide font-heading">Tài liệu</span>
          </div>
        )}
      </div>
    );

    return (
      <div className="relative w-full h-full bg-gray-100">
        {/* 1. Luôn render Fallback ở dưới cùng */}
        {fallbackContent}

        {/* 2. Nếu có URL, render ảnh đè lên trên (z-10). Nếu ảnh lỗi (onError), ẩn ảnh đi để lộ Fallback bên dưới */}
        {hasUrl && (
          <img 
            src={item.thumbnailUrl} 
            alt={item.title} 
            className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-[90rem] mx-auto">
      {/* Header Compact */}
      <div className={`relative w-fit bg-white rounded-[2.5rem] p-6 pr-8 mb-6 shadow-xl border-4 border-${theme}-200 flex flex-col md:flex-row items-center md:items-start overflow-visible gap-4 md:gap-6`}>
        <div className={`absolute top-0 left-0 w-full h-full bg-${theme}-50/50 rounded-[2.3rem] -z-10`}></div>
        <div className={`absolute -top-6 -left-6 w-24 h-24 bg-${theme}-200 rounded-full opacity-50 blur-xl`}></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className={`p-4 rounded-[1.5rem] bg-${theme}-100 text-${theme}-500 shadow-sm border-4 border-white ring-4 ring-${theme}-50`}>
             {type === 'book' ? <BookOpen size={32} strokeWidth={2.5} /> : 
              type === 'video' ? <Play size={32} strokeWidth={2.5} /> : 
              type === 'document' ? <FileText size={32} strokeWidth={2.5} /> :
              <MonitorPlay size={32} strokeWidth={2.5} />}
          </div>
          
          <div className="whitespace-nowrap">
            <h2 className={`text-2xl md:text-4xl font-black text-orange-600 font-heading tracking-wide mb-1`}>{title}</h2>
            <div className={`inline-block px-3 py-0.5 rounded-full bg-${theme}-100 text-${theme}-600 font-bold font-body text-xs md:text-sm border-2 border-${theme}-200`}>
               ✨ Có {items.length} món quà
            </div>
          </div>
        </div>

        {headerSticker && (
           <div 
             className="mt-2 md:mt-0 relative z-20 md:-ml-4 flex-shrink-0 group cursor-pointer" 
             onClick={handlePlayAudio}
           >
             <img 
               src={headerSticker} 
               className={`w-32 md:w-40 drop-shadow-2xl transition-transform duration-500 ${isPlaying ? 'scale-125 animate-[bounce_0.5s_infinite]' : 'hover:scale-110 animate-[bounce_3s_infinite]'} ${type === 'document' ? 'rotate-12' : ''}`} 
               alt="Decor" 
               style={{ marginBottom: '-25px' }} 
             />
             <div className="absolute bottom-[-15px] right-2 w-3/4 h-3 bg-black/10 rounded-[100%] blur-md"></div>
             
             {/* Hint Tooltip on hover/playing */}
             <div className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-${theme}-600 text-xs font-bold px-2 py-1 rounded-lg shadow-md whitespace-nowrap transition-opacity duration-300 pointer-events-none border border-${theme}-200 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {isPlaying ? 'Đang nói... 🔊' : 'Bấm vào tớ nè!'}
             </div>
           </div>
        )}
      </div>

      {/* Tabs Filter - Grade Selection */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border-2 border-gray-100 text-gray-400 font-bold font-heading mr-2">
            <Filter size={20} />
            <span>Lọc theo:</span>
        </div>
        {gradeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full font-black text-sm md:text-base transition-all transform hover:-translate-y-1 font-heading border-b-4 active:border-b-0 active:translate-y-0.5 ${
              activeTab === tab.id
                ? `bg-${theme}-500 text-white shadow-${theme} border-${theme}-700`
                : `bg-white text-gray-500 border-gray-200 hover:border-${theme}-300 hover:text-${theme}-500 hover:bg-${theme}-50`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      {filteredItems.length > 0 ? (
        <div className={`grid gap-6 ${
          type === 'book' || type === 'document'
            ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        }`}>
          {filteredItems.map((item, index) => (
            <div key={item.id} className="group relative bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-4 border-gray-100 flex flex-col overflow-hidden">
              
              {/* Hình ảnh */}
              <div 
                className={`relative ${type === 'book' || type === 'document' ? 'aspect-[3/4]' : 'aspect-video'} overflow-hidden bg-gray-100 cursor-pointer rounded-t-[1.7rem] m-1.5 mb-0 border-b-2 border-gray-100`}
                onClick={() => handleItemClick(item)}
              >
                {renderThumbnail(item)}
                
                {/* Overlay Icon (Hiện khi hover lên thumbnail có ảnh) */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] z-20">
                  <div className={`w-12 h-12 bg-${theme}-500 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300 border-2 border-white`}>
                    {getIcon()}
                  </div>
                </div>

                {/* Grade Badge */}
                {item.grade && (
                  <span className={`absolute top-2 right-2 bg-${theme}-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm font-heading border border-white/50 z-20`}>
                    Lớp {item.grade}
                  </span>
                )}
                
                {/* Category Badge (optional, moved to left if exists) */}
                {item.category && (
                  <span className="absolute top-2 left-2 bg-white/95 text-gray-800 text-[10px] font-black px-2 py-1 rounded-full shadow-sm font-heading border border-gray-100 z-20">
                    {item.category}
                  </span>
                )}
              </div>
              
              {/* Thông tin */}
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-lg font-black text-gray-800 mb-1 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors font-heading">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs mb-2 line-clamp-2 font-bold flex-1 font-body">
                  {item.description}
                </p>
                
                <div className="mt-auto pt-2 border-t border-dashed border-gray-200">
                  <button 
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-black transition-all transform active:scale-95 font-heading shadow-[0_3px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-0.5 ${
                      type === 'book' 
                        ? 'bg-green-100 text-green-600 hover:bg-green-500 hover:text-white' 
                        : type === 'document'
                          ? 'bg-teal-100 text-teal-600 hover:bg-teal-500 hover:text-white'
                          : type === 'lecture'
                             ? 'bg-purple-100 text-purple-600 hover:bg-purple-500 hover:text-white'
                             : 'bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    {getButtonText()}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 opacity-60">
           <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <Smile size={48} className="text-gray-400" />
           </div>
           <p className="text-xl font-heading font-bold text-gray-500">Chưa có nội dung cho lớp này bạn ơi!</p>
           <button onClick={() => setActiveTab('all')} className="mt-4 text-blue-500 font-bold hover:underline">Xem tất cả</button>
        </div>
      )}
    </div>
  );
};

export default ResourceGrid;
