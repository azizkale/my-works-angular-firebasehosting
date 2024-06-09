import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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

  listWords: word[] = [];
  word$: word = { word: '', meaning: '' };

  constructor(public lugatService: LugatService) {}

  ngOnInit(): void {}

  getMeaningManuel() {
    this.lugatService.getWordsMeaning(this.manualWord.nativeElement.value);
  }

  reset() {
    this.lugatService.listWords = [];
  }
}
