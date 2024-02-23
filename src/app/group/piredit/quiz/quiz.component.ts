import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  addQuizQuestion:FormGroup
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.initiateQuestionForm()
  }

  initiateQuestionForm(){
    this.addQuizQuestion = this.fb.group({
      question: ['', Validators.required],
      answer_1: ['', Validators.required],
      answer_2: ['', Validators.required],
      answer_3: ['', Validators.required],
      answer_4: ['', Validators.required],
      answer: [null, Validators.required],
    });
  }

  save(form:FormGroup){
console.log(form)
  }
}
