/* =========================================
   DESIGN101 - STATE, THEMES, 3D CLAY & PIP
   ========================================= */
const Design101 = {
  _pipTimer: null,
  _audioCtx: null,
  _musicTimer: null,
  _isMusicPlaying: false,

  getState() {
    const defaults = {
      completed: { basics: false, colour: false, typography: false, layout: false },
      quizScore: null,
      savedPalette: ['#FAD2E1', '#BEE1E6', '#7C5DFA', '#FFF1C1']
    };
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem('design101_state')) };
    } catch {
      return defaults;
    }
  },

  saveState(state) {
    localStorage.setItem('design101_state', JSON.stringify(state));
    this.syncUI();
  },

  markLessonComplete(moduleKey) {
    const state = this.getState();
    state.completed[moduleKey] = true;
    this.saveState(state);
    this.showToast(`🎉 "${moduleKey.toUpperCase()}" lesson completed!`);
    this.pipSay(`WOO! ${moduleKey.toUpperCase()} complete! 🎨✨`);
  },

  syncUI() {
    const state = this.getState();
    const totalDone = Object.values(state.completed).filter(Boolean).length;

    document.querySelectorAll('#completedCount').forEach(el => {
      el.textContent = totalDone;
    });

    Object.entries(state.completed).forEach(([key, isDone]) => {
      const badge = document.getElementById(`status-${key}`);
      if (badge && isDone) {
        badge.textContent = '✓ Completed';
        badge.style.background = '#D8F3DC';
      }
    });
  },

  initImageFallbacks() {
    document.querySelectorAll('img').forEach(img => {
      const candidates = [
        img.getAttribute('src'),
        img.dataset.local,
        img.dataset.fallback
      ].filter(Boolean);

      let idx = 0;
      img.addEventListener('error', () => {
        idx++;
        if (idx < candidates.length && img.src !== candidates[idx]) {
          img.src = candidates[idx];
        }
      });
    });
  },

  applyTitleTheme() {
    const headingEl = document.querySelector('main h1') || document.querySelector('h1');
    const sourceText = `${document.title} ${headingEl ? headingEl.textContent : ''}`.toLowerCase();

    const themeMap = [
      { keys: ['basic', 'principle'], cls: 'theme-basics' },
      { keys: ['colour', 'color', 'harmony'], cls: 'theme-colour' },
      { keys: ['typograph', 'font', 'scale'], cls: 'theme-typography' },
      { keys: ['layout', 'grid', 'whitespace'], cls: 'theme-layout' },
      { keys: ['lab', 'studio', 'poster'], cls: 'theme-lab' },
      { keys: ['quiz', 'feedback', 'challenge'], cls: 'theme-quiz' }
    ];

    const matched = themeMap.find(item => item.keys.some(k => sourceText.includes(k)));
    if (matched) {
      document.body.classList.add(matched.cls);
    }
  },

  init3DClayWorld() {
    if (document.getElementById('clay3dStage')) return;

    const stage = document.createElement('div');
    stage.className = 'clay-3d-stage';
    stage.id = 'clay3dStage';
    stage.setAttribute('aria-hidden', 'true');

    stage.innerHTML = `
      <div class="clay-tilt-plane" id="clayTiltPlane">
        <div class="clay-item" style="top: 10%; left: 3%; --dur: 7.2s; --delay: 0s;">
          <div class="clay-inner clay-cloud" data-depth="24"></div>
        </div>
        <div class="clay-item" style="top: 14%; right: 4%; --dur: 8s; --delay: 1.4s;">
          <div class="clay-inner clay-cloud" data-depth="28"></div>
        </div>

        <div class="clay-item" style="top: 34%; left: 2.5%; --dur: 6.4s; --delay: 0.6s;">
          <div class="clay-inner clay-sphere" data-depth="42" style="--sz: 56px; --c1: #FAD2E1; --c2: #E06D97;"></div>
        </div>
        <div class="clay-item" style="bottom: 24%; right: 3%; --dur: 6.8s; --delay: 1.1s;">
          <div class="clay-inner clay-sphere" data-depth="38" style="--sz: 48px; --c1: #D8F3DC; --c2: #52B788;"></div>
        </div>
        <div class="clay-item" style="top: 46%; right: 2.5%; --dur: 7.5s; --delay: 0.3s;">
          <div class="clay-inner clay-cube" data-depth="46" style="--sz: 50px; --c1: #BEE1E6; --c2: #4EA8DE;"></div>
        </div>
        <div class="clay-item" style="bottom: 34%; left: 3.5%; --dur: 7s; --delay: 1.9s;">
          <div class="clay-inner clay-cube" data-depth="36" style="--sz: 42px; --c1: #DDD6FE; --c2: #8B5CF6;"></div>
        </div>

        <div class="clay-item clay-star" style="top: 22%; left: 11%; --dur: 5.2s; --delay: 0.4s;">
          <div class="clay-inner" data-depth="52">
            <svg width="46" height="46" viewBox="0 0 64 64">
              <defs>
                <radialGradient id="clayStarGold" cx="32%" cy="28%" r="72%">
                  <stop offset="0%" stop-color="#FFFFFF"/>
                  <stop offset="45%" stop-color="#FFE082"/>
                  <stop offset="100%" stop-color="#F4A261"/>
                </radialGradient>
              </defs>
              <path d="M32 4 C35 21, 43 29, 60 32 C43 35, 35 43, 32 60 C29 43, 21 35, 4 32 C21 29, 29 21, 32 4 Z" fill="url(#clayStarGold)"/>
            </svg>
          </div>
        </div>
        <div class="clay-item clay-star" style="bottom: 16%; right: 11%; --dur: 5.8s; --delay: 1.5s;">
          <div class="clay-inner" data-depth="48">
            <svg width="42" height="42" viewBox="0 0 64 64">
              <defs>
                <radialGradient id="clayStarPink" cx="32%" cy="28%" r="72%">
                  <stop offset="0%" stop-color="#FFFFFF"/>
                  <stop offset="45%" stop-color="#FAD2E1"/>
                  <stop offset="100%" stop-color="#E06D97"/>
                </radialGradient>
              </defs>
              <path d="M32 4 C35 21, 43 29, 60 32 C43 35, 35 43, 32 60 C29 43, 21 35, 4 32 C21 29, 29 21, 32 4 Z" fill="url(#clayStarPink)"/>
            </svg>
          </div>
        </div>

        <div class="clay-item clay-tool" style="top: 56%; left: 1.8%; --dur: 6.6s; --delay: 0.9s;">
          <div class="clay-inner" data-depth="55">
            <svg width="68" height="68" viewBox="0 0 80 80">
              <g transform="rotate(-32 40 40)">
                <rect x="28" y="10" width="24" height="12" rx="6" fill="#FF8FA3"/>
                <rect x="28" y="20" width="24" height="6" fill="#E2E8F0"/>
                <rect x="28" y="26" width="24" height="32" rx="4" fill="#FFD166"/>
                <polygon points="28,58 52,58 40,74" fill="#FDE4CF"/>
                <polygon points="36,68 44,68 40,74" fill="#3D405B"/>
              </g>
            </svg>
          </div>
        </div>

        <div class="clay-item clay-tool" style="top: 26%; right: 6%; --dur: 6.9s; --delay: 0.2s;">
          <div class="clay-inner" data-depth="58">
            <svg width="70" height="70" viewBox="0 0 80 80">
              <g transform="rotate(28 40 40)">
                <rect x="33" y="34" width="14" height="38" rx="7" fill="#A0C4FF"/>
                <rect x="32" y="27" width="16" height="9" rx="3" fill="#E2E8F0"/>
                <path d="M31 27 C31 12, 49 12, 49 27 Z" fill="#FF758F"/>
              </g>
            </svg>
          </div>
        </div>

        <div class="clay-item clay-tool" style="bottom: 6%; right: 2.5%; --dur: 7.4s; --delay: 1.3s;">
          <div class="clay-inner" data-depth="50">
            <svg width="84" height="76" viewBox="0 0 90 80">
              <rect x="22" y="16" width="24" height="52" rx="8" transform="rotate(-24 34 62)" fill="#FAD2E1"/>
              <rect x="30" y="14" width="24" height="52" rx="8" transform="rotate(-6 42 62)" fill="#FFF1C1"/>
              <rect x="38" y="16" width="24" height="52" rx="8" transform="rotate(14 50 62)" fill="#BEE1E6"/>
              <circle cx="42" cy="60" r="4.5" fill="#FFFFFF"/>
            </svg>
          </div>
        </div>
      </div>
    `;

    document.body.prepend(stage);

    const tiltPlane = document.getElementById('clayTiltPlane');
    const depthNodes = stage.querySelectorAll('.clay-inner');
    let lastSparkleTime = 0;

    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;

      if (tiltPlane) {
        tiltPlane.style.transform = `rotateY(${nx * 6}deg) rotateX(${-ny * 6}deg)`;
      }

      depthNodes.forEach(node => {
        const d = parseFloat(node.dataset.depth || '30');
        node.style.transform = `translate3d(${nx * d}px, ${ny * d}px, 0)`;
      });

      const now = performance.now();
      if (now - lastSparkleTime > 55) {
        lastSparkleTime = now;
        const dot = document.createElement('span');
        dot.className = 'sparkle-particle';
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 760);
      }
    }, { passive: true });

    window.addEventListener('click', (e) => {
      const colors = ['#FAD2E1', '#BEE1E6', '#DDD6FE', '#D8F3DC', '#FFE082'];
      for (let i = 0; i < 7; i++) {
        const piece = document.createElement('span');
        piece.className = 'burst-particle';
        const angle = (Math.PI * 2 * i) / 7 + (Math.random() * 0.4);
        const dist = 42 + Math.random() * 44;
        const size = 10 + Math.random() * 8;
        const color = colors[i % colors.length];

        Object.assign(piece.style, {
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: i % 2 === 0 ? '50%' : '5px',
          background: `radial-gradient(circle at 30% 30%, #FFFFFF, ${color})`,
          boxShadow: '0 4px 10px rgba(35,33,41,0.14)'
        });
        piece.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        piece.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        piece.style.setProperty('--rot', `${Math.round(Math.random() * 240 - 120)}deg`);
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 760);
      }
    });
  },

  _playSoftNote(freq, duration = 1.4, volume = 0.03) {
    if (!this._audioCtx) return;
    const now = this._audioCtx.currentTime;
    const osc = this._audioCtx.createOscillator();
    const gain = this._audioCtx.createGain();
    const filter = this._audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this._audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  },

  _startAmbientLoop() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!this._audioCtx) {
      this._audioCtx = new AudioCtx();
    }
    if (this._audioCtx.state === 'suspended') {
      this._audioCtx.resume();
    }

    const chords = [
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 392.00],
      [174.61, 220.00, 261.63, 349.23],
      [196.00, 246.94, 293.66, 329.63]
    ];

    let step = 0;
    const playBar = () => {
      if (!this._isMusicPlaying) return;
      const chord = chords[step % chords.length];
      chord.forEach((freq, idx) => {
        setTimeout(() => {
          if (this._isMusicPlaying) {
            this._playSoftNote(freq, 1.75, idx === 0 ? 0.025 : 0.016);
          }
        }, idx * 140);
      });
      step++;
    };

    playBar();
    clearInterval(this._musicTimer);
    this._musicTimer = setInterval(playBar, 2200);
  },

  _stopAmbientLoop() {
    clearInterval(this._musicTimer);
    this._musicTimer = null;
  },

  toggleMusic() {
    const btn = document.getElementById('musicToggleBtn');
    const label = document.getElementById('musicToggleLabel');
    this._isMusicPlaying = !this._isMusicPlaying;
    localStorage.setItem('design101_music_on', JSON.stringify(this._isMusicPlaying));

    if (this._isMusicPlaying) {
      this._startAmbientLoop();
      btn?.classList.add('playing');
      if (label) label.textContent = 'Music On';
      this.pipSay("Cozy beats on! Let's create! 🎵");
    } else {
      this._stopAmbientLoop();
      btn?.classList.remove('playing');
      if (label) label.textContent = 'Music Off';
      this.pipSay("Music paused~");
    }
  },

  initMusicPlayer() {
    if (document.getElementById('musicToggleBtn')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'music-toggle-btn';
    btn.id = 'musicToggleBtn';
    btn.setAttribute('aria-label', 'Toggle background music');
    btn.innerHTML = `<span>🎵</span><span id="musicToggleLabel">Music Off</span>`;

    btn.addEventListener('click', () => this.toggleMusic());
    document.body.appendChild(btn);

    let wasOn = false;
    try {
      wasOn = JSON.parse(localStorage.getItem('design101_music_on')) === true;
    } catch {
      wasOn = false;
    }

    if (wasOn) {
      const resumeOnce = () => {
        if (!this._isMusicPlaying) {
          this._isMusicPlaying = true;
          this._startAmbientLoop();
          btn.classList.add('playing');
          const label = document.getElementById('musicToggleLabel');
          if (label) label.textContent = 'Music On';
        }
        window.removeEventListener('pointerdown', resumeOnce);
      };
      window.addEventListener('pointerdown', resumeOnce, { once: true });
    }
  },

  pipSay(text, duration = 3200) {
    const speech = document.getElementById('pipSpeech');
    const btn = document.getElementById('pipBtn');
    if (!speech || !btn) return;

    speech.textContent = text;
    speech.classList.add('show');
    btn.classList.add('happy');

    clearTimeout(this._pipTimer);
    this._pipTimer = setTimeout(() => {
      speech.classList.remove('show');
      btn.classList.remove('happy');
    }, duration);
  },

  initPip() {
    if (document.getElementById('pipWrap')) return;

    const lines = [
      "Hi! I'm Pip! Tap any card to start creating!",
      "Contrast + whitespace = instant glow-up!",
      "Tip: Click a colour swatch to copy its HEX code!",
      "Don't forget to test your poster in Design Lab!"
    ];

    const wrap = document.createElement('div');
    wrap.className = 'paint-mascot-wrap';
    wrap.id = 'pipWrap';
    wrap.innerHTML = `
      <button type="button" class="paint-mascot-btn" id="pipBtn" aria-label="Chat with Pip the Paint Mascot">
        <svg class="paint-mascot-svg" viewBox="0 0 100 100" aria-hidden="true">
          <path class="pip-body" d="M24 70 C14 70, 12 54, 22 46 C20 28, 34 17, 52 17 C72 17, 86 30, 84 48 C91 54, 90 69, 79 72 C77 84, 66 88, 58 82 C52 90, 40 89, 36 81 C29 84, 24 78, 24 70 Z" />
          <path d="M26 26 C32 11, 66 9, 75 23 C65 24, 38 25, 26 26 Z" fill="#7C5DFA" stroke="#232129" stroke-width="3" />
          <path d="M51 12 L55 6" stroke="#232129" stroke-width="3" stroke-linecap="round" />
          <ellipse cx="33" cy="34" rx="6.5" ry="3.5" transform="rotate(-24 33 34)" fill="#FFFFFF" opacity="0.75" />
          <ellipse cx="32" cy="56" rx="5.5" ry="3.5" fill="#FF8FA3" opacity="0.65" />
          <ellipse cx="68" cy="56" rx="5.5" ry="3.5" fill="#FF8FA3" opacity="0.65" />
          <g class="pip-eye">
            <circle cx="40" cy="48" r="5" fill="#232129" />
            <circle cx="38.5" cy="46.3" r="1.8" fill="#FFFFFF" />
            <circle cx="60" cy="48" r="5" fill="#232129" />
            <circle cx="58.5" cy="46.3" r="1.8" fill="#FFFFFF" />
          </g>
          <path d="M44 57 Q50 63 56 57" fill="none" stroke="#232129" stroke-width="3" stroke-linecap="round" />
        </svg>
      </button>
      <div class="paint-speech" id="pipSpeech"></div>
    `;

    document.body.appendChild(wrap);

    let idx = 0;
    const btn = document.getElementById('pipBtn');
    btn.addEventListener('click', () => {
      btn.classList.remove('booped');
      void btn.offsetWidth;
      btn.classList.add('booped');
      this.pipSay(lines[idx % lines.length]);
      idx++;
    });
  },

  showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: '#232129',
      color: '#FFFFFF',
      padding: '0.85rem 1.35rem',
      borderRadius: '999px',
      fontFamily: "'Fredoka', sans-serif",
      fontSize: '0.95rem',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
      zIndex: '9999',
      transform: 'translateY(30px)',
      opacity: '0',
      transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 350);
    }, 2600);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Design101.applyTitleTheme();
  Design101.initImageFallbacks();
  Design101.init3DClayWorld();
  Design101.syncUI();
  Design101.initPip();
  Design101.initMusicPlayer();

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), idx * 65);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }
});