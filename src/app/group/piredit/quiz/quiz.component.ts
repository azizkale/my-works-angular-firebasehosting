import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  addQuizQuestion:FormGroup
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
  }

}
