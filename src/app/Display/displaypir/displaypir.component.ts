import { Component, OnInit } from '@angular/core';
import { DisplaypirService } from 'src/app/services/displaypir.service';
import { Pir } from 'src/models/Pir';

@Component({
  selector: 'app-displaypir',
  templateUrl: './displaypir.component.html',
  styleUrls: ['./displaypir.component.css']
})
export class DisplaypirComponent implements OnInit {
  pirs: Pir[] = [];

  constructor(
    private displaypirservice: DisplaypirService
  ) { }

  ngOnInit(): void {
    this.retrievePirsNames()
  }

  retrievePirsNames() {
    this.pirs = []
    this.displaypirservice.retrievePirsNames().subscribe({
      next: async (ress) => {
        if (ress) {
          await Object.values(ress).map((pir: Pir | any) => {
            this.pirs.push(pir)
          })
          await this.pirs.sort((a, b) => a.name?.localeCompare(b.name));
        }
      }
    })
  }
}
