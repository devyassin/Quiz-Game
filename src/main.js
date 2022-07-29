//selected elements
const count = document.querySelector(".count span");
const spans = document.querySelector(".spans");
const quizArea = document.querySelector(".quiz-area");
const answersArea = document.querySelector(".answers-area");
const submitQuestion = document.querySelector(".submit-button");
const results = document.querySelector(".results");
let currentIndex = 0;
let questionsCount;
let data;
let rightQuestions = [];
let numberOfRightAnswers = 0;

async function getQuestions() {
  try {
    const res = await fetch("../question.json");
    data = await res.json();
    questionsCount = data.length;
    creatBullets(questionsCount);
    addQuestionData(data[currentIndex]);
  } catch (err) {
    console.log(err);
  }
}
getQuestions();

function creatBullets(num) {
  count.innerHTML = num;
  let spanArr = [];
  for (let index = 0; index < num; index++) {
    spanArr.push(`<span ${index === 0 ? 'class="on"' : ""} ></span>`);
  }
  spans.insertAdjacentHTML("afterbegin", spanArr.join(""));
}

function addQuestionData(obj) {
  rightQuestions.push(obj.right_answer);
  let bigArr = Object.values(obj.answers);
  const quizMarkup = `<h2>${obj.title}</h2>`;
  quizArea.insertAdjacentHTML("afterbegin", quizMarkup);
  const answersMarkup = bigArr
    .map((answer, i) => {
      return `
    <div class="answer">
          <input type="radio" id="answer_${
            i + 1
          }" name="questions" data-answer="answer_${i + 1}" ${
        i + 1 === 1 ? "checked" : ""
      }/>
          <label for="answer_${i + 1}">${answer}</label>
    </div>`;
    })
    .join("");

  answersArea.insertAdjacentHTML("afterbegin", answersMarkup);
}

function submitQuestions() {
  submitQuestion.addEventListener("click", (e) => {
    let userAnswer = chosenAnswer();

    checkAnsewer(rightQuestions[currentIndex], userAnswer);

    if (currentIndex === questionsCount - 1) {
      renderResult();
      return;
    }

    setTimeout(() => {
      quizArea.innerHTML = "";
      answersArea.innerHTML = "";
      currentIndex++;

      spans
        .querySelectorAll("span")
        .forEach((span) => span.classList.remove("on"));

      spans.querySelectorAll("span").forEach((span, i) => {
        if (i === currentIndex) {
          span.classList.add("on");
        }
      });

      addQuestionData(data[currentIndex]);
    }, 1000);
  });
}

submitQuestions();

function chosenAnswer() {
  let answersHTML = document.getElementsByName("questions");
  let chosenAnswer;
  for (let i = 0; i < answersHTML.length; i++) {
    if (answersHTML[i].checked) {
      chosenAnswer = answersHTML[i].dataset.answer;
    }
  }
  return chosenAnswer;
}

function checkAnsewer(right_answer, chosenAnswer) {
  const trueAnswer = Object.keys(data[currentIndex].answers).find(
    (key) => data[currentIndex].answers[key] === right_answer
  );

  if (trueAnswer === chosenAnswer) {
    numberOfRightAnswers++;
    const divRightAnswer = document
      .getElementById(`${trueAnswer}`)
      .closest(".answer");
    divRightAnswer.style.backgroundColor = "	#00FF00";
  } else {
    const divRightAnswer = document
      .getElementById(`${trueAnswer}`)
      .closest(".answer");
    divRightAnswer.style.backgroundColor = "	#00FF00";
    const divChosenAnswer = document
      .getElementById(`${chosenAnswer}`)
      .closest(".answer");
    divChosenAnswer.style.backgroundColor = "	#FF6347";
  }
}

function renderResult() {
  let grade;
  if (numberOfRightAnswers <= 3) {
    grade = "bad";
  } else if (numberOfRightAnswers > 3 && numberOfRightAnswers <= 7) {
    grade = "good";
  } else {
    grade = "perfect";
  }
  const resultMarkup = `
  <span class="${grade}">${grade} </span>You Answered ${numberOfRightAnswers} from ${questionsCount} `;
  results.insertAdjacentHTML("afterbegin", resultMarkup);
}

function timer(timeInMins) {
  const result = document.querySelector(".countdown");

  let time = 60 * timeInMins;

  setInterval(function () {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    result.innerHTML = `${minutes}:${seconds}`;
    if (currentIndex === questionsCount - 1) return;
    time--;
  }, 1000);
}
timer(2);
