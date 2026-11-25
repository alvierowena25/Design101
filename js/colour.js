/* =========================================
   DESIGN101 - COLOUR HARMONY GENERATOR
   ========================================= */
const hueSlider = document.getElementById('hueSlider');
const hueVal = document.getElementById('hueVal');
const harmonySelect = document.getElementById('harmonySelect');
const swatchContainer = document.getElementById('swatchContainer');
const randomPaletteBtn = document.getElementById('randomPaletteBtn');

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function generatePalette() {
  if (!hueSlider || !swatchContainer) return;
  const baseHue = parseInt(hueSlider.value, 10);
  hueVal.textContent = baseHue;
  const mode = harmonySelect.value;

  let hues = [];
  if (mode === 'analogous') {
    hues = [baseHue, (baseHue + 30) % 360, (baseHue + 60) % 360, (baseHue + 330) % 360];
  } else if (mode === 'complementary') {
    hues = [baseHue, (baseHue + 15) % 360, (baseHue + 180) % 360, (baseHue + 195) % 360];
  } else {
    hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360, (baseHue + 60) % 360];
  }

  const hexList = hues.map((h, i) => hslToHex(h, 76, i === 3 ? 86 : 70));
  const state = Design101.getState();
  state.savedPalette = hexList;
  Design101.saveState(state);

  swatchContainer.innerHTML = hexList.map(hex => `
    <div class="swatch-card" style="background: ${hex}" onclick="copyHex('${hex}')">
      <div class="swatch-tag">${hex} · Copy</div>
    </div>
  `).join('');
}

window.copyHex = function(hex) {
  navigator.clipboard?.writeText(hex);
  Design101.showToast(`📋 Copied ${hex}!`);
  Design101.pipSay(`Copied ${hex}! Great choice!`);
};

hueSlider?.addEventListener('input', generatePalette);
harmonySelect?.addEventListener('change', generatePalette);
randomPaletteBtn?.addEventListener('click', () => {
  hueSlider.value = Math.floor(Math.random() * 360);
  generatePalette();
  Design101.pipSay("Fresh palette generated!");
});

generatePalette();