import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DisplaypirService } from 'src/app/services/displaypir.service';
import { Pir } from 'src/models/Pir';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.css']
})
export class ChaptersComponent implements OnInit {
  retrieveChaptersNamesForm: FormGroup
  selectedPirId: any;
  pir: Pir
  chaptersNames: any[]

  constructor(
    public fb: FormBuilder,
    private activeroute: ActivatedRoute,
    private displaypirservice: DisplaypirService
  ) {
    this.formChaptersNames();
  }

  async ngOnInit() {
    this.selectedPirId = await this.activeroute.snapshot.paramMap.get('id');

    await this.retrieveChaptersNamesByPirId();
  }

  formChaptersNames() {
    this.retrieveChaptersNamesForm = this.fb.group({
      chapterName: this.fb.array([])
    });
    //formname array is fullfilled in the retrievePirs function (below)
  }



  async retrieveChaptersNamesByPirId() {
    await this.displaypirservice.retrieveChaptersNamesByPirId(this.selectedPirId).subscribe({
      next: async (data) => {
        this.chaptersNames = data
        this.chaptersNames.forEach((chapter) => {
          this.retrieveChaptersNamesForm.addControl(chapter.chapterName, new FormControl(chapter.chapterName));
        });
      }
    })
  }
}
