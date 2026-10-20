/**
 * GAMES.JS - Logic tương tác cho hai trò chơi học thuật Triết học Mác - Lênin
 * Game 1: "Thực tiễn hay chỉ là lý thuyết?" (Giữa giờ)
 * Game 2: "Giải mã hành trình nhận thức" (Cuối giờ)
 */

// -------------------------------------------------------------
// GAME 1: THỰC TIỄN HAY CHỈ LÀ LÝ THUYẾT?
// -------------------------------------------------------------
const Game1Data = [
  {
    scenario: "Người nông dân cày ruộng, gieo cấy lúa giống mới lai tạo trên cánh đồng vào vụ đông xuân.",
    options: [
      { text: "A. Hoạt động Thực tiễn (Sản xuất vật chất)", correct: true },
      { text: "B. Hoạt động Nhận thức thuần túy", correct: false },
      { text: "C. Hoạt động Tinh thần trừu tượng", correct: false },
      { text: "D. Hiện tượng Tâm lý tự phát", correct: false }
    ],
    explanation: "Chính xác! Đây là hình thức thực tiễn cơ bản nhất: Sản xuất vật chất. Con người dùng tư liệu lao động tác động vào giới tự nhiên tạo ra của cải vật chất duy trì sự sống."
  },
  {
    scenario: "Nhà vật lý lý thuyết ngồi trong phòng làm việc, tư duy và lập phương trình toán học mô tả hố đen vũ trụ trên giấy nháp.",
    options: [
      { text: "A. Hoạt động Thực tiễn (Thực nghiệm khoa học)", correct: false },
      { text: "B. Hoạt động Nhận thức lý tính (Tư duy trừu tượng)", correct: true },
      { text: "C. Hoạt động Sản xuất vật chất", correct: false },
      { text: "D. Hoạt động Chính trị - xã hội", correct: false }
    ],
    explanation: "Chính xác! Đây là hoạt động nhận thức/tinh thần thuần túy (giai đoạn tư duy trừu tượng). Hoạt động này diễn ra trong óc và trên giấy, chưa phải thực nghiệm vật chất tác động trực tiếp vào hiện thực."
  },
  {
    scenario: "Các đại biểu Quốc hội thảo luận, biểu quyết bấm nút thông qua dự án Luật Đất đai sửa đổi tại nghị trường.",
    options: [
      { text: "A. Hoạt động Nhận thức cảm tính", correct: false },
      { text: "B. Hoạt động Thực nghiệm khoa học", correct: false },
      { text: "C. Hoạt động Thực tiễn (Chính trị - xã hội)", correct: true },
      { text: "D. Hoạt động Chiêm nghiệm triết học", correct: false }
    ],
    explanation: "Chính xác! Đây là hình thức thực tiễn Chính trị - xã hội: Hoạt động của các giai cấp, cộng đồng nhằm biến đổi, cải tạo các quan hệ xã hội và thể chế nhà nước."
  },
  {
    scenario: "Nhóm nghiên cứu y sinh nuôi cấy kháng thể trong phòng thí nghiệm vô trùng và thử nghiệm lâm sàng trên mô tế bào.",
    options: [
      { text: "A. Hoạt động Thực tiễn (Thực nghiệm khoa học)", correct: true },
      { text: "B. Hoạt động Nhận thức thông thường", correct: false },
      { text: "C. Hoạt động Tinh thần thuần túy", correct: false },
      { text: "D. Hoạt động Sản xuất đại trà", correct: false }
    ],
    explanation: "Chính xác! Thực nghiệm khoa học là hình thức thực tiễn đặc biệt: con người chủ động tạo môi trường nhân tạo có kiểm soát để khám phá bản chất và rút ngắn chu kỳ đưa tri thức vào sản xuất."
  },
  {
    scenario: "Một bạn sinh viên ngủ mơ thấy mình được 10 điểm Triết học Mác - Lênin và nghĩ rằng đề thi sẽ vào đúng câu mình thích.",
    options: [
      { text: "A. Hoạt động Thực tiễn lịch sử", correct: false },
      { text: "B. Hiện tượng Tâm lý / Ảo tưởng chủ quan", correct: true },
      { text: "C. Hoạt động Thực nghiệm khoa học", correct: false },
      { text: "D. Nhận thức khoa học tiên tiến", correct: false }
    ],
    explanation: "Chính xác! Giấc mơ chỉ là hiện tượng tâm lý sinh học của hệ thần kinh, không có tính mục đích tự giác cải tạo hiện thực và không phải là hoạt động thực tiễn."
  }
];

class Game1Controller {
  constructor() {
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
  }

  init() {
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
    this.finished = false;
    this.renderQuestion();
  }

  renderQuestion() {
    this.answered = false;
    const q = Game1Data[this.currentIndex];
    const scenarioEl = document.getElementById('game1-scenario');
    const optionsEl = document.getElementById('game1-options');
    const feedbackEl = document.getElementById('game1-feedback');
    const progressEl = document.getElementById('game1-progress');
    const scoreEl = document.getElementById('game1-score');
    const nextBtn = document.getElementById('game1-next-btn');

    if (!scenarioEl) return;

    scenarioEl.textContent = `Tình huống ${this.currentIndex + 1}/${Game1Data.length}: “${q.scenario}”`;
    progressEl.textContent = `Câu ${this.currentIndex + 1} / ${Game1Data.length}`;
    scoreEl.textContent = `Điểm: ${this.score * 20} / 100`;

    feedbackEl.className = 'game-feedback-box';
    feedbackEl.style.display = 'none';
    feedbackEl.textContent = '';
    nextBtn.style.display = 'none';

    optionsEl.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'game-option-btn';
      btn.textContent = opt.text;
      btn.onclick = () => this.handleAnswer(idx, btn);
      optionsEl.appendChild(btn);
    });
  }

  handleAnswer(selectedIdx, btnElement) {
    if (this.answered) return;
    this.answered = true;

    const q = Game1Data[this.currentIndex];
    const isCorrect = q.options[selectedIdx].correct;
    const feedbackEl = document.getElementById('game1-feedback');
    const nextBtn = document.getElementById('game1-next-btn');
    const allButtons = document.querySelectorAll('#game1-options .game-option-btn');

    allButtons.forEach((b, i) => {
      b.disabled = true;
      if (q.options[i].correct) {
        b.classList.add('correct');
      }
    });

    if (isCorrect) {
      this.score++;
      if (window.SoundEngine) window.SoundEngine.playCorrect();
      btnElement.classList.add('correct');
      feedbackEl.className = 'game-feedback-box feedback-correct show';
      feedbackEl.innerHTML = `<strong>★ ĐÚNG RỒI!</strong> ${q.explanation}`;
    } else {
      if (window.SoundEngine) window.SoundEngine.playWrong();
      btnElement.classList.add('wrong');
      feedbackEl.className = 'game-feedback-box feedback-wrong show';
      feedbackEl.innerHTML = `<strong>✗ CHƯA CHÍNH XÁC!</strong> ${q.explanation}`;
    }

    const scoreEl = document.getElementById('game1-score');
    if (scoreEl) scoreEl.textContent = `Điểm: ${this.score * 20} / 100`;

    feedbackEl.style.display = 'block';
    nextBtn.style.display = 'inline-block';
    if (this.currentIndex === Game1Data.length - 1) {
      nextBtn.textContent = 'Xem Kết Quả & Hoàn Thành';
    } else {
      nextBtn.textContent = 'Tình huống tiếp theo →';
    }
  }

  next() {
    if (this.finished) { this.init(); return; }
    if (this.currentIndex < Game1Data.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
    } else {
      this.renderSummary();
    }
  }

  renderSummary() {
    if (window.SoundEngine) window.SoundEngine.playVictory();
    const scenarioEl = document.getElementById('game1-scenario');
    const optionsEl = document.getElementById('game1-options');
    const feedbackEl = document.getElementById('game1-feedback');
    const nextBtn = document.getElementById('game1-next-btn');

    scenarioEl.textContent = 'TỔNG KẾT TRÒ CHƠI GIỮA GIỜ';
    optionsEl.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 24px;">
        <h3 style="font-size: 26px; color: var(--color-crimson); margin-bottom: 12px;">
          Bạn đạt được ${this.score * 20} / 100 điểm (${this.score}/${Game1Data.length} tình huống đúng)!
        </h3>
        <p style="font-size: 18px; line-height: 1.6; color: var(--color-text-main);">
          ${this.score >= 4 ? 'Xuất sắc! Bạn đã nắm vững bản chất và 3 hình thức cơ bản của hoạt động thực tiễn theo quan điểm duy vật biện chứng.' : 'Khá tốt! Hãy chú ý phân biệt giữa tư duy trừu tượng thuần túy và hoạt động thực tiễn vật chất cải tạo hiện thực.'}
        </p>
      </div>
    `;

    feedbackEl.style.display = 'none';
    nextBtn.textContent = 'Chơi lại từ đầu ↺';
    nextBtn.style.display = 'inline-block';
    this.finished = true; // nút "Chơi lại" dùng chung onclick=next(); next() sẽ khởi động lại khi finished
  }
}

// -------------------------------------------------------------
// GAME 2: GIẢI MÃ HÀNH TRÌNH NHẬN THỨC
// -------------------------------------------------------------
const Game2Data = [
  {
    q: "Khi một em bé vô tình chạm tay vào ấm nước nóng, thấy rát bỏng và lập tức rụt tay lại. Đây là hình thức nào của giai đoạn nhận thức cảm tính?",
    options: [
      { text: "A. Cảm giác (Sensation)", correct: true },
      { text: "B. Khái niệm (Concept)", correct: false },
      { text: "C. Biểu tượng (Representation)", correct: false },
      { text: "D. Suy lý (Inference)", correct: false }
    ],
    explanation: "Đúng! Cảm giác là hình thức đầu tiên, đơn giản nhất, phản ánh từng thuộc tính riêng lẻ bề ngoài của sự vật khi tác động trực tiếp vào giác quan."
  },
  {
    q: "Bác sĩ lâm sàng nghiên cứu 100 ca bệnh nhân cùng mắc triệu chứng sốt phát ban, từ đó đúc kết ra phác đồ điều trị áp dụng cho toàn bộ dịch bệnh. Bác sĩ đã sử dụng phương pháp tư duy nào?",
    options: [
      { text: "A. Diễn dịch (Deduction)", correct: false },
      { text: "B. Quy nạp (Induction)", correct: true },
      { text: "C. Trực giác siêu hình", correct: false },
      { text: "D. Phủ định của phủ định", correct: false }
    ],
    explanation: "Đúng! Quy nạp là phương pháp suy luận đi từ những tri thức về sự vật, hiện tượng riêng lẻ, cá biệt để khái quát rút ra tri thức chung về cả lớp đối tượng."
  },
  {
    q: "Một kỹ sư phần mềm viết xong thuật toán học máy, đưa vào chạy benchmark trên cụm máy chủ để kiểm tra độ chính xác trước khi xuất xưởng. Hành động này thể hiện vai trò gì của thực tiễn?",
    options: [
      { text: "A. Thực tiễn là tiêu chuẩn kiểm tra chân lý", correct: true },
      { text: "B. Thực tiễn mang tính trừu tượng", correct: false },
      { text: "C. Thực tiễn thay thế hoàn toàn lý luận", correct: false },
      { text: "D. Thực tiễn là mục đích giải trí", correct: false }
    ],
    explanation: "Đúng! Mọi ý tưởng hay lý thuyết dù logic đến đâu cũng chỉ là giả thuyết chừng nào chưa được thực tiễn (chạy thử nghiệm máy chủ) kiểm chứng tính xác thực."
  },
  {
    q: "Luận điểm 'Nước sôi ở 100°C' là chân lý mang những tính chất nào sau đây?",
    options: [
      { text: "A. Chân lý tuyệt đối đúng ở mọi áp suất và không gian vũ trụ", correct: false },
      { text: "B. Vừa mang tính tương đối, vừa mang tính cụ thể", correct: true },
      { text: "C. Là nhận thức chủ quan tùy thuộc người đun nước", correct: false },
      { text: "D. Là chân lý trừu tượng bất biến", correct: false }
    ],
    explanation: "Đúng! Chân lý luôn có tính cụ thể và tương đối: Nước chỉ sôi ở 100°C trong điều kiện áp suất khí quyển tiêu chuẩn 1 atm. Trên đỉnh Everest, nước sôi ở khoảng 71°C!"
  },
  {
    q: "Trong kỷ nguyên số, khi phát hiện mô hình AI (ChatGPT, Gemini) đưa ra thông tin có vẻ hợp lý nhưng bị 'ảo giác' (Hallucination), sinh viên cần làm gì theo nguyên tắc thực tiễn của Lênin?",
    options: [
      { text: "A. Hoàn toàn tin tưởng vì AI sở hữu hàng trăm tỷ tham số", correct: false },
      { text: "B. Bác bỏ và cấm hoàn toàn mọi ứng dụng công nghệ số", correct: false },
      { text: "C. Dùng thực nghiệm kiểm chứng, chạy code và đối chiếu giáo trình gốc", correct: true },
      { text: "D. Sao chép nguyên văn không cần chịu trách nhiệm", correct: false }
    ],
    explanation: "Đúng! AI chỉ là công cụ nối dài giác quan và trí tuệ. Thực tiễn khách quan và lập luận khoa học mới là tiêu chuẩn tối thượng để kiểm chứng chân lý."
  }
];

class Game2Controller {
  constructor() {
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
  }

  init() {
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
    this.finished = false;
    this.renderQuestion();
  }

  renderQuestion() {
    this.answered = false;
    const q = Game2Data[this.currentIndex];
    const qEl = document.getElementById('game2-question');
    const optionsEl = document.getElementById('game2-options');
    const feedbackEl = document.getElementById('game2-feedback');
    const progressEl = document.getElementById('game2-progress');
    const scoreEl = document.getElementById('game2-score');
    const nextBtn = document.getElementById('game2-next-btn');

    if (!qEl) return;

    qEl.textContent = `Câu hỏi ${this.currentIndex + 1}/${Game2Data.length}: ${q.q}`;
    progressEl.textContent = `Câu ${this.currentIndex + 1} / ${Game2Data.length}`;
    scoreEl.textContent = `Điểm: ${this.score * 20} / 100`;

    feedbackEl.className = 'game-feedback-box';
    feedbackEl.style.display = 'none';
    feedbackEl.textContent = '';
    nextBtn.style.display = 'none';

    optionsEl.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'game-option-btn';
      btn.textContent = opt.text;
      btn.onclick = () => this.handleAnswer(idx, btn);
      optionsEl.appendChild(btn);
    });
  }

  handleAnswer(selectedIdx, btnElement) {
    if (this.answered) return;
    this.answered = true;

    const q = Game2Data[this.currentIndex];
    const isCorrect = q.options[selectedIdx].correct;
    const feedbackEl = document.getElementById('game2-feedback');
    const nextBtn = document.getElementById('game2-next-btn');
    const allButtons = document.querySelectorAll('#game2-options .game-option-btn');

    allButtons.forEach((b, i) => {
      b.disabled = true;
      if (q.options[i].correct) {
        b.classList.add('correct');
      }
    });

    if (isCorrect) {
      this.score++;
      if (window.SoundEngine) window.SoundEngine.playCorrect();
      btnElement.classList.add('correct');
      feedbackEl.className = 'game-feedback-box feedback-correct show';
      feedbackEl.innerHTML = `<strong>★ CHÍNH XÁC!</strong> ${q.explanation}`;
    } else {
      if (window.SoundEngine) window.SoundEngine.playWrong();
      btnElement.classList.add('wrong');
      feedbackEl.className = 'game-feedback-box feedback-wrong show';
      feedbackEl.innerHTML = `<strong>✗ CHƯA CHÍNH XÁC!</strong> ${q.explanation}`;
    }

    const scoreEl = document.getElementById('game2-score');
    if (scoreEl) scoreEl.textContent = `Điểm: ${this.score * 20} / 100`;

    feedbackEl.style.display = 'block';
    nextBtn.style.display = 'inline-block';
    if (this.currentIndex === Game2Data.length - 1) {
      nextBtn.textContent = 'Xem Bảng Xếp Loại & Tổng Kết';
    } else {
      nextBtn.textContent = 'Câu hỏi tiếp theo →';
    }
  }

  next() {
    if (this.finished) { this.init(); return; }
    if (this.currentIndex < Game2Data.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
    } else {
      this.renderSummary();
    }
  }

  renderSummary() {
    if (window.SoundEngine) window.SoundEngine.playVictory();
    const qEl = document.getElementById('game2-question');
    const optionsEl = document.getElementById('game2-options');
    const feedbackEl = document.getElementById('game2-feedback');
    const nextBtn = document.getElementById('game2-next-btn');

    // Danh hiệu khớp với slide 43 và README: 100 điểm / 60–80 điểm / dưới 60 điểm
    let rankTitle;
    if (this.score === 5) rankTitle = "Bậc Thầy Lý Luận Nhận Thức Mác – Lênin";
    else if (this.score >= 3) rankTitle = "Nhà Biện Chứng Xuất Sắc";
    else rankTitle = "Cần Trau Dồi Thêm Thực Tiễn & Lý Luận";

    qEl.textContent = 'VINH DANH KẾT QUẢ: GIẢI MÃ HÀNH TRÌNH NHẬN THỨC';
    optionsEl.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 24px;">
        <div style="font-size: 48px; margin-bottom: 8px;">★ ★ ★</div>
        <h3 style="font-size: 28px; color: var(--color-crimson); margin-bottom: 8px;">
          Điểm số: ${this.score * 20} / 100 điểm
        </h3>
        <h4 style="font-size: 22px; color: var(--color-gold-dark); margin-bottom: 16px;">
          Danh hiệu: [ ${rankTitle} ]
        </h4>
        <p style="font-size: 18px; line-height: 1.6; color: var(--color-text-main); max-width: 800px; margin: 0 auto;">
          Chúc mừng bạn đã hoàn thành xuất sắc thử thách giải mã quá trình nhận thức từ trực quan sinh động đến tư duy trừu tượng và kiểm chứng qua thực tiễn!
        </p>
      </div>
    `;

    feedbackEl.style.display = 'none';
    nextBtn.textContent = 'Chơi lại thử thách ↺';
    nextBtn.style.display = 'inline-block';
    this.finished = true; // nút "Chơi lại" dùng chung onclick=next(); next() sẽ khởi động lại khi finished
  }
}

window.game1 = new Game1Controller();
window.game2 = new Game2Controller();
