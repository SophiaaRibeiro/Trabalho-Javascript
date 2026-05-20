const questions = [
    {
        question: 'Como você gosta de começar o dia?',
        sub: 'Escolha o que mais combina com você.',
        answers: [
            {
                text: 'Forte e intenso',
                sub: 'Preciso acordar rápido.',
                icon: 'fa-bolt',
                result: 'espresso'
            },

            {
                text: 'Suave e cremoso',
                sub: 'Conforto em primeiro lugar.',
                icon: 'fa-heart',
                result: 'latte'
            },

            {
                text: 'Refrescante',
                sub: 'Algo leve e moderno.',
                icon: 'fa-snowflake',
                result: 'iced'
            },

            {
                text: 'Doce e aconchegante',
                sub: 'Quero algo equilibrado.',
                icon: 'fa-cookie',
                result: 'mocha'
            }
        ]
    },

    {
        question: 'Qual ambiente você prefere?',
        sub: 'Seu café ideal acompanha seu estilo.',

        answers: [
            {
                text: 'Cidade agitada',
                sub: 'Energia e movimento.',
                icon: 'fa-city',
                result: 'espresso'
            },

            {
                text: 'Lugar aconchegante',
                sub: 'Calmo e confortável.',
                icon: 'fa-couch',
                result: 'latte'
            },

            {
                text: 'Praia e verão',
                sub: 'Leveza e frescor.',
                icon: 'fa-water',
                result: 'iced'
            },

            {
                text: 'Livros e chuva',
                sub: 'Momento perfeito.',
                icon: 'fa-book',
                result: 'mocha'
            }
        ]
    }
];

let currentQuestion = 0;

const scores = {
    espresso: 0,
    latte: 0,
    iced: 0,
    mocha: 0
};

const questionElement =
    document.querySelector('.quiz-question');

const subElement =
    document.querySelector('.quiz-sub');

const optionsContainer =
    document.querySelector('.quiz-options');

const progressBar =
    document.querySelector('.quiz-progress-bar');

function renderQuestion(){

    const question =
        questions[currentQuestion];

    questionElement.textContent =
        question.question;

    subElement.textContent =
        question.sub;

    optionsContainer.innerHTML = '';

    question.answers.forEach(answer => {

        const button =
            document.createElement('button');

        button.classList.add('quiz-opt');

        button.innerHTML = `

            <span class="quiz-opt-icon">
                <i class="fa-solid ${answer.icon}"></i>
            </span>

            <span class="quiz-opt-text">
                ${answer.text}
            </span>

            <p class="quiz-opt-sub">
                ${answer.sub}
            </p>

        `;

        button.addEventListener('click', () => {

            scores[answer.result]++;

            nextQuestion();

        });

        optionsContainer.appendChild(button);

    });

    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    progressBar.style.width =
        `${progress}%`;

}

function nextQuestion(){

    currentQuestion++;

    if(currentQuestion < questions.length){

        renderQuestion();

    } else {

        showResult();

    }

}

function showResult(){

    const winner =
        Object.keys(scores).reduce((a, b) =>
            scores[a] > scores[b] ? a : b
        );

    const results = {

        espresso: {
            title: '☕ Espresso Premium',
            desc: 'Você tem uma personalidade intensa, moderna e cheia de energia.'
        },

        latte: {
            title: '🥛 Latte Cremoso',
            desc: 'Você transmite conforto, equilíbrio e aconchego.'
        },

        iced: {
            title: '🧊 Vanilla Ice Coffee',
            desc: 'Você é leve, criativo e gosta de experiências refrescantes.'
        },

        mocha: {
            title: '🍫 Mocha Velvet',
            desc: 'Você ama momentos acolhedores e sabores marcantes.'
        }

    };

    optionsContainer.innerHTML = `

        <div class="quiz-result">

            <h2>
                ${results[winner].title}
            </h2>

            <p>
                ${results[winner].desc}
            </p>

            <br>

            <a href="../pages/cardapio.html"
               class="btn btn-primary">
               Ver Cardápio
            </a>

        </div>

    `;

    questionElement.textContent =
        'Seu café ideal é:';

    subElement.textContent =
        'Resultado baseado nas suas escolhas ☕';

}

renderQuestion();