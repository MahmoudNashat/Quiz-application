// Select Elements
let questionCount = document.querySelector('.quiz-info .count span'),
bulletsContainer = document.querySelector('.bullets .spans'),
quizArea = document.querySelector('.quiz-area'),
submitButton = document.querySelector('.submit-answer'),
countDown = document.querySelector('.count-down'),
Theresults = document.querySelector('.results'),
ratingSpan = document.querySelector('.rating-span'),
resSpan = document.querySelector('.res-span');
// set options
let currentIndex = 0,
rightAnswers = 0;
// Ajax calling 
function getRequest() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
            let myQuestionObj = JSON.parse(this.responseText),
            questionLength = myQuestionObj.length;
            createBullets(questionLength);
            addQuestionsData(myQuestionObj[currentIndex])
            submitButton.onclick = () => {
                let theRightAnswer = myQuestionObj[currentIndex].right_answer;
                // release questions
                currentIndex++;
                checkAnswer(theRightAnswer, questionCount);
                quizArea.innerHTML = '';
                addQuestionsData(myQuestionObj[currentIndex]);
                // add active class to bullets
                handelBullts();
                handelResult(questionCount);
            }
            timeCount(0);
            
        }
    }
    myRequest.open("GET", "js/questions.json", true);
    myRequest.send();
}
getRequest();
function createBullets(num) {
    // create the question count
    questionCount.innerHTML = " " + num;
    // Create the question bullets
    for (let x = 0; x < num; x++) {
        // create the bullet span
        let theBullet = document.createElement('span');
        bulletsContainer.appendChild(theBullet);
        if (x === 0) {
            theBullet.className = 'active';
        }
    }

}
function addQuestionsData(obj) {
    if (currentIndex < 9) {
        // create head title
        let headTitle = document.createElement('h2'),
        headText = document.createTextNode(obj.title)
        // append text node to header
        headTitle.appendChild(headText);
        // append header to quiz area
        quizArea.appendChild(headTitle);
        // Create the questions
        for (let i = 1; i <= 4; i++) {
            let questionDiv = document.createElement('div'),
            radioInput = document.createElement('input'),
            label = document.createElement('label'),
            labelText = document.createTextNode( obj[`answer_${i}`])
            // add class to question div
            questionDiv.className = 'answer';
            // add id + name + dataset + type to radioinput
            radioInput.id = `answer${i}`;
            radioInput.name = 'question';
            radioInput.dataset.answer = obj[`answer_${i}`];
            radioInput.type = 'radio';
            // make first child of input radio checked
            if (i === 1) {
                radioInput.checked = true;

            }
            // concate the label with radioinput
            label.htmlFor = `answer${i}`;
            // append labeltext to label 
            label.appendChild(labelText);
            // append radioInput + label to question div
            questionDiv.appendChild(radioInput);
            questionDiv.appendChild(label);
            // append question div to quiz area
            quizArea.appendChild(questionDiv);
        }

    }
};
function checkAnswer(rAnswer) {
    let answers = document.getElementsByName('question'),
    theChoosenAnswer;
    for (let i = 1; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++

    }
    console.log(rightAnswers)
}
// handel bullets
function handelBullts() {
    let allBulletsSpan = document.querySelectorAll('.bullets .spans span'),
    allBulletsSpanArray = Array.from(allBulletsSpan);
    allBulletsSpanArray.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'active';
        }
    })
}
function handelResult(qcount) {
    if (currentIndex ===  9) {
        quizArea.remove();
        bulletsContainer.remove();
        submitButton.remove();
        Theresults.style.display = 'block';
    }
    if (rightAnswers > 5 && rightAnswers < 9) {
        ratingSpan.innerHTML = 'Good' + ' ';
        resSpan.innerHTML = `you have answered ${rightAnswers} from 9 questions`;
        ratingSpan.classList.add('good');
    } else if (rightAnswers === 9) {
        ratingSpan.innerHTML = 'Perfect' + ' ';
        resSpan.innerHTML = `you have answered ${rightAnswers} from 9 questions `;
        ratingSpan.classList.add('perfect');
    } else if (rightAnswers <= 5) {
        ratingSpan.innerHTML = 'Bad' + ' ';
        resSpan.innerHTML = `you have answered ${rightAnswers} from 9 questions`;
        ratingSpan.classList.add('bad');
    }
}
function timeCount(duration) {
    if (currentIndex < 9) {
        let minutes, seconds,
        intervalCount = setInterval(function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countDown.innerHTML = `Your time is ${minutes}:${seconds}`;
            duration++;
            if (currentIndex == 9) {
                clearInterval(intervalCount);
            }
        }, 1000)
    }
}
