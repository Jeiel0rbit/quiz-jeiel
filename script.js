const questions = [
    { question: 'Quem é o primeiro homem criado por Deus?', answer: 'Adão' },
    { question: 'Qual é o quinto livro da Bíblia?', answer: 'Deuteronômio' },
    { question: 'Quem escreveu o livro de Apocalipse?', answer: 'João' },
    // Adicione mais perguntas conforme necessário
];

let currentQuestionIndex = 0;
let correctAnswers = 0;

function getRandomQuestion() {
    return questions[Math.floor(Math.random() * questions.length)];
}

function displayQuestion() {
    const randomQuestion = questions[currentQuestionIndex];
    document.getElementById('question').textContent = randomQuestion.question;
    document.getElementById('answer').value = '';
    document.getElementById('result').textContent = '';
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        document.getElementById('result').textContent = 'Resposta correta!';
        correctAnswers++;
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            // Se todas as perguntas foram respondidas, redireciona para resultado.html
            window.location.href = `resultado.html?correctAnswers=${correctAnswers}&totalQuestions=${questions.length}`;
        }
    } else {
        document.getElementById('result').textContent = 'Resposta incorreta. Tente novamente.';
    }
}

document.getElementById('submit-btn').addEventListener('click', checkAnswer);

displayQuestion();
