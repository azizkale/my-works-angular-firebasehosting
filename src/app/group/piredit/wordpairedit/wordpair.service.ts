import { Injectable } from '@angular/core';
import { Chapter } from 'src/models/Chapter';

@Injectable({
  providedIn: 'root',
})
export class WordpairService {
  selectedChapterFromChapterEdit: Chapter;
  constructor() {}
}
