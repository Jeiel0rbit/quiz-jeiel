let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = [];
let quizTime;
let totalQuestions;
let timer;

async function loadQuestions() {
    try {
        const response = await fetch('bible.json');
        questions = await response.json();
        shuffleArray(questions);
        startQuiz();
    } catch (error) {
        console.error('Erro ao carregar as perguntas:', error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    document.getElementById('mode-selection').classList.add('hidden');
    document.getElementById('question-container').classList.remove('hidden');
    totalQuestions = totalQuestions || questions.length;
    quizTime = quizTime || 30;
    displayQuestion();
    displayQuestionNumber();
    startTimer();
}

function displayQuestion() {
    const randomQuestion = questions[currentQuestionIndex];
    document.getElementById('question').textContent = randomQuestion.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    randomQuestion.options.forEach(option => {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex items-center gap-2';
        
        const radioBtn = document.createElement('input');
        radioBtn.setAttribute('type', 'radio');
        radioBtn.setAttribute('name', 'option');
        radioBtn.setAttribute('value', option.id);
        radioBtn.setAttribute('id', option.id);
        radioBtn.className = 'form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500';
        
        const label = document.createElement('label');
        label.setAttribute('for', option.id);
        label.textContent = option.text;
        label.className = 'text-gray-700'; 
        
        wrapper.appendChild(radioBtn);
        wrapper.appendChild(label);
        optionsContainer.appendChild(wrapper);
    });
    
    document.getElementById('result').textContent = '';
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    
    if (!selectedOption) {
        document.getElementById('result').textContent = 'Por favor, selecione uma opção.';
        return;
    }
    
    const userAnswer = selectedOption.value;
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;

    if (userAnswer === correctAnswer) {
        correctAnswers++;
    } else {
        const reference = currentQuestion.reference;
        wrongAnswers.push({ question: currentQuestion.question, reference: reference });
    }
    
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestions) {
        displayQuestion();
        displayQuestionNumber();
    } else {
        finishQuiz();
    }
}    

document.getElementById('submit-btn').addEventListener('click', checkAnswer);

function displayQuestionNumber() {
    document.getElementById('question-number').textContent = `${currentQuestionIndex + 1} de ${totalQuestions}`;
}

function finishQuiz() {
    clearInterval(timer);
    const params = new URLSearchParams();
    params.append('correctAnswers', correctAnswers);
    params.append('totalQuestions', totalQuestions);
    params.append('wrongAnswers', JSON.stringify(wrongAnswers));
    window.location.href = `resultado.html?${params.toString()}`;
}

function startTimer() {
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'fixed bottom-0 left-0 right-0 p-4';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'w-full bg-gray-200 rounded-full h-4';
    
    const progressFill = document.createElement('div');
    progressFill.className = 'bg-blue-600 h-4 rounded-full transition-all duration-1000';
    progressFill.style.width = '100%';
    
    progressBar.appendChild(progressFill);
    progressBarContainer.appendChild(progressBar);
    document.body.appendChild(progressBarContainer);

    let timeLeft = quizTime;
    const interval = 100;
    const steps = quizTime * (1000 / interval);
    let currentStep = 0;

    timer = setInterval(() => {
        currentStep++;
        const percentageLeft = ((steps - currentStep) / steps) * 100;
        progressFill.style.width = `${percentageLeft}%`;

        if (currentStep >= steps) {
            clearInterval(timer);
            finishQuiz();
        }
    }, interval);
}

document.getElementById('mode-1').addEventListener('click', function () {
    totalQuestions = 10;
    quizTime = 30;
    loadQuestions();
});

document.getElementById('mode-2').addEventListener('click', function () {
    totalQuestions = 20;
    quizTime = 120;
    loadQuestions();
});
