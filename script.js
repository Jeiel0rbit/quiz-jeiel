let questions = []; // Inicializa o array de perguntas vazio
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = [];
let quizTime; // Tempo total do quiz
let totalQuestions; // Número de perguntas no quiz
let timer; // Referência ao temporizador

// Função para carregar as perguntas do arquivo JSON
async function loadQuestions() {
    try {
        const response = await fetch('bible.json'); // Faz a requisição para o arquivo JSON
        questions = await response.json(); // Converte a resposta para JSON e atribui ao array de perguntas
        shuffleArray(questions); // Embaralha as perguntas
        startQuiz(); // Inicia o quiz após carregar as perguntas
    } catch (error) {
        console.error('Erro ao carregar as perguntas:', error);
    }
}

// Função para embaralhar um array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    // Esconde a seleção de modo e mostra o questionário
    document.getElementById('mode-selection').classList.add('hidden');
    document.getElementById('question-container').classList.remove('hidden');

    // Define as perguntas e o tempo com base no modo selecionado
    totalQuestions = totalQuestions || questions.length;
    quizTime = quizTime || 30; // Define um valor padrão, caso nenhum modo seja selecionado

    displayQuestion(); // Exibe a primeira pergunta
    displayQuestionNumber(); // Exibe o número da primeira pergunta
    startTimer(); // Inicia o temporizador
}

function displayQuestion() {
    const randomQuestion = questions[currentQuestionIndex];
    document.getElementById('question').textContent = randomQuestion.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = ''; // Limpar opções anteriores
    
    randomQuestion.options.forEach(option => {
        const radioBtn = document.createElement('input');
        radioBtn.setAttribute('type', 'radio');
        radioBtn.setAttribute('name', 'option');
        radioBtn.setAttribute('value', option.id);
        radioBtn.setAttribute('id', option.id);
        
        const label = document.createElement('label');
        label.setAttribute('for', option.id);
        label.textContent = option.text;
        
        const br = document.createElement('br');
        
        optionsContainer.appendChild(radioBtn);
        optionsContainer.appendChild(label);
        optionsContainer.appendChild(br);
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
        document.getElementById('result').textContent = 'Resposta correta!';
        correctAnswers++;
    } else {
        const reference = currentQuestion.reference;
        wrongAnswers.push({ question: currentQuestion.question, reference: reference });
        document.getElementById('result').textContent = `Resposta incorreta. Consulte a referência bíblica: ${reference}.`;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestions) {
        displayQuestion();
        displayQuestionNumber();
    } else {
        finishQuiz(); // Se todas as perguntas foram respondidas
    }
}

document.getElementById('submit-btn').addEventListener('click', checkAnswer);

// Função para exibir o número da pergunta atual
function displayQuestionNumber() {
    document.getElementById('question-number').textContent = `${currentQuestionIndex + 1} de ${totalQuestions}`;
}

// Função para finalizar o quiz e redirecionar para o resultado.html
function finishQuiz() {
    clearInterval(timer); // Para o temporizador
    const params = new URLSearchParams();
    params.append('correctAnswers', correctAnswers);
    params.append('totalQuestions', totalQuestions);
    params.append('wrongAnswers', JSON.stringify(wrongAnswers));
    window.location.href = `resultado.html?${params.toString()}`;
}

// Inicia o cronômetro do quiz
function startTimer() {
    let timeLeft = quizTime;
    const timerElement = document.createElement('p');
    timerElement.id = 'timer';
    timerElement.textContent = `Tempo restante: ${timeLeft} segundos`;
    document.body.appendChild(timerElement);

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Tempo restante: ${timeLeft} segundos`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            finishQuiz(); // Finaliza o quiz quando o tempo acaba
        }
    }, 1000);
}

// Função para selecionar o modo de perguntas
document.getElementById('mode-1').addEventListener('click', function () {
    totalQuestions = 10;
    quizTime = 30;
    loadQuestions();
});

document.getElementById('mode-2').addEventListener('click', function () {
    totalQuestions = 20;
    quizTime = 60;
    loadQuestions();
});
