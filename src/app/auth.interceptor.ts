import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token: any = localStorage.getItem('token');

    // URL'deki 'http' protokolünü 'https' ile değiştirme
    let secureUrl = request.url;
    if (secureUrl.startsWith('http://')) {
      secureUrl = secureUrl.replace('http://', 'https://');
    }

    const modifiedRequest = request.clone({
      url: secureUrl, // Güncellenmiş URL
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });

    if (
      request.url.includes('/signin') ||
      request.url.includes('/display/retrievepirs') ||
      request.url.includes('/display/retrievechaptersbypirid')
    ) {
      return next.handle(modifiedRequest);
    } else {
      return next.handle(modifiedRequest).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.authService.signOut();
            // Redirect to the sign-in page or any other logic you want
            window.location.href = '/signin';
          }
          if (!token) {
            this.authService.signOut();
          }
          return throwError(error);
        })
      );
    }
  }
}
