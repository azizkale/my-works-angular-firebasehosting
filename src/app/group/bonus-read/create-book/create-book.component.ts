import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PireditService } from 'src/app/services/piredit.service';
import { Pir } from 'src/models/Pir';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css'],
})
export class CreateBookComponent implements OnInit {
  formCreateNewPir: FormGroup;
  constructor(public fb: FormBuilder, public pirEditService: PireditService) {}

  ngOnInit(): void {
    this.createNewPirForm();
  }

  createNewPir() {
    const newPir = new Pir(
      null,
      localStorage.getItem('uid'),
      null,
      this.formCreateNewPir.get('pirName')?.value,
      this.formCreateNewPir.get('description')?.value,
      [],
      [],
      this.formCreateNewPir.get('imageUrl')?.value,
      this.formCreateNewPir.get('allowed')?.value
    );
    this.pirEditService.createPir(newPir).subscribe({
      next: (ress) => {},
    });
  }

  createNewPirForm() {
    this.formCreateNewPir = this.fb.group({
      pirName: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      allowed: [new FormControl(false), Validators.required],
    });
  }
}
