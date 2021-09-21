"use strict";

const container = document.querySelector(".container");
const form = document.querySelector(".form");
const nextBtn = document.querySelector(".btn-next");
const paginationContainer = document.querySelector(".question-list");
const dialogContainer = document.querySelector(".overlay");

class App {
  #questionLists = [
    {
      number: 1,
      question: "What is the name of your idol ?",
      choices: ["TFBOYS", "易烊千玺", "王源", "王俊凯"],
      answer: "TFBOYS",
      name: "idol-name",
    },
    {
      number: 2,
      question: "How old is mom ?",
      choices: ["40", "41", "42", "43"],
      answer: "43",
      name: "mom-age",
    },
    {
      number: 3,
      question: "How old is dad ?",
      choices: ["43", "45", "46", "47"],
      answer: "47",
      name: "dad-age",
    },
    {
      number: 4,
      question: "What occupation do you like the most?",
      choices: ["baker", "comic writer", "novelist", "translator"],
      answer: "translator",
      name: "occupation",
    },
    {
      number: 5,
      question: "What is 易烊千玺 english name?",
      choices: ["TFBOYS", "Jackson Yee", "Jackson Ye", "Jeckson Yee"],
      answer: "Jackson Yee",
      name: "english-name",
    },
  ];
  #totalquestions = this.#questionLists.length;
  #choicesContainer;
  #btnContainer;
  #currentPage = 0;

  constructor() {
    this._renderQuestion(this.#questionLists);
    this._renderQuestionPagination(this.#questionLists);
    this.#choicesContainer = document.querySelector(".choices");
    this.#btnContainer = document.querySelector(".btn-container");
    paginationContainer.addEventListener(
      "click",
      this._switchQuestion.bind(
        this,
        this.#questionLists,
        "question-list-item",
        ""
      )
    );
    this.#btnContainer.addEventListener(
      "click",
      this._switchQuestion.bind(
        this,
        this.#questionLists,
        "btn-next",
        "btn-prev"
      )
    );
    this.#choicesContainer.addEventListener(
      "click",
      this._toggleActiveAnswer.bind(this, this.#questionLists)
    );
  }

  _clear(element) {
    element.innerHTML = "";
  }

  _checkActiveAnswer() {
    return [...this.#choicesContainer.children].find((e) =>
      e.classList.contains("chosen")
    );
  }

  _checkAllAnswered(questionLists) {
    return questionLists.every((question) => question?.choosedAnswer);
  }

  _countScore(questionLists) {
    //   total score = correct number * score per number
    //   score per number = 1 / total page * 100
    let correctNumber = 0;

    const scorePerNumber = (1 / this.#totalquestions) * 100;
    questionLists.forEach((question) => {
      if (question.choosedAnswer === question.answer) {
        correctNumber += 1;
      }
    });

    const totalScore = correctNumber * scorePerNumber;

    return totalScore;
  }

  _renderButton(questionObj) {
    const number = questionObj.number;
    if (number === 1) {
      return `<input class="btn btn-next" data-question-number="${
        number + 1
      }" type="button" value="Next" />`;
    }

    if (number === this.#totalquestions) {
      return `
            <input class="btn btn-prev" data-question-number="${
              number - 1
            }" type="button" value="Prev" />
            <input class="btn btn-submit" type="submit" value="Submit" />

                  `;
    }

    return `
        <input class="btn btn-prev" data-question-number="${
          number - 1
        }" type="button" value="Prev" />
        <input class="btn btn-next" data-question-number="${
          number + 1
        }" type="button" value="Next" />
        `;
  }

  _renderChoiceAlfabhet(number) {
    switch (number) {
      case 0:
        return "a";
      case 1:
        return "b";
      case 2:
        return "c";
      case 3:
        return "d";
    }
  }

  _renderChoices(questionObj) {
    const choices = questionObj.choices.map(
      (choice, index) => `
          <div class="btn btn-choices ${
            questionObj.choosedAnswer === choice ? "chosen" : ""
          }">
              <input
                  class="input-radio"
                  id="${choice}"
                  type="radio"
                  name="${questionObj.name}"
                  value="${choice}"
              />
              <label class="choices-label" for="${choice}"> ${this._renderChoiceAlfabhet(
        index
      )}. ${choice}</label>
          </div>
      `
    );

    return choices.join(" ");
  }

  _renderQuestion(questionLists, currentPage = 0) {
    const questionObj = questionLists[currentPage];
    this._clear(form);

    const html = `
        <h1 class="form-question-title">Question ${questionObj.number}</h1>
        <h3 class="form-question">${questionObj.question}</h3>
        <div class="choices">
            ${this._renderChoices(questionObj)}
        </div>
        <div class="btn-container">
          ${this._renderButton(questionObj)}
        </div>

      `;

    form.insertAdjacentHTML("afterbegin", html);
  }

  _renderQuestionPagination(questionLists) {
    this._clear(paginationContainer);

    questionLists.forEach((question) => {
      const questionNumber = question.number;
      const html = `
          <li class="question-list-item ${
            this.#currentPage + 1 === questionNumber ? "active" : ""
          }" data-question-number="${questionNumber}">
            ${question.choosedAnswer ? "✔" : questionNumber}
          </li>
          `;

      paginationContainer.insertAdjacentHTML("beforeend", html);
    });
  }

  _showDialog(questionLists, e) {
    e.preventDefault();
    dialogContainer.classList.remove("hidden");
    document
      .querySelector(".btn-cancel")
      .addEventListener("click", function () {
        dialogContainer.classList.add("hidden");
      });
    document
      .querySelector(".btn-submit-quiz")
      .addEventListener("click", this._showScore.bind(this, questionLists));
  }

  _showScore(questionLists) {
    dialogContainer.classList.add("hidden");
    const score = this._countScore(questionLists);
    this._clear(container);
    const html = `
        <div class="score-container">
            <h2 class="score-subtitle">Congrats, you have finished the quiz </h2c>
            <h2 class="score-subtitle">Your Score is </h2>
            <h1 class="score-title">${score}</h1> 
        </dvi>
        `;
    container.insertAdjacentHTML("beforeend", html);
  }

  _switchQuestion(questionLists, classes1, classes2, e) {
    const target = e.target;
    if (
      target.classList.contains(classes1) ||
      target.classList.contains(classes2)
    ) {
      this.#currentPage = target.dataset.questionNumber - 1;
      this._renderQuestion(questionLists, this.#currentPage);
      this._renderQuestionPagination(questionLists);
    }
    this.#choicesContainer = document.querySelector(".choices");
    this.#choicesContainer.addEventListener(
      "click",
      this._toggleActiveAnswer.bind(this, this.#questionLists)
    );
    this.#btnContainer = document.querySelector(".btn-container");
    this.#btnContainer.addEventListener(
      "click",
      this._switchQuestion.bind(
        this,
        this.#questionLists,
        "btn-next",
        "btn-prev"
      )
    );

    this._toggleSubmitButton(questionLists);
    document
      .querySelector(".btn-submit")
      .addEventListener("click", this._showDialog.bind(this, questionLists));
  }

  _toggleActiveAnswer(questionLists, e) {
    e.preventDefault();
    const target = e.target;

    const activeChoices = this._checkActiveAnswer();

    if (activeChoices) {
      activeChoices.classList.remove("chosen");
      questionLists[this.#currentPage].choosedAnswer = "";
      this._renderQuestionPagination(questionLists);
      if (activeChoices == target || activeChoices == target.parentElement)
        return;
    }

    if (target.classList.contains("choices-label")) {
      target.parentElement.classList.add("chosen");
      questionLists[this.#currentPage].choosedAnswer =
        target.textContent.slice(4);
      this._renderQuestionPagination(questionLists);
      this._toggleSubmitButton(questionLists);

      e.stopImmediatePropagation();
    }
    if (target.classList.contains("btn-choices")) {
      target.classList.add("chosen");
      questionLists[this.#currentPage].choosedAnswer = target
        .querySelector(".choices-label")
        .textContent.slice(4);
      this._renderQuestionPagination(questionLists);
      this._toggleSubmitButton(questionLists);
    }
  }

  _toggleSubmitButton(questionLists) {
    if (this.#currentPage === 4) {
      if (!this._checkAllAnswered(questionLists)) {
        document.querySelector(".btn-submit").setAttribute("disabled", "");
      }
      if (this._checkAllAnswered(questionLists)) {
        document.querySelector(".btn-submit").removeAttribute("disabled");
      }
    }
  }
}

const app = new App();

/*
  Make a question JSON
  each object contain question number, question, choices, answer, correct (if false then the score is 0)

  
*/
