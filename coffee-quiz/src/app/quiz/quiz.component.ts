import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../questions.service';
import { timer, Subscription } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  question: string = '';
  baseAnswer: string = '';
  givenAnswer: string = '';
  isCorrect: boolean = false;
  category = { id: 0, title: '' };
  questions: any;
  index: number = 0;
  isLoading: boolean = false;
  timeLeft: number = 0;
  countdown: any = Subscription;
  timePerQuestion: number = 10;
  tick: number = 1000;

  constructor(
    private QuizService: QuestionsService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getRandomQuestion();

    this.countdown = timer(0, this.tick).subscribe(() => {
      if (this.timeLeft > 0) {
        --this.timeLeft;
        if (this.timeLeft == 0) {
          this.answerCheck();
        }
      }
    });
  }

  getRandomQuestion() {
    this.isLoading = true;

    this.QuizService.getRandomQuestions().subscribe((response) => {
      this.givenAnswer = '';
      this.questions = response;
      this.question = this.questions[this.index].question;
      this.baseAnswer = this.questions[this.index].answer;
      this.category = this.questions[this.index].category;
      this.isLoading = false;
      this.resetTimer();

      console.log(this.baseAnswer);
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

  modelChange(str: string): void {
    this.givenAnswer = str;
    console.log('input: ' + this.givenAnswer);
  }

  answerCheck() {
    console.log(this.givenAnswer);
    console.log(this.baseAnswer);

    if (
      this.givenAnswer != null &&
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
    } else {
      this.isCorrect = false;
    }
    if (this.timeLeft == 0) {
      this.answerDialog();
    }
  }

  answerDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      timeLeft: this.timeLeft,
      baseAnswer: this.baseAnswer,
      isCorrect: this.isCorrect,
    };
    let dialogRef = this.matDialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.getRandomQuestion();
    });
  }
}
