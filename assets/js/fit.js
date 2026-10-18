/* FIT.JS: tự phóng cỡ chữ trong .slide-body lớn nhất có thể mà không tràn (đo trên bố cục thật, mỗi slide một hệ số). */
(function () {
  const MAX = 2.1, SKIP = new Set(['slide-game-1', 'slide-game-2']);
  const baseSizes = new WeakMap();
  function fit(slide) {
    const body = slide.querySelector('.slide-body');
    if (!body || SKIP.has(slide.id)) return;
    const els = [...body.querySelectorAll('*')].filter(e => !e.closest('svg') && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
    els.forEach(e => { e.style.fontSize = ''; });                      // về cỡ gốc trước khi đo lại
    els.forEach(e => baseSizes.set(e, parseFloat(getComputedStyle(e).fontSize)));
    const all = [body, ...body.querySelectorAll('*')].filter(e => e.tagName !== 'IMG');
    const ref = new Map(all.map(e => [e, e.scrollHeight - e.clientHeight]));
    const apply = k => els.forEach(e => { e.style.fontSize = (baseSizes.get(e) * k).toFixed(2) + 'px'; });
    const bottom = () => { const r = slide.getBoundingClientRect(); return r.bottom - 64 * (r.height / slide.offsetHeight); }; // mốc cố định: đáy vùng an toàn (body là flex item nên tự giãn)
    const _unused = null;          // cả vật thể xoay/tràn hình học (polaroid, chú thích)
    const refB = new Map(all.map(e => [e, Math.max(0, e.getBoundingClientRect().bottom - bottom())]));
    const bad = () => { const B = bottom(); return all.some(e => (e.clientHeight > 0 && (e.scrollHeight - e.clientHeight) > (ref.get(e) || 0) + 1) || (e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().bottom - B > (refB.get(e) || 0) + 1)); };
    let lo = 1, hi = MAX;
    apply(hi); if (!bad()) { slide.dataset.fit = hi; return; }
    for (let i = 0; i < 9; i++) { const m = (lo + hi) / 2; apply(m); bad() ? (hi = m) : (lo = m); }
    lo = Math.max(1, lo - 0.02);                                       // chừa một chút khoảng thở
    apply(lo); slide.dataset.fit = lo.toFixed(2);
  }
  const run = () => document.querySelectorAll('.slide').forEach(fit);
  document.addEventListener('DOMContentLoaded', () => { run(); (document.fonts ? document.fonts.ready : Promise.resolve()).then(run); });
  window.addEventListener('load', run);
})();
