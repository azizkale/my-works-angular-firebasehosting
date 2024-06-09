import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private refreshTokenInProgress = false;
  private accessTokenSubject: BehaviorSubject<string> =
    new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signin(email: string, password: any): Observable<any> {
    const body = { email: email, password: password };
    return this.http.post(environment.url + '/signin', body);
  }

  register(email: string, password: any): Observable<any> {
    const body = { email: email, password: password };
    return this.http.post(environment.url + '/users/createuser', body);
  }

  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('displayName');
    localStorage.removeItem('uid');
    localStorage.removeItem('photoURL');
    localStorage.removeItem('roles');
    this.router.navigate(['signin']);
  }

  getToken(): any {
    return localStorage.getItem('token');
  }

  refreshToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return this.accessTokenSubject.asObservable();
    } else {
      this.refreshTokenInProgress = true;

      return this.http
        .post<{ accessToken: string }>(environment.url + '/refreshToken', {
          refreshToken: localStorage.getItem('refreshToken'),
        })
        .pipe(
          tap((response: any) => {
            this.refreshTokenInProgress = false;
            this.accessTokenSubject.next(response.accessToken);
            localStorage.setItem('token', response?.accessToken);
            localStorage.setItem('refreshToken', response?.refreshToken);
          }),
          catchError((error) => {
            this.refreshTokenInProgress = false;
            return throwError(error);
          })
        );
    }
  }
}
