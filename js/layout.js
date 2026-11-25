/* =========================================
   DESIGN101 - LAYOUT & GRID PLAYGROUND
   ========================================= */
const layoutCanvas = document.getElementById('layoutCanvas');
const toggleGuidesBtn = document.getElementById('toggleGuidesBtn');
const colCountSelect = document.getElementById('colCountSelect');
const gapSlider = document.getElementById('gapSlider');
const gapVal = document.getElementById('gapVal');

toggleGuidesBtn?.addEventListener('click', () => {
  layoutCanvas?.classList.toggle('show-guides');
  Design101.pipSay("Toggled grid guides!");
});

colCountSelect?.addEventListener('change', () => {
  if (layoutCanvas) {
    layoutCanvas.style.gridTemplateColumns = `repeat(${colCountSelect.value}, 1fr)`;
  }
});

gapSlider?.addEventListener('input', () => {
  gapVal.textContent = gapSlider.value;
  if (layoutCanvas) {
    layoutCanvas.style.gap = `${gapSlider.value}px`;
  }
});