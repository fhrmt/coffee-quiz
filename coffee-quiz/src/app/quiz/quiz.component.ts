import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../questions.service';
import { timer, Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  question: string = '';
  baseAnswer: string = '';
  givenAnswer: string = '';
  isAnswered: boolean = false;
  isCorrect: boolean = false;
  category = { id: 0, title: '' };
  questions: any;
  index: number = 0;
  isLoading: boolean = false;
  timeLeft: number = 0;
  countdown: any = Subscription;
  timePerQuestion: number = 3;
  tick: number = 1000;
  formdata: any;

  constructor(private QuizService: QuestionsService) {}

  ngOnInit(): void {
    this.getRandomQuestion();
    this.formdata = new FormGroup({
      givenAnswer: new FormControl(''),
    });
    console.log('formdata: ', this.formdata);

    this.countdown = timer(0, this.tick).subscribe(() => {
      if (this.timeLeft > 0) {
        --this.timeLeft;
      }
    });
  }

  getRandomQuestion() {
    this.isAnswered = false;

    this.isLoading = true;
    this.QuizService.getRandomQuestions().subscribe((response) => {
      this.formdata.reset();
      this.givenAnswer = '';
      this.questions = response;
      this.question = this.questions[this.index].question;
      this.baseAnswer = this.questions[this.index].answer;
      this.category = this.questions[this.index].category;
      this.isLoading = false;
      this.resetTimer();

      console.log(response);
    });
  }

  resetTimer() {
    this.timeLeft = this.timePerQuestion;
  }

  formatLabel(value: number) {
    return value + 's';
  }

  updateTimer(event: any) {
    this.timePerQuestion = event.value;
    this.resetTimer();
  }

  answerCheck(data: any) {
    this.givenAnswer = data.givenAnswer;
    console.log(this.givenAnswer);
    console.log(this.baseAnswer);

    if (this.givenAnswer == null) {
      alert('Type in your answer!');
    } else if (this.givenAnswer.length > 0) {
      this.isAnswered = true;
      if (
        this.givenAnswer
          .toLowerCase()
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .replace(/(\s{2,})/g, ' ') ==
        this.baseAnswer
          .toLowerCase()
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .replace(/(\s{2,})/g, ' ')
      ) {
        this.isCorrect = true;
        alert('Correct!');
      } else {
        this.isCorrect = false;
      }
    }

    // if (this.givenAnswer.length > 0) {
    //   this.isAnswered = true;

    //   this.givenAnswer =  this.givenAnswer.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/(\s{2,})/g, ' ')

    // console.log(this.givenAnswer);
    // }
  }
}
