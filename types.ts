
export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  linkUrl: string; // Link to video, pdf, or slide
  embedUrl?: string; // Processed link for embedding (e.g. YouTube embed)
  category?: string;
  author?: string;
  date?: string;
  grade?: string; // Thêm trường Lớp (1, 2, 3, 4, 5)
}

export enum ViewState {
  HOME = 'HOME',
  AI_VIDEOS = 'AI_VIDEOS',
  EBOOKS = 'EBOOKS',
  LECTURES = 'LECTURES',
  WORKSHEETS = 'WORKSHEETS',
  DOCUMENTS = 'DOCUMENTS', // New Feature
  CHATBOT = 'CHATBOT',
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text';
  options?: string[]; // For multiple choice
  correctAnswer: string;
  explanation?: string;
}

export interface Worksheet {
  id: string;
  title: string;
  subject?: string; // Thêm môn học
  grade?: string;   // Thêm lớp
  questions: Question[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
