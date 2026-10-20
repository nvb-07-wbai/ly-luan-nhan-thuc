/**
 * APP.JS - Presentation Controller & Academic Lecture Runner
 * Xử lý: Tỷ lệ 16:9, Điều khiển phím, Fullscreen, Ghi chú thuyết trình, Menu tổng quan, Âm thanh
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('presentation-container');
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlide = 0;

  const slideCounter = document.getElementById('slide-counter');
  const progressBar = document.getElementById('progress-bar');
  const notesPanel = document.getElementById('notes-panel');
  const overviewModal = document.getElementById('overview-modal');
  const overviewGrid = document.getElementById('overview-grid');

  // 1. AUTO 16:9 RESPONSIVE VIEWPORT SCALING
  function updateViewportScale() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const targetWidth = 1920;
    const targetHeight = 1080;

    const scaleX = windowWidth / targetWidth;
    const scaleY = windowHeight / targetHeight;
    const scale = Math.min(scaleX, scaleY);

    if (container) {
      container.style.transform = `scale(${scale})`;
    }
  }

  window.addEventListener('resize', updateViewportScale);
  updateViewportScale();

  // 2a. MORPH ENGINE (View Transitions API): các "actor" cùng tên giữa hai slide sẽ biến hình liên tục
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canMorph = () => typeof document.startViewTransition === 'function' && !reduceMotion.matches;
  if (canMorph()) document.documentElement.classList.add('vt');
  const ACTORS = {
    badge: '.header-section-badge', title: '.slide-main-title', star: '.title-star-motif',
    pill: '.slide-subtitle-pill', pic: '.slide-body img', card: '.slide-body .ivory-card, .slide-body .dark-card',
    takeaway: '.takeaway-banner'
  };
  function tagActors(slide) {
    Object.entries(ACTORS).forEach(([k, sel]) => {
      const el = slide.querySelector(sel);
      if (el) el.style.viewTransitionName = 'actor-' + k;
    });
  }
  function untagActors(slide) {
    slide.querySelectorAll('[style*="view-transition-name"]').forEach(el => el.style.viewTransitionName = '');
  }
  function swapDom(to) { // idempotent: luôn suy ra trạng thái từ DOM, an toàn khi bấm nhanh
    document.querySelectorAll('.slide.active').forEach(s => { untagActors(s); s.classList.remove('active'); });
    slides[to].classList.add('active');
    tagActors(slides[to]);
  }
  let runningVT = null;
  function transitionTo(to, from) {
    if (!canMorph() || to === from) { swapDom(to); return; }
    if (runningVT) runningVT.skipTransition();
    document.documentElement.dataset.dir = to >= from ? 'fwd' : 'back';
    const vt = document.startViewTransition(() => swapDom(to));
    runningVT = vt;
    vt.finished.finally(() => { if (runningVT === vt) runningVT = null; });
  }

  // 2. SLIDE NAVIGATION CORE
  function goToSlide(index, playSfx = true) {
    if (index < 0 || index >= totalSlides) return;

    const prev = currentSlide;
    currentSlide = index;
    transitionTo(index, prev);
    try { history.replaceState(null, '', '#' + (index + 1)); } catch (_) {}

    // Update Counter & Progress Bar
    if (slideCounter) {
      slideCounter.textContent = `Slide ${currentSlide + 1} / ${totalSlides}`;
    }
    if (progressBar) {
      const pct = ((currentSlide + 1) / totalSlides) * 100;
      progressBar.style.width = `${pct}%`;
    }

    // Play Sound
    if (playSfx && window.SoundEngine) {
      window.SoundEngine.playSlide();
    }

    // Sync Speaker Notes
    updateSpeakerNotes();

    // Trigger Game Inits if entering game slides
    const activeEl = slides[currentSlide];
    if (activeEl.id === 'slide-game-1' && window.game1) {
      window.game1.init();
    } else if (activeEl.id === 'slide-game-2' && window.game2) {
      window.game2.init();
    }

    // Update Overview Active Card
    updateOverviewHighlight();
  }

  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }

  // 3. SPEAKER NOTES SYNCHRONIZATION
  function updateSpeakerNotes() {
    const activeEl = slides[currentSlide];
    if (!activeEl) return;

    const time = activeEl.getAttribute('data-notes-time') || '1 phút 15 giây';
    const explanation = activeEl.getAttribute('data-notes-explain') || 'Nội dung bài giảng bám sát giáo trình.';
    const example = activeEl.getAttribute('data-notes-example') || 'Nêu ví dụ thực tế liên hệ.';
    const keypoint = activeEl.getAttribute('data-notes-keypoint') || 'Luận điểm cốt lõi cần khắc sâu.';
    const transition = activeEl.getAttribute('data-notes-transition') || 'Chuyển tiếp sang nội dung tiếp theo.';
    const slideTitle = activeEl.querySelector('.slide-main-title')?.textContent || `Slide ${currentSlide + 1}`;

    const notesTitleEl = document.getElementById('notes-slide-title');
    const notesTimeEl = document.getElementById('notes-time');
    const notesExplainEl = document.getElementById('notes-explain');
    const notesExampleEl = document.getElementById('notes-example');
    const notesKeypointEl = document.getElementById('notes-keypoint');
    const notesTransitionEl = document.getElementById('notes-transition');

    if (notesTitleEl) notesTitleEl.textContent = slideTitle;
    if (notesTimeEl) notesTimeEl.textContent = `⏱ Thời gian: ${time}`;
    if (notesExplainEl) notesExplainEl.textContent = explanation;
    if (notesExampleEl) notesExampleEl.textContent = example;
    if (notesKeypointEl) notesKeypointEl.textContent = keypoint;
    if (notesTransitionEl) notesTransitionEl.textContent = transition;
  }

  function toggleNotes() {
    if (notesPanel) {
      notesPanel.classList.toggle('open');
      if (window.SoundEngine) window.SoundEngine.playClick();
    }
  }

  // 4. OVERVIEW / THUMBNAIL DRAWER
  function buildOverview() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';
    slides.forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = `overview-card ${idx === currentSlide ? 'active' : ''}`;
      const title = s.querySelector('.slide-main-title')?.textContent || `Slide ${idx + 1}`;
      const section = s.querySelector('.header-section-badge')?.textContent || 'Bài giảng';

      card.innerHTML = `
        <div class="overview-card-num">#${idx + 1} • ${section}</div>
        <div class="overview-card-title">${title}</div>
      `;
      card.onclick = () => {
        goToSlide(idx);
        toggleOverview();
      };
      overviewGrid.appendChild(card);
    });
  }

  function updateOverviewHighlight() {
    const cards = document.querySelectorAll('.overview-card');
    cards.forEach((c, idx) => {
      c.classList.toggle('active', idx === currentSlide);
    });
  }

  function toggleOverview() {
    if (!overviewModal) return;
    const isOpen = overviewModal.classList.contains('open');
    if (!isOpen) {
      buildOverview();
      overviewModal.classList.add('open');
    } else {
      overviewModal.classList.remove('open');
    }
    if (window.SoundEngine) window.SoundEngine.playClick();
  }

  // 5. FULLSCREEN TOGGLE
  function toggleFullscreen() {
    if (window.SoundEngine) window.SoundEngine.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  // 6. KEYBOARD EVENT LISTENERS
  document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && e.target.closest && e.target.closest('button')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    // If overview is open, Escape closes it
    if (overviewModal && overviewModal.classList.contains('open')) {
      if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') {
        toggleOverview();
        return;
      }
    }

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
      case 'ArrowDown':
        e.preventDefault();
        nextSlide();
        break;

      case 'ArrowLeft':
      case 'PageUp':
      case 'ArrowUp':
        e.preventDefault();
        prevSlide();
        break;

      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;

      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;

      case 'Escape':
        notesPanel?.classList.remove('open');
        break;

      case 'f':
      case 'F':
        toggleFullscreen();
        break;

      case 'n':
      case 'N':
        toggleNotes();
        break;

      case 'm':
      case 'M':
        toggleOverview();
        break;

      case 's':
      case 'S':
        if (window.SoundEngine) {
          const muted = window.SoundEngine.toggleMute();
          const sBtn = document.getElementById('btn-sound-toggle');
          if (sBtn) {
            sBtn.textContent = muted ? '🔇 Âm thanh: Tắt' : '🔊 Âm thanh: Bật';
          }
        }
        break;
    }
  });

  // 7. TOUCH / SWIPE GESTURE SUPPORT
  let touchStartX = 0;
  let touchEndX = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // 8. BUTTON HOOKS
  document.getElementById('btn-prev')?.addEventListener('click', () => {
    prevSlide();
    if (window.SoundEngine) window.SoundEngine.playClick();
  });
  document.getElementById('btn-next')?.addEventListener('click', () => {
    nextSlide();
    if (window.SoundEngine) window.SoundEngine.playClick();
  });
  document.getElementById('btn-notes')?.addEventListener('click', toggleNotes);
  document.getElementById('btn-close-notes')?.addEventListener('click', toggleNotes);
  document.getElementById('btn-overview')?.addEventListener('click', toggleOverview);
  document.getElementById('btn-close-overview')?.addEventListener('click', toggleOverview);
  document.getElementById('btn-fullscreen')?.addEventListener('click', toggleFullscreen);

  document.getElementById('btn-sound-toggle')?.addEventListener('click', () => {
    if (window.SoundEngine) {
      const muted = window.SoundEngine.toggleMute();
      const sBtn = document.getElementById('btn-sound-toggle');
      if (sBtn) {
        sBtn.textContent = muted ? '🔇 Tắt âm' : '🔊 Âm thanh';
      }
    }
  });

  // 9. THANH ĐIỀU KHIỂN TỰ ẨN + MỞ ĐÚNG SLIDE THEO #HASH
  // Giải mã sẵn mọi ảnh khi rảnh để lúc chuyển slide không bị khựng
  document.querySelectorAll('.slide img').forEach(i => { i.decoding = 'async'; });
  (window.requestIdleCallback || ((f) => setTimeout(f, 400)))(() => document.querySelectorAll('.slide img').forEach(i => i.decode && i.decode().catch(() => {})));
  let idleTimer;
  const wake = () => { document.body.classList.remove('idle'); clearTimeout(idleTimer); idleTimer = setTimeout(() => document.body.classList.add('idle'), 2500); };
  ['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach(ev => document.addEventListener(ev, wake, { passive: true }));
  wake();
  const fromHash = parseInt((location.hash || '').slice(1), 10);
  const startIdx = fromHash >= 1 && fromHash <= totalSlides ? fromHash - 1 : 0;
  slides.forEach(s => s.classList.remove('active'));
  currentSlide = startIdx;
  swapDom(startIdx);
  goToSlide(startIdx, false);
});
