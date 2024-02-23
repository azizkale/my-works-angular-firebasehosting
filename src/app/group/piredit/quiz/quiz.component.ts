import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizService } from 'src/app/services/quiz.service';
import { Chapter } from 'src/models/Chapter';
import { Question } from 'src/models/Question';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  @Input() chapter: Chapter;

  questionForm: FormGroup;
  constructor(private fb: FormBuilder, private quizService: QuizService) {}

  ngOnInit(): void {
    this.initiateQuestionForm();
  }

  initiateQuestionForm() {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      answer_1: ['', Validators.required],
      answer_2: ['', Validators.required],
      answer_3: ['', Validators.required],
      answer_4: ['', Validators.required],
      answer: [null, Validators.required],
    });
  }

  save() {
    const question = new Question(
      null,
      this.questionForm.get('question')?.value,
      this.questionForm.get('answer1')?.value,
      this.questionForm.get('answer2')?.value,
      this.questionForm.get('answer3')?.value,
      this.questionForm.get('answer4')?.value,
      this.questionForm.get('answer')?.value,
      this.chapter.editorId,
      this.chapter.pirId,
      this.chapter.chapterId
    );

    if (question !== null) {
      this.quizService.create(question).subscribe((data: any) => {});
    }
  }
}
