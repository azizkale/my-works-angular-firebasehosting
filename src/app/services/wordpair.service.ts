import { Injectable } from '@angular/core';
import { WordPair } from 'src/models/WordPair';
import { PireditService } from './piredit.service';

@Injectable({
  providedIn: 'root',
})
export class WordpairService {
  constructor(private pireditservice: PireditService) {}

  //to remove duplicated wordpairs from db
  //it is possible because of ChatGPT
  removeDuplicateWords(list: WordPair[]): WordPair[] {
    const uniqueWords = new Set<string>();
    if (list != undefined) {
      list.filter((pair) => {
        if (uniqueWords.has(pair.word.toLowerCase())) {
          this.pireditservice.deleteWordPair(pair).subscribe({
            next: (data: any) => console.log(data),
          });
          return false;
        } else {
          uniqueWords.add(pair.word.toLowerCase());
          return true;
        }
      });
    }
    return list;
  }
}
