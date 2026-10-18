/* ============================================================
   IELTS PREP HUB — JAVASCRIPT
   ============================================================ */

(function () {
  'use strict';

  /* ── Utility ── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ============================================================
     1. HEADER — scroll + mobile nav
  ============================================================ */
  const header = $('#site-header');
  const menuToggle = $('#menu-toggle');
  const navLinks = $('#nav-links');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    // Highlight active nav link
    const sections = $$('section[id], article[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    $$('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
    // Back to top
    const btt = $('#back-to-top');
    btt.hidden = window.scrollY < 400;
  }, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav on link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Back to top
  $('#back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     2. BAND SCORE CALCULATOR
  ============================================================ */

  // Official IELTS Band conversion tables
  // Listening (same for Academic & General Training)
  const LISTENING_BANDS = [
    { min: 39, max: 40, band: 9.0 },
    { min: 37, max: 38, band: 8.5 },
    { min: 35, max: 36, band: 8.0 },
    { min: 32, max: 34, band: 7.5 },
    { min: 30, max: 31, band: 7.0 },
    { min: 26, max: 29, band: 6.5 },
    { min: 23, max: 25, band: 6.0 },
    { min: 18, max: 22, band: 5.5 },
    { min: 16, max: 17, band: 5.0 },
    { min: 13, max: 15, band: 4.5 },
    { min: 10, max: 12, band: 4.0 },
    { min: 8,  max: 9,  band: 3.5 },
    { min: 6,  max: 7,  band: 3.0 },
    { min: 4,  max: 5,  band: 2.5 },
    { min: 0,  max: 3,  band: 2.0 },
  ];

  // Academic Reading
  const READING_ACADEMIC_BANDS = [
    { min: 40, max: 40, band: 9.0 },
    { min: 38, max: 39, band: 8.5 },
    { min: 35, max: 37, band: 8.0 },
    { min: 33, max: 34, band: 7.5 },
    { min: 30, max: 32, band: 7.0 },
    { min: 27, max: 29, band: 6.5 },
    { min: 23, max: 26, band: 6.0 },
    { min: 19, max: 22, band: 5.5 },
    { min: 15, max: 18, band: 5.0 },
    { min: 13, max: 14, band: 4.5 },
    { min: 10, max: 12, band: 4.0 },
    { min: 8,  max: 9,  band: 3.5 },
    { min: 6,  max: 7,  band: 3.0 },
    { min: 4,  max: 5,  band: 2.5 },
    { min: 0,  max: 3,  band: 2.0 },
  ];

  // General Training Reading
  const READING_GENERAL_BANDS = [
    { min: 40, max: 40, band: 9.0 },
    { min: 39, max: 39, band: 8.5 },
    { min: 37, max: 38, band: 8.0 },
    { min: 36, max: 36, band: 7.5 },
    { min: 34, max: 35, band: 7.0 },
    { min: 32, max: 33, band: 6.5 },
    { min: 30, max: 31, band: 6.0 },
    { min: 27, max: 29, band: 5.5 },
    { min: 23, max: 26, band: 5.0 },
    { min: 19, max: 22, band: 4.5 },
    { min: 15, max: 18, band: 4.0 },
    { min: 12, max: 14, band: 3.5 },
    { min: 9,  max: 11, band: 3.0 },
    { min: 6,  max: 8,  band: 2.5 },
    { min: 0,  max: 5,  band: 2.0 },
  ];

  function getBand(score, table) {
    for (const row of table) {
      if (score >= row.min && score <= row.max) return row.band;
    }
    return 2.0;
  }

  function roundToHalf(n) {
    return Math.round(n * 2) / 2;
  }

  function getBandColor(band) {
    if (band >= 8.0) return '#10B981';
    if (band >= 7.0) return '#34D399';
    if (band >= 6.0) return '#F59E0B';
    if (band >= 5.0) return '#FB923C';
    return '#EF4444';
  }

  function getBandMessage(band) {
    if (band >= 9.0) return '🏆 Expert user — you have mastered the English language!';
    if (band >= 8.0) return '🎉 Very good user — excellent performance. Most universities accept 7.5–8.0.';
    if (band >= 7.0) return '✅ Good user — strong score. Many programs require 6.5–7.0.';
    if (band >= 6.0) return '📈 Competent user — good foundation. Push for Band 7 with more practice.';
    if (band >= 5.0) return '📚 Modest user — solid base. Focus on vocabulary and grammar to improve.';
    if (band >= 4.0) return '💪 Limited user — keep practicing. Consistency is key!';
    return '🌱 Beginner stage — focus on fundamentals: grammar, vocabulary, and listening skills.';
  }

  let currentType = 'academic';

  const listeningSlider = $('#listening-score');
  const readingSlider   = $('#reading-score');
  const listeningRaw    = $('#listening-raw');
  const readingRaw      = $('#reading-raw');
  const listeningBand   = $('#listening-band');
  const readingBand     = $('#reading-band');
  const overallBand     = $('#overall-band');
  const meterBar        = $('#meter-bar');
  const resultMessage   = $('#result-message');
  const listeningTrack  = $('#listening-track');
  const readingTrack    = $('#reading-track');

  function updateSliderThumb(slider, trackEl) {
    const pct = (slider.value - slider.min) / (slider.max - slider.min);
    trackEl.style.width = (pct * 100) + '%';
    slider.parentElement.style.setProperty('--thumb-left', (pct * 100) + '%');
    slider.setAttribute('aria-valuenow', slider.value);
  }

  function updateCalculator() {
    const lScore = parseInt(listeningSlider.value, 10);
    const rScore = parseInt(readingSlider.value, 10);

    updateSliderThumb(listeningSlider, listeningTrack);
    updateSliderThumb(readingSlider, readingTrack);

    listeningRaw.textContent = lScore;
    readingRaw.textContent = rScore;

    const lBand = getBand(lScore, LISTENING_BANDS);
    const rTable = currentType === 'academic' ? READING_ACADEMIC_BANDS : READING_GENERAL_BANDS;
    const rBand = getBand(rScore, rTable);

    listeningBand.textContent = `Band ${lBand.toFixed(1)}`;
    readingBand.textContent = `Band ${rBand.toFixed(1)}`;

    const avg = roundToHalf((lBand + rBand) / 2);
    overallBand.textContent = avg.toFixed(1);

    const color = getBandColor(avg);
    overallBand.style.background = `linear-gradient(135deg, ${color}, ${color}aa)`;

    const meterPct = ((avg - 1) / 8) * 100;
    meterBar.style.width = Math.max(4, meterPct) + '%';
    meterBar.style.background = `linear-gradient(90deg, ${getBandColor(Math.max(1, avg - 1.5))}, ${color})`;

    resultMessage.textContent = getBandMessage(avg);

    updateBandTable(rTable, lScore, rScore);
    updateHighlightedRow(lBand, rBand);
  }

  function updateBandTable(rTable, lScore, rScore) {
    const body = $('#band-table-body');
    if (!body) return;

    const allBands = [9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0];
    body.innerHTML = allBands.map(b => {
      const lRow = LISTENING_BANDS.find(r => r.band === b);
      const rAcRow = READING_ACADEMIC_BANDS.find(r => r.band === b);
      const rGtRow = READING_GENERAL_BANDS.find(r => r.band === b);

      const lRange  = lRow  ? `${lRow.min}–${lRow.max}` : '—';
      const rAcRange = rAcRow ? `${rAcRow.min}–${rAcRow.max}` : '—';
      const rGtRange = rGtRow ? `${rGtRow.min}–${rGtRow.max}` : '—';

      const color = getBandColor(b);
      const lCurrent = getBand(lScore, LISTENING_BANDS) === b;
      const rCurrent = getBand(rScore, rTable) === b;
      const highlight = lCurrent || rCurrent;

      return `<div class="band-row ${highlight ? 'highlighted' : ''}">
        <span>${lRange}</span>
        <span>${rAcRange}</span>
        <span>${rGtRange}</span>
        <span class="band-badge" style="background:${color}22; color:${color}; border:1px solid ${color}44">${b.toFixed(1)}</span>
      </div>`;
    }).join('');
  }

  function updateHighlightedRow() {}

  // Toggle Academic / General
  $$('.calc-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.calc-toggle').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentType = btn.dataset.type;
      updateCalculator();
    });
  });

  listeningSlider?.addEventListener('input', updateCalculator);
  readingSlider?.addEventListener('input', updateCalculator);

  // Initial render
  if (listeningSlider && readingSlider) {
    updateCalculator();
  }

  /* ============================================================
     3. READING TABS
  ============================================================ */
  function setupTabs(tabListSelector, panelParentSelector) {
    const tabBtns = $$(tabListSelector);
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('aria-controls');
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const panels = $$('.tab-panel', btn.closest('.module-body') || document);
        panels.forEach(p => {
          p.classList.remove('active');
          p.hidden = true;
        });

        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.hidden = false;
        }
      });
    });
  }

  setupTabs('[data-tab]');

  /* ============================================================
     4. WRITING ESSAY TEMPLATES (mini tabs)
  ============================================================ */
  $$('.mini-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const parent = tab.closest('.info-block');
      $$('.mini-tab', parent).forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      $$('.essay-template', parent).forEach(t => t.classList.add('hidden'));
      const target = $(`#essay-${tab.dataset.essay}`, parent);
      target?.classList.remove('hidden');
    });
  });

  /* ============================================================
     5. BAND 8 ESSAY MODAL
  ============================================================ */
  const essayModal = $('#essay-modal');
  const openBtn    = $('#open-essay-modal');
  const closeBtn   = $('#close-essay-modal');

  function openModal() {
    essayModal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }
  function closeModal() {
    essayModal.hidden = true;
    document.body.style.overflow = '';
    openBtn?.focus();
  }

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  essayModal?.addEventListener('click', (e) => {
    if (e.target === essayModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !essayModal.hidden) closeModal();
  });

  /* ============================================================
     6. CUE CARD TIMER
  ============================================================ */
  const TIMER_DURATION = 60; // seconds
  let timerInterval = null;
  let timeLeft = TIMER_DURATION;
  let timerRunning = false;

  const timerDisplay = $('#timer-display');
  const timerStartBtn = $('#timer-start');
  const timerPauseBtn = $('#timer-pause');
  const timerResetBtn = $('#timer-reset');
  const timerBarEl    = $('#timer-bar');

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function updateTimerUI() {
    timerDisplay.textContent = formatTime(timeLeft);
    timerDisplay.setAttribute('aria-label', `${formatTime(timeLeft)} remaining`);
    const pct = (timeLeft / TIMER_DURATION) * 100;
    timerBarEl.style.width = pct + '%';
    timerBarEl.style.background = timeLeft <= 10
      ? 'linear-gradient(90deg, #EF4444, #F97316)'
      : timeLeft <= 20
        ? 'linear-gradient(90deg, #F59E0B, #EC4899)'
        : 'linear-gradient(90deg, #6366F1, #EC4899)';
    timerDisplay.className = 'timer-display';
    if (timeLeft <= 10) timerDisplay.classList.add('done');
    else if (timeLeft <= 20) timerDisplay.classList.add('warning');
  }

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerStartBtn.disabled = true;
    timerPauseBtn.disabled = false;
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerUI();
        if (timeLeft === 0) {
          clearInterval(timerInterval);
          timerRunning = false;
          timerStartBtn.disabled = false;
          timerPauseBtn.disabled = true;
          timerDisplay.textContent = 'DONE!';
          timerDisplay.className = 'timer-display done';
          // Vibrate if supported
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerStartBtn.disabled = false;
    timerPauseBtn.disabled = true;
    timerStartBtn.textContent = '▶ Resume';
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timeLeft = TIMER_DURATION;
    timerStartBtn.disabled = false;
    timerPauseBtn.disabled = true;
    timerStartBtn.textContent = '▶ Start';
    updateTimerUI();
  }

  timerStartBtn?.addEventListener('click', startTimer);
  timerPauseBtn?.addEventListener('click', pauseTimer);
  timerResetBtn?.addEventListener('click', resetTimer);

  updateTimerUI();

  /* ============================================================
     7. SPEAKING VOCABULARY BANK
  ============================================================ */
  const VOCAB_BANK = [
    // Adjectives
    { word: 'meticulous', type: 'adj', def: 'Very careful and precise; paying attention to detail.' },
    { word: 'eloquent', type: 'adj', def: 'Fluent or persuasive in speaking or writing.' },
    { word: 'astute', type: 'adj', def: 'Having an ability to accurately assess situations; shrewd.' },
    { word: 'profound', type: 'adj', def: 'Very great or intense; having deep insight.' },
    { word: 'resilient', type: 'adj', def: 'Able to recover quickly from difficult conditions.' },
    { word: 'versatile', type: 'adj', def: 'Able to adapt or be adapted to many functions or activities.' },
    { word: 'pivotal', type: 'adj', def: 'Of crucial importance in relation to an outcome or event.' },
    { word: 'compelling', type: 'adj', def: 'Evoking interest, attention, or admiration in a powerful way.' },
    { word: 'unprecedented', type: 'adj', def: 'Never done or known before.' },
    { word: 'substantial', type: 'adj', def: 'Of considerable importance, size, or worth.' },
    // Collocations
    { word: 'make a profound impact', type: 'collocation', def: 'To have a very significant effect on something.' },
    { word: 'take for granted', type: 'collocation', def: 'To fail to properly appreciate something you have.' },
    { word: 'bear in mind', type: 'collocation', def: 'To consider something when thinking about a matter.' },
    { word: 'come to terms with', type: 'collocation', def: 'To accept a difficult situation.' },
    { word: 'draw a distinction', type: 'collocation', def: 'To show a difference between two things.' },
    { word: 'raise awareness', type: 'collocation', def: 'To make people more knowledgeable about an issue.' },
    // Idioms
    { word: 'in the same boat', type: 'idiom', def: 'In the same difficult situation as others.' },
    { word: 'see eye to eye', type: 'idiom', def: 'To agree with someone.' },
    { word: 'on the fence', type: 'idiom', def: 'Undecided about something.' },
    { word: 'once in a blue moon', type: 'idiom', def: 'Very rarely.' },
    { word: 'the tip of the iceberg', type: 'idiom', def: 'A small visible part of a larger problem.' },
    { word: 'break new ground', type: 'idiom', def: 'To do something innovative or original.' },
    // Advanced Vocabulary
    { word: 'exacerbate', type: 'verb', def: 'To make a problem worse.' },
    { word: 'alleviate', type: 'verb', def: 'To make a problem less severe.' },
    { word: 'corroborate', type: 'verb', def: 'To confirm or give support to a statement.' },
    { word: 'proliferate', type: 'verb', def: 'To increase rapidly in number.' },
    { word: 'mitigate', type: 'verb', def: 'To make less severe or serious.' },
    { word: 'underpin', type: 'verb', def: 'To support or form the basis of something.' },
    { word: 'pragmatic', type: 'adj', def: 'Dealing with things sensibly and realistically.' },
    { word: 'ambiguous', type: 'adj', def: 'Open to more than one interpretation; unclear.' },
    { word: 'detrimental', type: 'adj', def: 'Tending to cause harm; harmful.' },
    { word: 'inevitably', type: 'adv', def: 'As is certain to happen; unavoidably.' },
  ];

  const VOCAB_TYPE_COLORS = {
    adj: '#818CF8',
    verb: '#34D399',
    adv: '#FCD34D',
    idiom: '#F9A8D4',
    collocation: '#60A5FA',
  };

  function renderVocabBank(filter = '') {
    const bank = $('#vocab-bank');
    if (!bank) return;
    bank.innerHTML = '';
    const filtered = filter
      ? VOCAB_BANK.filter(v =>
          v.word.toLowerCase().includes(filter) ||
          v.def.toLowerCase().includes(filter) ||
          v.type.toLowerCase().includes(filter))
      : VOCAB_BANK;

    if (filtered.length === 0) {
      bank.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:8px;">No results found.</p>';
      return;
    }

    filtered.forEach(v => {
      const item = document.createElement('div');
      item.className = 'vocab-item';
      item.setAttribute('role', 'listitem');
      const color = VOCAB_TYPE_COLORS[v.type] || '#94A3B8';
      item.innerHTML = `
        <div class="vocab-word">${v.word}</div>
        <div class="vocab-type" style="background:${color}15; color:${color}">${v.type}</div>
        <div class="vocab-def">${v.def}</div>`;
      bank.appendChild(item);
    });
  }

  renderVocabBank();

  $('#vocab-search')?.addEventListener('input', function () {
    renderVocabBank(this.value.toLowerCase().trim());
  });

  /* ============================================================
     8. SMOOTH SCROLL FOR INTERNAL LINKS
  ============================================================ */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================================
     9. SCROLL REVEAL ANIMATION
  ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Apply initial hidden state and observe
  const revealEls = $$('.module-card, .calc-card, .resource-card, .info-block');
  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
    revealObserver.observe(el);
  });

  console.log('🎓 IELTS Prep Hub loaded successfully!');
})();
