/* Lady Jane — Tattoo & Art · site interactions (no dependencies) */
(function () {
  'use strict';

  var WHATSAPP = '972515002650';
  var EMAIL = 'lj22designs@gmail.com';
  // Web3Forms delivers form submissions by email. The access key is meant to be public.
  var FORM_ENDPOINT = 'https://api.web3forms.com/submit';
  var FORM_KEY = '726bf025-e5fc-45e9-9e9f-ac95c7bcbcac';
  var ROOT = document.documentElement;
  var RTL = ROOT.dir === 'rtl';
  // Pages in a sub-folder (the Hebrew site in /he/) point back up to the shared assets
  var IMG = (ROOT.getAttribute('data-base') || '') + 'assets/img/work/';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Strings (English / Hebrew) ---------- */
  var STRINGS = {
    en: {
      numerals: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'],
      menu: 'Menu', close: 'Close', viewer: 'Artwork viewer', prev: 'Previous', next: 'Next',
      begin: 'Begin your journey', artwork: 'Artwork by Lady Jane',
      allWorks: 'All works', relic: ' relic', relics: ' relics',
      styles: { engraving: 'Engraving & Sketch', symbolic: 'Symbolic & Mythology', realism: 'Blackwork Realism', handpoke: 'Hand-poke', illustration: 'Illustration & Design', paintings: 'Paintings' },
      alt: { engraving: 'Engraving and sketch style tattoo', symbolic: 'Symbolic fine line tattoo', realism: 'Blackwork realism tattoo', handpoke: 'Hand-poke tattoo', illustration: 'Tattoo design illustration', paintings: 'Symbolic painting' },
      altSuffix: ' by Lady Jane, tattoo artist in Tel Aviv',
      need: { name: 'your name', email: 'your email', story: 'a few words about your idea' },
      pleaseAdd: function (items) { var last = items.pop(); return 'Please add ' + (items.length ? items.join(', ') + ' and ' : '') + last + '.'; },
      badEmail: 'Please check your email address.',
      adult: 'Please confirm you’re 18 or older.',
      sending: 'Sending…', send: 'Send your request',
      failed: function (wa, mail) { return 'Your request couldn’t be sent just now. Please try again, or reach me on ' + wa + ' or at ' + mail + '.'; },
      waWord: 'WhatsApp',
      successName: function (first) { return ', ' + first; },
      wa: { hello: 'Hi Lady Jane, I’d like to begin a design journey.', name: 'Name: ', email: 'Email: ', seek: 'Seeking: ', story: 'My story / idea:', place: 'Placement & size: ', dates: 'Preferred dates: ', adult: '(I confirm I’m 18+ and have read the studio policies.)' },
      mail: { subject: 'Ink Journey Request — ', from: 'Lady Jane website', phone: 'WhatsApp / phone', seek: 'Seeking', story: 'Story / idea', place: 'Placement & size', dates: 'Preferred dates', adult: '18+ & read policies', yes: 'Yes' }
    },
    he: {
      numerals: ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳', 'י׳', 'י״א', 'י״ב'],
      menu: 'תפריט', close: 'סגירה', viewer: 'הצגת יצירות', prev: 'הקודם', next: 'הבא',
      begin: 'התחילו את המסע', artwork: 'יצירה של ליידי ג׳יין',
      allWorks: 'כל העבודות', relic: ' קמע', relics: ' קמעות',
      styles: { engraving: 'תחריט וסקיצה', symbolic: 'סמלים ומיתולוגיה', realism: 'ריאליזם שחור', handpoke: 'הנד-פוק', illustration: 'איור ועיצוב', paintings: 'ציורים' },
      alt: { engraving: 'קעקוע בסגנון תחריט וסקיצה', symbolic: 'קעקוע סמלי בפיין ליין', realism: 'קעקוע ריאליזם שחור', handpoke: 'קעקוע הנד-פוק', illustration: 'איור עיצוב לקעקוע', paintings: 'ציור סמלי' },
      altSuffix: ' מאת ליידי ג׳יין, מקעקעת בתל אביב',
      need: { name: 'שם', email: 'אימייל', story: 'כמה מילים על הרעיון' },
      pleaseAdd: function (items) { var last = items.pop(); return 'נא להוסיף ' + (items.length ? items.join(', ') + ' ו' : '') + last + '.'; },
      badEmail: 'נא לבדוק את כתובת האימייל.',
      adult: 'נא לאשר שאתם מעל גיל 18.',
      sending: 'בשליחה…', send: 'שליחת הבקשה',
      failed: function (wa, mail) { return 'לא הצלחנו לשלוח את הבקשה כרגע. נסו שוב, או פנו אליי ב' + wa + ' או במייל ' + mail + '.'; },
      waWord: 'וואטסאפ',
      successName: function (first) { return ', ' + first; },
      wa: { hello: 'היי ליידי ג׳יין, אשמח להתחיל מסע עיצוב.', name: 'שם: ', email: 'אימייל: ', seek: 'מבוקש: ', story: 'הסיפור / הרעיון שלי:', place: 'מיקום וגודל: ', dates: 'תאריכים מועדפים: ', adult: '(אני מאשר/ת שאני מעל גיל 18 וקראתי את מדיניות הסטודיו.)' },
      mail: { subject: 'בקשה חדשה מהאתר בעברית — ', from: 'Lady Jane website (HE)', phone: 'וואטסאפ / טלפון', seek: 'מבוקש', story: 'הסיפור / הרעיון', place: 'מיקום וגודל', dates: 'תאריכים מועדפים', adult: 'מעל 18 וקרא/ה את המדיניות', yes: 'כן' }
    }
  };
  var T = STRINGS[ROOT.lang === 'he' ? 'he' : 'en'];
  var ROMAN = T.numerals;
  // In right-to-left pages "next" lies to the left, so arrow keys and swipes flip
  var FWD = RTL ? -1 : 1;

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
      $('.label', toggle).textContent = open ? T.close : T.menu;
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
    lb.setAttribute('aria-label', T.viewer);
    lb.innerHTML =
      '<div class="lb-top"><span class="lb-counter" aria-live="polite"></span>' +
      '<button class="lb-close" type="button">' + T.close + ' <span aria-hidden="true" style="font-size:22px;line-height:1">×</span></button></div>' +
      '<div class="lb-stage"><img alt=""><button class="round-btn lb-nav lb-prev" type="button" aria-label="' + T.prev + '">' + (RTL ? '→' : '←') + '</button>' +
      '<button class="round-btn lb-nav lb-next" type="button" aria-label="' + T.next + '">' + (RTL ? '←' : '→') + '</button></div>' +
      '<div class="lb-bottom"><span class="lb-cap"></span><a class="link-arrow" href="./#begin">' + T.begin + '</a></div>';
    document.body.appendChild(lb);
    lbImg = $('img', lb); lbCap = $('.lb-cap', lb); lbCount = $('.lb-counter', lb);
    $('.lb-close', lb).addEventListener('click', closeLb);
    $('.lb-prev', lb).addEventListener('click', function () { stepLb(-1); });
    $('.lb-next', lb).addEventListener('click', function () { stepLb(1); });
    $('.link-arrow', lb).addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb(); });
    lb.addEventListener('close', function () { document.documentElement.style.overflow = ''; });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') stepLb(-FWD);
      if (e.key === 'ArrowRight') stepLb(FWD);
    });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) stepLb(dx < 0 ? FWD : -FWD);
      x0 = null;
    });
  }
  function renderLb() {
    var item = lbList[lbIndex];
    lbImg.src = IMG + item.src + '.webp';
    lbImg.alt = item.alt || item.cap || T.artwork;
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
      if (Math.abs(dx) > 40) go(oi + (dx < 0 ? FWD : -FWD));
      ox = null;
    });
    placeOrbs();
  }

  /* ---------- Inquiry form → Web3Forms (email to Anneline) or WhatsApp ---------- */
  var form = $('#inquiry');
  if (form) {
    var errEl = $('[data-form-error]', form);
    var sendBtn = $('[data-via="form"]', form);
    var sendLabel = $('[data-btn-label]', form);
    var lastVia = 'form';
    $$('[data-via]', form).forEach(function (b) {
      b.addEventListener('click', function () { lastVia = b.getAttribute('data-via'); });
    });
    // "Commission a piece" etc. preselect what the visitor is seeking
    $$('[data-seek]').forEach(function (a) {
      a.addEventListener('click', function () {
        var v = a.getAttribute('data-seek');
        $$('input[name="seek"]', form).forEach(function (r) { r.checked = r.value === v; });
      });
    });

    var fail = function (msg) { errEl.textContent = msg; };
    var showSuccess = function (name) {
      $('.form-body', form).hidden = true;
      var ok = $('[data-form-success]', form);
      $('[data-success-name]', ok).textContent = name ? T.successName(name.split(' ')[0]) : '';
      ok.hidden = false;
      ok.focus({ preventScroll: true });
      form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.getAttribute('data-via')) || lastVia;
      var f = form.elements;
      var v = {
        name: f.name.value.trim(),
        email: f.email.value.trim(),
        phone: f.phone.value.trim(),
        story: f.story.value.trim(),
        placement: f.placement.value.trim(),
        dates: f.dates.value.trim(),
        seek: (form.querySelector('input[name="seek"]:checked') || {}).value || 'A tattoo'
      };

      var missing = [];
      if (!v.name) missing.push(T.need.name);
      if (via === 'form' && !v.email) missing.push(T.need.email);
      if (!v.story) missing.push(T.need.story);
      if (missing.length) return fail(T.pleaseAdd(missing));
      if (via === 'form' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return fail(T.badEmail);
      if (!f.adult.checked) return fail(T.adult);
      errEl.textContent = '';

      if (via === 'whatsapp') {
        var lines = [T.wa.hello, '', T.wa.name + v.name];
        if (v.email) lines.push(T.wa.email + v.email);
        lines.push(T.wa.seek + v.seek, '', T.wa.story, v.story);
        if (v.placement) lines.push('', T.wa.place + v.placement);
        if (v.dates) lines.push(T.wa.dates + v.dates);
        lines.push('', T.wa.adult);
        window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
        return;
      }

      // Spam trap: real people never see or tick this box
      if (f.botcheck.checked) return showSuccess(v.name);

      sendBtn.disabled = true;
      sendLabel.textContent = T.sending;
      var M = T.mail;
      var payload = { access_key: FORM_KEY, subject: M.subject + v.name, from_name: M.from, name: v.name, email: v.email };
      payload[M.phone] = v.phone || '—';
      payload[M.seek] = v.seek;
      payload[M.story] = v.story;
      payload[M.place] = v.placement || '—';
      payload[M.dates] = v.dates || '—';
      payload[M.adult] = M.yes;
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (data) {
          if (!data.success) throw new Error(data.message || 'Submission failed');
          form.reset();
          showSuccess(v.name);
        })
        .catch(function () {
          errEl.innerHTML = T.failed(
            '<a href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener">' + T.waWord + '</a>',
            '<a href="mailto:' + EMAIL + '" dir="ltr">' + EMAIL + '</a>');
        })
        .then(function () {
          sendBtn.disabled = false;
          sendLabel.textContent = T.send;
        });
    });
  }

  /* ---------- Archive page ---------- */
  var masonry = $('[data-masonry]');
  if (masonry && window.LJ_WORK) {
    var styles = window.LJ_STYLES;
    var labelOf = {};
    styles.forEach(function (s) { labelOf[s.id] = T.styles[s.id] || s.label; });
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
        (T.alt[w.cat] || labelOf[w.cat]) + T.altSuffix + '">' +
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
    var all = [{ id: 'all', label: T.allWorks }].concat(styles.map(function (st) { return { id: st.id, label: labelOf[st.id] }; }));
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
      countEl.textContent = shown + (shown === 1 ? T.relic : T.relics) + (id === 'all' ? '' : ' · ' + labelOf[id]);
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
