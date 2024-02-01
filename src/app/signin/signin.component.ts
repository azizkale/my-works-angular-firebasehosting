import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AlertsService } from '../services/alerts.service';
import { from, map, of, tap } from 'rxjs';

@Component({
  selector: 'signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  @ViewChild('alertParent', { static: true }) alertParent: ElementRef

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private authservice: AuthenticationService,
    private alertservice: AlertsService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.signInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signin(email: string, password: any) {
    this.authservice.signin(email, password)
      .subscribe({
        next: async (response) => {

          if (response.status === 200) {
            from(
              (async () => {
                await localStorage.setItem('token', response.token);
                await localStorage.setItem('displayName', response.displayName);
                await localStorage.setItem('uid', response.uid);
                await localStorage.setItem('photoURL', response.photoURL);
                await localStorage.setItem('roles', JSON.stringify(response.roles));

                return true;
              })()
            ).pipe(
              tap(isSuccess => {
                if (isSuccess) {
                  this.router.navigate(['me']);
                }
              })
            ).subscribe(
              error => {
                this.alertservice.alert(`Error processing response!`, 'alert-danger', this.alertParent.nativeElement);
              }
            );
          }


          if (response.status === 404) {
            this.alertservice.alert(`Email or password incorrect!`, 'alert-danger', this.alertParent.nativeElement);
          }
        },
        error: (err) => {
          this.alertservice.alert(`Email or password incorrect!`, 'alert-danger', this.alertParent.nativeElement);
        },
        complete: () => {
        }
      });
  }

}