import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PireditService } from 'src/app/services/piredit.service';
import { UserService } from 'src/app/services/user.service';
import { Chapter } from 'src/models/Chapter';
import { Roles } from 'src/models/Roles';
import { WordPair } from 'src/models/WordPair';
import { WordpaireditComponent } from '../wordpairedit/wordpairedit.component';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-chapteredit',
  templateUrl: './chapteredit.component.html',
  styleUrls: ['./chapteredit.component.css'],
})
export class ChaptereditComponent implements OnInit {
  @ViewChild(WordpaireditComponent)
  private wordpaireditComponent: WordpaireditComponent;

  @ViewChild('chapterContent') chapterContent: ElementRef;

  retrieveChapterForm: FormGroup;
  createChapterForm: FormGroup;
  updateChapterForm: FormGroup;
  addWordForm: FormGroup;
  chapters: Chapter[];
  allowedToAdminAndMentor: boolean;
  uid = localStorage.getItem('uid');

  selectedPirId: any;
  selectedGroupId: any // to get users of this group
  selectedWord: any; // to edit word on chapter update form
  users_createchapter: any[] = [] // fullfilling the select tag on FormGroup
  users_updateform: any[] = [] // fullfilling the select tag on FormGroup

  constructor(
    public fb: FormBuilder,
    private pireditservice: PireditService,
    private activeroute: ActivatedRoute,
    public userservice: UserService,
    public roleservice: RolesService,
  ) {

  }

  ngOnInit(): void {
    this.selectedPirId = this.activeroute.snapshot.paramMap.get('pirid');
    this.selectedGroupId = this.activeroute.snapshot.paramMap.get('groupid');
    this.retrieveChapters();
    this.createChapterRetrieveForm()
    this.createNewChapterForm();
    this.createUpdateChapterForm();
    this.createAddWordPairForm();

    this.roleControll(this.selectedGroupId, this.uid)
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
      selectEditor: ['', Validators.required]
    });

    // fullfilling the select tag on FormGroup
    this.users_createchapter = []
    this.userservice.retrieveAllUsersOfTheGroup(this.selectedGroupId).subscribe({
      next: (ress: any) => {
        ress.forEach((user: any) => {
          this.users_createchapter.push(user)
          this.createChapterForm.addControl(ress.uid, new FormControl(user.uid));
        });
        console.log(this.users_createchapter)
      }
    })
  }

  createAddWordPairForm() {
    this.addWordForm = this.fb.group({
      word: ['', Validators.required],
      meaning: ['', Validators.required]
    });
  }

  createUpdateChapterForm() {
    this.updateChapterForm = this.fb.group({
      chapterId: ['', Validators.required],
      chapterName: ['', Validators.required],
      chapterContent: ['', Validators.required],
      selectEditor: ['', Validators.required]
    });

    // fullfilling the select tag on FormGroup
    this.users_updateform = []
    this.userservice.retrieveAllUsersOfTheGroup(this.selectedGroupId).subscribe({
      next: (ress: any) => {
        ress.forEach((user: any) => {
          this.users_updateform.push(user)
          this.createChapterForm.addControl(ress.uid, new FormControl(user.uid));
        });
      }
    })
  }

  retrieveChapters() {
    const editorId = this.uid;
    this.roleservice.getUserRolesInTheGroup(this.selectedGroupId, editorId).subscribe({
      next: (roles) => {
        //if the user the editor, all chapter comes
        if (roles?.includes(Roles[2])) {
          this.pireditservice.retrieveAllChapters(this.selectedPirId).subscribe({
            next: (ress) => {
              if (ress !== undefined && ress !== null) {
                this.chapters = Object.values(ress);
                this.chapters.forEach((chapter, index) => {
                  this.retrieveChapterForm.addControl(chapter.chapterName, new FormControl(chapter.chapterName));
                });
              }
            }
          })
        }
        else {
          this.pireditservice.retrieveChaptersByEditorId(this.uid, this.selectedPirId).subscribe({
            next: (ress) => {
              if (ress !== undefined && ress !== null) {
                this.chapters = Object.values(ress);
                this.chapters.forEach((chapter, index) => {
                  this.retrieveChapterForm.addControl(chapter.chapterName, new FormControl(chapter.chapterName));
                });
              }
            }
          })
        }
      }
    })
  }

  addChapter(chapterName: string, chapterContent: string) {
    const editorId = this.createChapterForm.get('selectEditor')?.value;

    //chapterId will be given in server-side
    const chapter = new Chapter(chapterName, chapterContent, null, editorId, this.selectedPirId, new Date(), [])
    this.pireditservice.addChapter(chapter).subscribe({
      next: (ress) => {
        console.log(ress)
      },
      complete: () => {
        this.retrieveChapters();
      }
    })
  }

  deleteChapter() {
    this.pireditservice.deleteChapter(this.selectedPirId, this.updateChapterForm.get('chapterId')?.value).subscribe({
      next: (ress) => {
        this.retrieveChapters()
        this.createChapterRetrieveForm()
      }
    })
  }

  selectChapter(chapter: Chapter) {
    //modifies the chapter content adding <b> tag to wordpairs
    for (const wordpair of Object.values(chapter.wordPairs)) {

      chapter.chapterContent = chapter.chapterContent.replace(
        wordpair.word.trim(),
        `<b>${wordpair.word.trim()}</b>`);
      this.chapterContent.nativeElement.innerHTML = chapter.chapterContent
    }

    this.updateChapterForm = this.fb.group({
      chapterId: [chapter.chapterId],
      chapterName: [chapter.chapterName, Validators.required],
      chapterContent: [chapter.chapterContent, Validators.required],
      pirId: [chapter.pirId, Validators.required],
      editorId: [chapter.editorId, Validators.required],
      createDate: [chapter.createDate, Validators.required],
      selectEditor: [chapter.editorId]
    });


  }

  updateChapter() {
    this.updateChapterForm.get('editorId')?.setValue(this.updateChapterForm.get('selectEditor')?.value)

    if (this.updateChapterForm.get('editorId')?.value !== '') {
      this.pireditservice.updateChapter(this.updateChapterForm.value).subscribe({
        next: (ress) => {
          this.userservice.addRoleToUser(this.updateChapterForm.get('selectEditor')?.value, Roles[4], this.selectedGroupId).subscribe({
            next: (resss) => {
            }
          })
          this.retrieveChapters()
        }
      })
    } else console.log('null editor id')

  }

  selectTextToManipulate() {
    const selection: any = window.getSelection();
    this.selectedWord = selection.toString();
  }

  saveWordPair(meaning: string) {
    const wordPairId = Date.now().toString();// just to generate id
    const wordPair = new WordPair(
      wordPairId,
      this.selectedWord,
      meaning,
      this.updateChapterForm.get('chapterId')?.value,
      this.updateChapterForm.get('pirId')?.value,
      this.uid)

    //creating wordpair
    this.pireditservice.createWordPair(wordPair).subscribe({
      next: (ress) => {
        this.updateChapter(); // to save (as updated) the word that be made bold
      }, complete: () => {
        this.createAddWordPairForm();// to clear the form
        this.retrieveChapters();
        this.wordpaireditComponent.retrieveAllWordPairsOfSinglePir()
      }
    })

  }

  roleControll(groupId: any, userId: any) {
    this.roleservice.getUserRolesInTheGroup(groupId, userId).subscribe({
      next: (roles) => {
        this.allowedToAdminAndMentor = roles.includes(Roles[1]) || roles.includes(Roles[2])
      }
    })
  }
}