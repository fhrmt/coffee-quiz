import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../questions.service';

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

  constructor(private QuizService: QuestionsService) {}

  ngOnInit(): void {
    this.getRandomQuestion();
  }

  getRandomQuestion() {
    this.QuizService.getRandomQuestions().subscribe((response) => {
      this.questions = response;
      this.question = this.questions[this.index].question;
      this.baseAnswer = this.questions[this.index].answer;
      this.category = this.questions[this.index].category;
      console.log(response);
    });
  }
}
