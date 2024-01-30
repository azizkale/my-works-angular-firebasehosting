import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DisplaypirService } from 'src/app/services/displaypir.service';
import { Chapter } from 'src/models/Chapter';
import { WordPair } from 'src/models/WordPair';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/dialog/dialog.component';

@Component({
  selector: 'app-chapter-content',
  templateUrl: './chapter-content.component.html',
  styleUrls: ['./chapter-content.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChapterContentComponent implements OnInit {
  @ViewChild('chapterContent') chapterContent: ElementRef
  selectedChapterId: any
  selectedPirId: any;
  selectedChapter: Chapter
  retrieveChapterContentForm: FormGroup

  constructor(
    public fb: FormBuilder,
    private activeroute: ActivatedRoute,
    private displaypirservice: DisplaypirService,
    public dialog: MatDialog
  ) {
    this.formChapterRetrieve()

  }

  async ngOnInit() {
    this.selectedChapterId = await this.activeroute.snapshot.paramMap.get('contentId');
    this.selectedPirId = await this.activeroute.snapshot.paramMap.get('pirId');
    this.retrieveChaptertByChapterId()
  }

  formChapterRetrieve() {
    this.retrieveChapterContentForm = this.fb.group({
      chapterId: ['', Validators.required],
      pirId: ['', Validators.required],
      editorId: ['', Validators.required],
      createDate: ['', Validators.required],
      chapterContent: ['', Validators.required],
    });

  }


  retrieveChaptertByChapterId() {
    this.displaypirservice.retrieveChapterByChapterId(this.selectedChapterId, this.selectedPirId).subscribe({
      next: async (chapter: Chapter) => {
        this.selectedChapter = await chapter;

        if (this.selectedChapter.wordPairs !== undefined) {
          //modifies the chapter content adding <b> tag to wordpairs
          for (const wordpair of Object.values(this.selectedChapter.wordPairs)) {
            this.selectedChapter.chapterContent = this.selectedChapter.chapterContent.replace(wordpair.word.trim(), `<b>${wordpair.word.trim()}</b>`);
            this.chapterContent.nativeElement.innerHTML = this.selectedChapter.chapterContent
          }

          // adding mouseover event to the <b> tags
          Object.values(this.chapterContent.nativeElement.getElementsByTagName('b')).map((el: HTMLElement | any) => {
            el.addEventListener('click', async () => {
              // getting meaning from wordPairs
              const word_: WordPair | any = Object.values(this.selectedChapter.wordPairs).find((pair: WordPair) => pair.word.trim() === el.innerHTML.trim())
              //popup
              this.openDialog(word_)
            });
          })
        }
        else {
          this.chapterContent.nativeElement.innerHTML = chapter.chapterContent
        }

      }
    })
  }

  openDialog(wordpair: WordPair): void {
    if (wordpair !== undefined) {
      this.dialog.open(DialogComponent, {
        data: { word: wordpair.word, meaning: wordpair.meaning }
      });
    }
  }
}
