const questions = [
    {
        question: 'Qual foi o primeiro milagre realizado por Jesus?',
        options: [
            { id: 'A', text: 'Transformação de água em vinho' },
            { id: 'B', text: 'Curar um leproso' },
            { id: 'C', text: 'Alimentar os 5000' },
            { id: 'D', text: 'Andar sobre as águas' }
        ],
        answer: 'A',
        reference: 'João 2:1-11'
    },
    {
        question: 'Quem escreveu o evangelho de Mateus?',
        options: [
            { id: 'A', text: 'Mateus' },
            { id: 'B', text: 'Lucas' },
            { id: 'C', text: 'João' },
            { id: 'D', text: 'Marcos' }
        ],
        answer: 'A',
        reference: 'Mateus 9:9'
    },
    {
        question: 'Quem foi o discípulo que traiu Jesus?',
        options: [
            { id: 'A', text: 'Pedro' },
            { id: 'B', text: 'Tiago' },
            { id: 'C', text: 'Judas' },
            { id: 'D', text: 'Mateus' }
        ],
        answer: 'C',
        reference: 'Mateus 26:14-16'
    },
    // Adicione mais perguntas conforme necessário
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = [];

function getRandomQuestion() {
    return questions[Math.floor(Math.random() * questions.length)];
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
    } else {
        const params = new URLSearchParams();
        params.append('correctAnswers', correctAnswers);
        params.append('totalQuestions', questions.length);
        params.append('wrongAnswers', JSON.stringify(wrongAnswers));
        window.location.href = `resultado.html?${params.toString()}`;
    }
}

document.getElementById('submit-btn').addEventListener('click', checkAnswer);

displayQuestion();
