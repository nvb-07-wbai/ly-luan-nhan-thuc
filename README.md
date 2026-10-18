# HƯỚNG DẪN SỬ DỤNG BÀI THUYẾT TRÌNH HỌC THUẬT HTML/CSS/JS

## CHỦ ĐỀ: LÝ LUẬN NHẬN THỨC (TRIẾT HỌC MÁC – LÊNIN)
**Bộ môn:** Triết học Mác – Lênin (Chương 2, Phần III)  
**Thời lượng trình bày:** 45 – 50 phút (Bao gồm 2 Trò chơi tương tác)  
**Định hướng thiết kế:** *Revolutionary Red & Ivory × Historical Cinematic Art × Modern Academic Presentation*

---

## 1. CÁCH MỞ VÀ TRÌNH CHIẾU

Trang web thuyết trình được đóng gói hoàn chỉnh dạng **Standalone Web Application**, không yêu cầu cài đặt máy chủ (Node.js hay Python server).

### Cách 1: Mở trực tiếp
- Nhấp đúp chuột trực tiếp vào tệp `presentation/index.html` để mở trên bất kỳ trình duyệt hiện đại nào (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, Brave...).

### Cách 2: Chạy qua Local HTTP Server (Tùy chọn)
Nếu muốn chạy qua giao thức HTTP:
```bash
cd presentation
python -m http.server 8000
```
Sau đó truy cập địa chỉ: `http://localhost:8000` trên trình duyệt.

---

## 2. HỆ THỐNG PHÍM TẮT ĐIỀU KHIỂN

Hệ thống được thiết kế tối ưu cho giảng viên và diễn giả thuyết trình trên bục giảng, tương thích hoàn toàn với chuột, bàn phím và bút trình chiếu laser (Presenter clicker):

| Phím tắt | Chức năng | Ghi chú |
|:---:|:---|:---|
| `→` / `Space` / `Page Down` / `↓` | **Chuyển sang slide tiếp theo** | Chuyển cảnh mượt mà, phát âm thanh lướt slide nhẹ |
| `←` / `Page Up` / `↑` | **Quay lại slide trước đó** | |
| `Home` | **Về slide bìa (Slide 1)** | |
| `End` | **Đến slide kết thúc (Slide 46)** | |
| `F` / `f` | **Bật / Tắt chế độ Toàn màn hình** | Phóng to tỉ lệ 16:9 chuẩn rạp chiếu |
| `N` / `n` | **Mở / Đóng Ghi chú người thuyết trình** | Hiển thị bảng Speaker Notes bên phải màn hình |
| `M` / `m` | **Mở / Đóng Danh mục tổng quan (Overview)** | Hiển thị lưới 46 slide để nhảy nhanh đến slide bất kỳ |
| `Esc` | **Đóng cửa sổ tổng quan hoặc bảng ghi chú** | |
| `S` / `s` | **Bật / Tắt hiệu ứng âm thanh** | Điều khiển bật/tắt bộ tổng hợp âm Web Audio API |

---

## 3. CÁC TÍNH NĂNG VÀ CÔNG CỤ HỖ TRỢ GIẢNG DẠY

### 3.1. Tự động co giãn chuẩn tỉ lệ 16:9 (Responsive Viewport Scaler)
- Bản trình chiếu luôn giữ tỷ lệ vàng 16:9 (1920 × 1080 px chuẩn HD/4K).
- Tự động nhận diện kích thước màn hình máy chiếu, laptop hay màn hình phụ để co giãn cân đối ở tâm màn hình mà không làm tràn chữ hay méo hình.

### 3.2. Bảng ghi chú thuyết trình thông minh (Speaker Notes Panel)
- Nhấn phím `N` hoặc bấm nút **"✎ Ghi chú"** ở thanh điều khiển bên dưới.
- Mỗi slide đều được tích hợp đầy đủ 5 trường thông tin:
  1. **Thời gian dự kiến:** Tính toán chính xác thời lượng từng slide để kiểm soát tổng bài nói 45–50 phút.
  2. **Giảng giải nội dung cốt lõi:** Lời giảng chuyên sâu bám sát từng trang trong giáo trình (từ trang 231 đến 256).
  3. **Ví dụ thực tế cần nêu:** Các ví dụ sinh động trong đời sống, khoa học tự nhiên và công nghệ hiện đại.
  4. **Luận điểm cần nhấn mạnh:** Những câu chốt then chốt để sinh viên ghi nhớ thi học phần.
  5. **Lời dẫn chuyển tiếp:** Câu nối mượt mà dẫn dắt sang slide tiếp theo.

### 3.3. Thanh tiến độ và Bộ đếm Slide thời gian thực
- Dải thanh tiến độ màu đỏ son và vàng kim chạy theo tỷ lệ hoàn thành ở chân màn hình.
- Bộ đếm hiển thị rõ ràng số thứ tự hiện tại, ví dụ: `Slide 18 / 46`.

---

## 4. HƯỚNG DẪN ĐIỀU HÀNH 2 TRÒ CHƠI TƯƠNG TÁC

Cả hai trò chơi đều hoạt động bằng JavaScript tương tác thời gian thực, có chấm điểm số, hiệu ứng phản hồi đúng/sai và lời giải thích học thuật sâu sắc:

### Trò chơi 1 (Giữa giờ): *"Thực tiễn hay chỉ là lý thuyết?"* (Slide 23)
- **Mục tiêu:** Giúp người học phân biệt ranh giới giữa hoạt động thực tiễn vật chất cải tạo hiện thực với hoạt động nhận thức/tinh thần thuần túy.
- **Cách chơi:** Gồm 5 tình huống thực tế. Giảng viên gọi sinh viên phát biểu lựa chọn phương án A, B, C hoặc D trên màn hình.
- **Phản hồi:** Hệ thống lập tức chấm điểm (20 điểm/câu), phát âm thanh phản hồi và mở hộp thoại giải thích căn cứ theo giáo trình trang 241–244.

### Trò chơi 2 (Cuối giờ): *"Giải mã hành trình nhận thức"* (Slide 44)
- **Mục tiêu:** Kiểm tra và đánh giá chuẩn đầu ra toàn bộ 5 phần bài giảng (nhận thức cảm tính, quy nạp, vai trò thực tiễn, tính cụ thể của chân lý và ứng dụng AI).
- **Cách chơi:** Gồm 5 câu hỏi tình huống nâng cao.
- **Bảng vinh danh:** Kết thúc 5 câu, hệ thống hiển thị tổng điểm và phong danh hiệu học thuật:
  * *100 điểm:* **Bậc Thầy Lý Luận Nhận Thức Mác - Lênin**
  * *60–80 điểm:* **Nhà Biện Chứng Xuất Sắc**
  * *Dưới 60 điểm:* **Cần trau dồi thêm giữa lý luận và thực tiễn**
- Có nút **"Chơi lại thử thách ↺"** để lớp ôn tập lại khi cần.

---

## 5. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
presentation/
├── index.html                  # Tệp giao diện chính gồm toàn bộ 46 slide hoàn chỉnh
├── assets/
│   ├── css/
│   │   └── style.css           # Toàn bộ quy tắc phong cách Red & Ivory, bố cục, hiệu ứng
│   ├── js/
│   │   ├── app.js              # Bộ điều khiển trình chiếu, phím tắt, ghi chú, co giãn 16:9
│   │   ├── audio.js            # Bộ tổng hợp âm thanh Web Audio API độc lập
│   │   └── games.js            # Logic xử lý chấm điểm và tình huống cho 2 trò chơi
│   └── images/                 # Kho ảnh lịch sử, tư liệu chân thực và đồ họa cắt lớp
│       ├── cutouts/            # Tranh cắt nhân vật Lênin, Mác-Ăngghen, cờ và huân chương
│       └── *.jpg               # Chân dung Mác, Ăngghen, Lênin, Kant, Hegel, Aristotle...
├── README.md                   # Hướng dẫn sử dụng chi tiết (tệp này)
└── SOURCES.md                  # Bảng kê khai chi tiết nguồn gốc giáo trình và bản quyền ảnh
```

---

## 6. THÔNG TIN BẢN QUYỀN VÀ HỌC THUẬT

- **Giáo trình tham chiếu:** Ban Tuyên giáo Trung ương – Bộ Giáo dục và Đào tạo, *Giáo trình Triết học Mác – Lênin* (Hệ không chuyên), NXB Chính trị quốc gia Sự thật, Hà Nội.
- **Thiết kế & Lập trình:** Thực hiện theo yêu cầu học thuật cao cấp và nghiên cứu mỹ thuật lịch sử phương Đông kết hợp công nghệ web hiện đại.
