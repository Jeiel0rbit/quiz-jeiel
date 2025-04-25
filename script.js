let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = [];
let quizTime;
let totalQuestions;
let timer;
let timerInterval = 100;

const modeSelectionView = document.getElementById('mode-selection');
const questionView = document.getElementById('question-view');
const resultView = document.getElementById('result-view');
const questionNumberDisplay = document.getElementById('question-number');
const questionDisplay = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const submitBtn = document.getElementById('submit-btn');
const selectionWarning = document.getElementById('selection-warning');
const progressBarContainer = document.getElementById('progress-bar-container');
const progressBar = document.getElementById('progress-bar');
const correctAnswersDisplay = document.getElementById('correctAnswers');
const totalQuestionsDisplay = document.getElementById('totalQuestions');
const wrongAnswersListContainer = document.getElementById('wrongAnswersList');
const noErrorsMessage = document.getElementById('no-errors-message');
const restartBtn = document.getElementById('restart-btn');
const mode1Btn = document.getElementById('mode-1');
const mode2Btn = document.getElementById('mode-2');

async function loadQuestionsAndStart() {
    try {
        submitBtn.disabled = true;
        const response = await fetch('bible.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const loadedData = await response.json();

        if (!Array.isArray(loadedData)) {
            console.error("Formato do JSON inválido: A raiz não é um array.", loadedData);
            throw new Error("Formato do JSON inválido: A raiz não é um array.");
        }

        questions = loadedData.filter(q => q && q.question && Array.isArray(q.options) && q.answer);
        if (questions.length === 0) {
            throw new Error("Nenhuma pergunta válida encontrada no arquivo JSON.");
        }

        shuffleArray(questions);
        startQuiz();
    } catch (error) {
        console.error('Erro ao carregar ou processar as perguntas:', error);
        alert(`Não foi possível carregar as perguntas: ${error.message}. Verifique o console para mais detalhes.`);
        showModeSelection();
    } finally {
        submitBtn.disabled = false;
    }
}

function shuffleArray(array) {
    if (!Array.isArray(array)) {
        console.error("shuffleArray foi chamada com algo que não é um array:", array);
        return array;
    }
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = [];
    modeSelectionView.classList.add('d-none');
    resultView.classList.add('d-none');
    questionView.classList.remove('d-none');
    questionNumberDisplay.classList.remove('d-none');
    progressBarContainer.classList.remove('d-none');
    selectionWarning.classList.add('d-none');
    displayQuestion();
    displayQuestionNumber();
    startTimer();
}

function displayQuestion() {
    if (currentQuestionIndex >= totalQuestions || currentQuestionIndex >= questions.length) {
        finishQuiz();
        return;
    }
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion || !Array.isArray(currentQuestion.options)) {
        console.error(`Erro: Pergunta ou opções inválidas no índice ${currentQuestionIndex}.`);
        finishQuiz();
        return;
    }

    questionDisplay.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';
    selectionWarning.classList.add('d-none');
    submitBtn.disabled = true;

    const shuffledOptions = shuffleArray([...currentQuestion.options]);

    if (!Array.isArray(shuffledOptions)) {
        console.error(`Erro: shuffleArray não retornou um array para as opções.`);
        finishQuiz();
        return;
    }

    shuffledOptions.forEach(option => {
        const div = document.createElement('div');
        div.className = 'form-check';

        const radioBtn = document.createElement('input');
        radioBtn.className = 'form-check-input';
        radioBtn.type = 'radio';
        radioBtn.name = 'option';
        radioBtn.value = option.id;
        radioBtn.id = `option-${option.id}`;
        radioBtn.addEventListener('change', () => {
             submitBtn.disabled = false;
             document.querySelectorAll('.form-check').forEach(el => el.classList.remove('border-primary'));
             div.classList.add('border-primary');
        });


        const label = document.createElement('label');
        label.className = 'form-check-label w-100';
        label.setAttribute('for', `option-${option.id}`);
        label.textContent = option.text;

        div.appendChild(radioBtn);
        div.appendChild(label);
        optionsContainer.appendChild(div);
    });
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');

    if (!selectedOption) {
        selectionWarning.classList.remove('d-none');
        return;
    }
    selectionWarning.classList.add('d-none');
    submitBtn.disabled = true;

    const userAnswer = selectedOption.value;
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
        console.error(`Erro: Não foi possível encontrar a pergunta atual (índice ${currentQuestionIndex}) ao verificar a resposta.`);
        finishQuiz();
        return;
    }

    const correctAnswer = currentQuestion.answer;

    if (userAnswer !== correctAnswer) {
        wrongAnswers.push({
            question: currentQuestion.question,
            reference: currentQuestion.reference || 'N/A'
        });
    } else {
        correctAnswers++;
    }

    currentQuestionIndex++;

    // Add a small delay before showing the next question or results
    setTimeout(() => {
        if (currentQuestionIndex < totalQuestions && currentQuestionIndex < questions.length) {
            displayQuestion();
            displayQuestionNumber();
        } else {
            finishQuiz();
        }
    }, 300); // 300ms delay
}


function displayQuestionNumber() {
    questionNumberDisplay.textContent = `Pergunta ${currentQuestionIndex + 1} de ${totalQuestions}`;
}

function finishQuiz() {
    clearInterval(timer);
    questionView.classList.add('d-none');
    questionNumberDisplay.classList.add('d-none');
    progressBarContainer.classList.add('d-none');
    displayResults();
    resultView.classList.remove('d-none');
}

function displayResults() {
    correctAnswersDisplay.textContent = correctAnswers;
    totalQuestionsDisplay.textContent = totalQuestions;
    wrongAnswersListContainer.innerHTML = '';
    noErrorsMessage.classList.add('d-none');


    if (wrongAnswers.length === 0) {
        noErrorsMessage.classList.remove('d-none');
        wrongAnswersListContainer.appendChild(noErrorsMessage);
    } else {
        wrongAnswers.forEach(wrongAnswer => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'wrong-answer-item';

            const questionText = document.createElement('div');
            questionText.textContent = wrongAnswer.question;
            questionText.className = 'fw-medium mb-1';

            const reference = document.createElement('div');
            reference.className = 'reference';
            reference.innerHTML = `Referência: <strong>${wrongAnswer.reference}</strong>`;

            itemDiv.appendChild(questionText);
            itemDiv.appendChild(reference);
            wrongAnswersListContainer.appendChild(itemDiv);
        });
    }
}

function startTimer() {
    progressBar.style.width = '100%';
    progressBar.setAttribute('aria-valuenow', 100);

    let timeLeft = quizTime * 1000;
    const totalTime = timeLeft;

    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft -= timerInterval;
        const percentageLeft = Math.max(0, (timeLeft / totalTime) * 100);
        progressBar.style.width = `${percentageLeft}%`;
        progressBar.setAttribute('aria-valuenow', percentageLeft);

        if (timeLeft <= 0) {
            clearInterval(timer);
            setTimeout(finishQuiz, 150);
        }
    }, timerInterval);
}

function showModeSelection() {
    resultView.classList.add('d-none');
    questionView.classList.add('d-none');
    questionNumberDisplay.classList.add('d-none');
    progressBarContainer.classList.add('d-none');
    modeSelectionView.classList.remove('d-none');
    questions = [];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = [];
    clearInterval(timer);
    submitBtn.disabled = false;
}

mode1Btn.addEventListener('click', () => {
    totalQuestions = 10;
    quizTime = 30;
    loadQuestionsAndStart();
});

mode2Btn.addEventListener('click', () => {
    totalQuestions = 20;
    quizTime = 120;
    loadQuestionsAndStart();
});

submitBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', showModeSelection);

document.addEventListener('DOMContentLoaded', showModeSelection);
