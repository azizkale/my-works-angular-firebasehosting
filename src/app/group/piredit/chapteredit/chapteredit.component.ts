import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PireditService } from 'src/app/services/piredit.service';
import { UserService } from 'src/app/services/user.service';
import { Chapter } from 'src/models/Chapter';
import { Roles } from 'src/models/Roles';
import { WordPair } from 'src/models/WordPair';
import { WordpaireditComponent } from '../wordpairedit/wordpairedit.component';
import { RolesService } from 'src/app/services/roles.service';
import { DisplaypirService } from 'src/app/services/displaypir.service';
import { map, of, switchMap } from 'rxjs';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-chapteredit',
  templateUrl: './chapteredit.component.html',
  styleUrls: ['./chapteredit.component.css'],
})
export class ChaptereditComponent implements OnInit {
  @ViewChild(WordpaireditComponent)
  private wordpaireditComponent: WordpaireditComponent;
  @ViewChild('chapterContent') chapterContent: ElementRef;
  @ViewChild('chapterContentforEditor') chapterContentforEditor: ElementRef;

  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  onMouseOrTouchEnd(event: Event) {
    this.captureSelectedText(event);
  }

  retrieveChapterForm: FormGroup;
  createChapterForm: FormGroup;
  updateChapterForm: FormGroup;
  addWordForm: FormGroup;
  chapters: Chapter[];
  selectedChapterContentToEdit: string;
  allowedToAdminAndMentor: boolean;
  allowedToAdmin: boolean;
  uid = localStorage.getItem('uid');

  selectedPirId: any;
  selectedGroupId: any; // to get users of this group
  selectedWord: any; // to edit word on chapter update form
  selectedChapter: Chapter;
  users_createchapter: any[] = []; // fullfilling the select tag on FormGroup
  users_updateform: any[] = []; // fullfilling the select tag on FormGroup

  fontSize: number;
  lineHeight: number;
  isNightMode: boolean;

  constructor(
    public fb: FormBuilder,
    private pireditservice: PireditService,
    private activeroute: ActivatedRoute,
    public userservice: UserService,
    public roleservice: RolesService,
    private displayService: DisplaypirService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.selectedPirId = this.activeroute.snapshot.paramMap.get('pirid');
    this.selectedGroupId = this.activeroute.snapshot.paramMap.get('groupid');
    this.retrieveChapters();
    this.createChapterRetrieveForm();
    this.createNewChapterForm();
    this.createUpdateChapterForm();
    this.createAddWordPairForm();

    this.roleControll(this.selectedGroupId, this.uid);
    this.initialReadMode();
    this.initialFontSetting();
  }

  createChapterRetrieveForm() {
    this.retrieveChapterForm = this.fb.group({
      chapterId: ['', Validators.required],
      pirId: ['', Validators.required],
      editorId: ['', Validators.required],
      createDate: ['', Validators.required],
      chapterContent: ['', Validators.required],
    });
  }

  createNewChapterForm() {
    this.createChapterForm = this.fb.group({
      chapterName: ['', Validators.required],
      chapterContent: ['', Validators.required],
      selectEditor: ['', Validators.required],
    });

    // fullfilling the select tag on FormGroup
    this.users_createchapter = [];
    this.userservice
      .retrieveAllUsersOfTheGroup(this.selectedGroupId)
      .subscribe({
        next: (ress: any) => {
          ress.forEach((user: any) => {
            this.users_createchapter.push(user);
            this.createChapterForm.addControl(
              ress.uid,
              new FormControl(user.uid)
            );
          });
        },
      });
  }

  createAddWordPairForm() {
    this.addWordForm = this.fb.group({
      word: ['', Validators.required],
      meaning: ['', Validators.required],
    });
  }

  createUpdateChapterForm() {
    this.updateChapterForm = this.fb.group({
      chapterId: ['', Validators.required],
      chapterName: ['', Validators.required],
      chapterContent: ['', Validators.required],
      selectEditor: ['', Validators.required],
    });

    // fullfilling the select tag on FormGroup
    this.users_updateform = [];
    this.userservice
      .retrieveAllUsersOfTheGroup(this.selectedGroupId)
      .subscribe({
        next: (ress: any) => {
          ress.forEach((user: any) => {
            this.users_updateform.push(user);
            this.createChapterForm.addControl(
              ress.uid,
              new FormControl(user.uid)
            );
          });
        },
      });
  }

  retrieveChapters() {
    const editorId = this.uid;
    this.roleservice
      .getUserRolesInTheGroup(this.selectedGroupId, editorId)
      .subscribe({
        next: (roles) => {
          //if the user the mentor, all chapter comes
          if (roles?.includes(Roles[2])) {
            this.pireditservice
              .retrieveAllChapters(this.selectedPirId)
              .subscribe({
                next: (ress) => {
                  if (ress !== undefined && ress !== null) {
                    this.chapters = Object.values(ress);
                    this.chapters.forEach((chapter, index) => {
                      this.retrieveChapterForm.addControl(
                        chapter.chapterName,
                        new FormControl(chapter.chapterName)
                      );
                    });
                  }
                },
              });
          } else {
            this.pireditservice
              .retrieveChaptersByEditorId(this.uid, this.selectedPirId)
              .subscribe({
                next: (ress) => {
                  if (ress !== undefined && ress !== null) {
                    this.chapters = Object.values(ress);
                    this.chapters.forEach((chapter, index) => {
                      this.retrieveChapterForm.addControl(
                        chapter.chapterName,
                        new FormControl(chapter.chapterName)
                      );
                    });
                  }
                },
              });
          }
        },
      });
  }

  addChapter(chapterName: string, chapterContent: string) {
    const editorId = this.createChapterForm.get('selectEditor')?.value;

    //chapterId will be given in server-side
    const chapter = new Chapter(
      chapterName,
      chapterContent,
      null,
      editorId,
      this.selectedPirId,
      new Date(),
      []
    );
    this.pireditservice.addChapter(chapter).subscribe({
      next: (ress) => {
        console.log(ress);
      },
      complete: () => {
        this.retrieveChapters();
      },
    });
  }

  deleteChapter() {
    this.pireditservice
      .deleteChapter(
        this.selectedPirId,
        this.updateChapterForm.get('chapterId')?.value
      )
      .subscribe({
        next: (ress) => {
          this.retrieveChapters();
          this.createChapterRetrieveForm();
        },
      });
  }

  selectChapter(chapter: Chapter) {
    of(chapter)
      .pipe(
        map((chapter) => {
          this.selectedChapter = chapter;
          return chapter;
        }),
        switchMap((chapter) => {
          if (
            chapter.chapterContent !== null ||
            chapter.chapterContent !== undefined
          ) {
            if (chapter.wordPairs !== undefined) {
              for (const wordpair of Object.values(chapter.wordPairs)) {
                this.selectedChapterContentToEdit =
                  chapter.chapterContent.replace(
                    wordpair.word.trim(),
                    `<b>${wordpair.word.trim()}</b>`
                  );
              }
            } else {
              this.selectedChapterContentToEdit = chapter.chapterContent;
            }
          } else {
            this.selectedChapterContentToEdit =
              'Bu bölüme henüz bir metin eklenmedi!';
          }

          return of(chapter);
        }),
        map((chapter) => {
          this.chapterContent.nativeElement.innerHTML =
            this.selectedChapterContentToEdit;
          this.chapterContentforEditor.nativeElement.innerHTML =
            chapter.chapterContent;
          return chapter;
        }),
        map((chapter) => {
          this.updateChapterForm = this.fb.group({
            chapterId: [chapter.chapterId],
            chapterName: [chapter.chapterName, Validators.required],
            chapterContent: [
              this.selectedChapterContentToEdit,
              Validators.required,
            ],
            pirId: [chapter.pirId, Validators.required],
            editorId: [chapter.editorId, Validators.required],
            createDate: [chapter.createDate, Validators.required],
            selectEditor: [chapter.editorId],
          });
        })
      )
      .subscribe();
  }

  updateChapter() {
    this.updateChapterForm
      .get('editorId')
      ?.setValue(this.updateChapterForm.get('selectEditor')?.value);

    if (this.updateChapterForm.get('editorId')?.value !== '') {
      this.pireditservice
        .updateChapter(this.updateChapterForm.value)
        .subscribe({
          next: (ress) => {
            this.userservice
              .addRoleToUser(
                this.updateChapterForm.get('selectEditor')?.value,
                Roles[4],
                this.selectedGroupId
              )
              .subscribe({
                next: (resss) => {},
              });
            this.retrieveChapters();
          },
        });
    } else console.log('null editor id');
  }

  //for PC browser
  selectTextToManipulate() {
    const selection: any = window.getSelection();
    this.selectedWord = selection.toString();
  }

  //for mobile device browser
  captureSelectedText(event: Event) {
    this.zone.run(() => {
      const selection = document.getSelection();

      if (selection && selection.rangeCount > 0) {
        const selectedWord = selection.toString().trim();

        if (selectedWord) {
          this.selectedWord = selectedWord;
        } else {
          console.log('No text selected.');
        }
      } else {
        console.log('Error getting selection.');
      }
    });
  }

  saveWordPair(meaning: string) {
    const wordPairId = Date.now().toString(); // just to generate id
    const wordPair = new WordPair(
      wordPairId,
      this.selectedWord,
      meaning,
      this.updateChapterForm.get('chapterId')?.value,
      this.updateChapterForm.get('pirId')?.value,
      this.uid
    );

    //creating wordpair
    this.pireditservice.createWordPair(wordPair).subscribe({
      next: (ress) => {
        this.updateChapter(); // to save (as updated) the word that be made bold
      },
      complete: () => {
        this.createAddWordPairForm(); // to clear the form
        this.retrieveChapters();
        this.wordpaireditComponent.retrieveAllWordPairsOfSinglePir();
        this.getChapterByChapterId();
      },
    });
  }

  roleControll(groupId: any, userId: any) {
    this.roleservice.getUserRolesInTheGroup(groupId, userId).subscribe({
      next: (roles) => {
        this.allowedToAdminAndMentor =
          roles.includes(Roles[1]) || roles.includes(Roles[2]);
        this.allowedToAdmin = roles.includes(Roles[1]);
      },
    });
  }

  getChapterByChapterId() {
    //to updated after saveing wordpair
    this.displayService
      .retrieveChapterByChapterId(
        this.selectedChapter.chapterId,
        this.selectedPirId
      )
      .subscribe({
        next: (chapter: Chapter) => {
          if (chapter.wordPairs !== undefined) {
            for (const wordpair of Object.values(chapter.wordPairs)) {
              this.selectedChapterContentToEdit =
                chapter.chapterContent.replace(
                  wordpair.word.trim(),
                  `<b>${wordpair.word.trim()}</b>`
                );
            }
          } else {
            this.selectedChapterContentToEdit = chapter.chapterContent;
          }
        },
      });
  }

  increaseFontSize() {
    this.fontSize += 1;
    this.lineHeight += 0.03;
    localStorage.setItem('fontSize', this.fontSize.toString());
    localStorage.setItem('lineHeight', this.lineHeight.toString());
  }

  decreaseFontSize() {
    if (this.fontSize > 1) {
      this.fontSize -= 1;
      localStorage.setItem('fontSize', this.fontSize.toString());
    }
    if (this.lineHeight > 1) {
      this.lineHeight -= 0.03;
      localStorage.setItem('lineHeight', this.lineHeight.toString());
    }
  }

  initialFontSetting() {
    const fontSizeString = localStorage.getItem('fontSize');
    const lineHeightString = localStorage.getItem('lineHeight');

    this.fontSize = fontSizeString ? parseInt(fontSizeString, 10) : 20;
    this.lineHeight = lineHeightString ? parseFloat(lineHeightString) : 1.2;

    if (isNaN(this.fontSize) || this.fontSize < 1) {
      console.error('Invalid fontSize in localStorage');
      this.fontSize = 20;
    }

    if (isNaN(this.lineHeight) || this.lineHeight < 1) {
      console.error('Invalid lineHeight in localStorage');
      this.lineHeight = 1.2;
    }
  }

  readModeClass(): string {
    return this.isNightMode ? 'night-mode' : 'light-mode';
  }

  initialReadMode() {
    const readMode$ = localStorage.getItem('readMode');

    //if readMode$ null or undefined, it would be 'light-mode'
    localStorage.setItem('readMode', readMode$ ?? 'light-mode');
    this.isNightMode = readMode$ === 'night-mode';
  }

  changeReadMode() {
    this.isNightMode = !this.isNightMode;
    localStorage.setItem(
      'readMode',
      this.isNightMode ? 'night-mode' : 'light-mode'
    );
    this.readModeClass();
  }
}
