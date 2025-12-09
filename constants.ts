import { ResourceItem, Worksheet } from './types';

// ==============================================================================
// HƯỚNG DẪN:
// 1. Tạo Google Sheet với các cột: id, Title, Description, Thumbnail Url, Link Url, Author, Grade
// 2. Vào File -> Share -> Publish to web -> Chọn Sheet -> Chọn định dạng TSV
// 3. Copy link dán vào bên dưới
// ==============================================================================

export const SHEET_URLS = {
  VIDEOS: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTdZFpjpUuQ4WeIEc-IlpxsC6NUS6SFrzfcZFjE7g7cYOmpNqr4KkW1Iecis_MIZ-il3w7_wdi6ecOs/pub?output=tsv',
  
  EBOOKS: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXQORIDKtARhcFF9_Qm3MkTK5RnD1_oq06cYkXQ_m2rYtc6XyxNYmy6Guyq54TWG8UN7OTfFwkTM2k/pub?output=tsv',
  
  LECTURES: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQTTpsz1nKFzIYq0Y7aBsMkn4qyjUVvMwIT_UI4UhY63qIe2DnP9Z1P1QOPHs2VbKZTBopJPCQxHdgz/pub?output=tsv', 

  WORKSHEETS: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4h_9ipPcogvKU-134drfXZQAglTMS2hloPpahvMBl9QGQhOsyN68U3VaD_tPUEAjaQArT6b8g7336/pub?output=tsv',
};

export const STICKERS = {
  HERO_MASCOT: 'https://res.cloudinary.com/dejnvixvn/image/upload/v1765035739/1_yuflpb.png', // Trang chủ
  SIDEBAR_PEEK: 'https://res.cloudinary.com/dejnvixvn/image/upload/v1765035739/1_yuflpb.png', // Tận dụng lại ảnh trang chủ cho Sidebar
  CHAT_BOT: 'https://res.cloudinary.com/dejnvixvn/image/upload/v1765035740/6_kmx70i.png', // Chatbot
  WORKSHEET_SUCCESS: 'https://res.cloudinary.com/dejnvixvn/image/upload/v1765035740/5_h5pgf4.png', // Bài tập
  VIDEO_DECOR: 'https://res.cloudinary.com/dejnvixvn/image/upload/v1765035739/2_e5wgfq.png', // Video
  BOOK_DECOR: 'https://res.cloudinary.com/dejnvixvn/image/upload/v1765035740/3_r2dn7v.png', // Đọc sách
  LECTURE_DECOR: 'https://res.cloudinary.com/dejnvixvn/image/upload/v1765035740/4_srjptt.png', // Bài giảng
  HOME_TALKING_MASCOT: 'https://res.cloudinary.com/dejnvixvn/image/upload/v1765107578/Thi%E1%BA%BFt_k%E1%BA%BF_ch%C6%B0a_c%C3%B3_t%C3%AAn_4_cbfgnw.png' // Nhân vật nói ở trang chủ
};

export const AUDIO_CLIPS = {
  HOME_WELCOME: 'https://res.cloudinary.com/dejnvixvn/video/upload/v1765112148/mp3-output-ttsfree_dot_com_1_ykcfy7.mp3',
  WORKSHEET_CONGRATS: 'https://res.cloudinary.com/dejnvixvn/video/upload/v1744012397/nhac_nen_trao_giai_thuong-www_tiengdong_com_ln6vu6.mp3'
};

// Mock data to display if sheet fetch fails or for initial demo
export const MOCK_VIDEOS: ResourceItem[] = [
  {
    id: '1',
    title: 'Giới thiệu về Trí tuệ nhân tạo',
    description: 'Video AI tóm tắt các khái niệm cơ bản về AI cho học sinh cấp 2.',
    thumbnailUrl: 'https://picsum.photos/400/225?random=1',
    linkUrl: 'https://www.youtube.com/watch?v=ad79nYk2keg', // Example link
    author: 'AI Studio',
    category: 'Khoa học máy tính',
    grade: '5'
  },
  {
    id: '2',
    title: 'Lịch sử văn minh nhân loại',
    description: 'Tóm tắt lịch sử qua các thời kỳ bằng hình ảnh sinh động.',
    thumbnailUrl: 'https://picsum.photos/400/225?random=2',
    linkUrl: '#',
    author: 'History Channel AI',
    category: 'Lịch sử',
    grade: '4'
  },
  {
    id: '3',
    title: 'Toán học vui: Hình học không gian',
    description: 'Cách nhìn hình học không gian đa chiều.',
    thumbnailUrl: 'https://picsum.photos/400/225?random=3',
    linkUrl: '#',
    author: 'Math Magic',
    category: 'Toán học',
    grade: '1'
  }
];

export const MOCK_EBOOKS: ResourceItem[] = [
  {
    id: '1',
    title: 'Dế Mèn Phiêu Lưu Ký',
    description: 'Tác phẩm văn học kinh điển của Tô Hoài.',
    thumbnailUrl: '', // Để trống để hiển thị bìa sách mặc định (Demo)
    linkUrl: '#',
    author: 'Tô Hoài',
    category: 'Văn học',
    grade: '3'
  },
  {
    id: '2',
    title: 'Nhập môn Lập trình Python',
    description: 'Sách giáo khoa điện tử cơ bản.',
    thumbnailUrl: '', // Để trống để hiển thị bìa sách mặc định (Demo)
    linkUrl: '#',
    author: 'Bộ Giáo Dục',
    category: 'Tin học',
    grade: '5'
  }
];

export const MOCK_LECTURES: ResourceItem[] = [
  {
    id: '1',
    title: 'Bài giảng: Câu cảm thán',
    description: 'Slide bài giảng điện tử môn Ngữ Văn.',
    thumbnailUrl: 'https://picsum.photos/400/300?random=6',
    linkUrl: '#',
    author: 'Cô Lan',
    date: '2023-10-15',
    grade: '2'
  },
  {
    id: '2',
    title: 'Bài giảng: Định luật Newton',
    description: 'Bài giảng Vật lý lớp 10.',
    thumbnailUrl: 'https://picsum.photos/400/300?random=7',
    linkUrl: '#',
    author: 'Thầy Hùng',
    date: '2023-11-20',
    grade: '5'
  }
];

export const MOCK_WORKSHEETS: Worksheet[] = [
  {
    id: 'ws1',
    title: 'Phiếu bài tập: Ôn tập Ngữ pháp',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'Từ nào sau đây là danh từ?',
        options: ['Chạy', 'Đẹp', 'Ngôi nhà', 'Nhanh'],
        correctAnswer: 'Ngôi nhà',
        explanation: '"Ngôi nhà" là từ chỉ sự vật.'
      },
      {
        id: 'q2',
        type: 'text',
        text: 'Điền vào chỗ trống: "Học thầy không tày học ..."',
        correctAnswer: 'bạn',
        explanation: 'Câu tục ngữ: Học thầy không tày học bạn.'
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        text: 'Thủ đô của Việt Nam là gì?',
        options: ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Huế'],
        correctAnswer: 'Hà Nội',
        explanation: 'Hà Nội là thủ đô của nước CHXHCN Việt Nam.'
      }
    ]
  },
  {
    id: 'ws2',
    title: 'Phiếu bài tập: Toán đố vui',
    questions: [
      {
        id: 'm1',
        type: 'multiple-choice',
        text: '2 + 2 x 2 = ?',
        options: ['6', '8', '4', '10'],
        correctAnswer: '6',
        explanation: 'Thực hiện phép nhân trước: 2 x 2 = 4, sau đó cộng 2 = 6.'
      }
    ]
  }
];