let questions = []; // Inicializa o array de perguntas vazio
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = [];

// Função para carregar as perguntas do arquivo JSON
async function loadQuestions() {
    try {
        const response = await fetch('bible.json'); // Faz a requisição para o arquivo JSON
        questions = await response.json(); // Converte a resposta para JSON e atribui ao array de perguntas
        shuffleArray(questions); // Embaralha as perguntas
        displayQuestion(); // Exibe a primeira pergunta
        displayQuestionNumber(); // Exibe o número da primeira pergunta
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
        document.getElementById('result').textContent = `Resposta incorreta. Por favor, consulte a referência bíblica: ${reference}.`;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
        displayQuestionNumber(); // Exibe o número da próxima pergunta
    } else {
        finishQuiz(); // Se todas as perguntas foram respondidas, chama a função para finalizar o quiz
    }
}

document.getElementById('submit-btn').addEventListener('click', checkAnswer);

// Função para exibir o número da pergunta atual
function displayQuestionNumber() {
    document.getElementById('question-number').textContent = `${currentQuestionIndex + 1} de ${questions.length}`;
}

// Função para finalizar o quiz e redirecionar para o resultado.html
function finishQuiz() {
    const params = new URLSearchParams();
    params.append('correctAnswers', correctAnswers);
    params.append('totalQuestions', questions.length);
    params.append('wrongAnswers', JSON.stringify(wrongAnswers));
    window.location.href = `resultado.html?${params.toString()}`;
}

// Adiciona evento ao botão "Finalizar"
document.getElementById('finish-btn').addEventListener('click', finishQuiz);

// Chama a função para carregar as perguntas ao carregar a página
loadQuestions();
