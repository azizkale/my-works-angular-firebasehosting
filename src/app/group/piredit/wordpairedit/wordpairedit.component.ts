import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PireditService } from 'src/app/services/piredit.service';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';
import { Roles } from 'src/models/Roles';
import { WordPair } from 'src/models/WordPair';
import { WordpairService } from '../../../services/wordpair.service';

@Component({
  selector: 'wordpairedit',
  templateUrl: './wordpairedit.component.html',
  styleUrls: ['./wordpairedit.component.css'],
})
export class WordpaireditComponent implements OnInit {
  // this component is displayed by directive --> <wordpairedit></wordpairedit>
  @Input() pirId: any;
  @Input() listwordpairs: WordPair[] | any;
  wordPairs: any[] = [];
  retrieveWordPairs: FormGroup;
  editWordPairForm: FormGroup;
  selectedWordPairToEdit: WordPair;
  uid = localStorage.getItem('uid');
  allowAllWordPairsToMentor: boolean;
  selectedGroupId: any;

  constructor(
    public fb: FormBuilder,
    private pireditservice: PireditService,
    private userservice: UserService,
    private roleservice: RolesService,
    private wordPairService: WordpairService
  ) {
    this.selectedGroupId = localStorage.getItem('groupId');
  }

  ngOnInit(): void {
    // this.retrieveAllWordPairsOfSinglePir();
    this.retrieveWordPairEditForm();
    this.createEditWordPairForm();
    this.roleControll(this.selectedGroupId, this.uid);
  }

  retrieveWordPairEditForm() {
    this.retrieveWordPairs = this.fb.group({
      word: ['', Validators.required],
      meaning: ['', Validators.required],
    });
  }

  createEditWordPairForm() {
    this.editWordPairForm = this.fb.group({
      word: ['', Validators.required],
      meaning: ['', Validators.required],
      editorId: ['', Validators.required],
    });
  }

  getWordPairToEdit(selectedWordPair: WordPair) {
    this.selectedWordPairToEdit = selectedWordPair;
    this.editWordPairForm.patchValue({
      word: selectedWordPair.word,
      meaning: selectedWordPair.meaning,
      editorId: selectedWordPair.editorId,
    });
  }

  updateWordPair() {
    this.selectedWordPairToEdit.word = this.editWordPairForm.get('word')?.value;
    this.selectedWordPairToEdit.meaning =
      this.editWordPairForm.get('meaning')?.value;
    this.pireditservice.updateWordPair(this.selectedWordPairToEdit).subscribe({
      next: (ress) => {},
    });
  }

  async deleteWordpair() {
    //deleting word from db
    this.pireditservice.deleteWordPair(this.selectedWordPairToEdit).subscribe({
      next: (ress) => {},
    });
  }

  roleControll(groupId: any, userId: any) {
    this.roleservice.getUserRolesInTheGroup(groupId, userId).subscribe({
      next: (roles) => {
        this.allowAllWordPairsToMentor = roles.includes(Roles[2]);
      },
    });
  }
}
