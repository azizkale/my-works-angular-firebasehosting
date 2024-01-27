// markdown.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import * as markedOriginal from 'marked';

const marked: any = markedOriginal.defaults || markedOriginal;

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
  transform(value: string): string {
    return marked(value);
  }
}
