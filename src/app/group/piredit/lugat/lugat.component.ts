import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LugatService } from 'src/app/services/lugat.service';
import { word } from './word';

@Component({
  selector: 'app-lugat',
  templateUrl: './lugat.component.html',
  styleUrls: ['./lugat.component.css'],
})
export class LugatComponent implements OnInit {
  @ViewChild('manualWord') manualWord!: ElementRef<HTMLInputElement>;
  @Input() receivedWord: string;

  constructor(private lugatService: LugatService) {}

  listWords: word[] = [];
  word$: word = { word: '', meaning: '' };

  ngOnInit(): void {
    // this.getWordsMeaning(this.receivedWord);
  }

  getWordsMeaning(word: string) {
    this.listWords = [];

    this.lugatService.findWordMeaning(word).subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          data.forEach((d: any) => {
            console.log(d);

            const newWord: word = { word: d.Kelime, meaning: d.Mana };
            this.listWords.push(newWord);
          });
        }
      },
      error: (err) => {
        console.error('Error:', err);
      },
      complete: () => {
        this.receivedWord = '';
      },
    });
  }

  getMeaningManuel() {
    this.listWords = [];
    this.lugatService
      .findWordMeaning(this.manualWord.nativeElement.value)
      .subscribe({
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
      });
  }
}
