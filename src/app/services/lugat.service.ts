import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { word } from '../group/piredit/lugat/word';

@Injectable({
  providedIn: 'root',
})
export class LugatService {
  public listWords: word[] = [];

  word$: word = { word: '', meaning: '' };

  constructor(private http: HttpClient) {}

  findWordMeaning(word: string): Observable<any> {
    return this.http.get(environment.url + `/getmeaning?word=${word}`);
  }

  getWordsMeaning(word: string) {
    this.listWords = [];
    this.findWordMeaning(word).subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          data.forEach((d: any) => {
            const newWord: word = { word: d.Kelime, meaning: d.Mana };
            this.listWords.push(newWord);
          });
        }
      },
      error: (err) => {
        console.error('Error:', err);
      },
      complete: () => {
        // this.receivedWord = '';
      },
    });
  }
}
