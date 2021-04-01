import { Component, OnInit} from '@angular/core';
import { QuestionsService } from '../questions.service';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  question: string = '';
  baseAnswer: string = '';
  category = { id: 0, title: '' };
  questions: any;
  index: number = 0;
  isLoading: boolean = false;
  timeLeft: number = 0;
  countdown: any = Subscription;
  timePerQuestion: number = 3;
  tick: number = 1000;

  constructor(private QuizService: QuestionsService) {}

  ngOnInit(): void {
    this.getRandomQuestion();
    this.countdown = timer(0, this.tick).subscribe(() => {
      if (this.timeLeft > 0) {
        --this.timeLeft;
      }
    });
  }

  getRandomQuestion() {
    this.isLoading = true;
    this.QuizService.getRandomQuestions().subscribe((response) => {
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
}

