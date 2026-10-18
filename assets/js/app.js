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

  // 2. SLIDE NAVIGATION CORE
  function goToSlide(index, playSfx = true) {
    if (index < 0 || index >= totalSlides) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');

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
    // If overview is open, Escape closes it
    if (overviewModal && overviewModal.classList.contains('open')) {
      if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') {
        toggleOverview();
        return;
      }
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'Space':
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

  // INITIALIZE FIRST SLIDE
  goToSlide(0, false);
});
