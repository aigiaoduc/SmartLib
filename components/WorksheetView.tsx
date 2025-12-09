import React, { useState, useEffect, useRef } from 'react';
import { Worksheet } from '../types';
import { CheckCircle2, XCircle, ChevronRight, RefreshCw, Trophy, Star, ArrowLeft, Eye, X, Home } from 'lucide-react';
import { STICKERS, AUDIO_CLIPS } from '../constants';

interface WorksheetViewProps {
  worksheets: Worksheet[];
}

const WorksheetView: React.FC<WorksheetViewProps> = ({ worksheets }) => {
  const [selectedWorksheetId, setSelectedWorksheetId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  
  // Ref để quản lý audio, giúp dừng nhạc khi đóng modal
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeWorksheet = worksheets.find(w => w.id === selectedWorksheetId);

  // Effect để xử lý âm thanh khi modal hiện/ẩn
  useEffect(() => {
    if (showResultModal) {
      // Phát nhạc khi hiện modal
      audioRef.current = new Audio(AUDIO_CLIPS.WORKSHEET_CONGRATS);
      audioRef.current.volume = 0.6; // Âm lượng vừa phải
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    } else {
      // Dừng nhạc khi đóng modal
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    // Cleanup khi unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [showResultModal]);

  const handleSelectWorksheet = (id: string) => {
    setSelectedWorksheetId(id);
    setUserAnswers({});
    setSubmitted(false);
    setShowResultModal(false);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    if (submitted) return; 
    setUserAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResultModal(true); // Hiện modal chúc mừng ngay khi nộp
  };

  const handleReset = () => {
    setSubmitted(false);
    setShowResultModal(false);
    setUserAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReview = () => {
    setShowResultModal(false); // Tắt modal để xem lại bài
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedWorksheetId(null);
    setShowResultModal(false);
  };

  const getScore = () => {
    if (!activeWorksheet) return 0;
    let correct = 0;
    activeWorksheet.questions.forEach(q => {
      if (userAnswers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        correct++;
      }
    });
    return correct;
  };

  // Màn hình danh sách bài tập (Chưa chọn bài)
  if (!selectedWorksheetId) {
    return (
      <div className="p-4 md:p-8 max-w-[90rem] mx-auto">
        {/* Header */}
        <div className="relative w-fit bg-white rounded-[2.5rem] p-6 pr-8 mb-8 shadow-xl border-4 border-red-200 flex flex-col md:flex-row items-center md:items-start overflow-visible gap-4 md:gap-6">
           <div className="absolute top-0 left-0 w-full h-full bg-red-50/50 rounded-[2.3rem] -z-10"></div>
           
           <div className="flex items-center gap-4 relative z-10">
             <div className="p-4 rounded-[1.5rem] bg-red-100 text-red-500 shadow-sm border-4 border-white ring-4 ring-red-50">
               <Trophy size={32} fill="currentColor" />
             </div>
             
             <div className="whitespace-nowrap">
               <h2 className="text-2xl md:text-4xl font-black text-orange-600 font-heading tracking-wide mb-1">Thử Thách Trí Tuệ</h2>
               <div className="inline-block px-3 py-0.5 rounded-full bg-red-100 text-red-600 font-bold font-body text-xs md:text-sm border-2 border-red-200">
                  ✨ Vừa học vừa chơi, nhận điểm mười!
               </div>
             </div>
           </div>

           {/* Worksheet Sticker */}
           <div className="mt-2 md:mt-0 relative z-20 md:-ml-4 flex-shrink-0">
             <img 
               src={STICKERS.WORKSHEET_SUCCESS} 
               className="w-32 md:w-40 drop-shadow-2xl transform hover:scale-110 transition-transform duration-500 animate-[bounce_3s_infinite]" 
               alt="Worksheet Decor" 
               style={{ marginBottom: '-25px' }} 
             />
             <div className="absolute bottom-[-15px] right-2 w-3/4 h-3 bg-black/10 rounded-[100%] blur-md"></div>
           </div>
        </div>
        
        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {worksheets.map((ws, index) => (
            <div 
              key={ws.id}
              onClick={() => handleSelectWorksheet(ws.id)}
              className="bg-white p-1.5 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group border-b-[6px] border-gray-100 hover:border-red-200 h-full"
            >
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-[1.7rem] h-full flex flex-col border-2 border-dashed border-red-100 group-hover:border-solid group-hover:border-red-300 transition-all">
                <div className="flex justify-between items-start mb-2">
                   <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-red-500 shadow-sm font-black text-xl font-heading border-2 border-red-100">
                      {index + 1}
                   </div>
                   <span className="bg-red-200 text-red-700 text-[10px] font-black px-2 py-1 rounded-full uppercase font-heading">
                      {ws.questions.length} câu
                   </span>
                </div>
                
                <h3 className="text-lg font-black text-gray-800 mb-1 leading-tight group-hover:text-red-500 transition-colors font-heading line-clamp-2">
                  {ws.title}
                </h3>
                <p className="text-xs text-gray-500 font-bold mb-3 font-body flex-1">
                  Sẵn sàng chinh phục 100 điểm chưa?
                </p>
                
                <div className="mt-auto flex items-center justify-center bg-white text-red-500 py-2.5 rounded-xl font-black shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all font-heading text-sm border-2 border-red-50">
                  Chơi ngay <ChevronRight size={18} className="ml-1" strokeWidth={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- MÀN HÌNH LÀM BÀI ---

  const score = getScore();
  const total = activeWorksheet?.questions.length || 0;
  const percentage = Math.round((score / total) * 100);

  // Logic nội dung chúc mừng dựa trên điểm số
  const getResultContent = () => {
    if (percentage === 100) {
      return {
        title: "XUẤT SẮC! THIÊN TÀI ƠI!",
        message: "Con làm đúng hết rồi! Quá đỉnh luôn!",
        color: "text-yellow-500",
        bg: "bg-yellow-50",
        icon: <Trophy size={64} className="text-yellow-500 drop-shadow-lg animate-bounce" fill="currentColor" />,
        sticker: STICKERS.WORKSHEET_SUCCESS
      };
    } else if (percentage >= 50) {
      return {
        title: "LÀM TỐT LẮM BÉ ƠI!",
        message: "Con đã rất cố gắng, chỉ sai một xíu thôi!",
        color: "text-blue-500",
        bg: "bg-blue-50",
        icon: <Star size={64} className="text-blue-500 drop-shadow-lg animate-spin-slow" fill="currentColor" />,
        sticker: STICKERS.CHAT_BOT
      };
    } else {
      return {
        title: "HOAN HÔ! BÉ ĐÃ HOÀN THÀNH!",
        message: "Điểm số không quan trọng bằng việc con đã nỗ lực hết mình!",
        color: "text-green-500",
        bg: "bg-green-50",
        icon: <CheckCircle2 size={64} className="text-green-500 drop-shadow-lg animate-pulse" />,
        sticker: STICKERS.HERO_MASCOT
      };
    }
  };

  const resultData = getResultContent();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto relative">
      
      {/* Nút quay lại */}
      <button 
        onClick={() => setSelectedWorksheetId(null)}
        className="group flex items-center gap-2 text-gray-500 font-black hover:text-red-500 mb-6 bg-white px-5 py-3 rounded-full shadow-sm w-fit transition-all hover:pr-6 font-heading border-2 border-transparent hover:border-red-100"
      >
        <div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-red-100 transition-colors">
          <ArrowLeft size={24} strokeWidth={3} />
        </div>
        Quay lại chọn bài
      </button>

      {/* Main Worksheet Container */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border-4 border-white overflow-hidden ring-4 ring-gray-100">
        
        {/* Header */}
        <div className="bg-red-500 px-8 py-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black font-heading">{activeWorksheet?.title}</h2>
            <p className="opacity-90 font-bold mt-2 flex items-center gap-2 text-lg font-body">
              <Star size={24} fill="currentColor" /> Cố gắng trả lời đúng hết nhé!
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-5 right-20 w-10 h-10 bg-yellow-300 opacity-50 rounded-full animate-bounce"></div>
        </div>

        {/* --- MODAL CHÚC MỪNG (POPUP) --- */}
        {showResultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             {/* Backdrop Blur */}
             <div className="absolute inset-0 bg-sky-900/60 backdrop-blur-sm transition-opacity" onClick={handleReview}></div>
             
             {/* Card Popup */}
             <div className="bg-white relative z-10 w-full max-w-lg rounded-[3rem] shadow-2xl p-2 border-[8px] border-white ring-4 ring-yellow-300 animate-[bounce_0.5s_ease-out]">
                
                {/* Background Rays Effect */}
                <div className={`absolute inset-0 rounded-[2.5rem] overflow-hidden opacity-20 ${resultData.bg}`}>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_20deg,white_20deg_40deg,transparent_40deg_60deg,white_60deg_80deg,transparent_80deg_100deg,white_100deg_120deg,transparent_120deg_140deg,white_140deg_160deg,transparent_160deg_180deg,white_180deg_200deg,transparent_200deg_220deg,white_220deg_240deg,transparent_240deg_260deg,white_260deg_280deg,transparent_280deg_300deg,white_300deg_320deg,transparent_320deg_340deg,white_340deg_360deg)] animate-[spin_10s_linear_infinite]"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center p-6 md:p-8">
                   {/* Sticker Mascot */}
                   <div className="relative mb-4">
                      <div className="absolute inset-0 bg-yellow-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                      <img src={resultData.sticker} className="w-40 h-40 object-contain drop-shadow-xl animate-[bounce_2s_infinite]" alt="Celebration" />
                      <div className="absolute -bottom-2 -right-2 transform rotate-12">
                         {resultData.icon}
                      </div>
                   </div>

                   <h3 className={`text-3xl md:text-4xl font-black mb-2 font-heading ${resultData.color} drop-shadow-sm`}>
                     {resultData.title}
                   </h3>
                   <p className="text-gray-500 font-bold text-lg md:text-xl font-body mb-6 max-w-xs mx-auto leading-tight">
                     {resultData.message}
                   </p>

                   {/* Score Box */}
                   <div className="bg-gray-100 rounded-2xl p-4 mb-8 border-4 border-gray-200 w-full max-w-[12rem]">
                      <span className="block text-gray-500 font-bold text-xs uppercase mb-1 font-heading">Kết quả của bé</span>
                      <div className="flex items-baseline justify-center gap-1">
                         <span className={`text-5xl font-black ${resultData.color} font-heading`}>{score}</span>
                         <span className="text-2xl text-gray-400 font-black font-heading">/{total}</span>
                      </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="flex flex-col gap-3 w-full">
                      <button 
                        onClick={handleReview}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-black text-lg shadow-[0_4px_0_rgb(194,65,12)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 font-heading"
                      >
                         <Eye size={24} /> Xem lại bài làm
                      </button>
                      <div className="flex gap-3">
                         <button 
                           onClick={handleReset}
                           className="flex-1 bg-white hover:bg-gray-50 text-gray-600 border-2 border-gray-200 py-3 rounded-2xl font-black shadow-sm flex items-center justify-center gap-2 font-heading"
                         >
                            <RefreshCw size={20} /> Làm lại
                         </button>
                         <button 
                           onClick={handleBackToList}
                           className="flex-1 bg-white hover:bg-gray-50 text-gray-600 border-2 border-gray-200 py-3 rounded-2xl font-black shadow-sm flex items-center justify-center gap-2 font-heading"
                         >
                            <Home size={20} /> Bài khác
                         </button>
                      </div>
                   </div>
                </div>

                {/* Close X Button top right */}
                <button 
                   onClick={handleReview}
                   className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                >
                   <X size={24} strokeWidth={3} />
                </button>
             </div>
          </div>
        )}

        {/* Questions List */}
        <div className="p-6 md:p-10 space-y-10">
          {activeWorksheet?.questions.map((q, index) => {
            const isCorrect = userAnswers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
            const userAnswer = userAnswers[q.id];
            
            return (
              <div key={q.id} className={`relative bg-gray-50/50 p-6 rounded-[2rem] border-4 transition-colors ${submitted ? (isCorrect ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30') : 'border-transparent hover:border-gray-100'}`}>
                {/* Question Number */}
                <div className={`absolute -top-4 -left-2 w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md rotate-[-5deg] text-xl font-heading border-2 border-white ${submitted ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-red-500 text-white'}`}>
                  {index + 1}
                </div>

                <div className="ml-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 font-body leading-relaxed">{q.text}</h3>
                    
                    {/* Options */}
                    <div className="space-y-4">
                      {q.type === 'multiple-choice' && q.options?.map((option) => (
                        <label 
                          key={option} 
                          className={`flex items-center p-5 rounded-2xl border-4 cursor-pointer transition-all transform active:scale-[0.99] ${
                            userAnswer === option 
                              ? submitted 
                                ? isCorrect 
                                  ? 'border-green-500 bg-green-100' 
                                  : 'border-red-400 bg-red-50'
                                : 'border-red-500 bg-red-50 shadow-md'
                              : 'border-white bg-white hover:border-red-200 shadow-sm'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center flex-shrink-0 ${
                             userAnswer === option ? 'border-red-500 bg-red-500' : 'border-gray-300'
                          }`}>
                             {userAnswer === option && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                          </div>
                          <input
                            type="radio"
                            name={q.id}
                            value={option}
                            checked={userAnswer === option}
                            onChange={() => handleAnswerChange(q.id, option)}
                            disabled={submitted}
                            className="hidden"
                          />
                          <span className={`ml-4 font-bold text-lg ${userAnswer === option ? 'text-red-700' : 'text-gray-600'} font-body`}>{option}</span>
                          
                          {submitted && option === q.correctAnswer && (
                            <CheckCircle2 size={28} className="ml-auto text-green-600 animate-pulse" />
                          )}
                          {submitted && userAnswer === option && !isCorrect && (
                            <XCircle size={28} className="ml-auto text-red-500" />
                          )}
                        </label>
                      ))}

                      {q.type === 'text' && (
                        <div className="relative">
                          <input
                            type="text"
                            value={userAnswer || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            disabled={submitted}
                            placeholder="Nhập câu trả lời của bé..."
                            className={`w-full p-5 pl-6 rounded-2xl border-4 text-xl font-bold outline-none shadow-inner font-body ${
                                submitted
                                  ? isCorrect
                                    ? 'border-green-400 bg-green-50 text-green-700'
                                    : 'border-red-400 bg-red-50 text-red-700'
                                  : 'border-gray-200 focus:border-red-400 bg-white'
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Explanation */}
                    {submitted && (
                      <div className={`mt-6 p-6 rounded-3xl text-base font-bold font-body border-2 ${isCorrect ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-50 text-orange-800 border-orange-200'}`}>
                        {!isCorrect && <p className="font-black text-xl mb-2 font-heading">Đáp án đúng là: <span className="text-green-600">{q.correctAnswer}</span></p>}
                        {q.explanation && (
                            <div className="flex gap-3">
                                <span className="text-2xl">💡</span>
                                <p className="mt-1 leading-relaxed">{q.explanation}</p>
                            </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        {!submitted && (
          <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-center sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length < activeWorksheet.questions.length}
              className={`px-12 py-5 rounded-full font-black text-xl text-white transition-all transform font-heading ${
                Object.keys(userAnswers).length < activeWorksheet.questions.length
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 hover:scale-105 shadow-[0_6px_0_rgb(185,28,28)] active:shadow-none active:translate-y-1'
              }`}
            >
              Nộp bài ngay!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorksheetView;