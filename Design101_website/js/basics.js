
// =================================
// DESIGN101 - BASICS JAVASCRIPT
// =================================

document.addEventListener("DOMContentLoaded", function () {

    // Get all knowledge-check questions
    const answerGroups = document.querySelectorAll(
        ".answer-list[data-answer]"
    );


    // Loop through every question
    answerGroups.forEach(function (group) {

        const correctAnswer = group.dataset.answer;

        const feedback = group.nextElementSibling;

        const buttons = group.querySelectorAll(
            ".answer-option"
        );


        // Add click event to every answer
        buttons.forEach(function (button) {

            button.addEventListener("click", function () {

                // Prevent answering twice
                if (group.dataset.answered === "true") {
                    return;
                }

                group.dataset.answered = "true";

                const selectedAnswer = button.textContent
                    .trim()
                    .replace(/^[A-D]\.\s*/, "");


                // Disable all answer buttons
                buttons.forEach(function (option) {

                    option.disabled = true;

                    const optionText = option.textContent
                        .trim()
                        .replace(/^[A-D]\.\s*/, "");

                    // Highlight correct answer
                    if (optionText === correctAnswer) {

                        option.classList.add("correct");

                    }

                });


                // Check selected answer
                if (selectedAnswer === correctAnswer) {

                    feedback.textContent =
                        "🎉 Correct! Excellent work!";

                    feedback.style.color = "#39945b";

                } else {

                    button.classList.add("wrong");

                    feedback.textContent =
                        "Not quite! The correct answer is " +
                        correctAnswer + ".";

                    feedback.style.color = "#c45b70";

                }

            });

        });

    });

});
