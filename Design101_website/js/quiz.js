/* =========================================
   DESIGN101 - QUIZ & FEEDBACK DASHBOARD
   ========================================= */
const questions = [
  {
    q: "Which design principle helps a viewer immediately spot the most important headline on a poster?",
    options: ["Visual Hierarchy & Contrast", "Using 6 clashing fonts", "Eliminating all spacing"],
    answer: 0
  },
  {
    q: "Which colour harmony uses colours directly opposite each other on the colour wheel?",
    options: ["Monochromatic", "Complementary", "Analogous"],
    answer: 1
  },
  {
    q: "What is 'leading' in typography?",
    options: ["Vertical space between lines of text", "Font weight thickness", "Left margin alignment"],
    answer: 0
  }
];

let currentIdx = 0;
let selectedOption = null;
let score = 0;

const questionCounter = document.getElementById('questionCounter');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');

function renderQuestion() {
  if (!questionText || !optionsContainer) return;
  selectedOption = null;
  const item = questions[currentIdx];
  questionCounter.textContent = `Question ${currentIdx + 1} of ${questions.length}`;
  questionText.textContent = item.q;

  optionsContainer.innerHTML = item.options.map((opt, idx) => `
    <button type="button" class="btn quiz-option" onclick="selectOption(${idx}, this)">${opt}</button>
  `).join('');
}

window.selectOption = function(idx, el) {
  selectedOption = idx;
  document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
};

nextQuestionBtn?.addEventListener('click', () => {
  if (selectedOption === null) {
    Design101.showToast('⚠️ Select an option first!');
    Design101.pipSay("Pick an answer before moving on!");
    return;
  }
  if (selectedOption === questions[currentIdx].answer) score++;

  currentIdx++;
  if (currentIdx < questions.length) {
    renderQuestion();
  } else {
    showDashboard();
  }
});

function showDashboard() {
  document.getElementById('quizSection').style.display = 'none';
  const dash = document.getElementById('feedbackDashboard');
  dash.style.display = 'block';

  const accuracyPct = Math.round((score / questions.length) * 100);
  const finalScore = Math.round(64 + (score / questions.length) * 36);

  document.getElementById('finalScoreText').textContent = finalScore;
  document.getElementById('accLabel').textContent = `${accuracyPct}%`;
  document.getElementById('conLabel').textContent = `${Math.max(60, accuracyPct)}%`;

  setTimeout(() => {
    document.getElementById('accBar').style.width = `${accuracyPct}%`;
    document.getElementById('spdBar').style.width = '90%';
    document.getElementById('conBar').style.width = `${Math.max(60, accuracyPct)}%`;
  }, 150);

  Design101.pipSay(`You scored ${finalScore}/100! Amazing job!`);
}

renderQuestion();