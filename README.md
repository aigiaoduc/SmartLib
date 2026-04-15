# SmartLib - Thư Viện Số Học Tập 🍊

Dự án thư viện số dành cho học sinh tiểu học với giao diện thân thiện, tích hợp video, sách, bài giảng và Chatbot Capy thông thái.

## 🛠️ Cài đặt & Chạy Local

1.  **Clone dự án về máy**
2.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```
3.  **Chạy server development:**
    ```bash
    npm run dev
    ```
    Truy cập `http://localhost:3000` để xem ứng dụng.

## 🚀 Deploy lên Vercel

Dự án này đã được cấu hình sẵn để deploy cực nhanh trên Vercel.

1.  Đẩy code lên GitHub.
2.  Tạo project mới trên [Vercel](https://vercel.com).
3.  Import repo từ GitHub.
4.  Vercel sẽ tự động nhận diện Vite framework. Nhấn **Deploy**.

## 📁 Cấu trúc thư mục

*   `src/` (Mặc định nằm ở root trong bản này): Chứa code React.
*   `services/`: Các hàm gọi API (Google Sheet, Chatbot).
*   `components/`: Các UI Component (Sidebar, Grid, Chatbot...).
*   `constants.ts`: Cấu hình đường dẫn Google Sheet và Mock Data.

## 📝 Lưu ý

*   Dữ liệu được lấy từ Google Sheet (đã Publish to Web dưới dạng TSV).
*   Styling sử dụng Tailwind CSS (qua CDN để giữ nguyên cấu trúc gốc, nhưng vẫn tương thích tốt).
