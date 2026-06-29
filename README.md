---

### 2. FILE `README.md` CHO REPOSITORY FRONTEND (REACTJS)

```markdown
# eMarket Frontend - Giao diện Khách hàng & Nhân viên

Đây là mã nguồn Frontend (Giao diện người dùng) của hệ thống Thương mại Điện tử eMarket - Đồ án môn học do **Nhóm 8** phát triển. Ứng dụng được xây dựng theo mô hình SPA (Single Page Application) mang lại trải nghiệm thao tác siêu mượt mà.

---

## Công nghệ sử dụng
* **Core:** ReactJS
* **Build Tool:** Vite (Tốc độ build và HMR cực nhanh)
* **CSS Framework:** Tailwind CSS / Bootstrap (Giao diện Responsive)
* **Routing:** React Router DOM
* **HTTP Client:** Axios (Tương tác với Spring Boot REST API)

---

##  Lưu ý quan trọng
Để Frontend có thể lấy được dữ liệu sản phẩm và giỏ hàng, **Thầy/Cô vui lòng khởi chạy Backend (Spring Boot) trước** tại cổng `http://localhost:8080` (Xem hướng dẫn tại Repository Backend của nhóm).

---

## Hướng dẫn cài đặt và Khởi chạy

### Bước 1: Yêu cầu môi trường
* Đảm bảo máy tính đã cài đặt **Node.js** (Phiên bản v18.0 trở lên). Thầy/Cô có thể kiểm tra bằng lệnh `node -v` trong Terminal.

### Bước 2: Cài đặt thư viện
1. Mở Terminal / Command Prompt hoặc VS Code.
2. Di chuyển vào thư mục gốc của dự án Frontend:
   ```bash
   cd emarket-frontend
   ``` 

 Chạy lệnh sau để tải toàn bộ thư viện (mất khoảng 1-2 phút):

```bash
npm install
```
Bước 3: Khởi chạy Ứng dụng
Sau khi cài đặt xong thư viện, chạy lệnh:

```bash
npm run dev
```
Vite sẽ biên dịch và cấp một đường dẫn cục bộ (thường là http://localhost:5173).

Thầy/Cô giữ phím Ctrl và Click vào đường dẫn đó (hoặc copy dán lên Google Chrome) để trải nghiệm giao diện eMarket.  
