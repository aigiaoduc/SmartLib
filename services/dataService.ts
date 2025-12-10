import { ResourceItem, Worksheet, Question } from '../types';

/**
 * Fetches data from a published Google Sheet TSV URL.
 * Falls back to provided mock data if fetch fails.
 */
export async function fetchSheetData(url: string, mockData: ResourceItem[]): Promise<ResourceItem[]> {
  // Check if URL is placeholder
  // Thêm kiểm tra 'YOUR_NEW_SHEET_URL' để khớp với placeholder trong constants.ts
  if (!url || url.includes('YOUR_PUBLISHED') || url.includes('YOUR_NEW_SHEET_URL') || url.includes('...')) {
    // console.warn("Using mock data because URL is not configured.");
    return mockData;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch TSV: ${response.statusText}`);
    }
    const text = await response.text();
    return parseTSV(text);
  } catch (error) {
    console.error("Error fetching data:", error);
    // In production, you might want to show a toast notification here
    return mockData;
  }
}

/**
 * Fetches Worksheet data specifically.
 * Parses rows into grouped Worksheets with Questions.
 */
export async function fetchWorksheetData(url: string, mockData: Worksheet[]): Promise<Worksheet[]> {
  // Check if URL is placeholder
  if (!url || url.includes('YOUR_PUBLISHED') || url.includes('YOUR_NEW_SHEET_URL') || url.includes('...')) {
    return mockData;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Worksheets TSV: ${response.statusText}`);
    }
    const text = await response.text();
    return parseWorksheetTSV(text);
  } catch (error) {
    console.error("Error fetching worksheet data:", error);
    return mockData;
  }
}

/**
 * Helper to extract YouTube ID from URL
 */
function getYouTubeID(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Parses raw TSV text into ResourceItem objects.
 * Assumes the sheet has headers: id, title, description, thumbnailUrl, linkUrl, category, author, grade (or lop)
 */
function parseTSV(tsvText: string): ResourceItem[] {
  const rows = tsvText.split('\n');
  if (rows.length < 2) return [];

  // Normalize headers: trim, lowercase, remove spaces (e.g., "Link Url" -> "linkurl")
  const headers = rows[0].split('\t').map(h => h.trim().toLowerCase().replace(/\s+/g, ''));
  const data: ResourceItem[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split('\t');
    // Basic check to ensure row has some content relative to headers
    if (row.length === 0 || (row.length === 1 && row[0] === '')) continue;

    const item: any = {};
    headers.forEach((header, index) => {
      item[header] = row[index]?.trim() || '';
    });

    if (item.title) {
      let finalThumbnail = item.thumbnailurl;
      let embedUrl = undefined;

      // Special handling for YouTube
      if (item.linkurl) {
        const ytId = getYouTubeID(item.linkurl);
        if (ytId) {
          // Auto-generate thumbnail if missing
          if (!finalThumbnail) {
            finalThumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
          }
          // Create embed URL
          embedUrl = `https://www.youtube.com/embed/${ytId}`;
        }
      }

      // Xử lý cột Lớp: Chấp nhận header là 'grade', 'lớp', 'lop', hoặc 'class'
      const gradeRaw = item.grade || item.lớp || item.lop || item.class || '';

      data.push({
        id: item.id || `row-${i}`,
        title: item.title,
        description: item.description || '',
        thumbnailUrl: finalThumbnail || '', // Trả về rỗng nếu không có ảnh, để UI tự hiển thị default icon
        linkUrl: item.linkurl || '#',
        embedUrl: embedUrl,
        category: item.category,
        author: item.author,
        date: item.date,
        grade: gradeRaw // Gán giá trị lớp
      });
    }
  }

  return data;
}

/**
 * Parses raw TSV text into Worksheet objects.
 * Groups multiple rows with the same worksheet ID into a single Worksheet object.
 */
function parseWorksheetTSV(tsvText: string): Worksheet[] {
  const rows = tsvText.split('\n');
  if (rows.length < 2) return [];

  // Normalize headers: remove spaces, lowercase
  // Expected headers: id_bai_tap, tieu_de_bai_tap, cau_hoi, loai_cau_hoi, dap_an_a, ...
  const headers = rows[0].split('\t').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  
  const worksheetsMap = new Map<string, Worksheet>();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split('\t');
    if (row.length === 0 || (row.length === 1 && row[0] === '')) continue;

    const item: any = {};
    headers.forEach((header, index) => {
      // replace underscore with nothing for standard property matching if needed, 
      // but here we use specific keys based on the sheet structure
      item[header] = row[index]?.trim() || '';
    });

    const id = item['id_bai_tap'] || item['id'];
    if (!id) continue;

    // Initialize worksheet if not exists
    if (!worksheetsMap.has(id)) {
      worksheetsMap.set(id, {
        id: id,
        title: item['tieu_de_bai_tap'] || item['title'] || 'Bài tập không tên',
        questions: []
      });
    }

    const ws = worksheetsMap.get(id)!;

    // Parse question data
    const questionText = item['cau_hoi'];
    if (questionText) {
      const typeRaw = item['loai_cau_hoi'] || 'mc';
      const type = typeRaw.toLowerCase() === 'text' ? 'text' : 'multiple-choice';
      
      const options: string[] = [];
      if (type === 'multiple-choice') {
        if (item['dap_an_a']) options.push(item['dap_an_a']);
        if (item['dap_an_b']) options.push(item['dap_an_b']);
        if (item['dap_an_c']) options.push(item['dap_an_c']);
        if (item['dap_an_d']) options.push(item['dap_an_d']);
      }

      const question: Question = {
        id: `q-${id}-${i}`, // Unique ID based on row index
        text: questionText,
        type: type,
        options: type === 'multiple-choice' ? options : undefined,
        correctAnswer: item['dap_an_dung'] || '',
        explanation: item['giai_thich'] || ''
      };

      ws.questions.push(question);
    }
  }

  return Array.from(worksheetsMap.values());
}