/*!
 * ArkBingo · ～博士的肉鸽BINGO～
 * 交互逻辑：词条抽取 / 棋盘 / 模式切换动画 / 粒子氛围 / 手机端手势
 *
 * 依赖：js/data.js（词条数据，内容与上游完全一致）
 */
(() => {
  'use strict';

  /* ========================================================================
     0. 常量与配置
     ======================================================================== */

  const DATA = window.ARK_BINGO_DATA || {};

  const MODES = {
    sarkaz: {
      key: 'sarkaz',
      num: '01',
      name: '萨卡兹肉鸽',
      en: 'Furnace Side Fables',
      event: '萨卡兹的无终奇语',
      words: Array.isArray(DATA.sarkaz) ? DATA.sarkaz : [],
    },
    garden: {
      key: 'garden',
      num: '02',
      name: '界园肉鸽',
      en: 'Garden of Grotesqueries',
      event: '岁的界园志异',
      words: Array.isArray(DATA.garden) ? DATA.garden : [],
    },
    blackflow: {
      key: 'blackflow',
      num: '03',
      name: '黑流树海',
      en: 'Blackflow of Drowning Seekers',
      event: '沉沦者的黑流树海',
      words: Array.isArray(DATA.divine) ? DATA.divine : [],
    },
  };

  const MODE_KEYS = ['sarkaz', 'garden', 'blackflow'];
  const CELL_COUNT = 25;
  const GRID_SIZE = 5;
  const STORAGE_KEY = 'arkbingo.state.v2';
  const SWAP_COMMIT_MS = 470;
  const SWAP_TOTAL_MS = 1180;

  /** 12 条 BINGO 连线（5 横 + 5 竖 + 2 斜） */
  const LINES = (() => {
    const lines = [];
    for (let r = 0; r < GRID_SIZE; r += 1) {
      lines.push(Array.from({ length: GRID_SIZE }, (_, c) => r * GRID_SIZE + c));
    }
    for (let c = 0; c < GRID_SIZE; c += 1) {
      lines.push(Array.from({ length: GRID_SIZE }, (_, r) => r * GRID_SIZE + c));
    }
    lines.push(Array.from({ length: GRID_SIZE }, (_, i) => i * GRID_SIZE + i));
    lines.push(Array.from({ length: GRID_SIZE }, (_, i) => i * GRID_SIZE + (GRID_SIZE - 1 - i)));
    return lines;
  })();

  /* ========================================================================
     1. 状态
     ======================================================================== */

  const state = {
    mode: 'sarkaz',
    board: [],
    marks: [],
    locked: false,
    rolls: 0,
  };

  let lastBingoCount = 0;
  let switching = false;
  let sheetIndex = -1;
  let sheetReturnFocus = null;
  let toastTimer = 0;
  let swapTimers = [];
  let dealTimer = 0;

  /* ========================================================================
     2. DOM
     ======================================================================== */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const el = {
    html: document.documentElement,
    body: document.body,
    app: $('#app'),
    grid: $('#grid'),
    board: $('#board'),
    modes: $('#modes'),
    tabs: $$('.modes__tab'),

    kickerNum: $('#kickerNum'),
    kickerEn: $('#kickerEn'),
    boardTitle: $('#boardTitle'),
    boardEvent: $('#boardEvent'),
    chipTotal: $('#chipTotal'),
    chipMarked: $('#chipMarked'),
    chipBingo: $('#chipBingo'),
    chipBingoWrap: $('#chipBingoWrap'),
    chipRoll: $('#chipRoll'),

    shakeBtn: $('#shakeBtn'),
    lockBtn: $('#lockBtn'),
    lockLabel: $('#lockLabel'),
    helpBtn: $('#helpBtn'),

    veil: $('#veil'),
    veilLabelCn: $('#veilLabelCn'),
    veilLabelEn: $('#veilLabelEn'),
    sideCaption: $('#sideCaption'),

    sheet: $('#sheet'),
    sheetPanel: $('.sheet__panel'),
    sheetScrim: $('#sheetScrim'),
    sheetKicker: $('#sheetKicker'),
    sheetTitle: $('#sheetTitle'),
    sheetDesc: $('#sheetDesc'),
    sheetToggle: $('#sheetToggle'),
    sheetToggleLabel: $('#sheetToggleLabel'),
    sheetClose: $('#sheetClose'),

    helpSheet: $('#helpSheet'),
    helpScrim: $('#helpScrim'),
    helpClose: $('#helpClose'),

    toast: $('#toast'),
    toastText: $('#toastText'),

    layers: $$('.ambient__layer'),
    stamps: $$('.board__stamp-svg'),
    canvas: $('#dust'),

    footSarkaz: $('#footSarkaz'),
    footGarden: $('#footGarden'),
    footDivine: $('#footDivine'),
  };

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => reducedMotionQuery.matches;

  /* ========================================================================
     3. 工具函数
     ======================================================================== */

  /** 词条拆分：第一个空格之前为标题，之后为描述（与上游规则一致） */
  function splitWord(word) {
    const text = String(word == null ? '' : word);
    let index = text.indexOf(' ');
    if (index === -1) index = text.indexOf('\u3000');
    if (index === -1 || index === text.length - 1) {
      return { title: text.trim(), desc: '' };
    }
    return {
      title: text.slice(0, index).trim(),
      desc: text.slice(index + 1).trim(),
    };
  }

  function shufflePick(bank, count) {
    const pool = bank.slice();
    const picked = [];
    const limit = Math.min(count, pool.length);
    for (let i = 0; i < limit; i += 1) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    return picked;
  }

  function isValidBoard(board, modeKey) {
    if (!Array.isArray(board) || board.length !== CELL_COUNT) return false;
    const bank = MODES[modeKey] && MODES[modeKey].words;
    if (!bank || !bank.length) return false;
    const set = new Set(bank);
    if (board.some((word) => !set.has(word))) return false;
    return new Set(board).size === CELL_COUNT;
  }

  function newBoard(modeKey) {
    return shufflePick(MODES[modeKey].words, CELL_COUNT);
  }

  /* ========================================================================
     4. 持久化
     ======================================================================== */

  function save() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          v: 3,
          mode: state.mode,
          board: state.board,
          marks: state.marks,
          locked: state.locked,
          rolls: state.rolls,
        })
      );
    } catch (err) {
      /* 隐私模式 / 存储已满：静默失败，不影响游戏 */
    }
  }

  function restore() {
    let saved = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (err) {
      saved = null;
    }
    if (!saved || (saved.v !== 2 && saved.v !== 3)) return false;

    const mode = MODE_KEYS.includes(saved.mode) ? saved.mode : 'sarkaz';
    state.mode = mode;
    state.locked = Boolean(saved.locked);
    state.rolls = Number.isFinite(saved.rolls) ? saved.rolls : 0;

    if (isValidBoard(saved.board, mode)) {
      state.board = saved.board.slice();
      state.marks = Array.from({ length: CELL_COUNT }, (_, i) =>
        Boolean(Array.isArray(saved.marks) && saved.marks[i])
      );
    } else {
      state.board = newBoard(mode);
      state.marks = new Array(CELL_COUNT).fill(false);
    }
    return true;
  }

  /* ========================================================================
     5. 渲染
     ======================================================================== */

  /** 发牌顺序：让动画从中心向外扩散 */
  function dealOrder(index) {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const dist = Math.abs(row - 2) + Math.abs(col - 2);
    return dist * 3 + (index % 3);
  }

  function buildCell(index, word) {
    const { title, desc } = splitWord(word);

    const wrap = document.createElement('div');
    wrap.className = 'cell-wrap';
    wrap.style.setProperty('--i', String(dealOrder(index)));

    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.dataset.index = String(index);
    cell.setAttribute('aria-pressed', 'false');
    cell.setAttribute('aria-label', `${title}：${desc || '无补充描述'}`);

    const titleEl = document.createElement('span');
    titleEl.className = 'cell__title';
    titleEl.textContent = title;

    const descEl = document.createElement('span');
    descEl.className = 'cell__desc';
    descEl.textContent = desc;

    const stamp = document.createElement('span');
    stamp.className = 'cell__stamp';
    stamp.setAttribute('aria-hidden', 'true');
    stamp.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>';

    cell.append(titleEl, descEl, stamp);

    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'cell__more';
    more.dataset.index = String(index);
    more.setAttribute('aria-label', `查看完整词条：${title}`);
    more.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5"/></svg>';

    wrap.append(cell, more);
    return wrap;
  }

  function renderGrid({ animate = true } = {}) {
    const frag = document.createDocumentFragment();
    state.board.forEach((word, index) => {
      frag.appendChild(buildCell(index, word));
    });
    el.grid.replaceChildren(frag);
    el.grid.classList.remove('is-dealing');
    window.clearTimeout(dealTimer);
    applyMarksToDom();
    updateChips();
    updateBingo(false);
    if (animate && !prefersReducedMotion()) {
      // 强制重排后再触发发牌动画
      void el.grid.offsetWidth;
      el.grid.classList.add('is-dealing');
      dealTimer = window.setTimeout(() => el.grid.classList.remove('is-dealing'), 1400);
    }
  }

  function applyMarksToDom() {
    $$('.cell', el.grid).forEach((cell) => {
      const index = Number(cell.dataset.index);
      cell.setAttribute('aria-pressed', String(Boolean(state.marks[index])));
    });
  }

  function updateChips() {
    const marked = state.marks.filter(Boolean).length;
    el.chipTotal.textContent = String(MODES[state.mode].words.length);
    el.chipMarked.textContent = `${marked}/${CELL_COUNT}`;
    el.chipRoll.textContent = `×${state.rolls}`;
  }

  function updateBingo(celebrate) {
    const won = LINES.filter((line) => line.every((i) => state.marks[i]));
    const hot = new Set(won.flatMap((line) => line));

    $$('.cell', el.grid).forEach((cell) => {
      const index = Number(cell.dataset.index);
      cell.classList.toggle('is-bingo', hot.has(index));
    });

    el.chipBingo.textContent = String(won.length);
    el.chipBingoWrap.classList.toggle('is-hot', won.length > 0);
    el.board.classList.toggle('has-bingo', won.length > 0);

    if (celebrate) {
      if (won.length > lastBingoCount) {
        toast(`BINGO ×${won.length} —— 博士，这条线连上了！`, 'bingo');
        Dust.burst(won.length);
      } else if (won.length < lastBingoCount && won.length > 0) {
        toast(`BINGO ×${won.length}`, 'bingo');
      }
    }
    lastBingoCount = won.length;
  }

  /* ========================================================================
     6. 词条交互
     ======================================================================== */

  function toggleMark(index, cellEl) {
    if (!state.board[index]) return;
    state.marks[index] = !state.marks[index];

    const cell = cellEl || $(`.cell[data-index="${index}"]`, el.grid);
    if (cell) {
      cell.setAttribute('aria-pressed', String(state.marks[index]));
      cell.classList.remove('is-hit');
      void cell.offsetWidth;
      cell.classList.add('is-hit');
      window.setTimeout(() => cell.classList.remove('is-hit'), 560);
    }

    updateChips();
    updateBingo(true);
    save();
  }

  function openSheet(index) {
    const word = state.board[index];
    if (!word) return;
    const { title, desc } = splitWord(word);
    sheetIndex = index;
    sheetReturnFocus = document.activeElement;

    el.sheetKicker.textContent = `${MODES[state.mode].name} · MODE ${MODES[state.mode].num}`;
    el.sheetTitle.textContent = title;
    el.sheetDesc.textContent = desc || '（该词条没有补充描述）';
    syncSheetToggle();

    el.sheet.classList.add('is-open');
    el.sheet.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => el.sheetClose.focus(), 60);
  }

  function closeSheet() {
    if (!el.sheet.classList.contains('is-open')) return;
    el.sheet.classList.remove('is-open');
    el.sheet.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    sheetIndex = -1;
    if (sheetReturnFocus && typeof sheetReturnFocus.focus === 'function') {
      sheetReturnFocus.focus({ preventScroll: true });
    }
    sheetReturnFocus = null;
  }

  function syncSheetToggle() {
    const pressed = sheetIndex >= 0 && Boolean(state.marks[sheetIndex]);
    el.sheetToggleLabel.textContent = pressed ? '取消标记' : '标记完成';
    el.sheetToggle.setAttribute('aria-pressed', String(pressed));
  }

  function openHelp() {
    el.helpSheet.classList.add('is-open');
    el.helpSheet.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => el.helpClose.focus(), 60);
  }

  function closeHelp() {
    if (!el.helpSheet.classList.contains('is-open')) return;
    el.helpSheet.classList.remove('is-open');
    el.helpSheet.setAttribute('aria-hidden', 'true');
    if (!el.sheet.classList.contains('is-open')) document.body.style.overflow = '';
  }

  /* ========================================================================
     7. 提示
     ======================================================================== */

  function toast(text, kind) {
    el.toastText.textContent = text;
    el.toast.className = 'toast';
    if (kind) el.toast.classList.add(`toast--${kind}`);
    void el.toast.offsetWidth;
    el.toast.classList.add('is-show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.toast.classList.remove('is-show'), 2600);
  }

  function deny(button) {
    if (!button) return;
    button.classList.remove('is-denied');
    void button.offsetWidth;
    button.classList.add('is-denied');
    window.setTimeout(() => button.classList.remove('is-denied'), 460);
  }
  /* ========================================================================
     8. 模式 / 主题
     ======================================================================== */

  function applyModeChrome() {
    const mode = MODES[state.mode];
    const index = MODE_KEYS.indexOf(state.mode);

    el.html.dataset.mode = state.mode;
    el.body.dataset.mode = state.mode;

    el.tabs.forEach((tab) => {
      const active = tab.dataset.mode === state.mode;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    el.modes.style.setProperty('--tab', String(index));

    el.kickerNum.textContent = `MODE ${mode.num}`;
    el.kickerEn.textContent = mode.en;
    el.boardTitle.textContent = mode.name;
    el.boardEvent.textContent = mode.event;
    el.sideCaption.textContent = mode.event;
    el.chipTotal.textContent = String(mode.words.length);

    el.stamps.forEach((svg) => svg.classList.toggle('is-active', svg.dataset.stamp === state.mode));

    el.layers.forEach((layer) => layer.classList.toggle('is-active', layer.dataset.bg === state.mode));

    Dust.setMode(state.mode);
    updateChips();

    // 让手机浏览器的地址栏颜色跟随当前模式
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      const page = getComputedStyle(el.body).getPropertyValue('--page').trim();
      if (page) metaTheme.setAttribute('content', page);
    }
  }

  /* ========================================================================
     9. 模式切换动画
     ======================================================================== */

  function clearSwapTimers() {
    swapTimers.forEach((id) => window.clearTimeout(id));
    swapTimers = [];
  }

  function playVeil(modeKey, onCommit) {
    if (prefersReducedMotion()) {
      onCommit();
      return SWAP_TOTAL_MS;
    }

    const mode = MODES[modeKey];
    el.veil.classList.remove('is-playing');
    el.veil.dataset.anim = modeKey;
    el.veilLabelCn.textContent = mode.name;
    el.veilLabelEn.textContent = mode.en;
    void el.veil.offsetWidth;
    el.veil.classList.add('is-playing');

    const commitTimer = window.setTimeout(onCommit, SWAP_COMMIT_MS);
    const endTimer = window.setTimeout(() => {
      el.veil.classList.remove('is-playing');
    }, SWAP_TOTAL_MS);
    swapTimers.push(commitTimer, endTimer);
    return SWAP_TOTAL_MS;
  }

  function switchMode(modeKey, { initial = false } = {}) {
    if (!MODES[modeKey]) return;
    if (!initial && switching) return;
    if (!initial && state.locked) {
      deny(el.modes);
      toast('页面已锁定，先解锁才能切换模式');
      return;
    }
    if (!initial && modeKey === state.mode) return;

    const commit = () => {
      state.mode = modeKey;
      state.board = newBoard(modeKey);
      state.marks = new Array(CELL_COUNT).fill(false);
      lastBingoCount = 0;

      applyModeChrome();
      renderGrid({ animate: true });

      if (state.mode === 'sarkaz' && !prefersReducedMotion()) {
        el.app.classList.remove('is-shaking');
        void el.app.offsetWidth;
        el.app.classList.add('is-shaking');
        swapTimers.push(
          window.setTimeout(() => el.app.classList.remove('is-shaking'), 900)
        );
      }

      save();
    };

    if (initial) {
      commit();
      return;
    }

    switching = true;
    clearSwapTimers();
    const total = playVeil(modeKey, commit);
    swapTimers.push(
      window.setTimeout(() => {
        switching = false;
      }, total)
    );
  }

  /* ========================================================================
     10. 刷新 / 锁定
     ======================================================================== */

  function reroll({ silent = false } = {}) {
    if (switching) return;
    if (state.locked) {
      deny(el.shakeBtn);
      toast('页面已锁定，先解锁再刷新');
      return;
    }

    state.board = newBoard(state.mode);
    state.marks = new Array(CELL_COUNT).fill(false);
    state.rolls += 1;
    lastBingoCount = 0;

    renderGrid({ animate: true });
    save();

    if (!silent && !prefersReducedMotion()) {
      el.shakeBtn.classList.add('is-rolling');
      window.setTimeout(() => el.shakeBtn.classList.remove('is-rolling'), 760);
    }
  }

  function applyLock() {
    const locked = state.locked;
    el.lockBtn.classList.toggle('is-locked', locked);
    el.lockBtn.setAttribute('aria-pressed', String(locked));
    el.lockLabel.textContent = locked ? '页面解锁' : '页面锁定';
    el.shakeBtn.disabled = locked;
    el.modes.classList.toggle('is-locked', locked);
    el.board.classList.toggle('is-locked', locked);
    el.tabs.forEach((tab) => {
      tab.setAttribute('aria-disabled', String(locked));
    });
  }

  function toggleLock() {
    state.locked = !state.locked;
    applyLock();
    save();
    toast(state.locked ? '页面已锁定，误触不会再刷新' : '页面已解锁');
  }

  /* ========================================================================
     11. 粒子系统（每个模式一套更丰富的粒子）
     ======================================================================== */

  /**
   * 每个模式的粒子配比（权重）：
   *  萨卡兹 · 紫 —— 上升的紫色余烬、飘落的灰烬、偶发的火花、缓慢游走的魂火
   *  界园 · 纸   —— 旋转落下的花瓣、浮动的暖色花粉、柔软的薄雾、飘散的种子
   *  黑流树海   —— 上浮的气泡、悬浮的浮游光点、下沉的暗尘、随流漂移的碎片
   */
  const PARTICLE_PLAN = {
    sarkaz: [
      ['ember', 46],
      ['ash', 24],
      ['spark', 8],
      ['wisp', 9],
    ],
    garden: [
      ['petal', 38],
      ['pollen', 26],
      ['mist', 6],
      ['seed', 9],
    ],
    blackflow: [
      ['bubble', 34],
      ['plankton', 28],
      ['sink', 14],
      ['shard', 9],
    ],
  };

  const Dust = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    dpr: 1,
    parts: [],
    raf: 0,
    last: 0,
    mode: 'sarkaz',
    running: false,
    count: 0,
    sprites: null,

    init(canvas) {
      this.canvas = canvas;
      if (!canvas || prefersReducedMotion()) return;
      this.ctx = canvas.getContext('2d', { alpha: true });
      if (!this.ctx) return;

      this.sprites = {
        violet: this.makeSprite(292, 88, 64),
        magenta: this.makeSprite(316, 82, 66),
        warm: this.makeSprite(34, 88, 70),
        rose: this.makeSprite(344, 76, 72),
        teal: this.makeSprite(188, 72, 64),
        ice: this.makeSprite(194, 58, 82),
      };

      this.resize();
      this.setMode(state.mode, true);
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame((t) => this.frame(t));

      window.addEventListener('resize', () => this.resize(), { passive: true });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pause();
        } else {
          this.resume();
        }
      });
    },

    makeSprite(hue, sat, light) {
      const size = 96;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const g = c.getContext('2d');
      const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, 1)`);
      grad.addColorStop(0.32, `hsla(${hue}, ${sat}%, ${light}%, 0.55)`);
      grad.addColorStop(0.7, `hsla(${hue}, ${sat}%, ${light}%, 0.12)`);
      grad.addColorStop(1, `hsla(${hue}, ${sat}%, ${light}%, 0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
      return c;
    },

    resize() {
      if (!this.canvas) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = this.canvas.clientWidth || window.innerWidth;
      this.height = this.canvas.clientHeight || window.innerHeight;
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

      this.count = Math.round(
        Math.min(Math.max((this.width * this.height) / 13000, 42), 150)
      );
      // 视口变化后补足 / 收缩粒子
      while (this.parts.length > this.count) this.parts.pop();
      while (this.parts.length < this.count) this.parts.push(this.spawn(this.pickKind(), true));
    },

    setMode(mode, force) {
      if (!force && this.mode === mode) return;
      this.mode = mode;
      if (!this.ctx) return;
      this.parts = [];
      for (let i = 0; i < this.count; i += 1) {
        this.parts.push(this.spawn(this.pickKind(), true));
      }
    },

    pickKind() {
      const plan = PARTICLE_PLAN[this.mode] || PARTICLE_PLAN.sarkaz;
      const total = plan.reduce((sum, item) => sum + item[1], 0);
      let roll = Math.random() * total;
      for (let i = 0; i < plan.length; i += 1) {
        roll -= plan[i][1];
        if (roll <= 0) return plan[i][0];
      }
      return plan[0][0];
    },

    spawn(kind, initial) {
      const w = this.width || window.innerWidth;
      const h = this.height || window.innerHeight;
      const rnd = (a, b) => a + Math.random() * (b - a);
      const base = {
        kind,
        phase: rnd(0, Math.PI * 2),
        life: 8,
        maxLife: 8,
      };

      switch (kind) {
        /* ---------------- 萨卡兹 ---------------- */
        case 'ember': {
          const life = rnd(4.5, 9);
          return {
            ...base,
            x: rnd(0, w),
            y: initial ? rnd(0, h) : h + rnd(4, 34),
            vx: rnd(-9, 9),
            vy: rnd(-72, -26),
            r: rnd(0.7, 2.1),
            hue: rnd(282, 322),
            sway: rnd(8, 24),
            wobble: rnd(0.5, 1.4),
            life,
            maxLife: life,
          };
        }
        case 'ash': {
          const life = rnd(10, 19);
          return {
            ...base,
            x: rnd(0, w),
            y: initial ? rnd(0, h) : -rnd(6, 44),
            vx: rnd(-11, 11),
            vy: rnd(9, 26),
            r: rnd(0.6, 1.6),
            hue: rnd(268, 300),
            sway: rnd(10, 26),
            wobble: rnd(0.3, 0.9),
            life,
            maxLife: life,
          };
        }
        case 'spark': {
          const life = rnd(1.1, 2.2);
          return {
            ...base,
            x: rnd(0, w),
            y: initial ? rnd(h * 0.25, h) : h + rnd(0, 22),
            vx: rnd(-16, 16),
            vy: rnd(-240, -130),
            r: rnd(0.9, 1.8),
            hue: rnd(298, 338),
            sway: 3,
            wobble: 0.2,
            life,
            maxLife: life,
          };
        }
        case 'wisp': {
          const life = rnd(13, 24);
          return {
            ...base,
            x: rnd(0, w),
            y: initial ? rnd(0, h) : h + 90,
            vx: rnd(-7, 7),
            vy: rnd(-18, -5),
            r: rnd(40, 92),
            hue: rnd(284, 316),
            sway: rnd(8, 18),
            wobble: rnd(0.12, 0.3),
            life,
            maxLife: life,
          };
        }

        /* ---------------- 界园 ---------------- */
        case 'petal': {
          const life = rnd(9, 17);
          return {
            ...base,
            x: rnd(0, w),
            y: initial ? rnd(0, h) : -rnd(10, 60),
            vx: rnd(-16, 16),
            vy: rnd(16, 42),
            r: rnd(1.6, 3.8),
            hue: rnd(332, 352),
            jade: Math.random() < 0.16,
            sway: rnd(14, 34),
            wobble: rnd(0.5, 1.4),
            spin: rnd(-1.7, 1.7),
            rot: rnd(0, Math.PI * 2),
            life,
            maxLife: life,
          };
        }
        case 'pollen': {
          const life = rnd(9, 18);
          return {
            ...base,
            x: rnd(0, w),
            y: initial ? rnd(0, h) : h + rnd(0, 30),
            vx: rnd(-7, 7),
            vy: rnd(-24, -7),
            r: rnd(0.5, 1.5),
            hue: rnd(38, 58),
            sway: rnd(12, 28),
            wobble: rnd(0.4, 1.1),
            life,
            maxLife: life,
          };
        }
        case 'mist': {
          const life = rnd(16, 28);
          return {
            ...base,
            x: rnd(0, w),
            y: initial ? rnd(0, h) : h + 120,
            vx: rnd(-6, 6),
            vy: rnd(-9, -2),
            r: rnd(60, 130),
            hue: rnd(20, 40),
            sway: rnd(6, 14),
            wobble: rnd(0.1, 0.24),
            life,
            maxLife: life,
          };
        }
        case 'seed': {
          const life = rnd(11, 20);
          return {
            ...base,
            x: rnd(0, w),
            y: initial ? rnd(0, h) : -rnd(8, 50),
            vx: rnd(-10, 10),
            vy: rnd(8, 20),
            r: rnd(1, 2),
            hue: rnd(30, 45),
            sway: rnd(18, 40),
            wobble: rnd(0.5, 1.2),
            life,
            maxLife: life,
          };
        }

        /* ---------------- 黑流树海 ---------------- */
        case 'bubble': {
          const life = rnd(6, 13);
          return {
            ...base,
            x: rnd(0, w),
            y: initial ? rnd(0, h) : h + rnd(6, 30),
            vx: rnd(-8, 8),
            vy: rnd(-40, -12),
            r: rnd(1.1, 4),
            hue: rnd(182, 200),
            sway: rnd(10, 24),
            wobble: rnd(0.4, 1.2),
            life,
            maxLife: life,
          };
        }
        case 'plankton': {
          const life = rnd(9, 18);
          return {
            ...base,
            x: rnd(0, w),
            y: rnd(0, h),
            vx: rnd(-8, 8),
            vy: rnd(-9, 4),
            r: rnd(0.5, 1.5),
            hue: rnd(178, 196),
            sway: rnd(10, 26),
            wobble: rnd(0.3, 0.9),
            life,
            maxLife: life,
          };
        }
        case 'sink': {
          const life = rnd(12, 22);
          return {
            ...base,
            x: rnd(0, w),
            y: initial ? rnd(0, h) : -rnd(8, 40),
            vx: rnd(-8, 8),
            vy: rnd(7, 22),
            r: rnd(0.6, 1.7),
            hue: rnd(196, 214),
            sway: rnd(10, 24),
            wobble: rnd(0.25, 0.7),
            life,
            maxLife: life,
          };
        }
        case 'shard': {
          const life = rnd(10, 19);
          return {
            ...base,
            x: rnd(0, w),
            y: initial ? rnd(0, h) : -rnd(10, 60),
            vx: rnd(-12, 12),
            vy: rnd(9, 24),
            r: rnd(2, 5.5),
            hue: rnd(184, 202),
            sway: rnd(12, 26),
            wobble: rnd(0.3, 0.8),
            spin: rnd(-1.2, 1.2),
            rot: rnd(0, Math.PI * 2),
            life,
            maxLife: life,
          };
        }
        default:
          return { ...base, x: rnd(0, w), y: rnd(0, h), vx: 0, vy: -8, r: 1, hue: 300, sway: 0, wobble: 0 };
      }
    },

    burst(scale) {
      if (!this.ctx || prefersReducedMotion()) return;
      const cx = this.width / 2;
      const cy = this.height * 0.5;
      const n = Math.min(26 + scale * 8, 60);
      const palette =
        this.mode === 'blackflow'
          ? [186, 196]
          : this.mode === 'garden'
          ? [338, 30]
          : [292, 318];

      for (let i = 0; i < n; i += 1) {
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.5;
        const speed = 110 + Math.random() * 230;
        this.parts.push({
          kind: 'spark',
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1 + Math.random() * 2.2,
          hue: palette[i % 2] + (Math.random() * 16 - 8),
          sway: 0,
          wobble: 0,
          phase: 0,
          life: 1.4 + Math.random() * 0.9,
          maxLife: 2.3,
        });
      }
    },

    pause() {
      this.running = false;
      cancelAnimationFrame(this.raf);
    },

    resume() {
      if (this.running || !this.ctx || prefersReducedMotion()) return;
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame((t) => this.frame(t));
    },

    frame(now) {
      if (!this.running) return;
      const dt = Math.min((now - this.last) / 1000, 0.05);
      this.last = now;

      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      const sprites = this.sprites;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = this.parts.length - 1; i >= 0; i -= 1) {
        const p = this.parts[i];
        p.life -= dt;
        p.phase += dt * (p.wobble || 0.4);

        if (p.life <= 0) {
          this.parts.splice(i, 1);
          if (this.parts.length < this.count) this.parts.push(this.spawn(this.pickKind(), false));
          continue;
        }

        p.x += (p.vx + Math.sin(p.phase) * (p.sway || 0)) * dt;
        p.y += p.vy * dt;

        if (p.y < -160 || p.y > h + 160 || p.x < -160 || p.x > w + 160) {
          this.parts.splice(i, 1);
          if (this.parts.length < this.count) this.parts.push(this.spawn(this.pickKind(), false));
          continue;
        }

        const fadeIn = Math.min(1, (p.maxLife - p.life) / 0.7);
        const alpha = Math.max(0, Math.min(1, (p.life / p.maxLife) * 1.5)) * fadeIn;

        switch (p.kind) {
          case 'ember': {
            const flicker = 0.6 + Math.sin(p.phase * 3.4) * 0.4;
            ctx.beginPath();
            ctx.fillStyle = `hsla(${p.hue}, 100%, 68%, ${alpha * flicker})`;
            ctx.shadowColor = `hsla(${p.hue}, 100%, 66%, ${alpha * 0.9})`;
            ctx.shadowBlur = p.r * 7;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            break;
          }
          case 'spark': {
            const len = Math.min(26, Math.hypot(p.vx, p.vy) * 0.045);
            const nx = p.vx / (Math.hypot(p.vx, p.vy) || 1);
            const ny = p.vy / (Math.hypot(p.vx, p.vy) || 1);
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${p.hue}, 100%, 82%, ${alpha * 0.9})`;
            ctx.lineWidth = Math.max(0.6, p.r * 0.8);
            ctx.lineCap = 'round';
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - nx * len, p.y - ny * len);
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = `hsla(${p.hue}, 100%, 92%, ${alpha})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'wisp': {
            if (!sprites) break;
            ctx.globalAlpha = alpha * 0.3;
            ctx.drawImage(sprites.violet, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
            ctx.globalAlpha = alpha * 0.16;
            ctx.drawImage(sprites.magenta, p.x - p.r * 0.7, p.y - p.r * 0.7, p.r * 1.4, p.r * 1.4);
            ctx.globalAlpha = 1;
            break;
          }
          case 'ash': {
            ctx.beginPath();
            ctx.fillStyle = `hsla(${p.hue}, 32%, 72%, ${alpha * 0.42})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'petal': {
            p.rot += (p.spin || 0) * dt;
            const hue = p.jade ? 160 : p.hue;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.beginPath();
            ctx.fillStyle = `hsla(${hue}, ${p.jade ? 40 : 74}%, ${p.jade ? 70 : 76}%, ${alpha * 0.95})`;
            ctx.ellipse(0, 0, p.r, p.r * 0.52, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;
          }
          case 'pollen': {
            if (!sprites) break;
            ctx.globalAlpha = alpha * 0.95;
            const s = p.r * 5;
            ctx.drawImage(sprites.warm, p.x - s, p.y - s, s * 2, s * 2);
            ctx.globalAlpha = 1;
            break;
          }
          case 'mist': {
            if (!sprites) break;
            ctx.globalAlpha = alpha * 0.2;
            ctx.drawImage(sprites.warm, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
            ctx.globalAlpha = 1;
            break;
          }
          case 'seed': {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${p.hue}, 55%, 90%, ${alpha * 0.5})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + Math.sin(p.phase) * 6, p.y - 7);
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = `hsla(${p.hue}, 40%, 96%, ${alpha * 0.8})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'bubble': {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${p.hue}, 78%, 74%, ${alpha * 0.75})`;
            ctx.lineWidth = 0.9;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = `hsla(${p.hue}, 88%, 62%, ${alpha * 0.22})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'plankton': {
            if (!sprites) break;
            ctx.globalAlpha = alpha * 0.95;
            const s = p.r * 9;
            ctx.drawImage(sprites.ice, p.x - s, p.y - s, s * 2, s * 2);
            ctx.globalAlpha = 1;
            break;
          }
          case 'sink': {
            ctx.beginPath();
            ctx.fillStyle = `hsla(${p.hue}, 45%, 62%, ${alpha * 0.52})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'shard': {
            p.rot += (p.spin || 0) * dt;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${p.hue}, 66%, 80%, ${alpha * 0.72})`;
            ctx.lineWidth = 0.9;
            ctx.strokeRect(-p.r, -p.r * 0.42, p.r * 2, p.r * 0.84);
            ctx.restore();
            break;
          }
          default:
            break;
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      this.raf = requestAnimationFrame((t) => this.frame(t));
    },
  };

  /* ========================================================================
     12. 事件绑定
     ======================================================================== */

  function bindEvents() {
    // 格子：标记 / 展开
    el.grid.addEventListener('click', (event) => {
      const more = event.target.closest('.cell__more');
      if (more) {
        event.stopPropagation();
        openSheet(Number(more.dataset.index));
        return;
      }
      const cell = event.target.closest('.cell');
      if (!cell) return;
      toggleMark(Number(cell.dataset.index), cell);
    });

    // 页签
    el.modes.addEventListener('click', (event) => {
      const tab = event.target.closest('.modes__tab');
      if (!tab) return;
      switchMode(tab.dataset.mode);
    });

    // 键盘操作页签
    el.modes.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const current = MODE_KEYS.indexOf(state.mode);
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      const next = (current + delta + MODE_KEYS.length) % MODE_KEYS.length;
      event.preventDefault();
      switchMode(MODE_KEYS[next]);
    });

    // 按钮
    el.shakeBtn.addEventListener('click', () => reroll());
    el.lockBtn.addEventListener('click', toggleLock);
    el.helpBtn.addEventListener('click', openHelp);

    // 详情面板
    el.sheetScrim.addEventListener('click', closeSheet);
    el.sheetClose.addEventListener('click', closeSheet);
    el.sheetToggle.addEventListener('click', () => {
      if (sheetIndex < 0) return;
      toggleMark(sheetIndex);
      syncSheetToggle();
    });

    // 玩法说明
    el.helpScrim.addEventListener('click', closeHelp);
    el.helpClose.addEventListener('click', closeHelp);

    // 全局快捷键
    document.addEventListener('keydown', (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === 'Escape') {
        closeSheet();
        closeHelp();
        return;
      }

      if (el.sheet.classList.contains('is-open') || el.helpSheet.classList.contains('is-open')) return;

      const target = event.target;
      const isButton = target instanceof Element && target.closest('button');

      // 空格始终刷新（与原有习惯一致）；回车交给聚焦的按钮自身处理
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        reroll();
        return;
      }

      if (event.key === 'Enter') {
        if (isButton) return;
        event.preventDefault();
        reroll();
        return;
      }

      const key = event.key.toLowerCase();
      if (key === '1' || key === '2' || key === '3') {
        event.preventDefault();
        switchMode(MODE_KEYS[Number(key) - 1]);
      } else if (key === 'l') {
        toggleLock();
      } else if (key === 'r') {
        reroll();
      }
    });
  }

  /* ========================================================================
     13. 启动
     ======================================================================== */

  function bootstrap() {
    const restored = restore();

    if (!restored) {
      state.mode = 'sarkaz';
      state.board = newBoard(state.mode);
      state.marks = new Array(CELL_COUNT).fill(false);
    }

    // 词条库统计（页脚）
    el.footSarkaz.textContent = String(MODES.sarkaz.words.length);
    el.footGarden.textContent = String(MODES.garden.words.length);
    el.footDivine.textContent = String(MODES.blackflow.words.length);

    el.html.dataset.mode = state.mode;
    el.body.dataset.mode = state.mode;
    applyModeChrome();
    applyLock();
    renderGrid({ animate: true });
    bindEvents();
    Dust.init(el.canvas);

    // 首次进入：播一次模式动画作为开场
    if (!restored && !prefersReducedMotion()) {
      window.setTimeout(() => {
        playVeil(state.mode, () => {});
      }, 260);
    }

    save();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
