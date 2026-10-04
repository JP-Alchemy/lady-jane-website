/* Lady Jane — Tattoo & Art · site interactions (no dependencies) */
(function () {
  'use strict';

  var WHATSAPP = '972515002650';
  var EMAIL = 'lj22designs@gmail.com';
  var IMG = 'assets/img/work/';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  /* ---------- Header: solid after scrolling ---------- */
  var header = $('.site-header');
  var floatCta = $('.float-cta');
  var alwaysSolid = header && header.classList.contains('is-solid');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header && !alwaysSolid) header.classList.toggle('is-solid', y > 40);
    if (floatCta) floatCta.classList.toggle('is-visible', y > window.innerHeight * 0.9);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = $('.menu-toggle');
  var menu = $('#mobile-menu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      $('.label', toggle).textContent = open ? 'Close' : 'Menu';
    }
    if (header && !alwaysSolid && open) header.classList.add('is-solid');
    if (!open) onScroll();
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // A fully clipped element never reports as intersecting, so clip reveals watch their parent instead.
    var watchers = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        (watchers.get(en.target) || []).forEach(function (el) { el.classList.add('is-in'); });
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) {
      var target = el.getAttribute('data-reveal') === 'clip' ? el.parentElement : el;
      if (!watchers.has(target)) watchers.set(target, []);
      watchers.get(target).push(el);
      io.observe(target);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Hero arch slideshow ---------- */
  var slides = $('[data-slides]');
  if (slides) {
    var imgs = $$('img', slides);
    var capEl = $('[data-slide-cap]');
    var numEl = $('[data-slide-num]');
    var cur = 0;
    var show = function (i) {
      imgs[cur].classList.remove('is-active');
      cur = (i + imgs.length) % imgs.length;
      imgs[cur].classList.add('is-active');
      if (capEl) capEl.textContent = imgs[cur].getAttribute('data-cap');
      if (numEl) numEl.textContent = ROMAN[cur];
    };
    if (!reduceMotion && imgs.length > 1) setInterval(function () { show(cur + 1); }, 5200);
  }

  /* ---------- Lightbox ---------- */
  var lb, lbImg, lbCap, lbCount, lbList = [], lbIndex = 0;
  function buildLightbox() {
    lb = document.createElement('dialog');
    lb.className = 'lightbox';
    lb.setAttribute('aria-label', 'Artwork viewer');
    lb.innerHTML =
      '<div class="lb-top"><span class="lb-counter" aria-live="polite"></span>' +
      '<button class="lb-close" type="button">Close <span aria-hidden="true" style="font-size:22px;line-height:1">×</span></button></div>' +
      '<div class="lb-stage"><img alt=""><button class="round-btn lb-nav lb-prev" type="button" aria-label="Previous">←</button>' +
      '<button class="round-btn lb-nav lb-next" type="button" aria-label="Next">→</button></div>' +
      '<div class="lb-bottom"><span class="lb-cap"></span><a class="link-arrow" href="index.html#begin">Begin your journey</a></div>';
    document.body.appendChild(lb);
    lbImg = $('img', lb); lbCap = $('.lb-cap', lb); lbCount = $('.lb-counter', lb);
    $('.lb-close', lb).addEventListener('click', closeLb);
    $('.lb-prev', lb).addEventListener('click', function () { stepLb(-1); });
    $('.lb-next', lb).addEventListener('click', function () { stepLb(1); });
    $('.link-arrow', lb).addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb(); });
    lb.addEventListener('close', function () { document.documentElement.style.overflow = ''; });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') stepLb(-1);
      if (e.key === 'ArrowRight') stepLb(1);
    });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }
  function renderLb() {
    var item = lbList[lbIndex];
    lbImg.src = IMG + item.src + '.webp';
    lbImg.alt = item.alt || item.cap || 'Artwork by Lady Jane';
    lbCap.textContent = item.cap || '';
    lbCount.textContent = (lbIndex + 1) + ' / ' + lbList.length;
    // warm the neighbours
    [1, -1].forEach(function (d) {
      var n = lbList[(lbIndex + d + lbList.length) % lbList.length];
      if (n) (new Image()).src = IMG + n.src + '.webp';
    });
  }
  function openLb(list, index) {
    if (!lb) buildLightbox();
    lbList = list; lbIndex = index;
    renderLb();
    document.documentElement.style.overflow = 'hidden';
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
  }
  function closeLb() {
    if (!lb) return;
    if (typeof lb.close === 'function') lb.close(); else lb.removeAttribute('open');
    document.documentElement.style.overflow = '';
  }
  function stepLb(d) { lbIndex = (lbIndex + d + lbList.length) % lbList.length; renderLb(); }

  // Any [data-full] inside a [data-lb-group] opens the viewer with its visible siblings
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-full]');
    if (!t) return;
    if (t.classList.contains('orb') && t.getAttribute('data-pos') !== '0') return; // orbit handles side items
    var group = t.closest('[data-lb-group]');
    var items = group ? $$('[data-full]', group).filter(function (el) { return !el.classList.contains('is-hidden'); }) : [t];
    if (items.length && items[0].hasAttribute('data-idx')) {
      items.sort(function (a, b) { return a.getAttribute('data-idx') - b.getAttribute('data-idx'); });
    }
    var list = items.map(function (el) {
      var im = $('img', el);
      return { src: el.getAttribute('data-full'), cap: el.getAttribute('data-cap'), alt: im ? im.alt : '' };
    });
    openLb(list, Math.max(0, items.indexOf(t)));
  });

  /* ---------- Commissions orbit ---------- */
  var orbit = $('[data-orbit]');
  if (orbit) {
    var orbs = $$('.orb', orbit);
    var oCap = $('[data-orbit-cap]');
    var oNum = $('[data-orbit-num]');
    var oi = 0;
    var placeOrbs = function () {
      var n = orbs.length;
      orbs.forEach(function (el, i) {
        var rel = i - oi;
        if (rel > n / 2) rel -= n;
        if (rel < -n / 2) rel += n;
        el.setAttribute('data-pos', Math.abs(rel) <= 2 ? String(rel) : 'hidden');
        el.tabIndex = rel === 0 ? 0 : -1;
      });
      if (oCap) oCap.textContent = orbs[oi].getAttribute('data-cap');
      if (oNum) oNum.textContent = ROMAN[oi] + ' / ' + ROMAN[orbs.length - 1];
    };
    var go = function (i) { oi = (i + orbs.length) % orbs.length; placeOrbs(); };
    orbs.forEach(function (el, i) {
      el.addEventListener('click', function () { if (el.getAttribute('data-pos') !== '0') go(i); });
    });
    $('[data-orbit-prev]').addEventListener('click', function () { go(oi - 1); });
    $('[data-orbit-next]').addEventListener('click', function () { go(oi + 1); });
    var ox = null;
    orbit.addEventListener('touchstart', function (e) { ox = e.touches[0].clientX; }, { passive: true });
    orbit.addEventListener('touchend', function (e) {
      if (ox === null) return;
      var dx = e.changedTouches[0].clientX - ox;
      if (Math.abs(dx) > 40) go(oi + (dx < 0 ? 1 : -1));
      ox = null;
    });
    placeOrbs();
  }

  /* ---------- Inquiry form → WhatsApp / email ---------- */
  var form = $('#inquiry');
  if (form) {
    var errEl = $('[data-form-error]', form);
    var via = 'whatsapp';
    $$('[data-via]', form).forEach(function (b) {
      b.addEventListener('click', function () { via = b.getAttribute('data-via'); });
    });
    // "Commission a piece" etc. preselect what the visitor is seeking
    $$('[data-seek]').forEach(function (a) {
      a.addEventListener('click', function () {
        var v = a.getAttribute('data-seek');
        $$('input[name="seek"]', form).forEach(function (r) { r.checked = r.value === v; });
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var missing = [];
      if (!f.name.value.trim()) missing.push('your name');
      if (!f.contact.value.trim()) missing.push('a phone number or email');
      if (!f.story.value.trim()) missing.push('a few words about your idea');
      if (missing.length) {
        var last = missing.pop();
        errEl.textContent = 'Please add ' + (missing.length ? missing.join(', ') + ' and ' : '') + last + '.';
        return;
      }
      if (!f.adult.checked) { errEl.textContent = 'Please confirm you’re 18 or older.'; return; }
      errEl.textContent = '';
      var seek = (form.querySelector('input[name="seek"]:checked') || {}).value || 'A tattoo';
      var lines = [
        'Hi Lady Jane, I’d like to begin a design journey.',
        '',
        'Name: ' + f.name.value.trim(),
        'Contact: ' + f.contact.value.trim(),
        'Seeking: ' + seek,
        '',
        'My story / idea:',
        f.story.value.trim()
      ];
      if (f.placement.value.trim()) lines.push('', 'Placement & size: ' + f.placement.value.trim());
      if (f.dates.value.trim()) lines.push('Preferred dates: ' + f.dates.value.trim());
      lines.push('', '(I confirm I’m 18+ and have read the studio policies.)');
      var text = lines.join('\n');
      var url = via === 'email'
        ? 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Ink Journey Request — ' + f.name.value.trim()) + '&body=' + encodeURIComponent(text)
        : 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);
      if (via === 'email') window.location.href = url; else window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- Archive page ---------- */
  var masonry = $('[data-masonry]');
  if (masonry && window.LJ_WORK) {
    var styles = window.LJ_STYLES;
    var labelOf = {};
    styles.forEach(function (s) { labelOf[s.id] = s.label; });
    // Interleave styles (keeping each style's own order) so "All works" opens with variety
    var byCat = {};
    window.LJ_WORK.forEach(function (w) { (byCat[w.cat] = byCat[w.cat] || []).push(w); });
    var preferred = ['engraving', 'symbolic', 'illustration', 'realism', 'paintings', 'handpoke'];
    var order = preferred.filter(function (c) { return byCat[c]; })
      .concat(Object.keys(byCat).filter(function (c) { return preferred.indexOf(c) < 0; }));
    var mixed = [];
    for (var round = 0; mixed.length < window.LJ_WORK.length; round++) {
      order.forEach(function (c) { if (byCat[c][round]) mixed.push(byCat[c][round]); });
    }
    var tiles = [];
    mixed.forEach(function (w, i) {
      var b = document.createElement('button');
      b.setAttribute('data-idx', i);
      b._ratio = w.h / w.w;
      b.type = 'button';
      b.className = 'tile';
      b.setAttribute('data-full', w.src);
      b.setAttribute('data-cat', w.cat);
      b.setAttribute('data-cap', labelOf[w.cat]);
      var tw = 720, th = Math.round(720 * w.h / w.w);
      if (w.w > w.h) { th = 720; tw = Math.round(720 * w.w / w.h); }
      b.innerHTML = '<img src="' + IMG + 't/' + w.src + '.webp" width="' + tw + '" height="' + th + '" loading="lazy" decoding="async" alt="' +
        labelOf[w.cat] + ' by Lady Jane">' +
        '<span class="tile-cap"><span class="caps-sm">' + labelOf[w.cat] + '</span><span class="plus">+</span></span>';
      tiles.push(b);
    });

    // Row-major masonry: each tile drops into the currently shortest column,
    // so the strongest pieces (listed first) line the top of the page.
    var colCount = 0;
    var layout = function (force) {
      var w = masonry.clientWidth;
      var n = w >= 1080 ? 4 : w >= 700 ? 3 : 2;
      if (n === colCount && !force) return;
      colCount = n;
      var cols = [], heights = [];
      for (var c = 0; c < n; c++) {
        var col = document.createElement('div');
        col.className = 'masonry-col';
        cols.push(col); heights.push(0);
      }
      tiles.forEach(function (t) {
        if (t.classList.contains('is-hidden')) return;
        var k = heights.indexOf(Math.min.apply(null, heights));
        cols[k].appendChild(t);
        heights[k] += t._ratio + 0.06;
      });
      masonry.textContent = '';
      cols.forEach(function (col) { masonry.appendChild(col); });
    };
    var rT;
    window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { layout(false); }, 150); });

    var bar = $('[data-filters]');
    var countEl = $('[data-count]');
    var all = [{ id: 'all', label: 'All works' }].concat(styles);
    all.forEach(function (s) {
      var n = s.id === 'all' ? window.LJ_WORK.length : window.LJ_WORK.filter(function (w) { return w.cat === s.id; }).length;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter';
      btn.setAttribute('data-filter', s.id);
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = s.label + ' <sup>' + n + '</sup>';
      btn.addEventListener('click', function () { applyFilter(s.id, true); });
      bar.appendChild(btn);
    });
    var applyFilter = function (id, push) {
      if (id !== 'all' && !labelOf[id]) id = 'all';
      var shown = 0;
      tiles.forEach(function (t) {
        var hide = id !== 'all' && t.getAttribute('data-cat') !== id;
        t.classList.toggle('is-hidden', hide);
        if (!hide) shown++;
      });
      layout(true);
      $$('.filter', bar).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === id)); });
      countEl.textContent = shown + (shown === 1 ? ' relic' : ' relics') + (id === 'all' ? '' : ' · ' + labelOf[id]);
      if (push && window.history && history.replaceState) {
        history.replaceState(null, '', id === 'all' ? location.pathname : '?style=' + id);
      }
    };
    var param = new URLSearchParams(location.search).get('style') || 'all';
    applyFilter(param, false);
  }

  /* ---------- Misc ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
