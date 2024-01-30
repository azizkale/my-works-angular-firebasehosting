import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { PireditService } from 'src/app/services/piredit.service';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';
import { Roles } from 'src/models/Roles';
import { WordPair } from 'src/models/WordPair';

@Component({
  selector: 'wordpairedit',
  templateUrl: './wordpairedit.component.html',
  styleUrls: ['./wordpairedit.component.css']
})

export class WordpaireditComponent implements OnInit {
  // this component is displayed by directive --> <wordpairedit></wordpairedit> 
  @Input() pirId: any
  wordPairs: any[] = []
  retrieveWordPairs: FormGroup
  editWordPairForm: FormGroup;
  selectedWordPairToEdit: WordPair
  uid = localStorage.getItem('uid')
  allowAllWordPairsToMentor: boolean;
  selectedGroupId: any;

  constructor(
    public fb: FormBuilder,
    private pireditservice: PireditService,
    private userservice: UserService,
    private roleservice: RolesService,
    private groupservice: GroupService,
  ) {
    this.selectedGroupId = localStorage.getItem('groupId');
  }

  ngOnInit(): void {
    this.retrieveAllWordPairsOfSinglePir()
    this.retrieveWordPairEditForm()
    this.createEditWordPairForm();
    this.roleControll(this.selectedGroupId, this.uid)

  }

  retrieveWordPairEditForm() {
    this.retrieveWordPairs = this.fb.group({
      word: ['', Validators.required],
      meaning: ['', Validators.required]
    });
  }

  createEditWordPairForm() {
    this.editWordPairForm = this.fb.group({
      word: ['', Validators.required],
      meaning: ['', Validators.required],
      editorId: ['', Validators.required]
    });
  }

  retrieveAllWordPairsOfSinglePir() {
    this.wordPairs = []
    this.pireditservice.retrieveAllWordPairsOfSinglePir(this.pirId).subscribe({
      next: async (wordpairs: WordPair[]) => {
        //role controle
        await this.roleservice.getUserRolesInTheGroup(this.selectedGroupId, this.uid).subscribe({
          next: async (roles) => {
            //if the user is not the mentor, he can see just his wordpairs
            if (!roles.includes(Roles[2])) {
              this.wordPairs = wordpairs.filter((wp: WordPair) => wp.editorId === this.uid)// Array of wordPairs
            }
            else {  //if he is mentor, he can see all wordpairs
              this.wordPairs = wordpairs;
            }
            await this.wordPairs.map(async (wp: any) => {
              this.userservice.retrieveEditorbyEditorId(wp.editorId).subscribe({
                next: (val: any) => { wp.editorname = val.displayName }
              })
            })
          }
        })

      }
    })
  }

  getWordPairToEdit(selectedWordPair: WordPair) {
    this.selectedWordPairToEdit = selectedWordPair;
    this.editWordPairForm.patchValue({
      word: selectedWordPair.word,
      meaning: selectedWordPair.meaning,
      editorId: selectedWordPair.editorId
    });
  }

  updateWordPair() {
    this.selectedWordPairToEdit.word = this.editWordPairForm.get('word')?.value;
    this.selectedWordPairToEdit.meaning = this.editWordPairForm.get('meaning')?.value;
    this.pireditservice.updateWordPair(this.selectedWordPairToEdit).subscribe({
      next: (ress) => {
        this.retrieveAllWordPairsOfSinglePir()
      }
    })
  }

  async deleteWordpair() {
    //deleting word from db   
    this.pireditservice.deleteWordPair(this.selectedWordPairToEdit).subscribe({
      next: (ress) => {
        this.retrieveAllWordPairsOfSinglePir()
      }
    })
  }

  roleControll(groupId: any, userId: any) {
    this.roleservice.getUserRolesInTheGroup(groupId, userId).subscribe({
      next: (roles) => {
        this.allowAllWordPairsToMentor = roles.includes(Roles[2])
      }
    })
  }
}
