/* =========================================
   DESIGN101 - TYPOGRAPHY SANDBOX
   ========================================= */
const headingFontSelect = document.getElementById('headingFontSelect');
const sizeSlider = document.getElementById('sizeSlider');
const leadingSlider = document.getElementById('leadingSlider');
const specimenHeading = document.getElementById('specimenHeading');
const specimenBody = document.getElementById('specimenBody');

function updateTypeSpecimen() {
  if (!specimenHeading || !specimenBody) return;
  specimenHeading.style.fontFamily = headingFontSelect.value;
  specimenHeading.style.fontSize = `${sizeSlider.value}px`;
  specimenBody.style.lineHeight = leadingSlider.value;

  document.getElementById('sizeReadout').textContent = sizeSlider.value;
  document.getElementById('leadingReadout').textContent = leadingSlider.value;
}

headingFontSelect?.addEventListener('change', () => {
  updateTypeSpecimen();
  Design101.pipSay("Ooh, nice font pairing!");
});
sizeSlider?.addEventListener('input', updateTypeSpecimen);
leadingSlider?.addEventListener('input', updateTypeSpecimen);