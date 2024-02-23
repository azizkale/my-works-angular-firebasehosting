import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Question } from 'src/models/Question';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(private http: HttpClient) {}

  create(question: Question): Observable<any> {
    const body = { question: question };
    return this.http.post(environment.url + '/question/create', body);
  }

  retrieve(): Observable<any> {
    return new Observable();
  }

  update(): Observable<any> {
    return new Observable();
  }

  delete(): Observable<any> {
    return new Observable();
  }
}
