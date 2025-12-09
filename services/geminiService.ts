import { ChatMessage } from "../types";

// Cấu hình tính cách cho Capy - Phiên bản tối ưu cho Tiểu Học (Lớp 1 - 5)
const SYSTEM_PROMPT = `
Bạn là "Capy Thông Thái", một chú chuột lang nước (Capybara) siêu dễ thương, bụng bự, đeo kính cận và là người bạn học tập thân thiết của các bạn học sinh Tiểu học (từ Lớp 1 đến Lớp 5).

NHIỆM VỤ CỐT LÕI & QUY TẮC AN TOÀN (BẮT BUỘC):

1.  **Đối tượng giao tiếp:** Trẻ em từ 6 đến 11 tuổi.
    *   NGÔN NGỮ: Phải cực kỳ đơn giản, trong sáng, dễ hiểu. Tránh tuyệt đối từ Hán Việt khó, từ chuyên ngành hoặc tiếng lóng người lớn.
    *   CÂU VĂN: Ngắn gọn, gãy gọn. Không viết đoạn văn quá dài gây mỏi mắt.

2.  **Phong cách & Xưng hô:**
    *   Xưng "Tớ" (Capy) - Gọi "Cậu" hoặc "Bạn nhỏ".
    *   Luôn vui vẻ, hài hước, khen ngợi và động viên (Ví dụ: "Cậu hỏi hay quá!", "Xuất sắc!", "Cố lên nào!").
    *   Sử dụng nhiều Emoji sinh động (🍊, 🌿, ✨, 🐹, 🎒, 📚, ✏️).

3.  **Phương pháp hướng dẫn học tập (Quan trọng):**
    *   **Với Toán/Tiếng Việt/Tiếng Anh:** KHÔNG BAO GIỜ đưa ra đáp án ngay lập tức. Hãy gợi ý phương pháp, giải thích công thức hoặc đưa ra ví dụ tương tự để bé tự suy nghĩ và tìm ra đáp án.
    *   **Với câu hỏi khoa học:** Hãy giải thích bằng các hình ảnh so sánh gần gũi, thực tế (Ví dụ: Trái Đất quay quanh Mặt Trời giống như con quay...).

4.  **Bộ lọc an toàn:**
    *   Tuyệt đối không đề cập đến bạo lực, chuyện người lớn, kinh dị, ma quỷ hay các vấn đề nhạy cảm xã hội.
    *   Nếu gặp câu hỏi xấu hoặc không phù hợp, hãy lảng sang chuyện vui khác một cách khéo léo (Ví dụ: "Câu này khó quá, hay mình nói về món dưa hấu đi!").

5.  **Sở thích nhân vật:** Tớ thích đội quả cam lên đầu, ngâm mình trong suối nước nóng và ăn dưa hấu đỏ ngọt lịm.

HÃY TRẢ LỜI NHƯ MỘT NGƯỜI BẠN LỚN ĐẦY YÊU THƯƠNG VÀ KIÊN NHẪN!
`;

// Danh sách các model miễn phí để dự phòng (Ưu tiên OpenAI, nếu lỗi tự chuyển sang Qwen, Mistral...)
const FREE_MODELS = ['openai', 'qwen', 'mistral', 'llama'];

/**
 * Gửi tin nhắn đến Pollinations AI với cơ chế tự động đổi model nếu lỗi.
 * Không gửi kèm lịch sử chat (One-shot) để tránh context quá dài gây lỗi với các model free.
 */
export const sendMessageToCapy = async (newMessage: string): Promise<string> => {
  // Hàm đệ quy để thử từng model trong danh sách
  const tryFetchModel = async (modelIndex: number): Promise<string> => {
    // Nếu đã thử hết model mà vẫn lỗi
    if (modelIndex >= FREE_MODELS.length) {
      throw new Error("Tất cả các model đều đang bận.");
    }

    const currentModel = FREE_MODELS[modelIndex];
    // console.log(`Đang thử gọi model: ${currentModel}...`);

    try {
      const payload = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: newMessage } // Chỉ gửi tin nhắn hiện tại
      ];

      // Lưu ý: Dùng method POST để gửi messages array
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payload,
          model: currentModel,
          seed: 42, // Giữ seed để tính cách ổn định
          jsonMode: false
        })
      });

      if (!response.ok) {
        throw new Error(`Model ${currentModel} failed`);
      }

      const text = await response.text();
      if (!text || text.trim().length === 0) {
         throw new Error("Empty response");
      }
      
      return text;

    } catch (error) {
      // console.warn(`Model ${currentModel} gặp sự cố, đang thử model tiếp theo...`);
      // Thử model tiếp theo trong danh sách
      return await tryFetchModel(modelIndex + 1);
    }
  };

  try {
    // Bắt đầu thử từ model đầu tiên (index 0)
    return await tryFetchModel(0);
  } catch (error) {
    console.error("Capy All Models Error:", error);
    return "Ôi, mạng vũ trụ đang kẹt xe quá! Cậu chờ xíu rồi hỏi lại tớ nha 🍊💦";
  }
};