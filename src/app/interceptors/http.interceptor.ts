import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage

    // Clone the request and add the Authorization header with the token
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Use the token or an empty string if not found
      },
    });

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized error (401)
          this.handleUnauthorized();
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorized() {
    // Clear local storage or perform logout actions
    localStorage.clear();
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }
}

export { HttpInterceptor };
