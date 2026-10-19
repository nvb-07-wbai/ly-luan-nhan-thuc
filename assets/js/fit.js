/* FIT.JS: tự phóng cỡ chữ lớn nhất có thể mà không tràn. Mỗi cột trong .slide-body co giãn riêng
   (cột phụ không vượt cột chính quá 25% để giữ nhất quán), sau đó kiểm tra lại toàn slide. */
(function () {
  const MAX = 2.1, SIDE_RATIO = 1.25, SKIP = new Set(['slide-game-1', 'slide-game-2']);
  const base = new WeakMap();
  const textEls = root => [...root.querySelectorAll('*')].filter(e => !e.closest('svg, [data-nofit]') && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
  function fit(slide) {
    const body = slide.querySelector('.slide-body');
    if (!body || SKIP.has(slide.id)) return;
    const all = [body, ...body.querySelectorAll('*')].filter(e => e.tagName !== 'IMG');
    all.forEach(e => { if (e.dataset.fs0 === undefined) e.dataset.fs0 = e.style.fontSize; });   // nhớ cỡ chữ inline gốc
    all.forEach(e => { e.style.fontSize = e.dataset.fs0; });                                       // và khôi phục trước khi đo lại
    const groups = [...body.children].map(c => ({ c, els: textEls(c), len: c.textContent.trim().length })).filter(g => g.els.length);
    if (!groups.length) return;
    groups.forEach(g => g.els.forEach(e => base.set(e, parseFloat(getComputedStyle(e).fontSize))));
    const limit = () => { const r = slide.getBoundingClientRect(); return r.bottom - 64 * (r.height / slide.offsetHeight); };
    const refS = new Map(all.map(e => [e, e.scrollHeight - e.clientHeight]));
    const L0 = limit(), refB = new Map(all.map(e => [e, Math.max(0, e.getBoundingClientRect().bottom - L0)]));
    const bad = set => { const L = limit(); return set.some(e => (e.clientHeight > 0 && (e.scrollHeight - e.clientHeight) > (refS.get(e) || 0) + 4) || (e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().bottom - L > (refB.get(e) || 0) + 1)); };
    const apply = (g, k) => g.els.forEach(e => { e.style.fontSize = (base.get(e) * k).toFixed(2) + 'px'; });
    groups.forEach(g => {
      const set = all.filter(e => g.c.contains(e)); let lo = 1, hi = MAX;
      apply(g, hi);
      if (bad(set)) { for (let i = 0; i < 9; i++) { const m = (lo + hi) / 2; apply(g, m); bad(set) ? (hi = m) : (lo = m); } g.k = Math.max(1, lo - 0.02); } else g.k = hi;
      apply(g, 1);
    });
    const main = groups.reduce((a, b) => (b.len > a.len ? b : a));
    groups.forEach(g => { if (g !== main) g.k = Math.min(g.k, main.k * SIDE_RATIO); });
    for (let i = 0; i < 25; i++) {
      groups.forEach(g => apply(g, g.k));
      if (!bad(all)) break;
      groups.forEach(g => { g.k = Math.max(1, g.k - 0.04); });
    }
    slide.dataset.fit = groups.map(g => g.k.toFixed(2)).join('/');
  }
  const run = () => document.querySelectorAll('.slide').forEach(fit);
  document.addEventListener('DOMContentLoaded', () => { run(); (document.fonts ? document.fonts.ready : Promise.resolve()).then(run); });
  window.addEventListener('load', run);
})();
